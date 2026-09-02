import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  appendPublicationHistory,
  classifyEditorialPaths,
  createPendingPublicationRequest,
  createPublicationProgress,
  createPublicationResult,
  derivePublicationHistorySummary,
  isActivePublicationRequest,
  isEditorialAllowedPath,
  normalizePublicationRequest,
  publicationHistoryDurationMs,
  readPublicationHistory,
  sortPublicationHistory,
  validatePublicationRequest,
  type PublicationHistoryEntry,
  type PublicationRequest,
} from './publication';
import { evaluatePublicationPreflight } from './publication-preflight';

const idle: PublicationRequest = {
  type: 'EditorialPublicationRequest',
  status: 'idle',
  summary: 'Sin solicitudes.',
};

assert.doesNotThrow(() => validatePublicationRequest(idle));

const idleFromTina = {
  ...idle,
  requestId: null,
  requestedAt: null,
  lastProcessedRequestId: null,
  processedAt: null,
  productionCommit: null,
  issueKind: null,
  productionIndex: null,
};
assert.deepEqual(normalizePublicationRequest(idleFromTina), idle);
assert.equal(
  createPendingPublicationRequest(idleFromTina, 'req-20260824-12345678', '2026-08-24T18:30:00.000Z').status,
  'pending'
);
assert.equal(isActivePublicationRequest('pending'), true);
assert.equal(isActivePublicationRequest('processing'), true);
assert.equal(isActivePublicationRequest('deploying'), true);
assert.equal(isActivePublicationRequest('waiting_index'), true);
assert.equal(isActivePublicationRequest('published'), false);

const pending = createPendingPublicationRequest(
  idle,
  'req-20260821-12345678',
  '2026-08-21T18:30:00.000Z'
);
assert.equal(pending.status, 'pending');
assert.equal(pending.requestId, 'req-20260821-12345678');
assert.throws(
  () => createPendingPublicationRequest(pending, 'req-20260821-87654321', '2026-08-21T18:31:00.000Z'),
  /publicación pendiente/
);

const published = createPublicationResult(pending, 'published', '2026-08-21T18:35:00.000Z', {
  productionCommit: 'abcdef0123456789',
  productionIndex: [
    {
      collection: 'articulo',
      relativePath: 'ortopedia/placas.json',
      fingerprint: '0123456789abcdef',
      publicState: 'published',
    },
  ],
  summary: 'Cambios publicados.',
});
assert.equal(published.lastProcessedRequestId, pending.requestId);
assert.doesNotThrow(() => validatePublicationRequest(published));
assert.equal(published.productionIndex?.[0].publicState, 'published');
assert.deepEqual(published.history, [
  {
    requestId: pending.requestId,
    requestedAt: pending.requestedAt,
    processedAt: '2026-08-21T18:35:00.000Z',
    result: 'published',
    productionCommit: 'abcdef0123456789',
  },
]);

assert.doesNotThrow(() =>
  validatePublicationRequest({
    type: 'EditorialPublicationRequest',
    status: 'published',
    requestId: 'req-legacy-12345678',
    requestedAt: '2026-08-20T18:30:00.000Z',
    lastProcessedRequestId: 'req-legacy-12345678',
    processedAt: '2026-08-20T18:35:00.000Z',
    productionCommit: 'abcdef0123456789',
  })
);
assert.throws(
  () => validatePublicationRequest({ ...published, productionIndex: [{ ...published.productionIndex?.[0], fingerprint: 'no-valida' }] }),
  /fingerprint no es válido/
);
assert.throws(
  () => validatePublicationRequest({ ...published, productionIndex: [...(published.productionIndex ?? []), ...(published.productionIndex ?? [])] }),
  /productionIndex repite/
);

const deploying = createPublicationProgress(pending, 'deploying', {
  productionCommit: 'abcdef0123456789',
  summary: 'Estamos actualizando el sitio público.',
});
assert.equal(deploying.status, 'deploying');
assert.equal(deploying.productionCommit, 'abcdef0123456789');
assert.equal(deploying.history, undefined);

const waiting = createPublicationProgress(deploying, 'waiting_index', {
  productionCommit: 'abcdef0123456789',
  issueKind: 'deploy_not_confirmed',
  summary: 'Todavía no pudimos confirmar el sitio público.',
});
assert.equal(waiting.issueKind, 'deploy_not_confirmed');
assert.equal(isActivePublicationRequest(waiting.status), true);
assert.equal(waiting.history, undefined);

const failed = createPublicationResult(pending, 'failed', '2026-08-21T18:35:00.000Z', {
  issueKind: 'checks_failed',
  summary: 'Uno de los controles no pasó.',
});
assert.equal(failed.issueKind, 'checks_failed');
assert.equal(failed.history?.[0].result, 'failed');
assert.throws(
  () => validatePublicationRequest({ ...failed, issueKind: undefined }),
  /failed requiere issueKind/
);

const failedAfterPublished = createPublicationResult(
  createPendingPublicationRequest(published, 'req-after-published-1234', '2026-08-21T19:00:00.000Z'),
  'failed',
  '2026-08-21T19:05:00.000Z',
  { issueKind: 'checks_failed', summary: 'No se publicó.' }
);
assert.equal(failedAfterPublished.productionCommit, published.productionCommit);
assert.deepEqual(failedAfterPublished.productionIndex, published.productionIndex);
assert.equal(failedAfterPublished.history?.length, 2);

