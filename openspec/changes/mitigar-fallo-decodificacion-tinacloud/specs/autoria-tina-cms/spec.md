## ADDED Requirements

### Requirement: Continuidad segura de la API editorial
El admin SHALL disponer de una ruta de contingencia central y reversible para comunicarse con la API de contenido cuando una respuesta negociada directamente por el navegador no pueda decodificarse. La contingencia MUST conservar la autenticación de Tina, fijar el proyecto y la rama editorial autorizados, reenviar sólo las operaciones GraphQL necesarias y las lecturas auxiliares demostradas como imprescindibles, y MUST NOT agregar credenciales privilegiadas, exponer contenido sin sesión ni modificar `main`.

#### Scenario: Respuesta comprimida incompatible
- **WHEN** la API de contenido responde al navegador con una codificación que éste anuncia pero no puede decodificar
- **THEN** el admin puede completar la misma operación autenticada por la ruta de contingencia sin exigir ajustes del navegador

#### Scenario: Persona sin sesión válida
- **WHEN** una persona sin una credencial Tina válida invoca la ruta de contingencia
- **THEN** la API de contenido rechaza la operación y la contingencia no agrega una credencial que amplíe su acceso

#### Scenario: Destino fuera del proyecto
- **WHEN** una solicitud intenta elegir otro proyecto, rama, origen o destino arbitrario
- **THEN** la contingencia rechaza la solicitud antes de reenviarla y sólo construye su destino desde la configuración editorial permitida del sitio

#### Scenario: Sufijo generado por el SDK
- **WHEN** el SDK agrega versión, client ID y rama codificada al prefijo mismo-origen de contenido
- **THEN** la contingencia valida el path contra el único destino autorizado, rechaza rutas ambiguas o no admitidas y no usa segmentos ni parámetros del cliente para elegir el upstream

#### Scenario: Sincronización auxiliar del SDK
- **WHEN** el admin autenticado consulta los eventos necesarios para sincronizar el proyecto y la rama editorial configurados
- **THEN** la contingencia admite únicamente el `GET` de eventos con `limit` y `cursor` validados, reenvía la sesión vigente al destino fijo y rechaza cualquier otra lectura auxiliar, método, proyecto, rama o parámetro

#### Scenario: Escritura editorial válida
- **WHEN** una persona autenticada guarda mediante una operación admitida que atraviesa la contingencia
- **THEN** la operación conserva la semántica de Tina y escribe exclusivamente en `editorial/tina` sin promover el cambio a producción

#### Scenario: Contingencia deshabilitada
- **WHEN** la mitigación produce una incompatibilidad o debe revertirse
- **THEN** un responsable puede volver al endpoint directo mediante configuración sin migrar ni perder contenido editorial

### Requirement: Integración de transporte sin cambio de modo de autenticación
La selección de contingencia MUST conservar el modo Cloud y el mecanismo original de autenticación de Tina, incluidos inicio, cierre y renovación de sesión. MUST NOT activar modo local/autohospedado, presentar guardado local como alternativa ni permitir acceso a documentos para mostrar ayuda. La integración MUST superar un nuevo gate en el admin compilado, no sólo tests del cliente o del dashboard, antes de incorporarse al producto. Un gate anterior rechazado MUST NOT considerarse aprobación de la alternativa.

#### Scenario: Inicio y recuperación de sesión Cloud
- **WHEN** la persona abre el admin sin sesión o su sesión deja de ser válida mientras la contingencia está seleccionada
- **THEN** se conserva el login original de TinaCloud, se ofrece ayuda sin cargar documentos y no se muestra una entrada a edición local ni se reenvían escrituras pendientes

#### Scenario: Autenticación fuera del relay
- **WHEN** el cliente realiza login, logout o renovación de sesión con la contingencia de contenido activa
- **THEN** utiliza los servicios y el proveedor originales de TinaCloud, sin trasladar esas operaciones o sus credenciales al relay de contenido

#### Scenario: CLI y modo local
- **WHEN** se genera el schema, se ejecuta el build o se abre el admin en modo local
- **THEN** se conserva el endpoint propio de ese entorno sin requerir un relay levantado, sin cambiar su autenticación ni exponer credenciales de build al navegador

#### Scenario: Alternativa no viable
- **WHEN** la candidata cambia el login, bloquea ayuda, requiere destinos fuera del contrato o no conserva operaciones y errores en el admin real
- **THEN** se rechaza el gate, se retira su selección experimental y se verifica la configuración directa, dejando la integración pendiente de una nueva decisión

### Requirement: Fallo editorial aislado de producción
La contingencia y sus errores MUST permanecer limitados al entorno autenticado de edición. El sitio público SHALL continuar leyendo exclusivamente el contenido versionado de `main`, sin depender de TinaCloud, de la ruta de contingencia ni de una credencial editorial en runtime.

#### Scenario: TinaCloud o la contingencia no disponible
- **WHEN** la API editorial directa y la ruta de contingencia no pueden completar una consulta
- **THEN** se interrumpe la operación editorial pero el sitio público conserva el último contenido de producción confirmado

### Requirement: Fallos de sesión y escritura comunicados sin ambigüedad
El admin MUST diferenciar una sesión inválida, permisos insuficientes y una operación sin respuesta confirmada mediante mensajes cotidianos. MUST NOT afirmar que una escritura se guardó o se perdió sin evidencia ni reenviarla automáticamente. Los avisos y el acceso a soporte MUST funcionar sin cargar documentos desde TinaCloud y MUST NOT exponer contenido sin sesión.

#### Scenario: Sesión inválida
- **WHEN** el servicio de autenticación o contenido confirma que la sesión no es válida
- **THEN** el admin invita a iniciar sesión mediante el mecanismo existente, sin atribuirlo a una caída general ni ejecutar de nuevo una escritura pendiente

#### Scenario: Permiso insuficiente
- **WHEN** una operación recibe un rechazo de permisos con sesión válida
- **THEN** se explica que no tiene acceso a esa operación y se ofrece contactar a Alejandro sin entrar en un bucle de login

#### Scenario: Respuesta de guardado perdida
- **WHEN** una escritura enviada no devuelve una confirmación utilizable
- **THEN** el admin muestra «No pudimos confirmar el guardado», no recarga ni descarta automáticamente la edición abierta, y permite verificar mediante lectura autenticada o contactar a Alejandro sin repetir la escritura automáticamente

#### Scenario: Error de schema durante el arranque
- **WHEN** el admin no puede obtener el schema remoto y aún no cargó los formularios o el dashboard
- **THEN** la persona puede acceder a un aviso comprensible y al contacto de soporte, sin tener que interpretar un modal técnico ni disponer de un catálogo cargado
