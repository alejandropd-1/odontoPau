## Why

El Panel editorial presenta como datos confirmados lo que en realidad es una consulta fallida. Si la primera lectura del catálogo falla, `documents` queda vacío, `loading` vuelve a `false` y las cuatro tarjetas superiores muestran `0 artículos`, `0 instrucciones`, `0 ya publicados` y `0 cambios por publicar`. Si falla una lectura posterior, el panel conserva los números anteriores y los sigue mostrando como vigentes. Ninguna de las dos situaciones depende de TinaCloud ni de la incidencia de codificación: ocurren hoy ante una sesión vencida, un plazo agotado o una interrupción de red.

A eso se suma que la parte superior responde tres veces a la misma pregunta —cuántos contenidos hay, en qué estado está la tanda de publicación y qué pasó con las publicaciones anteriores— con la misma jerarquía visual, incluso cuando no hay ninguna tanda en curso.

Este cambio es independiente de la mitigación de transporte de `mitigar-fallo-decodificacion-tinacloud`. Se separó para que la legibilidad y la honestidad del panel no queden condicionadas al resultado de un gate de viabilidad técnica: si esa mitigación no prospera, el panel debe explicar la indisponibilidad igual.

## What Changes

- Representar la lectura editorial como `cargando`, `datos confirmados` o `indisponible`, y derivar totales, catálogo y acciones únicamente de datos confirmados.
- Sustituir los falsos ceros y los datos obsoletos por una explicación cotidiana con reintento, sin presentar un catálogo vacío ni cifras anteriores como resultados vigentes.
- Bloquear sólo las acciones que dependen del dato no confirmado; una falla aislada del historial conserva la edición y la revisión que el contrato vigente ya permite.
- Definir un plazo finito de espera y descartar respuestas tardías que no deben sobrescribir una consulta más reciente.
- Diferenciar sesión inválida, permisos insuficientes, espera agotada y servicio no disponible, sin culpar a la conexión de la persona ni afirmar una caída del proveedor que no se comprobó. Estos avisos no agregan estados editoriales.
- Ofrecer contacto con Alejandro por `admin@useodontopro.com` y WhatsApp `541160513261` desde configuración no secreta, con borrador revisable por la persona y diagnóstico copiable de campos cerrados.
- Reducir la competencia visual de la parte superior: el estado de la tanda de publicación ocupa lugar propio sólo mientras hay una tanda en curso.
- Retirar `publicLabel` del modelo. Se calcula y se prueba, pero no se renderiza en ninguna vista; el contrato vigente ya condensa el estado en `Publicado`, `No publicado` y `Borrador` más la columna `Qué pasa`.
- Fuera de alcance: la mitigación de transporte y el relay; el aviso previo a la carga del dashboard cuando falla el schema o la autenticación del SDK, que continúa en `mitigar-fallo-decodificacion-tinacloud`; agregar estados editoriales; modificar contenido clínico; cambiar el flujo de publicación por tanda.
- Riesgo clínico: ninguno directo. El cambio no altera contenido, aprobaciones ni estados editoriales, y ante incertidumbre bloquea únicamente la acción cuya seguridad depende del dato no confirmado.
- Criterio de éxito: ante cualquier falla de lectura, el Panel editorial explica que no pudo consultar el editor y ofrece una acción segura, sin mostrar cero contenidos, sin presentar cifras anteriores como vigentes y sin bloquear funciones que no dependen del dato fallido.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `dashboard-editorial`: distingue datos confirmados de fallos de lectura, limita la espera y ofrece recuperación y contacto comprensibles sin presentar ceros o catálogos vacíos engañosos.

## Impact

- `tina/dashboard/editorial-dashboard-model.ts` y sus pruebas: modelo de disponibilidad y retiro de `publicLabel`.
- `tina/dashboard/EditorialDashboard.tsx`: estados de carga, aviso, reintento, plazo, mensajes diferenciados, contacto y jerarquía de la parte superior.
- Configuración no secreta de contacto de soporte, independiente del contacto del consultorio.
- No se modifica el sitio público, la fuente canónica JSON + Git, el schema de Tina ni el flujo de publicación.
