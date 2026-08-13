import assert from 'node:assert/strict';

import { getSyntheticFixtures, loadRealJsonDocuments } from '../fixtures';
import { getSrcDataFilesHashes, verifySrcDataNonMutation } from '../roundtrip';
import {
  assertTemplateKeyContract,
  inspectTinaSliceBCoverage,
  tinaRoundTripDifferences,
  tinaSliceBModels,
  toTinaEditorDocument,
} from './adapter';

const beforeHashes = getSrcDataFilesHashes();
const fixtures = [...loadRealJsonDocuments(), ...getSyntheticFixtures()].filter(
  (fixture) => fixture.model === 'Articulo' || fixture.model === 'Instruccion'
);

assertTemplateKeyContract();

const coverage = inspectTinaSliceBCoverage();
assert.equal(coverage.modelCount, 26);
assert.equal(coverage.expectedRouteCount, 130);
assert.equal(coverage.coveredRouteCount, 130, coverage.missingRoutes.join('\n'));
assert.deepEqual(coverage.missingRoutes, []);
assert.deepEqual(coverage.invalidRequiredRoutes, []);
assert.deepEqual(coverage.invalidDiscriminants, []);

let sectionCount = 0;
for (const fixture of fixtures) {
  const modelName = fixture.model as 'Articulo' | 'Instruccion';
  const differences = tinaRoundTripDifferences(fixture.content, modelName);
  assert.deepEqual(differences, [], `${fixture.id}:\n${differences.join('\n')}`);

  const editorDocument = toTinaEditorDocument(fixture.content, modelName);
  assert.equal('_template' in editorDocument, false, `${fixture.id}: _template no debe existir en raíz.`);
  const sections = editorDocument.sections;
  if (Array.isArray(sections)) {
    sectionCount += sections.length;
    for (const section of sections) {
      assert.equal(typeof section._template, 'string');
      assert.equal('type' in section, false, 'El editor usa _template solo internamente.');
    }
  }
}

const nonMutation = verifySrcDataNonMutation(beforeHashes, getSrcDataFilesHashes());
assert.equal(nonMutation.success, true, nonMutation.mutatedFiles.join('\n'));

console.log('--- Tina Slice B Adapter ---');
console.log(`- Modelos: ${Object.keys(tinaSliceBModels).length}/26`);
console.log(`- Rutas: ${coverage.coveredRouteCount}/${coverage.expectedRouteCount}`);
console.log(`- Documentos/fixtures: ${fixtures.length}`);
console.log(`- Secciones discriminadas: ${sectionCount}`);
console.log(`- Mutaciones en src/data: ${nonMutation.mutatedFiles.length}`);
console.log('SUCCESS: aliases, templateKey=type y round-trip semántico sin pérdida.');

// TinaCMS mantiene handles internos abiertos al importar su runtime. Este archivo
// es un runner determinista de una sola ejecución, por lo que debe cerrar de forma
// explícita para no dejar el gate o el job de CI esperando indefinidamente.
process.exit(0);
