## ADDED Requirements

### Requirement: Línea base editorial convergente

La validación operativa MUST comenzar con `main` y `editorial/tina` en un estado convergente que contenga el bootstrap publicado, y TinaCloud MUST haber indexado el schema correspondiente antes de aceptar una edición.

#### Scenario: Rama editorial preparada
- **WHEN** se inicia el primer ciclo real
- **THEN** el operador confirma los SHAs base, el branch deploy y el índice Tina sin copiar credenciales ni logs completos

#### Scenario: Divergencia o índice pendiente
- **WHEN** `editorial/tina` no deriva del `main` publicado o TinaCloud no reconoce el contrato vigente
- **THEN** el circuito se detiene antes de `Save` o publicación y solicita la corrección de convergencia

### Requirement: Actualización visible de extremo a extremo

Una modificación editorial reversible y aprobada SHALL completar `Save -> Preview -> Publicar cambios -> Producción` utilizando el panel Tina y la automatización publicada, sin merge manual ni publicación directa de Netlify.

#### Scenario: Save conserva producción
- **WHEN** un colaborador guarda la modificación válida
- **THEN** el Preview muestra el cambio y producción conserva el contenido anterior hasta la acción explícita de publicación

#### Scenario: Publicación autónoma exitosa
- **WHEN** el colaborador aprueba el Preview y activa `Publicar cambios`
- **THEN** un único request atraviesa preflight, PR técnico, checks, merge y deploy, y producción muestra exactamente la modificación autorizada

#### Scenario: Controles internos sin builds redundantes
- **WHEN** el circuito crea el PR técnico o registra pedido, progreso y resultado sin cambiar contenido público
- **THEN** conserva los checks requeridos pero omite el Deploy Preview del PR y los builds de Netlify causados exclusivamente por archivos operativos

#### Scenario: Sincronización sin cambios públicos
- **WHEN** la rama editorial converge con el commit publicado y ambos árboles contienen exactamente los mismos archivos públicos
- **THEN** Netlify no repite ese build y GitHub no duplica un control que ya se inició para la misma revisión

#### Scenario: Gate fallido
- **WHEN** cualquier control rechaza el snapshot
- **THEN** producción permanece en el último commit sano, el Preview conserva la edición y el panel informa en lenguaje cotidiano si corresponde corregir, volver a revisar o pedir ayuda

### Requirement: Retiro y republicación reversibles

La validación SHALL retirar y republicar una pieza existente sin borrar su documento, y MUST comprobar que el estado editorial controla todas sus superficies públicas de forma coherente.

#### Scenario: Retiro publicado
- **WHEN** una pieza pasa a `retired` y el snapshot completa la promoción
- **THEN** deja de aparecer en su ruta canónica, listados, relaciones, sitemap y metadata pública, pero continúa editable en Tina y Preview

#### Scenario: Republicación publicada
- **WHEN** la misma pieza vuelve a `published`, conserva sus requisitos y completa otra promoción
- **THEN** recupera su ruta y superficies canónicas sin duplicados y con el mismo documento editorial

### Requirement: Convergencia obligatoria entre ciclos

Después de cada promoción exitosa, el sistema MUST registrar el request procesado y SHALL dejar `editorial/tina`, `main`, TinaCloud y el deploy de producción referidos al resultado esperado antes de iniciar el ciclo siguiente.

#### Scenario: Cierre saludable
- **WHEN** Netlify publica el commit integrado
- **THEN** una marca pública confirma el commit servido y recién entonces el panel informa éxito y permite comenzar otro ciclo

#### Scenario: Cierre ambiguo
- **WHEN** el merge existe pero el deploy, el índice o la rama editorial no convergen
- **THEN** se bloquea otra publicación y se deriva a intervención técnica

#### Scenario: Seguimiento sin actualización manual
- **WHEN** existe una publicación pendiente, en controles, desplegándose o esperando confirmación
- **THEN** el panel consulta su estado de forma periódica mientras está visible y anuncia los cambios de estado sin exigir recargar la página

### Requirement: Verificación proporcional y evidencia trazable

Cada ciclo SHALL ejecutar un preflight específico antes de la solicitud, confiar en los gates remotos de la revisión exacta y verificar producción mediante estado, commit y rutas representativas. Los logs completos MUST consultarse sólo ante fallo, bloqueo, timeout o commit inesperado.

#### Scenario: Ciclo verde
- **WHEN** preflight, checks, deploy y rutas coinciden con el request
- **THEN** el reporte conserva sólo identificadores, tiempos y resultados mínimos sin repetir builds ni copiar logs verdes

#### Scenario: Diferencia detectada
- **WHEN** un resultado no coincide con la revisión autorizada
- **THEN** se detiene el circuito, se inspecciona únicamente el tramo fallido y se registra la causa antes de reintentar

### Requirement: Privacidad, aprobación y accesibilidad operativa

La operación MUST conservar las aprobaciones clínicas y de imágenes aplicables, MUST excluir datos sensibles de contenido y evidencia, y SHALL permitir que un colaborador complete las acciones y comprenda sus estados mediante controles etiquetados, teclado y mensajes legibles.

#### Scenario: Aprobación aplicable ausente
- **WHEN** la modificación afecta contenido clínico o una imagen sin aprobación confirmada
- **THEN** el colaborador no solicita la publicación y el cambio permanece en Preview

#### Scenario: Uso no técnico del panel
- **WHEN** un colaborador navega la rutina mediante teclado o lector de pantalla
- **THEN** puede identificar Preview, publicación, estado ocupado, éxito y error sin depender sólo del color ni de jerga como PR, CI, merge o SHA

#### Scenario: Inspección local segura de todos los estados
- **WHEN** Alejandro revisa el panel en el entorno local de desarrollo
- **THEN** puede simular cada estado y mensaje sin guardar contenido, crear una solicitud, publicar ni llamar a Netlify, y ese selector no aparece en producción

### Requirement: Handoff operativo y matriz de excepciones

El cambio MUST producir una guía breve para editar, revisar, publicar, retirar y republicar, junto con una matriz que distinga el ciclo saludable de las condiciones que requieren soporte técnico u otro OpenSpec.

#### Scenario: Operación ordinaria
- **WHEN** el diff pertenece a la allowlist, las aprobaciones están confirmadas y todos los indicadores están verdes
- **THEN** el usuario completa el ciclo desde Tina sin abrir GitHub, GitCron o Netlify

#### Scenario: Cambio estructural o incidente
- **WHEN** aparecen código, schema, configuración, navegación, divergencia, error de deploy o duda clínica
- **THEN** la guía ordena detenerse, conserva producción y deriva la situación al circuito técnico correspondiente
