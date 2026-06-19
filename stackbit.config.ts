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
            { name: 'tituloHero', type: 'string', required: true, label: 'Título Hero' },
            { name: 'descripcionHero', type: 'text', required: true, label: 'Descripción Hero' },
            { name: 'icon', type: 'string', label: 'Ícono (Lucide)' },
            { name: 'heroImage', type: 'image', label: 'Imagen Hero' },
            { name: 'features', type: 'list', items: { type: 'string' }, label: 'Características' },
            { name: 'casosClinicos', type: 'list', label: 'Casos Clínicos', items: { type: 'model', models: ['CasoClinico'] } }
          ]
        },
        {
          name: 'CasoClinico',
          type: 'object',
          label: 'Caso Clínico',
          labelField: 'titulo',
          fields: [
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
            { name: 'date', type: 'string', required: true, label: 'Fecha' },
            { name: 'tags', type: 'list', items: { type: 'string' }, label: 'Etiquetas' },
            { name: 'readTime', type: 'string', required: true, label: 'Tiempo de lectura' },
            { name: 'published', type: 'boolean', label: 'Publicado' },
            { name: 'heroLabel', type: 'string', label: 'Etiqueta superior' },
            { name: 'shareImage', type: 'image', label: 'Imagen para compartir' },
            { name: 'whatsappMessage', type: 'text', label: 'Mensaje sugerido para WhatsApp' },
            { name: 'sections', type: 'list', label: 'Secciones', items: { type: 'model', models: ['InstructionSection'] } }
          ]
        },
        {
          name: 'InstructionSection',
          type: 'object',
          label: 'Sección de Instrucción',
          labelField: 'title',
          fields: [
            { name: 'title', type: 'string', required: true, label: 'Título' },
            { name: 'intro', type: 'text', label: 'Introducción' },
            { name: 'items', type: 'list', items: { type: 'string' }, label: 'Puntos' },
            { name: 'note', type: 'text', label: 'Nota' }
          ]
        }
      ]
    })
  ]
});
