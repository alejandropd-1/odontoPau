/**
 * Línea base contractual independiente y versionada para la validación de contratos CMS.
 * Contiene los 31 modelos neutrales y las 188 rutas de campo aprobadas con sus 11 atributos.
 */

export interface BaselineField {
  form: string;
  persistedType: string;
  jsonPresence: string;
  tsObligatory: string;
  runtimeValidation: string;
  cmsObligatory: string;
  constOrDiscriminant: string;
  origin: string;
  editorialCondition: string;
  state: string;
  slice: string;
}

export interface BaselineModel {
  name: string;
  type: 'page' | 'object';
  creationState: 'disabled' | 'pending';
  defaultStatus?: 'draft';
}

export const CONTRACT_BASELINE_MODELS: Record<string, BaselineModel> = {
  HomePage: { name: 'HomePage', type: 'page', creationState: 'pending' },
  GlobalSettings: { name: 'GlobalSettings', type: 'page', creationState: 'pending' },
  Tratamiento: { name: 'Tratamiento', type: 'page', creationState: 'pending' },
  TreatmentProfessional: { name: 'TreatmentProfessional', type: 'object', creationState: 'disabled' },
  CasoClinico: { name: 'CasoClinico', type: 'object', creationState: 'disabled' },
  Articulo: { name: 'Articulo', type: 'page', creationState: 'pending', defaultStatus: 'draft' },
  ArticleImage: { name: 'ArticleImage', type: 'object', creationState: 'disabled' },
  ArticleSource: { name: 'ArticleSource', type: 'object', creationState: 'disabled' },
  ArticleDownload: { name: 'ArticleDownload', type: 'object', creationState: 'disabled' },
  ArticleCaseSummarySection: { name: 'ArticleCaseSummarySection', type: 'object', creationState: 'disabled' },
  ArticleCaseFact: { name: 'ArticleCaseFact', type: 'object', creationState: 'disabled' },
  ArticleCaseApproach: { name: 'ArticleCaseApproach', type: 'object', creationState: 'disabled' },
  ArticleTextSection: { name: 'ArticleTextSection', type: 'object', creationState: 'disabled' },
  ArticleListSection: { name: 'ArticleListSection', type: 'object', creationState: 'disabled' },
  ArticleComparisonSection: { name: 'ArticleComparisonSection', type: 'object', creationState: 'disabled' },
  ArticleComparisonRow: { name: 'ArticleComparisonRow', type: 'object', creationState: 'disabled' },
  ArticleStatsSection: { name: 'ArticleStatsSection', type: 'object', creationState: 'disabled' },
  ArticleStat: { name: 'ArticleStat', type: 'object', creationState: 'disabled' },
  ArticleGallerySection: { name: 'ArticleGallerySection', type: 'object', creationState: 'disabled' },
  ArticleFaqSection: { name: 'ArticleFaqSection', type: 'object', creationState: 'disabled' },
  ArticleFaqItem: { name: 'ArticleFaqItem', type: 'object', creationState: 'disabled' },
  ArticleQuoteSection: { name: 'ArticleQuoteSection', type: 'object', creationState: 'disabled' },
  ArticleCtaSection: { name: 'ArticleCtaSection', type: 'object', creationState: 'disabled' },
  Instruccion: { name: 'Instruccion', type: 'page', creationState: 'pending', defaultStatus: 'draft' },
  InstructionImage: { name: 'InstructionImage', type: 'object', creationState: 'disabled' },
  InstructionResourceGallery: { name: 'InstructionResourceGallery', type: 'object', creationState: 'disabled' },
  InstructionStepsSection: { name: 'InstructionStepsSection', type: 'object', creationState: 'disabled' },
  InstructionMatrixSection: { name: 'InstructionMatrixSection', type: 'object', creationState: 'disabled' },
  InstructionMatrixGroup: { name: 'InstructionMatrixGroup', type: 'object', creationState: 'disabled' },
  InstructionNoticeSection: { name: 'InstructionNoticeSection', type: 'object', creationState: 'disabled' },
  InstructionTextSection: { name: 'InstructionTextSection', type: 'object', creationState: 'disabled' },
};

