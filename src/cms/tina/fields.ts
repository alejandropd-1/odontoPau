import { InfoBox } from 'tinacms';
import type { TinaField, Template } from 'tinacms';

import {
  EditorialCheckboxGroupField,
  EditorialChipField,
  EditorialDateField,
  EditorialSelectField,
  EditorialTextField,
  EditorialTextareaField,
  NestedEditorHelpComponent,
} from './editorial-fields';

export const STATUS_OPTIONS = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Revisión clínica', value: 'clinical_review' },
  { label: 'Revisión técnica', value: 'technical_review' },
  { label: 'Aprobado', value: 'approved' },
  { label: 'Publicado', value: 'published' },
];

const editorialSelect = (options: typeof STATUS_OPTIONS) => ({
  component: EditorialSelectField,
});

const editorialDate = (required = false) => ({
  component: EditorialDateField,
  validate: validateIsoDate,
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
});

export const CATEGORY_OPTIONS = [
  { label: 'Blanqueamiento', value: 'blanqueamiento' },
  { label: 'Cirugía', value: 'cirugia' },
  { label: 'Endodoncia', value: 'endodoncia' },
  { label: 'Estética dental', value: 'estetica-dental' },
  { label: 'Ortodoncia', value: 'ortodoncia' },
  { label: 'Ortodoncia invisible', value: 'ortodoncia-invisible' },
  { label: 'Ortopedia', value: 'ortopedia' },
  { label: 'Odontología pediátrica', value: 'pediatria' },
  { label: 'Rehabilitación', value: 'rehabilitacion' },
];

export const SERVICE_OPTIONS = [
  { label: 'Endodoncia', value: 'endodoncia' },
  { label: 'Estética dental', value: 'estetica-dental' },
  { label: 'Ortodoncia invisible', value: 'ortodoncia-invisible' },
  { label: 'Ortopedia', value: 'ortopedia' },
  { label: 'Odontología pediátrica', value: 'pediatria' },
  { label: 'Rehabilitación', value: 'rehabilitacion' },
];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const publicAssetPattern = /^\/(?:images|videos|downloads)\/[a-zA-Z0-9/_.,+() -]+$/;
const allowedDownloadExtensionPattern = /\.(?:pdf|mp4|webp|png|jpe?g)$/i;
const externalUrlPattern = /^https:\/\//;

export function validateRequiredText(value: string | undefined): string | void {
  if (!value?.trim()) return 'Este campo es obligatorio.';
}

export function validateSlug(value: string | undefined): string | void {
  if (!value?.trim()) return 'El slug es obligatorio.';
  if (!slugPattern.test(value)) {
    return 'Usá minúsculas, números y guiones, sin espacios ni acentos.';
  }
}

export function validateIsoDate(value: string | undefined): string | void {
  if (value && !isoDatePattern.test(value)) {
    return 'Usá una fecha ISO UTC, por ejemplo 2026-08-12T15:30:00.000Z.';
  }

  if (value && Number.isNaN(Date.parse(value))) return 'La fecha no es válida.';
}

export function validateUrl(value: string | undefined): string | void {
  if (!value?.trim()) return 'La URL es obligatoria.';
  if (!externalUrlPattern.test(value)) return 'La URL debe comenzar con https://.';
}

export function validateInternalOrExternalLink(value: string | undefined): string | void {
  if (!value?.trim()) return 'El enlace es obligatorio.';
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('..')) return;
  return validateUrl(value);
}

export function validatePublicAssetReference(value: string | undefined): string | void {
  if (!value?.trim()) return 'La ruta del archivo es obligatoria.';
  if (!publicAssetPattern.test(value)) {
    return 'Usá una ruta pública dentro de /images, /videos o /downloads.';
  }
  if (value.includes('..')) return 'La ruta no puede salir de la carpeta pública.';
  if (!allowedDownloadExtensionPattern.test(value)) {
    return 'El archivo debe ser PDF, MP4, WebP, PNG o JPG.';
  }
}

const requiredString = (
  name: string,
  label: string,
  description?: string
): TinaField => ({
  name,
  label,
  type: 'string',
  required: true,
  description,
  ui: { component: EditorialTextField, validate: validateRequiredText },
});

const optionalString = (name: string, label: string, description?: string): TinaField => ({
  name,
  label,
  type: 'string',
  description,
  ui: { component: EditorialTextField },
});

const requiredText = (name: string, label: string, description?: string): TinaField => ({
  name,
  label,
  type: 'string',
  required: true,
  description,
  ui: { component: EditorialTextareaField, validate: validateRequiredText },
});

