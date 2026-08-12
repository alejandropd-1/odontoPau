# Reporte Inicial: Alineación de Contratos y Seguridad CMS

## 1. Línea base
- **Rama:** `change/alinear-contratos-y-seguridad-cms`
- **SHA original de creación de rama:** `53f6004`
- **SHA merge-base sincronizado con main:** `09b9fddf384cd66cd39b645f8b74dde9bc7895b5`
- **Estado:** Árbol de trabajo limpio
- **Node.js:** v22.19.0
- **pnpm:** 11.1.2
- **OpenSpec:** 1.5.0
- **Stackbit (types):** @stackbit/types@2.1.15

## 2. Inventario de Componentes

### 2.1 Documentos JSON
- `src/data/home.json`
- `src/data/settings.json`
- `src/data/articulos/**/*.json`
- `src/data/instrucciones/**/*.json`
- `src/data/tratamientos/**/*.json`

### 2.2 Tipos e Interfaces TypeScript
- **HomePage**: No posee interfaz estricta.
- **GlobalSettings**: `GlobalSettings`.
- **Articulo**: `Article`, `ArticleImage`, `ArticleSource`, `ArticleDownload`, `ArticleCaseSummarySection`, `ArticleCaseFact`, `ArticleCaseApproach`, `ArticleTextSection`, `ArticleListSection`, `ArticleComparisonSection`, `ArticleComparisonRow`, `ArticleStatsSection`, `ArticleStat`, `ArticleGallerySection`, `ArticleFaqSection`, `ArticleFaqItem`, `ArticleQuoteSection`, `ArticleCtaSection`.
- **Instruccion**: `Instruccion`, `InstructionImage`, `InstructionResourceGallery`, `InstructionStepsSection`, `InstructionMatrixSection`, `InstructionMatrixGroup`, `InstructionNoticeSection`, `InstructionTextSection`.
- **Tratamiento**: `Tratamiento`, `TratamientoProfessional`.
- **CasoClinico**: `CasoClinico` (compartido).

### 2.3 Validadores Runtime
- **HomePage**: Ninguno.
- **GlobalSettings**: Ninguno.
- **Articulo**: `loadArticle`, `validateArticles`.
- **Instruccion**: `loadInstruction`, `validateInstructions`.
- **Tratamiento**: `loadTreatment` (parcial).
- **CasoClinico**: Ninguno (es cargado por `loadTreatment` sin validación efectiva).

### 2.4 Modelos y Objetos Reutilizables Stackbit
Definidos en `stackbit.config.ts` (el adaptador/snapshot contiene exactamente 29 modelos adaptados en Stackbit, diferenciados de los 31 modelos neutrales; `ArticleDownload` es un modelo neutral ausente de Stackbit y `GlobalSettings` está excluido de autoría en CMS):
- Modelos de página (4): `HomePage`, `Articulo`, `Instruccion`, `Tratamiento`.
- Objetos de datos (25): `CasoClinico`, `TreatmentProfessional`, `InstructionResourceGallery`, `InstructionImage`, `InstructionStepsSection`, `InstructionMatrixSection`, `InstructionMatrixGroup`, `InstructionNoticeSection`, `InstructionTextSection`, `ArticleImage`, `ArticleSource`, `ArticleCaseSummarySection`, `ArticleCaseFact`, `ArticleCaseApproach`, `ArticleTextSection`, `ArticleListSection`, `ArticleComparisonSection`, `ArticleComparisonRow`, `ArticleStatsSection`, `ArticleStat`, `ArticleGallerySection`, `ArticleFaqSection`, `ArticleFaqItem`, `ArticleQuoteSection`, `ArticleCtaSection`.

