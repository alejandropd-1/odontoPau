import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '18',
  // Configuración de la carpeta de imágenes públicas
  assets: {
    referenceType: 'static',
    staticDir: 'public',
    uploadDir: 'images',
    publicPath: '/'
  },
  
  // Mapa de sitio para enrutar el editor visual a la página dinámica
  siteMap: ({ documents, models }) => {
    return documents
      .filter((doc) => doc.modelName === 'Tratamiento')
      .map((doc) => {
        return {
          stableId: doc.id,
          urlPath: `/tratamientos/${doc.id}`,
          document: doc,
          isHomePage: false,
        };
      });
  },

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      // Usamos src/data como directorio de contenidos.
      // NOTA: GitContentSource requiere archivos JSON, YAML o Markdown.
      // El archivo tratamientos.ts debería migrarse a JSON (ej. src/data/tratamientos.json)
      contentDirs: ['src/data'],
      models: [
        {
          name: 'Tratamiento',
          type: 'data',
          label: 'Tratamiento',
          labelField: 'tituloHero',
          // Indicamos el archivo específico si se maneja como una lista en un solo JSON
          // Si cambias a un archivo por tratamiento, esto sería file: 'src/data/tratamientos/{id}.json'
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'tituloHero', type: 'string', required: true, label: 'Título Hero' },
            { name: 'descripcionHero', type: 'text', required: true, label: 'Descripción Hero' },
            { name: 'icon', type: 'string', label: 'Ícono (Nombre de Lucide)' },
            { name: 'heroImage', type: 'image', label: 'Imagen Hero' },
            { name: 'features', type: 'list', items: { type: 'string' }, label: 'Características (Features)' },
            { 
              name: 'casosClinicos', 
              type: 'list', 
              label: 'Casos Clínicos',
              items: { type: 'model', models: ['CasoClinico'] }
            }
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
            { name: 'imagenes', type: 'list', items: { type: 'image' }, label: 'Galería de Imágenes' },
            { name: 'etiquetasImagenes', type: 'list', items: { type: 'string' }, label: 'Etiquetas de Imágenes' },
            { name: 'estado', type: 'string' },
            { name: 'testimonio', type: 'text', label: 'Testimonio' },
            { name: 'desafio', type: 'text', label: 'Desafío' },
            { name: 'diagnostico', type: 'text', label: 'Diagnóstico' },
            { name: 'duracion', type: 'string', label: 'Duración' },
            { name: 'solucion', type: 'text', label: 'Solución' },
            { name: 'solucionFeatures', type: 'list', items: { type: 'string' }, label: 'Características de Solución' },
            { 
              name: 'stats', 
              type: 'list', 
              label: 'Estadísticas',
              items: { type: 'model', models: ['Stat'] }
            }
          ]
        },
        {
          name: 'Stat',
          type: 'object',
          label: 'Estadística',
          labelField: 'label',
          fields: [
            { name: 'label', type: 'string', required: true, label: 'Etiqueta' },
            { name: 'value', type: 'string', required: true, label: 'Valor' }
          ]
        }
      ]
    })
  ]
});
