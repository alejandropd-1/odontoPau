import type { Article, ArticleSection } from '@/data/articulos';
import type { Instruccion, InstructionSection } from '@/data/instrucciones';
import type { HomePageData, TreatmentsPageData } from '@/data/site-pages';
import type { Tratamiento } from '@/data/tratamientos';

export type VisualRecord = Record<string, unknown>;

export interface TinaVisualPayload<T extends VisualRecord> {
  query: string;
  variables: { relativePath: string };
  data: T;
}

const articleSectionTypes: Record<ArticleSection['type'], string> = {
  case_summary: 'ArticuloSectionsCase_summary',
  text: 'ArticuloSectionsText',
  list: 'ArticuloSectionsList',
  comparison: 'ArticuloSectionsComparison',
  stats: 'ArticuloSectionsStats',
  gallery: 'ArticuloSectionsGallery',
  faq: 'ArticuloSectionsFaq',
  quote: 'ArticuloSectionsQuote',
  cta: 'ArticuloSectionsCta',
};

const instructionSectionTypes: Record<InstructionSection['type'], string> = {
  steps: 'InstruccionSectionsSteps',
  matrix: 'InstruccionSectionsMatrix',
  notice: 'InstruccionSectionsNotice',
  text: 'InstruccionSectionsText',
};

const articleTypeByTypename = Object.fromEntries(
  Object.entries(articleSectionTypes).map(([type, typename]) => [typename, type])
) as Record<string, ArticleSection['type']>;

const instructionTypeByTypename = Object.fromEntries(
  Object.entries(instructionSectionTypes).map(([type, typename]) => [typename, type])
) as Record<string, InstructionSection['type']>;

function withoutSystemMetadata(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutSystemMetadata);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value as VisualRecord)
      .filter(([key]) => !['_content_source', '__typename', '_sys'].includes(key))
      .map(([key, child]) => [key, withoutSystemMetadata(child)])
  );
}

function toVisualSection(
  section: ArticleSection | InstructionSection,
  typenames: Record<string, string>
): VisualRecord {
  const { type, ...fields } = section;
  return {
    __typename: typenames[type],
    ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [`${type}_${key}`, value])),
  };
}

function fromVisualSection<T extends string>(
  section: VisualRecord,
  typesByTypename: Record<string, T>
): VisualRecord {
  const type = typesByTypename[String(section.__typename ?? '')];
  if (!type) throw new Error(`Sección Tina desconocida: ${String(section.__typename ?? 'sin tipo')}.`);

  const prefix = `${type}_`;
  return {
    type,
    ...Object.fromEntries(
      Object.entries(section)
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, value]) => [key.slice(prefix.length), withoutSystemMetadata(value)])
    ),
  };
}

function collectionRelativePath(
  sourcePath: string,
  collection: 'articulos' | 'instrucciones' | 'tratamientos'
): string {
  const normalized = sourcePath.replace(/\\/g, '/');
  const marker = `/src/data/${collection}/`;
  const index = `/${normalized}`.indexOf(marker);
  if (index < 0) throw new Error(`Ruta Tina inválida para ${collection}: ${sourcePath}.`);
  return `/${normalized}`.slice(index + marker.length);
}

function rootSystemFields(sourcePath: string, relativePath: string): VisualRecord {
  const filename = relativePath.replace(/\.json$/, '').split('/').at(-1) ?? '';
  return {
    id: sourcePath,
    _sys: {
      filename,
      relativePath,
    },
  };
}

export function createHomeVisualPayload(
  home: HomePageData
): TinaVisualPayload<{ homepage: VisualRecord }> {
  const relativePath = 'home.json';
  return {
    query: HOME_VISUAL_QUERY,
    variables: { relativePath },
    data: {
      homepage: {
        __typename: 'Homepage',
        ...rootSystemFields('src/data/home.json', relativePath),
        ...home,
      },
    },
  };
}

export function homeFromVisualData(
  editorDocument: VisualRecord,
  fallback: HomePageData
): HomePageData {
  const { id: _documentId, ...clean } = withoutSystemMetadata(editorDocument) as Partial<HomePageData> & {
    id?: string;
  };
  return {
    ...fallback,
    ...clean,
    hero: { ...fallback.hero, ...(clean.hero ?? {}) },
    services: { ...fallback.services, ...(clean.services ?? {}) },
    team: {
      ...fallback.team,
      ...(clean.team ?? {}),
      featured: { ...fallback.team.featured, ...(clean.team?.featured ?? {}) },
      members: Array.isArray(clean.team?.members) ? clean.team.members : fallback.team.members,
    },
    location: {
      ...fallback.location,
      ...(clean.location ?? {}),
      addressLines: Array.isArray(clean.location?.addressLines)
        ? clean.location.addressLines
        : fallback.location.addressLines,
      hours: Array.isArray(clean.location?.hours) ? clean.location.hours : fallback.location.hours,
    },
  };
}

