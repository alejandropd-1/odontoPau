import type { Metadata } from 'next';

import HomeContent from '@/components/HomeContent';
import { createHomeVisualPayload } from '@/cms/tina/visual-data';
import homeData from '@/data/home.json';
import { validateHomePageData } from '@/data/site-pages';
import { getTratamientos } from '@/data/tratamientos';

export const metadata: Metadata = {
  title: 'Edición visual de Inicio',
  robots: { index: false, follow: false },
};

export default function HomeVisualEditorPage() {
  const home = validateHomePageData(homeData);
  return (
    <HomeContent
      home={home}
      tratamientos={getTratamientos()}
      visual={createHomeVisualPayload(home)}
    />
  );
}
