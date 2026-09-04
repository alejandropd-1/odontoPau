## Context

Ver `proposal.md` para la motivación. El admin compilado consulta directamente `content.tinajs.io`; en la incidencia observada, el `POST` autenticado recibió `200 OK` con `Content-Encoding: zstd`, pero Chrome terminó con `ERR_CONTENT_DECODING_FAILED`. Al anunciar sólo `gzip` desde DevTools, el mismo panel cargó el catálogo. La aplicación web no puede fijar `Accept-Encoding` desde `fetch`, porque el navegador controla ese encabezado.

El sitio público ya está desacoplado: renderiza JSON de `main` y no necesita TinaCloud en runtime. La mitigación se limita al admin y debe conservar el modelo de seguridad de Tina y la rama `editorial/tina`.

El primer gate local del 2026-09-03 fue rechazado: en `tinacms@3.11.0`, la opción de URL completa `contentApiUrlOverride` influye en `isSelfHosted` y en la selección de la interfaz de autenticación. Aunque el `Client` mantuvo `TinaCloudAuthProvider` en una prueba aislada, el admin real mostró «Enter Edit Mode» y un mensaje de guardado en archivos locales ante un 401. La integración experimental fue retirada; las cinco pruebas de laboratorio no prueban la UX completa. `evidence.md` conserva ese resultado histórico.

Alejandro autorizó ajustar el plan para evaluar la URL base el 2026-09-03. La prueba contractual existente sólo confirma flags y construcción de URL del `Client` para esa alternativa; el cableado desde la configuración real del admin, el login y el soporte aún deben superar un nuevo gate. Al observar que `useSyncStatus` requiere `GET /events/<clientId>/<branch>?limit=...`, Alejandro autorizó incorporar el 2026-09-03 únicamente las lecturas auxiliares que el admin compilado demuestre imprescindibles, con proyecto, rama, método y parámetros fijos. Esta revisión no convierte los intentos anteriores en exitosos ni implica activación del relay.

## Goals / Non-Goals

**Goals:**

- Quitarle al profesional la necesidad de configurar el navegador.
- Conservar las operaciones autenticadas de Tina sin almacenar ni agregar un token privilegiado.
- Negociar una codificación estable desde un runtime servidor y entregar al navegador una respuesta coherente.
- Evitar falsos ceros, acciones ambiguas y reintentos con efectos secundarios cuando la lectura falla.
- Explicar los fallos del editor y facilitar contacto con Alejandro sin cargar datos remotos ni exigir conocimientos técnicos.
- Permitir activación y reversión mediante configuración, con una única validación remota después de superar las pruebas locales.

**Non-Goals:**

- Autoalojar el datalayer completo, reemplazar TinaCloud o crear otra interfaz de edición.
- Convertir la contingencia en una API pública de contenido o en un caché editorial persistente.
- Cambiar schema, documentos clínicos, estados editoriales, publicación por tanda o gates Git.
- Resolver dentro de este repositorio los demás proyectos afectados; la solución quedará documentada como patrón reutilizable, no desplegada fuera de OdontoPau.
- Incorporar edición offline, persistencia local de borradores, tickets automáticos o un monitor permanente de TinaCloud.

## Decisions

### 1. Probar un relay GraphQL mismo-origen antes de integrarlo

Se conservará el laboratorio aislado y se probará allí el nuevo cableado antes de incorporar un endpoint Next.js al producto. El navegador enviará la operación y el bearer Tina vigente al endpoint; el servidor la reenviará al único proyecto y rama configurados, solicitando `gzip`. La respuesta se leerá y se devolverá con cuerpo, estado y encabezados coherentes, eliminando encabezados de transporte que ya no describan el cuerpo entregado.

La prueba deberá cubrir consulta de schema, lectura del catálogo y una escritura inocua o reversible sobre una fixture aislada antes de configurar todo el admin. Si Tina exige una semántica que el relay no puede conservar, el gate de viabilidad falla y no se integra la ruta.

También se verificará el punto de integración para que un fallo de schema o autenticación no oculte el aviso y el contacto detrás de un modal técnico de Tina. El mensaje no dependerá del éxito de la consulta que falló ni expondrá documentos sin sesión. Una incompatibilidad del SDK que impida este comportamiento se reportará en el gate, sin darlo por implementado con una prueba exclusiva del dashboard.

