export type FieldForm = 'scalar' | 'object' | 'list' | 'model';
export type FieldOrigin = 'persisted' | 'derived';
export type FieldPresenceJSON = 'All' | 'Some' | 'None';
export type FieldTSObligatory = 'Req' | 'Opt' | 'N/A';
export type FieldRuntimeValidation = 'Validated' | 'Partial' | 'NoVal';
export type FieldCMSObligatory = 'Req' | 'Opt' | 'N/A';
export type FieldState = 'safe' | 'blocked' | 'pending';

export interface FieldManifest {
  model: string;
  path: string;
  form: FieldForm;
  persistedType: string;
  jsonPresence: FieldPresenceJSON;
  tsObligatory: FieldTSObligatory;
  runtimeValidation: FieldRuntimeValidation;
  cmsObligatory: FieldCMSObligatory;
  constOrDiscriminant?: string;
  origin: FieldOrigin;
  editorialCondition?: string;
  state: FieldState;
  reason: string;
  slice: 'B' | 'C' | 'D' | '-';
}

export interface ModelManifest {
  name: string;
  type: 'page' | 'object';
  defaultStatus?: 'draft';
  creationState: 'disabled' | 'pending';
  fields: FieldManifest[];
}

/**
 * Manifest runtime neutral de contratos CMS.
 * No importa ni depende de tipos específicos de ningún proveedor visual (ej. Stackbit).
 * Cubre las 188 rutas inventariadas y los 31 modelos/objetos declarados.
 */
