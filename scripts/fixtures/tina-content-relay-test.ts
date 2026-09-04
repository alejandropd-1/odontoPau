import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { gzipSync } from 'node:zlib';
import { test } from 'node:test';
import { createContentRelay, RELAY_REQUEST_LIMIT, tinaContentDestination } from './tina-content-relay';

const clientId = '00000000-0000-4000-8000-000000000001';
const origin = 'http://localhost:3199';
const config = { clientId, origin };
// Synthetic tokens only. This fixture never accepts a real Tina credential.
const session = 'Bearer fixture-project-one';
const operations = {
  schema: { query: 'query IntrospectionQuery { __schema { queryType { name } } }', variables: {} },
  catalog: { query: 'query { articuloConnection { totalCount } }', variables: {} },
  save: { query: 'mutation($params: Fixture!) { updateDocument(params:$params) { id } }', variables: { params: { title: 'Fixture' } } },
};
function request(payload: unknown = operations.catalog, headers: Record<string, string> = {}, method = 'POST') {
  return new Request(`${origin}/api/editorial/content`, {
    method, headers: { origin, 'content-type': 'application/json', authorization: session, ...headers },
    ...(method === 'POST' ? { body: JSON.stringify(payload) } : {}),
  });
}

test('local gzip fixture preserves schema, catalog, mutation; fixed destination and minimal headers', async () => {
  let mode = 'healthy';
  let saves = 0;
  const received: unknown[] = [];
  const server = createServer(async (req, res) => {
    if (req.headers.authorization !== session) { res.writeHead(403); res.end('private'); return; }
    assert.equal(req.headers['accept-encoding'], 'gzip');
    let text = '';
    for await (const chunk of req) text += chunk;
    const payload = JSON.parse(text);
    received.push(payload);
    if (payload.query.startsWith('mutation')) saves++;
    if (mode === 'lost') { res.destroy(); return; }
    if (mode === 'auth') { res.writeHead(401); res.end('secret fixture error'); return; }
    const data = payload.query.includes('__schema') ? { __schema: { queryType: { name: 'Query' } } } :
      payload.query.startsWith('mutation') ? { updateDocument: { id: 'fixture' } } : { articuloConnection: { totalCount: 1 } };
    const bytes = mode === 'corrupt' ? Buffer.from('not-gzip') : gzipSync(JSON.stringify({ data }));
    res.writeHead(200, { 'Content-Encoding': 'gzip', 'Content-Length': bytes.length, 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(bytes);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const transport: typeof fetch = async (url, init) => {
    assert.equal(url, tinaContentDestination(clientId));
    assert.deepEqual(Object.keys(init?.headers ?? {}).sort(), ['Accept-Encoding', 'Authorization', 'Content-Type']);
    assert.equal(init?.redirect, 'error');
    return fetch(`http://127.0.0.1:${address.port}`, init);
  };
  const relay = createContentRelay(config, transport);
  try {
    for (const operation of Object.values(operations)) {
      const response = await relay(request(operation, { cookie: 'not-forwarded', 'x-api-key': 'not-forwarded', 'x-tina-area': 'not-forwarded' }));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-encoding'), null);
      assert.equal(response.headers.get('content-length'), null);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.ok((await response.json()).data);
    }
    assert.deepEqual(received, Object.values(operations));
    assert.equal((await relay(request(undefined, { authorization: 'Bearer other-project' }))).status, 403);
    mode = 'auth';
    assert.equal((await relay(request())).status, 401);
    mode = 'corrupt';
    assert.equal((await relay(request())).status, 502);
    mode = 'lost';
    assert.equal((await relay(request(operations.save))).status, 502);
    assert.equal(saves, 2, 'each explicit save sent once, including lost response; no fallback');
  } finally { server.closeAllConnections(); server.close(); }
});

test('reject method, origin, token, size, batch, arbitrary destination and malformed body before upstream', async () => {
  let calls = 0;
  const relay = createContentRelay(config, async () => { calls++; throw new Error('must not reach upstream'); });
  for (const [input, status] of [
    [request(undefined, {}, 'GET'), 405], [request(undefined, { origin: 'https://evil.example' }), 403],
    [request(undefined, { authorization: '' }), 401], [request(undefined, { 'content-type': 'text/plain' }), 415],
    [request(undefined, { 'content-length': String(RELAY_REQUEST_LIMIT + 1) }), 413],
    [request([operations.catalog]), 400], [request({ ...operations.catalog, url: 'https://evil.example' }), 400],
    [request({ query: '' }), 400], [request({ query: 'x', variables: 'not-object' }), 400],
    [request({ query: 'x'.repeat(RELAY_REQUEST_LIMIT + 1) }), 413],
  ] as const) assert.equal((await relay(input)).status, status);
  assert.equal(calls, 0);
  assert.throws(() => tinaContentDestination('https://evil.example'));
});

test('upstream errors, JSON errors, permission and timeouts expose no sensitive payloads', async () => {
  for (const [upstream, status, code] of [
    [Response.json({ errors: [{ message: 'token-private', extensions: { code: 'FORBIDDEN' } }] }), 403, 'EDITORIAL_PERMISSION'],
    [Response.json({ errors: [{ message: 'patient-private' }] }), 200, 'EDITORIAL_GRAPHQL'],
    [new Response('secret', { status: 503 }), 502, 'EDITORIAL_UNAVAILABLE'],
    [new Response('<html>private</html>'), 502, 'EDITORIAL_UNAVAILABLE'],
    [Response.json({ unrelated: true }), 502, 'EDITORIAL_RESPONSE'],
  ] as const) {
    const response = await createContentRelay(config, async () => upstream)(request());
    assert.equal(response.status, status);
    const body = await response.text();
    assert.ok(body.includes(code));
    assert.doesNotMatch(body, /private|secret|patient/);
  }
  const hanging = createContentRelay(config, () => new Promise(() => {}), 20);
  const response = await hanging(request());
  assert.equal(response.status, 504);
  assert.ok((await response.text()).includes('EDITORIAL_TIMEOUT'));
});
