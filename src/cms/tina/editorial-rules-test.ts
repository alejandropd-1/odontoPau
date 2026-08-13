import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getSyntheticFixtures, loadRealJsonDocuments } from '../fixtures';
import {
  articleCollection,
  homePageCollection,
  instructionCollection,
  treatmentCollection,
  treatmentsPageCollection,
} from './collections';
import {
  CATEGORY_OPTIONS,
  SERVICE_OPTIONS,
  articleFields,
  articleImageFields,
  instructionFields,
  treatmentFields,
} from './fields';

type InspectableField = {
  name: string;
  type: string;
  list?: boolean;
  fields?: InspectableField[];
  templates?: { fields: InspectableField[] }[];
  ui?: { component?: unknown };
};

function fieldByName(fields: readonly unknown[], name: string): InspectableField {
  const field = (fields as InspectableField[]).find((candidate) => candidate.name === name);
  assert.ok(field, `Falta el campo editorial ${name}.`);
  return field;
}

function getDefaultItem(collection: typeof articleCollection): Record<string, unknown> {
  const defaultItem = collection.defaultItem;
  assert.ok(defaultItem, `${collection.name} debe declarar defaultItem.`);
  return typeof defaultItem === 'function' ? defaultItem() : defaultItem;
}

for (const collection of [articleCollection, instructionCollection]) {
  const defaultItem = getDefaultItem(collection);
  assert.equal(defaultItem.status, 'draft');
  assert.equal('publishedAt' in defaultItem, false);
  assert.equal('clinicalReviewer' in defaultItem, false);
  assert.equal(collection.ui?.allowedActions?.delete, false);
  assert.equal(collection.ui?.filename?.showFirst, true);
  assert.equal(collection.ui?.filename?.parse?.('Álta Sintética 01'), 'alta-sintetica-01');
}

for (const collection of [homePageCollection, treatmentsPageCollection, treatmentCollection]) {
  assert.equal(collection.ui?.allowedActions?.create, false);
  assert.equal(collection.ui?.allowedActions?.delete, false);
  assert.equal(collection.ui?.allowedActions?.createFolder, false);
  assert.equal(collection.ui?.allowedActions?.createNestedFolder, false);
}

async function validateBeforeSubmitRules(): Promise<void> {
  const articleBeforeSubmit = articleCollection.ui?.beforeSubmit;
  const instructionBeforeSubmit = instructionCollection.ui?.beforeSubmit;
  assert.ok(articleBeforeSubmit);
  assert.ok(instructionBeforeSubmit);

  await assert.rejects(
    () =>
      articleBeforeSubmit({
        values: { status: 'published' },
        cms: undefined,
        form: undefined,
      }),
    /fecha de publicación y responsable/
  );

  const preparedDraft = await instructionBeforeSubmit({
    values: { title: 'Borrador sintético' },
    cms: undefined,
    form: undefined,
  });
  assert.equal(preparedDraft?.type, 'Instruccion');
  assert.equal(preparedDraft?.status, 'draft');
  assert.equal(preparedDraft?.internalId, undefined);

  const preparedWithSlug = await articleBeforeSubmit({
    values: {
      slug: 'alta-sintetica',
      title: 'Alta sintética',
      sourcePath: 'src/data/articulos/sintetico.json',
      _template: 'articulo',
    },
    cms: undefined,
    form: undefined,
  });
  assert.equal(preparedWithSlug?.internalId, 'alta-sintetica');
  assert.equal('sourcePath' in (preparedWithSlug ?? {}), false);
  assert.equal('_template' in (preparedWithSlug ?? {}), false);
}

const realDocuments = loadRealJsonDocuments().filter(
  (fixture) => fixture.model === 'Articulo' || fixture.model === 'Instruccion'
);
const categoryValues = new Set(CATEGORY_OPTIONS.map((option) => option.value));
const serviceValues = new Set(SERVICE_OPTIONS.map((option) => option.value));
const slugsByModel = new Map<string, Set<string>>();

