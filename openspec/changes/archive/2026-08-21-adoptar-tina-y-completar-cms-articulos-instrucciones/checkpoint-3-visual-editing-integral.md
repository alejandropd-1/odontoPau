# Checkpoint 3 — Visual Editing integral

Fecha: 2026-08-12

## Alcance implementado

- Inicio: portada, presentación de servicios, equipo, ubicación y contacto.
- Índice de Tratamientos: encabezados, descripciones, enlaces y tarjetas alimentadas por los tratamientos canónicos.
- Seis Tratamientos existentes: hero, profesionales, casos clínicos, aspectos, artículos vinculados y llamados a la acción.
- Artículos e Instrucciones: campos raíz, imágenes, listas, objetos y secciones discriminadas.
- Panel Tina custom: accesos y conteos de las cinco superficies editoriales. No reemplaza ni mezcla el futuro dashboard `/editorial` con Supabase.

Las colecciones institucionales y de Tratamientos son de solo edición. Las altas continúan limitadas a Artículos e Instrucciones y nacen como `draft`.

## Arquitectura comprobada

- JSON + Git continúa siendo la fuente pública canónica.
- Los loaders del servidor entregan el dato inicial y `useTina` lo vuelve reactivo solamente dentro del editor.
- `ui.router` resuelve Inicio mediante `/inicio-editorial` no indexable, el índice `/tratamientos`, los detalles `/tratamientos/{id}`, Artículos e Instrucciones.
- La forma GraphQL se normaliza antes de reutilizar los renderizadores públicos.
- La baseline histórica de 188 rutas queda inmutable; una proyección en memoria verifica el contrato anterior y los gates Tina verifican el contrato incremental.

## Evidencia visual local

Las cinco rutas reales respondieron HTTP 200 y expusieron marcadores contextual-editing:

| Superficie | Ruta verificada | Marcadores |
|---|---|---:|
| Inicio | `/` | 49 |
| Índice de Tratamientos | `/tratamientos` | 13 |
| Tratamiento | `/tratamientos/estetica-dental` | 28 |
| Artículo | `/articulos/blanqueamiento-dentario-tecnica-ambulatoria` | 19 |
| Instrucción | `/instrucciones/ortodoncia/indicaciones-alineadores-keepsmiling` | 22 |

En Inicio se modificó temporalmente el título en el formulario y la vista reaccionó sin recargar; el valor de prueba no se persistió. En la Instrucción se seleccionaron desde la vista el título y una matriz anidada; Tina enfocó el campo y el grupo correctos. El round-trip GraphQL local creó, editó y eliminó contenido sintético, y el hash final de `src/data` fue idéntico al inicial.

Una captura de requests sobre las cinco rutas públicas registró cero llamadas a `localhost:4101/graphql`, `content.tinajs.io` o `api.tina.io`. El único error de consola observado dentro del admin local fue el `favicon.ico` histórico ausente; no afecta contenido, Tina ni el build.

## Gates ejecutados

- `pnpm run build:cms:local`: Tina build completo.
- `pnpm run validate:tina-content`: audit de 25 documentos aprobado.
- `pnpm run validate:tina-lock`: lock reproducible.
- `pnpm run validate:tina-branch`: 8 escenarios; `main`/`master` bloqueadas.
- `pnpm run test:tina-adapter`: 26/26 modelos y 130/130 rutas Slice B.
- `pnpm run test:tina-media`: MP4 por referencia controlada; traversal/extensiones bloqueados.
- `pnpm run test:tina-editorial-rules`: altas seguras y colecciones institucionales sin alta/borrado.
- `pnpm run test:tina-runtime`: 35/35 brechas y 130/130 rutas vigentes.
- `pnpm run test:tina-local-roundtrip`: create/edit/delete y no mutación final.
- `pnpm run test:tina-visual`: cinco superficies, normalización y routers 5/5.
- `pnpm run test:cms-equivalence`: 188/188 rutas históricas.
- `pnpm run validate:cms-contracts`: 0 violaciones, round-trip 36/36 y 31 archivos sin mutación.
- `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`, `git diff --check` y `pnpm run validate:openspec`: aprobados.

## Pendiente del cambio

- 5.4: Draft PR, CI, Deploy Preview y evidencia de escritura en la rama exacta.
- 5.5: auditoría del preview desktop/mobile, accesibilidad, SEO/noindex y aprobación clínica/visual aplicable.
- 6.1: validación final exclusiva de Alejandro.

No se realizó commit, push, PR, merge, archive ni deploy en este checkpoint.

## Refinamiento editorial aprobado — 2026-08-13

