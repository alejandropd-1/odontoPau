// fallow-ignore-file unused-file
import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';
import { cmsModels } from './src/cms/models';

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
      models: cmsModels
    })
  ]
});
