import fs from 'node:fs';
import path from 'node:path';

import type { EditorialProductionCollection, EditorialProductionEntry } from './publication';
import { createEditorialProductionEntry, sortEditorialProductionIndex } from './production-index';

const productionRoots: Array<{ collection: EditorialProductionCollection; directory: string }> = [
  { collection: 'articulo', directory: 'src/data/articulos' },
  { collection: 'instruccion', directory: 'src/data/instrucciones' },
];

function collectJsonFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectJsonFiles(target);
    return entry.isFile() && entry.name.endsWith('.json') ? [target] : [];
  });
}

export function buildEditorialProductionIndex(root = process.cwd()): EditorialProductionEntry[] {
  const entries = productionRoots.flatMap(({ collection, directory }) => {
    const absoluteRoot = path.join(root, directory);
    return collectJsonFiles(absoluteRoot).map((filePath) => {
      const document = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
      const relativePath = path.relative(absoluteRoot, filePath).replace(/\\/g, '/');
      return createEditorialProductionEntry(collection, relativePath, document);
    });
  });

  return sortEditorialProductionIndex(entries);
}
