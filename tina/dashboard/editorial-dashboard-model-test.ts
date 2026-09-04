import assert from 'node:assert/strict';

import { createEditorialRevisionFingerprint } from '../../src/cms/tina/production-index';
import type { EditorialProductionEntry } from '../../src/cms/tina/publication';
import {
  createEditorialDashboardRow,
  createEditorialPublicationHistoryView,
  displayStateLabels,
  filterEditorialDashboardRows,
  formatEditorialDateTime,
  formatPublicationDuration,
  getEditorialDashboardDisplayState,
  classifyEditorialFailure,
  createEditorialIncidentId,
  editorialContentSummary,
  editorialUnavailableNotice,
  isEditorialConfirmed,
  type EditorialAvailability,
  type EditorialDashboardRow,
  type EditorialDashboardDocument,
} from './editorial-dashboard-model';

assert.deepEqual(Object.values(displayStateLabels), ['Publicado', 'No publicado', 'Borrador']);

function document(overrides: Partial<EditorialDashboardDocument> = {}): EditorialDashboardDocument {
  const base = {
    collection: 'articulo' as const,
    relativePath: 'ortopedia/placas.json',
    slug: 'placas',
    title: 'Placas removibles',
    category: 'ortopedia',
    categoryLabel: 'Ortopedia',
    excerpt: 'Descripción breve sobre placas removibles.',
    tags: ['ortopedia', 'placas removibles'],
    status: 'published',
    createdAt: '2026-08-26T12:00:00.000Z',
    publishedAt: '2026-08-27T12:00:00.000Z',
    updatedAt: '2026-08-27T12:00:00.000Z',
    clinicalReviewer: 'Dra. Paula Gualtieri',
  };
  return { ...base, ...overrides };
}

function indexFor(item: EditorialDashboardDocument, publicState: EditorialProductionEntry['publicState'] = 'published') {
  return [{
    collection: item.collection,
    relativePath: item.relativePath,
    fingerprint: createEditorialRevisionFingerprint(item.collection, item.relativePath, item),
    publicState,
  }];
}

const current = document();
const published = createEditorialDashboardRow(current, indexFor(current), 'https://preview.example.com');
assert.equal(published.readinessLabel, 'Al día');
assert.equal(published.editHref, '#/collections/edit/articulo/ortopedia/placas');
assert.equal(published.previewHref, 'https://preview.example.com/articulos/placas');
assert.deepEqual(getEditorialDashboardDisplayState(published), { value: 'published', label: 'Publicado' });

const changed = document({
  title: 'Placas removibles actualizadas',
  updatedAt: '2026-08-27T13:00:00.000Z',
});
const previewOnly = createEditorialDashboardRow(changed, indexFor(current), 'https://preview.example.com');
assert.equal(previewOnly.readiness, 'ready');
assert.equal(previewOnly.confirmedPublicState, 'published');
assert.equal(previewOnly.hasUnpublishedChanges, true);
assert.equal(getEditorialDashboardDisplayState(previewOnly).label, 'Publicado');

const retired = document({ status: 'retired' });
const retiredRow = createEditorialDashboardRow(retired, indexFor(retired, 'retired'), 'https://preview.example.com');
assert.equal(retiredRow.actionLabel, 'Republicar');
assert.equal(retiredRow.editHref, '#/collections/edit/articulo/ortopedia/placas');
assert.equal(getEditorialDashboardDisplayState(retiredRow).label, 'No publicado');

const draft = createEditorialDashboardRow(document({ status: 'draft' }), indexFor(current), 'https://preview.example.com');
assert.equal(getEditorialDashboardDisplayState(draft).label, 'Publicado');
assert.equal(draft.readinessLabel, 'En preparación');
const newDraft = createEditorialDashboardRow(document({ status: 'draft' }), [], 'https://preview.example.com');
assert.equal(getEditorialDashboardDisplayState(newDraft).label, 'Borrador');

const incomplete = document({ clinicalReviewer: null });
const incompleteRow = createEditorialDashboardRow(incomplete, indexFor(incomplete));
assert.match(incompleteRow.explanation, /revisión clínica/);
assert.equal(getEditorialDashboardDisplayState(incompleteRow).label, 'Publicado');

const inherited = document({ status: 'technical_review' });
assert.equal(createEditorialDashboardRow(inherited, indexFor(inherited, 'unpublished')).readiness, 'blocked');

const unknown = createEditorialDashboardRow(document({ updatedAt: '' }), undefined);
assert.equal(unknown.publicStatus, 'unknown');
assert.equal(unknown.readinessLabel, 'Necesita guardarse');

const unknownPublished = createEditorialDashboardRow(document(), undefined);
assert.equal(unknownPublished.readinessLabel, 'Primera confirmación pendiente');
assert.deepEqual(getEditorialDashboardDisplayState(unknownPublished), { value: 'not_published', label: 'No publicado' });

const newPublished = createEditorialDashboardRow(document({ relativePath: 'ortopedia/nueva.json' }), [], 'https://preview.example.com');
assert.equal(getEditorialDashboardDisplayState(newPublished).label, 'No publicado');

const instruction = document({
  collection: 'instruccion',
  relativePath: 'ortodoncia/cuidados.json',
  category: 'ortodoncia',
  slug: 'cuidados',
  title: 'Cuidados de alineadores',
});
const instructionRow = createEditorialDashboardRow(instruction, indexFor(instruction), 'https://preview.example.com/base');
assert.equal(instructionRow.previewHref, 'https://preview.example.com/instrucciones/ortodoncia/cuidados');