const nextPendingAfterHistory = createPendingPublicationRequest(
  published,
  'req-next-cycle-12345678',
  '2026-08-21T19:00:00.000Z'
);
const progressAfterHistory = createPublicationProgress(nextPendingAfterHistory, 'processing', {
  summary: 'Controles en curso.',
});
assert.deepEqual(progressAfterHistory.history, published.history);

const historyEntry: PublicationHistoryEntry = {
  requestId: 'req-history-12345678',
  requestedAt: '2026-08-21T18:30:00.000Z',
  processedAt: '2026-08-21T18:35:30.000Z',
  result: 'published',
  productionCommit: 'abcdef0123456789',
};
assert.equal(appendPublicationHistory([], historyEntry).length, 1);
const sameHistory = [historyEntry];
assert.strictEqual(appendPublicationHistory(sameHistory, { ...historyEntry }), sameHistory);
assert.throws(
  () => appendPublicationHistory(sameHistory, { ...historyEntry, result: 'failed', issueKind: 'technical', productionCommit: undefined }),
  /resultado final diferente/
);
assert.equal(publicationHistoryDurationMs(historyEntry), 330_000);

const olderFailure: PublicationHistoryEntry = {
  requestId: 'req-history-old-1234',
  requestedAt: '2026-08-20T18:00:00.000Z',
  processedAt: '2026-08-20T18:02:00.000Z',
  result: 'failed',
  issueKind: 'checks_failed',
};
assert.deepEqual(sortPublicationHistory([olderFailure, historyEntry]).map((entry) => entry.requestId), [
  historyEntry.requestId,
  olderFailure.requestId,
]);
assert.deepEqual(derivePublicationHistorySummary([olderFailure, historyEntry]), {
  lastPublishedAt: historyEntry.processedAt,
  publishedCount: 1,
  failedCount: 1,
});
assert.deepEqual(readPublicationHistory(undefined), { entries: [], invalidEntries: 0, available: true });
assert.deepEqual(readPublicationHistory('no disponible'), { entries: [], invalidEntries: 1, available: false });
const partiallyInvalidHistory = readPublicationHistory([
  historyEntry,
  { ...olderFailure, patientName: 'Dato que no corresponde' },
]);
assert.equal(partiallyInvalidHistory.entries.length, 1);
assert.equal(partiallyInvalidHistory.invalidEntries, 1);
assert.throws(
  () => validatePublicationRequest({ ...published, history: [{ ...historyEntry, patientName: 'Dato sensible' }] }),
  /campo inesperado patientName/
);
assert.throws(
  () => validatePublicationRequest({ ...published, history: [{ ...historyEntry, result: 'unknown' }] }),
  /result no es válido/
);
assert.throws(
  () => validatePublicationRequest({ ...published, history: [historyEntry, { ...historyEntry }] }),
  /history repite/
);

const repeatedPublished = createPublicationResult(published, 'published', '2026-08-21T19:00:00.000Z', {
  productionCommit: 'abcdef0123456789',
  summary: 'No debe reemplazar el resultado final.',
});
assert.deepEqual(repeatedPublished, published);
assert.equal(repeatedPublished.processedAt, '2026-08-21T18:35:00.000Z');

const duplicated = { ...pending, lastProcessedRequestId: pending.requestId };
assert.throws(() => validatePublicationRequest(duplicated), /ya fue procesado/);

for (const allowedPath of [
  'src/data/home.json',
  'src/data/tratamientos-page.json',
  'src/data/articulos/estetica/caso.json',
  'src/data/instrucciones/ortodoncia/guia.json',
  'src/data/tratamientos/endodoncia/endodoncia.json',
  'src/data/editorial/publication-request.json',
  'public/images/editorial/foto.webp',
  'public/videos/guia.mp4',
]) {
  assert.equal(isEditorialAllowedPath(allowedPath), true, allowedPath);
}

for (const blockedPath of [
  'tina/config.ts',
  'src/components/Article.tsx',
  'package.json',
  'tina/tina-lock.json',
  'openspec/changes/nuevo/proposal.md',
  '.github/workflows/quality-gates.yml',
]) {
  assert.equal(isEditorialAllowedPath(blockedPath), false, blockedPath);
}

assert.deepEqual(
  classifyEditorialPaths(['src/data/home.json', 'public/images/editorial/foto.webp']),
  { kind: 'editorial-routine', blockedPaths: [] }
);
assert.deepEqual(classifyEditorialPaths(['src/data/home.json', 'tina/config.ts']), {
  kind: 'structural-change',
  blockedPaths: ['tina/config.ts'],
});

assert.equal(
  evaluatePublicationPreflight({
    request: pending,
    changedPaths: ['src/data/articulos/estetica/caso.json', 'src/data/editorial/publication-request.json'],
    mainIsAncestor: true,
    editorialHeadMatchesRequest: true,
  }).ok,
  true
);
const advancedBranch = evaluatePublicationPreflight({
  request: pending,
  changedPaths: ['src/data/articulos/estetica/caso.json', 'src/data/editorial/publication-request.json'],
  mainIsAncestor: true,
  editorialHeadMatchesRequest: false,
});
assert.equal(advancedBranch.ok, false);
assert.match(advancedBranch.errors.join(' '), /cambios después/);

const repositoryManifest = JSON.parse(
  fs.readFileSync('src/data/editorial/publication-request.json', 'utf8')
) as unknown;
assert.doesNotThrow(() => validatePublicationRequest(repositoryManifest));
assert.deepEqual((repositoryManifest as PublicationRequest).history, []);

console.log('--- Tina publication request ---');
console.log('- Estados y transiciones idempotentes: válidos.');
console.log('- Allowlist editorial: rutas rutinarias permitidas y estructurales bloqueadas.');
