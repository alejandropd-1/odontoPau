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

La comprobación visual posterior confirmó el texto nuevo y el artículo `Retirado`, pero también detectó que el simulador local aparecía en producción y deshabilitaba el botón. La causa fue usar `NODE_ENV` como señal de revisión local dentro del bundle de Tina. El hotfix pendiente reemplaza esa inferencia por `TINA_PUBLIC_IS_LOCAL === 'true'`, que es la señal explícita ya establecida por `scripts/run-tina.mjs`. La tarea 3.2 continúa sin ejecutar hasta publicar y verificar este hotfix.
