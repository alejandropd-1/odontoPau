import assert from 'node:assert/strict';

import { createEditorialRevisionFingerprint } from '../../src/cms/tina/production-index';
import type { EditorialProductionEntry } from '../../src/cms/tina/publication';
import {
  createEditorialDashboardRow,
  filterEditorialDashboardRows,
  getEditorialDashboardDisplayState,
  type EditorialDashboardDocument,
} from './editorial-dashboard-model';

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
assert.equal(published.publicLabel, 'Visible ahora');
assert.equal(published.readinessLabel, 'Al día');
assert.equal(published.editHref, '#/collections/edit/articulo/ortopedia/placas');
assert.equal(published.previewHref, 'https://preview.example.com/articulos/placas');
assert.deepEqual(getEditorialDashboardDisplayState(published), { value: 'published', label: 'Publicado' });

const changed = document({
  title: 'Placas removibles actualizadas',
  updatedAt: '2026-08-27T13:00:00.000Z',
});
const previewOnly = createEditorialDashboardRow(changed, indexFor(current), 'https://preview.example.com');
assert.equal(previewOnly.publicLabel, 'Cambios sin publicar');
assert.equal(previewOnly.readiness, 'ready');
assert.equal(previewOnly.confirmedPublicState, 'published');
assert.equal(previewOnly.hasUnpublishedChanges, true);
assert.equal(getEditorialDashboardDisplayState(previewOnly).label, 'Publicado');

const retired = document({ status: 'retired' });
const retiredRow = createEditorialDashboardRow(retired, indexFor(retired, 'retired'), 'https://preview.example.com');
assert.equal(retiredRow.publicLabel, 'Retirado del sitio');
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
assert.equal(unknownPublished.publicLabel, 'Todavía sin confirmar');
assert.equal(unknownPublished.readinessLabel, 'Primera confirmación pendiente');
assert.deepEqual(getEditorialDashboardDisplayState(unknownPublished), { value: null, label: '—' });

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

console.log('--- Tina editorial dashboard model ---');
console.log('- Estados público/Preview, bloqueos, URLs y filtros: válidos.');