const optionalText = (name: string, label: string, description?: string): TinaField => ({
  name,
  label,
  type: 'string',
  description,
  ui: { component: EditorialTextareaField },
});

const requiredTextList = (name: string, label: string, singularLabel = 'Ítem'): TinaField => ({
  name,
  label,
  type: 'string',
  list: true,
  required: true,
  description: `Agregá cada ${singularLabel.toLowerCase()} por separado.`,
});

const optionalTextList = (name: string, label: string, singularLabel = 'Ítem'): TinaField => ({
  name,
  label,
  type: 'string',
  list: true,
  description: `Agregá cada ${singularLabel.toLowerCase()} por separado.`,
});

const requiredChipList = (name: string, label: string, singularLabel = 'Ítem'): TinaField => ({
  name,
  label,
  type: 'string',
  list: true,
  required: true,
  description: `Escribí cada ${singularLabel.toLowerCase()} y confirmalo con coma, Enter o el botón +.`,
  ui: { component: EditorialChipField },
});

const optionalChipList = (name: string, label: string, singularLabel = 'Ítem'): TinaField => ({
  name,
  label,
  type: 'string',
  list: true,
  description: `Escribí cada ${singularLabel.toLowerCase()} y confirmalo con coma, Enter o el botón +.`,
  ui: { component: EditorialChipField },
});

export const articleImageFields: TinaField[] = [
  {
    name: 'imageEditingHelp',
    type: 'displayOnly',
    ui: {
      component: NestedEditorHelpComponent(
        'Acá podés cambiar la imagen y explicar qué muestra. Este botón vuelve al artículo que estabas editando, sin salir al listado.',
        'este artículo'
      ),
    },
  },
  {
    name: 'src',
    label: 'Archivo de imagen',
    type: 'image',
    required: true,
    description: 'Elegí la imagen que querés mostrar. Debajo podés describirla y revisar su tamaño.',
    uploadDir: (values) => `articulos/${values.slug || 'borradores'}`,
  },
  requiredString('alt', 'Descripción de la imagen', 'Contá brevemente qué se ve. Este texto ayuda a quienes no pueden ver la imagen.'),
  { name: 'width', label: 'Ancho en píxeles', type: 'number', required: true, description: 'Es el ancho original de la imagen y ayuda a que se vea sin deformarse.' },
  { name: 'height', label: 'Alto en píxeles', type: 'number', required: true, description: 'Es el alto original de la imagen y ayuda a que se vea sin deformarse.' },
  optionalString('label', 'Etiqueta opcional', 'Texto corto que identifica la imagen cuando la plantilla lo muestra.'),
  optionalText('caption', 'Epígrafe opcional', 'Aclaración visible debajo de la imagen. Si queda vacío, no ocupa espacio.'),
];

export const instructionImageFields: TinaField[] = [
  {
    name: 'instructionImageEditingHelp',
    type: 'displayOnly',
    ui: {
      component: NestedEditorHelpComponent(
        'Acá podés cambiar la imagen o el recurso y explicar qué muestra. Este botón vuelve a la instrucción que estabas editando, sin salir al listado.',
        'esta instrucción'
      ),
    },
  },
  {
    name: 'src',
    label: 'Archivo de imagen',
    type: 'image',
    required: true,
    uploadDir: (values) => `instrucciones/${values.slug || 'borradores'}`,
  },
  requiredString('alt', 'Descripción de la imagen', 'Contá brevemente qué se ve. Este texto ayuda a quienes no pueden ver la imagen.'),
  { name: 'width', label: 'Ancho en píxeles', type: 'number', required: true },
  { name: 'height', label: 'Alto en píxeles', type: 'number', required: true },
  optionalString('label', 'Título del recurso'),
  optionalString('downloadLabel', 'Texto de descarga'),
  {
    name: 'downloadSrc',
    label: 'Ruta del video o descarga',
    type: 'string',
    description: 'Pegá la dirección del archivo que se va a abrir o descargar, por ejemplo /videos/instrucciones/.../archivo.mp4.',
    ui: { component: EditorialTextField, validate: validatePublicAssetReference },
  },
];

const articleImageObject = (name: string, label: string, required = false): TinaField => ({
  name,
  label,
  type: 'object',
  required,
  description: 'Desde el lápiz podés cambiar la imagen y su descripción. Dentro del editor de imagen vas a encontrar el botón para volver a este artículo.',
  fields: articleImageFields,
});