El nuevo gate comparará el admin compilado con ruta directa y con la URL base candidata, usando respuestas controladas y credenciales sintéticas: sin sesión, sesión válida, expirada, rechazada (401), permiso insuficiente (403), servicio de identidad sin respuesta, schema inválido/no disponible y recuperación. Deben mantenerse el login original, la validación/comparación de schema y el acceso a ayuda antes de cargar documentos. También se probarán lectura y mutación con respuesta perdida sin replay. No se aceptará la pantalla de edición local como alternativa al login, ni habilitar documentos para mostrar soporte. La autenticación real contra TinaCloud queda para el Preview autorizado; las fixtures no la sustituyen.

Alternativas descartadas: establecer `Accept-Encoding` desde el cliente no es posible con `fetch`; pedir DevTools o una extensión traslada el problema al usuario; esperar al proveedor no ofrece contingencia; autoalojar Tina amplía demasiado alcance, secretos y mantenimiento.

### 2. El relay no tendrá autoridad propia

El endpoint reenviará sólo `Authorization`, `Content-Type` y los encabezados Tina explícitamente necesarios. No leerá `TINA_TOKEN`, no añadirá API keys y no registrará bearer, payloads, respuestas ni contenido. El upstream, client ID, versión y rama se construirán desde configuración del servidor; la URL, rama o proyecto no serán parámetros elegibles por el cliente.

La URL base candidata será un prefijo mismo-origen fijo, por ejemplo `/api/editorial/tina`. El SDK le agrega `/2.4/content/<clientId>/github/editorial%2Ftina`. Ese sufijo recibido es entrada no confiable: se validará contra la única versión, proyecto y rama permitidos por el servidor, sin usarlo para construir un upstream arbitrario. Paths adicionales, segmentos ambiguos, ramas/proyectos distintos y parámetros de consulta no admitidos se rechazarán antes del reenvío. Las pruebas cubrirán cómo el router decodifica `editorial%2Ftina`, evitando decodificación múltiple y aceptación de destinos alternativos.

Se inventariarán las demás llamadas que puedan cambiar al sobrescribir la base de contenido (por ejemplo metadatos o indexación). La única lectura auxiliar demostrada como imprescindible hasta ahora es `GET /events/<clientId>/<branch>?limit=...&cursor=...`, invocada por `useSyncStatus`: tendrá un destino fijo, bearer de la sesión vigente, respuesta acotada y una allowlist exacta de parámetros. No se ampliará la ruta a un proxy genérico para hacer pasar otros endpoints: si una nueva ruta resulta necesaria, el gate se detiene para revisar el diseño. Los servicios de identidad, login y medios mantendrán sus destinos originales; el relay no recibirá sus cookies ni credenciales de build.

Aceptará `POST` JSON únicamente en la ruta GraphQL y `GET` sin cuerpo únicamente en la ruta fija de eventos, siempre con límites y origen mismo-sitio. Rechazará métodos, paths, parámetros y cuerpos fuera de contrato; devolverá los errores de autenticación sin convertirlos en éxito y aplicará controles razonables contra abuso. La seguridad efectiva seguirá perteneciendo a Tina: sin sesión válida no habrá lectura ni escritura.

Alternativa descartada: firmar todas las solicitudes con un token de servidor convertiría el relay en una elevación de privilegios y expondría contenido a cualquier visitante que alcanzara el endpoint.

### 3. Activación explícita y reversible

Se evaluará `tinaioConfig.contentApiUrlOverride`, que cambia la **base** de contenido del `Client`, sin fijar `contentApiUrlOverride` en la configuración de schema ni `customContentApiUrl` en el cliente. Es una candidata verificada a nivel contractual, no una integración de admin ya aprobada. El gate deberá demostrar que la configuración pública del admin llega al cliente efectivo y mantiene el modo TinaCloud, el proveedor original, el inicio/cierre y la renovación de sesión, sin forzar flags de modo local/autohospedado ni modificar prototipos del SDK para ocultar el cambio de autenticación.

