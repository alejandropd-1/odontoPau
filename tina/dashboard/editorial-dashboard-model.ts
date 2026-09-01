import {
  type EditorialProductionCollection,
  type EditorialProductionEntry,
  type EditorialPublicState,
} from '../../src/cms/tina/publication';
import { isSoloEditorialTransition } from '../../src/cms/tina/editorial-profile';
import { createEditorialRevisionFingerprint } from '../../src/cms/tina/production-index';

export type DashboardPublicStatus = 'published' | 'retired' | 'unpublished' | 'preview_only' | 'unknown';
export type DashboardReadiness = 'ready' | 'blocked' | 'current';
export type DashboardDisplayState =
  | 'published'
  | 'not_published'
  | 'draft';

export interface EditorialDashboardDisplayState {
  value: DashboardDisplayState | null;
  label: string;
}

export interface EditorialDashboardDocument {
  collection: EditorialProductionCollection;
  relativePath: string;
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  tags: string[];
  createdAt?: string | null;
  status: string;
  updatedAt: string;
  publishedAt?: string | null;
  clinicalReviewer?: string | null;
}

export interface EditorialDashboardRow extends EditorialDashboardDocument {
  publicStatus: DashboardPublicStatus;
  confirmedPublicState?: EditorialPublicState;
  hasUnpublishedChanges: boolean;
  publicLabel: string;
  readiness: DashboardReadiness;
  readinessLabel: string;
  explanation: string;
  editHref: string;
  previewHref?: string;
  actionLabel: string;
}

export interface EditorialDashboardFilters {
  query?: string;
  collection?: EditorialProductionCollection | 'all';
  editorialStatus?: string | 'all';
  publicStatus?: DashboardPublicStatus | 'all';
}

const publicLabels: Record<DashboardPublicStatus, string> = {
  published: 'Visible ahora',
  retired: 'Retirado del sitio',
  unpublished: 'No visible',
  preview_only: 'Cambios sin publicar',
  unknown: 'Todavía sin confirmar',
};

export const displayStateLabels: Record<DashboardDisplayState, string> = {
  published: 'Publicado',
  not_published: 'No publicado',
  draft: 'Borrador',
};

function documentIdentity(document: EditorialDashboardDocument): string {
  return `${document.collection}:${document.relativePath}`;
}

export function editorialDocumentEditHref(document: EditorialDashboardDocument): string {
  return `#/collections/edit/${document.collection}/${document.relativePath.replace(/\.json$/i, '')}`;
}

export function editorialDocumentPreviewHref(
  document: EditorialDashboardDocument,
  previewBaseUrl: string | undefined
): string | undefined {
  if (!previewBaseUrl) return undefined;
  const route = document.collection === 'articulo'
    ? `/articulos/${document.slug}`
    : `/instrucciones/${document.category}/${document.slug}`;
  return new URL(route, previewBaseUrl).toString();
}

function derivePublicStatus(
  document: EditorialDashboardDocument,
  productionIndex: EditorialProductionEntry[] | undefined
): Pick<EditorialDashboardRow, 'publicStatus' | 'confirmedPublicState' | 'hasUnpublishedChanges'> {
  if (!productionIndex) return {
    publicStatus: 'unknown',
    confirmedPublicState: undefined,
    hasUnpublishedChanges: false,
  };
  let fingerprint: string;
  try {
    fingerprint = createEditorialRevisionFingerprint(document.collection, document.relativePath, document);
  } catch {
    return {
      publicStatus: 'unknown',
      confirmedPublicState: undefined,
      hasUnpublishedChanges: false,
    };
  }

  const entry = productionIndex.find(
    (candidate) => `${candidate.collection}:${candidate.relativePath}` === documentIdentity(document)
  );
  if (!entry) return {
    publicStatus: 'preview_only',
    confirmedPublicState: 'unpublished',
    hasUnpublishedChanges: true,
  };
  if (entry.fingerprint !== fingerprint) return {
    publicStatus: 'preview_only',
    confirmedPublicState: entry.publicState,
    hasUnpublishedChanges: true,
  };
  return {
    publicStatus: entry.publicState,
    confirmedPublicState: entry.publicState,
    hasUnpublishedChanges: false,
  };
}

