import assert from 'node:assert/strict';
import fs from 'node:fs';

for (const redirectPage of ['src/app/editorial/page.tsx', 'src/app/editorial/login/page.tsx']) {
  const source = fs.readFileSync(redirectPage, 'utf8');
  assert.match(
    source,
    /redirect\('\/admin\/index\.html#\/screens\/panel_editorial'\)/,
    `${redirectPage} debe abrir directamente el único panel Tina.`
  );
}

const middleware = fs.readFileSync('src/middleware.ts', 'utf8');
assert.match(middleware, /NextResponse\.redirect\(new URL\('\/admin\/index\.html#\/screens\/panel_editorial'/);
assert.match(middleware, /matcher: \['\/editorial\/:path\*'\]/);
assert.doesNotMatch(middleware, /editorial_session|authenticated/);

for (const removedPath of [
  'src/components/EditorialDashboard.tsx',
  'src/components/EditorialHeader.tsx',
  'src/styles/pages/_editorial-dashboard.scss',
  'src/app/api/editorial/login/route.ts',
  'src/app/api/editorial/logout/route.ts',
]) {
  assert.equal(fs.existsSync(removedPath), false, `${removedPath} ya no debe exponer el dashboard histórico.`);
}

const styleIndex = fs.readFileSync('src/styles/pages/_index.scss', 'utf8');
assert.doesNotMatch(styleIndex, /editorial-dashboard/);
const robots = fs.readFileSync('src/app/robots.ts', 'utf8');
assert.match(robots, /disallow: \['\/api\/', '\/editorial'\]/);

const sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
assert.match(sitemap, /publishedArticles\.map/);
assert.match(sitemap, /publishedInstrucciones\.map/);
assert.doesNotMatch(sitemap, /\/editorial/);

for (const detailPage of [
  'src/app/articulos/[slug]/page.tsx',
  'src/app/instrucciones/[category]/[slug]/page.tsx',
]) {
  const source = fs.readFileSync(detailPage, 'utf8');
  assert.match(source, /getRoutable/);
  assert.match(source, /notFound\(\)/);
  assert.match(source, /robots: isPublished \? \{ index: true, follow: true \} : \{ index: false, follow: false \}/);
}

console.log('--- Tina dashboard consolidation ---');
console.log('- Redirección al Panel editorial de /admin, retiro del acceso propio y exclusión de robots: válidos.');
console.log('- Sitemap publicado, metadata no indexable en Preview y 404 público: válidos.');