- Los campos simples comparten una capa Material coherente: altura mínima de 56 px, label flotante, foco visible, ayuda y error accesibles, con movimiento reducido cuando el sistema lo solicita.
- La capa se implementa con componentes públicos de Tina y carga sus estilos una sola vez en el documento del admin; no modifica internals ni el sitio público.
- Selectores, fechas, imágenes, objetos y listas extensas conservan los controles especializados de Tina para no degradar semántica ni mantenimiento.
- Tags y listas breves usan chips nativos; párrafos, pasos y recomendaciones permanecen como elementos separados, sin serialización por comas.
- Las imágenes compuestas muestran ayuda contextual y conservan la navegación nativa por breadcrumb al formulario padre.
- Cada caso clínico mantiene su URL propia y el artículo relacionado queda como CTA secundario opcional. Debido a que los casos son objetos anidados en un único documento Tratamiento, Tina 3.11 conserva la preview del tratamiento al editar el subformulario; cambiar la preview por caso exigiría independizarlos como documentos y queda fuera de este cambio.

Después del refinamiento aprobaron nuevamente: schema local, auditoría de 25 documentos, adapter 26/26 y 130/130, reglas editoriales, contrato visual, equivalencia histórica 188/188, contratos con 0 violaciones y 36/36 round-trips, TypeScript, ESLint, build Next de 56 páginas, `git diff --check` y OpenSpec estricto 18/18. No se mutó contenido público durante las pruebas.

## Cierre local reproducible — 2026-08-13

- Se abrieron desde Tina las seis superficies reales exigidas: Inicio, índice de Tratamientos, Tratamiento Endodoncia, su caso clínico 1, un Artículo y una Instrucción.
- En el Artículo se cambió temporalmente el tiempo de lectura, la vista reaccionó, Tina guardó el JSON y luego se restauró el valor y el archivo exacto original. El contenido público terminó sin diferencias residuales por esa prueba.
- Se corrigió la entrega de valores de los inputs custom a Final Form y se excluyeron del documento persistido los metadatos internos raíz `sourcePath` y `_template`.
- Las seis páginas públicas registraron cero requests a Tina local o TinaCloud fuera del iframe editorial.
- A 320 px no hubo desborde horizontal; el caso clínico que inicialmente medía 324 px quedó en 320/320. Ninguna imagen carece del atributo `alt`; los `alt=""` observados corresponden a recursos decorativos acompañados por texto equivalente.
- El runner del adaptador cierra explícitamente después de validar, evitando procesos Node huérfanos en CI.

Con esta evidencia se completa 5.3. Continúan pendientes 5.4 (Draft PR, CI, Deploy Preview y rama remota exacta), 5.5 (auditoría del preview y aprobación humana aplicable) y 6.1 (validación final exclusiva de Alejandro).

## Checkpoint remoto — 2026-08-20

- Draft PR: `#12`, desde `change/adoptar-tina-y-completar-cms-articulos-instrucciones` hacia `main`.
- Revisión verificada: `25622b6`; el gate de GitHub terminó aprobado, incluidos contratos, seguridad de rama, auditoría de contenido, lock reproducible, build del admin, diff del PR, TypeScript, lint y build de preview.
- Deploy Preview aprobado: `https://deploy-preview-12--paulagualtieri.netlify.app`.
- El primer intento detectó correctamente un `tina/tina-lock.json` desactualizado y una diferencia entre el schema local y el indexado por TinaCloud. Se regeneró el lock y la comparación semántica mostró únicamente tres ayudas editoriales esperadas sobre el artículo canónico de los casos clínicos.
- La edición autenticada de Tina quedó en `origin/editorial/tina` (`9ba9356`) y no en `origin/main` (`aa37acc`). Esa edición se integró después a la rama del OpenSpec mediante Git y PR; `main` permaneció intacta.

Con esta evidencia se completa 5.4. Continúan pendientes 5.5 (auditoría manual del preview y aprobación humana aplicable) y 6.1 (validación final exclusiva de Alejandro).

## Auditoría técnica parcial del Deploy Preview — 2026-08-20

- Se relevaron Inicio, índice y detalle de Tratamientos, un Artículo y una Instrucción en escritorio y desde 320 px.
- Las cinco rutas respondieron correctamente, conservaron `lang="es"`, un único `h1`, atributos `alt` presentes y ausencia de enlaces legacy `/casos/`.
- Los tres `alt=""` del índice de Tratamientos corresponden a imágenes decorativas de recursos que acompañan texto equivalente.
- La navegación por teclado recorrió los controles en orden y mostró foco visible. La revisión humana completa sigue pendiente.
- El header HTTP del Deploy Preview entrega `X-Robots-Tag: noindex`; por lo tanto prevalece sobre el meta público `index, follow` y evita que el preview sea indexado.
- El borrador `Cuidados diarios para alineadores invisibles` aparece en el Deploy Preview para revisión y permanece excluido de producción, según el contrato editorial.
- No se detectó desplazamiento horizontal utilizable. En Inicio, los elementos decorativos de ancho completo exceden por el ancho de la barra vertical, pero el recorte intencional de `body { overflow-x: hidden; }` evita que rompan la maqueta.

Alejandro confirmó el 2026-08-21 que la inspección visual y la revisión de Paula resultaron aprobadas. Con esa confirmación y la evidencia técnica anterior se completa 5.5. Permanece pendiente únicamente 6.1, que Alejandro debe marcar manualmente antes del commit de cierre y del OpenSpec Archive.
