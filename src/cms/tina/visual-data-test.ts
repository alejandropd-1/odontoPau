import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import homeJson from '../../data/home.json';
import treatmentsPageJson from '../../data/tratamientos-page.json';
import { articles, publishedArticles } from '../../data/articulos';
import { instrucciones } from '../../data/instrucciones';
import type { HomePageData, TreatmentsPageData } from '../../data/site-pages';
import { validateHomePageData, validateTreatmentsPageData } from '../../data/site-pages';
import { getTratamientos } from '../../data/tratamientos';
import { loadRealJsonDocuments } from '../fixtures';
import { projectFixturesToHistoricalBaseline } from '../historical-fixture-projection';
import {
  articleCollection,
  homePageCollection,
  instructionCollection,
  treatmentCollection,
  treatmentsPageCollection,
} from './collections';
import {
  ARTICLE_VISUAL_QUERY,
  HOME_VISUAL_QUERY,
  INSTRUCTION_VISUAL_QUERY,
  TREATMENT_VISUAL_QUERY,
  TREATMENTS_PAGE_VISUAL_QUERY,
  articleFromVisualData,
  createArticleVisualPayload,
  createHomeVisualPayload,
  createInstructionVisualPayload,
  createTreatmentVisualPayload,
  createTreatmentsPageVisualPayload,
  homeFromVisualData,
  instructionFromVisualData,
  treatmentFromVisualData,
  treatmentsPageFromVisualData,
} from './visual-data';
import type { VisualRecord } from './visual-data';

const home: HomePageData = validateHomePageData(homeJson);
const treatmentsPage: TreatmentsPageData = validateTreatmentsPageData(treatmentsPageJson);
const treatment = getTratamientos()[0];
const article = articles[0];
const instruction = instrucciones[0];

const articlesBySlug = new Map(articles.map((item) => [item.slug, item]));
const publishedArticlesBySlug = new Map(publishedArticles.map((item) => [item.slug, item]));
const clinicalCases = getTratamientos().flatMap((item) =>
  item.casosClinicos.map((clinicalCase) => ({ treatment: item, clinicalCase }))
);
assert.ok(clinicalCases.length > 0, 'Debe existir al menos un caso clínico para auditar.');
for (const { treatment: caseTreatment, clinicalCase } of clinicalCases) {
  assert.ok(
    clinicalCase.articleSlug,
    `El caso ${caseTreatment.id}/${clinicalCase.id} necesita un articleSlug canónico.`
  );
  const canonicalArticle = articlesBySlug.get(clinicalCase.articleSlug);
  assert.ok(
    canonicalArticle,
    `El caso ${caseTreatment.id}/${clinicalCase.id} referencia un artículo inexistente.`
  );
  assert.equal(
    publishedArticlesBySlug.has(canonicalArticle.slug),
    canonicalArticle.status === 'published',
    `La relación pública del caso ${caseTreatment.id}/${clinicalCase.id} debe respetar el estado editorial del artículo.`
  );
  assert.equal(
    clinicalCase.titulo,
    canonicalArticle.title,
    `El título del caso ${caseTreatment.id}/${clinicalCase.id} debe coincidir con su artículo.`
  );
}

const homePayload = createHomeVisualPayload(home);
const treatmentsPagePayload = createTreatmentsPageVisualPayload(treatmentsPage);
const treatmentPayload = createTreatmentVisualPayload(treatment);
const articlePayload = createArticleVisualPayload(article);
const instructionPayload = createInstructionVisualPayload(instruction);

assert.deepEqual(homeFromVisualData(homePayload.data.homepage, home), home);
assert.deepEqual(
  treatmentsPageFromVisualData(treatmentsPagePayload.data.treatmentspage, treatmentsPage),
  treatmentsPage
);
assert.deepEqual(treatmentFromVisualData(treatmentPayload.data.tratamiento, treatment), treatment);
assert.deepEqual(articleFromVisualData(articlePayload.data.articulo, article), article);
assert.deepEqual(instructionFromVisualData(instructionPayload.data.instruccion, instruction), instruction);

