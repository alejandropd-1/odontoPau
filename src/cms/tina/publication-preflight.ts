import {
  PUBLICATION_REQUEST_PATH,
  classifyEditorialPaths,
  validatePublicationRequest,
  type PublicationRequest,
} from './publication';

export interface PublicationPreflightInput {
  request: PublicationRequest;
  changedPaths: string[];
  mainIsAncestor: boolean;
  editorialHeadMatchesRequest: boolean;
}

export interface PublicationPreflightResult {
  ok: boolean;
  kind: 'editorial-routine' | 'structural-change';
  requestId?: string;
  changedPaths: string[];
  blockedPaths: string[];
  errors: string[];
}

export function evaluatePublicationPreflight(input: PublicationPreflightInput): PublicationPreflightResult {
  validatePublicationRequest(input.request);
  const classification = classifyEditorialPaths(input.changedPaths);
  const errors: string[] = [];

  if (input.request.status !== 'pending') {
    errors.push(`La solicitud está en estado ${input.request.status}; se esperaba pending.`);
  }
  if (!input.request.requestId || input.request.requestId === input.request.lastProcessedRequestId) {
    errors.push('La solicitud no tiene un identificador nuevo y procesable.');
  }
  if (!input.mainIsAncestor) {
    errors.push('main no es ancestro del snapshot editorial. La rama necesita sincronización manual.');
  }
  if (!input.editorialHeadMatchesRequest) {
    errors.push('Se guardaron cambios después de solicitar la publicación. Revisá Preview y volvé a publicar.');
  }
  if (classification.blockedPaths.length > 0) {
    errors.push('El snapshot contiene archivos estructurales fuera del carril editorial.');
  }
  if (!input.changedPaths.some((filePath) => filePath !== PUBLICATION_REQUEST_PATH)) {
    errors.push('No existen cambios editoriales para publicar además de la solicitud.');
  }

  return {
    ok: errors.length === 0,
    kind: classification.kind,
    requestId: input.request.requestId,
    changedPaths: input.changedPaths,
    blockedPaths: classification.blockedPaths,
    errors,
  };
}
