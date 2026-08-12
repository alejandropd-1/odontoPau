import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cmsModels } from './models';
import { neutralManifests, ModelManifest, FieldManifest } from './manifests';
import {
  CONTRACT_BASELINE_MODELS,
  CONTRACT_BASELINE_FIELDS,
} from './baseline';

/**
 * Normaliza valores opcionales de texto o discriminantes de forma determinista.
 * Trata `undefined`, `null`, `""` y `"-"` como la misma representación explícita de "sin valor".
 */
export function normalizeOptionalString(val: string | undefined | null): string {
  if (val === undefined || val === null || val === '' || val === '-') {
    return '-';
  }
  return val;
}

/**
 * Nombres de modelos esperados de la línea base contractual.
 */
export const EXPECTED_MODEL_NAMES = Object.keys(CONTRACT_BASELINE_MODELS);

/**
 * Validador estricto de manifest neutral y metadatos de modelos contra la línea base contractual.
 * Recibe un manifest en memoria para probar mutaciones sintéticas sin escribir a disco.
 */
export function validateNeutralManifest(manifest: Record<string, ModelManifest>): {
  success: boolean;
  errors: string[];
  routeCount: number;
} {
  const errors: string[] = [];
  const observedRoutes = new Set<string>();
  const expectedRouteKeys = Object.keys(CONTRACT_BASELINE_FIELDS);
  let routeCount = 0;

  // 1. Validar conteo y presencia de modelos (30 modelos) contra la línea base
  const manifestModelNames = Object.keys(manifest);
  const expectedModelNamesSet = new Set(EXPECTED_MODEL_NAMES);

  if (manifestModelNames.length !== EXPECTED_MODEL_NAMES.length) {
    errors.push(
      `Model count mismatch: expected ${EXPECTED_MODEL_NAMES.length} models, got ${manifestModelNames.length}`
    );
  }

  for (const modelName of manifestModelNames) {
    if (!expectedModelNamesSet.has(modelName)) {
      errors.push(`Unexpected model name in manifest: '${modelName}'`);
    }
  }

  // 2. Iterar modelos y validar metadatos contra la línea base estática
  for (const [modelKey, modelDef] of Object.entries(manifest)) {
    if (modelDef.name !== modelKey) {
      errors.push(`Model key '${modelKey}' mismatch with manifest.name '${modelDef.name}'`);
    }

    const baselineModel = CONTRACT_BASELINE_MODELS[modelKey];
    if (baselineModel) {
      if (modelDef.type !== baselineModel.type) {
        errors.push(
          `Model '${modelKey}' type mismatch: expected '${baselineModel.type}', got '${modelDef.type}'`
        );
      }
      if (modelDef.creationState !== baselineModel.creationState) {
        errors.push(
          `Model '${modelKey}' creationState mismatch: expected '${baselineModel.creationState}', got '${modelDef.creationState}'`
        );
      }
    }

    // Regla estricta para defaultStatus:
    // Solo Articulo e Instruccion pueden tener defaultStatus = 'draft'.
    // Cualquier otro modelo con defaultStatus (incluso 'draft') DEBE fallar.
    if (modelKey === 'Articulo' || modelKey === 'Instruccion') {
      if (modelDef.defaultStatus !== 'draft') {
        errors.push(
          `Model '${modelKey}' defaultStatus must be 'draft', got '${modelDef.defaultStatus}'`
        );
      }
    } else {
      if (modelDef.defaultStatus !== undefined) {
        errors.push(
          `Model '${modelKey}' cannot have defaultStatus, got '${modelDef.defaultStatus}'`
        );
      }
    }

    if (!modelDef.fields || !Array.isArray(modelDef.fields)) {
      errors.push(`Model '${modelKey}' in manifest is missing a valid fields array`);
      continue;
    }

    // 3. Iterar campos y comparar los 11 atributos contra CONTRACT_BASELINE_FIELDS
    for (const field of modelDef.fields) {
      routeCount++;
      const routeKey = `${modelKey}.${field.path}`;

      if (field.model !== modelKey) {
        errors.push(
          `Field model mismatch at '${routeKey}': field.model is '${field.model}', expected '${modelKey}'`
        );
      }

      if (observedRoutes.has(routeKey)) {
        errors.push(`Duplicate route detected in manifest: '${routeKey}'`);
      }
      observedRoutes.add(routeKey);

      const expectedField = CONTRACT_BASELINE_FIELDS[routeKey];
      if (!expectedField) {
        errors.push(`Unrecognized or non-inventory route in manifest: '${routeKey}'`);
        continue;
      }

      // Comparación estricta de los 11 atributos de campo
      const fieldAttrs: Array<[keyof typeof expectedField, string]> = [
        ['form', field.form],
        ['persistedType', field.persistedType],
        ['jsonPresence', field.jsonPresence],
        ['tsObligatory', field.tsObligatory],
        ['runtimeValidation', field.runtimeValidation],
        ['cmsObligatory', field.cmsObligatory],
        ['constOrDiscriminant', normalizeOptionalString(field.constOrDiscriminant)],
        ['origin', field.origin],
        ['editorialCondition', normalizeOptionalString(field.editorialCondition)],
        ['state', field.state],
        ['slice', field.slice],
      ];

      for (const [attrName, observedVal] of fieldAttrs) {
        const expectedVal = expectedField[attrName];
        if (observedVal !== expectedVal) {
          errors.push(
            `Attribute '${attrName}' mismatch at '${routeKey}': expected '${expectedVal}', got '${observedVal}'`
          );
        }
      }
    }
  }

  // 4. Comprobar rutas omitidas
  for (const expectedRoute of expectedRouteKeys) {
    if (!observedRoutes.has(expectedRoute)) {
      errors.push(`Missing expected route in manifest: '${expectedRoute}'`);
    }
  }

  // 5. Comprobar total exacto (188)
  if (routeCount !== 188) {
    errors.push(`Route count mismatch: expected exactly 188 routes, got ${routeCount}`);
  }

  return {
    success: errors.length === 0,
    errors,
    routeCount,
  };
}

