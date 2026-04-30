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

import implantes from './tratamientos/implantes.json';
import ortodoncia from './tratamientos/ortodoncia-invisible.json';
import estetica from './tratamientos/estetica-dental.json';
import ortopedia from './tratamientos/ortopedia.json';
import pediatria from './tratamientos/pediatria.json';
import endodoncia from './tratamientos/endodoncia.json';

const tratamientosData = [
  implantes,
  ortodoncia,
  estetica,
  ortopedia,
  pediatria,
  endodoncia
];

const iconMap: Record<string, LucideIcon> = {
  Drill,
  Smile,
  Sparkles
};

export const tratamientos: Tratamiento[] = tratamientosData.map((t: any) => ({
  ...t,
  icon: iconMap[t.icon] || Sparkles
})) as Tratamiento[];
