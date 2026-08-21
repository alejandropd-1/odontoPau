import fs from 'node:fs';
import path from 'node:path';

export interface DocumentFixture {
  id: string;
  model: string;
  isSynthetic: boolean;
  content: any;
}

/**
 * Carga los documentos públicos reales bajo `src/data`.
 * Los singletons operativos internos se validan en su suite propia y no alteran
 * la línea base histórica de contratos del contenido del sitio.
 */
export function loadRealJsonDocuments(): DocumentFixture[] {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const fixtures: DocumentFixture[] = [];

  function walk(dir: string) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.json')) {
        const relativePath = path.relative(dataDir, fullPath).replace(/\\/g, '/');
        if (relativePath.startsWith('editorial/')) {
          continue;
        }
        const rawContent = fs.readFileSync(fullPath, 'utf-8');
        const json = JSON.parse(rawContent);

        let model = json.type;
        if (!model) {
          if (relativePath === 'settings.json') {
            model = 'GlobalSettings';
          } else if (relativePath === 'home.json') {
            model = 'HomePage';
          }
        }

        if (model) {
          fixtures.push({
            id: relativePath,
            model,
            isSynthetic: false,
            content: json,
          });
        }
      }
    }
  }

  if (fs.existsSync(dataDir)) {
    walk(dataDir);
  }

  return fixtures;
}

/**
 * Genera fixtures sintéticos no clínicos, separando explícitamente variantes mínimas y completas.
 */
