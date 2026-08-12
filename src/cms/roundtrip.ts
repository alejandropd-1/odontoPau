import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DocumentFixture } from './fixtures';
import { neutralManifests as defaultNeutralManifests, ModelManifest } from './manifests';
import { resolveTargetModel } from './resolver';
import { CONTRACT_BASELINE_FIELDS } from './baseline';

export interface RoundTripResult {
  fixtureId: string;
  model: string;
  success: boolean;
  preservedFields: number;
  differences: string[];
}

export interface NonMutationStatus {
  success: boolean;
  checkedFilesCount: number;
  mutatedFiles: string[];
}

/**
 * Calcula un mapa de hashes SHA-256 de todos los archivos bajo `src/data`.
 */
export function getSrcDataFilesHashes(): Map<string, string> {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const hashMap = new Map<string, string>();

  function walk(dir: string) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        walk(fullPath);
      } else {
        const content = fs.readFileSync(fullPath);
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const relPath = path.relative(dataDir, fullPath).replace(/\\/g, '/');
        hashMap.set(relPath, hash);
      }
    }
  }

  if (fs.existsSync(dataDir)) {
    walk(dataDir);
  }
  return hashMap;
}

/**
 * Compara dos mapas de hashes (en memoria o sobre disco) y retorna el estado de no mutación.
 */
export function verifySrcDataNonMutation(
  beforeHashes: Map<string, string> = getSrcDataFilesHashes(),
  afterHashes: Map<string, string> = getSrcDataFilesHashes()
): NonMutationStatus {
  const mutatedFiles: string[] = [];

  for (const [relPath, beforeHash] of beforeHashes.entries()) {
    const afterHash = afterHashes.get(relPath);
    if (!afterHash) {
      mutatedFiles.push(`DELETED: ${relPath}`);
    } else if (beforeHash !== afterHash) {
      mutatedFiles.push(`MODIFIED: ${relPath}`);
    }
  }

  for (const relPath of afterHashes.keys()) {
    if (!beforeHashes.has(relPath)) {
      mutatedFiles.push(`ADDED: ${relPath}`);
    }
  }

  return {
    success: mutatedFiles.length === 0,
    checkedFilesCount: beforeHashes.size,
    mutatedFiles,
  };
}

function getNestedValue(obj: any, pathStr: string): any {
  const parts = pathStr.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr === null || curr === undefined || typeof curr !== 'object') {
      return undefined;
    }
    curr = curr[part];
  }
  return curr;
}

function hasNestedProperty(obj: any, pathStr: string): boolean {
  const parts = pathStr.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (curr === null || curr === undefined || typeof curr !== 'object') {
      return false;
    }
    if (!(part in curr)) {
      return false;
    }
    curr = curr[part];
  }
  return true;
}

function setNestedValue(obj: any, pathStr: string, val: any): void {
  const parts = pathStr.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in curr) || typeof curr[part] !== 'object' || curr[part] === null) {
      curr[part] = {};
    }
    curr = curr[part];
  }
  curr[parts[parts.length - 1]] = val;
}

/**
 * Proyecta y reconstruye realmente un documento a través de las definiciones del manifest neutral.
 * NUNCA permite passthrough de objetos sin validar ni proyectar sus campos.
 */