/**
 * Validador estricto de neutralidad de proveedor sobre código fuente recibido en memoria.
 * Detecta imports estáticos, side-effects, reexports, require() e imports dinámicos.
 */
export function validateVendorNeutralitySource(sourceCode: string): {
  success: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const forbiddenTokens = [
    '@stackbit',
    'tinacms',
    '@tinacms',
    '@sanity',
    'sanity',
    'contentful',
    'strapi',
    'prismic',
    'payload',
    'decap',
    'netlify-cms',
  ];

  for (const token of forbiddenTokens) {
    const pattern = new RegExp(
      `(?:import|export)\\s+(?:[\\s\\S]*?\\s+from\\s+)?['"]${token}(?:[/'"].*?)?['"]|` +
      `(?:require|import)\\s*\\(\\s*['"]${token}(?:[/'"].*?)?['"]\\)`,
      'i'
    );
    if (pattern.test(sourceCode)) {
      errors.push(`Vendor neutrality violation: found import/export/require of vendor token '${token}'`);
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

/**
 * Validador estricto de neutralidad leyendo archivo desde disco.
 */
export function validateVendorNeutrality(manifestsFilePath: string): {
  success: boolean;
  errors: string[];
} {
  const content = fs.readFileSync(manifestsFilePath, 'utf8');
  return validateVendorNeutralitySource(content);
}

/**
 * Suite de casos de prueba negativos automáticos para verificar que el validador detecta errores reales.
 */
export function runNegativeTestsSuite(): { success: boolean; passedCases: number; errors: string[] } {
  const suiteErrors: string[] = [];
  let passedCases = 0;

  function assertNegativeCase(
    caseName: string,
    mutatedManifestFn: () => Record<string, ModelManifest>,
    expectedErrorSubstring: string
  ) {
    const mutated = mutatedManifestFn();
    const result = validateNeutralManifest(mutated);
    if (result.success) {
      suiteErrors.push(`${caseName} FAILED: Validator returned success: true when error was expected.`);
    } else {
      const match = result.errors.some((e) => e.includes(expectedErrorSubstring));
      if (!match) {
        suiteErrors.push(
          `${caseName} FAILED: Expected error containing '${expectedErrorSubstring}', got errors: [${result.errors.join('; ')}]`
        );
      } else {
        passedCases++;
      }
    }
  }

  // 1. Ruta inexistente
  assertNegativeCase(
    'Neg 1 (Ruta inexistente)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.HomePage.fields.find((f: FieldManifest) => f.path === 'title');
      if (target) target.path = 'ruta_inexistente';
      return m;
    },
    "Unrecognized or non-inventory route in manifest: 'HomePage.ruta_inexistente'"
  );

  // 2. Ruta duplicada y omitida
  assertNegativeCase(
    'Neg 2 (Ruta duplicada/omitida)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const slugIdx = m.Articulo.fields.findIndex((f: FieldManifest) => f.path === 'slug');
      const titleObj = m.Articulo.fields.find((f: FieldManifest) => f.path === 'title');
      if (slugIdx !== -1 && titleObj) m.Articulo.fields[slugIdx] = JSON.parse(JSON.stringify(titleObj));
      return m;
    },
    "Duplicate route detected in manifest: 'Articulo.title'"
  );

  // 3. form cambiado
  assertNegativeCase(
    'Neg 3 (form cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.HomePage.fields.find((f: FieldManifest) => f.path === 'type');
      if (target) target.form = 'list';
      return m;
    },
    "Attribute 'form' mismatch at 'HomePage.type': expected 'scalar', got 'list'"
  );

  // 4. persistedType cambiado
  assertNegativeCase(
    'Neg 4 (persistedType cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.Tratamiento.fields.find((f: FieldManifest) => f.path === 'order');
      if (target) target.persistedType = 'tipo_invalido';
      return m;
    },
    "Attribute 'persistedType' mismatch at 'Tratamiento.order': expected 'number', got 'tipo_invalido'"
  );

  // 5. jsonPresence cambiado
  assertNegativeCase(
    'Neg 5 (jsonPresence cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.HomePage.fields.find((f: FieldManifest) => f.path === 'type');
      if (target) target.jsonPresence = 'Some';
      return m;
    },
    "Attribute 'jsonPresence' mismatch at 'HomePage.type': expected 'All', got 'Some'"
  );

  // 6. tsObligatory cambiado
  assertNegativeCase(
    'Neg 6 (tsObligatory cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.Tratamiento.fields.find((f: FieldManifest) => f.path === 'type');
      if (target) target.tsObligatory = 'Opt';
      return m;
    },
    "Attribute 'tsObligatory' mismatch at 'Tratamiento.type': expected 'Req', got 'Opt'"
  );

  // 7. runtimeValidation cambiado
  assertNegativeCase(
    'Neg 7 (runtimeValidation cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.Tratamiento.fields.find((f: FieldManifest) => f.path === 'sourcePath');
      if (target) target.runtimeValidation = 'NoVal';
      return m;
    },
    "Attribute 'runtimeValidation' mismatch at 'Tratamiento.sourcePath': expected 'Validated', got 'NoVal'"
  );

  // 8. cmsObligatory cambiado
  assertNegativeCase(
    'Neg 8 (cmsObligatory cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.HomePage.fields.find((f: FieldManifest) => f.path === 'title');
      if (target) target.cmsObligatory = 'Req';
      return m;
    },
    "Attribute 'cmsObligatory' mismatch at 'HomePage.title': expected 'Opt', got 'Req'"
  );

  // 9. constOrDiscriminant cambiado
  assertNegativeCase(
    'Neg 9 (constOrDiscriminant cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.Articulo.fields.find((f: FieldManifest) => f.path === 'type');
      if (target) target.constOrDiscriminant = 'Cte:Invalido';
      return m;
    },
    "Attribute 'constOrDiscriminant' mismatch at 'Articulo.type': expected 'Cte:Articulo', got 'Cte:Invalido'"
  );

  // 10. origin cambiado
  assertNegativeCase(
    'Neg 10 (origin cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.Tratamiento.fields.find((f: FieldManifest) => f.path === 'sourcePath');
      if (target) target.origin = 'persisted';
      return m;
    },
    "Attribute 'origin' mismatch at 'Tratamiento.sourcePath': expected 'derived', got 'persisted'"
  );

  // 11. editorialCondition cambiada
  assertNegativeCase(
    'Neg 11 (editorialCondition cambiada)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.CasoClinico.fields.find((f: FieldManifest) => f.path === 'articleSlug');
      if (target) target.editorialCondition = 'meta';
      return m;
    },
    "Attribute 'editorialCondition' mismatch at 'CasoClinico.articleSlug': expected 'opcional', got 'meta'"
  );

  // 12. state cambiado
  assertNegativeCase(
    'Neg 12 (state cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.HomePage.fields.find((f: FieldManifest) => f.path === 'type');
      if (target) target.state = 'safe';
      return m;
    },
    "Attribute 'state' mismatch at 'HomePage.type': expected 'blocked', got 'safe'"
  );

  // 13. slice cambiado
  assertNegativeCase(
    'Neg 13 (slice cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      const target = m.Articulo.fields.find((f: FieldManifest) => f.path === 'type');
      if (target) target.slice = 'C';
      return m;
    },
    "Attribute 'slice' mismatch at 'Articulo.type': expected 'B', got 'C'"
  );

  // 14. Articulo.defaultStatus cambiado de 'draft' a 'published'
  assertNegativeCase(
    'Neg 14 (Articulo.defaultStatus published)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      m.Articulo.defaultStatus = 'published';
      return m;
    },
    "Model 'Articulo' defaultStatus must be 'draft', got 'published'"
  );

  // 15. HomePage.defaultStatus asignado con 'draft' (no permitido en modelos no Articulo/Instruccion)
  assertNegativeCase(
    'Neg 15 (HomePage.defaultStatus draft no permitido)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      m.HomePage.defaultStatus = 'draft';
      return m;
    },
    "Model 'HomePage' cannot have defaultStatus, got 'draft'"
  );

  // 16. creationState cambiado
  assertNegativeCase(
    'Neg 16 (creationState cambiado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      m.HomePage.creationState = 'disabled';
      return m;
    },
    "Model 'HomePage' creationState mismatch: expected 'pending', got 'disabled'"
  );

  // 17. manifest.name alterado manteniendo clave original
  assertNegativeCase(
    'Neg 17 (manifest.name alterado)',
    () => {
      const m = JSON.parse(JSON.stringify(neutralManifests));
      m.HomePage.name = 'HomePageRenamed';
      return m;
    },
    "Model key 'HomePage' mismatch with manifest.name 'HomePageRenamed'"
  );

  // 18-22. Pruebas sintéticas de neutralidad de proveedor
  const vendorTestCases = [
    { name: 'Neg 18 (tinacms static import)', code: "import { defineSchema } from 'tinacms';", expected: 'tinacms' },
    { name: 'Neg 19 (sanity side-effect import)', code: "import 'sanity';", expected: 'sanity' },
    { name: 'Neg 20 (@sanity/client re-export)', code: "export { createClient } from '@sanity/client';", expected: '@sanity' },
    { name: 'Neg 21 (contentful require call)', code: "const contentful = require('contentful');", expected: 'contentful' },
    { name: 'Neg 22 (@stackbit/types dynamic import)', code: "const b = import('@stackbit/types');", expected: '@stackbit' },
  ];

  for (const vCase of vendorTestCases) {
    const vResult = validateVendorNeutralitySource(vCase.code);
    if (vResult.success) {
      suiteErrors.push(`${vCase.name} FAILED: Vendor neutrality check allowed forbidden import/export/require.`);
    } else {
      const match = vResult.errors.some((e) => e.includes(vCase.expected));
      if (!match) {
        suiteErrors.push(`${vCase.name} FAILED: Expected error mentioning '${vCase.expected}'`);
      } else {
        passedCases++;
      }
    }
  }

  // 23. Caso negativo: Matriz de markdown con ruta duplicada y ruta faltante
  const reportPath = path.join(
    process.cwd(),
    'openspec',
    'changes',
    'alinear-contratos-y-seguridad-cms',
    'reporte-inventario.md'
  );
  if (fs.existsSync(reportPath)) {
    const realReportContent = fs.readFileSync(reportPath, 'utf8');
    // Duplicar HomePage.type reemplazando la fila de HomePage.title
    const mutatedReportContent = realReportContent.replace(
      /\| HomePage \| `title` \| scalar \| string \| All \| N\/A \| NoVal \| Opt \| - \| persisted \| - \| `blocked` \| Presente en JSON pero opcional en CMS y sin validador RT\. \| D \|/,
      '| HomePage | `type` | scalar | string | All | N/A | NoVal | N/A | Cte:`HomePage` | persisted | - | `blocked` | Presente en JSON, sin validación RT, ausente en CMS. | D |'
    );
    const negMatrixResult = validateReporteInventarioMatrixVsBaseline(undefined, mutatedReportContent);
    if (negMatrixResult.success) {
      suiteErrors.push('Neg 23 (duplicate & missing matrix route) FAILED: Validator allowed matrix with duplicate/missing routes.');
    } else {
      const hasDupError = negMatrixResult.errors.some((e) => e.includes("Duplicate route 'HomePage.type'"));
      const hasMissingError = negMatrixResult.errors.some((e) => e.includes("Missing baseline route 'HomePage.title'"));
      if (hasDupError && hasMissingError) {
        passedCases++;
      } else {
        suiteErrors.push(
          `Neg 23 FAILED: Expected duplicate and missing route errors, got: [${negMatrixResult.errors.join('; ')}]`
        );
      }
    }
  }

  return {
    success: suiteErrors.length === 0 && passedCases === 23,
    passedCases,
    errors: suiteErrors,
  };
}

