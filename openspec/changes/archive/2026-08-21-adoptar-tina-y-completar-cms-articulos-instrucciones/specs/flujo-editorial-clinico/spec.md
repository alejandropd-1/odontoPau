## MODIFIED Requirements

### Requirement: Escritura CMS condicionada por paridad
El flujo editorial MUST mantener bloqueada la escritura Tina de todo modelo clasificado `blocked` o `pending`. Un resultado `safe` de las pruebas locales SHALL ser necesario pero MUST NOT reemplazar la revisión clínica, visual, de privacidad ni la prueba real posterior en Tina y Deploy Preview.

#### Scenario: Modelo con cobertura incompleta
- **WHEN** la matriz contractual identifica un campo persistido que Tina no conserva de forma segura
- **THEN** el modelo permanece sin capacidades de creación o edición hasta resolver el desfase

#### Scenario: Modelo tecnicamente seguro
- **WHEN** Artículo o Instrucción obtiene estado `safe` en paridad y round-trip Tina
- **THEN** queda habilitado solamente para el piloto en rama y no se considera aprobado ni publicado automáticamente

#### Scenario: Default sin aprobacion
- **WHEN** Tina inicializa un documento editorial
- **THEN** comienza como `draft` sin fecha de publicación, revisión clínica ni autorización de uso inferida

## ADDED Requirements

### Requirement: Circuito Tina a preview con autoridad humana
Toda edición Tina SHALL permanecer en una rama no productiva y SHALL atravesar diff, gates, Draft PR y Deploy Preview. Paula MUST aprobar el contenido o las imágenes clínicas aplicables y Alejandro MUST conservar la validación final, el archive y la autorización de merge.

#### Scenario: Guardado exitoso sin aprobacion
- **WHEN** Tina guarda un documento válido pero faltan aprobaciones humanas
- **THEN** el cambio permanece en su rama y no se mezcla, archiva ni publica

#### Scenario: Seleccion de estado published
- **WHEN** un editor selecciona `published` dentro de la rama de revisión
- **THEN** producción permanece intacta y el cambio solo puede publicarse mediante el merge autorizado a `main`

#### Scenario: Evidencia de consentimiento
- **WHEN** una imagen clínica requiere consentimiento
- **THEN** el flujo registra únicamente la confirmación no sensible y mantiene el documento privado de evidencia fuera de Git y Tina

