## ADDED Requirements

### Requirement: Inventario reproducible de dispositivos y modelos
El sistema de preparación SHALL registrar versiones de LM Studio, LM Studio CLI, Codex CLI, dispositivo local, dispositivo remoto preferido, modelo, cuantización, memoria disponible y capacidades declaradas antes de ejecutar un benchmark.

#### Scenario: Perfil completo
- **WHEN** se prepara un modelo candidato
- **THEN** el inventario identifica de forma inequívoca el dispositivo de inferencia, el artefacto del modelo y las versiones de las herramientas utilizadas

#### Scenario: Dispositivo remoto no disponible
- **WHEN** LM Link no puede resolver el dispositivo preferido
- **THEN** el diagnóstico termina en estado `blocked` y no sustituye silenciosamente el modelo o dispositivo

### Requirement: Contexto efectivo mínimo
Todo perfil candidato MUST cargar y verificar un contexto efectivo de al menos 32.768 tokens; la ventana máxima declarada por el modelo MUST NOT considerarse evidencia del contexto realmente configurado.

#### Scenario: Modelo soporta más pero está cargado con menos
- **WHEN** un modelo declara una ventana superior a 32.768 pero la sesión está configurada con 8.192 tokens
- **THEN** el perfil se rechaza hasta recargar y comprobar un contexto efectivo de al menos 32.768

#### Scenario: Presión de memoria
- **WHEN** el contexto mínimo no entra dentro de los límites de memoria definidos
- **THEN** el benchmark registra el bloqueo y no reduce el contexto por debajo del mínimo de manera automática

### Requirement: Benchmark de capacidades relevantes
Cada modelo SHALL evaluarse con tareas versionadas de seguimiento de instrucciones, salida estructurada, tool use, código, visión cuando corresponda, recuperación de archivos y adherencia bajo presión de contexto.

#### Scenario: Modelo apto para un rol
- **WHEN** el candidato supera el umbral documentado de un perfil
- **THEN** se registra como habilitado únicamente para ese rol, contexto y conjunto de herramientas

#### Scenario: Respuesta convincente pero schema inválido
- **WHEN** el texto parece correcto pero no valida contra el schema requerido
- **THEN** el benchmark falla la prueba de salida estructurada

### Requirement: Capacidades MCP verificadas por cliente
La investigación MUST comprobar por separado las herramientas disponibles en LM Studio Chat, Codex CLI y la API; MUST NOT asumir que `mcp/filesystem`, `mcp/playwright`, sandbox JavaScript o RAG configurados en una interfaz se heredan por otra.

#### Scenario: MCP visible sólo en LM Studio
- **WHEN** una integración aparece activa en LM Studio pero Codex CLI no puede invocarla
- **THEN** el perfil documenta la diferencia y configura una integración explícita del lado del agente o elimina esa capacidad

### Requirement: Privacidad del benchmark
Los casos de benchmark SHALL usar material aprobado o sintético y MUST excluir datos sensibles, consentimientos completos, historias clínicas y credenciales.

#### Scenario: Fuente sensible detectada
- **WHEN** el manifiesto incluye una ruta marcada como sensible o fuera del conjunto permitido
- **THEN** el benchmark se detiene antes de enviar contenido al modelo
