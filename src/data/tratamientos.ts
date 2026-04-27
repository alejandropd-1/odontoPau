import { Drill, Smile, Sparkles } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface CasoClinico {
  id: number;
  paciente: string;
  fecha?: string;
  titulo: string;
  descripcion: string;
  imagenAntes?: string;
  imagenDespues?: string;
  imagenes?: string[];
  etiquetasImagenes?: string[];
  estado?: string;
  testimonio: string;
  desafio?: string;
  diagnostico?: string;
  duracion?: string;
  solucion?: string;
  solucionFeatures?: string[];
  stats?: { value: string; label: string; }[];
}

export interface Tratamiento {
  id: string;
  tituloHero: string;
  descripcionHero: string;
  icon: LucideIcon;
  heroImage: string;
  features: string[];
  casosClinicos: CasoClinico[];
}

export const tratamientos: Tratamiento[] = [
  {
    id: 'implantes',
    tituloHero: 'Implantes Dentales',
    descripcionHero: 'Recupera la funcionalidad total y la estética natural de su sonrisa con nuestra tecnología de implantes. Un procedimiento seguro, indoloro y con resultados predecibles.',
    icon: Drill,
    heroImage: '/images/implantes-hero.jpg', // Placeholder path
    features: [
      'Materiales Bio-compatibles: Utilizamos titanio de grado médico de primer nivel, garantizando una osteointegración perfecta con el hueso.',
      '98% Tasa de éxito: Nuestra metodología y tecnología de vanguardia aseguran resultados óptimos en casi la totalidad de los casos.',
      '15 años de experiencia: Más de 15 años de experiencia avala nuestro trabajo.',
      'Tecnología 3D: Utilizamos escaneos digitales para nuestras cirugìas y pròtesis'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Paciente',
        fecha: 'Marzo 2024',
        titulo: 'Rehabilitación Superior',
        descripcion: 'Ana recuperó su seguridad al hablar y sonreír tras un tratamiento de implantes de carga inmediata.',
        imagenAntes: '/images/casos/ana-antes.jpg',
        imagenDespues: '/images/casos/ana-despues.jpg',
        testimonio: 'No imaginé que el cambio sería tan radical. Ahora vivo sin la inseguridad de comer cualquier cosa.',
        desafio: 'Ana llegó con una pérdida significativa de piezas dentales superiores debido a años de desgaste y periodontitis. El mayor obstáculo no era solo rehabilitar su sonrisa, sino devolverle la confianza para comer y hablar sin dolor.',
        diagnostico: 'Atrofia alveolar y colapso oclusal.',
        duracion: '3 meses de tratamiento.',
        solucion: 'Implementamos un protocolo de implantes de carga inmediata. Utilizamos escaneo intraoral 3D para diseñar una prótesis fija que respeta la biomecánica natural de la paciente.',
        solucionFeatures: [
          'Cirugía Guiada por Computadora',
          'Prótesis Cerámica Pre-tallada',
          'Ajuste Oclusal Dinámico'
        ],
        stats: [
          { label: 'Recuperación Funcional', value: '100%' },
          { label: 'Dolor Post-Op', value: '0' },
          { label: 'Estética Natural', value: 'A++' },
          { label: 'Años de Durabilidad', value: '10+' }
        ]
      },
      {
        id: 2,
        paciente: 'Paciente',
        fecha: 'Enero 2024',
        titulo: 'Implante Unitario',
        descripcion: 'Restauración de pieza frontal con acabado imperceptible.',
        imagenAntes: '/images/casos/carlos-antes.jpg',
        imagenDespues: '/images/casos/carlos-despues.jpg',
        testimonio: 'La naturalidad es impresionante. Nadie nota que es un diente artificial.'
      },
      {
        id: 3,
        paciente: 'Paciente',
        fecha: 'Diciembre 2023',
        titulo: 'Puente sobre Implantes',
        descripcion: 'Solución fija para múltiples piezas perdidas.',
        imagenAntes: '/images/casos/roberto-antes.jpg',
        imagenDespues: '/images/casos/roberto-despues.jpg',
        testimonio: 'Proceso impecable. El Dr. fue muy detallista y profesional en todo momento.'
      },
      {
        id: 4,
        paciente: 'Paciente',
        fecha: 'Diciembre 2026',
        titulo: 'Puente sobre Implantes',
        descripcion: 'Solución fija para múltiples piezas perdidas.',
        imagenAntes: '/images/casos/roberto-antes.jpg',
        imagenDespues: '/images/casos/roberto-despues.jpg',
        testimonio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Quisquam, quod. Quisquam, quod. Quisquam, quod. Quisquam, quod.'
      }
    ]
  },
  {
    id: 'ortodoncia-invisible',
    tituloHero: 'Ortodoncia Invisible',
    descripcionHero: 'Alinea tus dientes de forma discreta y cómoda con alineadores transparentes de última generación. La solución perfecta para adultos que buscan estética y resultados rápidos.',
    icon: Smile,
    heroImage: '/images/ortodoncia-hero.jpg',
    features: [
      'Removibles y Cómodos: Puedes quitártelos para comer y cepillarte, manteniendo una higiene perfecta.',
      'Prácticamente Invisibles: Nadie notará que estás bajo tratamiento de ortodoncia.',
      'Experiencia: Màs de de 15 años avala nuestro trabajo.',
      'Menos Visitas: Sistema eficiente que requiere menos ajustes manuales en clínica.'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Paciente',
        fecha: 'Febrero 2024',
        titulo: 'Alineación de Arcada',
        descripcion: 'Elena logró la sonrisa que siempre quiso en solo 12 meses sin usar brackets.',
        imagenAntes: '/images/casos/elena-antes.jpg',
        imagenDespues: '/images/casos/elena-despues.jpg',
        testimonio: 'Lo mejor fue que nadie se dio cuenta. Muy cómodo para mi trabajo cara al público.'
      }
    ]
  },
  {
    id: 'estetica-dental',
    tituloHero: 'Estética Dental',
    descripcionHero: 'Diseño de sonrisa personalizado mediante carillas de diferentes materiales y blanqueamiento avanzado. Resultados armónicos que potencian tu belleza natural.',
    icon: Sparkles,
    heroImage: '/images/estetica-hero.jpg',
    features: [
      'Carillas Ultrafinas: Mínimo tallado dental para un resultado natural y duradero.',
      'Blanqueamiento ambulatorio: aclara varios tonos con mínima sensibilidad.',
      'Diseño Digital DSD: Visualiza tu nueva sonrisa en el ordenador antes de iniciar.',
      'Materiales Premium: Cerámicas de alta gama que imitan el esmalte natural.'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Paciente',
        fecha: 'Noviembre 2023',
        titulo: 'Cambio de Look',
        descripcion: 'Transformación total mediante 6 carillas de porcelana superiores.',
        imagenAntes: '/images/casos/julia-antes.jpg',
        imagenDespues: '/images/casos/julia-despues.jpg',
        testimonio: 'Mi cara se ve mucho más joven. El cambio en las proporciones fue la clave.'
      }
    ]
  },
  {
    id: 'ortopedia',
    tituloHero: 'Ortopedia',
    descripcionHero: 'Guía del crecimiento óseo y correción funcional temprana para lograr una armonìa facial integral.',
    icon: Sparkles,
    heroImage: '/images/ortopedia-hero.jpg',
    features: [
      'Desarrollo maxilar: Estimulaciòn y guìa del crecimiento del hueso de la cara.',
      'Correcciòn funcional: reeducación de la respiración, masticaciòn y degluciòn.',
      'Equilibrio facial: Mejora del perfil y la simetría mandibular.',
      'Prevenciòn: evita extracciones y cirugìas complejas en la adultez.'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Paciente',
        fecha: 'Octubre 2024',
        titulo: 'Ortopedia Maxilar',
        descripcion: 'Expansión maxilar y guía de crecimiento.',
        imagenes: [
          '/images/ortopedia-hero.jpg',
          '/images/ortopedia-hero.jpg',
          '/images/ortopedia-hero.jpg'
        ],
        etiquetasImagenes: ['ANTES', 'EN PROGRESO', 'DESPUÉS'],
        estado: 'En proceso',
        testimonio: 'Notamos un gran cambio en la respiración y postura desde que iniciamos.',
        desafio: 'Falta de espacio para la erupción de los dientes permanentes y respiración bucal.',
        diagnostico: 'Maxilar estrecho y mordida cruzada posterior.',
        duracion: '18 meses',
        solucion: 'Uso de aparatología ortopédica funcional para expandir el maxilar y reeducar la postura lingual.',
        solucionFeatures: ['Aparatología removible', 'Ejercicios miofuncionales', 'Monitoreo mensual']
      }
    ]
  },
  {
    id: 'pediatria',
    tituloHero: 'Odontología Pediátrica',
    descripcionHero: 'Cuidado especializado y cercano para proteger la salud dental infantil, fomentando hábitos positivos para los más pequeños',
    icon: Smile,
    heroImage: '/images/pediatria-hero.jpg',
    features: [
      'Prevención temprana: control del desarrollo dental e intervención a tiempo.',
      'Enfoque adaptativo: manejo de ansiedad para experiencias sin miedo.',
      'Educación en salud: guía en higiene y nutrición para niños y padres.',
      'Crecimiento sano: monitoreo del recambio dentario y mantenimiento de espacios.'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Paciente',
        fecha: 'Septiembre 2024',
        titulo: 'Rehabilitación Infantil',
        descripcion: 'Tratamiento amigable y sin dolor para múltiples caries.',
        imagenes: [
          '/images/pediatria-hero.jpg'
        ],
        estado: 'Finalizado',
        testimonio: 'Mi hijo entró con miedo y salió sonriendo. La paciencia de las doctoras es increíble.',
        desafio: 'Paciente de 5 años con múltiples caries de primera infancia y mucho temor al dentista.',
        diagnostico: 'Caries de la primera infancia severa.',
        duracion: '4 sesiones cortas',
        solucion: 'Adaptación al entorno dental mediante juegos, y posterior restauración con resinas estéticas.',
        solucionFeatures: ['Técnica de decir-mostrar-hacer', 'Materiales bioactivos', 'Refuerzo positivo']
      }
    ]
  },
  {
    id: 'endodoncia',
    tituloHero: 'Endodoncia',
    descripcionHero: 'Tecnología avanzada para preservar tus piezas dentales naturales, eliminando el dolor y las infecciones de forma precisa, cómoda y segura',
    icon: Drill,
    heroImage: '/images/endodoncia-hero.jpg',
    features: [
      'Prevención dental: salvamos el dientes y evitamos la extracción.',
      'Tecnología rotatoria: uso de sistema mecanizado que garantizan rapidez y eficacia.',
      'Biocompatibilidad: sellado hermético con materiales de última generación.'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Paciente',
        fecha: 'Julio 2024',
        titulo: 'Tratamiento de Conducto Molar',
        descripcion: 'Salvamos una pieza clave que presentaba infección profunda.',
        imagenAntes: '/images/endodoncia-hero.jpg',
        imagenDespues: '/images/endodoncia-hero.jpg',
        estado: 'Finalizado',
        testimonio: 'No sentí nada de dolor durante ni después del tratamiento. Pude conservar mi diente natural.',
        desafio: 'Infección profunda en un molar inferior con conductos curvos y calcificados.',
        diagnostico: 'Pulpitis irreversible sintomática con periodontitis apical.',
        duracion: '1 sesión de 90 minutos',
        solucion: 'Tratamiento de conducto mecanizado con magnificación y sellado tridimensional.',
        solucionFeatures: ['Microscopio dental', 'Instrumentación mecanizada', 'Sellado biocerámico']
      }
    ]
  }
];
