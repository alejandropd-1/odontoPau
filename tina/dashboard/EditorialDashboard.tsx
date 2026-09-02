import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCMS } from 'tinacms';

import { isEditorialPublicationBranch } from '../../src/cms/tina/branch';
import {
  PUBLICATION_REQUEST_RELATIVE_PATH,
  createPendingPublicationRequest,
  isActivePublicationRequest,
  readPublicationHistory,
  type EditorialProductionEntry,
  type PublicationHistoryEntry,
  type PublicationRequest,
  type PublicationRequestStatus,
} from '../../src/cms/tina/publication';
import { createEditorialRevisionFingerprint } from '../../src/cms/tina/production-index';
import {
  createEditorialDashboardRow,
  createEditorialPublicationHistoryView,
  displayStateLabels,
  filterEditorialDashboardRows,
  formatEditorialDateTime,
  formatPublicationDuration,
  getEditorialDashboardDisplayState,
  type DashboardDisplayState,
  type EditorialDashboardDocument,
  type EditorialPublicationHistoryView,
} from './editorial-dashboard-model';

const EDITORIAL_QUERY = `
  query OdontoPauEditorialDashboard {
    articuloConnection {
      totalCount
      edges {
        node {
          title
          slug
          status
          category
          categoryLabel
          excerpt
          tags
          createdAt
          publishedAt
          clinicalReviewer
          updatedAt
          _sys { relativePath }
        }
      }
    }
    instruccionConnection {
      totalCount
      edges {
        node {
          title
          slug
          status
          category
          categoryLabel
          excerpt
          tags
          createdAt
          publishedAt
          clinicalReviewer
          updatedAt
          _sys { relativePath }
        }
      }
    }
    tratamientoConnection { totalCount }
    publicationrequest(relativePath: "publication-request.json") {
      type
      status
      requestId
      requestedAt
      lastProcessedRequestId
      processedAt
      productionCommit
      summary
      issueKind
      productionIndex {
        collection
        relativePath
        fingerprint
        publicState
      }
    }
  }
`;

const REQUEST_PUBLICATION_MUTATION = `
  mutation RequestEditorialPublication($relativePath: String!, $params: PublicationrequestMutation!) {
    updatePublicationrequest(relativePath: $relativePath, params: $params) {
      type
      status
      requestId
      requestedAt
      lastProcessedRequestId
      processedAt
      productionCommit
      summary
      issueKind
      productionIndex {
        collection
        relativePath
        fingerprint
        publicState
      }
      history {
        requestId
        requestedAt
        processedAt
        result
        issueKind
        productionCommit
      }
    }
  }
`;

const EDITORIAL_HISTORY_QUERY = `
  query OdontoPauEditorialPublicationHistory {
    publicationrequest(relativePath: "publication-request.json") {
      history {
        requestId
        requestedAt
        processedAt
        result
        issueKind
        productionCommit
      }
    }
  }
`;

interface EditorialNode {
  title: string;
  slug: string;
  status: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  tags: string[];
  createdAt?: string | null;
  publishedAt?: string | null;
  clinicalReviewer?: string | null;
  updatedAt: string;
  _sys: { relativePath: string };
}

interface EditorialDashboardData {
  articuloConnection: { totalCount: number; edges: Array<{ node: EditorialNode }> };
  instruccionConnection: { totalCount: number; edges: Array<{ node: EditorialNode }> };
  tratamientoConnection: { totalCount: number };
  publicationrequest: PublicationRequest;
}

type EditorialDashboardResponse = EditorialDashboardData & {
  errors?: Array<{ message: string }>;
};

interface EditorialHistoryResponse {
  publicationrequest?: { history?: unknown };
  errors?: Array<{ message: string }>;
}

const displayStateColors: Record<DashboardDisplayState, { color: string; background: string }> = {
  published: { color: '#22543a', background: '#e4f3e9' },
  not_published: { color: '#4d5660', background: '#e9edf0' },
  draft: { color: '#72543d', background: '#f5eee7' },
};
const unconfirmedStateColors = { color: '#746860', background: '#f0ece9' };

const publicationStatusCopy: Record<PublicationRequestStatus, { title: string; detail: string }> = {
  idle: {
    title: 'Sin publicación pendiente',
    detail: 'Podés seguir editando y guardar. Producción no cambia hasta que uses el botón de publicación.',
  },
  pending: {
    title: 'Recibimos tu pedido',
    detail: 'Estamos preparando los controles. Por ahora, tus cambios siguen visibles sólo en la vista previa.',
  },
  processing: {
    title: 'Estamos revisando los cambios',
    detail: 'Comprobamos que el contenido y las imágenes estén listos. No hace falta que vuelvas a publicar.',
  },
  deploying: {
    title: 'Estamos actualizando el sitio público',
    detail: 'Los controles salieron bien. Falta confirmar que la nueva versión ya esté disponible para todos.',
  },
  published: {
    title: 'Listo: los cambios ya están publicados',
    detail: 'La nueva versión fue confirmada en el sitio público. Ya podés comenzar otra tanda de cambios.',
  },
  failed: {
    title: 'No pudimos publicar esta vez',
    detail: 'El sitio público sigue como estaba. Tus cambios continúan guardados en la vista previa.',
  },
  waiting_index: {
    title: 'Necesitamos confirmar la actualización',
    detail: 'Los cambios fueron aprobados, pero todavía no pudimos confirmar el sitio público. No publiques otra tanda por ahora.',
  },
};

const activePublicationButtonLabels: Partial<Record<PublicationRequestStatus, string>> = {
  pending: 'Pedido recibido',
  processing: 'Controles en curso',
  deploying: 'Actualizando el sitio',
  waiting_index: 'Esperando confirmación',
};

const issueCopy = {
  content: 'Encontramos algo que necesita una corrección. Revisá el contenido en la vista previa y volvé a intentarlo.',
  snapshot_changed: 'Guardaste nuevos cambios mientras se publicaba. Para no mezclar versiones, revisá la vista previa y volvé a publicar.',
  checks_failed: 'Uno de los controles no pasó. Tus cambios siguen guardados en la vista previa; pedí ayuda para revisarlos.',
  merge_failed: 'No pudimos completar la publicación por un problema técnico. No hace falta volver a guardar: pedí ayuda.',
  deploy_not_confirmed: 'La actualización fue aprobada, pero todavía no pudimos confirmar el sitio público. No publiques otra tanda y pedí ayuda.',
  technical: 'Tuvimos un problema técnico. El sitio público sigue igual y tus cambios están guardados en la vista previa. Pedí ayuda.',
} as const;

interface DashboardError {
  message: string;
  detail?: string;
}

function friendlyDashboardError(reason: unknown, fallback: string): DashboardError {
  const detail = reason instanceof Error ? reason.message : String(reason ?? 'Error desconocido');
  if (/requestId no es válido|solicitud editorial inválida/i.test(detail)) {
    return { message: 'No pudimos iniciar la publicación. Actualizá el panel y volvé a intentarlo.', detail };
  }
  if (/fetch|network|cliente de Tina|Failed to fetch/i.test(detail)) {
    return { message: 'No pudimos comunicarnos con el editor. Revisá tu conexión y volvé a intentar.', detail };
  }
  return { message: fallback, detail };
}

const previewUrl = process.env.NEXT_PUBLIC_EDITORIAL_PREVIEW_URL;
const localReviewEnabled = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const editorialDashboardAdminHash = '#/screens/panel_editorial';
const contentViewStorageKey = 'odontopau-editorial-content-view';

type LocalReviewScenario = PublicationRequestStatus | 'current' | 'dashboard_error';
type LocalContentScenario = 'current' | 'published' | 'preview_only' | 'retired' | 'blocked';
type LocalHistoryScenario = 'current' | 'empty' | 'published' | 'failed' | 'partial' | 'unavailable';
type ContentViewMode = 'cards' | 'table';
type ContentSort = 'updated_desc' | 'created_desc' | 'published_desc' | 'title_asc';
type ContentPageSize = 6 | 12 | 24;

const contentPageSizeOptions: ContentPageSize[] = [6, 12, 24];

const localReviewScenarios: Array<{ value: LocalReviewScenario; label: string }> = [
  { value: 'current', label: 'Estado real guardado' },
  { value: 'idle', label: 'Sin publicación pendiente' },
  { value: 'pending', label: 'Pedido recibido' },
  { value: 'processing', label: 'Controles en curso' },
  { value: 'deploying', label: 'Actualizando el sitio público' },
  { value: 'published', label: 'Publicación confirmada' },
  { value: 'failed', label: 'Un control no pasó' },
  { value: 'waiting_index', label: 'No se pudo confirmar el sitio público' },
  { value: 'dashboard_error', label: 'Error de conexión con el editor' },
];

const localContentScenarios: Array<{ value: LocalContentScenario; label: string }> = [
  { value: 'current', label: 'Estado real del catálogo' },
  { value: 'published', label: 'Versiones confirmadas' },
  { value: 'preview_only', label: 'Cambios sólo en vista previa' },
  { value: 'retired', label: 'Pieza retirada' },
  { value: 'blocked', label: 'Falta revisión clínica' },
];

