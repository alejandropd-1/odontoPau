import fs from 'node:fs';
import path from 'node:path';
import { getTratamientos } from '@/data/tratamientos';

export type InstructionStatus =
  | 'draft'
  | 'clinical_review'
  | 'technical_review'
  | 'approved'
  | 'published'
  | 'retired';

export const instructionStatusLabels: Record<InstructionStatus, string> = {
  draft: 'borrador',
  clinical_review: 'revisión clínica',
  technical_review: 'revisión técnica',
  approved: 'aprobada',
  published: 'publicada',
  retired: 'retirada',
};

export type InstructionNoticeTone = 'info' | 'important' | 'contact';

export interface InstructionImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  downloadLabel?: string;
  downloadSrc?: string;
}

export interface InstructionResourceGallery {
  title: string;
  intro?: string;
  images: InstructionImage[];
}

export interface InstructionStepsSection {
  type: 'steps';
  title?: string;
  intro?: string;
  items: string[];
}

export interface InstructionMatrixGroup {
  title: string;
  yes?: string[];
  caution?: string[];
  no?: string[];
}

export interface InstructionMatrixSection {
  type: 'matrix';
  title?: string;
  intro?: string;
  groups: InstructionMatrixGroup[];
}

export interface InstructionNoticeSection {
  type: 'notice';
  tone: InstructionNoticeTone;
  title: string;
  text: string;
}

export interface InstructionTextSection {
  type: 'text';
  title?: string;
  paragraphs: string[];
}

export type InstructionSection =
  | InstructionStepsSection
  | InstructionMatrixSection
  | InstructionNoticeSection
  | InstructionTextSection;

export interface Instruccion {
  type: 'Instruccion';
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  serviceId?: string;
  title: string;
  excerpt: string;
  status: InstructionStatus;
  createdAt?: string;
  publishedAt?: string;
  updatedAt: string;
  clinicalReviewer?: string;
  tags: string[];
  readTime: string;
  heroLabel?: string;
  resourceImage?: InstructionImage;
  resourceGallery?: InstructionResourceGallery;
  socialImage?: InstructionImage;
  sections: InstructionSection[];
  sourcePath: string;
}

const instructionStatuses = new Set<InstructionStatus>([
  'draft',
  'clinical_review',
  'technical_review',
  'approved',
  'published',
  'retired',
]);
const noticeTones = new Set<InstructionNoticeTone>(['info', 'important', 'contact']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const instruccionesRoot = path.join(process.cwd(), 'src', 'data', 'instrucciones');

function getInstructionFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getInstructionFiles(fullPath);
      }

      return entry.isFile() && entry.name.endsWith('.json') ? [fullPath] : [];
    });
}