const instructionImageObject = (name: string, label: string): TinaField => ({
  name,
  label,
  type: 'object',
  description: 'Desde el lápiz podés cambiar el recurso y su descripción. Dentro del editor vas a encontrar el botón para volver a esta instrucción.',
  fields: instructionImageFields,
});

function namespaceUnionTemplate(template: Template): Template {
  const prefix = template.name;
  const originalItemProps = template.ui?.itemProps;
  const originalDefault = template.ui?.defaultItem;

  const toPersistedShape = (item: Record<string, unknown>): Record<string, unknown> =>
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key.startsWith(`${prefix}_`) ? key.slice(prefix.length + 1) : key,
        value,
      ])
    );

  const toEditorShape = (item: Record<string, unknown>): Record<string, unknown> =>
    Object.fromEntries(
      Object.entries(item)
        .filter(([key]) => key !== 'type')
        .map(([key, value]) => [`${prefix}_${key}`, value])
    );

  return {
    ...template,
    fields: template.fields.map((field) => ({
      ...field,
      name: `${prefix}_${field.name}`,
      nameOverride: field.name,
    })),
    ui: {
      ...template.ui,
      itemProps: originalItemProps
        ? (item) => originalItemProps(toPersistedShape(item))
        : undefined,
      defaultItem:
        typeof originalDefault === 'function'
          ? () => toEditorShape(originalDefault())
          : originalDefault
            ? toEditorShape(originalDefault)
            : undefined,
    },
  };
}

const rawArticleSectionTemplates: Template[] = [
  {
    name: 'case_summary',
    label: 'Resumen de caso clínico',
    ui: {
      defaultItem: { type: 'case_summary', title: '', paragraphs: [] },
      itemProps: (item) => ({ label: `Después de las imágenes · Resumen: ${item.title || 'Sin título'}` }),
    },
    fields: [
      requiredString('title', 'Título del contexto'),
      requiredTextList('paragraphs', 'Contexto confirmado', 'Párrafo'),
      {
        name: 'facts',
        label: 'Datos confirmados',
        type: 'object',
        list: true,
        ui: { itemProps: (item) => ({ label: item.label || 'Dato confirmado' }) },
        fields: [requiredString('label', 'Etiqueta'), requiredText('value', 'Valor')],
      },
      {
        name: 'approach',
        label: 'Abordaje opcional',
        type: 'object',
        fields: [
          requiredString('title', 'Título'),
          requiredText('text', 'Descripción confirmada'),
          optionalTextList('items', 'Puntos confirmados', 'Punto'),
        ],
      },
    ],
  },
  {
    name: 'text',
    label: 'Texto',
    ui: {
      defaultItem: { type: 'text', paragraphs: [] },
      itemProps: (item) => ({ label: `Cuerpo del artículo · Texto: ${item.title || 'Sin título'}` }),
    },
    fields: [
      optionalString('title', 'Título opcional'),
      requiredTextList('paragraphs', 'Párrafos', 'Párrafo'),
    ],
  },
  {
    name: 'list',
    label: 'Lista',
    ui: {
      defaultItem: { type: 'list', title: '', items: [] },
      itemProps: (item) => ({ label: `Cuerpo del artículo · Lista: ${item.title || 'Sin título'}` }),
    },
    fields: [
      requiredString('title', 'Título'),
      optionalText('intro', 'Introducción'),
      requiredTextList('items', 'Puntos', 'Punto'),
    ],
  },
  {
    name: 'comparison',
    label: 'Comparación',
    ui: {
      defaultItem: { type: 'comparison', title: '', columns: [], rows: [] },
      itemProps: (item) => ({ label: `Cuerpo del artículo · Comparación: ${item.title || 'Sin título'}` }),
    },
    fields: [
      requiredString('title', 'Título'),
      optionalText('intro', 'Introducción'),
      requiredTextList('columns', 'Columnas', 'Columna'),
      {
        name: 'rows',
        label: 'Filas',
        type: 'object',
        list: true,
        required: true,
        ui: { itemProps: (item) => ({ label: item.label || 'Fila' }) },
        fields: [
          requiredString('label', 'Aspecto'),
          requiredTextList('values', 'Valores', 'Valor'),
        ],
      },
    ],
  },
  {
    name: 'stats',
    label: 'Cifras',
    ui: {
      defaultItem: { type: 'stats', items: [] },
      itemProps: (item) => ({ label: `Cuerpo del artículo · Cifras: ${item.title || 'Sin título'}` }),
    },
    fields: [
      optionalString('title', 'Título opcional'),
      {
        name: 'items',
        label: 'Cifras',
        type: 'object',
        list: true,
        required: true,
        ui: { itemProps: (item) => ({ label: item.label || item.value || 'Cifra' }) },
        fields: [
          requiredString('value', 'Valor'),
          requiredString('label', 'Etiqueta'),
          optionalText('description', 'Descripción'),
        ],
      },
    ],
  },
  {
    name: 'gallery',
    label: 'Galería',
    ui: {
      defaultItem: { type: 'gallery', images: [] },
      itemProps: (item) => ({ label: `Arriba del artículo · Imágenes: ${item.title || 'Galería principal'}` }),
    },
    fields: [
      optionalString('title', 'Título opcional'),
      optionalText('intro', 'Introducción'),
      {
        name: 'images',
        label: 'Imágenes',
        type: 'object',
        list: true,
        required: true,
        fields: articleImageFields,
        ui: { itemProps: (item) => ({ label: item.alt || item.label || 'Imagen' }) },
      },
    ],
  },
  {
    name: 'faq',
    label: 'Preguntas frecuentes',
    ui: {
      defaultItem: { type: 'faq', title: '', items: [] },
      itemProps: (item) => ({ label: `Cuerpo del artículo · Preguntas: ${item.title || 'Sin título'}` }),
    },
    fields: [
      requiredString('title', 'Título'),
      {
        name: 'items',
        label: 'Preguntas',
        type: 'object',
        list: true,
        required: true,
        ui: { itemProps: (item) => ({ label: item.question || 'Pregunta' }) },
        fields: [requiredString('question', 'Pregunta'), requiredText('answer', 'Respuesta')],
      },
    ],
  },
  {
    name: 'quote',
    label: 'Cita',
    ui: {
      defaultItem: { type: 'quote', quote: '' },
      itemProps: (item) => ({ label: `Cuerpo del artículo · Cita: ${item.attribution || 'Sin firma'}` }),
    },
    fields: [requiredText('quote', 'Cita'), optionalString('attribution', 'Atribución')],
  },
  {
    name: 'cta',
    label: 'Llamado a la acción',
    ui: {
      defaultItem: { type: 'cta', title: '', text: '', href: '', buttonLabel: '' },
      itemProps: (item) => ({ label: `Final del artículo · Botón: ${item.title || 'Sin título'}` }),
    },
    fields: [
      optionalString('label', 'Etiqueta'),
      requiredString('title', 'Título'),
      requiredText('text', 'Texto'),
      {
        name: 'href',
        label: 'Enlace',
        type: 'string',
        required: true,
        ui: { component: EditorialTextField, validate: validateInternalOrExternalLink },
      },
      requiredString('buttonLabel', 'Texto del botón'),
    ],
  },
];

