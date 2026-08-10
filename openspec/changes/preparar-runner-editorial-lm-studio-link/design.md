## Context

El circuito editorial actual ya define JSON como contenido madre, estados editoriales, asociación con tratamientos, activos públicos, revisión clínica y gates de publicación. Este cambio no debe redefinir ese método: debe convertirlo en un contrato ejecutable para workers locales después de que la primera versión llegue a producción y quede aceptada.

En `Ale-Book` ya están disponibles LM Studio CLI y Codex CLI. Al momento de proponer el cambio, LM Link figura offline y el servidor de LM Studio detenido. Codex CLI admite ejecución no interactiva con `exec`, proveedor `lmstudio`, modelos OSS, imágenes, directorio de trabajo, sandbox `workspace-write`, salida JSONL, schema de salida y archivo de handoff.

La captura aportada muestra un modelo Gemma con capacidad declarada de hasta 262.144 tokens pero cargado con 8.192, además de integraciones `js-code-sandbox`, `rag-v1`, `mcp/filesystem` y `mcp/playwright`. Esas integraciones prueban capacidades disponibles dentro del chat de LM Studio, pero la investigación MUST verificar cuáles se heredan realmente al consumir el modelo desde Codex CLI o la API: no se asumirá equivalencia entre herramientas configuradas en LM Studio y herramientas configuradas en el agente cliente.

LM Link transporta inferencia entre dispositivos; el proceso que ejecuta herramientas conserva el filesystem y los permisos de la máquina donde corre. La primera topología será Codex CLI y el repositorio en Ale-Book, con inferencia en la PC de escritorio. Un runner residente y activable en la PC de escritorio será una fase posterior, porque requiere una cola y una superficie de seguridad adicionales.

## Goals / Non-Goals

**Goals:**

- Producir un perfil reproducible y medido para cada modelo local candidato.
- Exigir un contexto efectivo mínimo de 32.768 tokens y usar recuperación selectiva en lugar de cargar el repositorio completo.
- Dar al worker instrucciones cerradas, rutas permitidas y estados terminales verificables.
- Separar tareas deterministas de las que requieren razonamiento lingüístico, visual o de código.
- Ejecutar en un worktree aislado sin permisos de publicación.
- Reproducir casos aprobados y comparar el resultado contra una referencia antes de admitir contenido nuevo.
- Conservar evidencia suficiente para que una persona o un agente de mayor capacidad audite cada ejecución.

**Non-Goals:**

- Crear acceso remoto general a la PC de escritorio.
- Autorizar un worker a operar sobre el árbol principal sucio o sobre `main`.
- Compartir consentimientos, historias clínicas, secretos o credenciales con el modelo.
- Hacer que el modelo elija diagnósticos, asociación incierta de imágenes o estados de publicación.
- Garantizar que una ventana mayor siempre mejore la calidad: el benchmark decidirá el perfil aceptable.
- Ejecutar este cambio antes de cerrar y archivar el circuito editorial vigente.

## Decisions

### 1. Ejecución en Ale-Book e inferencia remota como primera etapa

Codex CLI correrá donde existe el checkout y abrirá `localhost:1234`; LM Studio resolverá el modelo en la PC preferida mediante LM Link. Así, los permisos de archivos y comandos quedan bajo el sandbox del runner local y la PC de escritorio sólo aporta cómputo.

Alternativa descartada inicialmente: un daemon de trabajos en la PC de escritorio. Permitiría editar un clon remoto, pero obliga a resolver activación remota, sincronización Git, secretos, locks y recuperación de procesos antes de validar el método básico.

### 2. Contexto efectivo mínimo de 32k, con retrieval

Todo perfil aprobado MUST cargar al menos 32.768 tokens mediante una configuración explícita y registrar el valor efectivo. La capacidad máxima anunciada por el modelo no será evidencia suficiente. Los prompts usarán el brief, los contratos y sólo los archivos recuperados por búsqueda/MCP/RAG; no se volcará el repositorio completo al contexto.

Cada modelo se probará al 50%, 80% y cerca del límite operativo elegido para detectar degradación de tool use, pérdida de reglas y truncamiento. Un modelo con mayor ventana pero peor adherencia no será promovido.

### 3. Herramientas del agente declaradas por perfil

Habrá perfiles separados para:

- `writer`: datos JSON y copia, sin navegador ni shell general.
- `vision-intake`: lectura de imágenes y manifiestos, sin editar contenido clínico.
- `code-worker`: filesystem del worktree, comandos permitidos y salida estructurada.
- `qa-reviewer`: lectura, diff, Playwright y comandos de validación, sin escritura de producto.

`mcp/filesystem` quedará limitado al worktree y al directorio runtime del trabajo. `mcp/playwright` sólo podrá navegar el preview permitido. El sandbox JavaScript no tendrá acceso implícito a filesystem, procesos o red. RAG indexará únicamente documentación aprobada y el paquete del trabajo.

Alternativa descartada: habilitar todas las integraciones a todos los modelos. Reduce configuración, pero hace imposible atribuir fallos y amplía innecesariamente el impacto de prompt injection o tool use incorrecto.

