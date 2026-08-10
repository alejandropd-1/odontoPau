// fallow-ignore-file unused-file
import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '20',
  devCommand: 'pnpm run dev',
  installCommand: 'pnpm install',
  
  assets: {
    referenceType: 'static',
    staticDir: 'public',
    uploadDir: 'images',
    publicPath: '/'
  },

  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === 'page');

    return documents
      .filter((d) => pageModels.some(m => m.name === d.modelName))
      .map((document) => {
        let urlPath = '';
        switch (document.modelName) {
          case 'Tratamiento':
            {
              const candidate = document as typeof document & {
                fields?: Record<string, unknown>;
                id?: string;
              };
              const treatmentId =
                typeof candidate.fields?.id === 'string'
                  ? candidate.fields.id
                  : candidate.id;

              urlPath = `/tratamientos/${treatmentId || document.id}`;
            }
            break;
          case 'Instruccion': {
            const candidate = document as typeof document & {
              fields?: Record<string, unknown>;
              category?: string;
              slug?: string;
            };
            const category =
              typeof candidate.fields?.category === 'string'
                ? candidate.fields.category
                : candidate.category;
            const slug =
              typeof candidate.fields?.slug === 'string'
                ? candidate.fields.slug
                : candidate.slug;

            urlPath = category && slug
              ? `/instrucciones/${category}/${slug}`
              : `/instrucciones/${document.id}`;
            break;
          }
          case 'Articulo': {
            const candidate = document as typeof document & {
              fields?: Record<string, unknown>;
              slug?: string;
            };
            const slug =
              typeof candidate.fields?.slug === 'string'
                ? candidate.fields.slug
                : candidate.slug;

            urlPath = slug ? `/articulos/${slug}` : `/articulos/${document.id}`;
            break;
          }
          case 'HomePage':
            urlPath = '/';
            break;
          default:
            return null;
        }

        return {
          stableId: document.id,
          urlPath: urlPath,
          document,
          isHomePage: document.modelName === 'HomePage',
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  },

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      // CORRECCIÓN: Usamos solo src/data y filtramos por modelo para evitar duplicados
      contentDirs: ['src/data'], 
      models: [
        {
          name: 'HomePage',
          type: 'page',
          label: 'Página de Inicio',
          file: 'home.json', // Ruta relativa a contentDirs
          fields: [
            { name: 'title', type: 'string' },
            {
              name: 'hero',
              type: 'object',
              fields: [
                { name: 'title', type: 'string', label: 'Título Hero' },
                { name: 'description', type: 'text', label: 'Descripción Hero' },
                { name: 'buttonPrimary', type: 'string', label: 'Botón Principal' },
                { name: 'buttonSecondary', type: 'string', label: 'Botón Secundario' }
              ]
            }
          ]
        },
        {
          name: 'Tratamiento',
          type: 'page',
          label: 'Tratamiento',
          labelField: 'tituloHero',
          folder: 'tratamientos',
          match: 'tratamientos/**/*.json',
          urlPath: '/tratamientos/{id}',
          fields: [
            { name: 'type', type: 'string', const: 'Tratamiento', hidden: true },
            { name: 'id', type: 'string', required: true },
            { name: 'category', type: 'string', required: true, label: 'Categoría' },
            { name: 'categoryLabel', type: 'string', required: true, label: 'Nombre visible de categoría' },
            { name: 'order', type: 'number', label: 'Orden en listados' },
            { name: 'tituloHero', type: 'string', required: true, label: 'Título Hero' },
            { name: 'descripcionHero', type: 'text', required: true, label: 'Descripción Hero' },
            { name: 'icon', type: 'string', label: 'Ícono (Lucide)' },
            { name: 'heroImage', type: 'image', label: 'Imagen Hero' },
            { name: 'professionals', type: 'list', label: 'Profesionales del tratamiento', items: { type: 'model', models: ['TreatmentProfessional'] } },
            { name: 'features', type: 'list', items: { type: 'string' }, label: 'Características' },
            { name: 'casosClinicos', type: 'list', label: 'Casos Clínicos', items: { type: 'model', models: ['CasoClinico'] } }
          ]
        },
        {
          name: 'TreatmentProfessional',
          type: 'object',
          label: 'Profesional del tratamiento',
          labelField: 'name',
          fields: [
            { name: 'name', type: 'string', required: true, label: 'Nombre' },
            { name: 'role', type: 'string', required: true, label: 'Rol confirmado' },
            { name: 'image', type: 'image', required: true, label: 'Retrato' },
            { name: 'imageAlt', type: 'string', required: true, label: 'Texto alternativo' }
          ]
        },
        {
          name: 'CasoClinico',
          type: 'object',
          label: 'Caso Clínico',
          labelField: 'titulo',
          fields: [
            { name: 'id', type: 'number', required: true, label: 'ID del caso' },
            { name: 'articleSlug', type: 'string', label: 'Slug del artículo relacionado' },
            { name: 'paciente', type: 'string', required: true },
            { name: 'titulo', type: 'string', required: true },
            { name: 'descripcion', type: 'text', required: true },
            { name: 'imagenAntes', type: 'image', label: 'Imagen Antes' },
            { name: 'imagenDespues', type: 'image', label: 'Imagen Después' },
            { name: 'testimonio', type: 'text', label: 'Testimonio' }
          ]
        },
        {
          name: 'Instruccion',
          type: 'page',
          label: 'Instrucción para Pacientes',
          labelField: 'title',
          folder: 'instrucciones',
          match: 'instrucciones/**/*.json',
          urlPath: '/instrucciones/{category}/{slug}',
          fields: [
            { name: 'type', type: 'string', const: 'Instruccion', hidden: true },
            { name: 'id', type: 'string', required: true },
            { name: 'slug', type: 'string', required: true },
            { name: 'category', type: 'string', required: true, label: 'Categoría' },
            { name: 'categoryLabel', type: 'string', required: true, label: 'Nombre visible de categoría' },
            { name: 'serviceId', type: 'string', label: 'Tratamiento vinculado' },
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'excerpt', type: 'text', required: true, label: 'Resumen' },
            { name: 'status', type: 'string', required: true, label: 'Estado editorial' },
            { name: 'publishedAt', type: 'string', label: 'Fecha de publicación' },
            { name: 'updatedAt', type: 'string', required: true, label: 'Última actualización' },
            { name: 'clinicalReviewer', type: 'string', label: 'Responsable de revisión clínica' },
            { name: 'tags', type: 'list', items: { type: 'string' }, label: 'Etiquetas' },
            { name: 'readTime', type: 'string', required: true, label: 'Tiempo de lectura' },
            { name: 'heroLabel', type: 'string', label: 'Etiqueta superior' },
            { name: 'resourceImage', type: 'model', models: ['InstructionImage'], label: 'Infografía o recurso descargable' },
            { name: 'resourceGallery', type: 'model', models: ['InstructionResourceGallery'], label: 'Galería de recursos descargables' },
            { name: 'socialImage', type: 'model', models: ['InstructionImage'], label: 'Imagen social opcional' },
            {
              name: 'sections',
              type: 'list',
              required: true,
              label: 'Módulos',
              items: {
                type: 'model',
                models: [
                  'InstructionStepsSection',
                  'InstructionMatrixSection',
                  'InstructionNoticeSection',
                  'InstructionTextSection'
                ]
              }
            }
          ]
        },
        {
          name: 'InstructionResourceGallery',
          type: 'object',
          label: 'Galería de recursos descargables',
          labelField: 'title',
          fields: [
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'intro', type: 'text', label: 'Introducción' },
            {
              name: 'images',
              type: 'list',
              required: true,
              label: 'Imágenes descargables',
              items: { type: 'model', models: ['InstructionImage'] }
            }
          ]
        },
        {
          name: 'InstructionImage',
          type: 'object',
          label: 'Imagen de instrucción',
          labelField: 'alt',
          fields: [
            { name: 'src', type: 'image', required: true, label: 'Archivo' },
            { name: 'alt', type: 'string', required: true, label: 'Texto alternativo' },
            { name: 'width', type: 'number', required: true, label: 'Ancho' },
            { name: 'height', type: 'number', required: true, label: 'Alto' },
            { name: 'label', type: 'string', label: 'Título del recurso' },
            { name: 'downloadLabel', type: 'string', label: 'Texto de descarga' },
            { name: 'downloadSrc', type: 'string', label: 'Archivo alternativo para descargar' }
          ]
        },
        {
          name: 'InstructionStepsSection',
          type: 'object',
          label: 'Pasos ordenados',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'steps', hidden: true },
            { name: 'title', type: 'string', label: 'Título' },
            { name: 'intro', type: 'text', label: 'Introducción' },
            { name: 'items', type: 'list', required: true, items: { type: 'text' }, label: 'Pasos' }
          ]
        },
        {
          name: 'InstructionMatrixSection',
          type: 'object',
          label: 'Matriz de recomendaciones',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'matrix', hidden: true },
            { name: 'title', type: 'string', label: 'Título' },
            { name: 'intro', type: 'text', label: 'Introducción' },
            { name: 'groups', type: 'list', required: true, items: { type: 'model', models: ['InstructionMatrixGroup'] }, label: 'Categorías' }
          ]
        },
        {
          name: 'InstructionMatrixGroup',
          type: 'object',
          label: 'Categoría de recomendaciones',
          labelField: 'title',
          fields: [
            { name: 'title', type: 'string', required: true, label: 'Categoría' },
            { name: 'yes', type: 'list', items: { type: 'string' }, label: 'Sí' },
            { name: 'caution', type: 'list', items: { type: 'string' }, label: 'Precaución' },
            { name: 'no', type: 'list', items: { type: 'string' }, label: 'No' }
          ]
        },
        {
          name: 'InstructionNoticeSection',
          type: 'object',
          label: 'Aviso destacado',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'notice', hidden: true },
            { name: 'tone', type: 'string', required: true, label: 'Tono: info, important o contact' },
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'text', type: 'text', required: true, label: 'Texto' }
          ]
        },
        {
          name: 'InstructionTextSection',
          type: 'object',
          label: 'Texto de instrucción',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'text', hidden: true },
            { name: 'title', type: 'string', label: 'Título' },
            { name: 'paragraphs', type: 'list', required: true, items: { type: 'text' }, label: 'Párrafos' }
          ]
        },
        {
          name: 'Articulo',
          type: 'page',
          label: 'Artículo de odontología',
          labelField: 'title',
          folder: 'articulos',
          match: 'articulos/**/*.json',
          urlPath: '/articulos/{slug}',
          fields: [
            { name: 'type', type: 'string', const: 'Articulo', hidden: true },
            { name: 'id', type: 'string', required: true, label: 'ID interno' },
            { name: 'slug', type: 'string', required: true, label: 'Slug' },
            { name: 'category', type: 'string', required: true, label: 'Categoría' },
            { name: 'categoryLabel', type: 'string', required: true, label: 'Nombre visible de categoría' },
            { name: 'serviceIds', type: 'list', required: true, items: { type: 'string' }, label: 'Tratamientos vinculados' },
            { name: 'titlePrefix', type: 'string', label: 'Prefijo visual del título' },
            { name: 'breadcrumbLabel', type: 'string', label: 'Texto breve del breadcrumb' },
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'excerpt', type: 'text', required: true, label: 'Resumen' },
            { name: 'author', type: 'string', required: true, label: 'Autor' },
            { name: 'clinicalReviewer', type: 'string', label: 'Responsable de revisión clínica' },
            { name: 'status', type: 'string', required: true, label: 'Estado editorial' },
            { name: 'publishedAt', type: 'string', label: 'Fecha de publicación' },
            { name: 'updatedAt', type: 'string', required: true, label: 'Última actualización' },
            { name: 'readTime', type: 'string', required: true, label: 'Tiempo de lectura' },
            { name: 'tags', type: 'list', items: { type: 'string' }, label: 'Etiquetas' },
            { name: 'heroImage', type: 'model', models: ['ArticleImage'], required: true, label: 'Imagen principal' },
            { name: 'sources', type: 'list', items: { type: 'model', models: ['ArticleSource'] }, label: 'Fuentes generales' },
            {
              name: 'sections',
              type: 'list',
              required: true,
              label: 'Secciones',
              items: {
                type: 'model',
                models: [
                  'ArticleCaseSummarySection',
                  'ArticleTextSection',
                  'ArticleListSection',
                  'ArticleComparisonSection',
                  'ArticleStatsSection',
                  'ArticleGallerySection',
                  'ArticleFaqSection',
                  'ArticleQuoteSection',
                  'ArticleCtaSection'
                ]
              }
            }
          ]
        },
        {
          name: 'ArticleImage',
          type: 'object',
          label: 'Imagen de artículo',
          labelField: 'alt',
          fields: [
            { name: 'src', type: 'image', required: true, label: 'Archivo' },
            { name: 'alt', type: 'string', required: true, label: 'Texto alternativo' },
            { name: 'width', type: 'number', required: true, label: 'Ancho' },
            { name: 'height', type: 'number', required: true, label: 'Alto' },
            { name: 'label', type: 'string', label: 'Etiqueta opcional' },
            { name: 'caption', type: 'text', label: 'Epígrafe opcional' }
          ]
        },
        {
          name: 'ArticleSource',
          type: 'object',
          label: 'Fuente de artículo',
          labelField: 'title',
          fields: [
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'publisher', type: 'string', required: true, label: 'Institución o publicación' },
            { name: 'url', type: 'string', required: true, label: 'URL' }
          ]
        },
        {
          name: 'ArticleCaseSummarySection',
          type: 'object',
          label: 'Resumen de caso clínico',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'case_summary', hidden: true },
            { name: 'title', type: 'string', required: true, label: 'Título del contexto' },
            { name: 'paragraphs', type: 'list', required: true, items: { type: 'text' }, label: 'Contexto confirmado' },
            { name: 'facts', type: 'list', items: { type: 'model', models: ['ArticleCaseFact'] }, label: 'Datos confirmados' },
            { name: 'approach', type: 'model', models: ['ArticleCaseApproach'], label: 'Abordaje opcional' }
          ]
        },
        {
          name: 'ArticleCaseFact',
          type: 'object',
          label: 'Dato confirmado del caso',
          labelField: 'label',
          fields: [
            { name: 'label', type: 'string', required: true, label: 'Etiqueta' },
            { name: 'value', type: 'text', required: true, label: 'Valor' }
          ]
        },
        {
          name: 'ArticleCaseApproach',
          type: 'object',
          label: 'Abordaje del caso',
          labelField: 'title',
          fields: [
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'text', type: 'text', required: true, label: 'Descripción confirmada' },
            { name: 'items', type: 'list', items: { type: 'text' }, label: 'Puntos confirmados' }
          ]
        },
        {
          name: 'ArticleTextSection',
          type: 'object',
          label: 'Texto',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'text', hidden: true },
            { name: 'title', type: 'string', label: 'Título opcional' },
            { name: 'paragraphs', type: 'list', required: true, items: { type: 'text' }, label: 'Párrafos' }
          ]
        },
        {
          name: 'ArticleListSection',
          type: 'object',
          label: 'Lista',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'list', hidden: true },
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'intro', type: 'text', label: 'Introducción' },
            { name: 'items', type: 'list', required: true, items: { type: 'text' }, label: 'Puntos' }
          ]
        },
        {
          name: 'ArticleComparisonSection',
          type: 'object',
          label: 'Comparación',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'comparison', hidden: true },
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'intro', type: 'text', label: 'Introducción' },
            { name: 'columns', type: 'list', required: true, items: { type: 'string' }, label: 'Columnas' },
            { name: 'rows', type: 'list', required: true, items: { type: 'model', models: ['ArticleComparisonRow'] }, label: 'Filas' }
          ]
        },
        {
          name: 'ArticleComparisonRow',
          type: 'object',
          label: 'Fila de comparación',
          labelField: 'label',
          fields: [
            { name: 'label', type: 'string', required: true, label: 'Aspecto' },
            { name: 'values', type: 'list', required: true, items: { type: 'text' }, label: 'Valores' }
          ]
        },
        {
          name: 'ArticleStatsSection',
          type: 'object',
          label: 'Cifras',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'stats', hidden: true },
            { name: 'title', type: 'string', label: 'Título opcional' },
            { name: 'items', type: 'list', required: true, items: { type: 'model', models: ['ArticleStat'] }, label: 'Cifras' }
          ]
        },
        {
          name: 'ArticleStat',
          type: 'object',
          label: 'Cifra',
          labelField: 'label',
          fields: [
            { name: 'value', type: 'string', required: true, label: 'Valor' },
            { name: 'label', type: 'string', required: true, label: 'Etiqueta' },
            { name: 'description', type: 'text', label: 'Descripción' }
          ]
        },
        {
          name: 'ArticleGallerySection',
          type: 'object',
          label: 'Galería',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'gallery', hidden: true },
            { name: 'title', type: 'string', label: 'Título opcional' },
            { name: 'intro', type: 'text', label: 'Introducción' },
            { name: 'images', type: 'list', required: true, items: { type: 'model', models: ['ArticleImage'] }, label: 'Imágenes' }
          ]
        },
        {
          name: 'ArticleFaqSection',
          type: 'object',
          label: 'Preguntas frecuentes',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'faq', hidden: true },
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'items', type: 'list', required: true, items: { type: 'model', models: ['ArticleFaqItem'] }, label: 'Preguntas' }
          ]
        },
        {
          name: 'ArticleFaqItem',
          type: 'object',
          label: 'Pregunta frecuente',
          labelField: 'question',
          fields: [
            { name: 'question', type: 'string', required: true, label: 'Pregunta' },
            { name: 'answer', type: 'text', required: true, label: 'Respuesta' }
          ]
        },
        {
          name: 'ArticleQuoteSection',
          type: 'object',
          label: 'Cita',
          fields: [
            { name: 'type', type: 'string', const: 'quote', hidden: true },
            { name: 'quote', type: 'text', required: true, label: 'Cita' },
            { name: 'attribution', type: 'string', label: 'Atribución' }
          ]
        },
        {
          name: 'ArticleCtaSection',
          type: 'object',
          label: 'Llamado a la acción',
          labelField: 'title',
          fields: [
            { name: 'type', type: 'string', const: 'cta', hidden: true },
            { name: 'label', type: 'string', label: 'Etiqueta' },
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'text', type: 'text', required: true, label: 'Texto' },
            { name: 'href', type: 'string', required: true, label: 'Enlace' },
            { name: 'buttonLabel', type: 'string', required: true, label: 'Texto del botón' }
          ]
        }
      ]
    })
  ]
});
