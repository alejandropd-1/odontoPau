import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { validateArticleDocument, type Article } from '../../data/articulos';
import { validateInstructionDocument, type Instruccion } from '../../data/instrucciones';
import {
  assertTinaRuntimeOverlayComplete,
  TINA_RESOLVED_SLICE_B_ROUTES,
  TINA_SLICE_B_CURRENT_CONTRACT,
} from './runtime-contract';

function loadJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')) as T;
}

const baseArticle = loadJson<Omit<Article, 'sourcePath'>>(
  'src/data/articulos/estetica/blanqueamiento-dentario-tecnica-ambulatoria.json'
);
const baseInstruction = loadJson<Omit<Instruccion, 'sourcePath'>>(
  'src/data/instrucciones/ortodoncia/indicaciones-alineadores-keepsmiling.json'
);
const clone = <T>(value: T): T => structuredClone(value);

assert.doesNotThrow(() => validateArticleDocument(clone(baseArticle), 'articulo-real-copia'));
assert.doesNotThrow(() => validateInstructionDocument(clone(baseInstruction), 'instruccion-real-copia'));

const retiredArticle = clone(baseArticle);
retiredArticle.status = 'retired';
assert.doesNotThrow(() => validateArticleDocument(retiredArticle, 'articulo-retirado'));

const retiredInstruction = clone(baseInstruction);
retiredInstruction.status = 'retired';
assert.doesNotThrow(() => validateInstructionDocument(retiredInstruction, 'instruccion-retirada'));

const articleWithoutReviewer = clone(baseArticle);
delete articleWithoutReviewer.clinicalReviewer;
assert.throws(() => validateArticleDocument(articleWithoutReviewer), /clinicalReviewer/);

const articleWithInvalidDate = clone(baseArticle);
articleWithInvalidDate.updatedAt = '12/08/2026';
assert.throws(() => validateArticleDocument(articleWithInvalidDate), /fecha ISO UTC/);

const articleWithInvalidOptional = clone(baseArticle);
(articleWithInvalidOptional.heroImage as unknown as { label: number }).label = 42;
assert.throws(() => validateArticleDocument(articleWithInvalidOptional), /heroImage.label debe ser un texto/);

const articleWithInvalidStats = clone(baseArticle);
articleWithInvalidStats.sections.push({
  type: 'stats',
  items: [{ value: '', label: 'Dato inválido' }],
});
assert.throws(() => validateArticleDocument(articleWithInvalidStats), /items\[0\]\.value/);

const articleWithInvalidFaq = clone(baseArticle);
articleWithInvalidFaq.sections.push({
  type: 'faq',
  title: 'Preguntas',
  items: [{ question: '', answer: 'Respuesta' }],
});
assert.throws(() => validateArticleDocument(articleWithInvalidFaq), /question/);

const instructionWithInvalidOptional = clone(baseInstruction);
(instructionWithInvalidOptional.sections[0] as unknown as { title: number }).title = 42;
assert.throws(
  () => validateInstructionDocument(instructionWithInvalidOptional),
  /sections\[0\]\.title debe ser un texto/
);

const instructionWithUnpairedDownload = clone(baseInstruction);
delete instructionWithUnpairedDownload.resourceGallery?.images[0].downloadLabel;
assert.throws(
  () => validateInstructionDocument(instructionWithUnpairedDownload),
  /downloadLabel debe ser un texto no vacio/
);

const instructionWithoutReviewer = clone(baseInstruction);
delete instructionWithoutReviewer.clinicalReviewer;
assert.throws(() => validateInstructionDocument(instructionWithoutReviewer), /clinicalReviewer/);

assertTinaRuntimeOverlayComplete();
assert.equal(Object.keys(TINA_SLICE_B_CURRENT_CONTRACT).length, 130);
assert.equal(TINA_RESOLVED_SLICE_B_ROUTES.size, 35);
assert.equal(
  Object.values(TINA_SLICE_B_CURRENT_CONTRACT).every((field) => field.state === 'safe'),
  true
);

console.log('--- Tina runtime contract ---');
console.log('- Documentos reales copiados: Artículo + Instrucción válidos.');
console.log('- Casos negativos: 8 combinaciones inválidas bloqueadas.');
console.log(`- Brechas históricas resueltas: ${TINA_RESOLVED_SLICE_B_ROUTES.size}/35`);
console.log(`- Contrato Tina vigente: ${Object.keys(TINA_SLICE_B_CURRENT_CONTRACT).length}/130 rutas safe.`);