export const articleSectionTemplates: Template[] = rawArticleSectionTemplates.map(
  namespaceUnionTemplate
);

const rawInstructionSectionTemplates: Template[] = [
  {
    name: 'steps',
    label: 'Pasos ordenados',
    ui: {
      defaultItem: { type: 'steps', items: [] },
      itemProps: (item) => ({ label: item.title || 'Pasos ordenados' }),
    },
    fields: [
      optionalString('title', 'Título opcional'),
      optionalText('intro', 'Introducción'),
      requiredTextList('items', 'Pasos', 'Paso'),
    ],
  },
  {
    name: 'matrix',
    label: 'Matriz de recomendaciones',
    ui: {
      defaultItem: { type: 'matrix', groups: [] },
      itemProps: (item) => ({ label: item.title || 'Matriz de recomendaciones' }),
    },
    fields: [
      optionalString('title', 'Título opcional'),
      optionalText('intro', 'Introducción'),
      {
        name: 'groups',
        label: 'Categorías',
        type: 'object',
        list: true,
        required: true,
        ui: { itemProps: (item) => ({ label: item.title || 'Categoría' }) },
        fields: [
          requiredString('title', 'Categoría'),
          optionalTextList('yes', 'Sí', 'Recomendación'),
          optionalTextList('caution', 'Precaución', 'Precaución'),
          optionalTextList('no', 'No', 'Restricción'),
        ],
      },
    ],
  },
  {
    name: 'notice',
    label: 'Aviso destacado',
    ui: {
      defaultItem: { type: 'notice', tone: 'info', title: '', text: '' },
      itemProps: (item) => ({ label: item.title || 'Aviso destacado' }),
    },
    fields: [
      {
        name: 'tone',
        label: 'Tono',
        type: 'string',
        required: true,
        options: [
          { label: 'Información', value: 'info' },
          { label: 'Importante', value: 'important' },
          { label: 'Contacto', value: 'contact' },
        ],
        ui: editorialSelect([
          { label: 'Información', value: 'info' },
          { label: 'Importante', value: 'important' },
          { label: 'Contacto', value: 'contact' },
        ]),
      },
      requiredString('title', 'Título'),
      requiredText('text', 'Texto'),
    ],
  },
  {
    name: 'text',
    label: 'Texto',
    ui: {
      defaultItem: { type: 'text', paragraphs: [] },
      itemProps: (item) => ({ label: item.title || 'Texto sin título' }),
    },
    fields: [
      optionalString('title', 'Título opcional'),
      requiredTextList('paragraphs', 'Párrafos', 'Párrafo'),
    ],
  },
];

