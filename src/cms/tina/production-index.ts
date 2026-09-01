import {
  type EditorialProductionCollection,
  type EditorialProductionEntry,
  type EditorialPublicState,
} from './publication';
import { createEditorialFingerprint } from './editorial-fingerprint';

function publicStateFromEditorialStatus(status: unknown): EditorialPublicState {
  if (status === 'published') return 'published';
  if (status === 'retired') return 'retired';
  return 'unpublished';
}

export function createEditorialProductionEntry(
  collection: EditorialProductionCollection,
  relativePath: string,
  document: Record<string, unknown>
): EditorialProductionEntry {
  const fingerprint = createEditorialRevisionFingerprint(collection, relativePath, document);

  return {
    collection,
    relativePath: relativePath.replace(/\\/g, '/'),
    fingerprint,
    publicState: publicStateFromEditorialStatus(document.status),
  };
}

export function createEditorialRevisionFingerprint(
  collection: EditorialProductionCollection,
  relativePath: string,
  document: { status?: unknown; updatedAt?: unknown }
): string {
  if (typeof document.updatedAt !== 'string' || Number.isNaN(Date.parse(document.updatedAt))) {
    throw new Error(`El documento ${collection}:${relativePath} no tiene una fecha de actualización válida.`);
  }

  return createEditorialFingerprint({
    collection,
    relativePath: relativePath.replace(/\\/g, '/'),
    status: document.status,
    updatedAt: document.updatedAt,
  });
}

export function sortEditorialProductionIndex(entries: EditorialProductionEntry[]): EditorialProductionEntry[] {
  return [...entries].sort((left, right) => {
    const collectionOrder = left.collection.localeCompare(right.collection);
    return collectionOrder || left.relativePath.localeCompare(right.relativePath);
  });
}
