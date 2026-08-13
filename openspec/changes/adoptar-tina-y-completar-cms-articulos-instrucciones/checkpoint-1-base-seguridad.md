## Checkpoint 1: base, alcance y seguridad

Fecha del relevamiento: 2026-08-12.

### Estado Git y versiones

- Rama de implementación: `change/adoptar-tina-y-completar-cms-articulos-instrucciones`.
- SHA base de `main`: `bfffd0a3f5aa4f69075615731aaca152505ab2ea`.
- La rama fue adelantada por fast-forward hasta esa revisión antes de modificar archivos.
- El árbol estaba limpio y no contenía cambios ajenos. `.codegraph/daemon.pid` permanece ignorado y fuera del alcance.
- Node.js: `22.19.0`.
- pnpm: `11.1.2`.
- OpenSpec CLI y dependencia local: `1.5.0`.
- Next.js instalado: `15.5.18`.
- TinaCMS: no instalado al comenzar este slice.
- Adaptador histórico Stackbit: `@stackbit/types@2.1.15` y `@stackbit/cms-git@1.0.38`.

### Inventario de la frontera CMS vigente

- `stackbit.config.ts` conserva la configuración del proveedor anterior y consume `src/cms/models.ts`.
- `src/cms/models.ts` contiene 29 modelos Stackbit: cuatro páginas y 25 objetos.
- `src/cms/stackbit-base-snapshot.json` y el snapshot archivado preservan la evidencia normalizada del adaptador anterior.
- `src/cms/manifests.ts` y `src/cms/baseline.ts` describen 31 modelos neutrales y 188 rutas contractuales.
- `src/cms/fixtures.ts`, `resolver.ts`, `roundtrip.ts`, `structural-comparator.ts`, `equivalence-test.ts` y `validate-cms-contracts.ts` forman la base reproducible de comparación y no mutación.
- El reporte archivado de `alinear-contratos-y-seguridad-cms` registra 188 rutas, 36 fixtures y 1691 campos preservados en el round-trip previo.
- El contenido real observado comprende 13 Artículos y cuatro Instrucciones JSON. No se modificará durante las pruebas del adaptador.

### Alcance contractual exacto del Slice B

El baseline contiene 130 rutas Slice B distribuidas en 26 modelos: 95 estaban clasificadas `safe`, 32 `blocked` y tres `pending` frente al adaptador anterior. Esas clasificaciones son la línea de partida, no una aprobación automática de Tina.

| Modelo | Rutas | Paths que Tina debe conservar |
|---|---:|---|
| Articulo | 22 | `type`, `id`, `slug`, `category`, `categoryLabel`, `serviceIds`, `titlePrefix`, `breadcrumbLabel`, `title`, `excerpt`, `author`, `clinicalReviewer`, `status`, `createdAt`, `publishedAt`, `updatedAt`, `readTime`, `tags`, `heroImage`, `sources`, `downloads`, `sections` |
| ArticleImage | 6 | `src`, `alt`, `width`, `height`, `label`, `caption` |
| ArticleSource | 3 | `title`, `publisher`, `url` |
| ArticleDownload | 2 | `name`, `url` |
| ArticleCaseSummarySection | 5 | `type`, `title`, `paragraphs`, `facts`, `approach` |
| ArticleCaseFact | 2 | `label`, `value` |
| ArticleCaseApproach | 3 | `title`, `text`, `items` |
| ArticleTextSection | 3 | `type`, `title`, `paragraphs` |
| ArticleListSection | 4 | `type`, `title`, `intro`, `items` |
| ArticleComparisonSection | 5 | `type`, `title`, `intro`, `columns`, `rows` |
| ArticleComparisonRow | 2 | `label`, `values` |
| ArticleStatsSection | 3 | `type`, `title`, `items` |
| ArticleStat | 3 | `value`, `label`, `description` |
| ArticleGallerySection | 4 | `type`, `title`, `intro`, `images` |
| ArticleFaqSection | 3 | `type`, `title`, `items` |
| ArticleFaqItem | 2 | `question`, `answer` |
| ArticleQuoteSection | 3 | `type`, `quote`, `attribution` |
| ArticleCtaSection | 6 | `type`, `label`, `title`, `text`, `href`, `buttonLabel` |
| Instruccion | 20 | `type`, `id`, `slug`, `category`, `categoryLabel`, `serviceId`, `title`, `excerpt`, `status`, `createdAt`, `publishedAt`, `updatedAt`, `clinicalReviewer`, `tags`, `readTime`, `heroLabel`, `resourceImage`, `resourceGallery`, `socialImage`, `sections` |
| InstructionImage | 7 | `src`, `alt`, `width`, `height`, `label`, `downloadLabel`, `downloadSrc` |
| InstructionResourceGallery | 3 | `title`, `intro`, `images` |
| InstructionStepsSection | 4 | `type`, `title`, `intro`, `items` |
| InstructionMatrixSection | 4 | `type`, `title`, `intro`, `groups` |
| InstructionMatrixGroup | 4 | `title`, `yes`, `caution`, `no` |
| InstructionNoticeSection | 4 | `type`, `tone`, `title`, `text` |
| InstructionTextSection | 3 | `type`, `title`, `paragraphs` |

