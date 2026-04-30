import { defineStackbitConfig } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '20',
  devCommand: 'npm run dev',
  installCommand: 'npm install',
  
  modelExtensions: [
    { name: 'Tratamiento', type: 'page' }
  ],

  assets: {
    referenceType: 'static',
    staticDir: 'public',
    uploadDir: 'images',
    publicPath: '/'
  },
  
  siteMap: ({ documents }) => {
    return documents
      .filter((doc) => doc.modelName === 'Tratamiento')
      .map((doc) => ({
        stableId: doc.id,
        urlPath: `/tratamientos/${doc.id}`,
        document: doc,
        isHomePage: false,
      }));
  },

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['src/data/tratamientos'], // Ahora apunta a la carpeta de archivos individuales
      models: [
        {
          name: 'Tratamiento',
          type: 'page',
          label: 'Tratamiento',
          labelField: 'tituloHero',
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
