import type { Metadata } from 'next';
import EditorialDashboard from '@/components/EditorialDashboard';
import { getRoutableArticles, isEditorialPreviewBuild } from '@/data/articulos';
import { getRoutableInstructions } from '@/data/instrucciones';

export const metadata: Metadata = {
  title: 'Dashboard Editorial & Trazabilidad',
  description: 'Panel de gestión editorial en vivo, trazabilidad de Google Drive y preparación para Redes Sociales.',
  robots: { index: false, follow: false },
};

export default function EditorialDashboardPage() {
  const articulos = getRoutableArticles();
  const instrucciones = getRoutableInstructions();

  return (
    <EditorialDashboard
      articulos={articulos}
      instrucciones={instrucciones}
    />
  );
}