### 2.5 Renderizadores/Consumidores Principales
- **HomePage**: `src/app/page.tsx`
- **GlobalSettings**: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`
- **Articulo**: `src/app/articulos/[slug]/page.tsx`
- **Instruccion**: `src/app/instrucciones/[category]/[slug]/page.tsx`
- **Tratamiento**: `src/app/tratamientos/[id]/page.tsx`

## 3. Matriz de Paridad (Campo por Campo)

### 3.1 HomePage y GlobalSettings (Slice D)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| HomePage | `type` | scalar | string | All | N/A | NoVal | N/A | Cte:`HomePage` | persisted | - | `blocked` | Presente en JSON, sin validación RT, ausente en CMS. | D |
| HomePage | `title` | scalar | string | All | N/A | NoVal | Opt | - | persisted | - | `blocked` | Presente en JSON pero opcional en CMS y sin validador RT. | D |
| HomePage | `hero` | object | object | All | N/A | NoVal | Opt | - | persisted | - | `blocked` | Presente en JSON, opcional en CMS, sin validador RT. | D |
| HomePage | `hero.title` | scalar | string | All | N/A | NoVal | Opt | - | persisted | - | `blocked` | Presente en JSON, opcional en CMS, sin validador RT. | D |
| HomePage | `hero.description` | scalar | string | All | N/A | NoVal | Opt | - | persisted | - | `blocked` | Presente en JSON, opcional en CMS, sin validador RT. | D |
| HomePage | `hero.buttonPrimary` | scalar | string | Some | N/A | NoVal | Opt | - | persisted | - | `blocked` | Presente en JSON, opcional en CMS, sin validador RT. | D |
| HomePage | `hero.buttonSecondary`| scalar | string | Some | N/A | NoVal | Opt | - | persisted | - | `blocked` | Presente en JSON, opcional en CMS, sin validador RT. | D |
| GlobalSettings | `type` | scalar | string | All | N/A | NoVal | N/A | Cte:`GlobalSettings` | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `contact` | object | object | All | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `contact.whatsapp` | scalar | string | All | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `contact.whatsappMessage` | scalar | string | All | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `contact.email` | scalar | string | All | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `contact.address` | scalar | string | All | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `social` | object | object | All | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `social.instagram` | scalar | string | Some | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `social.facebook` | scalar | string | Some | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `footer` | object | object | All | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |
| GlobalSettings | `footer.text` | scalar | string | All | N/A | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice D). | D |

### 3.2 Tratamiento (Slice C)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tratamiento | `type` | scalar | string | All | Req | NoVal | Req | Cte:`Tratamiento` | persisted | - | `blocked` | Sin validador RT. | C |
| Tratamiento | `id` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT. | C |
| Tratamiento | `category` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT. | C |
| Tratamiento | `categoryLabel` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT. | C |
| Tratamiento | `order` | scalar | number | All | Req | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT, Opt en CMS. | C |
| Tratamiento | `tituloHero` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT. | C |
| Tratamiento | `descripcionHero` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT. | C |
| Tratamiento | `icon` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | TS asume req, CMS opcional, sin validador RT. | C |
| Tratamiento | `heroImage` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Tipo persistido string. TS req, CMS opcional, sin validador RT. | C |
| Tratamiento | `professionals` | list | object[] | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | C |
| Tratamiento | `features` | list | string[] | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | TS asume req, CMS opcional, sin validador RT. | C |
| Tratamiento | `casosClinicos` | list | object[] | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | TS asume req, CMS opcional, sin validador RT. | C |
| Tratamiento | `sourcePath` | scalar | string | None | Req | Validated | N/A | - | derived | - | `safe` | Calculado en RT, ajeno a CMS. | - |

#### TreatmentProfessional (Slice C)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TreatmentProfessional | `name` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | C |
| TreatmentProfessional | `role` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | C |
| TreatmentProfessional | `mobileRole` | scalar | string | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | C |
| TreatmentProfessional | `image` | scalar | string | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | C |
| TreatmentProfessional | `imageAlt` | scalar | string | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | C |

### 3.3 CasoClinico (Slice C)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CasoClinico | `id` | scalar | number | All | Req | NoVal | Req | - | persisted | - | `blocked` | Falta validador RT (Slice C). | C |
| CasoClinico | `articleSlug` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | opcional | `blocked` | Falta validador RT (Slice C). | C |
| CasoClinico | `paciente` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Falta validador RT (Slice C). | C |
| CasoClinico | `fecha` | scalar | string | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `titulo` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Falta validador RT (Slice C). | C |
| CasoClinico | `descripcion` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Falta validador RT (Slice C). | C |
| CasoClinico | `imagenAntes` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Falta validador RT (Slice C). | C |
| CasoClinico | `imagenDespues` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Falta validador RT (Slice C). | C |
| CasoClinico | `imagenes` | list | string[] | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `etiquetasImagenes` | list | string[] | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `estado` | scalar | string | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `testimonio` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Falta validador RT (Slice C). | C |
| CasoClinico | `desafio` | scalar | string | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `diagnostico` | scalar | string | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `duracion` | scalar | string | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `solucion` | scalar | string | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `solucionFeatures` | list | string[] | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `stats` | list | object[] | Some | Opt | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `stats[].value` | scalar | string | Some | Req | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |
| CasoClinico | `stats[].label` | scalar | string | Some | Req | NoVal | N/A | - | persisted | - | `pending` | Falta en CMS (Slice C). | C |

### 3.4 Articulo (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Articulo | `type` | scalar | string | All | Req | Validated | Req | Cte:`Articulo` | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `id` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `slug` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `category` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `categoryLabel` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `serviceIds` | list | string[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `titlePrefix` | scalar | string | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `breadcrumbLabel` | scalar | string | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `excerpt` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `author` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `clinicalReviewer` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | opcional | `blocked` | Omitido en la inspección de loadArticle (NoVal). | B |
| Articulo | `status` | scalar | string | All | Req | Validated | Req | - | persisted | estado | `safe` | Paridad OK. | B |
| Articulo | `createdAt` | scalar | string | Some | Opt | NoVal | N/A | - | persisted | meta | `blocked` | Falta en CMS pero persistido en JSON y sin validador RT. | B |
| Articulo | `publishedAt` | scalar | string | Some | Opt | Validated | Opt | - | persisted | meta | `blocked` | Req en RT si status=published, Opt en CMS. | B |
| Articulo | `updatedAt` | scalar | string | All | Req | Validated | Req | - | persisted | meta | `safe` | Paridad OK. | B |
| Articulo | `readTime` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `tags` | list | string[] | All | Req | Validated | Opt | - | persisted | - | `blocked` | Req en RT, Opt en CMS. | B |
| Articulo | `heroImage` | model | object | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `sources` | list | object[] | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `downloads` | list | object[] | Some | Opt | Validated | N/A | - | persisted | - | `pending` | Modelo ArticleDownload ausente en CMS (Slice B). | B |
| Articulo | `sections` | list | object[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Articulo | `sourcePath` | scalar | string | None | Req | Validated | N/A | - | derived | - | `safe` | Calculado en RT, ajeno a CMS. | - |

#### ArticleDownload (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleDownload | `name` | scalar | string | All | Req | Validated | N/A | - | persisted | - | `pending` | Falta modelo en CMS (Slice B). | B |
| ArticleDownload | `url` | scalar | string | All | Req | Validated | N/A | - | persisted | - | `pending` | Falta modelo en CMS (Slice B). | B |

#### ArticleImage (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleImage | `src` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Tipo persistido string. Paridad OK. | B |
| ArticleImage | `alt` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleImage | `width` | scalar | number | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleImage | `height` | scalar | number | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleImage | `label` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| ArticleImage | `caption` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Presente en CMS (text) y JSON, pero sin validador RT. | B |

#### ArticleSource (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleSource | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleSource | `publisher` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleSource | `url` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleCaseSummarySection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleCaseSummarySection | `type` | scalar | string | All | Req | Validated | Req | Cte:`case_summary` | persisted | - | `safe` | Paridad OK. | B |
| ArticleCaseSummarySection | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCaseSummarySection | `paragraphs` | list | string[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCaseSummarySection | `facts` | list | object[] | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCaseSummarySection | `approach` | model | object | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleCaseFact (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleCaseFact | `label` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCaseFact | `value` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleCaseApproach (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleCaseApproach | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCaseApproach | `text` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCaseApproach | `items` | list | string[] | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleTextSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleTextSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`text` | persisted | - | `safe` | Paridad OK. | B |
| ArticleTextSection | `title` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| ArticleTextSection | `paragraphs` | list | string[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleListSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleListSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`list` | persisted | - | `safe` | Paridad OK. | B |
| ArticleListSection | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleListSection | `intro` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| ArticleListSection | `items` | list | string[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleComparisonSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleComparisonSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`comparison` | persisted | - | `safe` | Paridad OK. | B |
| ArticleComparisonSection | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleComparisonSection | `intro` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| ArticleComparisonSection | `columns` | list | string[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleComparisonSection | `rows` | list | object[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleComparisonRow (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleComparisonRow | `label` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleComparisonRow | `values` | list | string[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleStatsSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleStatsSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`stats` | persisted | - | `safe` | Paridad OK. | B |
| ArticleStatsSection | `title` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| ArticleStatsSection | `items` | list | object[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleStat (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleStat | `value` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT en items. | B |
| ArticleStat | `label` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT en items. | B |
| ArticleStat | `description` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |

#### ArticleGallerySection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleGallerySection | `type` | scalar | string | All | Req | Validated | Req | Cte:`gallery` | persisted | - | `safe` | Paridad OK. | B |
| ArticleGallerySection | `title` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| ArticleGallerySection | `intro` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| ArticleGallerySection | `images` | list | object[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleFaqSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleFaqSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`faq` | persisted | - | `safe` | Paridad OK. | B |
| ArticleFaqSection | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleFaqSection | `items` | list | object[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### ArticleFaqItem (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleFaqItem | `question` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT en items. | B |
| ArticleFaqItem | `answer` | scalar | string | All | Req | NoVal | Req | - | persisted | - | `blocked` | Sin validador RT en items. | B |

#### ArticleQuoteSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleQuoteSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`quote` | persisted | - | `safe` | Paridad OK. | B |
| ArticleQuoteSection | `quote` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleQuoteSection | `attribution` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |

#### ArticleCtaSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ArticleCtaSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`cta` | persisted | - | `safe` | Paridad OK. | B |
| ArticleCtaSection | `label` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| ArticleCtaSection | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCtaSection | `text` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCtaSection | `href` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| ArticleCtaSection | `buttonLabel` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

### 3.5 Instruccion (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Instruccion | `type` | scalar | string | All | Req | Validated | Req | Cte:`Instruccion` | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `id` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `slug` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `category` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `categoryLabel` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `serviceId` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validación runtime de tipo o formato. | B |
| Instruccion | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `excerpt` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `status` | scalar | string | All | Req | Validated | Req | - | persisted | estado | `safe` | Paridad OK. | B |
| Instruccion | `createdAt` | scalar | string | Some | Opt | NoVal | N/A | - | persisted | meta | `blocked` | Persistido en JSON, ausente en CMS y sin validador RT. | B |
| Instruccion | `publishedAt` | scalar | string | Some | Opt | Validated | Opt | - | persisted | meta | `blocked` | Req en RT si status=published, Opt en CMS. | B |
| Instruccion | `updatedAt` | scalar | string | All | Req | Validated | Req | - | persisted | meta | `safe` | Paridad OK. | B |
| Instruccion | `clinicalReviewer` | scalar | string | Some | Opt | Validated | Opt | - | persisted | opcional | `blocked` | Req en RT si status=published, Opt en CMS. | B |
| Instruccion | `tags` | list | string[] | All | Req | Validated | Opt | - | persisted | - | `blocked` | Req en RT, Opt en CMS. | B |
| Instruccion | `readTime` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `heroLabel` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| Instruccion | `resourceImage` | model | object | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `resourceGallery` | model | object | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `socialImage` | model | object | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `sections` | list | object[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| Instruccion | `sourcePath` | scalar | string | None | Req | Validated | N/A | - | derived | - | `safe` | Calculado en RT, ajeno a CMS. | - |

#### InstructionImage (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| InstructionImage | `src` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Tipo persistido string. Paridad OK. | B |
| InstructionImage | `alt` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionImage | `width` | scalar | number | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionImage | `height` | scalar | number | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionImage | `label` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| InstructionImage | `downloadLabel` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| InstructionImage | `downloadSrc` | scalar | string | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |

#### InstructionResourceGallery (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| InstructionResourceGallery | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionResourceGallery | `intro` | scalar | string | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionResourceGallery | `images` | list | object[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### InstructionStepsSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| InstructionStepsSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`steps` | persisted | - | `safe` | Paridad OK. | B |
| InstructionStepsSection | `title` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| InstructionStepsSection | `intro` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| InstructionStepsSection | `items` | list | string[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### InstructionMatrixSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| InstructionMatrixSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`matrix` | persisted | - | `safe` | Paridad OK. | B |
| InstructionMatrixSection | `title` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| InstructionMatrixSection | `intro` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| InstructionMatrixSection | `groups` | list | object[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### InstructionMatrixGroup (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| InstructionMatrixGroup | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionMatrixGroup | `yes` | list | string[] | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionMatrixGroup | `caution` | list | string[] | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionMatrixGroup | `no` | list | string[] | Some | Opt | Validated | Opt | - | persisted | - | `safe` | Paridad OK. | B |

#### InstructionNoticeSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| InstructionNoticeSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`notice` | persisted | - | `safe` | Paridad OK. | B |
| InstructionNoticeSection | `tone` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionNoticeSection | `title` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |
| InstructionNoticeSection | `text` | scalar | string | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

#### InstructionTextSection (Slice B)
| Modelo | Ruta | Forma | Tipo Persistido | JSON | TS | Runtime | CMS | Cte/Discr | Origen | Cond. Editorial | Estado | Motivo | Slice |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| InstructionTextSection | `type` | scalar | string | All | Req | Validated | Req | Cte:`text` | persisted | - | `safe` | Paridad OK. | B |
| InstructionTextSection | `title` | scalar | string | Some | Opt | NoVal | Opt | - | persisted | - | `blocked` | Sin validador RT. | B |
| InstructionTextSection | `paragraphs` | list | string[] | All | Req | Validated | Req | - | persisted | - | `safe` | Paridad OK. | B |

## 4. Resumen Estadístico
### 4.1 Resumen Estadístico de Estados
- Total de modelos neutrales: **31** (29 adaptados a Stackbit, `GlobalSettings` y `ArticleDownload` ausentes del CMS)
- Total de campos / rutas analizadas: **188**
- Campos en estado **`safe`**: **104**
- Campos en estado **`blocked`**: **58**
- Campos en estado **`pending`**: **26**

Desglose por secciones:
- **3.1 HomePage y GlobalSettings (Slice D)**: 18 filas — 0 safe, 7 blocked, 11 pending
- **3.2 Tratamiento y TreatmentProfessional (Slice C)**: 18 filas — 7 safe, 11 blocked, 0 pending
- **3.3 CasoClinico (Slice C)**: 20 filas — 0 safe, 8 blocked, 12 pending
- **3.4 Articulo y objetos anidados (Slice B)**: 82 filas — 60 safe, 19 blocked, 3 pending
- **3.5 Instruccion y objetos anidados (Slice B)**: 50 filas — 37 safe, 13 blocked, 0 pending

## 5. Documentación Operativa y Gobernanza CMS

### 5.1 Alcance Medido y Cobertura Local
- **Modelos Neutrales**: 31 modelos declarados en el manifest neutral.
- **Modelos Adaptados (Stackbit)**: 29 modelos (4 de página, 25 de objeto; excluyendo `GlobalSettings` y `ArticleDownload`).
- **Rutas Contractuales Analizadas**: 188 rutas de campo evaluadas en 4 capas (JSON, TS, Runtime, CMS).
- **Pruebas de Verificación Ejecutables**:
  - `pnpm run test:cms-equivalence`: verifica paridad neutral, snapshot Stackbit, aserciones específicas y 23 casos negativos sintéticos.
  - `pnpm run validate:cms-contracts`: gate completo de 188 rutas (104 safe, 58 blocked, 26 pending), round-trip en memoria (36 fixtures, 1691 campos preservados) y guardia de no mutación en `src/data`.

### 5.2 Limitaciones frente a Netlify Visual Editor
- **Entorno Offline vs. Sesión Real**: El gate local opera en memoria sin red ni credenciales externas. Valida contratos de datos y serialización, pero no sustituye la inspección de la interfaz web en vivo en un Deploy Preview.
- **Interacciones de Interfaz CMS**: Componentes visuales iframe, selecciones de control de formularios, previews dinámicos y eventos de edición de Netlify Visual Editor requieren verificación visual humana en staging/preview.

### 5.3 Modelos Bloqueados y Responsables por Slices de Resolución
- **Slice B — Artículos e Instrucciones (32 rutas bloqueadas, 3 pendientes)**:
  - *Responsable*: Futuro OpenSpec `Slice B: Habilitación CMS de Artículos e Instrucciones`.
  - *Acción*: Implementar validación runtime completa en `loadArticle` y `loadInstruction` para campos opcionales (`NoVal`), y alinear obligatoriedad Stackbit para metadatos editoriales (`publishedAt`, `clinicalReviewer`, `createdAt`, `updatedAt`, `readTime`, `tags`, etc.).
- **Slice C — Tratamientos y Casos Clínicos (19 rutas bloqueadas, 12 pendientes)**:
  - *Responsable*: Futuro OpenSpec `Slice C: Habilitación CMS de Tratamientos y Casos Clínicos`.
  - *Acción*: Crear validación runtime en `loadTreatment` para campos raíz (`tituloHero`, `descripcionHero`, `order`, etc.), e incorporar el schema de `CasoClinico` al adaptador CMS para cubrir sus 12 campos ausentes (`pending`).
- **Slice D — Páginas Globales y Configuración (7 rutas bloqueadas, 11 pendientes)**:
  - *Responsable*: Futuro OpenSpec `Slice D: Habilitación CMS de Páginas Globales y Configuración`.
  - *Acción*: Implementar validador runtime para `HomePage` e incorporar `GlobalSettings` al adaptador CMS para cubrir sus 11 campos ausentes (`pending`).

### 5.4 Prohibición de Habilitación de Escritura CMS
- **Regla de Seguridad**: Ningún modelo o campo clasificado como `blocked` o `pending` puede habilitarse para escritura CMS (Stackbit/Netlify) únicamente por el hecho de compilar TypeScript o pasar la suite de pruebas locales.
- **Criterio de Cierre**: La habilitación de escritura requiere que el slice correspondiente eleve el campo a estado `safe` con representación en las 4 capas, obtenga validación automática limpia y cuente con aprobación clínica previa de Paula y autorización explícita final de Alejandro.