function readinessFor(
  document: EditorialDashboardDocument,
  publicStatus: DashboardPublicStatus
): Pick<EditorialDashboardRow, 'readiness' | 'readinessLabel' | 'explanation' | 'actionLabel'> {
  if (!document.updatedAt || Number.isNaN(Date.parse(document.updatedAt))) {
    return {
      readiness: 'blocked',
      readinessLabel: 'Necesita guardarse',
      explanation: 'Guardá el documento una vez para registrar su versión editorial antes de publicarlo.',
      actionLabel: 'Guardar',
    };
  }

  if (!isSoloEditorialTransition(document.status)) {
    return {
      readiness: 'blocked',
      readinessLabel: 'Necesita una decisión',
      explanation: 'Esta pieza conserva una etapa del flujo colaborativo. Elegí Borrador, Publicado o Retirado al revisarla.',
      actionLabel: 'Revisar',
    };
  }

  if (document.status === 'published' && (!document.publishedAt || !document.clinicalReviewer?.trim())) {
    const missing = [!document.publishedAt ? 'la fecha de publicación' : '', !document.clinicalReviewer?.trim() ? 'la revisión clínica' : '']
      .filter(Boolean)
      .join(' y ');
    return {
      readiness: 'blocked',
      readinessLabel: 'Falta completar',
      explanation: `Completá ${missing} antes de publicar la tanda.`,
      actionLabel: 'Completar datos',
    };
  }

  if (publicStatus === 'unknown') {
    return {
      readiness: 'blocked',
      readinessLabel: 'Primera confirmación pendiente',
      explanation: 'El panel todavía no recibió la referencia del sitio público. Se completará cuando termine una publicación.',
      actionLabel: 'Revisar',
    };
  }

  if (document.status === 'draft') {
    return {
      readiness: 'blocked',
      readinessLabel: 'En preparación',
      explanation: 'Está guardada como borrador y no se incluirá en el sitio público.',
      actionLabel: 'Continuar',
    };
  }

  if (document.status === 'retired') {
    if (publicStatus === 'retired') {
      return {
        readiness: 'current',
        readinessLabel: 'Retiro confirmado',
        explanation: 'Ya no aparece en el sitio. Podés editarla para volver a publicarla.',
        actionLabel: 'Republicar',
      };
    }
    return {
      readiness: 'ready',
      readinessLabel: 'Retiro listo',
      explanation: 'El retiro está sólo en vista previa y se hará efectivo al publicar la tanda.',
      actionLabel: 'Revisar',
    };
  }

  if (publicStatus === 'published') {
    return {
      readiness: 'current',
      readinessLabel: 'Al día',
      explanation: 'La versión guardada coincide con la que ven los pacientes.',
      actionLabel: 'Editar',
    };
  }

  return {
    readiness: 'ready',
    readinessLabel: 'Lista para la tanda',
    explanation: 'La versión revisada está sólo en vista previa y quedará pública al confirmar la tanda.',
    actionLabel: 'Revisar',
  };
}

export function createEditorialDashboardRow(
  document: EditorialDashboardDocument,
  productionIndex: EditorialProductionEntry[] | undefined,
  previewBaseUrl?: string
): EditorialDashboardRow {
  const publicState = derivePublicStatus(document, productionIndex);
  return {
    ...document,
    ...publicState,
    publicLabel: publicLabels[publicState.publicStatus],
    ...readinessFor(document, publicState.publicStatus),
    editHref: editorialDocumentEditHref(document),
    previewHref: editorialDocumentPreviewHref(document, previewBaseUrl),
  };
}

export function getEditorialDashboardDisplayState(
  row: EditorialDashboardRow
): EditorialDashboardDisplayState {
  if (row.confirmedPublicState === 'published') {
    return { value: 'published', label: displayStateLabels.published };
  }
  if (row.status === 'draft') {
    return { value: 'draft', label: displayStateLabels.draft };
  }
  if (row.confirmedPublicState === 'retired' || row.confirmedPublicState === 'unpublished') {
    return { value: 'not_published', label: displayStateLabels.not_published };
  }
  return { value: null, label: '—' };
}

export function filterEditorialDashboardRows(
  rows: EditorialDashboardRow[],
  filters: EditorialDashboardFilters
): EditorialDashboardRow[] {
  const query = filters.query?.trim().toLocaleLowerCase('es') ?? '';
  return rows.filter((row) => {
    if (filters.collection && filters.collection !== 'all' && row.collection !== filters.collection) return false;
    if (filters.editorialStatus && filters.editorialStatus !== 'all' && row.status !== filters.editorialStatus) return false;
    if (filters.publicStatus && filters.publicStatus !== 'all' && row.publicStatus !== filters.publicStatus) return false;
    if (!query) return true;
    return [row.title, row.category, row.categoryLabel, row.slug, row.excerpt, ...row.tags]
      .some((value) => value.toLocaleLowerCase('es').includes(query));
  });
}

export function publicStatusFromEntry(entry: EditorialProductionEntry): EditorialPublicState {
  return entry.publicState;
}
