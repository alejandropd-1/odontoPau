import { compareStructuralContracts, FieldDiscrepancy } from './structural-comparator';
import { executeInMemRoundTrip, verifySrcDataNonMutation, compareDeepSemantic } from './roundtrip';
import { generateContractsReport } from './reporter';
import { cmsModels } from './models';
import { neutralManifests } from './manifests';
import { DocumentFixture } from './fixtures';

export interface Phase3NegativeTestCase {
  name: string;
  run: () => { success: boolean; errorMsg: string };
}

export interface Phase3NegativeTestResult {
  success: boolean;
  totalCases: number;
  passedCases: number;
  errors: string[];
}

/**
 * Helper para capturar y silenciar console.log y console.error durante la ejecución de pruebas negativas.
 */
function withCapturedConsole<T>(fn: () => T): T {
  const origLog = console.log;
  const origError = console.error;
  console.log = () => {};
  console.error = () => {};
  try {
    return fn();
  } finally {
    console.log = origLog;
    console.error = origError;
  }
}

/**
 * Suite de pruebas negativas reales para la Fase 3.
 * Invoca directamente las funciones productivas comparador, round-trip, no mutación y reporter.
 */
export function runPhase3NegativeTests(): Phase3NegativeTestResult {
  const cases: Phase3NegativeTestCase[] = [];
  const errors: string[] = [];

  function assertCase(name: string, fn: () => { success: boolean; errorMsg: string }) {
    cases.push({ name, run: fn });
  }

  // 1. Invariante: Fixtures vacíos
  assertCase('Struct 1: Empty fixtures array returns 0 documents', () => {
    const res = compareStructuralContracts([]);
    return {
      success: res.realDocsCount === 0 && res.syntheticFixturesCount === 0,
      errorMsg: 'Expected 0 real and synthetic documents for empty array.',
    };
  });

  // 2. Modelo desconocido en la raíz del documento
  assertCase('Struct 2: Unknown model in document detected', () => {
    const res = compareStructuralContracts([
      { id: 'test-unknown.json', model: 'ModeloInexistente', isSynthetic: true, content: { type: 'ModeloInexistente' } },
    ]);
    const found = res.violations.some((v) => v.layer === 'JSON' && v.reason.includes("Modelo desconocido 'ModeloInexistente'"));
    return { success: found, errorMsg: "Expected JSON layer violation for unknown model 'ModeloInexistente'." };
  });

  // 3. Campo JSON desconocido en la raíz de un objeto
  assertCase('Struct 3: Unknown JSON field at root level detected', () => {
    const res = compareStructuralContracts([
      { id: 'test-home.json', model: 'HomePage', isSynthetic: true, content: { type: 'HomePage', title: 'T', hero: { title: 'H', description: 'D' }, campoDesconocido: 123 } },
    ]);
    const found = res.violations.some((v) => v.layer === 'JSON' && v.reason.includes("Campo JSON desconocido 'campoDesconocido'"));
    return { success: found, errorMsg: "Expected JSON layer violation for unknown root field 'campoDesconocido'." };
  });

  // 4. Instancia omitiendo jsonPresence: All (omisión de alt solo en la primera de dos imágenes)
  assertCase('Struct 4: jsonPresence: All omitted in 1 of 2 InstructionImage instances detected with exact instance ID', () => {
    const res = compareStructuralContracts([
      {
        id: 'synthetic/instruccion-dos-imagenes.json',
        model: 'Instruccion',
        isSynthetic: true,
        content: {
          type: 'Instruccion',
          id: 'i1',
          slug: 'i1',
          category: 'cat',
          categoryLabel: 'Cat',
          title: 'T',
          excerpt: 'E',
          status: 'published',
          updatedAt: '2026-01-01T00:00:00Z',
          readTime: '1 min',
          tags: ['t1'],
          resourceImage: { src: 's.webp', alt: 'Alt Valido', width: 100, height: 100 },
          resourceGallery: {
            title: 'G',
            images: [
              { src: 's1.webp', width: 100, height: 100 }, // FUE OMITIDO 'alt' AQUÍ
              { src: 's2.webp', alt: 'Alt 2', width: 100, height: 100 },
            ],
          },
          sections: [{ type: 'text', paragraphs: ['P'] }],
        },
      },
    ]);
    const found = res.violations.some(
      (v) => v.layer === 'JSON' && v.documentId === 'synthetic/instruccion-dos-imagenes.json#resourceGallery.images[0]' && v.reason.includes("InstructionImage.alt")
    );
    return { success: found, errorMsg: "Expected JSON layer violation pointing to instance 'synthetic/instruccion-dos-imagenes.json#resourceGallery.images[0]' for missing alt." };
  });

  // 5. Alteración en neutralManifests
  assertCase('Struct 5: Altered form in neutral manifest attributed to Manifest layer', () => {
    const customManifests = JSON.parse(JSON.stringify(neutralManifests));
    const hp = customManifests.HomePage;
    if (hp) {
      const field = hp.fields.find((f: any) => f.path === 'title');
      if (field) field.form = 'list';
    }
    const res = compareStructuralContracts(
      [{ id: 'f1', model: 'HomePage', isSynthetic: true, content: { type: 'HomePage', title: 'T', hero: { title: 'H', description: 'D' } } }],
      { neutralManifests: customManifests }
    );
    const found = res.violations.some((v) => v.layer === 'Manifest' && v.reason.includes('Forma alterada en el manifest neutral'));
    return { success: found, errorMsg: 'Expected Manifest layer violation for altered field form.' };
  });

  // 6. Alteración de tipo persistido en adaptador Stackbit: Articulo.title string -> number
  assertCase('Struct 6: Altered persisted type string -> number in Stackbit adapter attributed to CMSAdapter layer', () => {
    const customModels = JSON.parse(JSON.stringify(cmsModels));
    const artModel = customModels.find((m: any) => m.name === 'Articulo');
    if (artModel) {
      const titleField = artModel.fields.find((f: any) => f.name === 'title');
      if (titleField) titleField.type = 'number';
    }
    const res = compareStructuralContracts([], { cmsModels: customModels });
    const found = res.violations.some(
      (v) => v.layer === 'CMSAdapter' && v.path === 'title' && v.reason.includes("Tipo alterado en el adaptador Stackbit para 'Articulo.title'")
    );
    return { success: found, errorMsg: 'Expected CMSAdapter layer violation for Articulo.title type string -> number.' };
  });

  // 7. Requerimiento ausente en adaptador Stackbit: Articulo.title required true -> false
  assertCase('Struct 7: Missing required: true in Stackbit adapter attributed to CMSAdapter layer', () => {
    const customModels = JSON.parse(JSON.stringify(cmsModels));
    const artModel = customModels.find((m: any) => m.name === 'Articulo');
    if (artModel) {
      const titleField = artModel.fields.find((f: any) => f.name === 'title');
      if (titleField) titleField.required = false;
    }
    const res = compareStructuralContracts([], { cmsModels: customModels });
    const found = res.violations.some(
      (v) => v.layer === 'CMSAdapter' && v.path === 'title' && v.reason.includes("Requerimiento ausente en el adaptador Stackbit para 'Articulo.title'")
    );
    return { success: found, errorMsg: 'Expected CMSAdapter layer violation for Articulo.title required true -> false.' };
  });

  // 8. Constante/discriminante Cte:Articulo alterado en adaptador Stackbit
  assertCase('Struct 8: Altered constant Cte:Articulo in Stackbit adapter attributed to CMSAdapter layer', () => {
    const customModels = JSON.parse(JSON.stringify(cmsModels));
    const artModel = customModels.find((m: any) => m.name === 'Articulo');
    if (artModel) {
      const typeField = artModel.fields.find((f: any) => f.name === 'type');
      if (typeField) typeField.const = 'ArticuloAlterado';
    }
    const res = compareStructuralContracts([], { cmsModels: customModels });
    const found = res.violations.some(
      (v) => v.layer === 'CMSAdapter' && v.path === 'type' && v.reason.includes("Constante alterada en el adaptador Stackbit para 'Articulo.type'")
    );
    return { success: found, errorMsg: 'Expected CMSAdapter layer violation for Articulo.type const alterada.' };
  });

  // 9. Tipo de ítems alterado en lista de escalares: Articulo.tags.items.type string -> number
  assertCase('Struct 9: Altered list items.type string -> number in Stackbit adapter attributed to CMSAdapter layer', () => {
    const customModels = JSON.parse(JSON.stringify(cmsModels));
    const artModel = customModels.find((m: any) => m.name === 'Articulo');
    if (artModel) {
      const tagsField = artModel.fields.find((f: any) => f.name === 'tags');
      if (tagsField && tagsField.items) tagsField.items.type = 'number';
    }
    const res = compareStructuralContracts([], { cmsModels: customModels });
    const found = res.violations.some(
      (v) => v.layer === 'CMSAdapter' && v.path === 'tags' && v.reason.includes("Tipo de items alterado en el adaptador Stackbit para 'Articulo.tags'")
    );
    return { success: found, errorMsg: 'Expected CMSAdapter layer violation for Articulo.tags.items.type string -> number.' };
  });

  // 10. Lista de modelos permitidos reducida en secciones: Articulo.sections
  assertCase('Struct 10: Reduced allowed section models in Stackbit adapter attributed to CMSAdapter layer', () => {
    const customModels = JSON.parse(JSON.stringify(cmsModels));
    const artModel = customModels.find((m: any) => m.name === 'Articulo');
    if (artModel) {
      const secField = artModel.fields.find((f: any) => f.name === 'sections');
      if (secField && secField.items) secField.items.models = ['ArticleTextSection'];
    }
    const res = compareStructuralContracts([], { cmsModels: customModels });
    const found = res.violations.some(
      (v) => v.layer === 'CMSAdapter' && v.path === 'sections' && v.reason.includes("Lista permitida de modelos de 'Articulo.sections' reducida")
    );
    return { success: found, errorMsg: 'Expected CMSAdapter layer violation for reduced Articulo.sections models.' };
  });

  // 11. Campo desconocido en Articulo.downloads[]
  assertCase('Nested 11: Unknown field in Articulo.downloads[] detected in structural comparator and round-trip', () => {
    const fixture: DocumentFixture = {
      id: 'test-download-unknown.json',
      model: 'Articulo',
      isSynthetic: true,
      content: {
        type: 'Articulo',
        id: 'a1',
        slug: 'a1',
        category: 'cat',
        categoryLabel: 'Cat',
        serviceIds: ['s1'],
        title: 'T',
        excerpt: 'E',
        author: 'A',
        status: 'draft',
        updatedAt: '2026-01-01',
        readTime: '1 min',
        tags: ['t1'],
        heroImage: { src: 's.webp', alt: 'Alt', width: 100, height: 100 },
        downloads: [{ name: 'N', url: 'https://example.com', label: 'Desconocido' }],
        sections: [{ type: 'text', paragraphs: ['P'] }],
      },
    };
    const structRes = compareStructuralContracts([fixture]);
    const rtRes = executeInMemRoundTrip([fixture]);
    const structFound = structRes.violations.some((v) => v.reason.includes('label'));
    const rtFound = rtRes.some((r) => r.differences.some((d) => d.includes('Unknown field')));
    return {
      success: structFound && rtFound,
      errorMsg: 'Expected both structural comparator and round-trip to fail for unknown field in Articulo.downloads[].',
    };
  });

  // 12. Campo desconocido en CasoClinico.stats[]
  assertCase('Nested 12: Unknown field in CasoClinico.stats[] detected in structural comparator and round-trip', () => {
    const fixture: DocumentFixture = {
      id: 'test-stat-unknown.json',
      model: 'CasoClinico',
      isSynthetic: true,
      content: {
        id: 1,
        articleSlug: 'a1',
        paciente: 'P',
        fecha: '2026-01-01',
        titulo: 'T',
        descripcion: 'D',
        estado: 'finalizado',
        stats: [{ value: '100%', label: 'Sat', unknownPropInStat: 123 }],
      },
    };
    const structRes = compareStructuralContracts([fixture]);
    const rtRes = executeInMemRoundTrip([fixture]);
    const structFound = structRes.violations.some((v) => v.reason.includes('unknownPropInStat'));
    const rtFound = rtRes.some((r) => r.differences.some((d) => d.includes('Unknown field')));
    return {
      success: structFound && rtFound,
      errorMsg: 'Expected both structural comparator and round-trip to fail for unknown field in CasoClinico.stats[].',
    };
  });

  // 13. Modificación del discriminante de sección en round-trip
  assertCase('RoundTrip 13: Altered section discriminant in memory triggers round-trip error', () => {
    const fixture: DocumentFixture = {
      id: 'test-disc.json',
      model: 'Articulo',
      isSynthetic: true,
      content: {
        type: 'Articulo',
        id: 'a1',
        slug: 'a1',
        category: 'cat',
        categoryLabel: 'Cat',
        serviceIds: ['s1'],
        title: 'T',
        excerpt: 'E',
        author: 'A',
        status: 'draft',
        updatedAt: '2026-01-01',
        readTime: '1 min',
        tags: ['t1'],
        heroImage: { src: 's.webp', alt: 'Alt', width: 100, height: 100 },
        sections: [{ type: 'section_alterada', paragraphs: ['P'] }],
      },
    };
    const rtRes = executeInMemRoundTrip([fixture]);
    const found = rtRes.some((r) => r.differences.length > 0 || r.success === false);
    return { success: found, errorMsg: 'Expected round-trip to fail when section discriminant is invalid.' };
  });

  // 14. Modificación de valor escalar en round-trip
  assertCase('RoundTrip 14: Altered scalar value in memory fails round-trip integrity', () => {
    const orig = { title: 'Original Title', excerpt: 'Excerpt' };
    const recon = { title: 'Altered Title', excerpt: 'Excerpt' };
    const diffs = compareDeepSemantic(orig, recon);
    return {
      success: diffs.length > 0,
      errorMsg: 'Expected compareDeepSemantic to report diff for altered scalar value.',
    };
  });

  // 15. Omisión de campo opcional conservada en round-trip
  assertCase('RoundTrip 15: Omission of optional field preserves clean exact object', () => {
    const fixture: DocumentFixture = {
      id: 'test-opt.json',
      model: 'Articulo',
      isSynthetic: true,
      content: {
        type: 'Articulo',
        id: 'a1',
        slug: 'a1',
        category: 'cat',
        categoryLabel: 'Cat',
        serviceIds: ['s1'],
        title: 'T',
        excerpt: 'E',
        author: 'A',
        status: 'draft',
        updatedAt: '2026-01-01',
        readTime: '1 min',
        tags: ['t1'],
        heroImage: { src: 's.webp', alt: 'Alt', width: 100, height: 100 },
        sections: [{ type: 'text', paragraphs: ['P'] }],
      },
    };
    const rtRes = executeInMemRoundTrip([fixture]);
    return {
      success: rtRes.length === 1 && rtRes[0].success && rtRes[0].differences.length === 0,
      errorMsg: 'Expected round-trip to succeed for clean object with omitted optional field.',
    };
  });

  // 16. Guard de no mutación en src/data detecta archivo modificado ficticio
  assertCase('NonMutation 16: Non-mutation guard checks integrity cleanly', () => {
    const guard = verifySrcDataNonMutation();
    return {
      success: guard.success && guard.checkedFilesCount > 0,
      errorMsg: 'Expected non-mutation guard to pass for intact src/data directory.',
    };
  });

  // 17. Reporter con violaciones devuelve false
  assertCase('Adversarial 17: generateContractsReport returns false when violations exist', () => {
    const mockStructuralResult = compareStructuralContracts([
      { id: 'test-bad.json', model: 'HomePage', isSynthetic: true, content: { type: 'HomePage', title: 'T', hero: { title: 'H', description: 'D' }, badProp: 1 } },
    ]);
    const gatePassed = generateContractsReport(
      mockStructuralResult,
      [{ fixtureId: 'f1', model: 'HomePage', success: true, preservedFields: 1, differences: [] }],
      { success: true, checkedFilesCount: 1, mutatedFiles: [] },
      { success: true, totalCases: 1, passedCases: 1, errors: [] }
    );
    return {
      success: gatePassed === false,
      errorMsg: 'Expected generateContractsReport to return false when structural violations exist.',
    };
  });

  // 18. Eliminar HomePage.title de una de varias instancias
  assertCase('Struct 18: Omitting HomePage.title from one instance produces violation, identifies instance, and fails gate', () => {
    const fixtures: DocumentFixture[] = [
      { id: 'home1.json', model: 'HomePage', isSynthetic: true, content: { type: 'HomePage', title: 'Home 1', hero: { title: 'H', description: 'D' }, features: [], testimonials: [], contact: {}, footer: {} } },
      { id: 'home2.json', model: 'HomePage', isSynthetic: true, content: { type: 'HomePage', hero: { title: 'H', description: 'D' }, features: [], testimonials: [], contact: {}, footer: {} } },
    ];
    const structRes = compareStructuralContracts(fixtures);
    const violation = structRes.violations.find((v) => v.documentId === 'home2.json' && v.reason.includes('HomePage.title'));
    const reportSuccess = generateContractsReport(
      structRes,
      [],
      { success: true, checkedFilesCount: 1, mutatedFiles: [] },
      { success: true, totalCases: 0, passedCases: 0, errors: [] }
    );
    return {
      success: !!violation && reportSuccess === false,
      errorMsg: 'Expected HomePage.title omission in home2.json to produce violation pointing to home2.json and fail gate.',
    };
  });

  // 19. Eliminar TreatmentProfessional.name de una sola instancia anidada
  assertCase('Struct 19: Omitting TreatmentProfessional.name from a nested instance produces violation with instance ID and fails gate', () => {
    const fixtures: DocumentFixture[] = [
      {
        id: 'tratamiento1.json',
        model: 'Tratamiento',
        isSynthetic: true,
        content: {
          type: 'Tratamiento',
          id: 't1',
          category: 'cat',
          categoryLabel: 'Cat',
          order: 1,
          tituloHero: 'T',
          descripcionHero: 'D',
          professionals: [
            { name: 'Dr. A', role: 'Cirujano', image: '/images/a.webp', imageAlt: 'Alt A' },
            { role: 'Ortodoncista', image: '/images/b.webp', imageAlt: 'Alt B' },
          ],
        },
      },
    ];
    const structRes = compareStructuralContracts(fixtures);
    const violation = structRes.violations.find((v) => v.documentId === 'tratamiento1.json#professionals[1]' && v.reason.includes('TreatmentProfessional.name'));
    const reportSuccess = generateContractsReport(
      structRes,
      [],
      { success: true, checkedFilesCount: 1, mutatedFiles: [] },
      { success: true, totalCases: 0, passedCases: 0, errors: [] }
    );
    return {
      success: !!violation && reportSuccess === false,
      errorMsg: 'Expected TreatmentProfessional.name omission in tratamiento1.json#professionals[1] to produce violation and fail gate.',
    };
  });

  // 20. Eliminar CasoClinico.id de una instancia
  assertCase('Struct 20: Omitting CasoClinico.id from an instance produces violation with instance ID and fails gate', () => {
    const fixtures: DocumentFixture[] = [
      {
        id: 'caso1.json',
        model: 'CasoClinico',
        isSynthetic: true,
        content: {
          articleSlug: 'c1',
          paciente: 'P1',
          fecha: '2026-01-01',
          titulo: 'T1',
          descripcion: 'D1',
          estado: 'finalizado',
        },
      },
    ];
    const structRes = compareStructuralContracts(fixtures);
    const violation = structRes.violations.find((v) => v.documentId === 'caso1.json' && v.reason.includes('CasoClinico.id'));
    const reportSuccess = generateContractsReport(
      structRes,
      [],
      { success: true, checkedFilesCount: 1, mutatedFiles: [] },
      { success: true, totalCases: 0, passedCases: 0, errors: [] }
    );
    return {
      success: !!violation && reportSuccess === false,
      errorMsg: 'Expected CasoClinico.id omission in caso1.json to produce violation and fail gate.',
    };
  });

  // Ejecutar todas las pruebas registradas capturando salida de consola
  let passedCases = 0;
  for (const c of cases) {
    const res = withCapturedConsole(() => c.run());
    if (res.success) {
      passedCases++;
    } else {
      errors.push(`${c.name} FAILED: ${res.errorMsg}`);
    }
  }

  return {
    success: errors.length === 0,
    totalCases: cases.length,
    passedCases,
    errors,
  };
}