function requireString(value: unknown, field: string, sourcePath: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Instruccion invalida en ${sourcePath}: ${field} debe ser un texto no vacio.`);
  }
}

function requireStringList(value: unknown, field: string, sourcePath: string): asserts value is string[] {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string' || item.trim() === '')) {
    throw new Error(`Instruccion invalida en ${sourcePath}: ${field} debe ser una lista no vacia de textos.`);
  }
}

function validateOptionalString(value: unknown, field: string, sourcePath: string): void {
  if (value !== undefined && typeof value !== 'string') {
    throw new Error(`Instruccion invalida en ${sourcePath}: ${field} debe ser un texto.`);
  }
}

function validateOptionalIsoDate(value: unknown, field: string, sourcePath: string): void {
  if (value === undefined) return;
  requireString(value, field, sourcePath);
  if (!value.endsWith('Z') || Number.isNaN(Date.parse(value))) {
    throw new Error(`Instruccion invalida en ${sourcePath}: ${field} debe ser una fecha ISO UTC.`);
  }
}

function validateImage(image: InstructionImage, field: string, sourcePath: string) {
  if (!image || typeof image !== 'object') {
    throw new Error(`Instruccion invalida en ${sourcePath}: ${field} debe ser una imagen.`);
  }

  requireString(image.src, `${field}.src`, sourcePath);
  requireString(image.alt, `${field}.alt`, sourcePath);
  validateOptionalString(image.label, `${field}.label`, sourcePath);
  validateOptionalString(image.downloadLabel, `${field}.downloadLabel`, sourcePath);

  if (!Number.isFinite(image.width) || image.width <= 0 || !Number.isFinite(image.height) || image.height <= 0) {
    throw new Error(`Instruccion invalida en ${sourcePath}: ${field} necesita dimensiones positivas.`);
  }

  if (!image.src.startsWith('/images/')) {
    throw new Error(`Instruccion invalida en ${sourcePath}: ${field}.src debe estar bajo /images/.`);
  }

  const publicFile = path.join(process.cwd(), 'public', image.src.slice(1));
  if (!fs.existsSync(publicFile)) {
    throw new Error(`Instruccion invalida en ${sourcePath}: no existe ${image.src}.`);
  }

  if (image.downloadSrc !== undefined) {
    requireString(image.downloadSrc, `${field}.downloadSrc`, sourcePath);
    if (!image.downloadSrc.startsWith('/images/') && !image.downloadSrc.startsWith('/videos/')) {
      throw new Error(`Instruccion invalida en ${sourcePath}: ${field}.downloadSrc debe estar bajo /images/ o /videos/.`);
    }

    const downloadFile = path.join(process.cwd(), 'public', image.downloadSrc.slice(1));
    if (!fs.existsSync(downloadFile)) {
      throw new Error(`Instruccion invalida en ${sourcePath}: no existe ${image.downloadSrc}.`);
    }
  }

  if (image.downloadSrc !== undefined) {
    requireString(image.downloadLabel, `${field}.downloadLabel`, sourcePath);
  }
}

function validateSection(section: InstructionSection, index: number, sourcePath: string) {
  const field = `sections[${index}]`;
  requireString(section?.type, `${field}.type`, sourcePath);

  switch (section.type) {
    case 'steps':
      validateOptionalString(section.title, `${field}.title`, sourcePath);
      validateOptionalString(section.intro, `${field}.intro`, sourcePath);
      requireStringList(section.items, `${field}.items`, sourcePath);
      break;
    case 'matrix':
      validateOptionalString(section.title, `${field}.title`, sourcePath);
      validateOptionalString(section.intro, `${field}.intro`, sourcePath);
      if (!Array.isArray(section.groups) || section.groups.length === 0) {
        throw new Error(`Instruccion invalida en ${sourcePath}: ${field}.groups no puede estar vacio.`);
      }
      section.groups.forEach((group, groupIndex) => {
        const groupField = `${field}.groups[${groupIndex}]`;
        requireString(group.title, `${groupField}.title`, sourcePath);
        const lists = [group.yes, group.caution, group.no].filter((list) => list !== undefined);
        if (lists.length === 0) {
          throw new Error(`Instruccion invalida en ${sourcePath}: ${groupField} necesita al menos un estado.`);
        }
        lists.forEach((list, listIndex) => requireStringList(list, `${groupField}.estado[${listIndex}]`, sourcePath));
      });
      break;
    case 'notice':
      requireString(section.title, `${field}.title`, sourcePath);
      requireString(section.text, `${field}.text`, sourcePath);
      if (!noticeTones.has(section.tone)) {
        throw new Error(`Instruccion invalida en ${sourcePath}: ${field}.tone es desconocido.`);
      }
      break;
    case 'text':
      validateOptionalString(section.title, `${field}.title`, sourcePath);
      requireStringList(section.paragraphs, `${field}.paragraphs`, sourcePath);
      break;
    default: {
      const exhaustiveCheck: never = section;
      throw new Error(`Instruccion invalida en ${sourcePath}: tipo de seccion desconocido ${String(exhaustiveCheck)}.`);
    }
  }
}

export function validateInstructionDocument(
  instruction: Omit<Instruccion, 'sourcePath'>,
  sourcePath = 'documento-en-memoria'
): void {
  requireString(instruction.id, 'id', sourcePath);
  requireString(instruction.slug, 'slug', sourcePath);
  requireString(instruction.category, 'category', sourcePath);
  requireString(instruction.categoryLabel, 'categoryLabel', sourcePath);
  requireString(instruction.title, 'title', sourcePath);
  requireString(instruction.excerpt, 'excerpt', sourcePath);
  requireString(instruction.updatedAt, 'updatedAt', sourcePath);
  validateOptionalIsoDate(instruction.updatedAt, 'updatedAt', sourcePath);
  requireString(instruction.readTime, 'readTime', sourcePath);
  requireStringList(instruction.tags, 'tags', sourcePath);
  validateOptionalString(instruction.serviceId, 'serviceId', sourcePath);
  validateOptionalString(instruction.clinicalReviewer, 'clinicalReviewer', sourcePath);
  validateOptionalString(instruction.heroLabel, 'heroLabel', sourcePath);
  validateOptionalIsoDate(instruction.createdAt, 'createdAt', sourcePath);
  validateOptionalIsoDate(instruction.publishedAt, 'publishedAt', sourcePath);

  if (instruction.type !== 'Instruccion') {
    throw new Error(`Instruccion invalida en ${sourcePath}: type debe ser Instruccion.`);
  }
  if (!slugPattern.test(instruction.slug) || !slugPattern.test(instruction.category)) {
    throw new Error(`Instruccion invalida en ${sourcePath}: slug y category deben usar minusculas, numeros y guiones.`);
  }
  if (!instructionStatuses.has(instruction.status)) {
    throw new Error(`Instruccion invalida en ${sourcePath}: estado editorial desconocido.`);
  }
  if (instruction.status === 'published') {
    requireString(instruction.publishedAt, 'publishedAt', sourcePath);
    requireString(instruction.clinicalReviewer, 'clinicalReviewer', sourcePath);
  }
  if (instruction.resourceImage) {
    validateImage(instruction.resourceImage, 'resourceImage', sourcePath);
  }
  if (instruction.resourceGallery) {
    requireString(instruction.resourceGallery.title, 'resourceGallery.title', sourcePath);
    if (instruction.resourceGallery.intro !== undefined) {
      requireString(instruction.resourceGallery.intro, 'resourceGallery.intro', sourcePath);
    }
    if (!Array.isArray(instruction.resourceGallery.images) || instruction.resourceGallery.images.length === 0) {
      throw new Error(`Instruccion invalida en ${sourcePath}: resourceGallery.images no puede estar vacio.`);
    }
    instruction.resourceGallery.images.forEach((image, index) => {
      validateImage(image, `resourceGallery.images[${index}]`, sourcePath);
    });
  }
  if (instruction.socialImage) {
    validateImage(instruction.socialImage, 'socialImage', sourcePath);
  }
  if (!Array.isArray(instruction.sections) || instruction.sections.length === 0) {
    throw new Error(`Instruccion invalida en ${sourcePath}: sections no puede estar vacio.`);
  }
  instruction.sections.forEach((section, index) => validateSection(section, index, sourcePath));

}

function loadInstruction(filePath: string): Instruccion {
  const sourcePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const instruction = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Omit<Instruccion, 'sourcePath'>;
  validateInstructionDocument(instruction, sourcePath);
  return { ...instruction, sourcePath };
}

function validateInstructions(items: Instruccion[]) {
  const slugs = new Set<string>();
  const ids = new Set<string>();
  const treatmentIds = new Set(getTratamientos().map((treatment) => treatment.id));

  items.forEach((instruction) => {
    const routeKey = `${instruction.category}/${instruction.slug}`;
    if (slugs.has(routeKey)) {
      throw new Error(`Ruta de instruccion duplicada: ${routeKey}.`);
    }
    if (ids.has(instruction.id)) {
      throw new Error(`ID de instruccion duplicado: ${instruction.id}.`);
    }
    if (instruction.serviceId && !treatmentIds.has(instruction.serviceId)) {
      throw new Error(`Instruccion ${instruction.slug}: tratamiento inexistente ${instruction.serviceId}.`);
    }
    slugs.add(routeKey);
    ids.add(instruction.id);
  });
}

const instruccionesData = getInstructionFiles(instruccionesRoot).map(loadInstruction);
validateInstructions(instruccionesData);

export const instrucciones = instruccionesData.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
export const publishedInstrucciones = instrucciones.filter((item) => item.status === 'published');

export function isInstructionPreviewBuild() {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.CONTEXT === 'deploy-preview' ||
    process.env.CONTEXT === 'branch-deploy' ||
    process.env.CONTEXT === 'dev' ||
    process.env.NETLIFY_PREVIEW_SERVER === 'true'
  );
}

export function getRoutableInstructions() {
  return isInstructionPreviewBuild() ? instrucciones : publishedInstrucciones;
}

export function getRoutableInstruction(category: string, slug: string) {
  return getRoutableInstructions().find((item) => item.category === category && item.slug === slug);
}

export function getInstructionCanonicalUrl(category: string, slug: string) {
  return `https://paulagualtieri.com/instrucciones/${category}/${slug}`;
}

function getInstructionPublicBaseUrl() {
  if (isInstructionPreviewBuild()) {
    const previewUrl = process.env.DEPLOY_PRIME_URL || process.env.DEPLOY_URL;
    if (previewUrl) {
      return previewUrl;
    }
  }

  return 'https://paulagualtieri.com';
}

export function getInstructionShareUrl(category: string, slug: string) {
  return new URL(`/instrucciones/${category}/${slug}`, getInstructionPublicBaseUrl()).toString();
}

export function getInstructionAssetUrl(src: string) {
  return new URL(src, getInstructionPublicBaseUrl()).toString();
}

export function formatInstructionDate(value: string) {
  const dateString = value.includes('T') ? value : `${value}T00:00:00Z`;
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateString));
}
