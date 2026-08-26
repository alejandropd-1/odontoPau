import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function currentCommit() {
  if (process.env.COMMIT_REF) return process.env.COMMIT_REF;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
}

const markerPath = path.join(process.cwd(), 'public', 'deployment.json');
fs.mkdirSync(path.dirname(markerPath), { recursive: true });
fs.writeFileSync(
  markerPath,
  `${JSON.stringify(
    {
      commit: currentCommit(),
      generatedAt: new Date().toISOString(),
      context: process.env.CONTEXT ?? 'local',
    },
    null,
    2
  )}\n`,
  'utf8'
);
