## ADDED Requirements

### Requirement: Disponibilidad editorial representada con honestidad
El Panel editorial MUST distinguir `cargando`, `datos confirmados` e `indisponible` antes de calcular totales, estados o acciones. Ante una falla de autenticación, transporte, codificación, schema o servicio, MUST explicar que no pudo consultar el editor y MUST NOT representar cero contenidos, cero publicaciones, un catálogo vacío ni estados públicos como si fueran resultados confirmados.

#### Scenario: Catálogo confirmado vacío
- **WHEN** la consulta autenticada finaliza correctamente y devuelve una colección válida sin documentos
- **THEN** el panel puede mostrar un total de cero y explica que todavía no hay contenidos

#### Scenario: Consulta fallida antes de recibir el catálogo
- **WHEN** la consulta no entrega un resultado GraphQL válido
- **THEN** los totales y estados dependientes quedan como no disponibles, el panel ofrece reintentar y no aparenta que el catálogo esté vacío

#### Scenario: Recuperación de la conexión
- **WHEN** una consulta posterior finaliza correctamente después de una indisponibilidad
- **THEN** el panel reemplaza el aviso por datos confirmados y recalcula totales y acciones sin requerir recargar todo el admin, conservando filtros, página y vista de tabla o tarjetas

#### Scenario: Mensaje para una persona no técnica
- **WHEN** el panel no puede consultar los datos editoriales
- **THEN** muestra una explicación cotidiana y una acción segura sin exponer ramas, tokens, GraphQL, codificaciones, infraestructura ni trazas técnicas en la vista principal

#### Scenario: Diagnóstico para soporte
- **WHEN** un responsable necesita investigar la incidencia
- **THEN** puede desplegar un detalle técnico acotado que excluye secretos, credenciales, contenido clínico y datos de pacientes

### Requirement: Acciones bloqueadas sin estado confirmado
El Panel editorial MUST deshabilitar cada acción cuya seguridad dependa de un catálogo, documento, manifiesto o estado público que no pudo confirmar. Una indisponibilidad parcial MUST NOT bloquear funciones que no dependan del dato fallido y MUST NOT iniciar guardados, solicitudes de publicación, retiros ni reintentos automáticos costosos por sí sola.

#### Scenario: Catálogo editorial no confirmado
- **WHEN** el panel no pudo cargar el catálogo necesario para identificar los contenidos
- **THEN** mantiene disponibles la navegación, el reintento de esa lectura y el contacto con soporte, sin habilitar acciones dependientes del catálogo ni afirmar un resultado de publicación desconocido

#### Scenario: Historial temporalmente no disponible
- **WHEN** el catálogo y el documento están confirmados pero falla únicamente la consulta de historial
- **THEN** el panel conserva la edición y revisión previstas por el contrato existente, identifica el historial como no disponible y no presenta ese fallo como un catálogo vacío

#### Scenario: Reintento solicitado
- **WHEN** la persona elige volver a intentar
- **THEN** el panel realiza una única consulta nueva sin guardar contenido, crear una solicitud editorial ni llamar a Netlify

### Requirement: Espera limitada y recuperación segura
Las lecturas del panel y su contingencia MUST tener un plazo finito definido y probado. Al agotarse MUST finalizar el estado ocupado, informar que no pudo completar la consulta y ofrecer reintento manual y soporte. Una respuesta tardía MUST NOT sobrescribir los datos o el resultado de una consulta posterior.

#### Scenario: Servicio sin respuesta
- **WHEN** se agota el plazo de una lectura sin resultado válido
- **THEN** el panel deja de mostrar carga indefinida, mantiene los datos dependientes como no disponibles y ofrece reintentar sin atribuir la falla a la conexión personal

#### Scenario: Respuesta antigua después de recuperar
- **WHEN** llega la respuesta de una lectura cancelada después de que otra consulta más reciente finalizó
- **THEN** el panel conserva el resultado reciente y no reactiva un aviso obsoleto

### Requirement: Ayuda accesible y contacto con el responsable del sitio
Los avisos de indisponibilidad MUST explicar el impacto editorial en lenguaje cotidiano, sin agregar estados a `Publicado`, `No publicado` y `Borrador`. MUST ofrecer contacto con Alejandro mediante correo `admin@useodontopro.com` y WhatsApp `541160513261`, centralizados en configuración no secreta del admin e independientes del contacto del consultorio y de la disponibilidad de TinaCloud. MUST NOT enviar reportes automáticamente ni garantizar disponibilidad del sitio público o persistencia de cambios no comprobadas.

#### Scenario: Lectura editorial no disponible
- **WHEN** no se puede consultar el servicio de edición
- **THEN** el aviso explica que ese fallo no retira el contenido ya publicado y ofrece «Reintentar», «Contactar a Alejandro» y «Copiar diagnóstico», sin exigir DevTools ni identificar al proveedor como culpable sin evidencia

#### Scenario: Ayuda sin catálogo confirmado
- **WHEN** el panel no pudo confirmar el catálogo y presenta el aviso de indisponibilidad
- **THEN** el aviso, el reintento y los contactos siguen accesibles con teclado y en móvil sin depender de una lectura editorial previa

#### Scenario: Contacto elegido por la persona
- **WHEN** la persona elige correo o WhatsApp dentro del contacto con Alejandro
- **THEN** se abre un borrador dirigido a `mailto:admin@useodontopro.com` o `https://wa.me/541160513261` respectivamente, sin modificar el número ni enviar el mensaje sin intervención de la persona

#### Scenario: Diagnóstico seguro
- **WHEN** la persona decide copiar o incluir el diagnóstico en el borrador de contacto
- **THEN** puede revisar un resumen con nombre del sitio, fecha y zona horaria, operación e identificador sanitizados, sin tokens, cookies, errores crudos, URLs con parámetros, contenido editorial ni datos de pacientes

#### Scenario: Portapapeles no disponible
- **WHEN** no es posible copiar el resumen mediante el portapapeles
- **THEN** el resumen sigue visible y seleccionable y los contactos permanecen utilizables

#### Scenario: Uso accesible en móvil o con teclado
- **WHEN** la persona navega el aviso, el detalle y los canales de contacto
- **THEN** los controles tienen nombres comprensibles, foco visible, anuncios de estado no repetitivos y una distribución utilizable sin depender del color ni de un ancho de escritorio