export const instructionSectionTemplates: Template[] = rawInstructionSectionTemplates.map(
  namespaceUnionTemplate
);

export const articleFields: TinaField[] = [
  { name: 'type', label: 'Tipo', type: 'string', required: true, ui: { component: 'hidden' } },
  {
    name: 'internalId',
    label: 'ID interno',
    type: 'string',
    required: true,
    nameOverride: 'id',
    ui: { component: 'hidden' },
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'string',
    required: true,
    description: 'Este texto forma parte de la dirección del artículo. Si el artículo ya está publicado, es mejor no cambiarlo.',
    ui: { component: EditorialTextField, validate: validateSlug },
  },
  { name: 'category', label: 'Categoría', type: 'string', required: true, options: CATEGORY_OPTIONS, ui: editorialSelect(CATEGORY_OPTIONS) },
  requiredString('categoryLabel', 'Nombre visible de categoría'),
  {
    name: 'serviceIds',
    label: 'Tratamientos vinculados',
    type: 'string',
    list: true,
    required: true,
    options: SERVICE_OPTIONS,
    ui: { component: EditorialCheckboxGroupField },
  },
  optionalString('titlePrefix', 'Prefijo visual del título'),
  optionalString('breadcrumbLabel', 'Texto breve del breadcrumb'),
  {
    name: 'title',
    label: 'Título',
    type: 'string',
    required: true,
    isTitle: true,
    description: 'Es el título que van a ver los pacientes en la página, las tarjetas y los resultados de búsqueda.',
    ui: { component: EditorialTextField, validate: validateRequiredText },
  },
  requiredText('excerpt', 'Resumen'),
  requiredString('author', 'Autor'),
  optionalString('clinicalReviewer', 'Responsable de revisión clínica'),
  { name: 'status', label: 'Estado editorial', type: 'string', required: true, options: STATUS_OPTIONS, ui: editorialSelect(STATUS_OPTIONS) },
  { name: 'createdAt', label: 'Fecha de creación', type: 'datetime', ui: editorialDate() },
  { name: 'publishedAt', label: 'Fecha de publicación', type: 'datetime', ui: editorialDate() },
  { name: 'updatedAt', label: 'Última actualización', type: 'datetime', required: true, ui: editorialDate(true) },
  requiredString('readTime', 'Tiempo de lectura'),
  requiredChipList('tags', 'Etiquetas', 'Etiqueta'),
  articleImageObject('heroImage', 'Imagen para tarjetas y redes', true),
  {
    name: 'articleSectionsHelp',
    type: 'displayOnly',
    ui: {
      component: InfoBox({
        message: 'Estas son las partes que ves en la página. “Arriba del artículo · Imágenes” abre las fotos destacadas; “Después de las imágenes” y “Cuerpo del artículo” continúan debajo; “Final del artículo” aparece al cierre. También podés tocar una parte directamente en la vista.',
      }),
    },
  },
  {
    name: 'sections',
    label: 'Contenido visible del artículo',
    type: 'object',
    list: true,
    required: true,
    templateKey: 'type',
    templates: articleSectionTemplates,
  },
  {
    name: 'sources',
    label: 'Fuentes generales',
    type: 'object',
    list: true,
    ui: { itemProps: (item) => ({ label: item.title || item.publisher || 'Fuente' }) },
    fields: [
      requiredString('title', 'Título'),
      requiredString('publisher', 'Institución o publicación'),
      { name: 'url', label: 'Enlace a la fuente', type: 'string', required: true, description: 'Pegá el enlace donde se puede consultar la fuente original.', ui: { component: EditorialTextField, validate: validateUrl } },
    ],
  },
  {
    name: 'downloads',
    label: 'Descargas',
    type: 'object',
    list: true,
    ui: { itemProps: (item) => ({ label: item.name || 'Descarga' }) },
    fields: [
      requiredString('name', 'Nombre'),
      {
        name: 'url',
        label: 'Ruta pública',
        type: 'string',
        required: true,
        description: 'Pegá la dirección del archivo que querés ofrecer para ver o descargar.',
        ui: { component: EditorialTextField, validate: validatePublicAssetReference },
      },
    ],
  },
];

