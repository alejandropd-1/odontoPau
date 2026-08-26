import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const operationalPaths = new Set(['src/data/editorial/publication-request.json']);

export function shouldIgnoreBuild(changedPaths) {
  return changedPaths.every((filePath) => operationalPaths.has(filePath.replaceAll('\\', '/')));
}

function changedPathsBetween(base, head) {
  const output = execFileSync('git', ['diff', '--name-only', '--diff-filter=ACDMRTUXB', base, head], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = process.env.CACHED_COMMIT_REF;
  const head = process.env.COMMIT_REF;

  if (!base || !head || base === head) {
    process.exitCode = 1;
  } else {
    try {
      const changedPaths = changedPathsBetween(base, head);
      process.exitCode = shouldIgnoreBuild(changedPaths) ? 0 : 1;
    } catch {
      // Ante una condición no reconocida se construye el sitio: nunca se omite por error.
      process.exitCode = 1;
    }
  }
}
