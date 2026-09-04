# Evidencia local — 2026-09-03

## Alcance y estado

Rama `change/mitigar-fallo-decodificacion-tinacloud`, base `d56f66d` (main y remoto verificados al comenzar). Sin commit, push, archive ni deploy. No se modificaron documentos editoriales. **Gate de viabilidad rechazado**: la selección mediante `contentApiUrlOverride` cambia la UX de autenticación del SDK. Se retiró la integración de `tina/config.ts`, los avisos experimentales, el adaptador del SDK y la generación de estilos. No se creó una ruta Next. Queda sólo el laboratorio aislado de transporte en `scripts/fixtures`, sin imports desde el producto. No continuar tareas 2–6 sin revisar el diseño y repetir el gate.

## Pruebas reproducibles

- `pnpm exec tsx --test scripts/fixtures/tina-content-relay-test.ts scripts/fixtures/tina-sdk-contract-test.ts`: 5/5 pruebas aprobadas después del traslado al laboratorio. Las tres del transporte usan servidor HTTP en loopback y sesiones sintéticas: gzip real, respuesta de codificación incoherente, 401/403, destino fijo, headers mínimos, cuerpo acotado, GraphQL error, upstream no JSON, timeout y escritura con respuesta perdida enviada exactamente una vez.
- `pnpm exec tsx --test scripts/fixtures/tina-sdk-contract-test.ts`: conserva el test con el `Client` y `TinaCloudAuthProvider` realmente instalados. Introspección completa creada desde schema de fixture, catálogo y mutación atraviesan el relay. Sólo `Content-Type` y `Authorization` salen del cliente SDK; el relay agrega `Accept-Encoding: gzip`. Ningún header Tina adicional fue necesario para esas tres operaciones. Una segunda prueba compara flags y URL de la alternativa propuesta, sin dar por validada su interfaz.
- Tests de los avisos experimentales: 4/4 de mensajes/configuración y 1/1 de comparación de schema pasaron en aislamiento, pero **se retiraron junto con la integración** al fallar el gate completo. No son pruebas vigentes del producto.
- `pnpm run build:cms:local`: el experimento compiló después de resolver la importación SCSS que el precompilador de Tina no admite. Para una nueva implementación se deberá compilar SASS/tokens a estilos consumibles por la configuración, en lugar de importar `.scss` directamente o duplicar hardcodes. Ese generador experimental también se retiró.
- Build focalizado remoto con client ID y token **sintéticos**, `NEXT_PUBLIC_TINA_CONTENT_RELAY=true`, `TINA_PUBLIC_IS_LOCAL=false`, rama `editorial/tina` y flags `--skip-indexing --skip-cloud-checks --noTelemetry`: compiló y el navegador seleccionó `/api/editorial/content`, pero falló la conservación de UX de autenticación.

## Contrato SDK observado

`tinacms@3.11.0`, CLI `2.5.6`, API GraphQL `2.4`.

- `Client.request` obtiene el token con el proveedor existente, envía POST `{query, variables}` y devuelve `data`; propaga errores HTTP/GraphQL.
- `Client.getSchema` realiza introspección y arma/cacha el schema. `TinaAdminApi.checkGraphqlSchema` compara ese schema con el AST local. Reintentar solamente `getSchema` sería insuficiente: la recuperación debe conservar la comparación.
- `contentApiUrlOverride` también modifica el cliente de build y clasifica la conexión como API personalizada para parte de la interfaz del SDK. Se limita la selección al navegador; no se usa la credencial de build en el relay. La autenticación sigue siendo `TinaCloudAuthProvider` en el test contractual.
- El primer experimento del arranque real mostró una carrera: una lectura de dashboard posterior podía suprimir el aviso del schema. Se separaron las operaciones y se verificó el aviso ante fallo de schema, pero el gate completo falló después en autenticación. Esa intervención fue retirada.

## Resultado del navegador y motivo de la pausa

