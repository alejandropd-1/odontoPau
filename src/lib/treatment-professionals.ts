import type { TratamientoProfessional } from '@/data/tratamientos';

export function getTreatmentProfessionalMobileRole(
  professional: TratamientoProfessional,
): string {
  return professional.mobileRole ?? professional.role;
}