export function createTreatmentsPageVisualPayload(
  page: TreatmentsPageData
): TinaVisualPayload<{ treatmentspage: VisualRecord }> {
  const relativePath = 'tratamientos-page.json';
  return {
    query: TREATMENTS_PAGE_VISUAL_QUERY,
    variables: { relativePath },
    data: {
      treatmentspage: {
        __typename: 'Treatmentspage',
        ...rootSystemFields('src/data/tratamientos-page.json', relativePath),
        ...page,
      },
    },
  };
}

export function treatmentsPageFromVisualData(
  editorDocument: VisualRecord,
  fallback: TreatmentsPageData
): TreatmentsPageData {
  const { id: _documentId, ...clean } = withoutSystemMetadata(editorDocument) as Partial<TreatmentsPageData> & {
    id?: string;
  };
  return {
    ...fallback,
    ...clean,
  };
}

export function createTreatmentVisualPayload(
  treatment: Tratamiento
): TinaVisualPayload<{ tratamiento: VisualRecord }> {
  const relativePath = collectionRelativePath(treatment.sourcePath, 'tratamientos');
  const { id, sourcePath, ...fields } = treatment;
  return {
    query: TREATMENT_VISUAL_QUERY,
    variables: { relativePath },
    data: {
      tratamiento: {
        __typename: 'Tratamiento',
        ...rootSystemFields(sourcePath, relativePath),
        ...fields,
        internalId: id,
      },
    },
  };
}

export function treatmentFromVisualData(
  editorDocument: VisualRecord,
  fallback: Tratamiento
): Tratamiento {
  const clean = withoutSystemMetadata(editorDocument) as VisualRecord;
  const { internalId, id: _documentId, ...fields } = clean;
  return {
    ...fallback,
    ...(fields as unknown as Partial<Tratamiento>),
    id: typeof internalId === 'string' ? internalId : fallback.id,
    sourcePath: fallback.sourcePath,
    professionals: Array.isArray(fields.professionals)
      ? (fields.professionals as Tratamiento['professionals'])
      : fallback.professionals,
    features: Array.isArray(fields.features) ? (fields.features as string[]) : [],
    casosClinicos: Array.isArray(fields.casosClinicos)
      ? (fields.casosClinicos as Tratamiento['casosClinicos'])
      : [],
  };
}

export function createArticleVisualPayload(article: Article): TinaVisualPayload<{ articulo: VisualRecord }> {
  const relativePath = collectionRelativePath(article.sourcePath, 'articulos');
  const { id, sourcePath, sections, ...fields } = article;
  return {
    query: ARTICLE_VISUAL_QUERY,
    variables: { relativePath },
    data: {
      articulo: {
        __typename: 'Articulo',
        ...rootSystemFields(sourcePath, relativePath),
        ...fields,
        internalId: id,
        sections: sections.map((section) => toVisualSection(section, articleSectionTypes)),
      },
    },
  };
}

export function articleFromVisualData(editorDocument: VisualRecord, fallback: Article): Article {
  const clean = withoutSystemMetadata(editorDocument) as VisualRecord;
  const { internalId, id: _documentId, sections: _cleanSections, ...fields } = clean;
  const editorSections = editorDocument.sections;
  const live = {
    ...fields,
    id: internalId,
    sections: Array.isArray(editorSections)
      ? editorSections.map((section) => fromVisualSection(section as VisualRecord, articleTypeByTypename))
      : [],
  } as unknown as Article;

  return {
    ...fallback,
    ...live,
    id: typeof live.id === 'string' ? live.id : fallback.id,
    sourcePath: fallback.sourcePath,
    serviceIds: Array.isArray(live.serviceIds) ? live.serviceIds : [],
    tags: Array.isArray(live.tags) ? live.tags : [],
    heroImage: live.heroImage || fallback.heroImage,
    sections: Array.isArray(live.sections) ? live.sections : [],
  };
}

export function createInstructionVisualPayload(
  instruction: Instruccion
): TinaVisualPayload<{ instruccion: VisualRecord }> {
  const relativePath = collectionRelativePath(instruction.sourcePath, 'instrucciones');
  const { id, sourcePath, sections, ...fields } = instruction;
  return {
    query: INSTRUCTION_VISUAL_QUERY,
    variables: { relativePath },
    data: {
      instruccion: {
        __typename: 'Instruccion',
        ...rootSystemFields(sourcePath, relativePath),
        ...fields,
        internalId: id,
        sections: sections.map((section) => toVisualSection(section, instructionSectionTypes)),
      },
    },
  };
}

export function instructionFromVisualData(
  editorDocument: VisualRecord,
  fallback: Instruccion
): Instruccion {
  const clean = withoutSystemMetadata(editorDocument) as VisualRecord;
  const { internalId, id: _documentId, sections: _cleanSections, ...fields } = clean;
  const editorSections = editorDocument.sections;
  const live = {
    ...fields,
    id: internalId,
    sections: Array.isArray(editorSections)
      ? editorSections.map((section) => fromVisualSection(section as VisualRecord, instructionTypeByTypename))
      : [],
  } as unknown as Instruccion;

  return {
    ...fallback,
    ...live,
    id: typeof live.id === 'string' ? live.id : fallback.id,
    sourcePath: fallback.sourcePath,
    tags: Array.isArray(live.tags) ? live.tags : [],
    sections: Array.isArray(live.sections) ? live.sections : [],
  };
}

