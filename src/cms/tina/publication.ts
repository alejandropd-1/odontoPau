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

export const publicationHistoryResults = ['published', 'failed'] as const;
export type PublicationHistoryResult = (typeof publicationHistoryResults)[number];

export interface PublicationHistoryEntry {
  requestId: string;
  requestedAt: string;
  processedAt: string;
  result: PublicationHistoryResult;
  issueKind?: PublicationIssueKind;
  productionCommit?: string;
}

export interface PublicationHistoryReadResult {
  entries: PublicationHistoryEntry[];
  invalidEntries: number;
  available: boolean;
}

export interface PublicationHistorySummary {
  lastPublishedAt?: string;
  publishedCount: number;
  failedCount: number;
}

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
  history?: PublicationHistoryEntry[];
}

const activeStatuses = new Set<PublicationRequestStatus>(['pending', 'processing', 'deploying', 'waiting_index']);
const isoUtcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const requestIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{7,127}$/;
const commitPattern = /^[0-9a-f]{7,40}$/;
const fingerprintPattern = /^[0-9a-f]{16}$/;
const relativeEditorialPathPattern = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$)).+\.json$/;
const publicationHistoryEntryFields = new Set([
  'requestId',
  'requestedAt',
  'processedAt',
  'result',
  'issueKind',
  'productionCommit',
]);
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

