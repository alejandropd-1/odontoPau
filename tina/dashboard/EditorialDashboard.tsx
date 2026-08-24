import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useCMS } from 'tinacms';

import { isEditorialPublicationBranch } from '../../src/cms/tina/branch';
import {
  PUBLICATION_REQUEST_RELATIVE_PATH,
  createPendingPublicationRequest,
  isActivePublicationRequest,
  type PublicationRequest,
  type PublicationRequestStatus,
} from '../../src/cms/tina/publication';

const EDITORIAL_QUERY = `
  query OdontoPauEditorialDashboard {
    articuloConnection {
      totalCount
      edges {
        node {
          title
          status
          categoryLabel
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
          status
          categoryLabel
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
    }
  }
`;

interface EditorialNode {
  title: string;
  status: string;
  categoryLabel: string;
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

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  clinical_review: 'Revisión clínica',
  technical_review: 'Revisión técnica',
  approved: 'Aprobado',
  published: 'Publicado',
  retired: 'Retirado',
};

const statusColors: Record<string, { color: string; background: string }> = {
  draft: { color: '#72543d', background: '#f5eee7' },
  clinical_review: { color: '#8a4f08', background: '#fff0cf' },
  technical_review: { color: '#385c73', background: '#e8f3fa' },
  approved: { color: '#2e6544', background: '#e7f5ec' },
  published: { color: '#fff', background: '#c94f16' },
  retired: { color: '#5f6368', background: '#eceff1' },
};

const publicationStatusCopy: Record<PublicationRequestStatus, { title: string; detail: string }> = {
  idle: {
    title: 'Sin publicación pendiente',
    detail: 'Podés seguir editando y guardar. Producción no cambia hasta que uses el botón de publicación.',
  },
  pending: {
    title: 'Publicación solicitada o en curso',
    detail: 'Los controles automáticos están comenzando o ejecutándose. Los cambios siguen visibles sólo en Preview.',
  },
  processing: {
    title: 'Publicando cambios',
    detail: 'Se están ejecutando los controles y la integración protegida. No vuelvas a solicitarla.',
  },
  published: {
    title: 'Últimos cambios publicados',
    detail: 'La publicación terminó correctamente. Podés iniciar una nueva tanda editorial.',
  },
  failed: {
    title: 'La publicación se detuvo',
    detail: 'Producción no cambió. Tus modificaciones siguen en Preview para corregirlas o pedir ayuda.',
  },
  waiting_index: {
    title: 'Esperando actualización del editor',
    detail: 'La versión ya se procesó, pero Tina todavía está actualizando su índice. Esperá antes de publicar otra tanda.',
  },
};

const previewUrl = process.env.NEXT_PUBLIC_EDITORIAL_PREVIEW_URL;

interface EditorialDashboardProps {
  branch: string;
}

function collectionUrl(collection: 'homepage' | 'treatmentspage' | 'tratamiento' | 'articulo' | 'instruccion'): string {
  return `#/collections/${collection}`;
}

function documentUrl(collection: 'articulo' | 'instruccion', relativePath: string): string {
  const documentPath = relativePath.replace(/\.json$/i, '');
  return `#/collections/edit/${collection}/${documentPath}`;
}

export function createEditorialDashboard(branch: string) {
  return function TinaEditorialDashboard() {
    return <EditorialDashboard branch={branch} />;
  };
}

