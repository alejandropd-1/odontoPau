## ADDED Requirements

### Requirement: Flujo autonomo visible desde Tina
El panel editorial SHALL explicar y ofrecer el circuito `Guardar -> Preview -> Publicar cambios -> Producción` sin exigir al colaborador abrir GitHub, GitCron o Netlify. El botón de publicación SHALL estar disponible para cualquier colaborador autenticado del proyecto y MUST advertir que promueve el snapshot completo.

#### Scenario: Edicion ordinaria
- **WHEN** un colaborador guarda uno o más documentos
- **THEN** el panel indica que los cambios están en Preview y producción continúa sin cambios

#### Scenario: Confirmacion de publicacion
- **WHEN** un colaborador activa `Publicar cambios`
- **THEN** confirma el alcance global, las aprobaciones aplicables y crea una solicitud única

#### Scenario: Solicitud en curso
- **WHEN** existe una solicitud pendiente o procesándose
- **THEN** el control evita otra activación y muestra un estado comprensible

### Requirement: Preview compartible y estado operativo
El panel SHALL mostrar un enlace configurable al Preview de `editorial/tina` y SHALL informar al menos los estados `sin cambios pendientes`, `pendiente`, `procesando`, `publicado`, `fallido` y `esperando índice`. Los mensajes MUST evitar jerga técnica o exponer secretos.

#### Scenario: Publicacion fallida
- **WHEN** la automatización rechaza el snapshot
- **THEN** el panel explica que producción no cambió y que las modificaciones siguen disponibles en Preview

### Requirement: Clasificacion cerrada del cambio editorial
Cada ciclo MUST clasificarse como `editorial-routine` o `structural-change`. Sólo SHALL considerarse rutinario un cambio limitado a contenido, metadata editorial o activos admitidos por contratos vigentes, sin alterar código, schema, validadores, rutas, navegación, dependencias ni configuración.

#### Scenario: Reemplazo de imagen existente
- **WHEN** un colaborador reemplaza una imagen dentro de un campo soportado y conserva metadata válida
- **THEN** el ciclo puede clasificarse `editorial-routine` si el diff completo pertenece a la allowlist

#### Scenario: Aparece un campo nuevo
- **WHEN** la modificación requiere agregar un campo al schema o cambiar un renderizador
- **THEN** el ciclo se clasifica `structural-change`, se detiene el carril automático y se deriva a un OpenSpec propio

### Requirement: Piloto representativo y medido
El sistema SHALL completar dos ciclos editoriales reales antes de declarar estable la rutina: al menos una actualización visible y un retiro o republicación. Cada ciclo MUST registrar evidencia mínima no sensible, duración, fallos e intervención necesaria.

#### Scenario: Cobertura suficiente
- **WHEN** los dos ciclos llegan correctamente a producción y terminan convergentes
- **THEN** el piloto puede cerrar sin fabricar un tercer cambio

### Requirement: Autoridad editorial explicita
La automatización MUST actuar solamente después de una solicitud consciente de un colaborador Tina. Las aprobaciones clínicas aplicables permanecen obligatorias como responsabilidad humana, pero el sistema MUST NOT imponer una separación adicional entre profesional, editor, Admin o Editor de Tina para activar la publicación.

#### Scenario: Colaborador confiable
- **WHEN** una persona autenticada del proyecto confirma el Preview y las aprobaciones aplicables
- **THEN** puede solicitar la publicación o el retiro desde el mismo panel

#### Scenario: Falta confirmacion
- **WHEN** sólo se guardaron cambios o se seleccionó un estado editorial
- **THEN** no existe autorización de producción y el snapshot permanece en Preview

### Requirement: Resultado operativo transferible
Al finalizar, el piloto SHALL producir una guía para personas no técnicas, una matriz de excepciones y un handoff reusable para OdontoPia y GitCron, diferenciando scripts deterministas de tareas aptas para un modelo local sin autoridad de publicación.

#### Scenario: Operacion saludable
- **WHEN** un ciclo cumple clasificación, aprobación, gates, convergencia y publicación
- **THEN** el colaborador lo completa desde Tina y la intervención técnica queda reservada para excepciones