export const instructionFields: TinaField[] = [
  { name: 'type', label: 'Tipo', type: 'string', required: true, ui: { component: 'hidden' } },
  {
    name: 'internalId',
    label: 'ID interno',
    type: 'string',
    required: true,
    nameOverride: 'id',
    ui: { component: 'hidden' },
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'string',
    required: true,
    description: 'Este texto forma parte de la dirección de la guía. Si ya está publicada, es mejor no cambiarlo.',
    ui: { component: EditorialTextField, validate: validateSlug },
  },
  { name: 'category', label: 'Categoría', type: 'string', required: true, options: CATEGORY_OPTIONS, ui: editorialSelect(CATEGORY_OPTIONS) },
  requiredString('categoryLabel', 'Nombre visible de categoría'),
  { name: 'serviceId', label: 'Tratamiento vinculado', type: 'string', options: SERVICE_OPTIONS, ui: editorialSelect(SERVICE_OPTIONS) },
  {
    name: 'title',
    label: 'Título',
    type: 'string',
    required: true,
    isTitle: true,
    description: 'Es el título que van a ver los pacientes en la guía y en sus tarjetas.',
    ui: { component: EditorialTextField, validate: validateRequiredText },
  },
  requiredText('excerpt', 'Resumen'),
  { name: 'status', label: 'Estado editorial', type: 'string', required: true, options: STATUS_OPTIONS, ui: editorialSelect(STATUS_OPTIONS) },
  { name: 'createdAt', label: 'Fecha de creación', type: 'datetime', ui: editorialDate() },
  { name: 'publishedAt', label: 'Fecha de publicación', type: 'datetime', ui: editorialDate() },
  { name: 'updatedAt', label: 'Última actualización', type: 'datetime', required: true, ui: editorialDate(true) },
  optionalString('clinicalReviewer', 'Responsable de revisión clínica'),
  requiredChipList('tags', 'Etiquetas', 'Etiqueta'),
  requiredString('readTime', 'Tiempo de lectura'),
  optionalString('heroLabel', 'Etiqueta superior'),
  instructionImageObject('resourceImage', 'Infografía o recurso descargable'),
  {
    name: 'resourceGallery',
    label: 'Galería de recursos descargables',
    type: 'object',
    fields: [
      requiredString('title', 'Título'),
      optionalText('intro', 'Introducción'),
      {
        name: 'images',
        label: 'Imágenes descargables',
        type: 'object',
        list: true,
        required: true,
        fields: instructionImageFields,
        ui: { itemProps: (item) => ({ label: item.label || item.alt || 'Recurso' }) },
      },
    ],
  },
  instructionImageObject('socialImage', 'Imagen social opcional'),
  {
    name: 'sections',
    label: 'Módulos de la instrucción',
    type: 'object',
    list: true,
    required: true,
    templateKey: 'type',
    templates: instructionSectionTemplates,
  },
];

const homeProfessionalFields: TinaField[] = [
  requiredString('name', 'Nombre'),
  requiredString('license', 'Matrícula'),
  requiredText('role', 'Especialidad o rol'),
  { name: 'image', label: 'Retrato', type: 'image', required: true },
  requiredString('imageAlt', 'Texto alternativo del retrato'),
];