export function projectAndReconstruct(
  doc: any,
  modelName: string,
  pathPrefix = '',
  manifests: Record<string, ModelManifest> = defaultNeutralManifests
): { reconstructed: any; errors: string[]; fieldCount: number } {
  const errors: string[] = [];
  let fieldCount = 0;

  const modelDef = manifests[modelName];
  if (!modelDef) {
    errors.push(`Unknown model '${modelName}' at '${pathPrefix || 'root'}'.`);
    return { reconstructed: undefined, errors, fieldCount: 0 };
  }

  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    errors.push(`Expected object for model '${modelName}' at '${pathPrefix || 'root'}', got ${typeof doc}.`);
    return { reconstructed: undefined, errors, fieldCount: 0 };
  }

  const declaredFieldPaths = modelDef.fields.map((f) => f.path);

  // 1. Detectar claves desconocidas en la raíz del objeto
  for (const key of Object.keys(doc)) {
    const isKnownPrefix = declaredFieldPaths.some(
      (p) => p === key || p.startsWith(`${key}.`) || p.startsWith(`${key}[`)
    );
    if (!isKnownPrefix) {
      const keyPath = pathPrefix ? `${pathPrefix}.${key}` : key;
      errors.push(`Unknown field '${key}' at '${keyPath}' for model '${modelName}'.`);
    }
  }

  const reconstructed: Record<string, any> = {};

  // 2. Iterar campos declarados en el manifest del modelo
  for (const field of modelDef.fields) {
    if (field.origin === 'derived') {
      continue;
    }

    if (!hasNestedProperty(doc, field.path)) {
      continue;
    }

    const val = getNestedValue(doc, field.path);
    const fieldFullPath = pathPrefix ? `${pathPrefix}.${field.path}` : field.path;

    if (val === undefined) {
      continue;
    }

    if (field.form === 'scalar') {
      if (val !== null && val !== undefined) {
        if (field.persistedType === 'string' && typeof val !== 'string') {
          errors.push(`Type mismatch at '${fieldFullPath}': expected string, got ${typeof val}`);
        } else if (field.persistedType === 'number' && typeof val !== 'number') {
          errors.push(`Type mismatch at '${fieldFullPath}': expected number, got ${typeof val}`);
        } else if (field.persistedType === 'boolean' && typeof val !== 'boolean') {
          errors.push(`Type mismatch at '${fieldFullPath}': expected boolean, got ${typeof val}`);
        }

        if (field.constOrDiscriminant && field.constOrDiscriminant.startsWith('Cte:')) {
          const expectedCte = field.constOrDiscriminant.replace('Cte:', '');
          if (val !== expectedCte) {
            errors.push(
              `Invalid discriminant value at '${fieldFullPath}': expected '${expectedCte}', got '${val}'.`
            );
          }
        }

        setNestedValue(reconstructed, field.path, val);
        fieldCount++;
      }
    } else if (field.form === 'list') {
      if (!Array.isArray(val)) {
        errors.push(`Form mismatch at '${fieldFullPath}': expected list, got ${typeof val}`);
        continue;
      }

      const reconstructedList: any[] = [];
      for (let i = 0; i < val.length; i++) {
        const item = val[i];
        const itemPath = `${fieldFullPath}[${i}]`;

        if (field.persistedType === 'string[]') {
          if (typeof item !== 'string') {
            errors.push(`Type mismatch at '${itemPath}': expected string in list, got ${typeof item}`);
          } else {
            reconstructedList.push(item);
            fieldCount++;
          }
        } else if (field.persistedType === 'number[]') {
          if (typeof item !== 'number') {
            errors.push(`Type mismatch at '${itemPath}': expected number in list, got ${typeof item}`);
          } else {
            reconstructedList.push(item);
            fieldCount++;
          }
        } else if (field.persistedType === 'object[]') {
          if (!item || typeof item !== 'object' || Array.isArray(item)) {
            errors.push(`Form mismatch at '${itemPath}': expected object item, got ${typeof item}`);
            continue;
          }

          const targetModel = resolveTargetModel(modelName, field.path, item.type);
          if (targetModel && manifests[targetModel]) {
            const res = projectAndReconstruct(item, targetModel, itemPath, manifests);
            errors.push(...res.errors);
            if (res.reconstructed !== undefined) {
              reconstructedList.push(res.reconstructed);
              fieldCount += res.fieldCount;
            }
          } else {
            // Proyección inline estricta para listas de objetos sin modelo propio (ej. CasoClinico.stats[])
            const subfieldPrefix = `${modelName}.${field.path}[].`;
            const allowedSubfields = Object.keys(CONTRACT_BASELINE_FIELDS)
              .filter((rk) => rk.startsWith(subfieldPrefix))
              .map((rk) => rk.replace(subfieldPrefix, ''));

            if (allowedSubfields.length > 0) {
              // Validar claves desconocidas dentro del objeto de lista
              for (const k of Object.keys(item)) {
                if (!allowedSubfields.includes(k)) {
                  errors.push(`Unknown field '${k}' at '${itemPath}.${k}' for model '${modelName}'.`);
                }
              }

              const projectedItem: Record<string, any> = {};
              for (const sf of allowedSubfields) {
                if (sf in item) {
                  const sfValue = item[sf];
                  const routeKey = `${subfieldPrefix}${sf}`;
                  const baselineDef = CONTRACT_BASELINE_FIELDS[routeKey];
                  if (baselineDef) {
                    if (baselineDef.persistedType === 'string' && typeof sfValue !== 'string') {
                      errors.push(`Type mismatch at '${itemPath}.${sf}': expected string, got ${typeof sfValue}`);
                    } else if (baselineDef.persistedType === 'number' && typeof sfValue !== 'number') {
                      errors.push(`Type mismatch at '${itemPath}.${sf}': expected number, got ${typeof sfValue}`);
                    } else if (baselineDef.persistedType === 'boolean' && typeof sfValue !== 'boolean') {
                      errors.push(`Type mismatch at '${itemPath}.${sf}': expected boolean, got ${typeof sfValue}`);
                    }
                  }
                  projectedItem[sf] = sfValue;
                  fieldCount++;
                }
              }
              reconstructedList.push(projectedItem);
            } else {
              errors.push(
                `Cannot resolve target model or subfields for object list item at '${itemPath}' (parent model '${modelName}', discriminant '${item.type || 'none'}').`
              );
            }
          }
        }
      }
      setNestedValue(reconstructed, field.path, reconstructedList);
      fieldCount++;
    } else if (field.form === 'object' || field.form === 'model') {
      if (!val || typeof val !== 'object' || Array.isArray(val)) {
        errors.push(`Form mismatch at '${fieldFullPath}': expected object, got ${typeof val}`);
        continue;
      }

      const targetModel = resolveTargetModel(modelName, field.path, val.type);
      if (targetModel && manifests[targetModel]) {
        const res = projectAndReconstruct(val, targetModel, fieldFullPath, manifests);
        errors.push(...res.errors);
        if (res.reconstructed !== undefined) {
          setNestedValue(reconstructed, field.path, res.reconstructed);
          fieldCount += res.fieldCount;
        }
      } else {
        const subFields = modelDef.fields.filter((f) => f.path.startsWith(`${field.path}.`));
        if (subFields.length > 0) {
          setNestedValue(reconstructed, field.path, {});
          fieldCount++;
        } else {
          errors.push(
            `Cannot resolve target model for nested object at '${fieldFullPath}' (parent model '${modelName}', discriminant '${val.type || 'none'}').`
          );
        }
      }
    }
  }

  return { reconstructed, errors, fieldCount };
}