### 4. Contratos versionados y runtime no versionado

La definición reusable vivirá bajo `ops/editorial-runner/`:

```text
ops/editorial-runner/
├── README.md
├── schemas/
├── templates/
├── policies/
├── prompts/
└── benchmarks/
```

Cada ejecución vivirá en una ruta ignorada, por ejemplo `.local/editorial-jobs/<job-id>/`. Allí se almacenarán material recibido, logs, estado y handoff. El repositorio sólo podrá conservar un manifiesto no sensible, decisiones, hashes y el resultado destinado a publicación.

### 5. Máquina de estados cerrada

Un trabajo seguirá `queued → validated → running → complete | needs-review | blocked | failed`. No existirá un estado `published`. Las transiciones requerirán evidencia estructurada; un proceso reiniciado no podrá repetir silenciosamente pasos mutables.

Las condiciones `STOP` incluyen: falta de autorización, imagen ambigua, dato clínico no confirmado, ruta fuera de allowlist, árbol base sucio, schema inválido, fallo de validación, modelo/contexto distinto del perfil o solicitud de release.

### 6. Git worktree como frontera de escritura

Cada job usará una rama `local-worker/<job-id>` y un worktree creado desde un commit base limpio. El runner no trabajará sobre el checkout principal ni recibirá credenciales para push. El resultado será un diff local y un handoff; la integración posterior seguirá a cargo del circuito humano/Codex principal.

### 7. Automatización determinista alrededor del modelo

Scripts convencionales realizarán inventario, checksums, nombres, optimización de imágenes, validación de schemas, búsquedas de frases prohibidas, TypeScript, lint, build y controles de rutas. El modelo sólo intervendrá donde sea útil interpretar o redactar, y no podrá declarar exitoso un comando cuyo exit code haya fallado.

### 8. Benchmark con casos golden

El piloto reejecutará casos ya aprobados —sin publicar nada— y comparará asociación de activos, afirmaciones, estructura JSON, archivos tocados y QA. Se definirá un umbral de aceptación por tarea y modelo; ningún candidato se habilitará sólo por una evaluación subjetiva de su respuesta.

## Risks / Trade-offs

- [Las herramientas visibles en LM Studio no están disponibles vía Codex/API] → Probar cada combinación cliente/modelo/MCP y documentar dónde se ejecuta realmente cada herramienta.
- [32k excede memoria o degrada latencia] → Estimar recursos, medir tokens/segundo y conservar perfiles alternativos; no reducir contexto por debajo del mínimo sin reabrir la decisión.
- [Prompt injection desde archivos o páginas] → Tratar fuentes externas como datos, usar prompts inmutables, allowlists y un reviewer sin escritura.
- [El worker modifica archivos correctos con contenido clínico incorrecto] → Comparación golden, búsqueda de claims y aprobación clínica obligatoria.
- [LM Link queda offline] → Estado `blocked`, diagnóstico explícito y fallback manual; nunca cambiar automáticamente de modelo sin registrarlo.
- [Worktree o job queda abandonado] → Locks con TTL, comando de inspección y limpieza sólo sobre rutas resueltas del job.
- [Demasiados perfiles y scripts aumentan mantenimiento] → Empezar con un único caso golden y el conjunto mínimo de herramientas; ampliar sólo después de evidencia.

## Migration Plan

1. Esperar la publicación y archivo del circuito editorial vigente.
2. Inventariar Ale-Book y PC de escritorio: versiones, dispositivos Link, modelos, VRAM/RAM, contextos y herramientas.
3. Conectar ambos dispositivos y comprobar health de LM Link/API sin dar permisos de escritura.
4. Crear schemas, plantillas, políticas y un job de benchmark de sólo lectura.
5. Evaluar modelos y fijar perfiles reproducibles.
6. Implementar runner en worktree con un caso golden y sin credenciales externas.
7. Agregar QA reviewer, estados terminales y reporte.
8. Ejecutar una prueba supervisada con material no nuevo.
9. Sólo tras aprobación, habilitar la preparación de un borrador real.

Rollback: deshabilitar el perfil/runner, cerrar LM Link, eliminar exclusivamente worktrees y directorios runtime registrados, y conservar contratos/resultados para auditoría. El sitio público y `main` no dependen de esta infraestructura.

## Open Questions

- Qué modelos exactos y cuantizaciones están disponibles en la PC de escritorio y qué rendimiento sostienen con 32k o más.
- Si el modelo de la captura expone visión y tool use de forma estable a través de `/v1/responses` o sólo dentro del chat de LM Studio.
- Qué servidor MCP filesystem se usará y cómo expresará allowlists portables entre las dos PCs.
- Si Playwright se ejecutará desde Codex CLI, desde LM Studio o mediante un reviewer separado.
- Qué caso aprobado será el primer golden y qué diferencias visuales se consideran tolerables.
- Si una segunda etapa necesita realmente un runner residente en la PC de escritorio o si inferencia remota desde Ale-Book cubre el objetivo.
