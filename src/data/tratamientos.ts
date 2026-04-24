import { Drill, Smile, Sparkles } from 'lucide-react';

export const tratamientos = [
  {
    id: 'implantes',
    tituloHero: 'Implantes Dentales',
    descripcionHero: 'Recupera la funcionalidad total y la estética natural de su sonrisa con nuestra tecnología de implantes de precisión suiza. Un procedimiento seguro, indoloro y con resultados permanentes.',
    icon: Drill,
    heroImage: '/images/implantes-hero.jpg', // Placeholder path
    features: [
      'Materiales Bio-compatibles: Utilizamos titanio de grado médico de primer nivel, garantizando una osteointegración perfecta con el hueso.',
      '98% Tasa de éxito: Nuestra metodología y tecnología de vanguardia aseguran resultados óptimos en casi la totalidad de los casos.',
      '10+ Años de garantía: Respaldamos nuestro trabajo con garantías extendidas para su total tranquilidad.',
      'Tecnología 3D Guiada: Utilizamos escaneos digitales y guías quirúrgicas personalizadas para una colocación exacta, minimizando la inflamación y acelerando la recuperación.'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Ana Martínez',
        fecha: 'Marzo 2024',
        titulo: 'Rehabilitación Superior',
        descripcion: 'Ana recuperó su seguridad al hablar y sonreír tras un tratamiento de implantes de carga inmediata.',
        imagenAntes: '/images/casos/ana-antes.jpg',
        imagenDespues: '/images/casos/ana-despues.jpg',
        testimonio: 'No imaginé que el cambio sería tan radical. Ahora vivo sin la inseguridad de comer cualquier cosa.',
        rating: 5
      },
      {
        id: 2,
        paciente: 'Carlos Ruiz',
        fecha: 'Enero 2024',
        titulo: 'Implante Unitario',
        descripcion: 'Restauración de pieza frontal con acabado imperceptible.',
        imagenAntes: '/images/casos/carlos-antes.jpg',
        imagenDespues: '/images/casos/carlos-despues.jpg',
        testimonio: 'La naturalidad es impresionante. Nadie nota que es un diente artificial.',
        rating: 5
      },
      {
        id: 3,
        paciente: 'Roberto S.',
        fecha: 'Diciembre 2023',
        titulo: 'Puente sobre Implantes',
        descripcion: 'Solución fija para múltiples piezas perdidas.',
        imagenAntes: '/images/casos/roberto-antes.jpg',
        imagenDespues: '/images/casos/roberto-despues.jpg',
        testimonio: 'Proceso impecable. El Dr. fue muy detallista y profesional en todo momento.',
        rating: 5
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
      'Resultados Predecibles: Planificación digital 3D para ver el resultado final antes de empezar.',
      'Menos Visitas: Sistema eficiente que requiere menos ajustes manuales en clínica.'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Elena G.',
        fecha: 'Febrero 2024',
        titulo: 'Alineación de Arcada',
        descripcion: 'Elena logró la sonrisa que siempre quiso en solo 12 meses sin usar brackets.',
        imagenAntes: '/images/casos/elena-antes.jpg',
        imagenDespues: '/images/casos/elena-despues.jpg',
        testimonio: 'Lo mejor fue que nadie se dio cuenta. Muy cómodo para mi trabajo cara al público.',
        rating: 5
      }
    ]
  },
  {
    id: 'estetica-dental',
    tituloHero: 'Estética Dental',
    descripcionHero: 'Diseño de sonrisa personalizado mediante carillas de porcelana y blanqueamiento avanzado. Resultados armónicos que potencian tu belleza natural.',
    icon: Sparkles,
    heroImage: '/images/estetica-hero.jpg',
    features: [
      'Carillas Ultrafinas: Mínimo tallado dental para un resultado natural y duradero.',
      'Blanqueamiento Láser: Aclara varios tonos en una sola sesión con mínima sensibilidad.',
      'Diseño Digital DSD: Visualiza tu nueva sonrisa en el ordenador antes de iniciar.',
      'Materiales Premium: Cerámicas de alta gama que imitan el esmalte natural.'
    ],
    casosClinicos: [
      {
        id: 1,
        paciente: 'Julia V.',
        fecha: 'Noviembre 2023',
        titulo: 'Cambio de Look',
        descripcion: 'Transformación total mediante 6 carillas de porcelana superiores.',
        imagenAntes: '/images/casos/julia-antes.jpg',
        imagenDespues: '/images/casos/julia-despues.jpg',
        testimonio: 'Mi cara se ve mucho más joven. El cambio en las proporciones fue la clave.',
        rating: 5
      }
    ]
  }
];
