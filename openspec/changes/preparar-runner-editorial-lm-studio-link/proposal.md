## Why

Después de estabilizar y publicar el circuito editorial del sitio, se necesita una forma repetible de delegar trabajo mecánico a modelos locales sin que interpreten libremente el alcance, inventen datos clínicos o obtengan permisos de publicación. LM Studio Link permite usar desde la notebook modelos ejecutados en la PC de escritorio, pero hace falta investigar su comportamiento real con Codex CLI, MCP y contextos extensos antes de convertirlo en una rutina operativa.

## What Changes

- Investigar y documentar la topología Ale-Book → API local de LM Studio → LM Link → PC de escritorio, diferenciando inferencia remota de ejecución de herramientas y acceso a archivos.
- Evaluar modelos locales para código, visión, uso de herramientas, salida estructurada, fidelidad a instrucciones y rendimiento con un contexto configurado no menor a 32.768 tokens.
- Definir qué capacidades MCP se habilitan por perfil: filesystem restringido al repositorio o worktree, Playwright, sandbox de JavaScript y RAG/archivos, sin exponer carpetas generales del equipo.
- Crear un contrato versionado de trabajo editorial con brief, manifiesto de fuentes, rutas permitidas, evidencia de autorización no sensible, entregables, validaciones y condiciones obligatorias de detención.
- Preparar un runner no interactivo basado en Codex CLI y LM Studio que trabaje en una rama/worktree aislado, produzca una salida validada por schema y finalice con un handoff auditable.
- Separar tareas deterministas —inventario, nombres, validación JSON, optimización de activos y checks— de tareas lingüísticas o visuales delegables al modelo.
- Diseñar un banco de casos aprobados para comparar los resultados locales contra salidas de referencia antes de habilitar material nuevo.
- Mantener revisión humana y ejecución de release como puertas externas al runner.

### Fuera de alcance

- Activar el runner antes de que los OpenSpecs editoriales actuales lleguen a producción y se archive su método definitivo.
- Dar a los modelos locales acceso irrestricto a la PC, credenciales, consentimientos clínicos, `main`, GitHub, Netlify o cuentas sociales.
- Publicar, hacer merge o desplegar automáticamente contenido generado por un modelo local.
- Usar LM Link como sustituto de acceso remoto al escritorio o como cola de trabajos por sí solo.
- Reemplazar las aprobaciones clínica, visual, editorial y del responsable del sitio.

### Riesgos clínicos y operativos

- Un modelo puede convertir una inferencia visual en un dato clínico, asociar una imagen incorrecta o reescribir una indicación aprobada.
- Un MCP de filesystem demasiado amplio puede exponer archivos ajenos al trabajo; Playwright o un sandbox sin límites pueden ampliar el alcance accidentalmente.
- Un modelo que soporte una ventana extensa puede estar cargado con un contexto menor, truncar instrucciones o degradar su adherencia cerca del límite.
- LM Link continúa siendo una dependencia externa en Preview y puede estar offline o cambiar su comportamiento.
- Un runner no interactivo puede quedar bloqueado, repetir acciones o producir cambios parciales si no existen presupuestos y estados terminales.

### Criterio de éxito

- Un caso editorial previamente aprobado puede reproducirse en un worktree limpio sin tocar archivos prohibidos ni inventar afirmaciones.
- El perfil elegido usa al menos 32.768 tokens de contexto efectivo y supera pruebas de herramientas, visión, salida estructurada y seguimiento de instrucciones.
- Cada trabajo termina en `complete`, `needs-review` o `blocked`, con diff, comandos ejecutados, resultados de validación y dudas explícitas.
- TypeScript, lint, build, validaciones editoriales y checks específicos del trabajo se ejecutan mediante comandos deterministas.
- Ningún modelo local puede cambiar estados de publicación, hacer push, merge, deploy o publicar en redes.

## Capabilities

### New Capabilities

- `perfil-modelos-lm-studio`: inventario, benchmark y configuración reproducible de modelos, contexto, LM Link y capacidades MCP.
- `contrato-trabajo-editorial-local`: formato versionado del paquete que un worker local debe leer y ejecutar sin ampliar su alcance.
- `runner-editorial-aislado`: ejecución no interactiva mediante Codex CLI/LM Studio dentro de un worktree y sandbox controlados.
- `qa-y-gates-locales`: validación determinista, replay contra casos de referencia, estados terminales y puertas humanas previas a cualquier release.

### Modified Capabilities

Ninguna. Este cambio prepara infraestructura operativa nueva y no modifica todavía las capacidades públicas del sitio.

## Impact

- Documentación y contratos nuevos bajo una ruta operativa versionada del repositorio.
- Posibles scripts PowerShell/Node, schemas JSON, perfiles de Codex CLI y configuración local no sensible para LM Studio.
- Integración de desarrollo con LM Studio, LM Link, Codex CLI, MCP filesystem, MCP Playwright, sandbox JavaScript, RAG y Git worktrees.
- No se modifica el build público, el CMS ni Netlify durante la fase de investigación; cualquier dependencia o permiso adicional deberá justificarse en la implementación.
