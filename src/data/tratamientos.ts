import fs from 'node:fs';
import path from 'node:path';

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
  type: 'Tratamiento';
  id: string;
  category: string;
  categoryLabel: string;
  order?: number;
  tituloHero: string;
  descripcionHero: string;
  icon: string;
  heroImage: string;
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

function loadTreatment(filePath: string): Tratamiento {
  const rawTreatment = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Omit<Tratamiento, 'sourcePath'>;
  const sourcePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

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
