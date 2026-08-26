import assert from 'node:assert/strict';

import { shouldIgnoreBuild } from './netlify-ignore-build.mjs';

assert.equal(shouldIgnoreBuild(['src/data/editorial/publication-request.json']), true);
assert.equal(shouldIgnoreBuild(['src/data/home.json']), false);
assert.equal(
  shouldIgnoreBuild(['src/data/editorial/publication-request.json', 'src/data/articulos/estetica/caso.json']),
  false
);
assert.equal(shouldIgnoreBuild([]), true);

console.log('--- Netlify editorial build filter ---');
console.log('- Sólo los commits operativos conocidos omiten el build.');
console.log('- Una sincronización entre commits con el mismo contenido tampoco repite el build.');
console.log('- Todo cambio de contenido o condición desconocida conserva el build.');