/**
 * Compara semánticamente el documento original con el reconstruido.
 */
export function compareDeepSemantic(orig: any, recon: any, pathPrefix = ''): string[] {
  const diffs: string[] = [];

  if (typeof orig !== typeof recon) {
    diffs.push(`Type mismatch at '${pathPrefix}': expected ${typeof orig}, got ${typeof recon}`);
    return diffs;
  }

  if (orig === null || orig === undefined) {
    if (orig !== recon) {
      diffs.push(`Null/undefined mismatch at '${pathPrefix}': expected '${orig}', got '${recon}'`);
    }
    return diffs;
  }

  if (Array.isArray(orig)) {
    if (!Array.isArray(recon)) {
      diffs.push(`Expected array at '${pathPrefix}', got non-array`);
      return diffs;
    }
    if (orig.length !== recon.length) {
      diffs.push(`Array length mismatch at '${pathPrefix}': expected ${orig.length}, got ${recon.length}`);
    }
    const minLen = Math.min(orig.length, recon.length);
    for (let i = 0; i < minLen; i++) {
      const itemDiffs = compareDeepSemantic(orig[i], recon[i], `${pathPrefix}[${i}]`);
      diffs.push(...itemDiffs);
    }
    return diffs;
  }

  if (typeof orig === 'object') {
    const origKeys = Object.keys(orig).filter((k) => k !== 'sourcePath');
    const reconKeys = Object.keys(recon).filter((k) => k !== 'sourcePath');

    for (const k of origKeys) {
      if (!(k in recon)) {
        diffs.push(`Missing field '${k}' at '${pathPrefix ? pathPrefix + '.' + k : k}' during reconstruction`);
      } else {
        const fieldDiffs = compareDeepSemantic(
          orig[k],
          recon[k],
          pathPrefix ? `${pathPrefix}.${k}` : k
        );
        diffs.push(...fieldDiffs);
      }
    }

    for (const k of reconKeys) {
      if (!(k in orig)) {
        diffs.push(`Unexpected extra field '${k}' at '${pathPrefix ? pathPrefix + '.' + k : k}' during reconstruction`);
      }
    }
    return diffs;
  }

  if (orig !== recon) {
    diffs.push(`Value mismatch at '${pathPrefix}': expected '${orig}', got '${recon}'`);
  }

  return diffs;
}

/**
 * Ejecuta la prueba de round-trip semántico en memoria sobre los fixtures recibidos.
 */
export function executeInMemRoundTrip(
  fixtures: DocumentFixture[],
  manifests: Record<string, ModelManifest> = defaultNeutralManifests
): RoundTripResult[] {
  const results: RoundTripResult[] = [];

  for (const fixture of fixtures) {
    const orig = fixture.content;
    const { reconstructed, errors: projectionErrors, fieldCount } = projectAndReconstruct(
      orig,
      fixture.model,
      '',
      manifests
    );

    const semanticDiffs = compareDeepSemantic(orig, reconstructed);
    const allDifferences = [...projectionErrors, ...semanticDiffs];

    results.push({
      fixtureId: fixture.id,
      model: fixture.model,
      success: allDifferences.length === 0,
      preservedFields: fieldCount,
      differences: allDifferences,
    });
  }

  return results;
}