export const CONTRACT_BASELINE_FIELDS: Record<string, BaselineField> = {
  // 3.1 HomePage & GlobalSettings (Slice D - 18 filas)
  'HomePage.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: 'Cte:HomePage', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'D' },
  'HomePage.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'D' },
  'HomePage.hero': { form: 'object', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'D' },
  'HomePage.hero.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'D' },
  'HomePage.hero.description': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'D' },
  'HomePage.hero.buttonPrimary': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'D' },
  'HomePage.hero.buttonSecondary': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'D' },
  'GlobalSettings.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: 'Cte:GlobalSettings', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.contact': { form: 'object', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.contact.whatsapp': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.contact.whatsappMessage': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.contact.email': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.contact.address': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.social': { form: 'object', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.social.instagram': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.social.facebook': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.footer': { form: 'object', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },
  'GlobalSettings.footer.text': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'D' },

  // 3.2 Tratamiento & TreatmentProfessional (Slice C - 18 filas)
  'Tratamiento.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:Tratamiento', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.id': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.category': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.categoryLabel': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.order': { form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.tituloHero': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.descripcionHero': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.icon': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.heroImage': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.professionals': { form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'C' },
  'Tratamiento.features': { form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.casosClinicos': { form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'Tratamiento.sourcePath': { form: 'scalar', persistedType: 'string', jsonPresence: 'None', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'derived', editorialCondition: '-', state: 'safe', slice: '-' },

  'TreatmentProfessional.name': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'C' },
  'TreatmentProfessional.role': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'C' },
  'TreatmentProfessional.mobileRole': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'C' },
  'TreatmentProfessional.image': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'C' },
  'TreatmentProfessional.imageAlt': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'C' },

  // 3.3 CasoClinico (Slice C - 20 filas)
  'CasoClinico.id': { form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'CasoClinico.articleSlug': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'opcional', state: 'blocked', slice: 'C' },
  'CasoClinico.paciente': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'CasoClinico.fecha': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.titulo': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'CasoClinico.descripcion': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'CasoClinico.imagenAntes': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'CasoClinico.imagenDespues': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'CasoClinico.imagenes': { form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.etiquetasImagenes': { form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.estado': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.testimonio': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'C' },
  'CasoClinico.desafio': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.diagnostico': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.duracion': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.solucion': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.solucionFeatures': { form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.stats': { form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.stats[].value': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },
  'CasoClinico.stats[].label': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'C' },

  // 3.4 Articulo & Objetos Anidados (82 filas)
  'Articulo.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:Articulo', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.id': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.slug': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.category': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.categoryLabel': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.serviceIds': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.titlePrefix': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.breadcrumbLabel': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.excerpt': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.author': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.clinicalReviewer': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'opcional', state: 'blocked', slice: 'B' },
  'Articulo.status': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'estado', state: 'safe', slice: 'B' },
  'Articulo.createdAt': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'blocked', slice: 'B' },
  'Articulo.publishedAt': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'blocked', slice: 'B' },
  'Articulo.updatedAt': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'safe', slice: 'B' },
  'Articulo.readTime': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.tags': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'Articulo.heroImage': { form: 'model', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.sources': { form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.downloads': { form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'B' },
  'Articulo.sections': { form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Articulo.sourcePath': { form: 'scalar', persistedType: 'string', jsonPresence: 'None', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'derived', editorialCondition: '-', state: 'safe', slice: '-' },

  // ArticleImage (6)
  'ArticleImage.src': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleImage.alt': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleImage.width': { form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleImage.height': { form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleImage.label': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleImage.caption': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },

  // ArticleSource (3)
  'ArticleSource.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleSource.publisher': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleSource.url': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleDownload (2)
  'ArticleDownload.name': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'B' },
  'ArticleDownload.url': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', slice: 'B' },

  // ArticleCaseSummarySection (5)
  'ArticleCaseSummarySection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:case_summary', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCaseSummarySection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCaseSummarySection.paragraphs': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCaseSummarySection.facts': { form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCaseSummarySection.approach': { form: 'model', persistedType: 'object', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleCaseFact (2)
  'ArticleCaseFact.label': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCaseFact.value': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleCaseApproach (3)
  'ArticleCaseApproach.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCaseApproach.text': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCaseApproach.items': { form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleTextSection (3)
  'ArticleTextSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:text', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleTextSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleTextSection.paragraphs': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleListSection (4)
  'ArticleListSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:list', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleListSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleListSection.intro': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleListSection.items': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleComparisonSection (5)
  'ArticleComparisonSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:comparison', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleComparisonSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleComparisonSection.intro': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleComparisonSection.columns': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleComparisonSection.rows': { form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleComparisonRow (2)
  'ArticleComparisonRow.label': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleComparisonRow.values': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleStatsSection (3)
  'ArticleStatsSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:stats', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleStatsSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleStatsSection.items': { form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleStat (3)
  'ArticleStat.value': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleStat.label': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleStat.description': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },

  // ArticleGallerySection (4)
  'ArticleGallerySection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:gallery', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleGallerySection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleGallerySection.intro': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleGallerySection.images': { form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleFaqSection (3)
  'ArticleFaqSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:faq', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleFaqSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleFaqSection.items': { form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // ArticleFaqItem (2)
  'ArticleFaqItem.question': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleFaqItem.answer': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },

  // ArticleQuoteSection (3)
  'ArticleQuoteSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:quote', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleQuoteSection.quote': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleQuoteSection.attribution': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },

  // ArticleCtaSection (6)
  'ArticleCtaSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:cta', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCtaSection.label': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'ArticleCtaSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCtaSection.text': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCtaSection.href': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'ArticleCtaSection.buttonLabel': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // 3.5 Instruccion & Objetos Anidados (50 filas)
  'Instruccion.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:Instruccion', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.id': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.slug': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.category': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.categoryLabel': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.serviceId': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'Instruccion.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.excerpt': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.status': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'estado', state: 'safe', slice: 'B' },
  'Instruccion.createdAt': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'blocked', slice: 'B' },
  'Instruccion.publishedAt': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'blocked', slice: 'B' },
  'Instruccion.updatedAt': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'safe', slice: 'B' },
  'Instruccion.clinicalReviewer': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'opcional', state: 'blocked', slice: 'B' },
  'Instruccion.tags': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'Instruccion.readTime': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.heroLabel': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'Instruccion.resourceImage': { form: 'model', persistedType: 'object', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.resourceGallery': { form: 'model', persistedType: 'object', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.socialImage': { form: 'model', persistedType: 'object', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.sections': { form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'Instruccion.sourcePath': { form: 'scalar', persistedType: 'string', jsonPresence: 'None', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'derived', editorialCondition: '-', state: 'safe', slice: '-' },

  // InstructionImage (7)
  'InstructionImage.src': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionImage.alt': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionImage.width': { form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionImage.height': { form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionImage.label': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'InstructionImage.downloadLabel': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'InstructionImage.downloadSrc': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // InstructionResourceGallery (3)
  'InstructionResourceGallery.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionResourceGallery.intro': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionResourceGallery.images': { form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // InstructionStepsSection (4)
  'InstructionStepsSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:steps', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionStepsSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'InstructionStepsSection.intro': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'InstructionStepsSection.items': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // InstructionMatrixSection (4)
  'InstructionMatrixSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:matrix', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionMatrixSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'InstructionMatrixSection.intro': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'InstructionMatrixSection.groups': { form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // InstructionMatrixGroup (4)
  'InstructionMatrixGroup.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionMatrixGroup.yes': { form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionMatrixGroup.caution': { form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionMatrixGroup.no': { form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // InstructionNoticeSection (4)
  'InstructionNoticeSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:notice', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionNoticeSection.tone': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionNoticeSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionNoticeSection.text': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },

  // InstructionTextSection (3)
  'InstructionTextSection.type': { form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:text', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
  'InstructionTextSection.title': { form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', slice: 'B' },
  'InstructionTextSection.paragraphs': { form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', slice: 'B' },
};
