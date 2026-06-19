import React from 'react';
import { Drill, Smile, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Drill,
  Smile,
  Sparkles,
};

interface TreatmentIconProps {
  name: string;
  className?: string;
}

export default function TreatmentIcon({ name, className }: TreatmentIconProps) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon className={className} />;
}