const localHistoryScenarios: Array<{ value: LocalHistoryScenario; label: string }> = [
  { value: 'current', label: 'Historial real guardado' },
  { value: 'empty', label: 'Sin movimientos todavía' },
  { value: 'published', label: 'Publicaciones confirmadas' },
  { value: 'failed', label: 'Publicación detenida' },
  { value: 'partial', label: 'Un movimiento incompleto' },
  { value: 'unavailable', label: 'Historial no disponible' },
];

const localPublishedHistory: PublicationHistoryEntry[] = Array.from({ length: 7 }, (_, index) => ({
  requestId: `local-history-published-${String(index + 1).padStart(4, '0')}`,
  requestedAt: new Date(Date.UTC(2026, 7, 20 + index, 13, 0)).toISOString(),
  processedAt: new Date(Date.UTC(2026, 7, 20 + index, 13, 4 + index)).toISOString(),
  result: 'published' as const,
  productionCommit: `abcdef01234567${String(index).padStart(2, '0')}`,
}));

const localFailedHistory: PublicationHistoryEntry[] = [
  {
    requestId: 'local-history-failed-0001',
    requestedAt: '2026-08-28T13:00:00.000Z',
    processedAt: '2026-08-28T13:06:00.000Z',
    result: 'failed',
    issueKind: 'checks_failed',
  },
];

interface EditorialDashboardProps {
  branch: string;
}

function collectionUrl(collection: 'homepage' | 'treatmentspage' | 'tratamiento' | 'articulo' | 'instruccion'): string {
  return `#/collections/${collection}`;
}

export function createEditorialDashboard(branch: string) {
  return function TinaEditorialDashboard({ close }: { close?: () => void }) {
    const [isAdminScreen, setIsAdminScreen] = useState(
      () => typeof window === 'undefined' || window.location.hash === editorialDashboardAdminHash
    );

    useEffect(() => {
      if (window.location.hash === editorialDashboardAdminHash) {
        setIsAdminScreen(true);
        return;
      }

      close?.();
      const adminScreenUrl = new URL(window.location.href);
      adminScreenUrl.hash = editorialDashboardAdminHash.slice(1);
      window.location.replace(adminScreenUrl.toString());
    }, [close]);

    if (!isAdminScreen) {
      return (
        <div role="status" style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
          Abriendo el panel editorial…
        </div>
      );
    }

    return <EditorialDashboard branch={branch} />;
  };
}

