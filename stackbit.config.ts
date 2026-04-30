import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '20',
  devCommand: 'npm run dev',
  installCommand: 'npm install',
  
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
            urlPath = `/tratamientos/${document.id}`;
            break;
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
      // Incluimos tanto la carpeta de tratamientos como la carpeta data para home.json
      contentDirs: ['src/data/tratamientos', 'src/data'],
      models: [
        {
          name: 'HomePage',
          type: 'page',
          label: 'Página de Inicio',
          file: 'src/data/home.json', // Mapeo directo al archivo
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
          urlPath: '/tratamientos/{id}',
          fields: [
            { name: 'type', type: 'string', const: 'Tratamiento', hidden: true },
            { name: 'id', type: 'string', required: true },
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
        }
      ]
    })
  ]
});
