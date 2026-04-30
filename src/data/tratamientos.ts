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

import tratamientosData from './tratamientos.json';

const iconMap: Record<string, LucideIcon> = {
  Drill,
  Smile,
  Sparkles
};

export const tratamientos: Tratamiento[] = tratamientosData.map((t: any) => ({
  ...t,
  icon: iconMap[t.icon] || Sparkles
})) as Tratamiento[];
