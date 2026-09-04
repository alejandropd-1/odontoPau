/** Isolated base-URL experiment. This is not an application route. */
import {
  createContentRelay,
  RELAY_RESPONSE_LIMIT,
  RELAY_TIMEOUT_MS,
  tinaContentDestination,
  TINA_CONTENT_BRANCH,
  type ContentRelayConfig,
} from './tina-content-relay';

export const TINA_RELAY_BASE = '/api/editorial/tina';
const EVENTS_LIMIT_MAX = 15;

function failure(status: number, code: string): Response {
  return Response.json({ message: code }, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function boundedJson(response: Response): Promise<unknown> {
  const declaredLength = Number(response.headers.get('content-length'));
  if (declaredLength > RELAY_RESPONSE_LIMIT) throw new Error('EDITORIAL_SIZE');
  if (!response.body) throw new Error('EDITORIAL_RESPONSE');
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > RELAY_RESPONSE_LIMIT) throw new Error('EDITORIAL_SIZE');
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    void reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

function validateAuthorization(request: Request, origin: string): string | Response {
  const url = new URL(request.url);
  const requestOrigin = request.headers.get('origin');
  if (url.origin !== origin || (requestOrigin !== null && requestOrigin !== origin) ||
    request.headers.get('sec-fetch-site') === 'cross-site') {
    return failure(403, 'EDITORIAL_ORIGIN');
  }
  const authorization = request.headers.get('authorization');
  if (!authorization || !/^Bearer [A-Za-z0-9._~-]+$/.test(authorization) || authorization.length > 16_384) {
    return failure(401, 'EDITORIAL_SESSION');
  }
  return authorization;
}

function parseEventsQuery(url: URL): { limit: number; cursor?: string } | Response {
  if ([...url.searchParams.keys()].some((key) => key !== 'limit' && key !== 'cursor') ||
    url.searchParams.getAll('limit').length !== 1 || url.searchParams.getAll('cursor').length > 1) {
    return failure(400, 'EDITORIAL_FORMAT');
  }
  const rawLimit = url.searchParams.get('limit');
  if (!rawLimit || !/^\d{1,2}$/.test(rawLimit)) return failure(400, 'EDITORIAL_FORMAT');
  const limit = Number(rawLimit);
  if (limit < 1 || limit > EVENTS_LIMIT_MAX) return failure(400, 'EDITORIAL_FORMAT');
  const cursor = url.searchParams.get('cursor') ?? undefined;
  if (cursor !== undefined && (!cursor || cursor.length > 2048 || /[\u0000-\u001f\u007f]/.test(cursor))) {
    return failure(400, 'EDITORIAL_FORMAT');
  }
  return { limit, cursor };
}

export function tinaEventsDestination(clientId: string, limit: number, cursor?: string): string {
  // Reuse the UUID/configuration guard; request path values never choose this destination.
  tinaContentDestination(clientId);
  const destination = new URL(`https://content.tinajs.io/events/${clientId}/${encodeURIComponent(TINA_CONTENT_BRANCH)}`);
  destination.searchParams.set('limit', String(limit));
  if (cursor) destination.searchParams.set('cursor', cursor);
  return destination.toString();
}

function createEventsRelay(config: ContentRelayConfig, transport: typeof fetch, timeoutMs: number) {
  const origin = new URL(config.origin).origin;
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'GET') return failure(405, 'EDITORIAL_METHOD');
    if (request.body || Number(request.headers.get('content-length')) > 0) return failure(400, 'EDITORIAL_FORMAT');
    const authorization = validateAuthorization(request, origin);
    if (authorization instanceof Response) return authorization;
    const query = parseEventsQuery(new URL(request.url));
    if (query instanceof Response) return query;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const upstream = await transport(tinaEventsDestination(config.clientId, query.limit, query.cursor), {
        method: 'GET',
        headers: { Authorization: authorization, 'Accept-Encoding': 'gzip' },
        signal: controller.signal,
        redirect: 'error',
        cache: 'no-store',
      });
      if (upstream.status !== 200) {
        void upstream.body?.cancel().catch(() => undefined);
        if (upstream.status === 401) return failure(401, 'EDITORIAL_SESSION');
        if (upstream.status === 403) return failure(403, 'EDITORIAL_PERMISSION');
        if (upstream.status === 429) return failure(429, 'EDITORIAL_BUSY');
        return failure(502, 'EDITORIAL_UNAVAILABLE');
      }
      const result = await boundedJson(upstream);
      if (!object(result) || !Array.isArray(result.events) ||
        (result.cursor !== undefined && typeof result.cursor !== 'string')) {
        return failure(502, 'EDITORIAL_RESPONSE');
      }
      const events = result.events.map((event) => {
        if (!object(event) || typeof event.message !== 'string' || event.message.length > 10_000 ||
          typeof event.timestamp !== 'number' || !Number.isFinite(event.timestamp) ||
          typeof event.id !== 'string' || event.id.length > 512 ||
          typeof event.isError !== 'boolean' || typeof event.isGlobal !== 'boolean') {
          throw new Error('EDITORIAL_RESPONSE');
        }
        return { message: event.message, timestamp: event.timestamp, id: event.id,
          isError: event.isError, isGlobal: event.isGlobal };
      });
      return Response.json({ events, ...(result.cursor ? { cursor: result.cursor } : {}) }, {
        headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
      });
    } catch {
      return failure(controller.signal.aborted ? 504 : 502,
        controller.signal.aborted ? 'EDITORIAL_TIMEOUT' : 'EDITORIAL_UNAVAILABLE');
    } finally {
      clearTimeout(timer);
    }
  };
}

export function createTinaBaseRelay(config: ContentRelayConfig, transport: typeof fetch = fetch,
  timeoutMs = RELAY_TIMEOUT_MS) {
  const expectedGraphqlPath = TINA_RELAY_BASE + new URL(tinaContentDestination(config.clientId)).pathname;
  const expectedEventsPath = `${TINA_RELAY_BASE}/events/${config.clientId}/${encodeURIComponent(TINA_CONTENT_BRANCH)}`;
  const graphqlRelay = createContentRelay(config, transport, timeoutMs);
  const eventsRelay = createEventsRelay(config, transport, timeoutMs);
  return (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    // Compare encoded paths once. Never build a destination from request segments.
    if (url.pathname === expectedGraphqlPath && !url.search) return graphqlRelay(request);
    if (url.pathname === expectedEventsPath) return eventsRelay(request);
    return Promise.resolve(failure(404, 'EDITORIAL_ROUTE'));
  };
}
