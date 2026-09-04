import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Client, TinaCloudAuthProvider } from 'tinacms';
import { createTinaBaseRelay, tinaEventsDestination, TINA_RELAY_BASE } from './tina-base-relay';
import { tinaContentDestination } from './tina-content-relay';

const clientId = '00000000-0000-4000-8000-000000000001';
const origin = 'http://127.0.0.1:3199';
const expectedPath = TINA_RELAY_BASE + new URL(tinaContentDestination(clientId)).pathname;
const headers = { origin, Authorization: 'Bearer synthetic-session', 'Content-Type': 'application/json' };

test('base relay accepts only the configured encoded path and never forwards other paths', async () => {
  let calls = 0;
  const relay = createTinaBaseRelay({ origin, clientId }, async (url) => {
    calls++;
    assert.equal(url, tinaContentDestination(clientId));
    return Response.json({ data: { ok: true } });
  });
  const request = (path: string) => new Request(origin + path, { method: 'POST', headers, body: '{"query":"{ok}"}' });
  assert.equal((await relay(request(expectedPath))).status, 200);
  for (const path of [expectedPath + '?branch=main', expectedPath + '/extra',
    expectedPath.replace('editorial%2Ftina', 'main'), expectedPath.replace('%2F', '%252F'),
    expectedPath.replace('%2F', '/'), expectedPath.replace(clientId, 'other'),
    TINA_RELAY_BASE + '/github/' + clientId + '/list_branches']) {
    assert.equal((await relay(request(path))).status, 404, path);
  }
  assert.equal(calls, 1);
});

test('base relay forwards only the fixed authenticated events read with bounded parameters', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const relay = createTinaBaseRelay({ origin, clientId }, async (url, init) => {
    calls.push({ url: String(url), init });
    return Response.json({ events: [{ message: 'Indexed', timestamp: 123, id: 'evt-1',
      isError: false, isGlobal: false }], cursor: 'next/value' }, {
      headers: { 'Content-Encoding': 'gzip', 'Content-Length': '999' },
    });
  });
  const eventsPath = TINA_RELAY_BASE + '/events/' + clientId + '/editorial%2Ftina';
  const response = await relay(new Request(origin + eventsPath + '?limit=15&cursor=previous%2Fvalue', {
    method: 'GET', headers: { origin, Authorization: 'Bearer synthetic-session' },
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { events: [{ message: 'Indexed', timestamp: 123, id: 'evt-1',
    isError: false, isGlobal: false }], cursor: 'next/value' });
  assert.equal(response.headers.get('content-encoding'), null);
  assert.equal(response.headers.get('content-length'), null);
  assert.equal(calls[0]?.url, tinaEventsDestination(clientId, 15, 'previous/value'));
  assert.deepEqual(calls[0]?.init?.headers, {
    Authorization: 'Bearer synthetic-session', 'Accept-Encoding': 'gzip',
  });

  for (const suffix of ['?limit=0', '?limit=16', '?limit=1&extra=true', '?limit=1&limit=2',
    '?cursor=x', '?limit=1&cursor=', '?limit=1&cursor=x%0Ay']) {
    assert.equal((await relay(new Request(origin + eventsPath + suffix, {
      method: 'GET', headers: { origin, Authorization: 'Bearer synthetic-session' },
    }))).status, 400, suffix);
  }
  assert.equal((await relay(new Request(origin + eventsPath + '?limit=1', {
    method: 'POST', headers, body: '{"query":"{ok}"}',
  }))).status, 405);
  assert.equal(calls.length, 1);
});

test('base override retains cloud provider and SDK synchronization maps to the admitted events path', async () => {
  const client = new Client({ clientId, branch: 'editorial/tina', tinaGraphQLVersion: '2.4',
    tinaioConfig: { contentApiUrlOverride: TINA_RELAY_BASE }, tokenStorage: 'CUSTOM',
    getTokenFn: async () => ({ id_token: 'synthetic-session', access_token: '', refresh_token: '' }),
  });
  assert.ok(client.authProvider instanceof TinaCloudAuthProvider);
  assert.equal(client.isCustomContentApi, false);
  assert.equal(client.contentApiUrl, expectedPath);
  assert.equal(client.identityApiUrl, 'https://identity.tinajs.io');
  const requests: Array<{ url: string; method: string }> = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), method: init?.method || 'GET' });
    return Response.json({ events: [] });
  };
  try { await client.fetchEvents(); } finally { globalThis.fetch = original; }
  assert.deepEqual(requests, [{ url: TINA_RELAY_BASE + '/events/' + clientId + '/editorial%2Ftina?limit=1', method: 'GET' }]);
  const relayed: Array<{ url: string; method?: string }> = [];
  const relay = createTinaBaseRelay({ origin, clientId }, async (url, init) => {
    relayed.push({ url: String(url), method: init?.method });
    return Response.json({ events: [] });
  });
  const response = await relay(new Request(origin + requests[0].url, {
    method: 'GET', headers: { origin, Authorization: 'Bearer synthetic-session' },
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { events: [] });
  assert.deepEqual(relayed, [{ url: tinaEventsDestination(clientId, 1), method: 'GET' }]);
});
