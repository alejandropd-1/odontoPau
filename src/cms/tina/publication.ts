export const PUBLICATION_REQUEST_PATH = 'src/data/editorial/publication-request.json';
export const PUBLICATION_REQUEST_RELATIVE_PATH = 'publication-request.json';

export const publicationRequestStatuses = [
  'idle',
  'pending',
  'processing',
  'deploying',
  'published',
  'failed',
  'waiting_index',
] as const;

export type PublicationRequestStatus = (typeof publicationRequestStatuses)[number];

export const publicationIssueKinds = [
  'content',
  'snapshot_changed',
  'checks_failed',
  'merge_failed',
  'deploy_not_confirmed',
  'technical',
] as const;

export type PublicationIssueKind = (typeof publicationIssueKinds)[number];

export const editorialProductionCollections = ['articulo', 'instruccion'] as const;
export type EditorialProductionCollection = (typeof editorialProductionCollections)[number];

export const editorialPublicStates = ['published', 'retired', 'unpublished'] as const;
export type EditorialPublicState = (typeof editorialPublicStates)[number];

export interface EditorialProductionEntry {
  collection: EditorialProductionCollection;
  relativePath: string;
  fingerprint: string;
  publicState: EditorialPublicState;
}

export interface PublicationRequest {
  type: 'EditorialPublicationRequest';
  status: PublicationRequestStatus;
  requestId?: string;
  requestedAt?: string;
  lastProcessedRequestId?: string;
  processedAt?: string;
  productionCommit?: string;
  summary?: string;
  issueKind?: PublicationIssueKind;
  productionIndex?: EditorialProductionEntry[];
}

const activeStatuses = new Set<PublicationRequestStatus>(['pending', 'processing', 'deploying', 'waiting_index']);
const isoUtcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const requestIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{7,127}$/;
const commitPattern = /^[0-9a-f]{7,40}$/;
const fingerprintPattern = /^[0-9a-f]{16}$/;
const relativeEditorialPathPattern = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$)).+\.json$/;
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
  if (
    request.issueKind !== undefined &&
    (typeof request.issueKind !== 'string' || !publicationIssueKinds.includes(request.issueKind as PublicationIssueKind))
  ) {
    throw new Error(`Solicitud editorial inválida en ${source}: issueKind no es válido.`);
  }
  if (request.productionIndex !== undefined) {
    if (!Array.isArray(request.productionIndex) || request.productionIndex.length > 500) {
      throw new Error(`Solicitud editorial inválida en ${source}: productionIndex no es válido.`);
    }

    const identities = new Set<string>();
    for (const [index, rawEntry] of request.productionIndex.entries()) {
      if (!rawEntry || typeof rawEntry !== 'object' || Array.isArray(rawEntry)) {
        throw new Error(`Solicitud editorial inválida en ${source}: productionIndex[${index}] no es válido.`);
      }
      const entry = rawEntry as Record<string, unknown>;
      if (!editorialProductionCollections.includes(entry.collection as EditorialProductionCollection)) {
        throw new Error(`Solicitud editorial inválida en ${source}: productionIndex[${index}].collection no es válido.`);
      }
      if (typeof entry.relativePath !== 'string' || !relativeEditorialPathPattern.test(entry.relativePath)) {
        throw new Error(`Solicitud editorial inválida en ${source}: productionIndex[${index}].relativePath no es válido.`);
      }
      if (typeof entry.fingerprint !== 'string' || !fingerprintPattern.test(entry.fingerprint)) {
        throw new Error(`Solicitud editorial inválida en ${source}: productionIndex[${index}].fingerprint no es válido.`);
      }
      if (!editorialPublicStates.includes(entry.publicState as EditorialPublicState)) {
        throw new Error(`Solicitud editorial inválida en ${source}: productionIndex[${index}].publicState no es válido.`);
      }

      const identity = `${entry.collection}:${entry.relativePath}`;
      if (identities.has(identity)) {
        throw new Error(`Solicitud editorial inválida en ${source}: productionIndex repite ${identity}.`);
      }
      identities.add(identity);
    }
  }

  const status = request.status as PublicationRequestStatus;
  if (status !== 'idle' && (!request.requestId || !request.requestedAt)) {
    throw new Error(`Solicitud editorial inválida en ${source}: el estado ${status} requiere requestId y requestedAt.`);
  }
  if (status === 'pending' && request.requestId === request.lastProcessedRequestId) {
    throw new Error(`Solicitud editorial inválida en ${source}: el request pendiente ya fue procesado.`);
  }
  if (status === 'deploying' && !request.productionCommit) {
    throw new Error(`Solicitud editorial inválida en ${source}: deploying requiere productionCommit.`);
  }
  if (status === 'waiting_index' && request.issueKind !== 'deploy_not_confirmed') {
    throw new Error(`Solicitud editorial inválida en ${source}: waiting_index requiere deploy_not_confirmed.`);
  }
  if (status === 'failed' && !request.issueKind) {
    throw new Error(`Solicitud editorial inválida en ${source}: failed requiere issueKind.`);
  }
  if (!['failed', 'waiting_index'].includes(status) && request.issueKind !== undefined) {
    throw new Error(`Solicitud editorial inválida en ${source}: ${status} no admite issueKind.`);
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
    'issueKind',
    'productionIndex',
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
    productionIndex: current.productionIndex,
    summary: 'Recibimos tu pedido. Tus cambios siguen sólo en Preview mientras hacemos los controles.',
  };
  validatePublicationRequest(next);
  return next;
}

export function createPublicationResult(
  currentValue: unknown,
  status: 'published' | 'failed',
  processedAt: string,
  options: {
    productionCommit?: string;
    productionIndex?: EditorialProductionEntry[];
    summary: string;
    issueKind?: PublicationIssueKind;
  }
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
    productionCommit: status === 'published' ? options.productionCommit : current.productionCommit,
    productionIndex: status === 'published' ? options.productionIndex : current.productionIndex,
    summary: options.summary,
    issueKind: status === 'failed' ? options.issueKind ?? 'technical' : undefined,
  };
  validatePublicationRequest(next);
  return next;
}

export function createPublicationProgress(
  currentValue: unknown,
  status: 'processing' | 'deploying' | 'waiting_index',
  options: { productionCommit?: string; summary: string; issueKind?: PublicationIssueKind }
): PublicationRequest {
  const current = normalizePublicationRequest(currentValue);
  if (!current.requestId || !current.requestedAt) {
    throw new Error('No existe un pedido identificable para actualizar su progreso.');
  }

  const next: PublicationRequest = {
    ...current,
    status,
    productionCommit: options.productionCommit,
    summary: options.summary,
    issueKind: status === 'waiting_index' ? options.issueKind ?? 'deploy_not_confirmed' : undefined,
  };
  validatePublicationRequest(next);
  return next;
}
