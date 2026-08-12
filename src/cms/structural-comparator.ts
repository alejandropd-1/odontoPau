import { cmsModels as defaultCmsModels } from './models';
import { neutralManifests as defaultNeutralManifests, ModelManifest } from './manifests';
import {
  CONTRACT_BASELINE_FIELDS as defaultBaselineFields,
  CONTRACT_BASELINE_MODELS as defaultBaselineModels,
  BaselineField,
  BaselineModel,
} from './baseline';
import { DocumentFixture } from './fixtures';
import { resolveTargetModel, resolveDiscriminantModel } from './resolver';

type StackbitModel = (typeof defaultCmsModels)[number];

export interface FieldDiscrepancy {
  model: string;
  path: string;
  layer: 'JSON' | 'Manifest' | 'CMSAdapter' | 'RuntimeValidation';
  provider: 'Stackbit';
  documentId?: string;
  expectedForm: string;
  observedForm: string;
  classification: 'safe' | 'blocked' | 'pending';
  reason: string;
  slice: 'B' | 'C' | 'D' | '-';
}

export interface RouteCoverageInfo {
  route: string;
  observedInReal: boolean;
  observedInSynthetic: boolean;
  covered: boolean;
}

export interface StructuralComparisonResult {
  totalRoutes: number;
  safeCount: number;
  blockedCount: number;
  pendingCount: number;
  realDocsCount: number;
  syntheticFixturesCount: number;
  realCoverageCount: number;
  syntheticCoverageCount: number;
  uncoveredCount: number;
  routeCoverage: Record<string, RouteCoverageInfo>;
  knownFindings: FieldDiscrepancy[];
  violations: FieldDiscrepancy[];
  modelClassifications: Record<string, { safe: number; blocked: number; pending: number }>;
}

export interface StructuralComparatorOptions {
  baselineFields?: Record<string, BaselineField>;
  baselineModels?: Record<string, BaselineModel>;
  neutralManifests?: Record<string, ModelManifest>;
  cmsModels?: StackbitModel[];
}

export function normalizeListRoutePath(rawPath: string): string {
  return rawPath.replace(/\[\d+\]/g, '[]');
}

function findStackbitAdapterField(stackbitModel: StackbitModel, fieldPath: string): any {
  if (fieldPath === 'type') {
    const directTypeField = stackbitModel.fields?.find((f: any) => f.name === 'type');
    if (directTypeField) {
      return { ...directTypeField, required: true };
    }
    return { name: 'type', type: 'string', required: true, const: stackbitModel.name };
  }

  const parts = fieldPath.split('.').map((p) => p.replace(/\[\]/g, ''));
  let currentFields = stackbitModel.fields;
  let currentField: any = undefined;

  for (const part of parts) {
    if (!currentFields || !Array.isArray(currentFields)) {
      return undefined;
    }
    currentField = currentFields.find((f: any) => f.name === part);
    if (!currentField) {
      return undefined;
    }
    currentFields = currentField.fields || currentField.items?.fields;
  }

  if (currentField && fieldPath.endsWith('type')) {
    return { ...currentField, required: true };
  }
  return currentField;
}

/**
 * Comparador estructural entre documentos JSON/fixtures, línea base, manifest neutral y adaptador Stackbit.
 * Controla jsonPresence por instancia real de modelo e inspecciona rigurosamente el adaptador CMS.
 */
