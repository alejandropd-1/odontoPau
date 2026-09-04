## 1. Reproducción y gate de viabilidad

- [x] 1.1 Registrar una fixture local que reproduzca respuesta GraphQL válida con `gzip`, error de autenticación y cuerpo/encabezado de codificación incoherentes, y verificar que el caso no depende de TinaCloud ni de credenciales reales.
- [x] 1.2 Inventariar las operaciones y encabezados que el cliente Tina usa para schema, lectura y mutación, y verificar mediante una prueba contractual que la allowlist mínima conserva su semántica sin copiar tokens a logs.
- [x] 1.3 Construir un prototipo aislado del relay con upstream controlado y verificar consulta de schema, catálogo y mutación GraphQL antes de conectarlo al admin.
- [ ] 1.4 Identificar y probar en el arranque real del admin el punto de integración para mostrar aviso y soporte cuando falla schema o autenticación, verificando que el modal del SDK no impide acceder a ayuda ni que el aviso expone documentos sin sesión.
- [x] 1.5 Ejecutar el primer gate de viabilidad y documentar el resultado: continuar sólo si el prototipo conserva autenticación, estado, errores y mutaciones y permite el acceso a los avisos y soporte previstos; si falla, retirar el prototipo y verificar que no quedó seleccionado por configuración.
- [ ] 1.6 Adaptar el laboratorio para evaluar `tinaioConfig.contentApiUrlOverride` como URL base sin override de URL completa; verificar el cableado al cliente efectivo del admin, flags Cloud, destinos de identidad sin cambios, separación navegador/CLI/local y validación estricta del sufijo SDK contra versión/proyecto/rama configurados. Admitir sólo el `GET` de eventos demostrado imprescindible con método y parámetros acotados; inventariar cualquier llamada adicional sin ampliar la allowlist silenciosamente.
- [ ] 1.7 Comparar en el admin compilado las rutas directa y candidata con fixtures de sesión ausente, válida, expirada, 401, 403 y servicio de identidad sin respuesta; verificar login/logout/renovación originales, ayuda accesible antes del dashboard sin documentos, comparación y recuperación de schema, lectura y guardado incierto sin replay. Estas fixtures no sustituyen la autenticación real de 6.2.
- [ ] 1.8 Repetir el gate después de 1.4, 1.6 y 1.7, registrar aprobado o rechazado y habilitar tareas 2–6 sólo si conserva el contrato completo. Ante fallo retirar la selección experimental, regenerar y comprobar el admin directo, mantener las tareas de integración pendientes y solicitar una nueva decisión.

**Resultado del primer gate (2026-09-03): RECHAZADO.** Se ejecutó la salida de fallo de 1.5 y se retiró la integración experimental del producto. Alejandro autorizó el ajuste del diseño hacia la URL base; esa revisión documental no aprueba la alternativa. La tarea 1.4 sigue pendiente y las tareas 2–6 requieren el nuevo gate 1.8 aprobado. `evidence.md` conserva la evidencia histórica del primer intento, incluidas las cinco pruebas aisladas; ninguna valida todavía el nuevo arranque del admin.

**Segundo intento local (2026-09-03): bloqueado durante 1.6–1.7.** El admin compilado conservó el login Cloud ante 401 y dirigió schema/catálogo al prefijo esperado, pero también envió `GET /events/<clientId>/editorial%2Ftina?limit=1`. El contrato limitado a POST GraphQL lo rechazó; `useSyncStatus` falló al recibir una respuesta sin `events`. Se retiró la selección experimental; 1.4 y 1.6–1.8 continuaron sin completar, y tareas 2–6 no quedaron habilitadas. Alejandro autorizó luego admitir las lecturas auxiliares imprescindibles con proyecto/rama fijos; el trabajo se reanuda con `events` como única excepción observada y sin abrir los demás endpoints de la base.

## 2. Contingencia de transporte autenticada

- [ ] 2.1 Implementar el endpoint mismo-origen con destino, versión, client ID y rama determinados por configuración confiable; validar el sufijo que genera el SDK, su decodificación por el router y rechazos de paths/proyectos/ramas/parámetros no admitidos antes del upstream, sin convertirlo en un proxy abierto.
- [ ] 2.2 Aceptar únicamente `POST` JSON acotado para GraphQL y `GET` sin cuerpo para la lectura fija de eventos, y reenviar la credencial Tina vigente sin autoridad adicional, verificando rechazos para método, path, parámetros, origen, tamaño, formato y sesión inválidos.
- [ ] 2.3 Negociar `gzip` con el upstream y reconstruir estado, cuerpo y encabezados de respuesta coherentes, verificando que una descompresión del runtime no conserve `Content-Encoding` ni `Content-Length` falsos.
- [ ] 2.4 Sanitizar errores y observabilidad para excluir bearer, payload GraphQL, contenido clínico y datos personales, y verificar los casos de upstream caído, timeout, respuesta no JSON y error GraphQL.
- [ ] 2.5 Incorporar la selección de URL base aprobada por 1.8, sólo para el admin Cloud en navegador, sin override de URL completa ni cambios del proveedor de autenticación; verificar ruta directa con variable ausente/deshabilitada, endpoints CLI/local intactos y activación/rollback mediante builds focalizados sin credenciales de servidor en el bundle.
- [ ] 2.6 Añadir pruebas de no fallback automático en consultas y mutaciones, verificando que cada operación se envía una sola vez aunque la respuesta se pierda o falle.
- [ ] 2.7 Definir y probar plazos finitos de espera en cliente y relay, verificando timeout, liberación del estado ocupado y descarte de respuestas tardías que no deben sobrescribir una consulta más reciente.

