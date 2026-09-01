export const editorialProfiles = ['solo', 'collaborative'] as const;
export type EditorialProfile = (typeof editorialProfiles)[number];

export const ODONTO_EDITORIAL_PROFILE: EditorialProfile = 'solo';

const soloStatusValues = new Set(['draft', 'published', 'retired']);

export function visibleEditorialStatusValues(
  currentValue: string | undefined,
  profile: EditorialProfile = ODONTO_EDITORIAL_PROFILE
): Set<string> {
  if (profile === 'collaborative') {
    return new Set(['draft', 'clinical_review', 'technical_review', 'approved', 'published', 'retired']);
  }

  const visible = new Set(soloStatusValues);
  if (currentValue) visible.add(currentValue);
  return visible;
}

export function isSoloEditorialTransition(status: string): boolean {
  return soloStatusValues.has(status);
}
