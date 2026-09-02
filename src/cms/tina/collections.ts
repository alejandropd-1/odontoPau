import type { Collection } from 'tinacms';

import {
  articleFields,
  homePageFields,
  instructionFields,
  treatmentFields,
  treatmentsPageFields,
} from './fields';

const slugify = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function prepareEditorialDocument(
  values: Record<string, unknown>,
  type: 'Articulo' | 'Instruccion'
): Record<string, unknown> {
  const { sourcePath: _sourcePath, _template: _rootTemplate, ...editorialValues } = values;

  const status = editorialValues.status ?? 'draft';
  const publishedAt = editorialValues.publishedAt;
  const clinicalReviewer = editorialValues.clinicalReviewer;

  if (status === 'published' && (!publishedAt || !clinicalReviewer)) {
    throw new Error(
      'Para guardar como publicado se requiere fecha de publicación y responsable de revisión clínica.'
    );
  }

  const prepared = {
    ...editorialValues,
    type,
    internalId: editorialValues.internalId || editorialValues.slug,
    status,
    updatedAt: new Date().toISOString(),
  };

  return prepared;
}

export const articleCollection: Collection = {
  name: 'articulo',
  label: 'Artículos',
  path: 'src/data/articulos',
  format: 'json',
  match: { include: '**/*' },
  defaultItem: () => ({
    type: 'Articulo',
    internalId: '',
    slug: '',
    category: '',
    categoryLabel: '',
    serviceIds: [],
    title: 'Nuevo artículo',
    excerpt: '',
    author: 'Equipo clínico',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: '',
    tags: [],
    heroImage: { src: '', alt: '', width: 0, height: 0 },
    sections: [],
  }),
  ui: {
    router: ({ document }) => `/articulos/${document._sys.filename}`,
    allowedActions: {
      create: true,
      delete: false,
      createFolder: true,
      createNestedFolder: true,
    },
    filename: {
      readonly: false,
      showFirst: true,
      description:
        'Definilo solo al crear. Usá el mismo valor que el slug; cambiarlo después altera la URL.',
      parse: slugify,
      slugify: (values) => slugify(values.slug || values.title),
    },
    beforeSubmit: async ({ values }) => prepareEditorialDocument(values, 'Articulo'),
  },
  fields: articleFields,
};

export const instructionCollection: Collection = {
  name: 'instruccion',
  label: 'Instrucciones para pacientes',
  path: 'src/data/instrucciones',
  format: 'json',
  match: { include: '**/*' },
  defaultItem: () => ({
    type: 'Instruccion',
    internalId: '',
    slug: '',
    category: '',
    categoryLabel: '',
    title: 'Nueva instrucción',
    excerpt: '',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    readTime: '',
    sections: [],
  }),
  ui: {
    router: ({ document }) => {
      const breadcrumbs = document._sys.breadcrumbs ?? [];
      const category = breadcrumbs.at(-2);
      return category ? `/instrucciones/${category}/${document._sys.filename}` : undefined;
    },
    allowedActions: {
      create: true,
      delete: false,
      createFolder: true,
      createNestedFolder: true,
    },
    filename: {
      readonly: false,
      showFirst: true,
      description:
        'Definilo solo al crear. Usá el mismo valor que el slug; cambiarlo después altera la URL.',
      parse: slugify,
      slugify: (values) => slugify(values.slug || values.title),
    },
    beforeSubmit: async ({ values }) => prepareEditorialDocument(values, 'Instruccion'),
  },
  fields: instructionFields,
};

export const homePageCollection: Collection = {
  name: 'homepage',
  label: 'Página de Inicio',
  path: 'src/data',
  format: 'json',
  match: { include: 'home' },
  ui: {
    // Tina 3.11 deja el iframe vacío cuando la ruta visual es exactamente `/`.
    // Esta ruta editorial reutiliza el mismo componente y datos que la portada pública.
    router: () => '/inicio-editorial',
    allowedActions: { create: false, delete: false, createFolder: false, createNestedFolder: false },
  },
  fields: homePageFields,
};