export function EditorialDashboard({ branch }: EditorialDashboardProps) {
  const cms = useCMS();
  const [data, setData] = useState<EditorialDashboardData | null>(null);
  const [error, setError] = useState<DashboardError | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publicationConfirmed, setPublicationConfirmed] = useState(false);
  const [localReviewScenario, setLocalReviewScenario] = useState<LocalReviewScenario>('current');
  const [localContentScenario, setLocalContentScenario] = useState<LocalContentScenario>('current');
  const [localHistoryScenario, setLocalHistoryScenario] = useState<LocalHistoryScenario>('current');
  const [publicationHistoryValue, setPublicationHistoryValue] = useState<unknown>(undefined);
  const [publicationHistoryAvailable, setPublicationHistoryAvailable] = useState(true);
  const [historyPagination, setHistoryPagination] = useState({ key: '', count: 5 });
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'articulo' | 'instruccion'>('all');
  const [contentStateFilter, setContentStateFilter] = useState<'all' | DashboardDisplayState>('all');
  const [contentViewMode, setContentViewMode] = useState<ContentViewMode>(() => {
    if (typeof window === 'undefined') return 'cards';
    const storedView = window.localStorage.getItem(contentViewStorageKey);
    return storedView === 'table' || storedView === 'cards' ? storedView : 'cards';
  });
  const [contentSort, setContentSort] = useState<ContentSort>('updated_desc');
  const [contentPage, setContentPage] = useState(1);
  const [contentPageSize, setContentPageSize] = useState<ContentPageSize>(6);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollTableLeft, setCanScrollTableLeft] = useState(false);
  const [canScrollTableRight, setCanScrollTableRight] = useState(false);
  const publicationEnabled = isEditorialPublicationBranch(branch);
  const publicationInteractionEnabled = publicationEnabled && !localReviewEnabled;

  const updateTableScrollControls = useCallback(() => {
    const tableScroll = tableScrollRef.current;
    if (!tableScroll) {
      setCanScrollTableLeft(false);
      setCanScrollTableRight(false);
      return;
    }

    setCanScrollTableLeft(tableScroll.scrollLeft > 4);
    setCanScrollTableRight(tableScroll.scrollLeft < tableScroll.scrollWidth - tableScroll.clientWidth - 4);
  }, []);

  const scrollTable = useCallback((direction: 'left' | 'right') => {
    const tableScroll = tableScrollRef.current;
    if (!tableScroll) return;
    const distance = Math.max(280, Math.round(tableScroll.clientWidth * 0.78));
    tableScroll.scrollBy({ left: direction === 'left' ? -distance : distance, behavior: 'smooth' });
  }, []);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      const tinaApi = cms.api.tina;
      if (!tinaApi) throw new Error('El cliente de Tina todavía no está disponible.');

      const response = (await tinaApi.request(EDITORIAL_QUERY, {
        variables: {},
      })) as EditorialDashboardResponse;
      if (response.errors?.length) throw new Error(response.errors[0].message);
      setData(response);

      try {
        const historyResponse = (await tinaApi.request(EDITORIAL_HISTORY_QUERY, {
          variables: {},
        })) as EditorialHistoryResponse;
        if (historyResponse.errors?.length) throw new Error(historyResponse.errors[0].message);
        setPublicationHistoryValue(historyResponse.publicationrequest?.history);
        setPublicationHistoryAvailable(true);
      } catch {
        setPublicationHistoryValue(undefined);
        setPublicationHistoryAvailable(false);
      }
    } catch (reason) {
      setError(friendlyDashboardError(reason, 'No pudimos actualizar el panel. Esperá unos segundos y volvé a intentar.'));
    } finally {
      if (!options?.silent) setLoading(false);
    }
  }, [cms]);

  const requestPublication = useCallback(async () => {
    const current = data?.publicationrequest;
    if (!current || !publicationConfirmed || publishing || !publicationInteractionEnabled) return;

    const confirmed = window.confirm(
      'Vas a publicar todos los cambios que revisaste en la vista previa, no sólo la pantalla que tenés abierta. ¿Querés continuar?'
    );
    if (!confirmed) return;

    setPublishing(true);
    setError(null);
    try {
      const tinaApi = cms.api.tina;
      if (!tinaApi) throw new Error('El cliente de Tina todavía no está disponible.');

      const requestId = `editorial-${Date.now().toString(36)}-${window.crypto.randomUUID()}`;
      const readableHistory = readPublicationHistory(publicationHistoryValue);
      const currentWithHistory = publicationHistoryAvailable && readableHistory.invalidEntries === 0
        ? { ...current, history: readableHistory.entries }
        : current;
      const next = createPendingPublicationRequest(currentWithHistory, requestId, new Date().toISOString());
      const response = (await tinaApi.request(REQUEST_PUBLICATION_MUTATION, {
        variables: {
          relativePath: PUBLICATION_REQUEST_RELATIVE_PATH,
          params: next,
        },
      })) as {
        updatePublicationrequest?: PublicationRequest;
        errors?: Array<{ message: string }>;
      };
      if (response.errors?.length) throw new Error(response.errors[0].message);
      if (!response.updatePublicationrequest) throw new Error('Tina no devolvió la solicitud guardada.');

      if (response.updatePublicationrequest.history !== undefined) {
        setPublicationHistoryValue(response.updatePublicationrequest.history);
        setPublicationHistoryAvailable(true);
      }

      setData((previous) =>
        previous ? { ...previous, publicationrequest: response.updatePublicationrequest as PublicationRequest } : previous
      );
      setPublicationConfirmed(false);
    } catch (reason) {
      setError(friendlyDashboardError(reason, 'No pudimos enviar el pedido de publicación. Actualizá el panel y volvé a intentar.'));
    } finally {
      setPublishing(false);
    }
  }, [cms, data?.publicationrequest, publicationConfirmed, publicationHistoryAvailable, publicationHistoryValue, publicationInteractionEnabled, publishing]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const publicationRequest = data?.publicationrequest;
  const storedPublicationStatus = publicationRequest?.status ?? 'idle';
  const simulatedPublicationStatus =
    localReviewEnabled && !['current', 'dashboard_error'].includes(localReviewScenario)
      ? (localReviewScenario as PublicationRequestStatus)
      : undefined;
  const publicationStatus = simulatedPublicationStatus ?? storedPublicationStatus;
  const publicationActive = isActivePublicationRequest(publicationStatus);
  const storedPublicationActive = publicationRequest ? isActivePublicationRequest(publicationRequest.status) : false;

  useEffect(() => {
    if (!storedPublicationActive) return;

    const refreshWhileVisible = () => {
      if (document.visibilityState === 'visible') void load({ silent: true });
    };
    const intervalId = window.setInterval(refreshWhileVisible, 8000);
    document.addEventListener('visibilitychange', refreshWhileVisible);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshWhileVisible);
    };
  }, [load, storedPublicationActive]);

  const documents = useMemo<EditorialDashboardDocument[]>(
    () => [
      ...(data?.articuloConnection.edges.map(({ node }) => ({
        ...node,
        collection: 'articulo' as const,
        relativePath: node._sys.relativePath,
      })) ?? []),
      ...(data?.instruccionConnection.edges.map(({ node }) => ({
        ...node,
        collection: 'instruccion' as const,
        relativePath: node._sys.relativePath,
      })) ?? []),
    ],
    [data]
  );

  const reviewedDocuments = useMemo(() => {
    if (!localReviewEnabled || localContentScenario === 'current' || documents.length === 0) return documents;
    if (localContentScenario === 'retired') {
      return documents.map((document, index) => index === 0 ? { ...document, status: 'retired' } : document);
    }
    if (localContentScenario === 'blocked') {
      return documents.map((document, index) => index === 0
        ? { ...document, status: 'published', clinicalReviewer: null }
        : document);
    }
    return documents;
  }, [documents, localContentScenario]);

  const reviewedProductionIndex = useMemo<EditorialProductionEntry[] | undefined>(() => {
    if (!localReviewEnabled || localContentScenario === 'current') return publicationRequest?.productionIndex;
    if (localContentScenario === 'preview_only') return [];
    return reviewedDocuments.flatMap((document, index) => {
      let fingerprint: string;
      try {
        fingerprint = createEditorialRevisionFingerprint(document.collection, document.relativePath, document);
      } catch {
        return [];
      }
      const publicState = localContentScenario === 'retired' && index === 0
        ? 'retired'
        : document.status === 'published'
          ? 'published'
          : document.status === 'retired'
            ? 'retired'
            : 'unpublished';
      return [{
        collection: document.collection,
        relativePath: document.relativePath,
        fingerprint,
        publicState,
      }];
    });
  }, [localContentScenario, publicationRequest?.productionIndex, reviewedDocuments]);

  const dashboardRows = useMemo(() => reviewedDocuments
    .map((document) => createEditorialDashboardRow(document, reviewedProductionIndex, previewUrl)),
  [reviewedDocuments, reviewedProductionIndex]);

  const filteredRows = useMemo(
    () => filterEditorialDashboardRows(dashboardRows, {
      query: searchQuery,
      collection: collectionFilter,
    }).filter((row) => contentStateFilter === 'all'
      || getEditorialDashboardDisplayState(row).value === contentStateFilter)
      .sort((left, right) => {
      if (contentSort === 'title_asc') return left.title.localeCompare(right.title, 'es');
      const field = contentSort === 'created_desc'
        ? 'createdAt'
        : contentSort === 'published_desc'
          ? 'publishedAt'
          : 'updatedAt';
      const rightTime = Date.parse(right[field] ?? '');
      const leftTime = Date.parse(left[field] ?? '');
      return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
    }),
    [collectionFilter, contentSort, contentStateFilter, dashboardRows, searchQuery]
  );

  const totalContentPages = Math.max(1, Math.ceil(filteredRows.length / contentPageSize));
  const currentContentPage = Math.min(contentPage, totalContentPages);
  const paginatedRows = useMemo(() => {
    const start = (currentContentPage - 1) * contentPageSize;
    return filteredRows.slice(start, start + contentPageSize);
  }, [contentPageSize, currentContentPage, filteredRows]);
  const firstVisibleContent = filteredRows.length === 0 ? 0 : (currentContentPage - 1) * contentPageSize + 1;
  const lastVisibleContent = Math.min(currentContentPage * contentPageSize, filteredRows.length);

  useEffect(() => {
    window.localStorage.setItem(contentViewStorageKey, contentViewMode);
  }, [contentViewMode]);

  useEffect(() => {
    if (contentViewMode !== 'table') return;

    const frameId = window.requestAnimationFrame(updateTableScrollControls);
    const tableScroll = tableScrollRef.current;
    const resizeObserver = tableScroll && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateTableScrollControls)
      : null;
    if (tableScroll) resizeObserver?.observe(tableScroll);
    window.addEventListener('resize', updateTableScrollControls);
    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateTableScrollControls);
    };
  }, [contentViewMode, currentContentPage, paginatedRows.length, updateTableScrollControls]);

  const contentSummary = useMemo(() => ({
    articles: dashboardRows.filter((row) => row.collection === 'articulo').length,
    instructions: dashboardRows.filter((row) => row.collection === 'instruccion').length,
    published: dashboardRows.filter((row) => row.publicStatus === 'published').length,
    pending: dashboardRows.filter((row) => row.publicStatus === 'preview_only').length,
  }), [dashboardRows]);

  const clearFilters = () => {
    setSearchQuery('');
    setCollectionFilter('all');
    setContentStateFilter('all');
    setContentSort('updated_desc');
    setContentPage(1);
  };

  const publicationCopy = publicationStatusCopy[publicationStatus];
  const simulatedIssueKind =
    publicationStatus === 'failed'
      ? 'checks_failed'
      : publicationStatus === 'waiting_index'
        ? 'deploy_not_confirmed'
        : undefined;
  const publicationDetail = simulatedPublicationStatus
    ? simulatedIssueKind
      ? issueCopy[simulatedIssueKind]
      : publicationCopy.detail
    : publicationRequest?.issueKind
      ? issueCopy[publicationRequest.issueKind]
      : publicationCopy.detail;
  const displayedError =
    localReviewEnabled && localReviewScenario === 'dashboard_error'
      ? {
          message: 'No pudimos comunicarnos con el editor. Revisá tu conexión y volvé a intentar.',
          detail: 'Simulación local: no se realizó ninguna conexión ni se modificó contenido.',
        }
      : error;
  const storedHistoryView = useMemo(
    () => createEditorialPublicationHistoryView(publicationHistoryValue, publicationHistoryAvailable),
    [publicationHistoryAvailable, publicationHistoryValue]
  );
  const displayedHistoryView = useMemo<EditorialPublicationHistoryView>(() => {
    if (!localReviewEnabled || localHistoryScenario === 'current') return storedHistoryView;
    if (localHistoryScenario === 'unavailable') {
      return createEditorialPublicationHistoryView(undefined, false);
    }
    if (localHistoryScenario === 'empty') return createEditorialPublicationHistoryView([]);
    if (localHistoryScenario === 'published') {
      return createEditorialPublicationHistoryView(localPublishedHistory);
    }
    if (localHistoryScenario === 'failed') {
      return createEditorialPublicationHistoryView(localFailedHistory);
    }
    return createEditorialPublicationHistoryView([
      ...localFailedHistory,
      { result: 'published' },
    ]);
  }, [localHistoryScenario, storedHistoryView]);
  const historyPaginationKey = displayedHistoryView.movements
    .map((movement) => `${movement.result}:${movement.requestedAt}:${movement.processedAt}`)
    .join('|');
  const visibleHistoryCount = historyPagination.key === historyPaginationKey
    ? historyPagination.count
    : 5;
  const visibleHistoryMovements = displayedHistoryView.movements.slice(0, visibleHistoryCount);
  const historySummaryText = !displayedHistoryView.available
    ? 'No pudimos consultar los movimientos ahora. El resto del panel sigue disponible.'
    : displayedHistoryView.summary.lastPublishedAt
      ? `Última publicación confirmada: ${formatEditorialDateTime(displayedHistoryView.summary.lastPublishedAt)}.`
      : displayedHistoryView.movements.length > 0
        ? 'Todavía no hay una publicación confirmada en los movimientos guardados.'
        : 'Todavía no hay publicaciones finalizadas para mostrar.';

  return (
    <main className="odonto-dashboard-page" style={styles.page}>
      <style>{dashboardResponsiveStyles}</style>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>PANEL DE GESTIÓN EDITORIAL</p>
          <h1 style={styles.title}>Dashboard editorial</h1>
          <p style={styles.subtitle}>
            Revisá cada contenido y prepará los cambios. Guardar actualiza la vista previa; el sitio cambia recién cuando elegís “Publicar cambios”.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          aria-label="Actualizar el estado editorial"
          style={{ ...styles.secondaryButton, ...(loading ? styles.disabledButton : {}) }}
        >
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </header>

      {displayedError ? (
        <div role="alert" style={styles.error}>
          <strong>{displayedError.message}</strong>
          {displayedError.detail ? (
            <details style={styles.supportDetails}>
              <summary>Información para pedir ayuda</summary>
              <code style={styles.supportCode}>{displayedError.detail}</code>
            </details>
          ) : null}
        </div>
      ) : null}

      {localReviewEnabled ? (
        <details className="odonto-dashboard-local-tools">
          <summary>Herramientas de prueba local</summary>
          <section aria-label="Simulación local de estados" style={styles.localReviewPanel}>
            <div>
              <strong style={styles.localReviewTitle}>Simular estados sin guardar</strong>
              <p style={styles.localReviewText}>
                Los cambios se reflejan en la publicación general y en las filas. Esta prueba no guarda, no publica ni llama servicios externos.
              </p>
            </div>
            <label style={styles.localReviewLabel}>
              <span>Publicación general</span>
              <select
                value={localReviewScenario}
                onChange={(event) => {
                  setLocalReviewScenario(event.target.value as LocalReviewScenario);
                  setPublicationConfirmed(false);
                }}
                style={styles.localReviewSelect}
              >
                {localReviewScenarios.map((scenario) => (
                  <option key={scenario.value} value={scenario.value}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            </label>
            <label style={styles.localReviewLabel}>
              <span>Estados de las filas</span>
              <select
                value={localContentScenario}
                onChange={(event) => setLocalContentScenario(event.target.value as LocalContentScenario)}
                style={styles.localReviewSelect}
              >
                {localContentScenarios.map((scenario) => (
                  <option key={scenario.value} value={scenario.value}>{scenario.label}</option>
                ))}
              </select>
            </label>
            <label style={styles.localReviewLabel}>
              <span>Movimientos recientes</span>
              <select
                value={localHistoryScenario}
                onChange={(event) => setLocalHistoryScenario(event.target.value as LocalHistoryScenario)}
                style={styles.localReviewSelect}
              >
                {localHistoryScenarios.map((scenario) => (
                  <option key={scenario.value} value={scenario.value}>{scenario.label}</option>
                ))}
              </select>
            </label>
          </section>
        </details>
      ) : null}

      {!publicationEnabled && !localReviewEnabled ? (
        <div role="status" style={styles.notice}>
          Esta pantalla sirve para revisar la interfaz. Para publicar, entrá al panel editorial habitual.
        </div>
      ) : null}

      <section aria-label="Resumen del contenido" className="odonto-dashboard-summary">
        <article className="odonto-dashboard-summary-card">
          <span className="odonto-dashboard-summary-icon" aria-hidden="true">A</span>
          <span><strong>{loading ? '—' : contentSummary.articles}</strong><small>Artículos</small></span>
        </article>
        <article className="odonto-dashboard-summary-card">
          <span className="odonto-dashboard-summary-icon odonto-dashboard-summary-icon--sand" aria-hidden="true">I</span>
          <span><strong>{loading ? '—' : contentSummary.instructions}</strong><small>Instrucciones</small></span>
        </article>
        <article className="odonto-dashboard-summary-card">
          <span className="odonto-dashboard-summary-icon odonto-dashboard-summary-icon--green" aria-hidden="true">✓</span>
          <span><strong>{loading ? '—' : contentSummary.published}</strong><small>Ya publicados</small></span>
        </article>
        <article className="odonto-dashboard-summary-card">
          <span className="odonto-dashboard-summary-icon odonto-dashboard-summary-icon--amber" aria-hidden="true">↗</span>
          <span><strong>{loading ? '—' : contentSummary.pending}</strong><small>Cambios por publicar</small></span>
        </article>
      </section>

      <nav className="odonto-dashboard-quick-links" aria-labelledby="quick-links-title" style={styles.quickLinksPanel}>
        <div style={styles.quickLinksHeading}>
          <p style={styles.eyebrow}>ACCESOS RÁPIDOS</p>
          <h2 id="quick-links-title" style={styles.quickLinksTitle}>Otras partes del sitio</h2>
        </div>
        <div style={styles.quickLinksList}>
          <a href={collectionUrl('homepage')} style={styles.quickLink}>
            <span>Inicio</span>
            <strong>Editar →</strong>
          </a>
          <a href={collectionUrl('treatmentspage')} style={styles.quickLink}>
            <span>Página de servicios</span>
            <strong>Editar →</strong>
          </a>
          <a href={collectionUrl('tratamiento')} style={styles.quickLink}>
            <span>Servicios <small>({loading ? '—' : data?.tratamientoConnection.totalCount ?? 0})</small></span>
            <strong>Abrir →</strong>
          </a>
        </div>
      </nav>

      <section className="odonto-dashboard-publication" aria-labelledby="publication-title" style={styles.publicationPanel}>
        <div style={styles.publicationCopy}>
          <p style={styles.eyebrow}>ESTADO DE PUBLICACIÓN</p>
          <div role="status" aria-live="polite" aria-atomic="true">
            <h2 id="publication-title" style={styles.panelTitle}>{publicationCopy.title}</h2>
            <p style={styles.publicationDetail}>{publicationDetail}</p>
          </div>
          <details className="odonto-dashboard-publication-help">
            <summary>Cómo funciona esta publicación</summary>
            <p style={styles.publicationHint}>
              Guardá todos los documentos primero. El botón publica toda la tanda que ves en la vista previa, no solamente la pantalla abierta.
            </p>
          </details>
          {publicationActive ? (
            <p style={styles.autoRefreshHint}>Este estado se actualiza solo. Podés dejar el panel abierto.</p>
          ) : null}
          {previewUrl ? (
            <a href={previewUrl} target="_blank" rel="noreferrer" style={styles.previewLink}>
              Abrir vista previa ↗
            </a>
          ) : !localReviewEnabled ? (
            <span style={styles.previewUnavailable}>El enlace de la vista previa todavía no está configurado.</span>
          ) : null}
        </div>
        <div style={styles.publicationActions}>
          <label style={styles.confirmationLabel}>
            <input
              type="checkbox"
              checked={publicationConfirmed}
              disabled={!publicationInteractionEnabled || publicationActive || publishing}
              onChange={(event) => setPublicationConfirmed(event.target.checked)}
              style={styles.confirmationCheckbox}
            />
            <span>Revisé la vista previa y las aprobaciones necesarias.</span>
          </label>
          <button
            type="button"
            onClick={() => void requestPublication()}
            disabled={!publicationInteractionEnabled || publicationActive || publishing || !publicationConfirmed}
            aria-busy={publishing}
            style={{
              ...styles.publishButton,
              ...(!publicationInteractionEnabled || publicationActive || publishing || !publicationConfirmed
                ? styles.disabledButton
                : {}),
            }}
          >
            {publishing
              ? 'Enviando solicitud…'
              : !publicationEnabled && !localReviewEnabled
                ? 'Publicación no disponible en esta vista previa'
                : publicationActive
                  ? activePublicationButtonLabels[publicationStatus] ?? 'Publicación en curso'
                  : 'Publicar cambios'}
          </button>
          {localReviewEnabled ? (
            <small style={styles.localPublishNote}>Modo de prueba: este botón no envía ni publica cambios.</small>
          ) : null}
        </div>
      </section>

      <section
        className="odonto-dashboard-history"
        aria-labelledby="publication-history-title"
        style={styles.historyPanel}
      >
        <div className="odonto-dashboard-history-head">
          <div>
            <p style={styles.eyebrow}>MOVIMIENTOS RECIENTES</p>
            <h2 id="publication-history-title" style={styles.panelTitle}>Qué pasó con tus publicaciones</h2>
            <p aria-live="polite" style={styles.historySummary}>{historySummaryText}</p>
          </div>
          {displayedHistoryView.available ? (
            <dl className="odonto-dashboard-history-totals" aria-label="Resumen de publicaciones finalizadas">
              <div>
                <dt>Publicadas</dt>
                <dd>{displayedHistoryView.summary.publishedCount}</dd>
              </div>
              <div>
                <dt>Detenidas</dt>
                <dd>{displayedHistoryView.summary.failedCount}</dd>
              </div>
            </dl>
          ) : null}
        </div>

        {displayedHistoryView.available && displayedHistoryView.movements.length > 0 ? (
          <details className="odonto-dashboard-history-details">
            <summary>Ver movimientos recientes</summary>
            <ol className="odonto-dashboard-history-list">
              {visibleHistoryMovements.map((movement, index) => (
                <li key={`${movement.processedAt}-${index}`}>
                  <span
                    className={`odonto-dashboard-history-mark odonto-dashboard-history-mark--${movement.result}`}
                    aria-hidden="true"
                  />
                  <div>
                    <strong>{movement.title}</strong>
                    <p>{movement.detail}</p>
                    <small>
                      {formatEditorialDateTime(movement.processedAt)} · {formatPublicationDuration(movement.durationMs)}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
            {visibleHistoryCount < displayedHistoryView.movements.length ? (
              <button
                type="button"
                className="odonto-dashboard-history-more"
                onClick={() => setHistoryPagination({
                  key: historyPaginationKey,
                  count: visibleHistoryCount + 5,
                })}
              >
                Ver 5 más
              </button>
            ) : null}
          </details>
        ) : null}

        {displayedHistoryView.invalidEntries > 0 ? (
          <p role="status" style={styles.historyNotice}>
            Omitimos {displayedHistoryView.invalidEntries === 1 ? 'un movimiento incompleto' : 'algunos movimientos incompletos'} para que puedas seguir usando el panel.
          </p>
        ) : null}
      </section>

      <section aria-labelledby="content-list-title" style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <p style={styles.eyebrow}>ARTÍCULOS E INSTRUCCIONES</p>
            <h2 id="content-list-title" style={styles.panelTitle}>Contenido por contenido</h2>
            <p style={styles.panelDescription}>Prepará cada pieza acá. El botón de arriba publica la tanda completa que revisaste.</p>
          </div>
          <div className="odonto-dashboard-panel-tools">
            <span aria-live="polite" style={styles.total}>{filteredRows.length} de {dashboardRows.length} contenidos</span>
            <div className="odonto-dashboard-view-switcher" role="group" aria-label="Forma de ver los contenidos">
              <button
                type="button"
                aria-pressed={contentViewMode === 'cards'}
                onClick={() => setContentViewMode('cards')}
              >
                Tarjetas
              </button>
              <button
                type="button"
                aria-pressed={contentViewMode === 'table'}
                onClick={() => setContentViewMode('table')}
              >
                Tabla
              </button>
            </div>
          </div>
        </div>

        <div className="odonto-dashboard-filters" style={styles.filters}>
          <label style={styles.filterLabel}>
            <span>Buscar</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setContentPage(1);
              }}
              placeholder="Título, categoría o dirección"
              style={styles.filterControl}
            />
          </label>
          <label style={styles.filterLabel}>
            <span>Tipo</span>
            <select value={collectionFilter} onChange={(event) => {
              setCollectionFilter(event.target.value as typeof collectionFilter);
              setContentPage(1);
            }} style={styles.filterControl}>
              <option value="all">Todos</option>
              <option value="articulo">Artículos</option>
              <option value="instruccion">Instrucciones</option>
            </select>
          </label>
          <label style={styles.filterLabel}>
            <span>Estado</span>
            <select value={contentStateFilter} onChange={(event) => {
              setContentStateFilter(event.target.value as typeof contentStateFilter);
              setContentPage(1);
            }} style={styles.filterControl}>
              <option value="all">Todos</option>
              {Object.entries(displayStateLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label style={styles.filterLabel}>
            <span>Ordenar</span>
            <select value={contentSort} onChange={(event) => {
              setContentSort(event.target.value as ContentSort);
              setContentPage(1);
            }} style={styles.filterControl}>
              <option value="updated_desc">Último cambio</option>
              <option value="created_desc">Más recientes</option>
              <option value="published_desc">Publicación más reciente</option>
              <option value="title_asc">Título A–Z</option>
            </select>
          </label>
          <button type="button" onClick={clearFilters} style={styles.clearFilters}>Limpiar filtros</button>
        </div>

        <p className="odonto-dashboard-state-guide">
          <strong>Estado</strong> resume si la pieza está publicada, fuera del sitio, en borrador o atravesando un cambio.{' '}
          <strong>Qué pasa</strong> explica cualquier pendiente.
        </p>

        {loading ? (
          <p role="status" style={styles.emptyState}>Estamos cargando el contenido…</p>
        ) : filteredRows.length === 0 ? (
          <div style={styles.emptyState}>
            <strong>No encontramos contenidos con esos filtros.</strong>
            <button type="button" onClick={clearFilters} style={styles.emptyButton}>Mostrar todo</button>
          </div>
        ) : contentViewMode === 'cards' ? (
          <div className="odonto-dashboard-card-grid">
            {paginatedRows.map((row) => {
              const publicationIsConfirmingRow = publicationActive && ['preview_only', 'unknown'].includes(row.publicStatus);
              const displayState = getEditorialDashboardDisplayState(row);
              const stateColors = displayState.value ? displayStateColors[displayState.value] : unconfirmedStateColors;
              const displayedSituationLabel = publicationIsConfirmingRow
                ? 'Publicación en curso'
                : row.readinessLabel;
              const displayedExplanation = publicationIsConfirmingRow
                ? 'Cuando termine, el panel confirmará si esta versión ya está visible.'
                : row.explanation;
              return (
                <article className="odonto-dashboard-content-card" key={`${row.collection}:${row.relativePath}`}>
                  <div className="odonto-dashboard-content-card-head">
                    <span className="odonto-dashboard-category">{row.categoryLabel}</span>
                    <span
                      aria-label={`Estado: ${displayState.label}`}
                      style={{ ...styles.statusChip, color: stateColors.color, background: stateColors.background }}
                    >
                      {displayState.label}
                    </span>
                  </div>
                  <p className="odonto-dashboard-content-type">{row.collection === 'articulo' ? 'Artículo' : 'Instrucción para pacientes'}</p>
                  <h3 className="odonto-dashboard-content-title">{row.title}</h3>
                  <p className="odonto-dashboard-content-excerpt">{row.excerpt}</p>
                  <div className="odonto-dashboard-tags" aria-label="Etiquetas">
                    {row.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="odonto-dashboard-dates" aria-label="Fechas editoriales, hora de Argentina">
                    <span><small>Creado</small><strong>{formatEditorialDateTime(row.createdAt)}</strong></span>
                    <span><small>Último cambio</small><strong>{formatEditorialDateTime(row.updatedAt)}</strong></span>
                    {row.publishedAt ? <span><small>Publicado</small><strong>{formatEditorialDateTime(row.publishedAt)}</strong></span> : null}
                  </div>
                  <dl className="odonto-dashboard-status-list">
                    <div>
                      <dt>Qué pasa</dt>
                      <dd>
                        <strong className={`odonto-dashboard-readiness odonto-dashboard-readiness--${row.readiness}`}>{displayedSituationLabel}</strong>
                        <span className="odonto-dashboard-explanation">{displayedExplanation}</span>
                      </dd>
                    </div>
                  </dl>
                  <div className="odonto-dashboard-actions odonto-dashboard-card-actions">
                    <a
                      href={row.editHref}
                      aria-label={`${row.actionLabel}: ${row.title}`}
                      className="odonto-dashboard-action odonto-dashboard-action--primary"
                    >
                      {row.actionLabel}
                    </a>
                    {row.previewHref ? (
                      <a
                        href={row.previewHref}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Ver vista previa de ${row.title}; se abre en otra pestaña`}
                        className="odonto-dashboard-action"
                      >
                        Ver vista previa ↗
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="odonto-dashboard-table-shell">
            {canScrollTableLeft ? (
              <button
                type="button"
                className="odonto-dashboard-table-scroll odonto-dashboard-table-scroll--left"
                onClick={() => scrollTable('left')}
                aria-label="Desplazar la tabla hacia la izquierda"
                title="Ver columnas anteriores"
              >
                <span aria-hidden="true">‹</span>
              </button>
            ) : null}
            {canScrollTableRight ? (
              <button
                type="button"
                className="odonto-dashboard-table-scroll odonto-dashboard-table-scroll--right"
                onClick={() => scrollTable('right')}
                aria-label="Desplazar la tabla hacia la derecha"
                title="Ver más columnas"
              >
                <span aria-hidden="true">›</span>
              </button>
            ) : null}
            <div
              ref={tableScrollRef}
              className="odonto-dashboard-table-wrap"
              onScroll={updateTableScrollControls}
              tabIndex={0}
              role="region"
              aria-label="Tabla de contenidos. Desplazá horizontalmente para ver todas las columnas."
            >
              <table className="odonto-dashboard-table">
              <thead>
                <tr>
                  <th scope="col">Contenido</th>
                  <th scope="col">Fechas (Argentina)</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Qué pasa</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => {
                  const publicationIsConfirmingRow = publicationActive && ['preview_only', 'unknown'].includes(row.publicStatus);
                  const displayState = getEditorialDashboardDisplayState(row);
                  const stateColors = displayState.value ? displayStateColors[displayState.value] : unconfirmedStateColors;
                  const displayedSituationLabel = publicationIsConfirmingRow
                    ? 'Publicación en curso'
                    : row.readinessLabel;
                  const displayedExplanation = publicationIsConfirmingRow
                    ? 'Cuando termine, el panel confirmará si esta versión ya está visible.'
                    : row.explanation;
                  return (
                    <tr key={`${row.collection}:${row.relativePath}`}>
                      <td data-label="Contenido">
                        <div className="odonto-dashboard-cell-value">
                          <strong className="odonto-dashboard-title">{row.title}</strong>
                          <span className="odonto-dashboard-meta">{row.collection === 'articulo' ? 'Artículo' : 'Instrucción'} · {row.categoryLabel}</span>
                          <span className="odonto-dashboard-table-excerpt">{row.excerpt}</span>
                          <span className="odonto-dashboard-table-tags">{row.tags.join(' · ')}</span>
                        </div>
                      </td>
                      <td data-label="Fechas">
                        <div className="odonto-dashboard-cell-value">
                          <span className="odonto-dashboard-table-date"><b>Creado:</b> {formatEditorialDateTime(row.createdAt)}</span>
                          <span className="odonto-dashboard-table-date"><b>Actualizado:</b> {formatEditorialDateTime(row.updatedAt)}</span>
                          {row.publishedAt ? <span className="odonto-dashboard-table-date"><b>Publicado:</b> {formatEditorialDateTime(row.publishedAt)}</span> : null}
                        </div>
                      </td>
                      <td data-label="Estado">
                        <div className="odonto-dashboard-cell-value">
                          <span
                            aria-label={`Estado: ${displayState.label}`}
                            style={{ ...styles.statusChip, color: stateColors.color, background: stateColors.background }}
                          >
                            {displayState.label}
                          </span>
                        </div>
                      </td>
                      <td data-label="Qué pasa">
                        <div className="odonto-dashboard-cell-value">
                          <strong className={`odonto-dashboard-readiness odonto-dashboard-readiness--${row.readiness}`}>{displayedSituationLabel}</strong>
                          <span className="odonto-dashboard-explanation">{displayedExplanation}</span>
                        </div>
                      </td>
                      <td data-label="Acciones">
                        <div className="odonto-dashboard-cell-value odonto-dashboard-actions">
                          <a
                            href={row.editHref}
                            aria-label={`${row.actionLabel}: ${row.title}`}
                            className="odonto-dashboard-action odonto-dashboard-action--primary"
                          >
                            {row.actionLabel}
                          </a>
                          {row.previewHref ? (
                            <a
                              href={row.previewHref}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Ver vista previa de ${row.title}; se abre en otra pestaña`}
                              className="odonto-dashboard-action"
                            >
                              Ver vista previa ↗
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredRows.length > 0 ? (
          <nav className="odonto-dashboard-pagination" aria-label="Páginas de contenidos">
            <button
              type="button"
              disabled={currentContentPage === 1}
              onClick={() => setContentPage((page) => Math.max(1, page - 1))}
            >
              <span aria-hidden="true">←</span> Anterior
            </button>
            <p aria-live="polite">
              <strong>{firstVisibleContent}–{lastVisibleContent}</strong> de {filteredRows.length} contenidos
              <span className="odonto-dashboard-pagination-separator" aria-hidden="true"> · </span>
              Página {currentContentPage} de {totalContentPages}
            </p>
            <label>
              <span>Mostrar</span>
              <select
                value={contentPageSize}
                onChange={(event) => {
                  setContentPageSize(Number(event.target.value) as ContentPageSize);
                  setContentPage(1);
                }}
                aria-label="Contenidos por página"
              >
                {contentPageSizeOptions.map((size) => <option key={size} value={size}>{size} por página</option>)}
              </select>
            </label>
            <button
              type="button"
              disabled={currentContentPage === totalContentPages}
              onClick={() => setContentPage((page) => Math.min(totalContentPages, page + 1))}
            >
              Siguiente <span aria-hidden="true">→</span>
            </button>
          </nav>
        ) : null}
      </section>
    </main>
  );
}

const dashboardResponsiveStyles = `
  .odonto-dashboard-page { container-type: inline-size; width: 100%; }
  .odonto-dashboard-local-tools { width: min(1120px, 100%); box-sizing: border-box; margin: 0 auto 18px; padding: 12px 14px; border: 1px solid #c9dfe7; border-radius: 14px; color: #234554; background: #f2fafc; }
  .odonto-dashboard-local-tools > summary, .odonto-dashboard-publication-help > summary { color: #5f5148; font-size: 12px; font-weight: 800; cursor: pointer; }
  .odonto-dashboard-local-tools > summary { color: #285264; }
  .odonto-dashboard-publication-help { margin-top: 12px; }
  .odonto-dashboard-history-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .odonto-dashboard-history-totals { display: grid; grid-template-columns: repeat(2, minmax(90px, 1fr)); gap: 8px; margin: 0; }
  .odonto-dashboard-history-totals > div { min-width: 90px; padding: 11px 13px; border: 1px solid #e3d9d2; border-radius: 13px; background: #faf7f4; }
  .odonto-dashboard-history-totals dt { color: #756a63; font-size: 10px; font-weight: 800; text-transform: uppercase; }
  .odonto-dashboard-history-totals dd { margin: 5px 0 0; color: #2b2521; font-size: 20px; font-weight: 850; }
  .odonto-dashboard-history-details { margin-top: 18px; border-top: 1px solid #e9e1dc; padding-top: 14px; }
  .odonto-dashboard-history-details > summary { width: fit-content; min-height: 40px; display: flex; align-items: center; color: #9f3f16; font-size: 13px; font-weight: 800; cursor: pointer; }
  .odonto-dashboard-history-list { display: grid; gap: 0; margin: 10px 0 0; padding: 0; list-style: none; border: 1px solid #e8dfd9; border-radius: 15px; overflow: hidden; }
  .odonto-dashboard-history-list li { display: grid; grid-template-columns: 12px minmax(0, 1fr); gap: 12px; padding: 15px; background: #fff; }
  .odonto-dashboard-history-list li + li { border-top: 1px solid #eee7e2; }
  .odonto-dashboard-history-list strong { color: #2b2521; font-size: 14px; }
  .odonto-dashboard-history-list p { margin: 5px 0; color: #675d56; font-size: 13px; line-height: 1.45; }
  .odonto-dashboard-history-list small { color: #80736b; font-size: 11px; font-weight: 700; }
  .odonto-dashboard-history-mark { width: 10px; height: 10px; margin-top: 4px; border-radius: 999px; background: #a39389; }
  .odonto-dashboard-history-mark--published { background: #3b7a55; }
  .odonto-dashboard-history-mark--failed { background: #b94a24; }
  .odonto-dashboard-history-more { min-height: 40px; margin-top: 12px; padding: 0 15px; border: 1px solid #d8cec7; border-radius: 999px; color: #8f3715; background: #fff; font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; }
  .odonto-dashboard-history-more:hover { color: #fff; background: #b94818; border-color: #b94818; }
  .odonto-dashboard-history-details > summary:focus-visible, .odonto-dashboard-history-more:focus-visible { outline: 3px solid rgba(193,77,25,.3); outline-offset: 3px; }
  .odonto-dashboard-summary { width: min(1120px, 100%); margin: 0 auto 18px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
  .odonto-dashboard-summary-card { min-width: 0; display: flex; align-items: center; gap: 14px; padding: 18px; border: 1px solid #e4dbd5; border-radius: 18px; background: rgba(255,255,255,.88); box-shadow: 0 12px 34px rgba(70,45,31,.05); }
  .odonto-dashboard-summary-card > span:last-child { min-width: 0; }
  .odonto-dashboard-summary-card strong, .odonto-dashboard-summary-card small { display: block; }
  .odonto-dashboard-summary-card strong { color: #211c19; font-size: 26px; line-height: 1; }
  .odonto-dashboard-summary-card small { margin-top: 5px; color: #746860; font-size: 12px; font-weight: 750; line-height: 1.3; }
  .odonto-dashboard-summary-icon { flex: 0 0 42px; width: 42px; height: 42px; display: grid; place-items: center; border-radius: 14px; color: #a83f14; background: #fce4d7; font-size: 15px; font-weight: 900; }
  .odonto-dashboard-summary-icon--sand { color: #88530d; background: #fff0cf; }
  .odonto-dashboard-summary-icon--green { color: #24603e; background: #e1f2e7; }
  .odonto-dashboard-summary-icon--amber { color: #9a451d; background: #f8e1d5; }
  .odonto-dashboard-panel-tools { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 12px; }
  .odonto-dashboard-view-switcher { display: inline-flex; padding: 4px; border: 1px solid #d9d0ca; border-radius: 12px; background: #f6f1ed; }
  .odonto-dashboard-view-switcher button { min-height: 36px; padding: 0 12px; border: 0; border-radius: 9px; color: #6b5f58; background: transparent; font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; }
  .odonto-dashboard-view-switcher button[aria-pressed="true"] { color: #fff; background: #b94818; box-shadow: 0 5px 14px rgba(155,62,24,.2); }
  .odonto-dashboard-state-guide { margin: -2px 0 18px; padding: 10px 12px; border-left: 3px solid #d58a66; color: #71655e; background: #faf6f2; font-size: 12px; line-height: 1.55; }
  .odonto-dashboard-state-guide strong { color: #453b35; }
  .odonto-dashboard-card-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .odonto-dashboard-content-card { min-width: 0; display: flex; flex-direction: column; padding: 22px; border: 1px solid #e4dbd5; border-radius: 20px; background: linear-gradient(145deg, #fff, #fdfaf8); box-shadow: 0 12px 32px rgba(70,45,31,.055); }
  .odonto-dashboard-content-card-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .odonto-dashboard-category { max-width: 65%; padding: 5px 9px; border-radius: 999px; color: #8a3f1e; background: #f9e9df; font-size: 11px; font-weight: 850; line-height: 1.3; }
  .odonto-dashboard-content-type { margin: 18px 0 5px; color: #8a7c73; font-size: 11px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
  .odonto-dashboard-content-title { margin: 0; color: #211c19; font-size: 20px; line-height: 1.25; letter-spacing: -.02em; }
  .odonto-dashboard-content-excerpt { margin: 10px 0 0; color: #6c615a; font-size: 13px; line-height: 1.55; }
  .odonto-dashboard-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
  .odonto-dashboard-tags span { padding: 4px 7px; border-radius: 7px; color: #685d56; background: #f2eeeb; font-size: 10px; font-weight: 700; }
  .odonto-dashboard-dates { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin-top: 16px; overflow: hidden; border: 1px solid #e9e1dc; border-radius: 13px; background: #e9e1dc; }
  .odonto-dashboard-dates > span { min-width: 0; padding: 11px; background: #faf8f6; }
  .odonto-dashboard-dates small, .odonto-dashboard-dates strong { display: block; }
  .odonto-dashboard-dates small { color: #82766e; font-size: 9px; font-weight: 850; letter-spacing: .04em; text-transform: uppercase; }
  .odonto-dashboard-dates strong { margin-top: 5px; color: #443c37; font-size: 10px; line-height: 1.35; }
  .odonto-dashboard-status-list { display: grid; gap: 0; margin: 20px 0; border: 1px solid #ede6e1; border-radius: 14px; background: #faf7f4; }
  .odonto-dashboard-status-list > div { display: grid; grid-template-columns: 100px minmax(0, 1fr); gap: 12px; padding: 13px 14px; }
  .odonto-dashboard-status-list > div + div { border-top: 1px solid #e9e0da; }
  .odonto-dashboard-status-list dt { color: #766b64; font-size: 11px; font-weight: 850; letter-spacing: .04em; text-transform: uppercase; }
  .odonto-dashboard-status-list dd { min-width: 0; margin: 0; }
  .odonto-dashboard-card-actions { margin-top: auto; padding-top: 2px; flex-direction: row !important; flex-wrap: wrap; align-items: center !important; }
  .odonto-dashboard-table-shell { position: relative; width: 100%; }
  .odonto-dashboard-table-wrap { width: 100%; overflow-x: auto; overscroll-behavior-inline: contain; border: 1px solid #e4dbd5; border-radius: 16px; background: #fff; scroll-behavior: smooth; scrollbar-color: #bcaea5 #f3efec; scrollbar-width: thin; -webkit-overflow-scrolling: touch; }
  .odonto-dashboard-table-wrap:focus-visible { outline: 3px solid rgba(193,77,25,.28); outline-offset: 3px; }
  .odonto-dashboard-table { width: 100%; min-width: 900px; border-collapse: collapse; table-layout: fixed; }
  .odonto-dashboard-table-scroll { position: absolute; top: min(46%, 280px); z-index: 6; width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid #d8cec7; border-radius: 999px; color: #8f3715; background: rgba(255,255,255,.96); box-shadow: 0 9px 25px rgba(61,39,27,.2); cursor: pointer; backdrop-filter: blur(8px); }
  .odonto-dashboard-table-scroll span { font-size: 32px; font-weight: 500; line-height: .8; transform: translateY(-1px); }
  .odonto-dashboard-table-scroll--left { left: -12px; }
  .odonto-dashboard-table-scroll--right { right: -12px; }
  .odonto-dashboard-table-scroll:hover { color: #fff; background: #b94818; border-color: #b94818; }
  .odonto-dashboard-table-scroll:focus-visible { outline: 3px solid rgba(193,77,25,.32); outline-offset: 3px; }
  .odonto-dashboard-table th { padding: 12px 14px; color: #6d625c; background: #f7f3f0; font-size: 12px; line-height: 1.35; text-align: left; }
  .odonto-dashboard-table th:nth-child(1) { width: 27%; }
  .odonto-dashboard-table th:nth-child(2) { width: 18%; }
  .odonto-dashboard-table th:nth-child(3) { width: 15%; }
  .odonto-dashboard-table th:nth-child(4) { width: 25%; }
  .odonto-dashboard-table th:nth-child(5) { width: 15%; }
  .odonto-dashboard-table td { padding: 16px 14px; border-top: 1px solid #eee7e2; vertical-align: top; color: #2f2926; font-size: 13px; line-height: 1.45; overflow-wrap: anywhere; }
  .odonto-dashboard-cell-value { min-width: 0; }
  .odonto-dashboard-title, .odonto-dashboard-meta, .odonto-dashboard-explanation, .odonto-dashboard-readiness { display: block; }
  .odonto-dashboard-title { margin-bottom: 5px; font-size: 14px; line-height: 1.35; }
  .odonto-dashboard-meta { color: #7a6f68; }
  .odonto-dashboard-table-excerpt, .odonto-dashboard-table-tags, .odonto-dashboard-table-date { display: block; margin-top: 7px; color: #756a63; font-size: 11px; line-height: 1.45; }
  .odonto-dashboard-table-tags { color: #9a4b27; }
  .odonto-dashboard-table-date:first-child { margin-top: 0; }
  .odonto-dashboard-readiness { margin-bottom: 5px; font-size: 13px; }
  .odonto-dashboard-readiness--ready { color: #a54015; }
  .odonto-dashboard-readiness--blocked { color: #8a341f; }
  .odonto-dashboard-readiness--current { color: #2e6544; }
  .odonto-dashboard-explanation { color: #6d625c; }
  .odonto-dashboard-actions { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
  .odonto-dashboard-action { display: inline-flex; min-height: 36px; align-items: center; border-radius: 999px; color: #9f3f16; font-weight: 750; text-decoration: none; }
  .odonto-dashboard-action--primary { min-height: 40px; padding: 0 14px; justify-content: center; color: #fff; background: #b94818; white-space: nowrap; }
  .odonto-dashboard-action:hover { text-decoration: underline; }
  .odonto-dashboard-action--primary:hover { background: #9f3f16; text-decoration: none; }
  .odonto-dashboard-pagination { display: grid; grid-template-columns: auto minmax(180px, 1fr) auto auto; gap: 12px; align-items: center; margin-top: 18px; padding-top: 18px; border-top: 1px solid #e9e1dc; }
  .odonto-dashboard-pagination > button, .odonto-dashboard-pagination select { min-height: 40px; border: 1px solid #d8cec7; border-radius: 999px; color: #6e321b; background: #fff; font: inherit; font-size: 12px; font-weight: 800; }
  .odonto-dashboard-pagination > button { padding: 0 15px; cursor: pointer; }
  .odonto-dashboard-pagination > button:hover:not(:disabled) { color: #fff; background: #b94818; border-color: #b94818; }
  .odonto-dashboard-pagination > button:disabled { opacity: .42; cursor: not-allowed; }
  .odonto-dashboard-pagination p { margin: 0; color: #6e635c; font-size: 12px; line-height: 1.4; text-align: center; white-space: nowrap; }
  .odonto-dashboard-pagination p strong { color: #2c2622; }
  .odonto-dashboard-pagination-separator { color: #a5958b; }
  .odonto-dashboard-pagination label { display: flex; align-items: center; gap: 7px; color: #6e635c; font-size: 11px; font-weight: 800; }
  .odonto-dashboard-pagination select { min-width: 118px; padding: 0 12px; cursor: pointer; }
  .odonto-dashboard-action:focus-visible, .odonto-dashboard-view-switcher button:focus-visible, .odonto-dashboard-pagination button:focus-visible, .odonto-dashboard-pagination select:focus-visible { outline: 3px solid rgba(193,77,25,.3); outline-offset: 3px; }
  @container (max-width: 900px) {
    .odonto-dashboard-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .odonto-dashboard-card-grid { grid-template-columns: 1fr; }
    .odonto-dashboard-filters { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 760px) {
    .odonto-dashboard-page { padding: 22px 16px !important; }
  }
  @container (max-width: 760px) {
    .odonto-dashboard-summary { grid-template-columns: 1fr 1fr; gap: 10px; }
    .odonto-dashboard-summary-card { gap: 10px; padding: 13px; border-radius: 15px; }
    .odonto-dashboard-summary-icon { flex-basis: 36px; width: 36px; height: 36px; border-radius: 12px; }
    .odonto-dashboard-summary-card strong { font-size: 21px; }
    .odonto-dashboard-summary-card small { font-size: 11px; }
    .odonto-dashboard-panel-tools { width: 100%; justify-content: space-between; }
    .odonto-dashboard-view-switcher { width: 100%; }
    .odonto-dashboard-view-switcher button { flex: 1 1 50%; }
    .odonto-dashboard-content-card { padding: 18px; border-radius: 17px; }
    .odonto-dashboard-content-title { font-size: 18px; }
    .odonto-dashboard-dates { grid-template-columns: 1fr; }
    .odonto-dashboard-status-list > div { grid-template-columns: 1fr; gap: 7px; }
    .odonto-dashboard-card-actions { align-items: stretch !important; }
    .odonto-dashboard-card-actions .odonto-dashboard-action { justify-content: center; width: 100%; box-sizing: border-box; }
    .odonto-dashboard-pagination { grid-template-columns: 1fr 1fr; }
    .odonto-dashboard-pagination p { grid-column: 1 / -1; grid-row: 1; }
    .odonto-dashboard-pagination label { grid-column: 1 / -1; justify-content: center; }
    .odonto-dashboard-pagination > button { width: 100%; }
    .odonto-dashboard-table { min-width: 900px; }
    .odonto-dashboard-table-scroll { top: min(38%, 220px); width: 42px; height: 42px; }
    .odonto-dashboard-table-scroll--left { left: -9px; }
    .odonto-dashboard-table-scroll--right { right: -9px; }
    .odonto-dashboard-publication { gap: 16px !important; }
    .odonto-dashboard-history-head { display: grid; }
    .odonto-dashboard-history-totals { width: 100%; }
    .odonto-dashboard-history-list li { padding: 13px; }
    .odonto-dashboard-history-more { width: 100%; }
    .odonto-dashboard-quick-links { grid-template-columns: 1fr !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .odonto-dashboard-action { scroll-behavior: auto; }
  }
`;

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100%', boxSizing: 'border-box', padding: 'clamp(24px, 5vw, 64px)', background: '#f8f6f3', color: '#1f1b18', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, maxWidth: 1120, margin: '0 auto 26px' },
  eyebrow: { margin: '0 0 8px', color: '#b74516', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em' },
  title: { margin: 0, fontSize: 'clamp(34px, 5vw, 54px)', lineHeight: 1, letterSpacing: '-0.04em' },
  subtitle: { maxWidth: 620, margin: '18px 0 0', color: '#6f655e', fontSize: 16, lineHeight: 1.6 },
  secondaryButton: { minHeight: 44, padding: '0 18px', border: '1px solid #d7cec7', borderRadius: 999, background: 'rgba(255,255,255,.75)', color: '#2b2521', fontWeight: 700, cursor: 'pointer' },
  error: { maxWidth: 1120, margin: '0 auto 24px', padding: 16, borderRadius: 14, display: 'grid', gap: 10, color: '#7f1d1d', background: '#fee2e2' },
  notice: { maxWidth: 1120, margin: '0 auto 24px', padding: 16, borderRadius: 14, color: '#6b3a16', background: '#fff1df' },
  localReviewPanel: { maxWidth: 'none', margin: '12px 0 0', padding: 14, borderRadius: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 14, alignItems: 'end', color: '#234554', background: '#eaf6fa', border: '1px solid #b8dce8' },
  localReviewTitle: { display: 'block', fontSize: 15 },
  localReviewText: { margin: '6px 0 0', fontSize: 13, lineHeight: 1.5 },
  localReviewLabel: { display: 'grid', gap: 7, fontSize: 13, fontWeight: 800 },
  localReviewSelect: { width: '100%', minHeight: 48, padding: '0 14px', border: '1px solid #8fbac8', borderRadius: 12, color: '#173844', background: '#fff', font: 'inherit', cursor: 'pointer' },
  publicationPanel: { maxWidth: 1120, margin: '0 auto 18px', padding: 'clamp(16px, 2.4vw, 22px)', borderRadius: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 26, alignItems: 'center', background: '#fff', border: '1px solid #e4dbd5', boxShadow: '0 10px 30px rgba(70,45,31,.045)' },
  historyPanel: { maxWidth: 1120, margin: '0 auto 18px', padding: 'clamp(16px, 2.4vw, 22px)', borderRadius: 18, background: '#fff', border: '1px solid #e4dbd5', boxShadow: '0 10px 30px rgba(70,45,31,.045)' },
  historySummary: { maxWidth: 660, margin: '8px 0 0', color: '#655b55', fontSize: 14, lineHeight: 1.5 },
  historyNotice: { margin: '14px 0 0', padding: 12, borderRadius: 12, color: '#6b3a16', background: '#fff1df', fontSize: 12, lineHeight: 1.45 },
  publicationCopy: { minWidth: 0 },
  publicationDetail: { margin: '8px 0 0', color: '#655b55', fontSize: 14, lineHeight: 1.5 },
  publicationHint: { margin: '12px 0 0', color: '#756961', fontSize: 13, lineHeight: 1.5 },
  autoRefreshHint: { margin: '10px 0 0', color: '#9a451d', fontSize: 13, fontWeight: 700, lineHeight: 1.5 },
  publicationActions: { display: 'grid', gap: 12 },
  confirmationLabel: { display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start', color: '#403933', fontSize: 13, lineHeight: 1.45, cursor: 'pointer' },
  confirmationCheckbox: { width: 20, height: 20, margin: 0, accentColor: '#c14d19' },
  publishButton: { minHeight: 48, padding: '0 22px', border: 0, borderRadius: 999, color: '#fff', background: '#c14d19', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 24px rgba(193,77,25,.2)' },
  disabledButton: { opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' },
  previewLink: { display: 'inline-flex', marginTop: 18, color: '#a93f12', fontWeight: 800, textDecoration: 'none' },
  previewUnavailable: { display: 'inline-block', marginTop: 18, color: '#8a5b44', fontSize: 13, fontWeight: 700 },
  supportDetails: { color: '#6f2d15', fontSize: 13, lineHeight: 1.5 },
  supportCode: { display: 'block', maxWidth: '100%', marginTop: 8, padding: 10, overflowWrap: 'anywhere', borderRadius: 10, color: '#4a2114', background: 'rgba(255,255,255,.55)', whiteSpace: 'pre-wrap' },
  supportReference: { margin: '8px 0 0', overflowWrap: 'anywhere' },
  localPublishNote: { color: '#766b64', fontSize: 11, lineHeight: 1.4, textAlign: 'center' },
  quickLinksPanel: { maxWidth: 1120, margin: '0 auto 18px', padding: '14px 16px', borderRadius: 16, display: 'grid', gridTemplateColumns: 'minmax(180px, .65fr) minmax(0, 2fr)', gap: 16, alignItems: 'center', color: '#1f1b18', background: '#f3eee9', border: '1px solid #e1d7d0' },
  quickLinksHeading: { minWidth: 0 },
  quickLinksTitle: { margin: 0, fontSize: 16, letterSpacing: '-0.015em' },
  quickLinksList: { minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: 8 },
  quickLink: { minWidth: 0, minHeight: 42, padding: '0 12px', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, color: '#3b332e', background: '#fff', border: '1px solid #ddd3cd', textDecoration: 'none', fontSize: 12 },
  panel: { maxWidth: 1120, margin: '0 auto 24px', padding: 'clamp(20px, 4vw, 32px)', borderRadius: 24, background: 'rgba(255,255,255,.82)', border: '1px solid #e5ddd7', boxShadow: '0 18px 50px rgba(70,45,31,.06)' },
  panelHeader: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 22 },
  panelTitle: { margin: 0, fontSize: 24, letterSpacing: '-0.025em' },
  panelDescription: { maxWidth: 680, margin: '8px 0 0', color: '#766b64', fontSize: 14, lineHeight: 1.5 },
  total: { color: '#766b64', fontSize: 14, fontWeight: 700 },
  filters: { display: 'grid', gridTemplateColumns: 'minmax(210px, 1.5fr) repeat(3, minmax(130px, 1fr)) auto', gap: 10, alignItems: 'end', marginBottom: 22 },
  filterLabel: { display: 'grid', gap: 6, color: '#5d534d', fontSize: 12, fontWeight: 800 },
  filterControl: { width: '100%', minWidth: 0, minHeight: 44, padding: '0 12px', border: '1px solid #bdb2ab', borderRadius: 10, color: '#2f2926', background: '#fff', font: 'inherit' },
  clearFilters: { minHeight: 44, padding: '0 14px', border: '1px solid #d7cec7', borderRadius: 10, color: '#7c3518', background: '#fffaf6', fontWeight: 750, cursor: 'pointer' },
  emptyState: { minHeight: 120, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, border: '1px dashed #d7cec7', borderRadius: 16, color: '#6d625c', textAlign: 'center' },
  emptyButton: { minHeight: 40, padding: '0 14px', border: 0, borderRadius: 999, color: '#fff', background: '#b94818', fontWeight: 750, cursor: 'pointer' },
  statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 },
  statusCard: { display: 'grid', gridTemplateColumns: '12px 1fr auto', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, background: '#f8f5f2' },
  statusDot: { width: 10, height: 10, borderRadius: 999 },
  statusLabel: { color: '#655b55', fontSize: 13, fontWeight: 700 },
  statusCount: { fontSize: 20 },
  documentList: { display: 'grid', gap: 8 },
  documentRow: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '15px 16px', borderRadius: 14, color: '#1f1b18', background: '#faf8f6', textDecoration: 'none', border: '1px solid transparent' },
  documentCopy: { minWidth: 0, display: 'grid', gap: 5 },
  documentTitle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  documentMeta: { color: '#82756d', fontSize: 13 },
  statusChip: { padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' },
};
