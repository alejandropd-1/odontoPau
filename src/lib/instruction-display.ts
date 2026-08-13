import type { InstructionStatus } from '@/data/instrucciones';

export const instructionStatusLabels: Record<InstructionStatus, string> = {
  draft: 'borrador',
  clinical_review: 'revisión clínica',
  technical_review: 'revisión técnica',
  approved: 'aprobada',
  published: 'publicada',
};

export function formatInstructionDate(value: string) {
  const dateString = value.includes('T') ? value : `${value}T00:00:00Z`;
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateString));
}
