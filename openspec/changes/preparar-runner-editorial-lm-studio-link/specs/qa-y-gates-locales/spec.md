## ADDED Requirements

### Requirement: Validaciones deterministas obligatorias
El sistema SHALL ejecutar schemas, comprobaciones de rutas y activos, frases prohibidas, TypeScript, lint, build y checks específicos del job sin delegar la interpretación del exit code al modelo.

#### Scenario: Todos los checks pasan
- **WHEN** cada validación requerida finaliza correctamente
- **THEN** el job puede avanzar a revisión pero no a publicación

#### Scenario: Un activo referenciado no existe
- **WHEN** la validación detecta una imagen ausente o una ruta huérfana
- **THEN** el job falla antes de generar un handoff aprobable

### Requirement: Replay contra casos de referencia
Antes de procesar material nuevo, cada perfil de escritura SHALL reproducir casos aprobados y comparar archivos tocados, asociación de imágenes, afirmaciones, estructura y resultado visual contra una referencia versionada.

#### Scenario: Diferencia clínica
- **WHEN** el replay agrega, elimina o altera una afirmación clínica confirmada
- **THEN** el perfil no se habilita para trabajos reales

#### Scenario: Diferencia cosmética permitida
- **WHEN** una diferencia visual se encuentra dentro de una tolerancia previamente documentada y no afecta contenido, accesibilidad o layout
- **THEN** el reviewer puede marcarla como aceptable con evidencia

### Requirement: Revisión independiente y sin escritura
El resultado de un worker SHALL ser inspeccionado por un proceso de QA con permisos de sólo lectura sobre producto antes de presentarse a aprobación humana.

#### Scenario: Reviewer detecta alcance excedido
- **WHEN** el diff incluye un archivo no autorizado
- **THEN** el job queda `needs-review` o `failed` y no se entrega como completo

### Requirement: Gates humanos preservados
La aprobación clínica/visual y la aprobación del responsable del sitio MUST continuar siendo requisitos externos antes de cambiar estados editoriales o iniciar un release.

#### Scenario: Borrador técnicamente válido sin aprobación clínica
- **WHEN** todas las pruebas técnicas pasan pero falta revisión clínica
- **THEN** el contenido permanece no publicado y el handoff muestra el gate pendiente

### Requirement: Evidencia auditable
Cada job SHALL producir un reporte con identidad del perfil, hashes relevantes, archivos modificados, diff resumido, comandos, exit codes, capturas cuando corresponda y decisiones pendientes.

#### Scenario: Auditoría posterior
- **WHEN** una persona revisa un job cerrado
- **THEN** puede reconstruir qué fuentes se usaron, qué ejecutó el runner y por qué terminó en su estado final sin acceder a datos sensibles
