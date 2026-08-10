## ADDED Requirements

### Requirement: Paquete de trabajo completo y validable
Cada job MUST incluir un identificador, OpenSpec relacionado, tipo de entrega, texto fuente, manifiesto de activos, servicio, autorizaciones no sensibles, rutas permitidas, rutas prohibidas, entregables, checks y condiciones de detención.

#### Scenario: Job válido
- **WHEN** todos los campos requeridos validan contra el schema versionado
- **THEN** el job puede pasar de `queued` a `validated`

#### Scenario: Falta asociación entre texto e imagen
- **WHEN** el manifiesto no identifica de manera inequívoca qué imágenes corresponden al caso
- **THEN** el job queda `blocked` sin pedir al modelo que lo infiera visualmente

### Requirement: Alcance inmutable durante la ejecución
El worker MUST limitarse a los entregables y rutas del job y MUST detenerse si descubre una tarea adicional necesaria fuera de ese alcance.

#### Scenario: Mejora adyacente detectada
- **WHEN** el modelo identifica una refactorización o corrección no solicitada
- **THEN** la registra en el handoff y no la implementa dentro del job actual

### Requirement: Fuentes y afirmaciones trazables
Toda afirmación específica del caso SHALL poder vincularse con una entrada confirmada del manifiesto; el contenido educativo general SHALL permanecer separado de los datos clínicos particulares.

#### Scenario: Afirmación no respaldada
- **WHEN** una frase no puede trazarse al texto confirmado ni a una fuente educativa permitida
- **THEN** se elimina del borrador o el job termina `needs-review`

### Requirement: Material sensible fuera del repositorio
Los activos fuente, consentimientos y datos sensibles MUST almacenarse sólo en el runtime local ignorado; el repositorio MAY conservar hashes, estado de autorización no sensible y rutas lógicas.

#### Scenario: Preparación de handoff
- **WHEN** el job finaliza
- **THEN** el handoff no contiene documentos de consentimiento, datos identificatorios innecesarios ni rutas privadas absolutas

### Requirement: Estados terminales explícitos
Cada ejecución MUST finalizar como `complete`, `needs-review`, `blocked` o `failed`, con causa, pasos realizados, archivos modificados y checks ejecutados.

#### Scenario: Validación técnica falla
- **WHEN** un check obligatorio devuelve un exit code distinto de cero
- **THEN** el worker no declara éxito y registra `failed` o `needs-review` según la política del check