for (const fixture of realDocuments) {
  const document = fixture.content as {
    slug: string;
    category: string;
    serviceId?: string;
    serviceIds?: string[];
  };
  assert.equal(categoryValues.has(document.category), true, `${fixture.id}: category sin opción Tina.`);

  for (const serviceId of [...(document.serviceIds ?? []), ...(document.serviceId ? [document.serviceId] : [])]) {
    assert.equal(serviceValues.has(serviceId), true, `${fixture.id}: serviceId sin opción Tina.`);
  }

  const seen = slugsByModel.get(fixture.model) ?? new Set<string>();
  assert.equal(seen.has(document.slug), false, `${fixture.model}: slug duplicado ${document.slug}.`);
  seen.add(document.slug);
  slugsByModel.set(fixture.model, seen);
}

const syntheticDocuments = getSyntheticFixtures().filter(
  (fixture) => fixture.model === 'Articulo' || fixture.model === 'Instruccion'
);
assert.equal(syntheticDocuments.length >= 4, true, 'Faltan fixtures mínimos/completos de Slice B.');

for (const fields of [articleFields, instructionFields]) {
  const tags = fieldByName(fields, 'tags');
  assert.equal(tags.list, true);
  assert.equal(typeof tags.ui?.component, 'function', 'Las etiquetas deben usar el campo de chips editorial.');
}

const treatmentFeatures = fieldByName(treatmentFields, 'features');
assert.equal(typeof treatmentFeatures.ui?.component, 'function');
const clinicalCases = fieldByName(treatmentFields, 'casosClinicos');
const clinicalCaseFields = clinicalCases.fields ?? [];
assert.equal(typeof fieldByName(clinicalCaseFields, 'solucionFeatures').ui?.component, 'function');
assert.equal(fieldByName(clinicalCaseFields, 'clinicalCaseEditingHelp').type, 'displayOnly');
assert.equal(fieldByName(articleImageFields, 'imageEditingHelp').type, 'displayOnly');

const articleSections = fieldByName(articleFields, 'sections');
const textTemplate = articleSections.templates?.find((template) =>
  template.fields.some((field) => field.name.endsWith('_paragraphs'))
);
assert.ok(textTemplate, 'Falta el template de párrafos del artículo.');
const paragraphs = textTemplate.fields.find((field) => field.name.endsWith('_paragraphs'));
assert.equal(paragraphs?.list, true);
assert.notEqual(
  paragraphs?.ui?.component,
  'textarea',
  'Los párrafos repetibles no deben serializarse como textarea separado por comas.'
);

const editorialFieldSource = readFileSync(new URL('./editorial-fields.tsx', import.meta.url), 'utf8');
for (const forbiddenSelector of ['button.icon-parent', 'svg.text-red-500', 'button:has(']) {
  assert.equal(
    editorialFieldSource.includes(forbiddenSelector),
    false,
    `La personalización editorial no debe depender del selector interno de Tina ${forbiddenSelector}.`
  );
}
assert.match(
  editorialFieldSource,
  /input\.onChange as unknown as \(value: string\) => void\)\(event\.target\.value\)/,
  'Los campos de texto personalizados deben entregar el valor a Final Form, no el evento sintético de React.'
);

const tinaRunnerSource = readFileSync(new URL('../../../scripts/run-tina.mjs', import.meta.url), 'utf8');
assert.match(tinaRunnerSource, /TINA_DATALAYER_PORT/);
assert.match(tinaRunnerSource, /--datalayer-port/);
assert.match(tinaRunnerSource, /TINA_CLI_PORT \|\| '4101'/);

console.log('--- Tina editorial rules ---');
console.log(`- Documentos reales: ${realDocuments.length}`);
console.log(`- Categorías configuradas: ${categoryValues.size}`);
console.log(`- Tratamientos seleccionables: ${serviceValues.size}`);
console.log('- Altas: draft sin publicación/revisor; borrado deshabilitado; filename sanitizado.');
console.log('- Publicación incompleta: bloqueada antes del guardado.');
console.log('- Inicio, índice y tratamientos existentes: solo edición, sin alta ni borrado.');
console.log('- UX: campos Material soportados, chips editoriales y ayudas displayOnly sin persistencia.');

validateBeforeSubmitRules().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
