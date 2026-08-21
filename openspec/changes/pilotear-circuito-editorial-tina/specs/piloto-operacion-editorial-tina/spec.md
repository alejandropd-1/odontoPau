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

### Requirement: Bootstrap estructural verificable
La infraestructura de publicación SHALL validarse en un Draft PR y un Deploy Preview antes de integrarse. El bootstrap MUST demostrar `Save -> Preview` sin modificar producción, MUST mantener la allowlist cerrada y MUST NOT copiar código, workflows u OpenSpec a `editorial/tina` para simular anticipadamente un ciclo real.

#### Scenario: Workflow todavía no publicado
- **WHEN** el workflow sólo existe en la rama estructural del OpenSpec
- **THEN** el bootstrap puede cerrar con evidencia de CI y Preview, pero la rutina no se declara estable ni se inventa una publicación real

#### Scenario: Infraestructura integrada
- **WHEN** el bootstrap se mezcla con autorización y `editorial/tina` converge con el nuevo `main`
- **THEN** el sucesor operativo puede ejecutar los dos ciclos reales sin relajar la allowlist

### Requirement: Autoridad editorial explicita
La automatización MUST actuar solamente después de una solicitud consciente de un colaborador Tina. Las aprobaciones clínicas aplicables permanecen obligatorias como responsabilidad humana, pero el sistema MUST NOT imponer una separación adicional entre profesional, editor, Admin o Editor de Tina para activar la publicación.

#### Scenario: Colaborador confiable
- **WHEN** una persona autenticada del proyecto confirma el Preview y las aprobaciones aplicables
- **THEN** puede solicitar la publicación o el retiro desde el mismo panel

#### Scenario: Falta confirmacion
- **WHEN** sólo se guardaron cambios o se seleccionó un estado editorial
- **THEN** no existe autorización de producción y el snapshot permanece en Preview

### Requirement: Continuidad obligatoria del piloto
El bootstrap SHALL producir una guía para personas no técnicas, una matriz de excepciones y un handoff reusable para OdontoPia y GitCron. La rutina MUST permanecer en estado pendiente de validación operativa hasta que `validar-operacion-editorial-tina-en-produccion` complete una actualización visible y un retiro o republicación reales con evidencia mínima no sensible.

#### Scenario: Bootstrap cerrado
- **WHEN** infraestructura, permisos, CI y Preview están validados y el cambio se integra
- **THEN** el sucesor recibe ramas convergentes, gates vigentes y los dos ciclos pendientes sin reconstruir el contexto
