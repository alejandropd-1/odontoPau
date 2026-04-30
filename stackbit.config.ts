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

  // 1. Implementamos el siteMap tal cual la Imagen 3 de la documentación
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === 'page');

    return documents
      .filter((d) => pageModels.some(m => m.name === d.modelName))
      .map((document) => {
        let urlModel = '';
        switch (document.modelName) {
          case 'Tratamiento':
            urlModel = 'tratamientos';
            break;
          default:
            return null;
        }

        return {
          stableId: document.id,
          // document.id en GitContentSource suele ser el nombre del archivo sin extensión
          urlPath: `/${urlModel}/${document.id}`,
          document,
          isHomePage: false,
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  },

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['src/data/tratamientos'],
      models: [
        {
          name: 'Tratamiento',
          type: 'page', // Definido como página según Imagen 1 y 2
          label: 'Tratamiento',
          labelField: 'tituloHero',
          // Mapeo de URL estático según documentación
          urlPath: '/tratamientos/{id}', 
          fields: [
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
