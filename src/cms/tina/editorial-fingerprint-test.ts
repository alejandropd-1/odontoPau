import assert from 'node:assert/strict';

import {
  createEditorialFingerprint,
  hasValidEditorialFingerprint,
  stableEditorialStringify,
} from './editorial-fingerprint';
import {
  createEditorialProductionEntry,
  createEditorialRevisionFingerprint,
  sortEditorialProductionIndex,
} from './production-index';

const original = {
  title: 'Placas removibles',
  status: 'published',
  updatedAt: '2026-08-27T12:00:00.000Z',
  sections: [{ paragraphs: ['Texto clínico aprobado.'] }],
};

const reordered = {
  sections: [{ paragraphs: ['Texto clínico aprobado.'] }],
  updatedAt: '2026-08-27T12:00:00.000Z',
  status: 'published',
  title: 'Placas removibles',
};

assert.equal(stableEditorialStringify(original), stableEditorialStringify(reordered));
assert.equal(createEditorialFingerprint(original), createEditorialFingerprint(reordered));
assert.equal(hasValidEditorialFingerprint(createEditorialFingerprint(original)), true);
assert.equal(
  createEditorialFingerprint({ ...original, editorialFingerprint: '0000000000000000', _sys: { relativePath: 'otra.json' } }),
  createEditorialFingerprint(original)
);
assert.notEqual(
  createEditorialFingerprint(original),
  createEditorialFingerprint({ ...original, sections: [{ paragraphs: ['Texto clínico corregido.'] }] })
);

const fingerprint = createEditorialRevisionFingerprint('articulo', 'ortopedia/placas.json', original);
assert.deepEqual(
  createEditorialProductionEntry('articulo', 'ortopedia/placas.json', original),
  {
    collection: 'articulo',
    relativePath: 'ortopedia/placas.json',
    fingerprint,
    publicState: 'published',
  }
);
assert.equal(
  createEditorialProductionEntry('instruccion', 'ortodoncia/guia.json', {
    ...original,
    status: 'draft',
  }).publicState,
  'unpublished'
);
assert.throws(
  () => createEditorialProductionEntry('articulo', 'ortopedia/placas.json', { ...original, updatedAt: '' }),
  /fecha de actualización válida/
);
assert.deepEqual(
  sortEditorialProductionIndex([
    { collection: 'instruccion', relativePath: 'b.json', fingerprint, publicState: 'retired' },
    { collection: 'articulo', relativePath: 'a.json', fingerprint, publicState: 'published' },
  ]).map((entry) => `${entry.collection}:${entry.relativePath}`),
  ['articulo:a.json', 'instruccion:b.json']
);
assert.notEqual(
  createEditorialRevisionFingerprint('articulo', 'ortopedia/placas.json', original),
  createEditorialRevisionFingerprint('articulo', 'ortopedia/placas.json', { ...original, status: 'retired' })
);

console.log('--- Tina editorial fingerprint ---');
console.log('- Serialización estable, exclusiones operativas y cambios reales: válidos.');