export const treatmentsPageCollection: Collection = {
  name: 'treatmentspage',
  label: 'Página de Tratamientos',
  path: 'src/data',
  format: 'json',
  match: { include: 'tratamientos-page' },
  ui: {
    router: () => '/tratamientos',
    allowedActions: { create: false, delete: false, createFolder: false, createNestedFolder: false },
  },
  fields: treatmentsPageFields,
};

export const treatmentCollection: Collection = {
  name: 'tratamiento',
  label: 'Tratamientos',
  path: 'src/data/tratamientos',
  format: 'json',
  match: { include: '**/*' },
  ui: {
    router: ({ document }) => `/tratamientos/${document._sys.filename}`,
    allowedActions: { create: false, delete: false, createFolder: false, createNestedFolder: false },
    filename: { readonly: true },
  },
  fields: treatmentFields,
};

export const publicationRequestCollection: Collection = {
  name: 'publicationrequest',
  label: 'Publicación del sitio',
  path: 'src/data/editorial',
  format: 'json',
  match: { include: 'publication-request' },
  ui: {
    allowedActions: { create: false, delete: false, createFolder: false, createNestedFolder: false },
    filename: { readonly: true },
  },
  fields: [
    { name: 'type', label: 'Tipo', type: 'string', required: true, ui: { component: 'hidden' } },
    { name: 'status', label: 'Estado', type: 'string', required: true, ui: { component: 'hidden' } },
    { name: 'requestId', label: 'Solicitud', type: 'string', ui: { component: 'hidden' } },
    { name: 'requestedAt', label: 'Fecha de solicitud', type: 'datetime', ui: { component: 'hidden' } },
    {
      name: 'lastProcessedRequestId',
      label: 'Última solicitud procesada',
      type: 'string',
      ui: { component: 'hidden' },
    },
    { name: 'processedAt', label: 'Fecha de resultado', type: 'datetime', ui: { component: 'hidden' } },
    { name: 'productionCommit', label: 'Versión publicada', type: 'string', ui: { component: 'hidden' } },
    { name: 'summary', label: 'Resultado', type: 'string', ui: { component: 'hidden' } },
    { name: 'issueKind', label: 'Tipo de incidencia', type: 'string', ui: { component: 'hidden' } },
    {
      name: 'productionIndex',
      label: 'Índice de contenidos publicados',
      type: 'object',
      list: true,
      ui: { component: 'hidden' },
      fields: [
        { name: 'collection', label: 'Colección', type: 'string', required: true },
        { name: 'relativePath', label: 'Documento', type: 'string', required: true },
        { name: 'fingerprint', label: 'Versión editorial', type: 'string', required: true },
        { name: 'publicState', label: 'Estado público', type: 'string', required: true },
      ],
    },
    {
      name: 'history',
      label: 'Historial de publicaciones',
      type: 'object',
      list: true,
      ui: { component: 'hidden' },
      fields: [
        { name: 'requestId', label: 'Solicitud', type: 'string', required: true, ui: { component: 'hidden' } },
        { name: 'requestedAt', label: 'Fecha de solicitud', type: 'datetime', required: true, ui: { component: 'hidden' } },
        { name: 'processedAt', label: 'Fecha de resultado', type: 'datetime', required: true, ui: { component: 'hidden' } },
        { name: 'result', label: 'Resultado', type: 'string', required: true, ui: { component: 'hidden' } },
        { name: 'issueKind', label: 'Tipo de incidencia', type: 'string', ui: { component: 'hidden' } },
        { name: 'productionCommit', label: 'Versión publicada', type: 'string', ui: { component: 'hidden' } },
      ],
    },
  ],
};

export const tinaCollections: Collection[] = [
  homePageCollection,
  treatmentsPageCollection,
  treatmentCollection,
  articleCollection,
  instructionCollection,
  publicationRequestCollection,
];