export const homePageFields: TinaField[] = [
  { name: 'type', label: 'Tipo', type: 'string', required: true, ui: { component: 'hidden' } },
  { name: 'title', label: 'Nombre para identificar esta página', type: 'string', required: true, isTitle: true, description: 'Te ayuda a reconocer esta página dentro del editor. No se muestra en el sitio.', ui: { component: EditorialTextField, validate: validateRequiredText } },
  {
    name: 'hero',
    label: 'Portada',
    type: 'object',
    required: true,
    fields: [
      requiredString('title', 'Título'),
      requiredText('description', 'Descripción'),
      requiredString('buttonPrimary', 'Botón principal'),
      requiredString('buttonSecondary', 'Botón secundario'),
      { name: 'backgroundImage', label: 'Imagen de fondo', type: 'image', required: true },
      requiredString('backgroundAlt', 'Texto alternativo del fondo'),
      requiredString('eyebrow', 'Identificación superior'),
      requiredString('scrollLabel', 'Texto para continuar'),
    ],
  },
  {
    name: 'services',
    label: 'Presentación de tratamientos',
    type: 'object',
    required: true,
    fields: [
      requiredString('title', 'Título'),
      requiredText('description', 'Descripción'),
      requiredString('linkLabel', 'Texto del enlace de cada servicio'),
    ],
  },
  {
    name: 'team',
    label: 'Equipo',
    type: 'object',
    required: true,
    fields: [
      requiredString('eyebrow', 'Etiqueta superior'),
      requiredString('title', 'Título'),
      requiredText('description', 'Descripción'),
      { name: 'featured', label: 'Profesional principal', type: 'object', required: true, fields: homeProfessionalFields },
      {
        name: 'members',
        label: 'Otros profesionales',
        type: 'object',
        list: true,
        required: true,
        fields: homeProfessionalFields,
        ui: { itemProps: (item) => ({ label: item.name || 'Profesional' }) },
      },
    ],
  },
  {
    name: 'location',
    label: 'Ubicación y contacto',
    type: 'object',
    required: true,
    fields: [
      requiredString('title', 'Título'),
      requiredText('description', 'Descripción'),
      requiredString('addressTitle', 'Título de dirección'),
      requiredTextList('addressLines', 'Dirección', 'Línea'),
      requiredString('hoursTitle', 'Título de horarios'),
      requiredTextList('hours', 'Horarios', 'Horario'),
      requiredString('whatsappLabel', 'Texto del botón de WhatsApp'),
      { name: 'whatsappHref', label: 'Enlace de WhatsApp', type: 'string', required: true, description: 'Pegá el enlace que debe abrirse cuando alguien toca el botón de WhatsApp.', ui: { component: EditorialTextField, validate: validateInternalOrExternalLink } },
      { name: 'mapEmbedUrl', label: 'Enlace del mapa', type: 'string', required: true, description: 'Pegá el enlace del mapa que querés mostrar en la página de inicio.', ui: { component: EditorialTextField, validate: validateUrl } },
      requiredString('mapTitle', 'Texto accesible del mapa'),
      requiredString('placeName', 'Nombre de la ubicación'),
      requiredString('placeAddress', 'Dirección breve'),
      requiredString('directionsLabel', 'Texto de Cómo llegar'),
      { name: 'directionsHref', label: 'Enlace de Cómo llegar', type: 'string', required: true, description: 'Pegá el enlace que debe abrirse cuando alguien toca “Cómo llegar”.', ui: { component: EditorialTextField, validate: validateUrl } },
    ],
  },
];

export const treatmentsPageFields: TinaField[] = [
  { name: 'type', label: 'Tipo', type: 'string', required: true, ui: { component: 'hidden' } },
  { name: 'title', label: 'Nombre para identificar esta página', type: 'string', required: true, isTitle: true, description: 'Te ayuda a reconocer esta página dentro del editor. No se muestra en el sitio.', ui: { component: EditorialTextField, validate: validateRequiredText } },
  requiredString('eyebrow', 'Etiqueta superior'),
  requiredString('heading', 'Título principal'),
  requiredText('description', 'Descripción principal'),
  requiredString('instructionsEyebrow', 'Etiqueta de instrucciones'),
  requiredString('instructionsHeading', 'Título de instrucciones'),
  requiredText('instructionsDescription', 'Descripción de instrucciones'),
  requiredString('cardLinkLabel', 'Texto del enlace de cada servicio'),
];

const treatmentProfessionalFields: TinaField[] = [
  requiredString('name', 'Nombre'),
  requiredText('role', 'Rol completo'),
  optionalText('mobileRole', 'Rol breve para celular'),
  { name: 'image', label: 'Retrato', type: 'image', required: true },
  requiredString('imageAlt', 'Texto alternativo del retrato'),
];

