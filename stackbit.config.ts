// fallow-ignore-file unused-file
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
      // CORRECCIÓN: Usamos solo src/data y filtramos por modelo para evitar duplicados
      contentDirs: ['src/data'], 
      models: [
        {
          name: 'HomePage',
          type: 'page',
          label: 'Página de Inicio',
          file: 'home.json',
          fields: [
            { name: 'title', type: 'string' },
            {
              name: 'hero',
              type: 'object',
              fields: [
                { name: 'subtitle', type: 'string', label: 'Subtítulo (Badge)' },
                { name: 'logo', type: 'image', label: 'Logo Hero' },
                { name: 'backgroundImage', type: 'image', label: 'Imagen de Fondo' },
                { name: 'title', type: 'string', label: 'Título Hero (Usar & para resaltar)' },
                { name: 'description', type: 'text', label: 'Descripción Hero' },
                { name: 'buttonPrimary', type: 'string', label: 'Botón Principal' },
                { name: 'buttonSecondary', type: 'string', label: 'Botón Secundario' }
              ]
            },
            {
              name: 'servicesSection', type: 'object', label: 'Sección Servicios',
              fields: [
                { name: 'title', type: 'string', label: 'Título' },
                { name: 'description', type: 'text', label: 'Descripción' }
              ]
            },
            {
              name: 'teamSection', type: 'object', label: 'Sección Equipo',
              fields: [
                { name: 'badge', type: 'string', label: 'Badge Superior' },
                { name: 'title', type: 'string', label: 'Título' },
                { name: 'description', type: 'text', label: 'Descripción' },
                {
                  name: 'mainDoctor', type: 'object', label: 'Doctor Principal',
                  fields: [
                    { name: 'name', type: 'string' },
                    { name: 'mn', type: 'string' },
                    { name: 'role', type: 'text' },
                    { name: 'image', type: 'image' }
                  ]
                },
                {
                  name: 'members', type: 'list', label: 'Otros Miembros',
                  items: {
                    type: 'object',
                    fields: [
                      { name: 'name', type: 'string' },
                      { name: 'mn', type: 'string' },
                      { name: 'role', type: 'string' }
                    ]
                  }
                }
              ]
            },
            {
              name: 'testimonialsSection', type: 'object', label: 'Sección Testimonios',
              fields: [
                { name: 'title', type: 'string', label: 'Título' },
                { name: 'description', type: 'text', label: 'Descripción' },
                {
                  name: 'testimonials', type: 'list', label: 'Testimonios',
                  items: {
                    type: 'object',
                    fields: [
                      { name: 'name', type: 'string', label: 'Nombre' },
                      { name: 'content', type: 'text', label: 'Contenido' },
                      { name: 'source', type: 'enum', label: 'Fuente (Ícono)', options: ['Instagram', 'Facebook', 'WhatsApp', 'Google'] },
                      { name: 'rating', type: 'number', label: 'Estrellas' },
                      { name: 'img', type: 'image', label: 'Imagen de Perfil' }
                    ]
                  }
                }
              ]
            },
            {
              name: 'locationSection', type: 'object', label: 'Sección Ubicación',
              fields: [
                { name: 'title', type: 'string' },
                { name: 'description', type: 'text' },
                { name: 'addressTitle', type: 'string' },
                { name: 'addressText', type: 'text' },
                { name: 'scheduleTitle', type: 'string' },
                { name: 'scheduleText', type: 'text' },
                { name: 'mapUrl', type: 'string' },
                { name: 'whatsappText', type: 'string' }
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
            { name: 'casosClinicos', type: 'list', label: 'Casos Clínicos', items: { type: 'model', models: ['CasoClinico'] } },
            {
              name: 'cta', type: 'object', label: 'Call To Action',
              fields: [
                { name: 'title', type: 'string', label: 'Título CTA' },
                { name: 'description', type: 'text', label: 'Descripción CTA' },
                { name: 'buttonText', type: 'string', label: 'Texto Botón' }
              ]
            }
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
            { name: 'desafio', type: 'text', label: 'El Desafío' },
            { name: 'diagnostico', type: 'text', label: 'Diagnóstico' },
            { name: 'duracion', type: 'string', label: 'Duración' },
            { name: 'solucion', type: 'text', label: 'Solución' },
            { name: 'solucionFeatures', type: 'list', label: 'Detalles de Solución', items: { type: 'string' } },
            { name: 'imagenAntes', type: 'image', label: 'Imagen Antes' },
            { name: 'imagenDespues', type: 'image', label: 'Imagen Después' },
            { name: 'testimonio', type: 'text', label: 'Testimonio' }
          ]
        },
        {
          name: 'GlobalSettings',
          type: 'data',
          label: 'Configuración Global',
          file: 'settings.json',
          fields: [
            {
              name: 'contact', type: 'object', label: 'Contacto',
              fields: [
                { name: 'whatsapp', type: 'string', label: 'Número de WhatsApp' },
                { name: 'whatsappMessage', type: 'string', label: 'Mensaje Predefinido WP' },
                { name: 'email', type: 'string', label: 'Email' },
                { name: 'address', type: 'text', label: 'Dirección' }
              ]
            },
            {
              name: 'social', type: 'object', label: 'Redes Sociales',
              fields: [
                { name: 'instagram', type: 'string', label: 'URL Instagram' },
                { name: 'facebook', type: 'string', label: 'URL Facebook' }
              ]
            },
            {
              name: 'footer', type: 'object', label: 'Footer',
              fields: [
                { name: 'text', type: 'text', label: 'Texto descriptivo Footer' }
              ]
            }
          ]
        }
      ]
    })
  ]
});
