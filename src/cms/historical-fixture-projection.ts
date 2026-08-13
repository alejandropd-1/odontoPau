import type { DocumentFixture } from './fixtures';

/**
 * La línea base de 188 rutas pertenece al OpenSpec archivado que fotografió
 * el contrato previo a Tina. Los campos institucionales incorporados por el
 * cambio actual se validan con el contrato Tina/Visual Editing; no deben
 * reescribir ni invalidar retroactivamente aquella evidencia histórica.
 */
export function projectFixturesToHistoricalBaseline(
  fixtures: DocumentFixture[]
): DocumentFixture[] {
  return fixtures.flatMap((fixture) => {
    if (fixture.model === 'TreatmentsPage') return [];

    const content = structuredClone(fixture.content) as Record<string, unknown>;

    if (fixture.model === 'HomePage') {
      delete content.services;
      delete content.team;
      delete content.location;

      if (content.hero && typeof content.hero === 'object' && !Array.isArray(content.hero)) {
        const hero = content.hero as Record<string, unknown>;
        delete hero.backgroundImage;
        delete hero.backgroundAlt;
        delete hero.eyebrow;
        delete hero.scrollLabel;
      }
    }

    if (fixture.model === 'Tratamiento') {
      delete content.pageCopy;
    }

    return [{ ...fixture, content }];
  });
}