export function compareStructuralContracts(
  fixtures: DocumentFixture[],
  options: StructuralComparatorOptions = {}
): StructuralComparisonResult {
  const baselineFields = options.baselineFields || defaultBaselineFields;
  const baselineModels = options.baselineModels || defaultBaselineModels;
  const neutralManifests = options.neutralManifests || defaultNeutralManifests;
  const cmsModels = options.cmsModels || defaultCmsModels;

  let knownFindings: FieldDiscrepancy[];
  const violations: FieldDiscrepancy[] = [];

  const modelClassifications: Record<string, { safe: number; blocked: number; pending: number }> = {};
  const routeCoverageMap: Record<string, RouteCoverageInfo> = {};

  for (const modelKey of Object.keys(baselineModels)) {
    modelClassifications[modelKey] = { safe: 0, blocked: 0, pending: 0 };
  }

  // Estructuras para tracking por instancia real
  const instanceRoutesMap = new Map<string, { model: string; docId: string; routes: Set<string> }>();
  const modelInstancesMap = new Map<string, Set<string>>();

  // Cargar hallazgos conocidos desde la línea base contractual (desfases documentados entre RT y CMS)
  knownFindings = Object.entries(baselineFields)
    .filter(([_, b]) => b.state === 'blocked' || b.state === 'pending')
    .map(([rk, b]) => {
      const [mName, fPath] = rk.split(/\.(.+)/);
      return {
        model: mName,
        path: fPath,
        layer: (b.state === 'blocked' ? 'CMSAdapter' : 'RuntimeValidation') as FieldDiscrepancy['layer'],
        provider: 'Stackbit' as const,
        expectedForm: b.form,
        observedForm: b.persistedType,
        classification: b.state as 'blocked' | 'pending',
        reason: `Hallazgo documentado en baseline: ${mName}.${fPath} es ${b.state} (Slice ${b.slice}).`,
        slice: b.slice as 'B' | 'C' | 'D' | '-',
      };
    });

  for (const [routeKey, baseline] of Object.entries(baselineFields)) {
    const isDerived = baseline.origin === 'derived';
    routeCoverageMap[routeKey] = {
      route: routeKey,
      observedInReal: false,
      observedInSynthetic: false,
      covered: isDerived,
    };
  }

  const stackbitModelMap = new Map<string, StackbitModel>();
  for (const m of cmsModels) {
    stackbitModelMap.set(m.name, m);
  }

  let realDocsCount = 0;
  let syntheticFixturesCount = 0;

  // 1. Recorrer recursivamente todos los documentos y medir presencia por INSTANCIA REAL
  for (const fixture of fixtures) {
    if (fixture.isSynthetic) {
      syntheticFixturesCount++;
    } else {
      realDocsCount++;
    }

    const docId = fixture.id;
    const rootModelName = fixture.model;

    const rootModelDef = neutralManifests[rootModelName];
    if (!rootModelDef) {
      violations.push({
        model: rootModelName,
        path: 'root',
        layer: 'JSON',
        provider: 'Stackbit',
        documentId: docId,
        expectedForm: 'model',
        observedForm: 'unknown_model',
        classification: 'blocked',
        reason: `Modelo desconocido '${rootModelName}' en documento '${docId}'.`,
        slice: '-',
      });
      continue;
    }

    function traverseObject(obj: any, currentModel: string, currentPath = '', instancePath = '') {
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;

      const instanceId = instancePath ? `${docId}#${instancePath}` : docId;
      if (!instanceRoutesMap.has(instanceId)) {
        instanceRoutesMap.set(instanceId, { model: currentModel, docId, routes: new Set() });
      }
      if (!modelInstancesMap.has(currentModel)) {
        modelInstancesMap.set(currentModel, new Set());
      }
      modelInstancesMap.get(currentModel)!.add(instanceId);

      const instRecord = instanceRoutesMap.get(instanceId)!;
      const modelDef = neutralManifests[currentModel];
      const declaredFieldPaths = modelDef ? modelDef.fields.map((f) => f.path) : [];

      for (const [key, value] of Object.entries(obj)) {
        const relPath = currentPath ? `${currentPath}.${key}` : key;
        const normalizedRelPath = normalizeListRoutePath(relPath);
        const routeKey = `${currentModel}.${normalizedRelPath}`;

        const fieldBaseline = baselineFields[routeKey];
        if (fieldBaseline) {
          instRecord.routes.add(routeKey);
          const info = routeCoverageMap[routeKey];
          if (info) {
            if (fixture.isSynthetic) {
              info.observedInSynthetic = true;
            } else {
              info.observedInReal = true;
            }
            info.covered = true;
          }
        } else {
          const rawPrefix = normalizedRelPath.split('[')[0].split('.')[0];
          const isKnownPrefix = declaredFieldPaths.some(
            (p) =>
              p === normalizedRelPath ||
              p === rawPrefix ||
              normalizedRelPath.startsWith(`${p}[`) ||
              normalizedRelPath.startsWith(`${p}.`)
          );
          if (!isKnownPrefix && neutralManifests[currentModel]) {
            violations.push({
              model: currentModel,
              path: normalizedRelPath,
              layer: 'JSON',
              provider: 'Stackbit',
              documentId: instanceId,
              expectedForm: 'known_field',
              observedForm: typeof value,
              classification: 'blocked',
              reason: `Campo JSON desconocido '${key}' en ruta '${routeKey}' dentro de '${instanceId}'.`,
              slice: '-',
            });
          }
        }

        if (value && typeof value === 'object') {
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              const item = value[i];
              if (item && typeof item === 'object' && !Array.isArray(item)) {
                const targetModel = resolveTargetModel(currentModel, normalizedRelPath, item.type);
                const itemInstPath = instancePath ? `${instancePath}.${key}[${i}]` : `${key}[${i}]`;
                if (targetModel && neutralManifests[targetModel]) {
                  traverseObject(item, targetModel, '', itemInstPath);
                } else {
                  // Proyección para objetos anidados en listas sin modelo propio (ej. CasoClinico.stats[])
                  const subfieldPrefix = `${currentModel}.${normalizedRelPath}[].`;
                  const allowedSubfields = Object.keys(baselineFields)
                    .filter((rk) => rk.startsWith(subfieldPrefix))
                    .map((rk) => rk.replace(subfieldPrefix, ''));

                  if (allowedSubfields.length > 0) {
                    for (const [itemKey, itemVal] of Object.entries(item)) {
                      if (!allowedSubfields.includes(itemKey)) {
                        violations.push({
                          model: currentModel,
                          path: `${normalizedRelPath}[].${itemKey}`,
                          layer: 'JSON',
                          provider: 'Stackbit',
                          documentId: instanceId,
                          expectedForm: 'known_subfield',
                          observedForm: typeof itemVal,
                          classification: 'blocked',
                          reason: `Campo JSON desconocido '${itemKey}' en ruta '${currentModel}.${normalizedRelPath}[].${itemKey}' dentro de '${instanceId}'.`,
                          slice: '-',
                        });
                      } else {
                        const subRouteKey = `${subfieldPrefix}${itemKey}`;
                        instRecord.routes.add(subRouteKey);
                        const info = routeCoverageMap[subRouteKey];
                        if (info) {
                          if (fixture.isSynthetic) info.observedInSynthetic = true;
                          else info.observedInReal = true;
                          info.covered = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            const targetModel = resolveTargetModel(currentModel, normalizedRelPath, (value as any).type);
            const childInstPath = instancePath ? `${instancePath}.${key}` : key;
            if (targetModel && neutralManifests[targetModel]) {
              traverseObject(value, targetModel, '', childInstPath);
            } else {
              traverseObject(value, currentModel, relPath, instancePath);
            }
          }
        }
      }
    }

    traverseObject(fixture.content, rootModelName, '', '');
  }

  // 2. Verificar jsonPresence (All, Some, None) por INSTANCIA REAL de modelo
  for (const [routeKey, baseline] of Object.entries(baselineFields)) {
    if (baseline.origin === 'derived') continue;

    const [modelName, fieldPath] = routeKey.split(/\.(.+)/);
    const instancesOfModel = modelInstancesMap.get(modelName);

    if (baseline.jsonPresence === 'All') {
      if (instancesOfModel && instancesOfModel.size > 0) {
        for (const instanceId of instancesOfModel) {
          const instRecord = instanceRoutesMap.get(instanceId);
          if (!instRecord || !instRecord.routes.has(routeKey)) {
            violations.push({
              model: modelName,
              path: fieldPath,
              layer: 'JSON',
              provider: 'Stackbit',
              documentId: instanceId,
              expectedForm: 'present_in_all_instances',
              observedForm: 'absent_in_instance',
              classification: 'blocked',
              reason: `Ruta requerida '${routeKey}' omitida en la instancia '${instanceId}'.`,
              slice: baseline.slice as any,
            });
          }
        }
      } else {
        const info = routeCoverageMap[routeKey];
        if (!info || !info.covered) {
          violations.push({
            model: modelName,
            path: fieldPath,
            layer: 'JSON',
            provider: 'Stackbit',
            expectedForm: 'present_in_json',
            observedForm: 'absent',
            classification: 'blocked',
            reason: `Ruta requerida '${routeKey}' omitida en los documentos observados.`,
            slice: baseline.slice as any,
          });
        }
      }
    } else if (baseline.jsonPresence === 'None') {
      const info = routeCoverageMap[routeKey];
      if (info && (info.observedInReal || info.observedInSynthetic)) {
        violations.push({
          model: modelName,
          path: fieldPath,
          layer: 'JSON',
          provider: 'Stackbit',
          expectedForm: 'absent_in_json',
          observedForm: 'present',
          classification: 'blocked',
          reason: `Ruta '${routeKey}' con jsonPresence: None fue observada en documentos JSON.`,
          slice: baseline.slice as any,
        });
      }
    }
  }

  // 3. Evaluar Manifest Neutral
  for (const [routeKey, baseline] of Object.entries(baselineFields)) {
    const [modelName, fieldPath] = routeKey.split(/\.(.+)/);
    const neutralModel = neutralManifests[modelName];

    if (!neutralModel) {
      violations.push({
        model: modelName,
        path: fieldPath,
        layer: 'Manifest',
        provider: 'Stackbit',
        expectedForm: baseline.form,
        observedForm: 'absent_model',
        classification: 'blocked',
        reason: `Modelo '${modelName}' omitido en el manifest neutral.`,
        slice: baseline.slice as any,
      });
    } else {
      const neutralField = neutralModel.fields.find((f) => f.path === fieldPath);
      if (!neutralField) {
        violations.push({
          model: modelName,
          path: fieldPath,
          layer: 'Manifest',
          provider: 'Stackbit',
          expectedForm: baseline.form,
          observedForm: 'absent_field',
          classification: 'blocked',
          reason: `Ruta '${routeKey}' ausente en el manifest neutral.`,
          slice: baseline.slice as any,
        });
      } else if (neutralField.form !== baseline.form) {
        violations.push({
          model: modelName,
          path: fieldPath,
          layer: 'Manifest',
          provider: 'Stackbit',
          expectedForm: baseline.form,
          observedForm: neutralField.form,
          classification: 'blocked',
          reason: `Forma alterada en el manifest neutral para '${routeKey}': esperada '${baseline.form}', observada '${neutralField.form}'.`,
          slice: baseline.slice as any,
        });
      }
    }
  }

  // 4. Evaluar Adaptador Stackbit (Forma, Tipo exacto, cmsObligatory: Req, Cte, Items y Modelos)
  for (const [routeKey, baseline] of Object.entries(baselineFields)) {
    if (baseline.cmsObligatory === 'N/A') continue;

    const [modelName, fieldPath] = routeKey.split(/\.(.+)/);
    const stackbitModel = stackbitModelMap.get(modelName);

    if (!stackbitModel) {
      violations.push({
        model: modelName,
        path: fieldPath,
        layer: 'CMSAdapter',
        provider: 'Stackbit',
        expectedForm: baseline.form,
        observedForm: 'absent_adapter_model',
        classification: 'blocked',
        reason: `Modelo '${modelName}' ausente en el adaptador Stackbit.`,
        slice: baseline.slice as any,
      });
    } else {
      const adapterField = findStackbitAdapterField(stackbitModel, fieldPath);
      if (!adapterField) {
        violations.push({
          model: modelName,
          path: fieldPath,
          layer: 'CMSAdapter',
          provider: 'Stackbit',
          expectedForm: baseline.form,
          observedForm: 'absent_adapter_field',
          classification: 'blocked',
          reason: `Campo '${fieldPath}' ausente en el adaptador Stackbit para '${routeKey}'.`,
          slice: baseline.slice as any,
        });
      } else {
        // 4.1 Comprobar tipo persistido exacto
        if (!isExactStackbitTypeMatch(baseline.form, baseline.persistedType, adapterField.type)) {
          violations.push({
            model: modelName,
            path: fieldPath,
            layer: 'CMSAdapter',
            provider: 'Stackbit',
            expectedForm: baseline.persistedType,
            observedForm: adapterField.type,
            classification: 'blocked',
            reason: `Tipo alterado en el adaptador Stackbit para '${routeKey}': esperado '${baseline.persistedType}', observado '${adapterField.type}'.`,
            slice: baseline.slice as any,
          });
        }

        // 4.2 Comprobar cmsObligatory: Req -> required: true
        if (baseline.cmsObligatory === 'Req' && adapterField.required !== true) {
          violations.push({
            model: modelName,
            path: fieldPath,
            layer: 'CMSAdapter',
            provider: 'Stackbit',
            expectedForm: 'required: true',
            observedForm: `required: ${adapterField.required}`,
            classification: 'blocked',
            reason: `Requerimiento ausente en el adaptador Stackbit para '${routeKey}'.`,
            slice: baseline.slice as any,
          });
        }

        // 4.3 Comprobar discriminante o constante Cte:X
        if (baseline.constOrDiscriminant && baseline.constOrDiscriminant.startsWith('Cte:')) {
          const expectedCte = baseline.constOrDiscriminant.replace('Cte:', '');
          const observedConst = adapterField.const || adapterField.default;
          const isResolvedMatch =
            observedConst === expectedCte ||
            resolveDiscriminantModel(expectedCte, modelName) === observedConst ||
            (adapterField.options && adapterField.options.includes(expectedCte));

          if (!isResolvedMatch) {
            violations.push({
              model: modelName,
              path: fieldPath,
              layer: 'CMSAdapter',
              provider: 'Stackbit',
              expectedForm: `const: '${expectedCte}'`,
              observedForm: `const: '${observedConst}'`,
              classification: 'blocked',
              reason: `Constante alterada en el adaptador Stackbit para '${routeKey}': esperada '${expectedCte}', observada '${observedConst}'.`,
              slice: baseline.slice as any,
            });
          }
        }

        // 4.4 Comprobar items.type en listas de escalares
        if (baseline.form === 'list' && baseline.persistedType === 'string[]') {
          const itemType = adapterField.items?.type;
          const isCompatibleItemType = itemType === 'string' || itemType === 'text' || itemType === 'enum' || itemType === 'image';
          if (!isCompatibleItemType) {
            violations.push({
              model: modelName,
              path: fieldPath,
              layer: 'CMSAdapter',
              provider: 'Stackbit',
              expectedForm: 'items.type: string',
              observedForm: `items.type: ${itemType}`,
              classification: 'blocked',
              reason: `Tipo de items alterado en el adaptador Stackbit para '${routeKey}': esperado 'string', observado '${itemType}'.`,
              slice: baseline.slice as any,
            });
          }
        }

        // 4.5 Comprobar lista permitida de modelos en secciones (Articulo.sections, Instruccion.sections)
        if (fieldPath === 'sections' && adapterField.items?.models) {
          const allowedStackbitModels: string[] = adapterField.items.models;
          const expectedSectionModels =
            modelName === 'Articulo'
              ? ['ArticleCaseSummarySection', 'ArticleTextSection', 'ArticleListSection', 'ArticleComparisonSection', 'ArticleStatsSection', 'ArticleGallerySection', 'ArticleFaqSection', 'ArticleQuoteSection', 'ArticleCtaSection']
              : ['InstructionStepsSection', 'InstructionMatrixSection', 'InstructionNoticeSection', 'InstructionTextSection'];

          for (const reqModel of expectedSectionModels) {
            const isPresent = allowedStackbitModels.some(
              (sm) => sm === reqModel || resolveDiscriminantModel(sm, modelName) === reqModel
            );
            if (!isPresent) {
              violations.push({
                model: modelName,
                path: fieldPath,
                layer: 'CMSAdapter',
                provider: 'Stackbit',
                expectedForm: `allowedModel: ${reqModel}`,
                observedForm: 'model_removed',
                classification: 'blocked',
                reason: `Lista permitida de modelos de '${routeKey}' reducida en el adaptador Stackbit: falta '${reqModel}'.`,
                slice: baseline.slice as any,
              });
              break;
            }
          }
        }
      }
    }
  }

  // 5. Computar estado por modelo según línea base contractual
  for (const [routeKey, baseline] of Object.entries(baselineFields)) {
    const [modelName] = routeKey.split(/\.(.+)/);
    const state = baseline.state as 'safe' | 'blocked' | 'pending';

    if (modelClassifications[modelName]) {
      modelClassifications[modelName][state]++;
    }
  }

  let totalRoutes = 0;
  let safeCount = 0;
  let blockedCount = 0;
  let pendingCount = 0;
  let realCoverageCount = 0;
  let syntheticCoverageCount = 0;
  let uncoveredCount = 0;

  for (const counts of Object.values(modelClassifications)) {
    totalRoutes += counts.safe + counts.blocked + counts.pending;
    safeCount += counts.safe;
    blockedCount += counts.blocked;
    pendingCount += counts.pending;
  }

  for (const info of Object.values(routeCoverageMap)) {
    if (info.observedInReal) realCoverageCount++;
    if (info.observedInSynthetic) syntheticCoverageCount++;
    if (!info.covered) {
      uncoveredCount++;
    }
  }

  return {
    totalRoutes,
    safeCount,
    blockedCount,
    pendingCount,
    realDocsCount,
    syntheticFixturesCount,
    realCoverageCount,
    syntheticCoverageCount,
    uncoveredCount,
    routeCoverage: routeCoverageMap,
    knownFindings,
    violations,
    modelClassifications,
  };
}

function isExactStackbitTypeMatch(form: string, persistedType: string, adapterType: string): boolean {
  if (form === 'scalar') {
    if (persistedType === 'string') {
      return (
        adapterType === 'string' ||
        adapterType === 'text' ||
        adapterType === 'markdown' ||
        adapterType === 'enum' ||
        adapterType === 'image' ||
        adapterType === 'html' ||
        adapterType === 'date' ||
        adapterType === 'datetime' ||
        adapterType === 'color'
      );
    }
    if (persistedType === 'number') {
      return adapterType === 'number';
    }
    if (persistedType === 'boolean') {
      return adapterType === 'boolean';
    }
  }
  if (form === 'list') {
    return adapterType === 'list';
  }
  if (form === 'object' || form === 'model') {
    return adapterType === 'model' || adapterType === 'object';
  }
  return false;
}
