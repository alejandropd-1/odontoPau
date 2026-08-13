import type { TinaField, Template } from 'tinacms';

import { CONTRACT_BASELINE_FIELDS } from '../baseline';
import { compareDeepSemantic } from '../roundtrip';
import {
  articleFields,
  articleImageFields,
  articleSectionTemplates,
  instructionFields,
  instructionImageFields,
  instructionSectionTemplates,
} from './fields';

type ObjectTinaField = Extract<TinaField, { type: 'object' }>;

export interface TinaModelAdapter {
  name: string;
  fields: TinaField[];
  discriminant?: string;
}

function persistedName(field: TinaField): string {
  return field.nameOverride ?? field.name;
}

function findField(fields: TinaField[], name: string): TinaField {
  const field = fields.find((candidate) => persistedName(candidate) === name);
  if (!field) throw new Error(`Campo Tina '${name}' no encontrado.`);
  return field;
}

function objectFields(fields: TinaField[], name: string): TinaField[] {
  const field = findField(fields, name);
  if (field.type !== 'object' || !field.fields) {
    throw new Error(`Campo Tina '${name}' no es un objeto con fields.`);
  }
  return field.fields;
}

function findTemplate(templates: Template[], name: string): Template {
  const template = templates.find(
    (candidate) => candidate.name === name || candidate.nameOverride === name
  );
  if (!template) throw new Error(`Template Tina '${name}' no encontrado.`);
  return template;
}

const articleCaseSummaryFields = findTemplate(articleSectionTemplates, 'case_summary').fields;
const articleComparisonFields = findTemplate(articleSectionTemplates, 'comparison').fields;
const articleStatsFields = findTemplate(articleSectionTemplates, 'stats').fields;
const articleFaqFields = findTemplate(articleSectionTemplates, 'faq').fields;
const instructionMatrixFields = findTemplate(instructionSectionTemplates, 'matrix').fields;
const instructionResourceGalleryFields = objectFields(instructionFields, 'resourceGallery');

export const tinaSliceBModels: Record<string, TinaModelAdapter> = {
  Articulo: { name: 'Articulo', fields: articleFields, discriminant: 'Articulo' },
  ArticleImage: { name: 'ArticleImage', fields: articleImageFields },
  ArticleSource: { name: 'ArticleSource', fields: objectFields(articleFields, 'sources') },
  ArticleDownload: { name: 'ArticleDownload', fields: objectFields(articleFields, 'downloads') },
  ArticleCaseSummarySection: {
    name: 'ArticleCaseSummarySection',
    fields: articleCaseSummaryFields,
    discriminant: 'case_summary',
  },
  ArticleCaseFact: {
    name: 'ArticleCaseFact',
    fields: objectFields(articleCaseSummaryFields, 'facts'),
  },
  ArticleCaseApproach: {
    name: 'ArticleCaseApproach',
    fields: objectFields(articleCaseSummaryFields, 'approach'),
  },
  ArticleTextSection: {
    name: 'ArticleTextSection',
    fields: findTemplate(articleSectionTemplates, 'text').fields,
    discriminant: 'text',
  },
  ArticleListSection: {
    name: 'ArticleListSection',
    fields: findTemplate(articleSectionTemplates, 'list').fields,
    discriminant: 'list',
  },
  ArticleComparisonSection: {
    name: 'ArticleComparisonSection',
    fields: articleComparisonFields,
    discriminant: 'comparison',
  },
  ArticleComparisonRow: {
    name: 'ArticleComparisonRow',
    fields: objectFields(articleComparisonFields, 'rows'),
  },
  ArticleStatsSection: {
    name: 'ArticleStatsSection',
    fields: articleStatsFields,
    discriminant: 'stats',
  },
  ArticleStat: { name: 'ArticleStat', fields: objectFields(articleStatsFields, 'items') },
  ArticleGallerySection: {
    name: 'ArticleGallerySection',
    fields: findTemplate(articleSectionTemplates, 'gallery').fields,
    discriminant: 'gallery',
  },
  ArticleFaqSection: {
    name: 'ArticleFaqSection',
    fields: articleFaqFields,
    discriminant: 'faq',
  },
  ArticleFaqItem: {
    name: 'ArticleFaqItem',
    fields: objectFields(articleFaqFields, 'items'),
  },
  ArticleQuoteSection: {
    name: 'ArticleQuoteSection',
    fields: findTemplate(articleSectionTemplates, 'quote').fields,
    discriminant: 'quote',
  },
  ArticleCtaSection: {
    name: 'ArticleCtaSection',
    fields: findTemplate(articleSectionTemplates, 'cta').fields,
    discriminant: 'cta',
  },
  Instruccion: { name: 'Instruccion', fields: instructionFields, discriminant: 'Instruccion' },
  InstructionImage: { name: 'InstructionImage', fields: instructionImageFields },
  InstructionResourceGallery: {
    name: 'InstructionResourceGallery',
    fields: instructionResourceGalleryFields,
  },
  InstructionStepsSection: {
    name: 'InstructionStepsSection',
    fields: findTemplate(instructionSectionTemplates, 'steps').fields,
    discriminant: 'steps',
  },
  InstructionMatrixSection: {
    name: 'InstructionMatrixSection',
    fields: instructionMatrixFields,
    discriminant: 'matrix',
  },
  InstructionMatrixGroup: {
    name: 'InstructionMatrixGroup',
    fields: objectFields(instructionMatrixFields, 'groups'),
  },
  InstructionNoticeSection: {
    name: 'InstructionNoticeSection',
    fields: findTemplate(instructionSectionTemplates, 'notice').fields,
    discriminant: 'notice',
  },
  InstructionTextSection: {
    name: 'InstructionTextSection',
    fields: findTemplate(instructionSectionTemplates, 'text').fields,
    discriminant: 'text',
  },
};

