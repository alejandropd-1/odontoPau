/** Isolated transport experiment; NOT imported by the application or exposed as a route. */
export const TINA_CONTENT_VERSION = '2.4';
export const TINA_CONTENT_BRANCH = 'editorial/tina';
export const RELAY_TIMEOUT_MS = 12_000;
export const RELAY_REQUEST_LIMIT = 512 * 1024;
export const RELAY_RESPONSE_LIMIT = 8 * 1024 * 1024;

export interface ContentRelayConfig {
  clientId: string;
  origin: string;
}

export function tinaContentDestination(clientId: string): string {
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(clientId)) {
    throw new Error('EDITORIAL_CONFIG');
  }
  return `https://content.tinajs.io/${TINA_CONTENT_VERSION}/content/${clientId}/github/${encodeURIComponent(TINA_CONTENT_BRANCH)}`;
}

function failure(status: number, code: string): Response {
  return Response.json({ message: code, errors: [{ message: code }] }, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

async function boundedText(body: ReadableStream<Uint8Array> | null, limit: number): Promise<string> {
  if (!body) throw new Error('EDITORIAL_FORMAT');
  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let result = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) throw new Error('EDITORIAL_SIZE');
      result += decoder.decode(value, { stream: true });
    }
    return result + decoder.decode();
  } finally {
    void reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Injectable transport is used by isolated fixtures, never selected by request input. */
export function createContentRelay(config: ContentRelayConfig, transport: typeof fetch = fetch,
  timeoutMs = RELAY_TIMEOUT_MS) {
  const destination = tinaContentDestination(config.clientId);
  const origin = new URL(config.origin).origin;
  // Per-instance backpressure, not a distributed rate-limit or authentication substitute.
  let inFlight = 0;
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') return failure(405, 'EDITORIAL_METHOD');
    if (request.headers.get('origin') !== origin || new URL(request.url).origin !== origin ||
      request.headers.get('sec-fetch-site') === 'cross-site') return failure(403, 'EDITORIAL_ORIGIN');
    if (new URL(request.url).search) return failure(400, 'EDITORIAL_FORMAT');
    const authorization = request.headers.get('authorization');
    if (!authorization || !/^Bearer [A-Za-z0-9._~-]+$/.test(authorization) || authorization.length > 16_384) {
      return failure(401, 'EDITORIAL_SESSION');
    }
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
      return failure(415, 'EDITORIAL_FORMAT');
    }
    if (Number(request.headers.get('content-length')) > RELAY_REQUEST_LIMIT) return failure(413, 'EDITORIAL_SIZE');
    if (inFlight >= 8) return failure(429, 'EDITORIAL_BUSY');
    inFlight++;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const expired = new Promise<Response>((resolve) => {
      timer = setTimeout(() => {
        controller.abort();
        void request.body?.cancel().catch(() => undefined);
        resolve(failure(504, 'EDITORIAL_TIMEOUT'));
      }, timeoutMs);
    });
    const execute = async (): Promise<Response> => {
      let payload: unknown;
      try {
        payload = JSON.parse(await boundedText(request.body, RELAY_REQUEST_LIMIT));
      } catch (error) {
        return failure(error instanceof Error && error.message === 'EDITORIAL_SIZE' ? 413 : 400, 'EDITORIAL_FORMAT');
      }
      if (!object(payload) || typeof payload.query !== 'string' || !payload.query.trim() ||
        (payload.variables !== undefined && payload.variables !== null && !object(payload.variables)) ||
        (payload.operationName !== undefined && typeof payload.operationName !== 'string') ||
        Object.keys(payload).some((key) => !['query', 'variables', 'operationName'].includes(key))) {
        return failure(400, 'EDITORIAL_FORMAT');
      }
      if (controller.signal.aborted) return failure(504, 'EDITORIAL_TIMEOUT');
      try {
        const upstream = await transport(destination, {
          method: 'POST',
          // No cookies, API keys, server tokens, client-supplied destinations or arbitrary headers.
          headers: { 'Content-Type': 'application/json', Authorization: authorization, 'Accept-Encoding': 'gzip' },
          body: JSON.stringify(payload), signal: controller.signal, redirect: 'error', cache: 'no-store',
        });
        if (controller.signal.aborted) return failure(504, 'EDITORIAL_TIMEOUT');
        if (upstream.status !== 200) {
          void upstream.body?.cancel().catch(() => undefined);
          if (upstream.status === 401) return failure(401, 'EDITORIAL_SESSION');
          if (upstream.status === 403) return failure(403, 'EDITORIAL_PERMISSION');
          if (upstream.status === 429) return failure(429, 'EDITORIAL_BUSY');
          return failure(502, 'EDITORIAL_UNAVAILABLE');
        }
        // Node fetch decompresses. Never reuse the upstream Content-Encoding or Content-Length.
        const result: unknown = JSON.parse(await boundedText(upstream.body, RELAY_RESPONSE_LIMIT));
        if (!object(result) || (!object(result.data) && result.data !== null && !Array.isArray(result.errors))) {
          return failure(502, 'EDITORIAL_RESPONSE');
        }
        if (result.errors !== undefined && (!Array.isArray(result.errors) || result.errors.length === 0)) {
          return failure(502, 'EDITORIAL_RESPONSE');
        }
        if (Array.isArray(result.errors)) {
          // Error payloads can echo variables. Do not relay them as diagnostics or display text.
          const codes = result.errors.map((error: unknown) => object(error) && object(error.extensions) ? error.extensions.code : undefined);
          if (codes.includes('UNAUTHENTICATED')) return failure(401, 'EDITORIAL_SESSION');
          if (codes.includes('FORBIDDEN')) return failure(403, 'EDITORIAL_PERMISSION');
          return failure(200, 'EDITORIAL_GRAPHQL');
        }
        return Response.json({ data: result.data }, {
          headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
        });
      } catch {
        return failure(controller.signal.aborted ? 504 : 502,
          controller.signal.aborted ? 'EDITORIAL_TIMEOUT' : 'EDITORIAL_UNAVAILABLE');
      }
    };
    try {
      return await Promise.race([execute(), expired]);
    } finally {
      clearTimeout(timer);
      inFlight--;
    }
  };
}