export function getSyntheticFixtures(): DocumentFixture[] {
  return [
    // --- FIXTURES MÍNIMOS ---
    {
      id: 'synthetic/global-settings-minimal.json',
      model: 'GlobalSettings',
      isSynthetic: true,
      content: {
        type: 'GlobalSettings',
        contact: {
          whatsapp: '+5491100000000',
          whatsappMessage: 'Hola',
          email: 'contacto@ejemplo.com',
          address: 'Calle Ficticia 123',
        },
        social: {},
        footer: {
          text: 'Pie de página mínimo ficticio',
        },
      },
    },
    {
      id: 'synthetic/home-page-minimal.json',
      model: 'HomePage',
      isSynthetic: true,
      content: {
        type: 'HomePage',
        title: 'Inicio Mínimo Sintético',
        hero: {
          title: 'Título Hero Mínimo',
          description: 'Descripción Mínima',
        },
      },
    },
    {
      id: 'synthetic/tratamiento-minimal.json',
      model: 'Tratamiento',
      isSynthetic: true,
      content: {
        type: 'Tratamiento',
        id: 'sintetico-minimo',
        category: 'general',
        categoryLabel: 'General',
        order: 1,
        tituloHero: 'Tratamiento Mínimo',
        descripcionHero: 'Descripción Mínima de Tratamiento',
        icon: 'Sparkles',
        heroImage: 'https://ejemplo.com/hero.webp',
        professionals: [],
        features: ['Característica 1'],
        casosClinicos: [],
      },
    },
    {
      id: 'synthetic/articulo-minimal.json',
      model: 'Articulo',
      isSynthetic: true,
      content: {
        type: 'Articulo',
        id: 'articulo-minimo-sintetico',
        slug: 'articulo-minimo-sintetico',
        category: 'general',
        categoryLabel: 'General',
        serviceIds: ['s1'],
        title: 'Artículo Borrador Mínimo',
        excerpt: 'Resumen Mínimo en Borrador',
        author: 'Autor Sintético',
        status: 'draft',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        readTime: '3 min',
        tags: ['Etiqueta1'],
        heroImage: {
          src: 'https://ejemplo.com/articulo-min.webp',
          alt: 'Imagen Artículo Mínima',
          width: 800,
          height: 600,
        },
        sections: [
          {
            type: 'text',
            title: 'Sección de Texto Mínima',
            paragraphs: ['Párrafo mínimo 1'],
          },
        ],
      },
    },
    {
      id: 'synthetic/instruccion-minimal.json',
      model: 'Instruccion',
      isSynthetic: true,
      content: {
        type: 'Instruccion',
        id: 'instruccion-minima-sintetica',
        slug: 'instruccion-minima-sintetica',
        category: 'general',
        categoryLabel: 'General',
        serviceId: 's1',
        title: 'Instrucción Borrador Mínima',
        excerpt: 'Resumen de Instrucción Mínima',
        status: 'draft',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        tags: ['InstruccionMinima'],
        readTime: '2 min',
        heroLabel: 'Etiqueta Hero Mínima',
        resourceImage: {
          src: 'https://ejemplo.com/instruccion-min.webp',
          alt: 'Recurso Mínimo',
          width: 800,
          height: 600,
        },
        sections: [
          {
            type: 'text',
            title: 'Texto Mínimo de Instrucción',
            paragraphs: ['Contenido de texto sintético'],
          },
        ],
      },
    },

    // --- FIXTURES COMPLETOS ---
    {
      id: 'synthetic/global-settings-completo.json',
      model: 'GlobalSettings',
      isSynthetic: true,
      content: {
        type: 'GlobalSettings',
        contact: {
          whatsapp: '+5491112345678',
          whatsappMessage: 'Hola, quisiera una consulta',
          email: 'contacto@odontologia-ejemplo.com',
          address: 'Av. Corrientes 1234, CABA',
        },
        social: {
          instagram: 'https://instagram.com/ejemplo',
          facebook: 'https://facebook.com/ejemplo',
        },
        footer: {
          text: '© 2026 Odontología Ejemplo. Todos los derechos reservados.',
        },
      },
    },
    {
      id: 'synthetic/home-page-completo.json',
      model: 'HomePage',
      isSynthetic: true,
      content: {
        type: 'HomePage',
        title: 'Inicio Completo Sintético',
        hero: {
          title: 'Título Hero Principal',
          description: 'Descripción amplia de la clínica dental',
          buttonPrimary: 'Solicitar Turno',
          buttonSecondary: 'Ver Tratamientos',
        },
      },
    },
    {
      id: 'synthetic/tratamiento-completo.json',
      model: 'Tratamiento',
      isSynthetic: true,
      content: {
        type: 'Tratamiento',
        id: 'tratamiento-sintetico-completo',
        category: 'estetica',
        categoryLabel: 'Estética Dental',
        order: 1,
        tituloHero: 'Blanqueamiento Dental Sintético',
        descripcionHero: 'Tratamiento completo para aclarar el tono dental',
        icon: 'Sparkles',
        heroImage: 'https://ejemplo.com/tratamiento.webp',
        professionals: [
          {
            name: 'Dr. Profesional Sintético',
            role: 'Especialista en Estética',
            mobileRole: 'Estética',
            image: 'https://ejemplo.com/dr.webp',
            imageAlt: 'Foto del Dr. Profesional Sintético',
          },
        ],
        features: ['Evaluación personalizada', 'Tecnología LED'],
        casosClinicos: [
          {
            id: 1,
            articleSlug: 'articulo-sintetico-caso-1',
            paciente: 'Paciente Sintético A',
            fecha: '2026-01-15',
            titulo: 'Caso Clínico Sintético 1',
            descripcion: 'Tratamiento estético sintético',
            imagenAntes: 'https://ejemplo.com/antes.webp',
            imagenDespues: 'https://ejemplo.com/despues.webp',
            imagenes: ['https://ejemplo.com/despues.webp'],
            etiquetasImagenes: ['Resultado final'],
            estado: 'finalizado',
            testimonio: 'Excelente experiencia sintética',
            desafio: 'Pigmentación profunda sintética',
            diagnostico: 'Manchas por tinción sintética',
            duracion: '2 sesiones',
            solucion: 'Aplicación de gel de peróxido sintético',
            solucionFeatures: ['Sin sensibilidad'],
            stats: [
              {
                value: '3 tonos',
                label: 'Aclaramiento',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'synthetic/caso-clinico-extendido.json',
      model: 'CasoClinico',
      isSynthetic: true,
      content: {
        id: 2,
        articleSlug: 'articulo-relacionado',
        paciente: 'Paciente Sintético B',
        fecha: '2026-02-01',
        titulo: 'Caso Clínico Sintético Standalone',
        descripcion: 'Descripción del caso sintético',
        imagenAntes: 'https://ejemplo.com/antes2.webp',
        imagenDespues: 'https://ejemplo.com/despues2.webp',
        imagenes: ['https://ejemplo.com/antes2.webp', 'https://ejemplo.com/despues2.webp'],
        etiquetasImagenes: ['Antes', 'Después'],
        estado: 'finalizado',
        testimonio: 'Resultado natural sintético',
        desafio: 'Alineación de bordes incisales sintéticos',
        diagnostico: 'Desgaste leve sintético',
        duracion: '1 sesión',
        solucion: 'Microabrasión y remineralización sintética',
        solucionFeatures: ['Conservador'],
        stats: [
          {
            value: '100%',
            label: 'Satisfacción',
          },
        ],
      },
    },
    {
      id: 'synthetic/articulo-todas-secciones.json',
      model: 'Articulo',
      isSynthetic: true,
      content: {
        type: 'Articulo',
        id: 'articulo-sintetico-completo',
        slug: 'articulo-sintetico-completo',
        category: 'estetica',
        categoryLabel: 'Estética',
        serviceIds: ['estetica-dental'],
        titlePrefix: 'Guía Completa',
        breadcrumbLabel: 'Guía Sintética',
        title: 'Artículo Sintético con Todas las Secciones',
        excerpt: 'Resumen completo sintético que cubre las 9 secciones',
        author: 'Dra. Autora Sintética',
        clinicalReviewer: 'Dr. Revisor Sintético',
        status: 'published',
        createdAt: '2026-01-01T10:00:00Z',
        publishedAt: '2026-01-02T10:00:00Z',
        updatedAt: '2026-01-03T10:00:00Z',
        readTime: '5 min',
        tags: ['Estética', 'Blanqueamiento', 'Guía'],
        heroImage: {
          src: 'https://ejemplo.com/hero-articulo.webp',
          alt: 'Imagen de portada del artículo sintético',
          width: 1200,
          height: 630,
          label: 'Portada',
          caption: 'Pie de foto de portada sintética',
        },
        sources: [
          {
            title: 'Estudio Científico Sintético 1',
            publisher: 'Revista Odontológica Sintética',
            url: 'https://ejemplo.com/estudio-1',
          },
        ],
        downloads: [
          {
            name: 'Descargar Guía en PDF',
            url: 'https://ejemplo.com/guia.pdf',
          },
        ],
        sections: [
          {
            type: 'case_summary',
            title: 'Resumen de Caso Clínico Sintético',
            paragraphs: ['Párrafo introductorio del caso'],
            facts: [
              {
                label: 'Duración',
                value: '3 semanas',
              },
            ],
            approach: {
              title: 'Enfoque Técnico',
              text: 'Descripción técnica sintética',
              items: ['Fase 1', 'Fase 2'],
            },
          },
          {
            type: 'text',
            title: 'Sección de Texto Sintética',
            paragraphs: ['Párrafo 1 de explicación detallada sintética.', 'Párrafo 2 de recomendaciones.'],
          },
          {
            type: 'list',
            title: 'Sección de Lista Sintética',
            intro: 'Introducción a la lista de beneficios:',
            items: ['Beneficio sintético 1', 'Beneficio sintético 2'],
          },
          {
            type: 'comparison',
            title: 'Sección de Comparación Sintética',
            intro: 'Tabla comparativa sintética:',
            columns: ['Criterio', 'Técnica A', 'Técnica B'],
            rows: [
              {
                label: 'Duración',
                values: ['1 hora', '2 horas'],
              },
            ],
          },
          {
            type: 'stats',
            title: 'Sección de Estadísticas Sintética',
            items: [
              {
                value: '98%',
                label: 'Efectividad',
                description: 'Tasa de éxito informada en pacientes sintéticos',
              },
            ],
          },
          {
            type: 'gallery',
            title: 'Galería Sintética',
            intro: 'Imágenes del procedimiento:',
            images: [
              {
                src: 'https://ejemplo.com/galeria1.webp',
                alt: 'Imagen de galería sintética 1',
                width: 800,
                height: 600,
                label: 'Paso 1',
                caption: 'Detalle del paso 1 sintético',
              },
            ],
          },
          {
            type: 'faq',
            title: 'Preguntas Frecuentes Sintéticas',
            items: [
              {
                question: '¿Produce sensibilidad el tratamiento sintético?',
                answer: 'Respuesta sintética: No, la fórmula incluye desensibilizante.',
              },
            ],
          },
          {
            type: 'quote',
            quote: 'Cita destacada del especialista sintético sobre el procedimiento.',
            attribution: 'Dr. Especialista Sintético',
          },
          {
            type: 'cta',
            label: 'Llamado a la Acción',
            title: '¿Querés consultar por este tratamiento?',
            text: 'Agendá una cita de valoración sintética sin compromiso.',
            href: 'https://ejemplo.com/agenda',
            buttonLabel: 'Reservar Turno Sintético',
          },
        ],
      },
    },
    {
      id: 'synthetic/instruccion-todas-secciones.json',
      model: 'Instruccion',
      isSynthetic: true,
      content: {
        type: 'Instruccion',
        id: 'instruccion-sintetica-completa',
        slug: 'instruccion-sintetica-completa',
        category: 'cirugia',
        categoryLabel: 'Cirugía',
        serviceId: 'indicaciones-post-op',
        title: 'Instrucción Sintética con Todas las Secciones',
        excerpt: 'Cuidados postoperatorios sintéticos paso a paso',
        status: 'published',
        createdAt: '2026-01-01T10:00:00Z',
        publishedAt: '2026-01-02T10:00:00Z',
        updatedAt: '2026-01-03T10:00:00Z',
        clinicalReviewer: 'Dr. Revisor Sintético',
        tags: ['Cirugía', 'Cuidados', 'Postoperatorio'],
        readTime: '4 min',
        heroLabel: 'Instrucciones Importantes',
        resourceImage: {
          src: 'https://ejemplo.com/recurso.webp',
          alt: 'Infografía sintética de cuidados',
          width: 800,
          height: 1200,
          label: 'Infografía',
          downloadLabel: 'Descargar Infografía PDF',
          downloadSrc: 'https://ejemplo.com/infografia.pdf',
        },
        resourceGallery: {
          title: 'Galería de Cuidados Sintéticos',
          intro: 'Guía visual sintética de limpieza:',
          images: [
            {
              src: 'https://ejemplo.com/galeria-inst.webp',
              alt: 'Paso de limpieza sintética',
              width: 800,
              height: 600,
            },
          ],
        },
        socialImage: {
          src: 'https://ejemplo.com/social-inst.webp',
          alt: 'Imagen para redes sintética',
          width: 1200,
          height: 630,
        },
        sections: [
          {
            type: 'steps',
            title: 'Pasos de Cuidado Postoperatorio Sintético',
            intro: 'Seguí estas instrucciones durante las primeras 48 horas:',
            items: ['Mantené la gasa comprimida por 30 minutos', 'Aplicá frío local sintético'],
          },
          {
            type: 'matrix',
            title: 'Matriz de Alimentos Sintética',
            intro: 'Permitidos y prohibidos durante la recuperación:',
            groups: [
              {
                title: 'Primeras 24 horas',
                yes: ['Líquidos fríos sintéticos', 'Helado de agua'],
                caution: ['Alimentos tibios sintéticos'],
                no: ['Alimentos calientes sintéticos', 'Comida picante sintética'],
              },
            ],
          },
          {
            type: 'notice',
            tone: 'warning',
            title: 'Aviso Importante Sintético',
            text: 'En caso de sangrado persistente o dolor agudo sintético, contactá a la clínica inmediatamente.',
          },
          {
            type: 'text',
            title: 'Recomendaciones Adicionales Sintéticas',
            paragraphs: ['No realizar actividad física intensa durante 48 horas.', 'Evitar fumar o beber alcohol.'],
          },
        ],
      },
    },
  ];
}