export interface TinaAdapterCoverage {
  modelCount: number;
  expectedRouteCount: number;
  coveredRouteCount: number;
  missingRoutes: string[];
  invalidRequiredRoutes: string[];
  invalidDiscriminants: string[];
}

export function inspectTinaSliceBCoverage(): TinaAdapterCoverage {
  const expectedRoutes = Object.entries(CONTRACT_BASELINE_FIELDS).filter(
    ([, field]) => field.slice === 'B'
  );
  const missingRoutes: string[] = [];
  const invalidRequiredRoutes: string[] = [];
  const invalidDiscriminants: string[] = [];

  for (const [route, baseline] of expectedRoutes) {
    const [modelName, fieldPath] = route.split(/\.(.+)/);
    const model = tinaSliceBModels[modelName];

    if (!model) {
      missingRoutes.push(route);
      continue;
    }

    if (fieldPath === 'type' && model.discriminant) {
      const expected = baseline.constOrDiscriminant.replace('Cte:', '');
      if (model.discriminant !== expected) invalidDiscriminants.push(route);
      continue;
    }

    const field = model.fields.find((candidate) => persistedName(candidate) === fieldPath);
    if (!field) {
      missingRoutes.push(route);
      continue;
    }

    if (baseline.cmsObligatory === 'Req' && field.required !== true) {
      invalidRequiredRoutes.push(route);
    }
  }

  return {
    modelCount: Object.keys(tinaSliceBModels).length,
    expectedRouteCount: expectedRoutes.length,
    coveredRouteCount: expectedRoutes.length - missingRoutes.length,
    missingRoutes,
    invalidRequiredRoutes,
    invalidDiscriminants,
  };
}

