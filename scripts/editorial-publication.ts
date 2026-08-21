import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import {
  PUBLICATION_REQUEST_PATH,
  createPublicationResult,
  validatePublicationRequest,
  type PublicationRequest,
} from '../src/cms/tina/publication';
import { evaluatePublicationPreflight } from '../src/cms/tina/publication-preflight';

function git(args: string[], allowFailure = false): string {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    if (allowFailure) return '';
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`No se pudo ejecutar git ${args.join(' ')}: ${detail}`);
  }
}

function gitSucceeds(args: string[]): boolean {
  try {
    execFileSync('git', args, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function loadRequest(): PublicationRequest {
  const request = JSON.parse(fs.readFileSync(path.join(process.cwd(), PUBLICATION_REQUEST_PATH), 'utf8')) as unknown;
  validatePublicationRequest(request);
  return request;
}

function listChangedPaths(base: string, head: string): string[] {
  const output = git(['diff', '--name-only', '--diff-filter=ACDMRTUXB', `${base}...${head}`]);
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function containsPublicReference(publicPath: string): boolean {
  const publicUrl = `/${publicPath.replace(/^public\//, '').replace(/\\/g, '/')}`;
  const roots = ['src/data/home.json', 'src/data/tratamientos-page.json', 'src/data/articulos', 'src/data/instrucciones', 'src/data/tratamientos'];

  function inspect(target: string): boolean {
    const absolute = path.join(process.cwd(), target);
    if (!fs.existsSync(absolute)) return false;
    const stat = fs.statSync(absolute);
    if (stat.isFile()) return fs.readFileSync(absolute, 'utf8').includes(publicUrl);
    return fs
      .readdirSync(absolute, { withFileTypes: true })
      .some((entry) => inspect(path.join(target, entry.name)));
  }

  return roots.some(inspect);
}

function assertChangedMediaReferenced(changedPaths: string[]): void {
  for (const filePath of changedPaths.filter((candidate) => /^public\/(?:images|videos)\//.test(candidate))) {
    const exists = fs.existsSync(path.join(process.cwd(), filePath));
    const referenced = containsPublicReference(filePath);
    if (exists && !referenced) {
      throw new Error(`El medio ${filePath} no está referenciado por ningún documento editorial.`);
    }
    if (!exists && referenced) {
      throw new Error(`El medio eliminado ${filePath} todavía está referenciado por contenido editorial.`);
    }
  }
}

function runPreflight(base: string, head: string, remoteEditorialRef: string): void {
  const request = loadRequest();
  const changedPaths = listChangedPaths(base, head);
  const mainIsAncestor = gitSucceeds(['merge-base', '--is-ancestor', base, head]);
  const editorialHeadMatchesRequest = git(['rev-parse', head]) === git(['rev-parse', remoteEditorialRef]);
  const result = evaluatePublicationPreflight({
    request,
    changedPaths,
    mainIsAncestor,
    editorialHeadMatchesRequest,
  });

  if (!result.ok) {
    throw new Error(result.errors.join('\n'));
  }
  assertChangedMediaReferenced(changedPaths);

  console.log('--- Editorial publication preflight ---');
  console.log(`- Request: ${result.requestId}`);
  console.log(`- Clasificación: ${result.kind}`);
  console.log(`- Rutas revisadas: ${result.changedPaths.length}`);
  console.log('- Convergencia, allowlist y medios: válidos.');
}

function writeResult(status: 'published' | 'failed', requestId: string, productionCommit: string | undefined, summary: string): void {
  const current = loadRequest();
  if (current.requestId !== requestId) {
    throw new Error('La solicitud vigente cambió; no se sobrescribirá con el resultado de otra ejecución.');
  }
  const next = createPublicationResult(current, status, new Date().toISOString(), {
    productionCommit: status === 'published' ? productionCommit : undefined,
    summary,
  });
  fs.writeFileSync(
    path.join(process.cwd(), PUBLICATION_REQUEST_PATH),
    `${JSON.stringify(next, null, 2)}\n`,
    'utf8'
  );
}

const [command, ...args] = process.argv.slice(2);

if (command === 'preflight') {
  const [base = 'origin/main', head = 'HEAD', remoteEditorialRef = 'origin/editorial/tina'] = args;
  runPreflight(base, head, remoteEditorialRef);
} else if (command === 'mark-result') {
  const [status, requestId, productionCommit, ...summaryParts] = args;
  if (status !== 'published' && status !== 'failed') {
    throw new Error('mark-result requiere status published o failed.');
  }
  if (!requestId) throw new Error('mark-result requiere requestId.');
  const summary = summaryParts.join(' ').trim() || (status === 'published' ? 'Cambios publicados.' : 'La publicación se detuvo.');
  writeResult(status, requestId, productionCommit && productionCommit !== '-' ? productionCommit : undefined, summary);
} else {
  throw new Error('Uso: editorial-publication.ts preflight [base] [head] [remote] | mark-result <status> <requestId> <commit|-> <summary>');
}