function validatePublicationHistoryEntry(
  value: unknown,
  source: string
): asserts value is PublicationHistoryEntry {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Historial editorial inválido en ${source}: se esperaba un objeto.`);
  }

  const entry = value as Record<string, unknown>;
  const unexpectedFields = Object.keys(entry).filter((field) => !publicationHistoryEntryFields.has(field));
  if (unexpectedFields.length > 0) {
    throw new Error(`Historial editorial inválido en ${source}: campo inesperado ${unexpectedFields[0]}.`);
  }
  if (typeof entry.requestId !== 'string' || !requestIdPattern.test(entry.requestId)) {
    throw new Error(`Historial editorial inválido en ${source}: requestId no es válido.`);
  }
  for (const field of ['requestedAt', 'processedAt'] as const) {
    if (typeof entry[field] !== 'string' || !isoUtcPattern.test(entry[field] as string)) {
      throw new Error(`Historial editorial inválido en ${source}: ${field} debe ser una fecha ISO UTC.`);
    }
  }
  if (Date.parse(entry.processedAt as string) < Date.parse(entry.requestedAt as string)) {
    throw new Error(`Historial editorial inválido en ${source}: processedAt precede a requestedAt.`);
  }
  if (!publicationHistoryResults.includes(entry.result as PublicationHistoryResult)) {
    throw new Error(`Historial editorial inválido en ${source}: result no es válido.`);
  }
  if (
    entry.issueKind !== undefined &&
    (typeof entry.issueKind !== 'string' || !publicationIssueKinds.includes(entry.issueKind as PublicationIssueKind))
  ) {
    throw new Error(`Historial editorial inválido en ${source}: issueKind no es válido.`);
  }
  if (
    entry.productionCommit !== undefined &&
    (typeof entry.productionCommit !== 'string' || !commitPattern.test(entry.productionCommit))
  ) {
    throw new Error(`Historial editorial inválido en ${source}: productionCommit no es válido.`);
  }
  if (entry.result === 'failed' && !entry.issueKind) {
    throw new Error(`Historial editorial inválido en ${source}: failed requiere issueKind.`);
  }
  if (entry.result === 'published' && entry.issueKind !== undefined) {
    throw new Error(`Historial editorial inválido en ${source}: published no admite issueKind.`);
  }
  if (entry.result === 'failed' && entry.productionCommit !== undefined) {
    throw new Error(`Historial editorial inválido en ${source}: failed no admite productionCommit.`);
  }
}

export function readPublicationHistory(value: unknown): PublicationHistoryReadResult {
  if (value === undefined || value === null) {
    return { entries: [], invalidEntries: 0, available: true };
  }
  if (!Array.isArray(value)) {
    return { entries: [], invalidEntries: 1, available: false };
  }

  const entries: PublicationHistoryEntry[] = [];
  let invalidEntries = 0;
  for (const [index, rawEntry] of value.entries()) {
    try {
      validatePublicationHistoryEntry(rawEntry, `history[${index}]`);
      entries.push(rawEntry);
    } catch {
      invalidEntries += 1;
    }
  }
  return {
    entries: sortPublicationHistory(entries),
    invalidEntries,
    available: true,
  };
}

export function sortPublicationHistory(entries: PublicationHistoryEntry[]): PublicationHistoryEntry[] {
  return [...entries].sort((left, right) => Date.parse(right.processedAt) - Date.parse(left.processedAt));
}

export function appendPublicationHistory(
  entries: PublicationHistoryEntry[] | undefined,
  entry: PublicationHistoryEntry
): PublicationHistoryEntry[] {
  validatePublicationHistoryEntry(entry, 'nuevo movimiento');
  const current = entries ?? [];
  const existing = current.find((candidate) => candidate.requestId === entry.requestId);
  if (!existing) return [...current, entry];
  if (existing.result !== entry.result) {
    throw new Error(`El pedido ${entry.requestId} ya tiene un resultado final diferente.`);
  }
  return current;
}

export function derivePublicationHistorySummary(
  entries: PublicationHistoryEntry[]
): PublicationHistorySummary {
  const validEntries = readPublicationHistory(entries).entries;
  const lastPublished = validEntries.find((entry) => entry.result === 'published');
  return {
    lastPublishedAt: lastPublished?.processedAt,
    publishedCount: validEntries.filter((entry) => entry.result === 'published').length,
    failedCount: validEntries.filter((entry) => entry.result === 'failed').length,
  };
}

export function publicationHistoryDurationMs(entry: PublicationHistoryEntry): number | undefined {
  const duration = Date.parse(entry.processedAt) - Date.parse(entry.requestedAt);
  return Number.isFinite(duration) && duration >= 0 ? duration : undefined;
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
  if (request.history !== undefined) {
    if (!Array.isArray(request.history) || request.history.length > 1000) {
      throw new Error(`Solicitud editorial inválida en ${source}: history no es válido.`);
    }
    const requestIds = new Set<string>();
    for (const [index, entry] of request.history.entries()) {
      validatePublicationHistoryEntry(entry, `${source}: history[${index}]`);
      if (requestIds.has(entry.requestId)) {
        throw new Error(`Solicitud editorial inválida en ${source}: history repite ${entry.requestId}.`);
      }
      requestIds.add(entry.requestId);
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
    'history',
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
    history: current.history,
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

  const existingHistoryEntry = current.history?.find((entry) => entry.requestId === current.requestId);
  if (existingHistoryEntry) {
    if (existingHistoryEntry.result !== status) {
      throw new Error(`El pedido ${current.requestId} ya tiene un resultado final diferente.`);
    }
    return current;
  }

  const historyEntry: PublicationHistoryEntry = {
    requestId: current.requestId,
    requestedAt: current.requestedAt,
    processedAt,
    result: status,
    ...(status === 'failed' ? { issueKind: options.issueKind ?? 'technical' } : {}),
    ...(status === 'published' && options.productionCommit
      ? { productionCommit: options.productionCommit }
      : {}),
  };

  const next: PublicationRequest = {
    ...current,
    status,
    lastProcessedRequestId: current.requestId,
    processedAt,
    productionCommit: status === 'published' ? options.productionCommit : current.productionCommit,
    productionIndex: status === 'published' ? options.productionIndex : current.productionIndex,
    summary: options.summary,
    issueKind: status === 'failed' ? options.issueKind ?? 'technical' : undefined,
    history: appendPublicationHistory(current.history, historyEntry),
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
