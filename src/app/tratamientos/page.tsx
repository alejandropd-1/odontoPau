import { Metadata } from 'next';

import TreatmentsPageContent from '@/components/TreatmentsPageContent';
import { createTreatmentsPageVisualPayload } from '@/cms/tina/visual-data';
import { publishedInstrucciones } from '@/data/instrucciones';
import { validateTreatmentsPageData } from '@/data/site-pages';
import treatmentsPageData from '@/data/tratamientos-page.json';
import { getTratamientos } from '@/data/tratamientos';

export const metadata: Metadata = {
  title: 'Tratamientos',
  description: 'Conocé los tratamientos odontológicos disponibles en Paula Gualtieri Odontología: rehabilitación, ortodoncia invisible, estética dental, ortopedia, pediatría y endodoncia.',
  alternates: { canonical: 'https://paulagualtieri.com/tratamientos' },
};

export default function TratamientosPage() {
  const content = validateTreatmentsPageData(treatmentsPageData);
  return (
    <TreatmentsPageContent
      content={content}
      tratamientos={getTratamientos()}
      instructions={publishedInstrucciones}
      visual={createTreatmentsPageVisualPayload(content)}
    />
  );
}
