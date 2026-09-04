// Loopback-only browser fixture. Serves the actual generated admin and synthetic responses.
// No outbound fetch and no content writes. Never run as a public server.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createRequire } from 'node:module';
import { injectEditorialSupportHtml } from './fixtures/tina-admin-support-html.mjs';

const require = createRequire(import.meta.url);
const sdkRequire = createRequire(require.resolve('tinacms'));
const { buildASTSchema, graphqlSync, getIntrospectionQuery } = sdkRequire('graphql');
const schema = buildASTSchema(JSON.parse(await readFile('tina/__generated__/_graphql.json', 'utf8')));
const introspection = graphqlSync(schema, getIntrospectionQuery());
const root = resolve('public/admin');
const port = 3199;
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
    if (url.pathname === '/lab-schema.json') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(introspection)); return;
    }
    if (!url.pathname.startsWith('/admin/')) { res.writeHead(404); res.end(); return; }
    const file = resolve(root, decodeURIComponent(url.pathname.slice('/admin/'.length)) || 'index.html');
    if (!file.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    const rawBody = await readFile(file);
    const body = extname(file) === '.html'
      ? Buffer.from(injectEditorialSupportHtml(rawBody.toString('utf8')))
      : rawBody;
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
server.listen(port, '127.0.0.1', () => console.log(`Isolated admin fixture: http://127.0.0.1:${port}/admin/index.html`));
