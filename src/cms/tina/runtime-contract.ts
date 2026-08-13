import { CONTRACT_BASELINE_FIELDS, type BaselineField } from '../baseline';

/**
 * Rutas de Slice B cuya brecha histórica quedó cerrada por los validadores
 * runtime y/o el adaptador Tina de este cambio. La línea base Stackbit se
 * conserva intacta como evidencia; este overlay representa el proveedor vigente.
 */
export const TINA_RESOLVED_SLICE_B_ROUTES = new Set([
  'Articulo.clinicalReviewer',
  'Articulo.createdAt',
  'Articulo.publishedAt',
  'Articulo.tags',
  'Articulo.downloads',
  'ArticleImage.label',
  'ArticleImage.caption',
  'ArticleDownload.name',
  'ArticleDownload.url',
  'ArticleTextSection.title',
  'ArticleListSection.intro',
  'ArticleComparisonSection.intro',
  'ArticleStatsSection.title',
  'ArticleStat.value',
  'ArticleStat.label',
  'ArticleStat.description',
  'ArticleGallerySection.title',
  'ArticleGallerySection.intro',
  'ArticleFaqItem.question',
  'ArticleFaqItem.answer',
  'ArticleQuoteSection.attribution',
  'ArticleCtaSection.label',
  'Instruccion.serviceId',
  'Instruccion.createdAt',
  'Instruccion.publishedAt',
  'Instruccion.clinicalReviewer',
  'Instruccion.tags',
  'Instruccion.heroLabel',
  'InstructionImage.label',
  'InstructionImage.downloadLabel',
  'InstructionStepsSection.title',
  'InstructionStepsSection.intro',
  'InstructionMatrixSection.title',
  'InstructionMatrixSection.intro',
  'InstructionTextSection.title',
]);

export interface TinaCurrentContractField extends BaselineField {
  historicalState: BaselineField['state'];
  state: 'safe';
  runtimeValidation: 'Validated';
}

export const TINA_SLICE_B_CURRENT_CONTRACT: Record<string, TinaCurrentContractField> =
  Object.fromEntries(
    Object.entries(CONTRACT_BASELINE_FIELDS)
      .filter(([, field]) => field.slice === 'B')
      .map(([route, field]) => [
        route,
        {
          ...field,
          historicalState: field.state,
          state: 'safe' as const,
          runtimeValidation: 'Validated' as const,
        },
      ])
  );

export function assertTinaRuntimeOverlayComplete(): void {
  const historicalFindings = Object.entries(CONTRACT_BASELINE_FIELDS)
    .filter(([, field]) => field.slice === 'B' && field.state !== 'safe')
    .map(([route]) => route)
    .sort();
  const resolved = [...TINA_RESOLVED_SLICE_B_ROUTES].sort();

  if (JSON.stringify(historicalFindings) !== JSON.stringify(resolved)) {
    throw new Error(
      `El overlay Tina no coincide con las brechas históricas. Históricas=${historicalFindings.length}, resueltas=${resolved.length}.`
    );
  }
}
