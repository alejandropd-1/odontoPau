import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = fs.readFileSync('.github/workflows/editorial-publication.yml', 'utf8');
const qualityWorkflow = fs.readFileSync('.github/workflows/quality-gates.yml', 'utf8');
const dashboard = fs.readFileSync('tina/dashboard/EditorialDashboard.tsx', 'utf8');
const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
const packageJson = fs.readFileSync('package.json', 'utf8');

assert.match(workflow, /branches:\s*\n\s*- editorial\/tina/);
assert.match(workflow, /paths:\s*\n\s*- src\/data\/editorial\/publication-request\.json/);
assert.match(workflow, /cancel-in-progress: false/);
assert.match(workflow, /actions: write/);
assert.match(workflow, /editorial-publication\.ts preflight/);
assert.match(workflow, /gh workflow run quality-gates\.yml --ref editorial\/tina/);
assert.match(workflow, /check_count/);
assert.match(workflow, /gh pr merge/);
assert.match(workflow, /\[skip netlify\] Publicación editorial/);
assert.match(workflow, /wait-for-production-marker\.mjs/);
assert.match(workflow, /mark-progress \\\n\s*deploying/);
assert.match(workflow, /waiting_index/);
assert.match(workflow, /deploy_not_confirmed/);
assert.match(workflow, /test "\$\(git rev-parse origin\/editorial\/tina\)" = "\$\{GITHUB_SHA\}"/);
assert.match(workflow, /git add -- src\/data\/editorial\/publication-request\.json/);
assert.doesNotMatch(workflow, /git add \.|git add -A|force|TINA_TOKEN|NETLIFY_AUTH_TOKEN/);

const pullRequestCheckCommands = workflow
  .split('\n')
  .filter((line) => line.includes('gh pr checks'));
assert.ok(pullRequestCheckCommands.length > 0);
for (const command of pullRequestCheckCommands) {
  assert.match(command, /--required/, `El workflow no debe esperarse a sí mismo: ${command.trim()}`);
}

assert.match(qualityWorkflow, /workflow_dispatch:/);
assert.match(qualityWorkflow, /test:netlify-ignore-build/);

assert.match(dashboard, /Guardar actualiza la vista previa/);
assert.match(dashboard, /Publicar cambios/);
assert.match(dashboard, /todos los cambios que revisaste/);
assert.match(dashboard, /publicationConfirmed/);
assert.match(dashboard, /NEXT_PUBLIC_EDITORIAL_PREVIEW_URL/);
assert.match(dashboard, /role="alert"/);
assert.match(dashboard, /aria-live="polite"/);
assert.match(dashboard, /window\.setInterval/);
assert.match(dashboard, /document\.visibilityState/);
assert.match(dashboard, /Información para pedir ayuda/);
assert.match(dashboard, /localReviewEnabled = process\.env\.NODE_ENV !== 'production'/);
assert.match(dashboard, /Esta prueba no guarda, no publica y no llama a Netlify/);
assert.match(dashboard, /publicationInteractionEnabled = publicationEnabled && !localReviewEnabled/);

assert.match(netlifyConfig, /ignore = "node \.\/scripts\/netlify-ignore-build\.mjs"/);
assert.match(netlifyConfig, /for = "\/deployment\.json"/);
assert.match(packageJson, /write-deployment-marker\.mjs/);

console.log('--- Editorial publication workflow ---');
console.log('- Disparo cerrado, snapshot inmutable, PR protegido y staging sincronizado: presentes.');
console.log('- Sin force-push, staging amplio, secretos de Tina o credenciales de Netlify.');
