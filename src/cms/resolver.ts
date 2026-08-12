/**
 * Módulo compartido de resolución de modelos, discriminantes y objetos anidados para el comparador estructural y el round-trip.
 */

export const DISCRIMINANT_TO_MODEL: Record<string, string> = {
  // Secciones de Articulo
  case_summary: 'ArticleCaseSummarySection',
  list: 'ArticleListSection',
  comparison: 'ArticleComparisonSection',
  stats: 'ArticleStatsSection',
  gallery: 'ArticleGallerySection',
  faq: 'ArticleFaqSection',
  quote: 'ArticleQuoteSection',
  cta: 'ArticleCtaSection',
  // Secciones de Instruccion
  steps: 'InstructionStepsSection',
  matrix: 'InstructionMatrixSection',
  notice: 'InstructionNoticeSection',
};

export const ROUTE_TARGET_MODELS: Record<string, string> = {
  'HomePage.hero': 'HomePageHero',
  'GlobalSettings.contact': 'GlobalSettingsContact',
  'GlobalSettings.social': 'GlobalSettingsSocial',
  'GlobalSettings.footer': 'GlobalSettingsFooter',
  'Tratamiento.professionals': 'TreatmentProfessional',
  'Tratamiento.casosClinicos': 'CasoClinico',
  'Articulo.heroImage': 'ArticleImage',
  'Articulo.sources': 'ArticleSource',
  'Articulo.downloads': 'ArticleDownload',
  'ArticleCaseSummarySection.facts': 'ArticleCaseFact',
  'ArticleCaseSummarySection.approach': 'ArticleCaseApproach',
  'ArticleComparisonSection.rows': 'ArticleComparisonRow',
  'ArticleStatsSection.items': 'ArticleStat',
  'ArticleGallerySection.images': 'ArticleImage',
  'ArticleFaqSection.items': 'ArticleFaqItem',
  'Instruccion.resourceImage': 'InstructionImage',
  'Instruccion.resourceGallery': 'InstructionResourceGallery',
  'Instruccion.socialImage': 'InstructionImage',
  'InstructionResourceGallery.images': 'InstructionImage',
  'InstructionMatrixSection.groups': 'InstructionMatrixGroup',
};

/**
 * Resuelve el nombre del modelo anidado a partir de un valor discriminante y su modelo padre.
 */
export function resolveDiscriminantModel(discriminant: string, parentModel: string): string | undefined {
  if (discriminant === 'text') {
    if (parentModel === 'Instruccion' || parentModel.startsWith('Instruction')) {
      return 'InstructionTextSection';
    }
    return 'ArticleTextSection';
  }
  return DISCRIMINANT_TO_MODEL[discriminant] || discriminant;
}

/**
 * Resuelve el modelo objetivo para un objeto o elemento de lista según la ruta contractual.
 */
export function resolveTargetModel(parentModel: string, propName: string, itemDiscriminant?: string): string | undefined {
  if (itemDiscriminant) {
    const resolved = resolveDiscriminantModel(itemDiscriminant, parentModel);
    if (resolved) return resolved;
  }
  const routeKey = `${parentModel}.${propName}`;
  return ROUTE_TARGET_MODELS[routeKey];
}