Quedan expresamente fuera de escritura en este slice las 37 rutas C de `Tratamiento`, `TreatmentProfessional` y `CasoClinico`; las 18 rutas D de `HomePage` y `GlobalSettings`; y las tres rutas derivadas ajenas a edición. No se presentarán como cubiertas por Tina.

### Proyecto TinaCloud y límites de acceso

- Destino: un proyecto TinaCloud exclusivo para OdontoPau, sin compartir contenido, tokens, roles ni panel con otros sitios.
- Estado inicial: no existe conexión Tina ni variables Tina detectadas en el checkout. Hasta provisionar y verificar el proyecto, solamente se habilitará el modo local sobre filesystem.
- Alejandro será administrador y autoridad de merge. Paula podrá incorporarse como editora del proyecto o continuar aprobando el preview; esa decisión se toma antes del piloto autenticado.
- Ningún usuario Tina obtiene autoridad para mezclar a `main`, aprobar contenido clínico o publicar producción.
- Tina no almacenará historias clínicas, consentimientos privados, secretos ni evidencia identificatoria de pacientes.

### Variables documentadas sin valores

| Variable | Exposición | Uso previsto |
|---|---|---|
| `NEXT_PUBLIC_TINA_CLIENT_ID` | Pública | Identificador del proyecto TinaCloud de OdontoPau. |
| `TINA_TOKEN` | Secreta, solo build/servidor | Token de acceso requerido por TinaCloud; nunca se versiona ni llega al navegador. |
| `NEXT_PUBLIC_TINA_BRANCH` | Pública | Rama exacta no productiva que el admin remoto puede editar. |
| `TINA_PUBLIC_IS_LOCAL` | Pública y controlada por CLI | Diferencia el backend local filesystem del backend remoto. No se fija manualmente en producción. |

`.env.local` sigue ignorado. `.env.example` deberá listar únicamente nombres y explicaciones seguras cuando se implemente la infraestructura, sin valores reales.

### Contrato de rama y guardas obligatorias

- Durante este OpenSpec, la única rama remota autorizada para escritura/prueba será `change/adoptar-tina-y-completar-cms-articulos-instrucciones`.
- No habrá fallback silencioso a `main`. En modo remoto, una rama ausente, vacía, `main` o `master` debe bloquear el schema/admin y fallar en CI.
- El modo local puede escribir solo el checkout actual mediante el filesystem de Tina; no autentica ni publica remotamente.
- Deploy Preview debe resolver la misma rama del PR y no puede promocionarse a producción fuera del merge Git autorizado.
- Tina guarda contenido; GitCron/GitHub conservan la creación/actualización del Draft PR, los checks, la revisión y el merge.
- La selección editorial `published` no equivale a publicación: producción cambia únicamente cuando Alejandro autoriza el merge a `main`.
- La conexión real, permisos, rama resuelta y acceso de Paula se comprobarán en la tarea 5.3. Cualquier diferencia con este contrato detiene la habilitación remota.

### Gate de salida del checkpoint

El trabajo local puede continuar sin TinaCloud porque no existe escritura remota habilitada. El slice queda bloqueado para uso editorial real hasta demostrar proyecto aislado, permisos correctos y rama no productiva en una sesión autenticada.
