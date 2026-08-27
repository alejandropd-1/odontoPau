# Evidencia de ciclos editoriales

## Actualización visible

Fecha de comprobación humana: 2026-08-24.

- Documento editado desde Tina: `src/data/home.json`.
- Campo: `location.description`.
- Acción ejecutada por Alejandro: `Save`, sin solicitar publicación.
- Preview compartible: mostró `equipado con tecnología de vanguardia`.
- Producción: conservó `equipado con la mejor tecnología`.
- Evidencia visual: captura aportada por Alejandro sobre el branch deploy `editorial-tina--paulagualtieri.netlify.app`.

Resultado de este checkpoint: `Save` y Preview funcionaron de forma independiente de producción; en ese momento todavía no se había activado `Publicar cambios`.

### Publicación protegida completada

La publicación fue solicitada por Alejandro desde el panel Tina y terminó correctamente el 2026-08-24, sin merge manual ni publicación directa desde Netlify.

- Request procesado: `editorial-mt7hodbr-6e1b5236-97a5-429c-aaf3-3a7d73ef4825`.
- Snapshot editorial autorizado: `4c757ada2c96287320460a580b0b135085ec898b`.
- Workflow protegido: run `32754811999`, iniciado a las `17:07:35Z` y completado a las `17:10:47Z` con resultado `success`.
- Preflight y alcance: los pasos `Validate request and editorial scope` y `Confirm immutable editorial snapshot` finalizaron correctamente.
- PR técnico idempotente: [#16](https://github.com/alejandropd-1/odontoPau/pull/16), reutilizado y mezclado automáticamente a las `17:10:39Z`.
- Gates sobre la revisión exacta: `quality-gates` y `protected-editorial-publication` finalizaron en `success`; los controles de headers y redirects de Netlify también finalizaron correctamente.
- Commit publicado en `main`: `43c2482fa478c2be08cbce84b40bf0adebb2a50d`.
- Registro final en `editorial/tina`: `4763a91bbdd6a52c05adf19aed7cb0705603278e`, con `status: published`, el mismo `requestId` y `productionCommit` apuntando al commit de `main`.
- Convergencia Git: `editorial/tina` quedó cero commits detrás y uno por delante de `main`; su único delta es `src/data/editorial/publication-request.json`, que registra el resultado de la promoción y no modifica contenido público.
- TinaCloud/panel: el administrador cargó el documento actualizado y mostró `Últimos cambios publicados`, demostrando lectura del estado final indexado.
- Producción: `https://paulagualtieri.com/` respondió HTTP 200 y mostró el texto exacto `equipado con tecnología de vanguardia para tu cuidado dental`.

Resultado: el ciclo `Save -> Preview -> Publicar cambios -> PR/checks -> merge -> producción` quedó demostrado sobre contenido real. El panel, el contenido de `main`, la rama editorial y la superficie pública coinciden con el request autorizado.

## Defectos observados

- El `Panel editorial` fullscreen no permitía desplazamiento vertical porque su contenido usaba una altura mínima basada en el viewport dentro de un contenedor Tina sin scroll. Se clasificó como defecto del bootstrap y se ajustó el contenedor para usar la altura disponible con scroll propio; Alejandro comprobó visualmente el desplazamiento después del despliegue.
- El primer intento de `Publicar cambios` se detuvo antes de crear el request con `requestId no es válido`. Producción no cambió. La causa fue que Tina GraphQL representa campos opcionales vacíos como `null`, mientras el contrato persistido usa ausencia de campo. Se normalizó esa frontera antes de validar o crear transiciones y se agregó una regresión con la forma real devuelta por Tina.
- La repetición desde el Deploy Preview técnico del PR creó el request en `change/validar-operacion-editorial-tina-en-produccion`, no en `editorial/tina`; por diseño el workflow no lo procesó y producción permaneció sin cambios. Se devolvió ese request aislado a `idle` y se limitó la acción de publicación a la rama operativa `editorial/tina`, dejando los previews técnicos sólo para revisión de interfaz.
- El request `editorial-mt7fsixr-5199f298-875e-4818-94d3-08bf00c35e72` creó correctamente el PR técnico `#16`, pero quedó esperando controles porque un PR creado con `github.token` no dispara otro workflow por evento `pull_request`. La espera incluía además al propio check `protected-editorial-publication`, creando un bloqueo circular. Se clasificó como defecto bloqueante del bootstrap: `Quality Gates` ahora admite disparo explícito y la publicación espera únicamente el check obligatorio `quality-gates`. Producción permaneció en el último commit sano.
- La corrección del bloqueo circular fue integrada mediante el PR `#17`, se sincronizó con `editorial/tina` y el request siguiente completó ambos gates, el merge protegido y la actualización del panel. El defecto quedó reproducido, corregido y verificado sin relajar controles.

### Refinamiento de costo y experiencia

La prueba real mostró que el PR y los estados técnicos son útiles como barrera interna, pero no deben convertirse en pasos para el usuario ni repetir compilaciones equivalentes. Se clasificó como defecto bloqueante del bootstrap y se corrigió dentro de este cambio porque afecta directamente la operación ordinaria ya aprobada.

- El recorrido visible permanece `Guardar -> revisar la vista previa -> Publicar cambios`; GitHub y Netlify quedan fuera de la operación habitual.
- El PR técnico conserva los controles sobre la revisión exacta, pero omite su Deploy Preview porque `editorial/tina` ya ofrece la vista previa aprobada.
- Los commits que sólo registran pedido, progreso o resultado, y las sincronizaciones cuyo contenido público no cambió, no vuelven a construir el sitio.
- GitHub espera primero el control iniciado automáticamente y sólo lo dispara de forma explícita cuando no apareció, evitando ejecutar la misma suite dos veces.
- El panel distingue preparación, controles, actualización pública, éxito confirmado y fallos recuperables con mensajes cotidianos. Los datos técnicos quedan ocultos y disponibles únicamente para soporte.
- El estado `published` se registra recién cuando `paulagualtieri.com/deployment.json` confirma el commit integrado; un merge exitoso por sí solo ya no se presenta como publicación terminada.

Validación local del refinamiento, sin push, deploy ni consultas externas:

- `pnpm run test:tina-publication`: válido.
- `pnpm run test:tina-publication-workflow`: válido.
- `pnpm run test:netlify-ignore-build`: válido.
- `pnpm run typecheck`: válido.
- ESLint sobre los archivos TypeScript/TSX modificados: válido.
- `openspec validate validar-operacion-editorial-tina-en-produccion --strict`: válido.
- `git diff --check`: válido.
- Marca local de despliegue: generada con el commit vigente, confirmada como archivo ignorado y retirada al finalizar la prueba.

No fue necesario modificar `AGENTS.md`: el PR continúa cumpliendo la política de publicación protegida, pero ahora queda explícitamente tratado como implementación interna y no como responsabilidad del profesional que edita.

### Cierre técnico local y aprobación de mensajes

Fecha: 2026-08-25. Alejandro revisó y aprobó visualmente todos los mensajes simulados del panel: sin publicación, solicitud pendiente, controles en curso, actualización pública, publicación confirmada, falla recuperable, índice pendiente y error de lectura. El selector usado para esta revisión existe sólo en desarrollo local, no guarda contenido, no crea requests y no realiza llamadas a GitHub, TinaCloud ni Netlify.

Se ejecutó una sola tanda local completa, sin push, PR, merge, deploy ni consulta a Netlify:

- OpenSpec estricto: 22 cambios válidos, 0 fallidos.
- Contratos CMS: 31 modelos neutrales, 29 modelos Stackbit, 188 rutas y 36/36 round-trips, sin violaciones.
- Tina adapter: 26/26 modelos, 130/130 rutas y 0 mutaciones de `src/data`.
- Reglas editoriales: 17 documentos reales y las restricciones de alta, borrado y publicación válidas.
- Media, runtime, Visual Editing, request de publicación, workflow protegido y filtro de builds: válidos.
- Auditoría Tina: 1 página de inicio, 1 página de tratamientos, 6 tratamientos, 13 artículos, 4 instrucciones y 1 request editorial válidos.
- Round-trip local real: artículo e instrucción sintéticos creados, editados y eliminados; `src/data` quedó idéntico.
- Esquema Tina: regeneración determinista, con SHA-256 `B3CF13D8F46126D16F675B5976F14A3B6E8D06333FC084D056B629C42971B18F` antes y después de la segunda generación.
- TypeScript y ESLint: sin errores.
- Build local de Next.js: 56 páginas estáticas generadas correctamente.
- Integridad final de `src/data`: hash de manifiesto `88635a20328a8bd1497367b8ab6ab5989351d4d5`, igual a la línea base de la tanda.
- `git diff --check` y sintaxis de ambos workflows YAML: válidos.

La auditoría Tina se ejecutó con un puerto de datos aislado porque el servidor visual local del usuario seguía abierto; el primer conflicto de puerto no fue una falla de contenido. La revisión responsive/mobile, teclado y accesibilidad de la tarea 6.4 continúa pendiente, al igual que las pruebas específicas del ciclo real de retiro y republicación.

## Pieza definida para retiro y republicación

La pieza seleccionada para solicitar la aprobación clínica es el artículo `tratamiento-ortopedia-placas-removibles`.

Alejandro confirmó explícitamente el 2026-08-26 que Paula aprobó la ventana temporal de retiro y que ambos están de acuerdo con ejecutar esta prueba reversible. La confirmación habilita la tarea 3.1; no sustituye la autorización separada necesaria para promover el retiro a producción.

Superficies exactas esperadas:

1. El JSON `src/data/articulos/ortopedia/tratamiento-ortopedia-placas-removibles.json` permanece versionado, indexado y editable en Tina/Preview.
2. Preview conserva la ruta `/articulos/tratamiento-ortopedia-placas-removibles` para poder revisar y republicar el mismo documento.
3. Producción deja de generar esa ruta canónica, su metadata, Open Graph, Twitter Card y JSON-LD.
4. La pieza desaparece del archivo general `/articulos`, de su paginación y del archivo de Ortopedia.
5. En `/tratamientos/ortopedia` desaparecen la tarjeta de artículo relacionado y el enlace del caso clínico. La ficha clínica del tratamiento puede seguir visible porque pertenece al documento del tratamiento, no al artículo retirado.
6. La ruta histórica `/tratamientos/ortopedia/casos/1` deja de redirigir al artículo y responde como contenido no disponible mientras dure el retiro.
7. El sitemap deja de incluir la URL del artículo y recalcula los archivos paginados afectados.
8. La republicación restaura exactamente estas superficies con el mismo slug y el mismo JSON, sin crear duplicados.

La única referencia entrante explícita detectada es `src/data/tratamientos/ortopedia/ortopedia.json`, mediante `casosClinicos[0].articleSlug`. El impacto es amplio para la prueba, pero acotado y reversible.

### Alternativas conservadas sólo como contingencia

| Prioridad | Pieza | Cobertura esperada | Riesgo y observaciones |
|---|---|---|---|
| Alternativa simple | Instrucción `dieta-blanca` | Ruta `/instrucciones/blanqueamiento/dieta-blanca`, listado de instrucciones, relación por `serviceId: estetica-dental`, sitemap y metadata/JSON-LD | Menos relaciones explícitas, pero es una indicación para pacientes; conviene retirarla sólo durante una ventana breve y con aprobación de Paula. |
| Alternativa mínima | Instrucción `indicaciones-post-extraccion` | Ruta `/instrucciones/cirugia/indicaciones-post-extraccion`, listado de instrucciones, sitemap y metadata/JSON-LD | No tiene `serviceId` ni referencias entrantes detectadas. Es la prueba de menor superficie, pero valida menos relaciones automáticas. |

Para cualquiera de las tres piezas se verificará que el JSON continúe presente y editable en Tina/Preview durante el retiro, que producción deje de exponer todas las superficies enumeradas y que la republicación restaure el mismo documento sin duplicados.

## Retiro guardado en vista previa

Fecha de comprobación: 2026-08-26, iniciada a las 08:13 (America/Buenos_Aires).

- Alejandro confirmó que Paula aprobó la ventana temporal antes de modificar el documento.
- Entrada utilizada: el único administrador editorial de `/admin`; su configuración mantiene las escrituras en `editorial/tina` y bloquea las ramas productivas.
- Documento: `src/data/articulos/ortopedia/tratamiento-ortopedia-placas-removibles.json`.
- Cambio realizado desde Tina: `status: published -> retired`, sin modificar slug, texto, imágenes, relaciones ni fechas.
- Persistencia: después de guardar y recargar el administrador, Tina volvió a mostrar `Retirado`.
- Vista previa editorial: conservó el documento completo y editable en su misma URL, con la señal `Vista previa editorial · Estado: retired · No indexada`.
- Producción antes de publicar el retiro: `https://paulagualtieri.com/articulos/tratamiento-ortopedia-placas-removibles` continuó respondiendo con el título, contenido, imágenes y relaciones de la versión pública vigente.
- No se activó `Publicar cambios`, no se solicitó una promoción y producción no cambió.

Resultado: la tarea 3.1 quedó demostrada. El retiro está guardado únicamente en la rama editorial y listo para el preflight previo a una eventual publicación autorizada.

### Pausa antes de publicar el retiro

El 2026-08-26 Alejandro autorizó iniciar la tarea 3.2, pero el circuito se detuvo antes de confirmar la tanda y antes de presionar `Publicar cambios` porque el administrador en vivo todavía sirve el bundle de `HEAD`: muestra `Guardar actualiza Preview. Producción sólo cambia...`. El checkout local pendiente contiene, en cambio, `Guardar actualiza la vista previa. El sitio público sólo cambia...`, junto con la confirmación por marca pública y los estados refinados.

Publicar en estas condiciones probaría el workflow anterior y no la implementación local que este OpenSpec debe cerrar. No se creó un request ni se modificó producción. Antes de reanudar 3.2 debe decidirse y autorizarse cómo poner la revisión vigente en una superficie verificable, preservando el circuito Git y sin mezclar a `main` fuera de la autorización correspondiente.

### Publicación intermedia del circuito corregido

El 2026-08-26 Alejandro autorizó publicar la corrección operativa antes de continuar el retiro. El PR existente superó Quality Gates y Deploy Preview, y se integró en `main` como `817f3ffdaa31b24add83daa9cf3a346b6d5ad53a`.

El primer deploy de producción falló de forma segura antes de publicar: Tina Cloud informó que el esquema remoto de `editorial/tina` todavía no incluía el campo técnico `issueKind`. Se sincronizó `main` hacia la rama editorial mediante el merge limpio `da927454e15208c3876f34a8fa36cab244ddf93e`, preservando tanto el artículo retirado como el pedido editorial. El branch deploy terminó correctamente y el reintento de producción confirmó la marca pública para `817f3ffdaa31b24add83daa9cf3a346b6d5ad53a`.

La comprobación visual posterior confirmó el texto nuevo y el artículo `Retirado`, pero también detectó que el simulador local aparecía en producción y deshabilitaba el botón. La causa fue usar `NODE_ENV` como señal de revisión local dentro del bundle de Tina. El hotfix reemplazó esa inferencia por `TINA_PUBLIC_IS_LOCAL === 'true'`, que es la señal explícita ya establecida por `scripts/run-tina.mjs`; superó Quality Gates y Deploy Preview, se integró mediante el PR #18 y producción confirmó el commit `7c77eb937a9e8e267a6e9f0ab3764409d765a6ae`. La revisión final mostró el simulador ausente, el artículo `Retirado`, la confirmación habilitada y `Publicar cambios` disponible después de marcarla. La tarea 3.2 todavía no se ejecutó.

### Intentos protegidos de retiro y defecto de la prueba visual

Entre el 2026-08-26 y el 2026-08-27 se enviaron tres pedidos de retiro desde el panel. Ninguno modificó producción:

- El primer pedido, `editorial-mtaacohh-d8387b91-b732-42b9-874a-928d05e19623`, quedó demorado durante una interrupción general de GitHub Actions y luego fue rechazado porque `editorial/tina` todavía no derivaba del hotfix publicado. Se sincronizó la rama sin perder el documento retirado.
- El segundo pedido, `editorial-mtabait1-8fb42e38-0160-4d5d-b38c-e64b3db797d6`, superó el preflight pero no recibió el control requerido mientras el proveedor todavía drenaba las colas demoradas. El circuito informó la falla y conservó producción.
- El tercer pedido, `editorial-mtbef91i-33d3d8cc-47c6-4a56-b08e-01bc8c8e8bb9`, se ejecutó con el servicio operativo y reveló un defecto reproducible en `test:tina-visual`: el test exigía que todos los artículos enlazados por casos clínicos permanecieran siempre en estado `published`, contradiciendo el retiro reversible que este mismo OpenSpec debe validar.

El tercer fallo se clasificó como defecto bloqueante del bootstrap, limitado al contrato de prueba. La implementación pública ya consulta únicamente artículos ruteables y omite el enlace cuando la pieza no está publicada. Se ajustó `visual-data-test.ts` para conservar la integridad de la relación editorial y comprobar, por separado, que sólo los artículos `published` aparecen en el conjunto público.

Validación focalizada e integración técnica:

- `pnpm run test:tina-visual`: válido; 13/13 casos conservan su relación editorial y sólo exponen artículos publicados.
- `git diff --check -- src/cms/tina/visual-data-test.ts`: válido, con el aviso esperado de normalización LF/CRLF del checkout de Windows.
- Commit selectivo: `22c4f5bfe95f385e3d85fcbe62a0fcede9991c24`.
- PR técnico `#20`: único archivo modificado, `quality-gates` válido e integración en `main` mediante `8202a1c9d253638c5ceb8ea181a8f1aa830bcf46`.
- Sincronización editorial: `549a4b0697a576fe899bc5dd24605864cf9f7b92`, preservando `status: retired` y el documento original.
- Control sobre el snapshot real retirado: `quality-gates` válido en la ejecución `33065418136`, incluyendo OpenSpec, contratos CMS/Tina, auditoría, TypeScript, lint y build de Preview.

La tarea 3.2 continúa pendiente hasta completar la promoción. La regresión ya quedó integrada y la vista previa sincronizada, por lo que el panel está listo para emitir un request nuevo sin el control conocido en rojo.

## Retiro publicado y verificado

Fecha: 2026-08-27. Request final: `editorial-mtbf41o7-b781bda0-ebbd-4793-9898-bff84cbc0b5c`.

- Preflight, snapshot inmutable y `quality-gates`: válidos.
- PR técnico reutilizado: `#19`.
- Commit integrado en `main`: `c8aa82fab36eb01247232fdb6df567d7a46e8bee`.
- La señal `[skip netlify]` usada para evitar el Deploy Preview del PR también omitió el deploy de producción del merge. El workflow permaneció correctamente en `deploying`, sin declarar éxito. Se activó una única compilación de recuperación sobre el `main` exacto ya aprobado, build `6a901ca6d1f585bc3e30840f`, sin modificar contenido ni crear otro commit.
- La marca pública confirmó `c8aa82fab36eb01247232fdb6df567d7a46e8bee` a las `2026-08-27T11:18:12.974Z`.
- El workflow `33065951656` finalizó en `success` y registró el request como `published` a las `2026-08-27T11:19:12.426Z`.
- `editorial/tina` quedó cero commits detrás de `main`, dos commits operativos por delante y con un único archivo diferente: `src/data/editorial/publication-request.json`.

Comprobaciones públicas:

- `/articulos/tratamiento-ortopedia-placas-removibles`: HTTP 404.
- `/tratamientos/ortopedia/casos/1`: HTTP 404, sin redirección al artículo retirado.
- `/articulos`: HTTP 200, sin slug ni título de la pieza.
- `/articulos/tratamiento/ortopedia`: HTTP 404 porque no queda otro artículo público en ese archivo.
- `/tratamientos/ortopedia`: HTTP 200; conserva el caso clínico, pero no contiene un enlace ni el título del artículo retirado.
- `/sitemap.xml`: HTTP 200, sin el slug retirado.
- El JSON canónico continúa presente una sola vez en `main`, con el mismo slug y `status: retired`.

Resultado: las tareas 3.2, 3.3 y 3.4 quedaron demostradas. La publicación fue protegida e idempotente y producción terminó convergente, pero requirió una activación técnica única del build debido al defecto de la señal `[skip netlify]`. Antes de iniciar la republicación debe corregirse ese defecto para demostrar el recorrido saludable sin intervención manual.

### Corrección local previa a la republicación

Se retiró `[skip netlify]` del título del PR técnico para impedir que la señal llegue al mensaje del merge y omita producción. El filtro `netlify-ignore-build.mjs` pasó a omitir el Deploy Preview redundante únicamente cuando `CONTEXT=deploy-preview` y la rama de origen es `editorial/tina`; los cambios de contenido en `production` conservan siempre el build.

Validación focalizada local:

- `pnpm run test:netlify-ignore-build`: válido para commit operativo, Preview editorial, Preview ajeno y producción con contenido.
- `pnpm run test:tina-publication-workflow`: válido y confirma que el título del PR ya no contiene la señal de omisión.
- `git diff --check` sobre workflow, filtro y pruebas: válido, con avisos esperados de normalización LF/CRLF.

La corrección se versionó como `b1cb292afb5be9e530fee82b2571c49e173e8626` y se revisó mediante el PR `#21`. `quality-gates`, headers, redirects y Deploy Preview finalizaron correctamente. La integración en `main`, `c8e11dcf52a42ea74c14825f937029c6caef518c`, inició automáticamente el deploy de producción `6a901f493762870008176833`; no fue necesario reactivarlo manualmente. La marca pública confirmó ese commit a las `2026-08-27T11:29:32.106Z` y la ruta del artículo continuó respondiendo HTTP 404.

`editorial/tina` se sincronizó mediante `6cb0d4b6bbf5a8eb08ff5e5eb18214a839c10dde`, preservando el request publicado y `status: retired`. Quedó cero commits detrás de `main` y su único archivo diferente es el registro operativo de publicación. La republicación puede comenzar desde el mismo documento editorial.

## Republicación guardada en vista previa

Fecha: 2026-08-27.

- Alejandro abrió el mismo documento desde la colección Artículos y cambió únicamente `status: retired -> published`.
- Commit Tina: `a58b029127f772e0840317537560e073cf74f904`.
- Preview editorial: HTTP 200 para `/articulos/tratamiento-ortopedia-placas-removibles`.
- Producción antes de solicitar la republicación: HTTP 404 para la misma ruta.
- No se modificaron slug, texto, imágenes, relaciones ni fechas y todavía no se creó el request de republicación.

Durante la operación se confirmó una limitación de experiencia: pulsar el título de un documento retirado abre directamente su ruta de Visual Editing, que responde 404 por diseño público y no ofrece campos. La recuperación se realizó desde el menú de la fila o la ruta del formulario de colección. El futuro panel por contenido debe ofrecer una acción de edición válida para piezas retiradas sin depender de su ruta pública.

Resultado: la tarea 4.1 quedó demostrada. El mismo documento está restaurado en Preview mientras producción conserva el retiro.

## Solicitud real de republicación

Fecha: 2026-08-27.

- Alejandro confirmó las aprobaciones aplicables y solicitó la publicación desde el Panel editorial.
- El panel mostró `Publicación en curso` y el pedido fue recibido correctamente.
- La ejecución protegida comenzó a las `2026-08-27T12:58:18Z` y se detuvo de forma segura antes de integrar o desplegar; producción conservó el retiro.
- Todos los controles focalizados del snapshot terminaron correctamente. El falso fallo ocurrió porque la espera consultaba los controles generales del PR, mientras la comprobación explícita asociada al commit editorial seguía en curso y luego concluyó en `success`.
- La tarea 4.2 permanece pendiente: el pedido no se publicó ni debe repetirse desde el panel.

La prueba con una persona real detectó una ambigüedad de producto: `Publicación en curso` comunica actividad, pero no deja suficientemente claro si el contenido permanece sólo en Preview, si está pasando al sitio público o si ya quedó publicado. El futuro panel por contenido debe expresar esos tres momentos con estados visibles y cotidianos, sin exponer el recorrido técnico de fondo.

Se preparó una corrección local para esperar el control correspondiente a la versión editorial exacta y exigir que finalice con resultado válido. La prueba contractual `test:tina-publication-workflow` pasó y `git diff --check` no detectó errores; queda pendiente publicar esta corrección técnica y reanudar el mismo pedido con autorización de Alejandro.

## Republicación publicada y verificada

Fecha: 2026-08-27. Request final: `editorial-retry-1787836693109-28fe0156-d2b1-40d6-b472-f9d8e530af0a`.

- La espera corregida se integró mediante el PR técnico `#23`; sus controles y Deploy Preview finalizaron correctamente y producción confirmó `8f5f37532687aa9d3163061e0439c54707a0fbcf` antes de reanudar el contenido.
- El primer reintento técnico se detuvo de forma segura porque el registro creado desde PowerShell contenía finales de línea CRLF y `git diff --check` los rechazó. No llegó a integración ni a producción. Se regeneró el mismo pedido funcional con un request único, usando LF y verificando el snapshot antes de continuar.
- El request final superó el preflight y todos los controles asociados al commit exacto, integró el mismo documento y confirmó automáticamente el deploy público.
- Commit público confirmado: `bf82398e194df8f3ac262869e2ca9c6937f4bf82`, generado a las `2026-08-27T13:22:24.185Z`.
- El request quedó `published` a las `2026-08-27T13:23:32.258Z`, con el resumen coloquial `Listo: los cambios ya están publicados en el sitio.`

Comprobaciones públicas:

- `/articulos/tratamiento-ortopedia-placas-removibles`: HTTP 200, con slug, título y enlace canónico.
- `/articulos`: HTTP 200, con la pieza restaurada.
- `/articulos/tratamiento/ortopedia`: HTTP 200, con la pieza restaurada.
- `/tratamientos/ortopedia`: HTTP 200, con título y enlace canónico al artículo.
- `/tratamientos/ortopedia/casos/1`: HTTP 308 hacia la ruta canónica restaurada.
- `/sitemap.xml`: HTTP 200 y contiene el slug.
- `main` contiene un único JSON para el slug, con `status: published`.
- `editorial/tina` quedó cero commits detrás de `main`; su único archivo diferente es el registro operativo de publicación.

Resultado: las tareas 4.2, 4.3 y 4.4 quedaron demostradas. El ciclo retiro/republicación terminó con el mismo documento, sin duplicados y con convergencia pública y editorial.

## Validación focalizada de cierre

Fecha: 2026-08-27.

- `openspec validate validar-operacion-editorial-tina-en-produccion --strict --no-interactive`: válido.
- `test:tina-publication`: estados, transiciones idempotentes y allowlist válidos.
- `test:tina-visual`: 13/13 relaciones editoriales conservadas y sólo artículos publicados expuestos.
- `test:tina-publication-workflow`: snapshot, espera protegida y sincronización válidos.
- `test:netlify-ignore-build`: separación entre Preview redundante y producción válida.
- `git diff --check`: válido, con avisos esperados de normalización LF/CRLF del checkout de Windows.
- La prueba local de reglas editoriales ejecutó sus aserciones pero mantuvo abierto un proceso Tina en este entorno; se detuvieron únicamente los procesos iniciados por esa prueba y no se repitió. El mismo control terminó correctamente en los Quality Gates de la revisión publicada.
- El retiro y la republicación cambiaron únicamente el estado del mismo documento. No se modificaron texto clínico ni imágenes, Paula aprobó la ventana mediante la confirmación de Alejandro y la evidencia conserva sólo resultados e identificadores técnicos no sensibles.

### Revisión responsive y de teclado

- Desktop real: Alejandro confirmó visualmente el estado `Listo: los cambios ya están publicados`, la explicación textual, la confirmación etiquetada y el botón deshabilitado.
- Mobile real a `390 x 844`: al cerrar el menú lateral de Tina, el panel ocupa el ancho completo, no presenta desborde horizontal y conserva legibles el encabezado, el estado, la explicación, la vista previa, la confirmación y el botón.
- El recorrido con `Tab` avanza desde `Actualizar` hacia `Abrir vista previa`, la confirmación y las tarjetas de colecciones; todos muestran un contorno de foco visible.
- La confirmación se activó con `Espacio`, habilitó `Publicar cambios` y se devolvió a desmarcada; no se activó ninguna publicación.
- Los estados usan encabezado y detalle textual dentro de una región accesible y no dependen únicamente del color.
- Limitación heredada de la interfaz de Tina: el botón visual `X` que cierra el menú móvil no expone nombre accesible, aunque el control alternativo para abrir el menú sí se anuncia como `Open navigation menu`. No bloquea la operación del panel y debe relevarse como adaptación o incidencia upstream, no como ampliación de este OpenSpec.
- El viewport temporal se restableció y `Publicar cambios` quedó deshabilitado al finalizar.

Resultado: las tareas 6.1, 6.4 y 6.5 quedaron demostradas. Continúan pendientes la preparación final de 6.6 y el gate exclusivamente humano 6.7.

## Revisión final preparada y cuota comprobada

Fecha: 2026-08-27.

- La evidencia, la guía y el handoff se versionaron selectivamente en `750d4b1aa12d1b60e1fbb51815f9299bec2acf1a`; quedaron fuera `tsconfig.tsbuildinfo` y `.codex-remote-attachments/`.
- Se abrió el Draft PR `#24` con omisión explícita de Netlify mientras se comprobaba el margen disponible del plan.
- Netlify no inició un Deploy Preview para esta revisión documental.
- `quality-gates` terminó correctamente en la ejecución `33089800730`: OpenSpec, contratos, seguridad de rama, reglas editoriales, auditoría, administración Tina, diff, TypeScript, lint y build interno válidos.
- La pantalla de uso confirmó que la cuenta utiliza `Free Legacy`: consumió `225/300` minutos y conserva `75` minutos. El proyecto `paulagualtieri` registra un promedio de `1 min 53 s` por build; por lo tanto, existe margen suficiente para un único CI/Deploy Preview final y no es necesario esperar al reinicio mensual sólo por la cuota.
- La rama del Draft PR todavía debe sincronizar el commit público de la republicación. Esa sincronización, la actualización del PR y el único Deploy Preview final permanecen detenidos hasta recibir autorización explícita para las acciones externas.

La tarea 6.6 continúa pendiente. Para completarla se debe sincronizar `main` una sola vez, retirar la omisión temporal del título, verificar un único CI/Deploy Preview sobre esa revisión exacta y recién entonces presentar el gate 6.7 a Alejandro. No se debe mezclar ni archivar antes, ni repetir la tanda salvo un fallo real.
