import fs from 'node:fs';
import path from 'node:path';

export interface InstruccionSection {
  title: string;
  intro?: string;
  items: string[];
  note?: string;
}

export interface Instruccion {
  type: 'Instruccion';
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  serviceId?: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: string;
  published: boolean;
  heroLabel?: string;
  whatsappMessage?: string;
  shareImage?: string;
  sourcePath: string;
  sections: InstruccionSection[];
}

const instruccionesRoot = path.join(process.cwd(), 'src', 'data', 'instrucciones');

function getInstructionFiles(directory: string): string[] {
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

function loadInstruction(filePath: string): Instruccion {
  const rawInstruction = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Omit<Instruccion, 'sourcePath'>;
  const sourcePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

  return {
    ...rawInstruction,
    sourcePath,
  };
}

const instruccionesData = getInstructionFiles(instruccionesRoot)
  .map(loadInstruction)
  .sort((a, b) => a.title.localeCompare(b.title, 'es'));

export const instrucciones = instruccionesData as Instruccion[];

export const publishedInstrucciones = instrucciones.filter((item) => item.published);
