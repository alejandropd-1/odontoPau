## MODIFIED Requirements

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

## ADDED Requirements

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
