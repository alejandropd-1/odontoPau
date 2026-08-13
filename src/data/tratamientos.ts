import fs from 'node:fs';
import path from 'node:path';

export interface CasoClinico {
  id: number;
  articleSlug?: string;
  paciente: string;
  fecha?: string;
  titulo: string;
  descripcion: string;
  imagenAntes?: string;
  imagenDespues?: string;
  imagenes?: string[];
  etiquetasImagenes?: string[];
  estado?: string;
  testimonio?: string;
  desafio?: string;
  diagnostico?: string;
  duracion?: string;
  solucion?: string;
  solucionFeatures?: string[];
  stats?: { value: string; label: string; }[];
}

export interface TratamientoProfessional {
  name: string;
  role: string;
  mobileRole?: string;
  image: string;
  imageAlt: string;
}

export interface Tratamiento {
  type: 'Tratamiento';
  id: string;
  category: string;
  categoryLabel: string;
  order?: number;
  tituloHero: string;
  descripcionHero: string;
  icon: string;
  heroImage: string;
  professionals?: TratamientoProfessional[];
  pageCopy: {
    heroEyebrow: string;
    heroCtaLabel: string;
    casesTitle: string;
    casesDescription: string;
    caseLinkLabel: string;
    articlesEyebrow: string;
    articlesTitle: string;
    articleLinkLabel: string;
    allArticlesPrefix: string;
    featuresTitlePrefix: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonLabel: string;
  };
  features: string[];
  casosClinicos: CasoClinico[];
  sourcePath: string;
}

const tratamientosRoot = path.join(process.cwd(), 'src', 'data', 'tratamientos');

function getTreatmentFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getTreatmentFiles(fullPath);
      }

      return entry.isFile() && entry.name.endsWith('.json') ? [fullPath] : [];
    });
}

export function loadTreatment(filePath: string): Tratamiento {
  const rawTreatment = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Omit<Tratamiento, 'sourcePath'>;
  const sourcePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

  const requiredRootFields: Array<keyof Pick<Tratamiento, 'id' | 'category' | 'categoryLabel' | 'tituloHero' | 'descripcionHero' | 'icon' | 'heroImage'>> = [
    'id',
    'category',
    'categoryLabel',
    'tituloHero',
    'descripcionHero',
    'icon',
    'heroImage',
  ];
  requiredRootFields.forEach((field) => {
    if (typeof rawTreatment[field] !== 'string' || rawTreatment[field].trim() === '') {
      throw new Error(`Tratamiento invalido en ${sourcePath}: ${field} debe ser un texto no vacio.`);
    }
  });

  const pageCopyFields: Array<keyof Tratamiento['pageCopy']> = [
    'heroEyebrow',
    'heroCtaLabel',
    'casesTitle',
    'casesDescription',
    'caseLinkLabel',
    'articlesEyebrow',
    'articlesTitle',
    'articleLinkLabel',
    'allArticlesPrefix',
    'featuresTitlePrefix',
    'ctaTitle',
    'ctaDescription',
    'ctaButtonLabel',
  ];
  if (!rawTreatment.pageCopy || typeof rawTreatment.pageCopy !== 'object') {
    throw new Error(`Tratamiento invalido en ${sourcePath}: pageCopy debe ser un objeto.`);
  }
  pageCopyFields.forEach((field) => {
    if (typeof rawTreatment.pageCopy[field] !== 'string' || rawTreatment.pageCopy[field].trim() === '') {
      throw new Error(`Tratamiento invalido en ${sourcePath}: pageCopy.${field} debe ser un texto no vacio.`);
    }
  });

  if (!Array.isArray(rawTreatment.features) || !rawTreatment.features.every((feature) => typeof feature === 'string' && feature.trim() !== '')) {
    throw new Error(`Tratamiento invalido en ${sourcePath}: features debe ser una lista de textos no vacios.`);
  }
  if (!Array.isArray(rawTreatment.casosClinicos)) {
    throw new Error(`Tratamiento invalido en ${sourcePath}: casosClinicos debe ser una lista.`);
  }

  if (rawTreatment.professionals !== undefined) {
    if (!Array.isArray(rawTreatment.professionals)) {
      throw new Error(`Tratamiento invalido en ${sourcePath}: professionals debe ser una lista.`);
    }

    rawTreatment.professionals.forEach((professional, index) => {
      const requiredFields: Array<keyof TratamientoProfessional> = [
        'name',
        'role',
        'image',
        'imageAlt',
      ];

      requiredFields.forEach((field) => {
        if (typeof professional[field] !== 'string' || professional[field].trim() === '') {
          throw new Error(
            `Tratamiento invalido en ${sourcePath}: professionals[${index}].${field} debe ser un texto no vacio.`,
          );
        }
      });

      if (
        professional.mobileRole !== undefined
        && (typeof professional.mobileRole !== 'string' || professional.mobileRole.trim() === '')
      ) {
        throw new Error(
          `Tratamiento invalido en ${sourcePath}: professionals[${index}].mobileRole debe ser un texto no vacio.`,
        );
      }

      if (!professional.image.startsWith('/images/')) {
        throw new Error(
          `Tratamiento invalido en ${sourcePath}: professionals[${index}].image debe ser un activo local de /images.`,
        );
      }
    });
  }

  return {
    ...rawTreatment,
    sourcePath,
  };
}

export function getTratamientos(): Tratamiento[] {
  return getTreatmentFiles(tratamientosRoot)
    .map(loadTreatment)
    .sort((a, b) => {
      const orderDelta = (a.order ?? 999) - (b.order ?? 999);
      return orderDelta || a.tituloHero.localeCompare(b.tituloHero, 'es');
    });
}

export function getTratamientoById(id: string) {
  return getTratamientos().find((tratamiento) => tratamiento.id === id);
}