Una variable pública no secreta habilitará esa selección sólo para el admin Cloud ejecutado en el navegador. No contendrá una URL arbitraria: la base mismo-origen se construirá desde la configuración permitida de la aplicación. Con la variable ausente o deshabilitada, se conservará la ruta directa. El modo local mantendrá su endpoint local; CLI, generación de schema y builds no usarán el relay ni requerirán que esté levantado. Se verificarán por separado esos entornos y que el bundle no recibe la credencial de build. No habrá fallback automático por solicitud: alternar silenciosamente rutas durante una mutación puede duplicar operaciones.

El Deploy Preview será el único entorno remoto inicial con la mitigación activa. Producción sólo podrá activarla después de validar autenticación, lectura, guardado en `editorial/tina`, ausencia de escritura en `main` y una reversión ensayada.

Alternativas descartadas: el override de URL completa cambia la UX de autenticación en la versión probada; activar siempre el relay dificulta rollback; hacer fallback automático distingue mal entre fallos previos y posteriores a una escritura. Si la URL base tampoco conserva el contrato completo, se retirará el experimento sin adoptar otra integración silenciosamente.

### 4. Modelo explícito de disponibilidad en el dashboard

Los datos consultados se representarán como unión discriminada: cargando, confirmados o indisponibles. Los contadores y estados derivados sólo se calcularán desde datos confirmados. El error principal será cotidiano; un detalle progresivo y sanitizado conservará clase de error, operación y un identificador técnico permitido para soporte.

El botón de reintento ejecutará una única recarga de lectura y quedará ocupado mientras esté en curso. Cada acción permanecerá cerrada sólo cuando falte el dato confirmado del que depende; una falla aislada del historial no bloqueará edición o revisión si el catálogo y el documento requeridos siguen confirmados.

La espera tendrá un plazo finito definido y probado en cliente y servidor. Una respuesta tardía de una operación cancelada no podrá sobrescribir la recuperación de otra más reciente. El reintento mantendrá filtros, página y preferencia de tabla/tarjetas; no recargará todo el admin ni descartará el formulario abierto.

Los avisos son disponibilidad operativa, no valores nuevos del estado editorial. Se mantienen `Publicado`, `No publicado` y `Borrador`.

Alternativa descartada: reutilizar arrays vacíos como fallback oculta la indisponibilidad y produce los falsos ceros observados.

### 5. Evidencia local determinista antes de consumir servicios remotos

Las pruebas usarán un upstream controlado que pueda devolver JSON válido con `gzip`, errores de autenticación y encabezados de codificación inconsistentes. La batería local verificará que el relay negocia `gzip`, no filtra credenciales y no altera cuerpo o estado GraphQL. La comprobación real de Tina se hará una vez en Preview y sólo después de que CI esté verde.

### 6. Mensajes y contacto independientes del servicio afectado

Para una lectura no disponible, el mensaje base será: «No podemos conectar con el servicio de edición. Este problema no retira el contenido ya publicado. Intentá nuevamente en unos minutos. Si continúa, contactá a Alejandro». No se afirmará que todo el sitio está online, que el proveedor está caído o que la conexión de la persona falla sin evidencia. Una sesión inválida ofrecerá «Iniciar sesión»; un permiso insuficiente ofrecerá contacto, sin repetir indefinidamente el login. Un timeout comunicará que la espera se agotó y ofrecerá reintento manual.

«Contactar a Alejandro» ofrecerá dos canales de soporte configurados en la aplicación, sin una consulta a TinaCloud: correo `admin@useodontopro.com` y WhatsApp `541160513261`. Se usarán `mailto:admin@useodontopro.com` y `https://wa.me/541160513261`, conservando el número autorizado sin agregar dígitos. No se reutilizará el teléfono del consultorio. Los destinatarios estarán centralizados y podrán reemplazarse por configuración no secreta validada.

Los enlaces sólo abrirán un borrador de mensaje; el usuario lo revisa y envía. «Copiar diagnóstico» usará el mismo resumen visible y una lista cerrada de campos: nombre del sitio, fecha/hora con zona, clase segura de operación y código local de incidencia. Un ID de solicitud sólo se incluirá si está validado y no contiene datos sensibles. No se copiarán errores crudos, tokens, cookies, consultas, variables, documentos, nombres de pacientes ni URLs con parámetros. Si no se puede copiar al portapapeles, el resumen seguirá seleccionable. Nunca se enviará información al cargar el aviso.

