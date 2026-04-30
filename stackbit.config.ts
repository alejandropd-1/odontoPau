import { defineStackbitConfig } from '@stackbit/types';
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
      contentDirs: ['src/data'],
      models: [
        {
          name: 'Tratamiento',
          type: 'data',
          label: 'Tratamiento',
          labelField: 'tituloHero',
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
            { name: 'id', type: 'number', required: true },
            { name: 'paciente', type: 'string', required: true },
            { name: 'fecha', type: 'string' },
            { name: 'titulo', type: 'string', required: true },
            { name: 'descripcion', type: 'text', required: true },
            { name: 'imagenAntes', type: 'image', label: 'Imagen Antes' },
            { name: 'imagenDespues', type: 'image', label: 'Imagen Después' },
            { name: 'imagenes', type: 'list', items: { type: 'image' }, label: 'Galería' },
            { name: 'etiquetasImagenes', type: 'list', items: { type: 'string' }, label: 'Etiquetas Imágenes' },
            { name: 'estado', type: 'string' },
            { name: 'testimonio', type: 'text', label: 'Testimonio' },
            { name: 'desafio', type: 'text', label: 'Desafío' },
            { name: 'diagnostico', type: 'text', label: 'Diagnóstico' },
            { name: 'duracion', type: 'string', label: 'Duración' },
            { name: 'solucion', type: 'text', label: 'Solución' },
            { name: 'solucionFeatures', type: 'list', items: { type: 'string' }, label: 'Solución Features' },
            { name: 'stats', type: 'list', items: { type: 'model', models: ['Stat'] } }
          ]
        },
        {
          name: 'Stat',
          type: 'object',
          labelField: 'label',
          fields: [
            { name: 'label', type: 'string', required: true },
            { name: 'value', type: 'string', required: true }
          ]
        }
      ]
    })
  ]
});