/**
 * Aserciones de regresión ejecutables para metadata específica de rutas y exclusión de ArticleDownload en Stackbit.
 */
export function validateRouteRegressionAssertions(): { success: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. HomePage.type: NoVal, blocked
  const hpTypeBaseline = CONTRACT_BASELINE_FIELDS['HomePage.type'];
  const hpTypeManifest = neutralManifests.HomePage?.fields.find((f) => f.path === 'type');
  if (!hpTypeBaseline || hpTypeBaseline.runtimeValidation !== 'NoVal' || hpTypeBaseline.state !== 'blocked') {
    errors.push(`Regression assertion failed for baseline HomePage.type: expected NoVal/blocked, got ${hpTypeBaseline?.runtimeValidation}/${hpTypeBaseline?.state}`);
  }
  if (!hpTypeManifest || hpTypeManifest.runtimeValidation !== 'NoVal' || hpTypeManifest.state !== 'blocked') {
    errors.push(`Regression assertion failed for manifest HomePage.type: expected NoVal/blocked, got ${hpTypeManifest?.runtimeValidation}/${hpTypeManifest?.state}`);
  }

  // 2. Tratamiento.professionals: Validated, safe
  const tratProfBaseline = CONTRACT_BASELINE_FIELDS['Tratamiento.professionals'];
  const tratProfManifest = neutralManifests.Tratamiento?.fields.find((f) => f.path === 'professionals');
  if (!tratProfBaseline || tratProfBaseline.runtimeValidation !== 'Validated' || tratProfBaseline.state !== 'safe') {
    errors.push(`Regression assertion failed for baseline Tratamiento.professionals: expected Validated/safe, got ${tratProfBaseline?.runtimeValidation}/${tratProfBaseline?.state}`);
  }
  if (!tratProfManifest || tratProfManifest.runtimeValidation !== 'Validated' || tratProfManifest.state !== 'safe') {
    errors.push(`Regression assertion failed for manifest Tratamiento.professionals: expected Validated/safe, got ${tratProfManifest?.runtimeValidation}/${tratProfManifest?.state}`);
  }

  // 3. TreatmentProfessional.mobileRole: Validated, safe
  const tpMobileBaseline = CONTRACT_BASELINE_FIELDS['TreatmentProfessional.mobileRole'];
  const tpMobileManifest = neutralManifests.TreatmentProfessional?.fields.find((f) => f.path === 'mobileRole');
  if (!tpMobileBaseline || tpMobileBaseline.runtimeValidation !== 'Validated' || tpMobileBaseline.state !== 'safe') {
    errors.push(`Regression assertion failed for baseline TreatmentProfessional.mobileRole: expected Validated/safe, got ${tpMobileBaseline?.runtimeValidation}/${tpMobileBaseline?.state}`);
  }
  if (!tpMobileManifest || tpMobileManifest.runtimeValidation !== 'Validated' || tpMobileManifest.state !== 'safe') {
    errors.push(`Regression assertion failed for manifest TreatmentProfessional.mobileRole: expected Validated/safe, got ${tpMobileManifest?.runtimeValidation}/${tpMobileManifest?.state}`);
  }

  // 4. ArticleDownload MUST NOT be in the 29 Stackbit models
  const isArticleDownloadInStackbit = cmsModels.some((m) => m.name === 'ArticleDownload');
  if (cmsModels.length !== 29) {
    errors.push(`Stackbit models count mismatch: expected 29 adapted models, got ${cmsModels.length}`);
  }
  if (isArticleDownloadInStackbit) {
    errors.push(`Regression assertion failed: ArticleDownload model should NOT be present in Stackbit models registry.`);
  }

  return { success: errors.length === 0, errors };
}