- Arranque real del admin compilado, API sin respuesta: se consiguió mostrar aviso en español y contacto en lugar del modal técnico. A 390 × 844, correo/WhatsApp/diagnóstico fueron accesibles dentro del ancho, sin enviar mensajes. Imagen local no versionada: `output/playwright/editorial-support-mobile.png`.
- Con respuesta 401 de `currentUser` y sesión sintética: el dashboard **no se expuso**, pero el SDK mostró `Enter into edit mode`, `When you save, changes will be saved to the local filesystem.` y `Enter Edit Mode`. El aviso de sesión en español no quedó disponible. La prueba del botón `Iniciar sesión` agotó 30 segundos y el snapshot confirmó esa pantalla incorrecta.
- Causa observada en `tinacms/dist/index.js`: `TinaCMSProvider2` calcula `isSelfHosted` a partir de `schema.config.contentApiUrlOverride`; `AuthWallInner` calcula `isTinaCloud` usando la ausencia de esa misma opción. Cambiar sólo el destino completo altera más que el transporte. Que `Client.authProvider` siga siendo `TinaCloudAuthProvider` no garantiza la UX completa; el test aislado no bastaba.
- No se oculta el problema cambiando el texto del SDK ni se acepta esta pantalla para un profesional. Se retira el adaptador que envolvía `Client.request`, `fetchWithToken` y `TinaAdminApi.checkGraphqlSchema`; no queda monkey-patching en el producto.

## Ajuste propuesto tras el primer intento (registro histórico)

Evaluar `tinaioConfig.contentApiUrlOverride` (override de **base**, no de URL completa) para conservar el modo TinaCloud. El SDK agrega versión/client ID/rama al path: la futura ruta deberá validar el path esperado contra configuración confiable y **nunca** usarlo como destino libre. Mantener selección sólo del admin en navegador, CLI directo, autenticación original, origen/límites y no replay. Repetir la prueba de sesión válida, expirada, rechazada, schema y guardado incierto en el admin real. Los avisos, contactos y estados honestos siguen siendo requisitos sin implementar; el diseño no se considera corregido sólo por documentar esta alternativa.

Ese ajuste documental fue autorizado y aplicado después del primer intento. Alejandro autorizó luego la nueva prueba local. El resultado de ese segundo intento se registra al final; no está aprobado para producto.

## Verificación del retiro

- `git diff -- tina/config.ts scripts/run-tina.mjs`: sin diferencias de contenido; no queda seleccionada la integración experimental.
- Búsqueda de imports/configuración experimental en `src`, `tina/config.ts` y `scripts/run-tina.mjs`: sin coincidencias.
- `pnpm run build:cms:local`: exit 0 después del retiro; admin normal regenerado con destino directo de schema local `https://content.tinajs.io/2.4/content/local-schema-only/github/local`, sin indexación ni comprobaciones Cloud.
- `pnpm run validate:openspec`: 23 aprobados, 0 fallidos en validación estricta. Esto valida los artefactos, no aprueba la viabilidad ni las tareas de producto pendientes.
- `git diff --check`: sin errores de whitespace. Navegador de pruebas cerrado y servidor local del laboratorio detenido.
- No se ejecutaron commit, push, merge, archive ni deploy. Producción no fue modificada.

## Harness de navegador

`node scripts/tina-relay-lab.mjs` sirve únicamente el admin generado y una introspección local en `127.0.0.1:3199`. `playwright-cli -s=tina-relay run-code --filename scripts/fixtures/editorial-boot.playwright.js` usa respuestas/sesión sintéticas e intercepta todo destino externo. No envía reportes, no publica ni guarda contenido real. Después del retiro, este harness reproduce la indisponibilidad del admin original: no esperar los avisos experimentales en el build normal.

## Segundo intento: URL base, 2026-09-03

### Alcance del experimento