assert.deepEqual(
  filterEditorialDashboardRows([published, instructionRow], { query: 'alineadores', collection: 'instruccion' }).map((row) => row.slug),
  ['cuidados']
);
assert.equal(filterEditorialDashboardRows([published, previewOnly], { publicStatus: 'preview_only' }).length, 1);
assert.equal(filterEditorialDashboardRows([published], { query: 'sin coincidencias' }).length, 0);
assert.equal(filterEditorialDashboardRows([published], { query: 'removibles' }).length, 1);

const historyView = createEditorialPublicationHistoryView([
  {
    requestId: 'req-dashboard-history-1234',
    requestedAt: '2026-08-21T18:30:00.000Z',
    processedAt: '2026-08-21T18:35:30.000Z',
    result: 'published',
    productionCommit: 'abcdef0123456789',
  },
  {
    requestId: 'req-dashboard-history-5678',
    requestedAt: '2026-08-22T18:30:00.000Z',
    processedAt: '2026-08-22T18:32:00.000Z',
    result: 'failed',
    issueKind: 'checks_failed',
  },
]);
assert.equal(historyView.available, true);
assert.deepEqual(historyView.summary, {
  lastPublishedAt: '2026-08-21T18:35:30.000Z',
  publishedCount: 1,
  failedCount: 1,
});
assert.equal(historyView.movements[0].title, 'La publicación se detuvo');
assert.match(historyView.movements[0].detail, /controles no pasó/);
assert.equal(historyView.movements[1].durationMs, 330_000);
assert.equal('requestId' in historyView.movements[0], false);
assert.equal('productionCommit' in historyView.movements[0], false);
assert.doesNotMatch(JSON.stringify(historyView), /GitHub|Netlify|SHA|pull request|requestId|productionCommit/i);

const partialHistoryView = createEditorialPublicationHistoryView([
  {
    requestId: 'req-dashboard-history-ok12',
    requestedAt: '2026-08-23T18:30:00.000Z',
    processedAt: '2026-08-23T18:31:00.000Z',
    result: 'failed',
    issueKind: 'technical',
  },
  { result: 'published' },
]);
assert.equal(partialHistoryView.movements.length, 1);
assert.equal(partialHistoryView.invalidEntries, 1);
assert.deepEqual(createEditorialPublicationHistoryView(undefined).movements, []);
assert.equal(createEditorialPublicationHistoryView(undefined, false).available, false);
assert.match(formatEditorialDateTime('2026-08-21T18:35:30.000Z'), /21\/08\/2026.*15:35/);
assert.equal(formatPublicationDuration(330_000), '6 min');
assert.equal(formatPublicationDuration(3_900_000), '1 h 5 min');
assert.equal(formatPublicationDuration(undefined), 'Duración no disponible');


// --- Disponibilidad editorial ---

assert.equal(classifyEditorialFailure({ status: 401 }), 'session');
assert.equal(classifyEditorialFailure({ response: { status: 403 } }), 'permission');
assert.equal(classifyEditorialFailure(Object.assign(new Error('cancelada'), { name: 'AbortError' })), 'timeout');
assert.equal(classifyEditorialFailure(new Error('Request timeout after 15000ms')), 'timeout');
assert.equal(classifyEditorialFailure(new Error('La sesión expirada del editor')), 'session');
assert.equal(classifyEditorialFailure(new Error('Failed to fetch')), 'service');
assert.equal(classifyEditorialFailure(undefined), 'service');

// Un fallo de lectura nunca produce totales: la vista debe mostrar indisponibilidad, no un cero.
const catalogRows: EditorialDashboardRow[] = [published, previewOnly];
const confirmed: EditorialAvailability<EditorialDashboardRow[]> = { kind: 'confirmed', value: catalogRows };
assert.deepEqual(editorialContentSummary(confirmed), {
  articles: 2,
  instructions: 0,
  published: 1,
  pending: 1,
});
assert.equal(editorialContentSummary({ kind: 'loading' }), null);
assert.equal(
  editorialContentSummary({ kind: 'unavailable', reason: 'service', incidentId: 'OP-20260904-ABC' }),
  null
);

// Un catálogo confirmado y vacío sí puede informar cero.
assert.deepEqual(editorialContentSummary({ kind: 'confirmed', value: [] }), {
  articles: 0,
  instructions: 0,
  published: 0,
  pending: 0,
});

assert.equal(isEditorialConfirmed(confirmed), true);
assert.equal(isEditorialConfirmed({ kind: 'loading' }), false);

// Los avisos separan sesión, permisos, plazo y servicio, y no culpan a la conexión de la persona.
const sessionNotice = editorialUnavailableNotice('session');
assert.equal(sessionNotice.offersLogin, true);
assert.equal(sessionNotice.offersRetry, false);
assert.equal(editorialUnavailableNotice('permission').offersLogin, false);
assert.equal(editorialUnavailableNotice('timeout').offersRetry, true);
assert.match(editorialUnavailableNotice('service').message, /no retira el contenido ya publicado/);
for (const reason of ['session', 'permission', 'timeout', 'service'] as const) {
  const notice = editorialUnavailableNotice(reason);
  assert.doesNotMatch(notice.message, /tu conexi[oó]n|revis[aá] tu red|GraphQL|token|rama|zstd/i);
  assert.ok(notice.message.length > 0 && notice.actionLabel.length > 0);
}

// El identificador de incidencia no incorpora contenido ni credenciales.
const incidentId = createEditorialIncidentId(new Date('2026-09-04T12:00:00.000Z'), 0.5);
assert.match(incidentId, /^OP-[0-9]{8}-[0-9A-Z]{3,4}$/);

console.log('--- Tina editorial dashboard model ---');
console.log('- Estados público/Preview, bloqueos, URLs, filtros e historial seguro: válidos.');
console.log('- Disponibilidad: clasificación de fallos, totales sólo confirmados y avisos diferenciados: válidos.');