const clinicalCaseFields: TinaField[] = [
  {
    name: 'clinicalCaseEditingHelp',
    type: 'displayOnly',
    ui: {
      component: InfoBox({
        message: 'Este caso tiene su propia página. Mientras lo editás, a la derecha vas a seguir viendo el tratamiento completo. Para revisar la ficha individual, abrila desde el sitio. Si tiene un artículo relacionado, se edita aparte desde Artículos.',
      }),
    },
  },
  { name: 'id', label: 'ID del caso', type: 'number', required: true },
  optionalString('articleSlug', 'Artículo relacionado', 'Si este caso tiene un artículo, escribí acá su identificador. La ficha del caso seguirá siendo la página principal.'),
  requiredString('paciente', 'Referencia pública del paciente'),
  optionalString('fecha', 'Fecha', 'Texto breve que se muestra en la tarjeta y ficha del caso.'),
  requiredString('titulo', 'Título'),
  requiredText('descripcion', 'Descripción'),
  { name: 'imagenAntes', label: 'Imagen antes', type: 'image' },
  { name: 'imagenDespues', label: 'Imagen después', type: 'image' },
  { name: 'imagenes', label: 'Imágenes adicionales', type: 'image', list: true, description: 'Se van a mostrar en la ficha del caso, en el mismo orden en que aparecen acá.' },
  optionalChipList('etiquetasImagenes', 'Etiquetas de imágenes', 'Etiqueta'),
  optionalString('estado', 'Estado'),
  optionalText('testimonio', 'Testimonio'),
  optionalText('desafio', 'Desafío'),
  optionalText('diagnostico', 'Diagnóstico'),
  optionalString('duracion', 'Duración'),
  optionalText('solucion', 'Solución'),
  optionalChipList('solucionFeatures', 'Puntos confirmados', 'Punto'),
  {
    name: 'stats',
    label: 'Cifras del caso',
    type: 'object',
    list: true,
    fields: [requiredString('value', 'Valor'), requiredString('label', 'Etiqueta')],
    ui: { itemProps: (item) => ({ label: item.label || item.value || 'Cifra' }) },
  },
];

export const treatmentFields: TinaField[] = [
  { name: 'type', label: 'Tipo', type: 'string', required: true, ui: { component: 'hidden' } },
  {
    name: 'internalId',
    label: 'ID interno',
    type: 'string',
    required: true,
    nameOverride: 'id',
    ui: { component: 'hidden' },
  },
  { name: 'category', label: 'Categoría', type: 'string', required: true, options: CATEGORY_OPTIONS, ui: editorialSelect(CATEGORY_OPTIONS) },
  requiredString('categoryLabel', 'Nombre visible de categoría'),
  { name: 'order', label: 'Orden en listados', type: 'number' },
  { name: 'tituloHero', label: 'Título', type: 'string', required: true, isTitle: true, description: 'Se reutiliza en la portada del tratamiento, tarjetas y ficha de cada caso.', ui: { component: EditorialTextField, validate: validateRequiredText } },
  requiredText('descripcionHero', 'Descripción'),
  requiredString('icon', 'Ícono del tratamiento', 'Este valor controla el dibujo que identifica al tratamiento. Si no estás seguro, dejalo como está.'),
  { name: 'heroImage', label: 'Imagen principal', type: 'image', required: true },
  {
    name: 'pageCopy',
    label: 'Textos de la página',
    type: 'object',
    required: true,
    fields: [
      requiredString('heroEyebrow', 'Etiqueta superior'),
      requiredString('heroCtaLabel', 'Botón del hero'),
      requiredString('casesTitle', 'Título de casos'),
      requiredText('casesDescription', 'Descripción de casos'),
      requiredString('caseLinkLabel', 'Enlace de cada caso'),
      requiredString('articlesEyebrow', 'Etiqueta de artículos'),
      requiredString('articlesTitle', 'Título de artículos'),
      requiredString('articleLinkLabel', 'Enlace de cada artículo'),
      requiredString('allArticlesPrefix', 'Prefijo de Ver todos los artículos'),
      requiredString('featuresTitlePrefix', 'Prefijo de Aspectos'),
      requiredString('ctaTitle', 'Título del llamado final'),
      requiredText('ctaDescription', 'Descripción del llamado final'),
      requiredString('ctaButtonLabel', 'Botón del llamado final'),
    ],
  },
  {
    name: 'professionals',
    label: 'Profesionales',
    type: 'object',
    list: true,
    fields: treatmentProfessionalFields,
    ui: { itemProps: (item) => ({ label: item.name || 'Profesional' }) },
  },
  requiredChipList('features', 'Aspectos del tratamiento', 'Aspecto'),
  {
    name: 'casosClinicos',
    label: 'Casos clínicos',
    type: 'object',
    list: true,
    description: 'Cada caso tiene su propia ficha. Usá el lápiz para editarla; si también tiene un artículo, podés encontrarlo en la sección Artículos.',
    fields: clinicalCaseFields,
    ui: { itemProps: (item) => ({ label: item.titulo || `Caso ${item.id || ''}`.trim() }) },
  },
];
