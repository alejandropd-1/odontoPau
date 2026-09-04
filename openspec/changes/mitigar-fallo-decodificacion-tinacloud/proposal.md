## Why

El Panel editorial puede quedar inutilizable aunque TinaCloud responda `200 OK` cuando la respuesta GraphQL comprimida no puede decodificarse en el navegador. La incidencia fue reproducida en más de un proyecto y desaparece al negociar `gzip`, por lo que necesitamos una contingencia central que no obligue al profesional a abrir herramientas técnicas ni confunda una falla de carga con un catálogo vacío.

## What Changes

- Incorporar una estrategia de continuidad para las operaciones GraphQL autenticadas del Panel editorial y la lectura auxiliar de sincronización que el admin demuestre imprescindible cuando la conexión directa con TinaCloud falle por codificación o transporte.
- Validar primero, en local y sin publicar, si un endpoint intermediario controlado por la aplicación puede conservar autenticación, aislamiento por proyecto y semántica GraphQL mientras evita la respuesta problemática.
- Repetir el gate local con una selección de URL base de contenido que conserve el modo y el login originales de TinaCloud. El primer intento mediante URL completa fue rechazado por cambiar la interfaz a edición local/autohospedada; su evidencia no aprueba esta alternativa. El ajuste de planificación fue autorizado por Alejandro el 2026-09-03.
- Mantener la escritura editorial y los permisos bajo Tina; la contingencia no podrá convertir el contenido privado en una API pública ni omitir los gates Git existentes.
- Presentar estados de carga, indisponibilidad y recuperación honestos: una consulta fallida no mostrará contadores en cero ni un catálogo vacío como si fueran datos confirmados.
- Distinguir sesión inválida, espera agotada, servicio editorial no disponible y guardado sin confirmación mediante avisos cotidianos, sin afirmar una caída del proveedor o un problema de conexión personal que no se haya comprobado. Estos avisos no agregan estados editoriales.
- Ofrecer reintento de lectura y contacto con Alejandro por `admin@useodontopro.com` o WhatsApp `541160513261`, independientes del contacto del consultorio. La persona decide enviar el mensaje; el diagnóstico copiable excluye contenido y credenciales.
- Mantener el aviso de ayuda disponible aunque no cargue el catálogo o falle la validación remota de schema, limitar la espera y no recargar ni repetir escrituras automáticamente cuando su resultado sea incierto.
- Añadir pruebas reproducibles del modo normal, el fallo de transporte y la recuperación, con una salida segura si la mitigación no demuestra equivalencia.
- Documentar una operación y reversión comprensibles, sin exigir DevTools, GitHub, Netlify ni ajustes del navegador al usuario final.
- Fuera de alcance: autoalojar todo Tina, reemplazar TinaCloud, cambiar el flujo de publicación, modificar contenido clínico, sumar estados editoriales o iniciar el trabajo de redes sociales. Tampoco se incorpora edición offline, almacenamiento local persistente de borradores, envío automático de reportes ni monitoreo permanente del proveedor.
- Riesgo clínico: la contingencia no alterará contenido, aprobaciones ni estados; ante incertidumbre deberá bloquear únicamente la acción cuya seguridad dependa del dato no confirmado y conservar producción intacta.
- Criterio de éxito: una persona autenticada puede abrir y usar el Panel editorial con la configuración normal del navegador durante el caso reproducido, sin exposición de secretos, falsos ceros ni cambios en producción; si la solución segura no es viable, el experimento termina sin incorporarse al producto y deja evidencia accionable.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `autoria-tina-cms`: exige una contingencia segura y reversible para la indisponibilidad de la lectura editorial, conservando autenticación, aislamiento y a Git como fuente canónica.
- `dashboard-editorial`: distingue datos confirmados de fallos de carga y ofrece recuperación comprensible sin presentar ceros o catálogos vacíos engañosos.

## Impact

- Panel personalizado de Tina en `/admin` y cliente GraphQL usado para consultar el catálogo y el estado editorial.
- Posible endpoint interno de Next.js sujeto a una prueba de viabilidad antes de adoptarlo, con allowlist cerrada para GraphQL y eventos de sincronización del proyecto/rama configurados.
- Contratos de autenticación TinaCloud, configuración del endpoint de contenido, manejo de errores y pruebas del CMS.
- Pruebas del arranque real del admin y del aislamiento entre configuración de navegador, modo local y CLI; no se reemplaza el proveedor de autenticación ni se habilita edición local para simular una sesión Cloud.
- Mensajes de disponibilidad del admin y dashboard, contacto de soporte configurable sin TinaCloud, documentación operativa y evidencia de validación local/remota.
- No se modifica el sitio público en runtime ni la fuente canónica JSON + Git.
