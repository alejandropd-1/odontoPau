## ADDED Requirements

### Requirement: Ejecución en worktree aislado
Cada job con permisos de escritura MUST ejecutarse en un worktree dedicado creado desde un commit base limpio y una rama `local-worker/<job-id>`.

#### Scenario: Checkout principal sucio
- **WHEN** el checkout principal contiene cambios no incorporados que el job intentaría usar como base
- **THEN** la preparación se detiene o exige un commit base explícitamente aprobado, sin copiar el árbol sucio al worktree

#### Scenario: Job concurrente
- **WHEN** otro proceso posee el lock activo del mismo job o worktree
- **THEN** la segunda ejecución se detiene sin modificar archivos

### Requirement: Invocación reproducible de Codex y LM Studio
El runner SHALL fijar modelo, proveedor, contexto, perfil, cwd, sandbox, schema de salida y presupuesto; SHALL registrar la invocación sin exponer secretos.

#### Scenario: Perfil distinto del solicitado
- **WHEN** la API resuelve un modelo, dispositivo o contexto diferente del manifiesto
- **THEN** el runner termina `blocked` antes de habilitar herramientas de escritura

### Requirement: Filesystem con allowlist
Todo acceso de escritura MUST quedar restringido al worktree y al runtime del job; el MCP filesystem MUST NOT exponer otras carpetas del usuario o unidades completas.

#### Scenario: Ruta fuera del worktree
- **WHEN** una herramienta solicita escribir fuera de las raíces permitidas
- **THEN** la operación se rechaza y queda registrada como violación de política

### Requirement: Herramientas por mínimo privilegio
Cada perfil SHALL habilitar únicamente las herramientas necesarias y SHALL separar la navegación, la edición y la revisión cuando sus permisos difieran.

#### Scenario: Writer solicita Playwright
- **WHEN** el perfil de redacción intenta abrir el navegador sin que el job lo requiera
- **THEN** la herramienta no está disponible y el job continúa o se bloquea según la necesidad declarada

### Requirement: Release fuera del runner
El runner MUST NOT recibir credenciales ni comandos para push, merge, deploy, modificación de `main` o publicación en redes/CMS.

#### Scenario: Job solicita publicar
- **WHEN** el paquete o una instrucción derivada pide ejecutar una acción de release
- **THEN** el worker se detiene y deriva la solicitud al gate humano

### Requirement: Reanudación controlada
Un job interrumpido SHALL poder inspeccionarse y reanudarse desde el último checkpoint seguro sin repetir pasos mutables ya confirmados.

#### Scenario: Caída de LM Link durante generación
- **WHEN** se pierde el dispositivo remoto
- **THEN** el estado conserva los artefactos parciales, registra el punto de interrupción y no cambia automáticamente a otro modelo