export function EditorialDashboard({ branch }: EditorialDashboardProps) {
  const cms = useCMS();
  const [data, setData] = useState<EditorialDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publicationConfirmed, setPublicationConfirmed] = useState(false);
  const publicationEnabled = isEditorialPublicationBranch(branch);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tinaApi = cms.api.tina;
      if (!tinaApi) throw new Error('El cliente de Tina todavía no está disponible.');

      const response = (await tinaApi.request(EDITORIAL_QUERY, {
        variables: {},
      })) as EditorialDashboardResponse;
      if (response.errors?.length) throw new Error(response.errors[0].message);
      setData(response);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo cargar el contenido editorial.');
    } finally {
      setLoading(false);
    }
  }, [cms]);

  const requestPublication = useCallback(async () => {
    const current = data?.publicationrequest;
    if (!current || !publicationConfirmed || publishing || !publicationEnabled) return;

    const confirmed = window.confirm(
      'Vas a publicar el snapshot completo que ves en Preview, no sólo la pantalla abierta. ¿Querés continuar?'
    );
    if (!confirmed) return;

    setPublishing(true);
    setError(null);
    try {
      const tinaApi = cms.api.tina;
      if (!tinaApi) throw new Error('El cliente de Tina todavía no está disponible.');

      const requestId = `editorial-${Date.now().toString(36)}-${window.crypto.randomUUID()}`;
      const next = createPendingPublicationRequest(current, requestId, new Date().toISOString());
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

      setData((previous) =>
        previous ? { ...previous, publicationrequest: response.updatePublicationrequest as PublicationRequest } : previous
      );
      setPublicationConfirmed(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo solicitar la publicación.');
    } finally {
      setPublishing(false);
    }
  }, [cms, data?.publicationrequest, publicationConfirmed, publicationEnabled, publishing]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const documents = useMemo(
    () => [
      ...(data?.articuloConnection.edges.map(({ node }) => ({ ...node, collection: 'articulo' as const })) ?? []),
      ...(data?.instruccionConnection.edges.map(({ node }) => ({ ...node, collection: 'instruccion' as const })) ?? []),
    ],
    [data]
  );

  const stateCounts = useMemo(
    () =>
      documents.reduce<Record<string, number>>((counts, document) => {
        counts[document.status] = (counts[document.status] ?? 0) + 1;
        return counts;
      }, {}),
    [documents]
  );

  const recent = useMemo(
    () => [...documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 8),
    [documents]
  );

  const publicationRequest = data?.publicationrequest;
  const publicationStatus = publicationRequest?.status ?? 'idle';
  const publicationCopy = publicationStatusCopy[publicationStatus];
  const publicationActive = publicationRequest ? isActivePublicationRequest(publicationRequest.status) : true;

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>PAULA GUALTIERI · EDITORIAL</p>
          <h1 style={styles.title}>Contenido del sitio</h1>
          <p style={styles.subtitle}>
            Guardar actualiza Preview. Producción sólo cambia cuando confirmás “Publicar cambios”.
          </p>
        </div>
        <button type="button" onClick={() => void load()} aria-label="Actualizar el estado editorial" style={styles.secondaryButton}>
          Actualizar
        </button>
      </header>

      {error ? <div role="alert" style={styles.error}>{error}</div> : null}

      {!publicationEnabled ? (
        <div role="status" style={styles.notice}>
          Este es un Preview técnico. Podés revisar la interfaz, pero la publicación sólo se habilita en el panel editorial conectado a editorial/tina.
        </div>
      ) : null}

      <section aria-labelledby="publication-title" style={styles.publicationPanel}>
        <div style={styles.publicationCopy}>
          <p style={styles.eyebrow}>PUBLICACIÓN</p>
          <h2 id="publication-title" aria-live="polite" style={styles.panelTitle}>{publicationCopy.title}</h2>
          <p style={styles.publicationDetail}>{publicationRequest?.summary || publicationCopy.detail}</p>
          <p style={styles.publicationHint}>
            Guardá todos los documentos primero. El botón publica la tanda completa de Preview y nunca un único campo.
          </p>
          {previewUrl ? (
            <a href={previewUrl} target="_blank" rel="noreferrer" style={styles.previewLink}>
              Abrir Preview ↗
            </a>
          ) : (
            <span style={styles.previewUnavailable}>El enlace de Preview todavía no está configurado.</span>
          )}
        </div>
        <div style={styles.publicationActions}>
          <label style={styles.confirmationLabel}>
            <input
              type="checkbox"
              checked={publicationConfirmed}
              disabled={!publicationEnabled || publicationActive || publishing}
              onChange={(event) => setPublicationConfirmed(event.target.checked)}
              style={styles.confirmationCheckbox}
            />
            <span>Revisé Preview y confirmé las aprobaciones clínicas o de imágenes que correspondan.</span>
          </label>
          <button
            type="button"
            onClick={() => void requestPublication()}
            disabled={!publicationEnabled || publicationActive || publishing || !publicationConfirmed}
            aria-busy={publishing}
            style={{
              ...styles.publishButton,
              ...(!publicationEnabled || publicationActive || publishing || !publicationConfirmed ? styles.disabledButton : {}),
            }}
          >
            {publishing
              ? 'Enviando solicitud…'
              : !publicationEnabled
                ? 'Publicación no disponible en este Preview'
                : publicationActive
                  ? 'Publicación en curso'
                  : 'Publicar cambios'}
          </button>
        </div>
      </section>

      <section aria-label="Colecciones" style={styles.collectionGrid}>
        <a href={collectionUrl('homepage')} style={styles.collectionCard}>
          <span style={styles.collectionLabel}>Página de Inicio</span>
          <strong style={styles.collectionCount}>1</strong>
          <span style={styles.collectionAction}>Editar visualmente →</span>
        </a>
        <a href={collectionUrl('treatmentspage')} style={styles.collectionCard}>
          <span style={styles.collectionLabel}>Página de Servicios</span>
          <strong style={styles.collectionCount}>1</strong>
          <span style={styles.collectionAction}>Editar visualmente →</span>
        </a>
        <a href={collectionUrl('tratamiento')} style={styles.collectionCard}>
          <span style={styles.collectionLabel}>Servicios individuales</span>
          <strong style={styles.collectionCount}>{loading ? '—' : data?.tratamientoConnection.totalCount ?? 0}</strong>
          <span style={styles.collectionAction}>Abrir colección →</span>
        </a>
        <a href={collectionUrl('articulo')} style={styles.collectionCard}>
          <span style={styles.collectionLabel}>Artículos</span>
          <strong style={styles.collectionCount}>{loading ? '—' : data?.articuloConnection.totalCount ?? 0}</strong>
          <span style={styles.collectionAction}>Abrir colección →</span>
        </a>
        <a href={collectionUrl('instruccion')} style={styles.collectionCard}>
          <span style={styles.collectionLabel}>Instrucciones</span>
          <strong style={styles.collectionCount}>{loading ? '—' : data?.instruccionConnection.totalCount ?? 0}</strong>
          <span style={styles.collectionAction}>Abrir colección →</span>
        </a>
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <p style={styles.eyebrow}>ESTADOS</p>
            <h2 style={styles.panelTitle}>Situación editorial</h2>
          </div>
          <span style={styles.total}>{documents.length} contenidos</span>
        </div>
        <div style={styles.statusGrid}>
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} style={styles.statusCard}>
              <span style={{ ...styles.statusDot, background: statusColors[status].background }} />
              <span style={styles.statusLabel}>{label}</span>
              <strong style={styles.statusCount}>{stateCounts[status] ?? 0}</strong>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <p style={styles.eyebrow}>RECIENTES</p>
            <h2 style={styles.panelTitle}>Últimas actualizaciones</h2>
          </div>
        </div>
        <div style={styles.documentList}>
          {recent.map((document) => {
            const chip = statusColors[document.status] ?? statusColors.draft;
            return (
              <a
                key={`${document.collection}-${document._sys.relativePath}`}
                href={documentUrl(document.collection, document._sys.relativePath)}
                style={styles.documentRow}
              >
                <span style={styles.documentCopy}>
                  <strong style={styles.documentTitle}>{document.title}</strong>
                  <span style={styles.documentMeta}>
                    {document.collection === 'articulo' ? 'Artículo' : 'Instrucción'} · {document.categoryLabel}
                  </span>
                </span>
                <span style={{ ...styles.statusChip, color: chip.color, background: chip.background }}>
                  {statusLabels[document.status] ?? document.status}
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { height: '100%', minHeight: 0, overflowY: 'auto', boxSizing: 'border-box', padding: 'clamp(24px, 5vw, 64px)', background: '#f8f6f3', color: '#1f1b18', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, maxWidth: 1120, margin: '0 auto 32px' },
  eyebrow: { margin: '0 0 8px', color: '#b74516', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em' },
  title: { margin: 0, fontSize: 'clamp(34px, 6vw, 64px)', lineHeight: 0.98, letterSpacing: '-0.045em' },
  subtitle: { maxWidth: 620, margin: '18px 0 0', color: '#6f655e', fontSize: 16, lineHeight: 1.6 },
  secondaryButton: { minHeight: 44, padding: '0 18px', border: '1px solid #d7cec7', borderRadius: 999, background: 'rgba(255,255,255,.75)', color: '#2b2521', fontWeight: 700, cursor: 'pointer' },
  error: { maxWidth: 1120, margin: '0 auto 24px', padding: 16, borderRadius: 14, color: '#7f1d1d', background: '#fee2e2' },
  notice: { maxWidth: 1120, margin: '0 auto 24px', padding: 16, borderRadius: 14, color: '#6b3a16', background: '#fff1df' },
  publicationPanel: { maxWidth: 1120, margin: '0 auto 24px', padding: 'clamp(22px, 4vw, 34px)', borderRadius: 26, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 28, alignItems: 'center', background: 'linear-gradient(145deg, #fffaf6, #f8e8db)', border: '1px solid rgba(192,85,31,.25)', boxShadow: '0 20px 60px rgba(80,45,25,.08)' },
  publicationCopy: { minWidth: 0 },
  publicationDetail: { margin: '10px 0 0', color: '#514943', fontSize: 16, lineHeight: 1.55 },
  publicationHint: { margin: '12px 0 0', color: '#756961', fontSize: 13, lineHeight: 1.5 },
  publicationActions: { display: 'grid', gap: 16 },
  confirmationLabel: { display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12, alignItems: 'start', color: '#403933', fontSize: 14, lineHeight: 1.5, cursor: 'pointer' },
  confirmationCheckbox: { width: 20, height: 20, margin: 0, accentColor: '#c14d19' },
  publishButton: { minHeight: 52, padding: '0 24px', border: 0, borderRadius: 999, color: '#fff', background: '#c14d19', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 12px 30px rgba(193,77,25,.24)' },
  disabledButton: { opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' },
  previewLink: { display: 'inline-flex', marginTop: 18, color: '#a93f12', fontWeight: 800, textDecoration: 'none' },
  previewUnavailable: { display: 'inline-block', marginTop: 18, color: '#8a5b44', fontSize: 13, fontWeight: 700 },
  collectionGrid: { maxWidth: 1120, margin: '0 auto 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
  collectionCard: { minHeight: 180, padding: 28, borderRadius: 24, display: 'flex', flexDirection: 'column', textDecoration: 'none', color: '#1f1b18', background: 'linear-gradient(145deg, rgba(255,255,255,.94), rgba(247,230,217,.82))', border: '1px solid rgba(192,85,31,.2)', boxShadow: '0 18px 50px rgba(70,45,31,.08)' },
  collectionLabel: { color: '#7f6d62', fontSize: 14, fontWeight: 700 },
  collectionCount: { marginTop: 10, fontSize: 52, lineHeight: 1 },
  collectionAction: { marginTop: 'auto', color: '#c14d19', fontSize: 14, fontWeight: 800 },
  panel: { maxWidth: 1120, margin: '0 auto 24px', padding: 'clamp(20px, 4vw, 32px)', borderRadius: 24, background: 'rgba(255,255,255,.82)', border: '1px solid #e5ddd7', boxShadow: '0 18px 50px rgba(70,45,31,.06)' },
  panelHeader: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 22 },
  panelTitle: { margin: 0, fontSize: 24, letterSpacing: '-0.025em' },
  total: { color: '#766b64', fontSize: 14, fontWeight: 700 },
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