/**
 * Runner principal de la prueba de equivalencia y coherencia.
 */
export function runEquivalenceAndCoherenceTest(): void {
  let hasFailed = false;

  console.log('--- CMS Contracts Equivalence & Coherence Test ---');

  // 1. Probar equivalencia exacta de modelos Stackbit contra snapshot en ruta estable de pruebas
  const snapshotPath = path.join(process.cwd(), 'src', 'cms', 'stackbit-base-snapshot.json');
  if (!fs.existsSync(snapshotPath)) {
    console.error(`FAIL: Snapshot file not found at stable path: ${snapshotPath}`);
    process.exit(1);
  }
  const snapshotContent = fs.readFileSync(snapshotPath, 'utf8');
  const expectedModels = JSON.parse(snapshotContent);
  const actualModels = JSON.parse(JSON.stringify(cmsModels));

  if (JSON.stringify(expectedModels) !== JSON.stringify(actualModels)) {
    console.error('FAIL: Stackbit models registry differs from base snapshot.');
    hasFailed = true;
  } else {
    console.log(`- Stackbit Models Equivalence: PASSED (29 models: ${cmsModels.filter(m => m.type === 'page').length} page, ${cmsModels.filter(m => m.type === 'object').length} object)`);
  }

  // 2. Probar neutralidad de proveedor en manifests.ts
  const manifestsPath = path.join(process.cwd(), 'src', 'cms', 'manifests.ts');
  const neutralityResult = validateVendorNeutrality(manifestsPath);
  if (!neutralityResult.success) {
    console.error('FAIL: Vendor Neutrality Check FAILED:');
    for (const err of neutralityResult.errors) {
      console.error(`  - ${err}`);
    }
    hasFailed = true;
  } else {
    console.log('- Vendor Neutrality Check: PASSED');
  }

  // 3. Probar validez del manifest neutral real contra la línea base contractual independiente
  const manifestResult = validateNeutralManifest(neutralManifests);
  if (!manifestResult.success) {
    console.error('FAIL: Neutral Manifest Validation FAILED:');
    for (const err of manifestResult.errors) {
      console.error(`  - ${err}`);
    }
    hasFailed = true;
  } else {
    console.log(`- Neutral Manifest Validation: PASSED (${Object.keys(neutralManifests).length} neutral models, ${manifestResult.routeCount} routes)`);
  }

  // 4. Probar suite de casos negativos automáticos (23 casos)
  const negativeResult = runNegativeTestsSuite();
  if (!negativeResult.success) {
    console.error('FAIL: Negative Tests Suite FAILED:');
    for (const err of negativeResult.errors) {
      console.error(`  - ${err}`);
    }
    hasFailed = true;
  } else {
    console.log(`- Negative Test Cases: PASSED (${negativeResult.passedCases}/23 negative cases correctly caught with expected error messages)`);
  }

  // 5. Probar aserciones de regresión sobre metadatos específicos y exclusión de ArticleDownload
  const regressionResult = validateRouteRegressionAssertions();
  if (!regressionResult.success) {
    console.error('FAIL: Specific Route Metadata & Stackbit Exclusion Assertions FAILED:');
    for (const err of regressionResult.errors) {
      console.error(`  - ${err}`);
    }
    hasFailed = true;
  } else {
    console.log('- Specific Route Metadata & Stackbit Exclusion Assertions: PASSED');
  }

  // 6. Probar coherencia estricta de la matriz de 188 filas de reporte-inventario.md contra la línea base
  const reportMatrixResult = validateReporteInventarioMatrixVsBaseline();
  if (!reportMatrixResult.success) {
    console.error('FAIL: Report Inventory Matrix vs Baseline Check FAILED:');
    for (const err of reportMatrixResult.errors) {
      console.error(`  - ${err}`);
    }
    hasFailed = true;
  } else {
    console.log(`- Report Inventory Matrix vs Baseline Check: PASSED (${reportMatrixResult.parsedRows} rows, ${reportMatrixResult.matchedRoutes} routes, ${reportMatrixResult.diffCount} diffs)`);
  }

  if (hasFailed) {
    console.error('\nRESULT: FAILED - One or more validation steps failed.');
    process.exit(1);
  } else {
    console.log('\nSUCCESS: All 31 neutral models, 29 Stackbit models, 188 routes, report matrix alignment, neutrality checks, and negative cases passed cleanly.');
  }
}

