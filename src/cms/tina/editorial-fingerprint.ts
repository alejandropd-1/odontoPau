const excludedFingerprintKeys = new Set([
  '_sys',
  '_template',
  '_values',
  'editorialFingerprint',
  'sourcePath',
]);

function normalizeFingerprintValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeFingerprintValue);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key, entryValue]) => !excludedFingerprintKeys.has(key) && entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entryValue]) => [key, normalizeFingerprintValue(entryValue)])
  );
}

export function stableEditorialStringify(value: unknown): string {
  return JSON.stringify(normalizeFingerprintValue(value));
}

export function createEditorialFingerprint(value: unknown): string {
  const bytes = new TextEncoder().encode(stableEditorialStringify(value));
  let left = 0x811c9dc5;
  let right = 0x9e3779b9;

  for (const byte of bytes) {
    left = Math.imul(left ^ byte, 0x01000193) >>> 0;
    right = Math.imul(right ^ byte, 0x85ebca6b) >>> 0;
  }

  return `${left.toString(16).padStart(8, '0')}${right.toString(16).padStart(8, '0')}`;
}

export function hasValidEditorialFingerprint(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{16}$/.test(value);
}
