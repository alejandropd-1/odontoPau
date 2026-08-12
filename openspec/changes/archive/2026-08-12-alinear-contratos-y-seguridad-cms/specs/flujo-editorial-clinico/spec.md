## ADDED Requirements

### Requirement: Escritura CMS condicionada por paridad
El flujo editorial MUST mantener bloqueada la escritura de todo modelo clasificado `blocked` o `pending`. Un resultado `safe` de las pruebas locales SHALL ser necesario pero MUST NOT reemplazar la revision clinica, visual, de privacidad ni la prueba real posterior en Netlify Visual Editor.

#### Scenario: Modelo con cobertura incompleta
- **WHEN** la matriz contractual identifica un campo persistido que el CMS no conserva de forma segura
- **THEN** el modelo permanece sin nuevas capacidades de creacion o edicion hasta que su slice funcional resuelva el desfase

#### Scenario: Modelo tecnicamente seguro
- **WHEN** un modelo obtiene estado `safe` en paridad y round-trip
- **THEN** queda habilitado solamente para continuar al siguiente slice y no se considera aprobado ni publicado automaticamente

#### Scenario: Default sin aprobacion
- **WHEN** un futuro documento editorial se inicializa desde una configuracion preparada por el CMS
- **THEN** comienza como `draft` sin fecha de publicacion, revision clinica ni autorizacion de uso inferida

### Requirement: Autoridad humana preservada
La automatizacion contractual MUST NOT modificar estados de publicacion, contenido clinico, imagenes de pacientes, ramas remotas ni produccion. Paula MUST conservar la aprobacion de contenido e imagenes clinicas, y Alejandro MUST conservar la validacion final, el archive y la autorizacion de merge.

#### Scenario: Pruebas exitosas sin aprobacion humana
- **WHEN** todos los controles automaticos finalizan correctamente pero falta una aprobacion aplicable
- **THEN** el cambio permanece en su rama y no se archiva, mezcla ni publica

#### Scenario: Imagen clinica presente en fixture real
- **WHEN** una prueba carga la referencia de una imagen de paciente ya versionada
- **THEN** solo valida estructura y no interpreta el activo como evidencia de consentimiento ni duplica su archivo