### 7. Guardado cuyo resultado no se pudo confirmar

Si se pierde la respuesta a una escritura, el aviso será «No pudimos confirmar el guardado. No cierres esta pantalla hasta revisar si se guardaron los cambios». No se afirmará éxito ni pérdida: el servidor podría haber guardado aunque la respuesta no llegara. No habrá reenvío automático ni cambio automático de ruta; la verificación será una lectura autenticada y, mientras siga incierto, se ofrecerá contacto con Alejandro. La integración no recargará ni descartará automáticamente la edición abierta. Esto no promete recuperación después de cerrar el navegador ni introduce almacenamiento local de contenido clínico.

## Risks / Trade-offs

- [El relay agrega un componente operativo] → Mantenerlo pequeño, sin persistencia, con configuración reversible y pruebas de equivalencia.
- [Una mutación podría ejecutarse y perderse su respuesta] → No implementar fallback automático y probar escrituras sobre una fixture aislada antes de habilitarlo.
- [Exposición o registro de credenciales] → No agregar autoridad propia, usar allowlist de encabezados, sanitizar errores y prohibir logs de tokens o payloads.
- [Abuso como proxy] → Fijar destino, proyecto y rama; aceptar sólo POST JSON GraphQL o el GET exacto de eventos con parámetros acotados y no incorporar URL suministrada por el cliente.
- [La respuesta del runtime ya está descomprimida pero conserva encabezados originales] → Reconstruir explícitamente `Content-Encoding` y `Content-Length` según el cuerpo enviado al navegador.
- [La incidencia de Tina desaparece antes de validar] → Conservar una fixture determinista y verificar tanto la ruta directa sana como la contingencia, sin depender de reproducir el incidente externo.
- [Costo de Netlify] → Un único Preview después de gates locales; no repetir builds remotos para diagnosticar el proveedor.
- [El mensaje confunde indisponibilidad editorial con caída total o pérdida de trabajo] → Separar lectura, sesión, permisos y guardado incierto; no prometer disponibilidad ni persistencia que no se verificaron.
- [El SDK muestra un modal antes del dashboard] → Probar el arranque real del admin y su acceso a soporte, no sólo el componente aislado; conservar el gate de viabilidad si no hay integración segura.
- [La URL base afecta llamadas distintas de GraphQL o no llega al cliente del admin] → Verificar el tráfico y el cableado real; no ampliar destinos ni modificar el login para aprobar el gate. Rechazar la candidata si requiere cambiar este alcance.
- [Las pruebas aisladas ocultan una regresión de autenticación] → Comparar el arranque directo y mitigado, incluido 401/403, sesión expirada, logout y ayuda sin sesión, y reservar la prueba de login real para el Preview autorizado.

## Migration Plan

1. Reutilizar las fixtures, adaptar el laboratorio a la URL base y validar el sufijo fijo, el cliente efectivo y la separación navegador/CLI/local. Repetir y aprobar el gate de autenticación, schema, soporte y operaciones en el admin real antes de habilitarlo en la configuración normal. Ante fallo, retirar la selección experimental, regenerar el admin directo y documentar el resultado; las pruebas del intento anterior no habilitan avanzar.
2. Integrar el modelo honesto de disponibilidad, mensajes y soporte; verificar que una falla bloquea sólo las acciones dependientes sin mostrar falsos ceros ni descartar trabajo abierto.
3. Activar la ruta por configuración en un único Deploy Preview y comprobar login, schema, lectura, guardado en `editorial/tina` y ausencia de cambios en `main`.
4. Ensayar rollback retirando la configuración y confirmar que no hay migración de datos ni cambios editoriales pendientes.
5. Tras aprobación humana y autorización de publicación, activar en producción y verificar `/admin` con navegador en configuración normal.

Rollback: retirar la variable que selecciona el relay y reconstruir el admin. Como no existe persistencia ni migración, los JSON y el historial Git permanecen intactos. Si el endpoint directo continúa afectado, se informa la indisponibilidad editorial sin alterar el sitio público.