export function tinaTemplateField(type: string, field: string): string {
  return `${type}_${field}`;
}

export const HOME_VISUAL_QUERY = /* GraphQL */ `
  query VisualHomePage($relativePath: String!) {
    homepage(relativePath: $relativePath) {
      ... on Document { id _sys { filename relativePath } }
      __typename type title
      hero { __typename title description buttonPrimary buttonSecondary backgroundImage backgroundAlt eyebrow scrollLabel }
      services { __typename title description linkLabel }
      team {
        __typename eyebrow title description
        featured { __typename name license role image imageAlt }
        members { __typename name license role image imageAlt }
      }
      location {
        __typename title description addressTitle addressLines hoursTitle hours
        whatsappLabel whatsappHref mapEmbedUrl mapTitle placeName placeAddress
        directionsLabel directionsHref
      }
    }
  }
`;

export const TREATMENTS_PAGE_VISUAL_QUERY = /* GraphQL */ `
  query VisualTreatmentsPage($relativePath: String!) {
    treatmentspage(relativePath: $relativePath) {
      ... on Document { id _sys { filename relativePath } }
      __typename type title eyebrow heading description
      instructionsEyebrow instructionsHeading instructionsDescription cardLinkLabel
    }
  }
`;

export const TREATMENT_VISUAL_QUERY = /* GraphQL */ `
  query VisualTreatment($relativePath: String!) {
    tratamiento(relativePath: $relativePath) {
      ... on Document { id _sys { filename relativePath } }
      __typename type internalId category categoryLabel order tituloHero descripcionHero icon heroImage
      pageCopy {
        __typename heroEyebrow heroCtaLabel casesTitle casesDescription caseLinkLabel
        articlesEyebrow articlesTitle articleLinkLabel allArticlesPrefix featuresTitlePrefix
        ctaTitle ctaDescription ctaButtonLabel
      }
      professionals { __typename name role mobileRole image imageAlt }
      features
      casosClinicos {
        __typename id articleSlug paciente fecha titulo descripcion imagenAntes imagenDespues
        imagenes etiquetasImagenes estado testimonio desafio diagnostico duracion solucion
        solucionFeatures stats { __typename value label }
      }
    }
  }
`;

export const ARTICLE_VISUAL_QUERY = /* GraphQL */ `
  query VisualArticulo($relativePath: String!) {
    articulo(relativePath: $relativePath) {
      ... on Document { id _sys { filename relativePath } }
      __typename type internalId slug category categoryLabel serviceIds titlePrefix breadcrumbLabel
      title excerpt author clinicalReviewer status createdAt publishedAt updatedAt readTime tags
      heroImage { __typename src alt width height label caption }
      sources { __typename title publisher url }
      downloads { __typename name url }
      sections {
        __typename
        ... on ArticuloSectionsCase_summary {
          case_summary_title case_summary_paragraphs
          case_summary_facts { __typename label value }
          case_summary_approach { __typename title text items }
        }
        ... on ArticuloSectionsText { text_title text_paragraphs }
        ... on ArticuloSectionsList { list_title list_intro list_items }
        ... on ArticuloSectionsComparison {
          comparison_title comparison_intro comparison_columns
          comparison_rows { __typename label values }
        }
        ... on ArticuloSectionsStats {
          stats_title stats_items { __typename value label description }
        }
        ... on ArticuloSectionsGallery {
          gallery_title gallery_intro
          gallery_images { __typename src alt width height label caption }
        }
        ... on ArticuloSectionsFaq {
          faq_title faq_items { __typename question answer }
        }
        ... on ArticuloSectionsQuote { quote_quote quote_attribution }
        ... on ArticuloSectionsCta { cta_label cta_title cta_text cta_href cta_buttonLabel }
      }
    }
  }
`;

export const INSTRUCTION_VISUAL_QUERY = /* GraphQL */ `
  query VisualInstruccion($relativePath: String!) {
    instruccion(relativePath: $relativePath) {
      ... on Document { id _sys { filename relativePath } }
      __typename type internalId slug category categoryLabel serviceId title excerpt status
      createdAt publishedAt updatedAt clinicalReviewer tags readTime heroLabel
      resourceImage { __typename src alt width height label downloadLabel downloadSrc }
      resourceGallery {
        __typename title intro
        images { __typename src alt width height label downloadLabel downloadSrc }
      }
      socialImage { __typename src alt width height label downloadLabel downloadSrc }
      sections {
        __typename
        ... on InstruccionSectionsSteps { steps_title steps_intro steps_items }
        ... on InstruccionSectionsMatrix {
          matrix_title matrix_intro
          matrix_groups { __typename title yes caution no }
        }
        ... on InstruccionSectionsNotice { notice_tone notice_title notice_text }
        ... on InstruccionSectionsText { text_title text_paragraphs }
      }
    }
  }
`;