const currentFixtures = loadRealJsonDocuments();
const historicalFixtures = projectFixturesToHistoricalBaseline(currentFixtures);
const currentHome = currentFixtures.find((fixture) => fixture.model === 'HomePage');
const projectedHome = historicalFixtures.find((fixture) => fixture.model === 'HomePage');
const currentTreatment = currentFixtures.find((fixture) => fixture.model === 'Tratamiento');
const projectedTreatment = historicalFixtures.find((fixture) => fixture.model === 'Tratamiento');
assert.ok(currentFixtures.some((fixture) => fixture.model === 'TreatmentsPage'));
assert.equal(historicalFixtures.some((fixture) => fixture.model === 'TreatmentsPage'), false);
assert.ok((currentHome?.content as VisualRecord).services);
assert.equal((projectedHome?.content as VisualRecord).services, undefined);
assert.ok((currentTreatment?.content as VisualRecord).pageCopy);
assert.equal((projectedTreatment?.content as VisualRecord).pageCopy, undefined);

for (const query of [
  HOME_VISUAL_QUERY,
  TREATMENTS_PAGE_VISUAL_QUERY,
  TREATMENT_VISUAL_QUERY,
  ARTICLE_VISUAL_QUERY,
  INSTRUCTION_VISUAL_QUERY,
]) {
  assert.match(query, /relativePath: \$relativePath/);
  assert.match(query, /_sys \{ filename relativePath \}/);
}

assert.equal(homePageCollection.ui?.router?.({ document: {} } as never), '/inicio-editorial');
assert.equal(treatmentsPageCollection.ui?.router?.({ document: {} } as never), '/tratamientos');
assert.equal(
  treatmentCollection.ui?.router?.({ document: { _sys: { filename: 'estetica-dental' } } } as never),
  '/tratamientos/estetica-dental'
);
assert.equal(
  articleCollection.ui?.router?.({ document: { _sys: { filename: 'articulo-prueba' } } } as never),
  '/articulos/articulo-prueba'
);
assert.equal(
  instructionCollection.ui?.router?.({
    document: { _sys: { filename: 'instruccion-prueba', breadcrumbs: ['ortodoncia', 'instruccion-prueba'] } },
  } as never),
  '/instrucciones/ortodoncia/instruccion-prueba'
);

const treatmentSource = fs.readFileSync(
  path.join(process.cwd(), 'src', 'components', 'TreatmentDetailContent.tsx'),
  'utf8'
);
const casePageSource = fs.readFileSync(
  path.join(process.cwd(), 'src', 'app', 'tratamientos', '[id]', 'casos', '[casoId]', 'page.tsx'),
  'utf8'
);
const sitemapSource = fs.readFileSync(
  path.join(process.cwd(), 'src', 'app', 'sitemap.ts'),
  'utf8'
);
assert.doesNotMatch(treatmentSource, /href=\{`\/tratamientos\/\$\{tratamiento\.id\}\/casos\/\$\{caso\.id\}`\}/);
assert.match(treatmentSource, /href=\{`\/articulos\/\$\{caseArticle\.slug\}`\}/);
assert.match(casePageSource, /permanentRedirect\(`\/articulos\/\$\{linkedArticle\.slug\}`\)/);
assert.doesNotMatch(casePageSource, /CaseDetailContent/);
assert.doesNotMatch(sitemapSource, /caseUrls|\/tratamientos\/\$\{t\.id\}\/casos/);
assert.equal(fs.existsSync(path.join(process.cwd(), 'src', 'components', 'CaseDetailContent.tsx')), false);

console.log('--- Tina Visual Editing contract ---');
console.log('- Superficies: Inicio, Servicios, detalle de servicio, Artículo e Instrucción.');
console.log('- Normalización inicial/editor: round-trip semántico sin pérdida.');
console.log('- Routers: 5/5 resuelven una preview local no productiva.');
console.log(`- Casos: ${clinicalCases.length}/${clinicalCases.length} conservan su relación editorial y sólo exponen artículos publicados; sin fichas ni enlaces legacy.`);
console.log('- Consultas: versionadas y dirigidas por relativePath.');
console.log('- Baseline histórica: preservada; contrato institucional Tina validado por separado.');
