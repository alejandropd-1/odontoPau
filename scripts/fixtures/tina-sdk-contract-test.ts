import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { Client, TinaCloudAuthProvider } from 'tinacms';
import { createContentRelay, tinaContentDestination } from './tina-content-relay';

// Use the GraphQL implementation installed with the SDK, not a second dependency.
const projectRequire = createRequire(resolve('package.json'));
const sdkRequire = createRequire(projectRequire.resolve('tinacms'));
const { buildSchema, graphqlSync, getIntrospectionQuery } = sdkRequire('graphql');
const sdl = 'type Query { articuloConnection: Fixture! } type Fixture { totalCount: Int! } type Mutation { updateDocument: String! }';
const fixtureSchema = buildSchema(sdl);
const introspection = graphqlSync(fixtureSchema, getIntrospectionQuery());

test('installed Tina Client retains cloud auth, schema, reads and mutations through relay', async () => {
  const clientId = '00000000-0000-4000-8000-000000000001';
  const origin = 'http://localhost:3199';
  const received: Array<{ query: string; variables: unknown }> = [];
  const relay = createContentRelay({ clientId, origin }, async (url, init) => {
    assert.equal(url, tinaContentDestination(clientId));
    assert.deepEqual(init?.headers, {
      'Content-Type': 'application/json', Authorization: 'Bearer synthetic-tina-session', 'Accept-Encoding': 'gzip',
    });
    const body = JSON.parse(String(init?.body));
    received.push(body);
    return Response.json(body.query.includes('__schema') ? introspection :
      body.query.includes('mutation') ? { data: { updateDocument: 'saved fixture' } } : { data: { articuloConnection: { totalCount: 1 } } });
  });
  const client = new Client({
    clientId, branch: 'editorial/tina', tinaGraphQLVersion: '2.4', customContentApiUrl: '/api/editorial/content', tokenStorage: 'CUSTOM',
    getTokenFn: async () => ({ id_token: 'synthetic-tina-session', access_token: '', refresh_token: '' }),
  });
  assert.ok(client.authProvider instanceof TinaCloudAuthProvider);
  assert.equal(client.contentApiUrl, '/api/editorial/content');
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    assert.equal(url, '/api/editorial/content');
    assert.equal(init?.method, 'POST');
    assert.deepEqual(Object.keys(init?.headers ?? {}).sort(), ['Authorization', 'Content-Type']);
    return relay(new Request(new URL(String(url), origin), { ...init, headers: { ...init?.headers, origin } }));
  };
  try {
    assert.ok(await client.getSchema());
    assert.deepEqual(await client.request('query { articuloConnection { totalCount } }', { variables: {} }), { articuloConnection: { totalCount: 1 } });
    assert.deepEqual(await client.request('mutation { updateDocument }', { variables: {} }), { updateDocument: 'saved fixture' });
    assert.equal(received.length, 3);
  } finally { globalThis.fetch = previousFetch; }
});

test('full URL override changes SDK mode; base URL alternative needs a new browser viability gate', () => {
  const settings = { clientId: 'fixture', branch: 'editorial/tina', tinaGraphQLVersion: '2.4' };
  const fullOverride = new Client({ ...settings, customContentApiUrl: '/api/editorial/content' });
  const baseOverride = new Client({ ...settings, tinaioConfig: { contentApiUrlOverride: '/api/editorial/tina' } });
  assert.equal(fullOverride.isCustomContentApi, true);
  assert.equal(baseOverride.isCustomContentApi, false);
  assert.ok(baseOverride.authProvider instanceof TinaCloudAuthProvider);
  assert.equal(baseOverride.contentApiUrl, '/api/editorial/tina/2.4/content/fixture/github/editorial%2Ftina');
  // This is not proof of the AuthWall UX: the next design must validate the full admin in a browser.
});
