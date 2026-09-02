import {
  derivePublicationHistorySummary,
  publicationHistoryDurationMs,
  readPublicationHistory,
  type EditorialProductionCollection,
  type EditorialProductionEntry,
  type EditorialPublicState,
  type PublicationHistoryResult,
  type PublicationHistorySummary,
  type PublicationIssueKind,
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

export interface EditorialPublicationMovement {
  result: PublicationHistoryResult;
  title: string;
  detail: string;
  requestedAt: string;
  processedAt: string;
  durationMs?: number;
}

export interface EditorialPublicationHistoryView {
  available: boolean;
  invalidEntries: number;
  movements: EditorialPublicationMovement[];
  summary: PublicationHistorySummary;
}

const publicationHistoryIssueCopy: Record<PublicationIssueKind, string> = {
  content: 'Hay algo en el contenido que necesita una corrección antes de volver a intentar.',
  snapshot_changed: 'Se guardaron cambios nuevos durante la publicación. Revisá la vista previa antes de volver a intentar.',
  checks_failed: 'Uno de los controles no pasó. Tus cambios siguen guardados en la vista previa.',
  merge_failed: 'No pudimos completar la publicación. Tus cambios siguen guardados y podés pedir ayuda.',
  deploy_not_confirmed: 'La actualización avanzó, pero todavía no pudimos confirmar lo que ven los pacientes.',
  technical: 'Tuvimos un inconveniente técnico. El sitio siguió mostrando la versión anterior.',
};

const editorialDateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Argentina/Buenos_Aires',
});

export function formatEditorialDateTime(value?: string | null): string {
  if (!value) return 'No registrada';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Fecha inválida' : editorialDateTimeFormatter.format(parsed);
}

export function formatPublicationDuration(durationMs?: number): string {
  if (durationMs === undefined || !Number.isFinite(durationMs) || durationMs < 0) {
    return 'Duración no disponible';
  }
  const totalMinutes = Math.max(1, Math.round(durationMs / 60_000));
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export function createEditorialPublicationHistoryView(
  value: unknown,
  available = true
): EditorialPublicationHistoryView {
  if (!available) {
    return {
      available: false,
      invalidEntries: 0,
      movements: [],
      summary: { publishedCount: 0, failedCount: 0 },
    };
  }

  const history = readPublicationHistory(value);
  const summary = derivePublicationHistorySummary(history.entries);
  return {
    available: history.available,
    invalidEntries: history.invalidEntries,
    summary,
    movements: history.entries.map((entry) => ({
      result: entry.result,
      title: entry.result === 'published' ? 'Los cambios se publicaron' : 'La publicación se detuvo',
      detail: entry.result === 'published'
        ? 'La nueva versión quedó confirmada en el sitio.'
        : publicationHistoryIssueCopy[entry.issueKind ?? 'technical'],
      requestedAt: entry.requestedAt,
      processedAt: entry.processedAt,
      durationMs: publicationHistoryDurationMs(entry),
    })),
  };
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
  return { value: 'not_published', label: displayStateLabels.not_published };
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