## 3. Estados honestos y recuperación del dashboard

- [ ] 3.1 Modelar `cargando`, `datos confirmados` e `indisponible` como estados explícitos y verificar que contadores, catálogo y estados públicos sólo se derivan de datos confirmados.
- [ ] 3.2 Sustituir los falsos ceros durante una falla por una explicación cotidiana y segura, bloquear sólo las acciones dependientes del dato no confirmado y verificar que una indisponibilidad aislada del historial conserva las funciones permitidas por el contrato existente.
- [ ] 3.3 Incorporar un reintento manual único con estado ocupado y verificar que no guarda contenido, no crea solicitudes de publicación y no llama a Netlify.
- [ ] 3.4 Restaurar automáticamente datos, totales, filtros, paginación y acciones después de una consulta exitosa, verificando recuperación sin recargar todo el admin.
- [ ] 3.5 Verificar con teclado, lector de pantalla y viewports de escritorio y móvil que carga, error, detalle y reintento tienen semántica, foco, contraste y distribución utilizables.
- [ ] 3.6 Incorporar avisos diferenciados de lectura no disponible, sesión inválida, permisos y espera agotada; verificar que no culpan a la conexión personal ni afirman una caída del proveedor o disponibilidad pública no comprobadas, y que no agregan estados editoriales.
- [ ] 3.7 Incorporar contacto de Alejandro centralizado en configuración no secreta con `admin@useodontopro.com` y `541160513261`; verificar enlaces `mailto:` y `https://wa.me/541160513261`, ausencia de modificación del número y separación del contacto del consultorio.
- [ ] 3.8 Preparar borradores de contacto y diagnóstico copiable con campos permitidos, verificar revisión y envío manual por la persona, sanitización y alternativa seleccionable cuando falle el portapapeles, sin enviar datos al abrir el aviso.
- [ ] 3.9 Comunicar el guardado sin confirmación sin afirmar éxito ni pérdida, verificar que no recarga ni descarta automáticamente el formulario y que permite comprobación por lectura o soporte sin reenviar escrituras ni introducir persistencia local de contenido.

## 4. Seguridad, regresión y mantenimiento

- [ ] 4.1 Verificar con pruebas automatizadas que una sesión ausente o de otro proyecto no obtiene documentos y que el relay nunca lee `TINA_TOKEN` ni otra credencial de servidor.
- [ ] 4.2 Verificar que guardar mediante la ruta probada mantiene la escritura en `editorial/tina`, no altera `main` ni dispara publicación, usando un upstream local controlado y comparando la operación reenviada.
- [ ] 4.3 Confirmar mediante pruebas de rutas y loaders que el sitio público continúa funcionando desde JSON de `main` sin consultar el relay ni TinaCloud en runtime.
- [ ] 4.4 Documentar activación, diagnóstico, reversión, actualización de contactos y reporte al proveedor con lenguaje operativo; verificar que no exige DevTools al profesional, no contiene tokens, payloads o información clínica y distingue mitigación de compresión de una caída total de TinaCloud.
- [ ] 4.5 Documentar el patrón reutilizable y sus límites para otros sitios sin modificar ni desplegar AleDesign u otro proyecto desde este OpenSpec.

## 5. Validación local y gates

- [ ] 5.1 Ejecutar las pruebas focalizadas del relay, configuración Tina, dashboard, seguridad y sitio público, y registrar comandos y resultados reproducibles sin servicios externos.
- [ ] 5.2 Ejecutar `pnpm run validate:openspec` y verificar que el cambio y las specs resultan estrictamente válidos.
- [ ] 5.3 Ejecutar una sola tanda final de `pnpm exec tsc --noEmit`, `pnpm run lint` y `pnpm run build` después de estabilizar los tests focalizados, y registrar resultados sin repetir builds innecesarios.
- [ ] 5.4 Revisar el diff completo y verificar que no contiene contenido clínico, cambios editoriales, secretos, artefactos de navegador ni archivos de otros OpenSpecs.

## 6. Preview, rollback y aprobación

- [ ] 6.1 Con autorización de Alejandro, publicar la rama en un Draft PR y obtener un único Deploy Preview después de CI verde, verificando que no se inicia un deploy de producción.
- [ ] 6.2 Verificar en el Preview, con navegador en configuración normal y sesión Tina autorizada, que login, validación de schema, catálogo, estados y reintento funcionan sin `ERR_CONTENT_DECODING_FAILED` ni falsos ceros; complementar con evidencia local de caída, sesión inválida, timeout, guardado incierto y acceso a soporte desde el arranque.
- [ ] 6.3 Verificar en el Preview que las operaciones editoriales siguen destinadas a `editorial/tina`, que `main` permanece intacta y que ninguna prueba inicia una publicación.
- [ ] 6.4 Ensayar el rollback de configuración en un entorno no productivo y verificar que no requiere migrar datos, no pierde contenido y devuelve el admin al endpoint directo esperado.
- [ ] 6.5 Comprobar que el sitio público y sus rutas representativas permanecen sin cambios antes de solicitar la aprobación final.
- [ ] 6.6 Alejandro revisa manualmente el único Deploy Preview o evidencia equivalente, confirma los textos y que correo/WhatsApp abren el destinatario de soporte correcto sin enviar mensajes de prueba automáticamente, y marca personalmente este último checkbox; ningún agente puede marcarlo.
