# piloto-operacion-editorial-tina Specification

## Purpose
TBD - created by archiving change pilotear-circuito-editorial-tina. Update Purpose after archive.
## Requirements
### Requirement: Flujo autonomo visible desde Tina
El panel editorial SHALL explicar y ofrecer el circuito `Guardar -> Preview -> Publicar cambios -> Producción` sin exigir al colaborador abrir GitHub, GitCron o Netlify. El botón de publicación SHALL estar disponible para cualquier colaborador autenticado del proyecto y MUST advertir que promueve el snapshot completo. Las filas individuales SHALL preparar y explicar cada contenido, pero MUST NOT iniciar despliegues aislados.

#### Scenario: Edicion ordinaria
- **WHEN** un colaborador guarda uno o más documentos
- **THEN** las filas afectadas indican que los cambios están sólo en Preview y producción continúa con la última tanda confirmada

#### Scenario: Confirmacion de publicacion
- **WHEN** un colaborador activa `Publicar cambios`
- **THEN** confirma el alcance global, las aprobaciones aplicables y crea una solicitud única para el snapshot completo

#### Scenario: Solicitud en curso
- **WHEN** existe una solicitud pendiente, procesándose o desplegándose
- **THEN** el control evita otra activación y distingue que la tanda está en curso sin afirmar que ya quedó publicada

### Requirement: Preview compartible y estado operativo
El panel SHALL mostrar un enlace configurable al Preview de `editorial/tina` y SHALL informar al menos los estados globales `sin cambios pendientes`, `pendiente`, `procesando`, `desplegando`, `publicado`, `fallido` y `esperando índice`. También SHALL mostrar por contenido si la versión está sólo en Preview, ya está publicada, está retirada o no pudo confirmarse. Los mensajes MUST evitar jerga técnica o exponer secretos.

#### Scenario: Publicacion fallida
- **WHEN** la automatización rechaza el snapshot
- **THEN** el panel explica que producción no cambió y que las modificaciones siguen disponibles en Preview

#### Scenario: Despliegue todavía no confirmado
- **WHEN** los controles terminaron pero el sitio público aún no confirmó la tanda
- **THEN** el panel comunica que el sitio se está actualizando y no usa un mensaje que pueda interpretarse como publicación completada

#### Scenario: Publicacion confirmada
- **WHEN** la marca pública coincide con la revisión promovida
- **THEN** el panel informa que la tanda ya está publicada y actualiza el estado público derivado de sus contenidos

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

### Requirement: Índice mínimo de producción por contenido
La automatización SHALL registrar junto al resultado de una tanda exitosa un índice no sensible de las piezas promovidas, con identidad estable, huella determinista y presencia pública. El panel MUST usar ese índice para comparar Preview con producción y MUST tratar su ausencia o inconsistencia como estado desconocido.

#### Scenario: Cierre de tanda exitoso
- **WHEN** producción confirma la revisión exacta promovida
- **THEN** el workflow registra el índice correspondiente antes de habilitar otra publicación

#### Scenario: Contenido nuevo en Preview
- **WHEN** un documento no aparece en el último índice de producción
- **THEN** la fila indica que todavía existe sólo en vista previa

#### Scenario: Retiro confirmado
- **WHEN** el índice registra que una pieza fue promovida con estado retirado y no tiene presencia pública
- **THEN** la fila informa que está retirada del sitio pero conserva su acción de edición