- Selección temporal en `tina/config.ts`: `tinaioConfig.contentApiUrlOverride` con base `/api/editorial/tina`, sólo si hay navegador, modo Cloud y `NEXT_PUBLIC_TINA_CONTENT_RELAY=true`. Sin override completo, proveedor nuevo ni cambios de identidad. La selección se retiró al detectar el límite de contrato.
- Build local con `TINA_PUBLIC_IS_LOCAL=false`, rama `editorial/tina`, client ID y token sintéticos, y `--skip-indexing --skip-cloud-checks --noTelemetry`: exitoso. La CLI mantuvo la URL directa; el navegador ejecutó el admin compilado, no un cliente construido exclusivamente por el test.
- `scripts/fixtures/tina-base-relay.ts` y su test agregan sólo un laboratorio de validación estricta del path codificado. No son rutas de la aplicación ni reciben tráfico público. No se modificaron contenido, schema ni dependencias.

### Evidencia observada

`playwright-cli -s=tina-base run-code --filename scripts/fixtures/tina-base-admin.playwright.js` terminó exitosamente como reproducción de la incompatibilidad esperada, no como aprobación del gate. Intercepta todo tráfico externo y usa sesiones y respuestas sintéticas. El script requiere el build experimental; no debe esperarse el mismo resultado con el admin normal regenerado.

1. Con sesión simulada válida: tres POST al prefijo mismo-origen `/api/editorial/tina/2.4/content/<clientId-sintetico>/github/editorial%2Ftina` (schema, catálogo e historial); el dashboard llegó a renderizar. Los datos eran fixtures, no el catálogo de producción.
2. A los cinco segundos: GET automático a `/api/editorial/tina/events/<clientId-sintetico>/editorial%2Ftina?limit=1`. La fixture devolvió 404 como el laboratorio de allowlist fija. El navegador produjo `Cannot read properties of undefined (reading 'length')`.
3. Al responder 401 en `currentUser`: apareció el botón original «Log in» con la pantalla Cloud; no apareció el texto de guardado en archivos locales y no se mostró el dashboard. Esto prueba esa presentación y aislamiento, no una autenticación real ni toda la renovación de sesión.
4. Capturas no versionadas: `output/playwright/tina-base-valid.png` y `output/playwright/tina-base-login.png`.

El SDK instalado confirma la causa: `Client.fetchEvents` utiliza `contentApiBase`, y `useSyncStatus` lo invoca cada cinco segundos y consume `events.length`. No es una ruta inventada por el test. Otras operaciones también usan esa base (estado de indexación, listado de ramas, búsqueda y funciones de workflow), pero no se afirma que todas estén activas en este sitio ni se autoriza reenviarlas. El login y medios usan bases diferentes que no se modificaron.

### Decisión y pendientes

La URL base resuelve el cambio de pantalla de autenticación del primer intento, pero **no supera el contrato vigente de sólo POST GraphQL**. Según el gate se detuvo la integración sin ampliar la allowlist, ocultar el error ni simular eventos vacíos. La pantalla de ayuda y el resto de la matriz siguen pendientes; no se marcaron 1.4 ni 1.6–1.8 como completas. Se requiere una decisión explícita para admitir las lecturas auxiliares imprescindibles con método, proyecto, rama y parámetros acotados, o elegir otra integración. No se solicitará un login real a Alejandro hasta superar la evidencia local.

### Validaciones del segundo intento

- `pnpm exec tsx --test scripts/fixtures/tina-content-relay-test.ts scripts/fixtures/tina-sdk-contract-test.ts scripts/fixtures/tina-base-relay-test.ts`: 7/7 aprobadas. Incluyen dos pruebas nuevas de path fijo y tráfico auxiliar del SDK; no son pruebas de soporte ni de la totalidad del gate.
- `pnpm run validate:openspec`: 23 aprobados, 0 fallidos.
- `git diff --check` sin errores y `git diff -- tina/config.ts scripts/run-tina.mjs` sin diferencias de contenido tras retirar la selección temporal. Ningún import del laboratorio quedó en `src` ni en la configuración del producto.
- Navegador de pruebas `tina-base` cerrado y servidor loopback detenido. Sin commit, push, merge, archive ni deploy.
- `pnpm run build:cms:local` después del retiro: exit 0, admin normal regenerado con URL directa `https://content.tinajs.io/2.4/content/local-schema-only/github/local`. El laboratorio no queda seleccionado.