function getNestedAdapter(modelName: string, fieldName: string, item: unknown): TinaModelAdapter | undefined {
  const discriminant =
    item && typeof item === 'object' && '_template' in item
      ? String((item as Record<string, unknown>)._template)
      : item && typeof item === 'object' && 'type' in item
        ? String((item as Record<string, unknown>).type)
        : undefined;

  const routeTargets: Record<string, string> = {
    'Articulo.heroImage': 'ArticleImage',
    'Articulo.sources': 'ArticleSource',
    'Articulo.downloads': 'ArticleDownload',
    'ArticleCaseSummarySection.facts': 'ArticleCaseFact',
    'ArticleCaseSummarySection.approach': 'ArticleCaseApproach',
    'ArticleComparisonSection.rows': 'ArticleComparisonRow',
    'ArticleStatsSection.items': 'ArticleStat',
    'ArticleGallerySection.images': 'ArticleImage',
    'ArticleFaqSection.items': 'ArticleFaqItem',
    'Instruccion.resourceImage': 'InstructionImage',
    'Instruccion.resourceGallery': 'InstructionResourceGallery',
    'Instruccion.socialImage': 'InstructionImage',
    'InstructionResourceGallery.images': 'InstructionImage',
    'InstructionMatrixSection.groups': 'InstructionMatrixGroup',
  };

  if (fieldName === 'sections' && discriminant) {
    const candidates = Object.values(tinaSliceBModels).filter(
      (model) => model.discriminant === discriminant && model.name !== modelName
    );
    return candidates.find((model) =>
      modelName === 'Instruccion' ? model.name.startsWith('Instruction') : model.name.startsWith('Article')
    );
  }

  const target = routeTargets[`${modelName}.${fieldName}`];
  return target ? tinaSliceBModels[target] : undefined;
}

function transformWithFields(
  value: Record<string, unknown>,
  model: TinaModelAdapter,
  direction: 'to-editor' | 'to-persisted'
): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  if (direction === 'to-editor' && model.discriminant && model.name.endsWith('Section')) {
    output._template = model.discriminant;
  }

  for (const field of model.fields) {
    const diskName = persistedName(field);
    const inputName = direction === 'to-editor' ? diskName : field.name;
    const outputName = direction === 'to-editor' ? field.name : diskName;
    const fieldValue = value[inputName];

    if (fieldValue === undefined) continue;

    if (field.type === 'object') {
      if (field.list) {
        if (!Array.isArray(fieldValue)) throw new Error(`${model.name}.${diskName} debe ser lista.`);
        output[outputName] = fieldValue.map((item) => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
          const target = getNestedAdapter(model.name, diskName, item);
          return target
            ? transformWithFields(item as Record<string, unknown>, target, direction)
            : item;
        });
      } else if (fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
        const target = getNestedAdapter(model.name, diskName, fieldValue);
        output[outputName] = target
          ? transformWithFields(fieldValue as Record<string, unknown>, target, direction)
          : fieldValue;
      } else {
        output[outputName] = fieldValue;
      }
    } else {
      output[outputName] = fieldValue;
    }
  }

  if (direction === 'to-persisted' && model.discriminant) {
    output.type = model.discriminant;
  }

  return output;
}

export function toTinaEditorDocument(
  document: Record<string, unknown>,
  modelName: 'Articulo' | 'Instruccion'
): Record<string, unknown> {
  return transformWithFields(document, tinaSliceBModels[modelName], 'to-editor');
}

export function fromTinaEditorDocument(
  document: Record<string, unknown>,
  modelName: 'Articulo' | 'Instruccion'
): Record<string, unknown> {
  return transformWithFields(document, tinaSliceBModels[modelName], 'to-persisted');
}

export function tinaRoundTripDifferences(
  document: Record<string, unknown>,
  modelName: 'Articulo' | 'Instruccion'
): string[] {
  const editorDocument = toTinaEditorDocument(document, modelName);
  const persistedDocument = fromTinaEditorDocument(editorDocument, modelName);
  return compareDeepSemantic(document, persistedDocument);
}

export function assertTemplateKeyContract(): void {
  for (const field of [findField(articleFields, 'sections'), findField(instructionFields, 'sections')]) {
    const objectField = field as ObjectTinaField & {
      templateKey?: string;
      templates: Template[];
    };
    if (objectField.templateKey !== 'type') {
      throw new Error(`El campo ${field.name} debe usar templateKey='type'.`);
    }
    if (!objectField.templates?.every((template) => template.fields.every((child) => child.nameOverride))) {
      throw new Error(`Todas las variantes de ${field.name} deben preservar sus nombres JSON con nameOverride.`);
    }
  }
}
