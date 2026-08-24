export const PUBLICATION_REQUEST_PATH = 'src/data/editorial/publication-request.json';
export const PUBLICATION_REQUEST_RELATIVE_PATH = 'publication-request.json';

export const publicationRequestStatuses = [
  'idle',
  'pending',
  'processing',
  'published',
  'failed',
  'waiting_index',
] as const;

export type PublicationRequestStatus = (typeof publicationRequestStatuses)[number];

export interface PublicationRequest {
  type: 'EditorialPublicationRequest';
  status: PublicationRequestStatus;
  requestId?: string;
  requestedAt?: string;
  lastProcessedRequestId?: string;
  processedAt?: string;
  productionCommit?: string;
  summary?: string;
}

const activeStatuses = new Set<PublicationRequestStatus>(['pending', 'processing', 'waiting_index']);
const isoUtcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const requestIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{7,127}$/;
const commitPattern = /^[0-9a-f]{7,40}$/;
const editorialAllowedPathPatterns = [
  /^src\/data\/home\.json$/,
  /^src\/data\/tratamientos-(?:index|page)\.json$/,
  /^src\/data\/(?:articulos|instrucciones|tratamientos)\/.+\.json$/,
  /^src\/data\/editorial\/publication-request\.json$/,
  /^public\/(?:images|videos)\/.+$/,
];

export function isActivePublicationRequest(status: PublicationRequestStatus): boolean {
  return activeStatuses.has(status);
}

export function isEditorialAllowedPath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  return editorialAllowedPathPatterns.some((pattern) => pattern.test(normalized));
}

export function classifyEditorialPaths(filePaths: string[]): {
  kind: 'editorial-routine' | 'structural-change';
  blockedPaths: string[];
} {
  const blockedPaths = filePaths.filter((filePath) => !isEditorialAllowedPath(filePath));
  return {
    kind: blockedPaths.length === 0 ? 'editorial-routine' : 'structural-change',
    blockedPaths,
  };
}

export function validatePublicationRequest(
  value: unknown,
  source = PUBLICATION_REQUEST_PATH
): asserts value is PublicationRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Solicitud editorial inválida en ${source}: se esperaba un objeto.`);
  }

  const request = value as Record<string, unknown>;
  if (request.type !== 'EditorialPublicationRequest') {
    throw new Error(`Solicitud editorial inválida en ${source}: type desconocido.`);
  }
  if (!publicationRequestStatuses.includes(request.status as PublicationRequestStatus)) {
    throw new Error(`Solicitud editorial inválida en ${source}: status desconocido.`);
  }

  for (const field of ['requestId', 'lastProcessedRequestId'] as const) {
    const fieldValue = request[field];
    if (fieldValue !== undefined && (typeof fieldValue !== 'string' || !requestIdPattern.test(fieldValue))) {
      throw new Error(`Solicitud editorial inválida en ${source}: ${field} no es válido.`);
    }
  }

  for (const field of ['requestedAt', 'processedAt'] as const) {
    const fieldValue = request[field];
    if (fieldValue !== undefined && (typeof fieldValue !== 'string' || !isoUtcPattern.test(fieldValue))) {
      throw new Error(`Solicitud editorial inválida en ${source}: ${field} debe ser una fecha ISO UTC.`);
    }
  }

  if (
    request.productionCommit !== undefined &&
    (typeof request.productionCommit !== 'string' || !commitPattern.test(request.productionCommit))
  ) {
    throw new Error(`Solicitud editorial inválida en ${source}: productionCommit no es válido.`);
  }
  if (request.summary !== undefined && (typeof request.summary !== 'string' || request.summary.length > 280)) {
    throw new Error(`Solicitud editorial inválida en ${source}: summary supera el límite permitido.`);
  }

  const status = request.status as PublicationRequestStatus;
  if (status !== 'idle' && (!request.requestId || !request.requestedAt)) {
    throw new Error(`Solicitud editorial inválida en ${source}: el estado ${status} requiere requestId y requestedAt.`);
  }
  if (status === 'pending' && request.requestId === request.lastProcessedRequestId) {
    throw new Error(`Solicitud editorial inválida en ${source}: el request pendiente ya fue procesado.`);
  }
  if (
    ['published', 'failed'].includes(status) &&
    (!request.processedAt || request.requestId !== request.lastProcessedRequestId)
  ) {
    throw new Error(`Solicitud editorial inválida en ${source}: el resultado no identifica el request procesado.`);
  }
}

export function normalizePublicationRequest(value: unknown): PublicationRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    validatePublicationRequest(value);
  }

  const normalized = { ...(value as Record<string, unknown>) };
  for (const field of [
    'requestId',
    'requestedAt',
    'lastProcessedRequestId',
    'processedAt',
    'productionCommit',
    'summary',
  ] as const) {
    if (normalized[field] === null) delete normalized[field];
  }

  validatePublicationRequest(normalized);
  return normalized;
}

export function createPendingPublicationRequest(
  currentValue: unknown,
  requestId: string,
  requestedAt: string
): PublicationRequest {
  const current = normalizePublicationRequest(currentValue);
  if (isActivePublicationRequest(current.status)) {
    throw new Error('Ya hay una publicación pendiente o en proceso. Esperá su resultado antes de volver a publicar.');
  }

  const next: PublicationRequest = {
    type: 'EditorialPublicationRequest',
    status: 'pending',
    requestId,
    requestedAt,
    lastProcessedRequestId: current.lastProcessedRequestId,
    processedAt: current.processedAt,
    productionCommit: current.productionCommit,
    summary: 'Solicitud enviada. Producción todavía no cambió.',
  };
  validatePublicationRequest(next);
  return next;
}

export function createPublicationResult(
  currentValue: unknown,
  status: 'published' | 'failed',
  processedAt: string,
  options: { productionCommit?: string; summary: string }
): PublicationRequest {
  const current = normalizePublicationRequest(currentValue);
  if (!current.requestId || !current.requestedAt) {
    throw new Error('No existe un request identificable para registrar el resultado.');
  }

  const next: PublicationRequest = {
    ...current,
    status,
    lastProcessedRequestId: current.requestId,
    processedAt,
    productionCommit: options.productionCommit,
    summary: options.summary,
  };
  validatePublicationRequest(next);
  return next;
}