export const neutralManifests: Record<string, ModelManifest> = {
  // 3.1 HomePage & GlobalSettings (18 filas - Slice D)
  HomePage: {
    name: 'HomePage',
    type: 'page',
    creationState: 'pending',
    fields: [
      { model: 'HomePage', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: 'Cte:HomePage', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Presente en JSON, sin validación RT, ausente en CMS.', slice: 'D' },
      { model: 'HomePage', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Presente en JSON pero opcional en CMS y sin validador RT.', slice: 'D' },
      { model: 'HomePage', path: 'hero', form: 'object', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Presente en JSON, opcional en CMS, sin validador RT.', slice: 'D' },
      { model: 'HomePage', path: 'hero.title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Presente en JSON, opcional en CMS, sin validador RT.', slice: 'D' },
      { model: 'HomePage', path: 'hero.description', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Presente en JSON, opcional en CMS, sin validador RT.', slice: 'D' },
      { model: 'HomePage', path: 'hero.buttonPrimary', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Presente en JSON, opcional en CMS, sin validador RT.', slice: 'D' },
      { model: 'HomePage', path: 'hero.buttonSecondary', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Presente en JSON, opcional en CMS, sin validador RT.', slice: 'D' },
    ],
  },

  GlobalSettings: {
    name: 'GlobalSettings',
    type: 'page',
    creationState: 'pending',
    fields: [
      { model: 'GlobalSettings', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: 'Cte:GlobalSettings', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'contact', form: 'object', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'contact.whatsapp', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'contact.whatsappMessage', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'contact.email', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'contact.address', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'social', form: 'object', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'social.instagram', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'social.facebook', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'footer', form: 'object', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
      { model: 'GlobalSettings', path: 'footer.text', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice D).', slice: 'D' },
    ],
  },

  // 3.2 Tratamiento & TreatmentProfessional (18 filas)
  Tratamiento: {
    name: 'Tratamiento',
    type: 'page',
    creationState: 'pending',
    fields: [
      { model: 'Tratamiento', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:Tratamiento', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'id', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'category', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'categoryLabel', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'order', form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT, Opt en CMS.', slice: 'C' },
      { model: 'Tratamiento', path: 'tituloHero', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'descripcionHero', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'icon', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'TS asume req, CMS opcional, sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'heroImage', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Tipo persistido string. TS req, CMS opcional, sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'professionals', form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'C' },
      { model: 'Tratamiento', path: 'features', form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'TS asume req, CMS opcional, sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'casosClinicos', form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'TS asume req, CMS opcional, sin validador RT.', slice: 'C' },
      { model: 'Tratamiento', path: 'sourcePath', form: 'scalar', persistedType: 'string', jsonPresence: 'None', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'derived', editorialCondition: '-', state: 'safe', reason: 'Calculado en RT, ajeno a CMS.', slice: '-' },
    ],
  },

  TreatmentProfessional: {
    name: 'TreatmentProfessional',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'TreatmentProfessional', path: 'name', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'C' },
      { model: 'TreatmentProfessional', path: 'role', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'C' },
      { model: 'TreatmentProfessional', path: 'mobileRole', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'C' },
      { model: 'TreatmentProfessional', path: 'image', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'C' },
      { model: 'TreatmentProfessional', path: 'imageAlt', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'C' },
    ],
  },

  // 3.3 CasoClinico (20 filas)
  CasoClinico: {
    name: 'CasoClinico',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'CasoClinico', path: 'id', form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Falta validador RT (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'articleSlug', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'opcional', state: 'blocked', reason: 'Falta validador RT (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'paciente', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Falta validador RT (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'fecha', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'titulo', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Falta validador RT (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'descripcion', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Falta validador RT (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'imagenAntes', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Falta validador RT (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'imagenDespues', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Falta validador RT (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'imagenes', form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'etiquetasImagenes', form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'estado', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'testimonio', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Falta validador RT (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'desafio', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'diagnostico', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'duracion', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'solucion', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'solucionFeatures', form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'stats', form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'stats[].value', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
      { model: 'CasoClinico', path: 'stats[].label', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'N/A', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta en CMS (Slice C).', slice: 'C' },
    ],
  },

  // 3.4 Articulo & Objetos Anidados (82 filas)
  Articulo: {
    name: 'Articulo',
    type: 'page',
    creationState: 'pending',
    defaultStatus: 'draft',
    fields: [
      { model: 'Articulo', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:Articulo', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'id', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'slug', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'category', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'categoryLabel', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'serviceIds', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'titlePrefix', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'breadcrumbLabel', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'excerpt', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'author', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'clinicalReviewer', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'opcional', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'Articulo', path: 'status', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'estado', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'createdAt', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'blocked', reason: 'Falta en CMS, sin validador RT.', slice: 'B' },
      { model: 'Articulo', path: 'publishedAt', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'blocked', reason: 'Req en RT, Opt en CMS.', slice: 'B' },
      { model: 'Articulo', path: 'updatedAt', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'readTime', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'tags', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Req en RT, Opt en CMS.', slice: 'B' },
      { model: 'Articulo', path: 'heroImage', form: 'model', persistedType: 'object', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'sources', form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'downloads', form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Modelo ArticleDownload ausente en CMS (Slice B).', slice: 'B' },
      { model: 'Articulo', path: 'sections', form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Articulo', path: 'sourcePath', form: 'scalar', persistedType: 'string', jsonPresence: 'None', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'derived', editorialCondition: '-', state: 'safe', reason: 'Calculado en RT, ajeno a CMS.', slice: '-' },
    ],
  },
  ArticleImage: {
    name: 'ArticleImage',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleImage', path: 'src', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Tipo persistido string. Paridad OK.', slice: 'B' },
      { model: 'ArticleImage', path: 'alt', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleImage', path: 'width', form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleImage', path: 'height', form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleImage', path: 'label', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'ArticleImage', path: 'caption', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Presente en CMS (text) y JSON, pero sin validador RT.', slice: 'B' },
    ],
  },
  ArticleSource: {
    name: 'ArticleSource',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleSource', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleSource', path: 'publisher', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleSource', path: 'url', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleDownload: {
    name: 'ArticleDownload',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleDownload', path: 'name', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta modelo en CMS (Slice B).', slice: 'B' },
      { model: 'ArticleDownload', path: 'url', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'pending', reason: 'Falta modelo en CMS (Slice B).', slice: 'B' },
    ],
  },
  ArticleCaseSummarySection: {
    name: 'ArticleCaseSummarySection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleCaseSummarySection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:case_summary', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCaseSummarySection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCaseSummarySection', path: 'paragraphs', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCaseSummarySection', path: 'facts', form: 'list', persistedType: 'object[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCaseSummarySection', path: 'approach', form: 'model', persistedType: 'object', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleCaseFact: {
    name: 'ArticleCaseFact',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleCaseFact', path: 'label', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCaseFact', path: 'value', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleCaseApproach: {
    name: 'ArticleCaseApproach',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleCaseApproach', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCaseApproach', path: 'text', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCaseApproach', path: 'items', form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleTextSection: {
    name: 'ArticleTextSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleTextSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:text', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleTextSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'ArticleTextSection', path: 'paragraphs', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleListSection: {
    name: 'ArticleListSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleListSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:list', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleListSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleListSection', path: 'intro', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'ArticleListSection', path: 'items', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleComparisonSection: {
    name: 'ArticleComparisonSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleComparisonSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:comparison', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleComparisonSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleComparisonSection', path: 'intro', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'ArticleComparisonSection', path: 'columns', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleComparisonSection', path: 'rows', form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleComparisonRow: {
    name: 'ArticleComparisonRow',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleComparisonRow', path: 'label', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleComparisonRow', path: 'values', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleStatsSection: {
    name: 'ArticleStatsSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleStatsSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:stats', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleStatsSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'ArticleStatsSection', path: 'items', form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleStat: {
    name: 'ArticleStat',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleStat', path: 'value', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT en items.', slice: 'B' },
      { model: 'ArticleStat', path: 'label', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT en items.', slice: 'B' },
      { model: 'ArticleStat', path: 'description', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
    ],
  },
  ArticleGallerySection: {
    name: 'ArticleGallerySection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleGallerySection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:gallery', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleGallerySection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'ArticleGallerySection', path: 'intro', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'ArticleGallerySection', path: 'images', form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleFaqSection: {
    name: 'ArticleFaqSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleFaqSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:faq', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleFaqSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleFaqSection', path: 'items', form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  ArticleFaqItem: {
    name: 'ArticleFaqItem',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleFaqItem', path: 'question', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT en items.', slice: 'B' },
      { model: 'ArticleFaqItem', path: 'answer', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'NoVal', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT en items.', slice: 'B' },
    ],
  },
  ArticleQuoteSection: {
    name: 'ArticleQuoteSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleQuoteSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:quote', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleQuoteSection', path: 'quote', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleQuoteSection', path: 'attribution', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
    ],
  },
  ArticleCtaSection: {
    name: 'ArticleCtaSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'ArticleCtaSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:cta', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCtaSection', path: 'label', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'ArticleCtaSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCtaSection', path: 'text', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCtaSection', path: 'href', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'ArticleCtaSection', path: 'buttonLabel', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },

  // 3.5 Instruccion & Objetos Anidados (50 filas)
  Instruccion: {
    name: 'Instruccion',
    type: 'page',
    defaultStatus: 'draft',
    creationState: 'pending',
    fields: [
      { model: 'Instruccion', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:Instruccion', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'id', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'slug', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'category', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'categoryLabel', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'serviceId', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validación runtime de tipo o formato.', slice: 'B' },
      { model: 'Instruccion', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'excerpt', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'status', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'estado', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'createdAt', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'blocked', reason: 'Persistido en JSON, ausente en CMS y sin validador RT.', slice: 'B' },
      { model: 'Instruccion', path: 'publishedAt', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'blocked', reason: 'Req en RT si status=published, Opt en CMS.', slice: 'B' },
      { model: 'Instruccion', path: 'updatedAt', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'meta', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'clinicalReviewer', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: 'opcional', state: 'blocked', reason: 'Req en RT si status=published, Opt en CMS.', slice: 'B' },
      { model: 'Instruccion', path: 'tags', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Req en RT, Opt en CMS.', slice: 'B' },
      { model: 'Instruccion', path: 'readTime', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'heroLabel', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'Instruccion', path: 'resourceImage', form: 'model', persistedType: 'object', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'resourceGallery', form: 'model', persistedType: 'object', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'socialImage', form: 'model', persistedType: 'object', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'sections', form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'Instruccion', path: 'sourcePath', form: 'scalar', persistedType: 'string', jsonPresence: 'None', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'N/A', constOrDiscriminant: '-', origin: 'derived', editorialCondition: '-', state: 'safe', reason: 'Calculado en RT, ajeno a CMS.', slice: '-' },
    ],
  },
  InstructionImage: {
    name: 'InstructionImage',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'InstructionImage', path: 'src', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Tipo persistido string. Paridad OK.', slice: 'B' },
      { model: 'InstructionImage', path: 'alt', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionImage', path: 'width', form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionImage', path: 'height', form: 'scalar', persistedType: 'number', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionImage', path: 'label', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'InstructionImage', path: 'downloadLabel', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'InstructionImage', path: 'downloadSrc', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  InstructionResourceGallery: {
    name: 'InstructionResourceGallery',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'InstructionResourceGallery', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionResourceGallery', path: 'intro', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionResourceGallery', path: 'images', form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  InstructionStepsSection: {
    name: 'InstructionStepsSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'InstructionStepsSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:steps', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionStepsSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'InstructionStepsSection', path: 'intro', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'InstructionStepsSection', path: 'items', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  InstructionMatrixSection: {
    name: 'InstructionMatrixSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'InstructionMatrixSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:matrix', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionMatrixSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'InstructionMatrixSection', path: 'intro', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'InstructionMatrixSection', path: 'groups', form: 'list', persistedType: 'object[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  InstructionMatrixGroup: {
    name: 'InstructionMatrixGroup',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'InstructionMatrixGroup', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionMatrixGroup', path: 'yes', form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionMatrixGroup', path: 'caution', form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionMatrixGroup', path: 'no', form: 'list', persistedType: 'string[]', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'Validated', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  InstructionNoticeSection: {
    name: 'InstructionNoticeSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'InstructionNoticeSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:notice', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionNoticeSection', path: 'tone', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionNoticeSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionNoticeSection', path: 'text', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
  InstructionTextSection: {
    name: 'InstructionTextSection',
    type: 'object',
    creationState: 'disabled',
    fields: [
      { model: 'InstructionTextSection', path: 'type', form: 'scalar', persistedType: 'string', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: 'Cte:text', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
      { model: 'InstructionTextSection', path: 'title', form: 'scalar', persistedType: 'string', jsonPresence: 'Some', tsObligatory: 'Opt', runtimeValidation: 'NoVal', cmsObligatory: 'Opt', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'blocked', reason: 'Sin validador RT.', slice: 'B' },
      { model: 'InstructionTextSection', path: 'paragraphs', form: 'list', persistedType: 'string[]', jsonPresence: 'All', tsObligatory: 'Req', runtimeValidation: 'Validated', cmsObligatory: 'Req', constOrDiscriminant: '-', origin: 'persisted', editorialCondition: '-', state: 'safe', reason: 'Paridad OK.', slice: 'B' },
    ],
  },
};
