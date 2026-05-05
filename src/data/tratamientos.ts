import { Drill, Smile, Sparkles, Stethoscope, Baby, ShieldCheck } from 'lucide-react';
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
  filePath: string;
  badge?: string;
  specialists?: { name: string; role: string; }[];
  stats?: { label: string; value: string; }[];
  cta?: {
    title: string;
    description: string;
    buttonText?: string;
  };
}

import implantes from './tratamientos/implantes.json';
import ortodoncia from './tratamientos/ortodoncia-invisible.json';
import estetica from './tratamientos/estetica-dental.json';
import ortopedia from './tratamientos/ortopedia.json';
import pediatria from './tratamientos/pediatria.json';
import endodoncia from './tratamientos/endodoncia.json';

const tratamientosData = [
  { ...implantes, filePath: 'src/data/tratamientos/implantes.json' },
  { ...ortodoncia, filePath: 'src/data/tratamientos/ortodoncia-invisible.json' },
  { ...estetica, filePath: 'src/data/tratamientos/estetica-dental.json' },
  { ...ortopedia, filePath: 'src/data/tratamientos/ortopedia.json' },
  { ...pediatria, filePath: 'src/data/tratamientos/pediatria.json' },
  { ...endodoncia, filePath: 'src/data/tratamientos/endodoncia.json' }
];

const iconMap: Record<string, LucideIcon> = {
  Drill,
  Smile,
  Sparkles,
  Stethoscope,
  Baby,
  ShieldCheck
};

export const tratamientos: Tratamiento[] = tratamientosData.map((t: any) => ({
  ...t,
  icon: iconMap[t.icon] || Sparkles
})) as Tratamiento[];
