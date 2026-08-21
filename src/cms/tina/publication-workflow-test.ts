import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync('.github/workflows/editorial-publication.yml', 'utf8');
const dashboard = fs.readFileSync('tina/dashboard/EditorialDashboard.tsx', 'utf8');

assert.match(workflow, /branches:\s*\n\s*- editorial\/tina/);
assert.match(workflow, /paths:\s*\n\s*- src\/data\/editorial\/publication-request\.json/);
assert.match(workflow, /cancel-in-progress: false/);
assert.match(workflow, /editorial-publication\.ts preflight/);
assert.match(workflow, /gh pr checks/);
assert.match(workflow, /check_count/);
assert.match(workflow, /gh pr merge/);
assert.match(workflow, /test "\$\(git rev-parse origin\/editorial\/tina\)" = "\$\{GITHUB_SHA\}"/);
assert.match(workflow, /git add -- src\/data\/editorial\/publication-request\.json/);
assert.doesNotMatch(workflow, /git add \.|git add -A|force|TINA_TOKEN|NETLIFY_AUTH_TOKEN/);

assert.match(dashboard, /Guardar actualiza Preview/);
assert.match(dashboard, /Publicar cambios/);
assert.match(dashboard, /snapshot completo/);
assert.match(dashboard, /publicationConfirmed/);
assert.match(dashboard, /NEXT_PUBLIC_EDITORIAL_PREVIEW_URL/);
assert.match(dashboard, /role="alert"/);
assert.match(dashboard, /aria-live="polite"/);

console.log('--- Editorial publication workflow ---');
console.log('- Disparo cerrado, snapshot inmutable, PR protegido y staging sincronizado: presentes.');
console.log('- Sin force-push, staging amplio, secretos de Tina o credenciales de Netlify.');