/**
 * Valida la matriz de 188 filas de reporte-inventario.md contra CONTRACT_BASELINE_FIELDS.
 * Compara identidad (Modelo.ruta), Runtime, Estado, unicidad de rutas y ausencia de faltantes.
 */
export function validateReporteInventarioMatrixVsBaseline(
  reportFilePath?: string,
  customContent?: string
): {
  success: boolean;
  parsedRows: number;
  matchedRoutes: number;
  diffCount: number;
  errors: string[];
} {
  const errors: string[] = [];
  let content = customContent;

  if (content === undefined) {
    const targetPath =
      reportFilePath ||
      path.join(process.cwd(), 'openspec', 'changes', 'alinear-contratos-y-seguridad-cms', 'reporte-inventario.md');

    if (!fs.existsSync(targetPath)) {
      return {
        success: false,
        parsedRows: 0,
        matchedRoutes: 0,
        diffCount: 1,
        errors: [`Report file not found at: ${targetPath}`],
      };
    }
    content = fs.readFileSync(targetPath, 'utf8');
  }

  const lines = content.split(/\r?\n/);
  const rows: { model: string; route: string; fullKey: string; runtime: string; state: string }[] = [];
  const seenRouteCounts: Record<string, number> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    if (trimmed.includes('| Modelo |') || trimmed.includes('|---|')) continue;

    // Split cells by |
    const cells = trimmed.split('|').map((c) => c.trim().replace(/^`+|,?$`+|^`|`$/g, '').replace(/`/g, ''));
    // cells[0] is empty, cells[1] = Model, cells[2] = Route, cells[7] = Runtime, cells[12] = State
    if (cells.length >= 14) {
      const model = cells[1];
      const route = cells[2];
      const runtime = cells[7];
      const state = cells[12];
      if (model && route && model !== 'Modelo') {
        const fullKey = `${model}.${route}`;
        rows.push({ model, route, fullKey, runtime, state });
        seenRouteCounts[fullKey] = (seenRouteCounts[fullKey] || 0) + 1;
      }
    }
  }

  const expectedTotalRoutes = Object.keys(CONTRACT_BASELINE_FIELDS).length; // 188
  let diffCount = 0;

  if (rows.length !== expectedTotalRoutes) {
    errors.push(
      `Matrix row count mismatch: expected ${expectedTotalRoutes} rows in reporte-inventario.md, got ${rows.length}`
    );
    diffCount++;
  }

  // 1. Comprobar unicidad de rutas en la matriz del reporte
  for (const [fullKey, count] of Object.entries(seenRouteCounts)) {
    if (count > 1) {
      errors.push(`Duplicate route '${fullKey}' found in markdown table matrix (${count} occurrences)`);
      diffCount++;
    }
  }

  // 2. Comprobar ausencia de rutas faltantes de la línea base en la matriz del reporte
  for (const expectedKey of Object.keys(CONTRACT_BASELINE_FIELDS)) {
    if (!seenRouteCounts[expectedKey]) {
      errors.push(`Missing baseline route '${expectedKey}' in markdown table matrix`);
      diffCount++;
    }
  }

  let matchedRoutes = 0;

  for (const row of rows) {
    const baselineField = CONTRACT_BASELINE_FIELDS[row.fullKey];
    if (!baselineField) {
      errors.push(`Matrix route '${row.fullKey}' from reporte-inventario.md does not exist in CONTRACT_BASELINE_FIELDS`);
      diffCount++;
      continue;
    }

    matchedRoutes++;

    if (baselineField.runtimeValidation !== row.runtime) {
      errors.push(
        `Runtime mismatch at '${row.fullKey}': markdown table has '${row.runtime}', baseline has '${baselineField.runtimeValidation}'`
      );
      diffCount++;
    }

    if (baselineField.state !== row.state) {
      errors.push(
        `State mismatch at '${row.fullKey}': markdown table has '${row.state}', baseline has '${baselineField.state}'`
      );
      diffCount++;
    }
  }

  return {
    success: errors.length === 0 && diffCount === 0 && rows.length === expectedTotalRoutes,
    parsedRows: rows.length,
    matchedRoutes,
    diffCount,
    errors,
  };
}

// Guarda CLI para evitar ejecutar automáticamente el runner al importar el módulo
const currentScriptPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
const thisModulePath = fileURLToPath(import.meta.url);

if (currentScriptPath === thisModulePath || currentScriptPath.endsWith('equivalence-test.ts')) {
  runEquivalenceAndCoherenceTest();
}
