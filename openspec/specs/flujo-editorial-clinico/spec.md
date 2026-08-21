# flujo-editorial-clinico Specification

## Purpose
TBD - created by archiving change crear-circuito-editorial-articulos-redes. Update Purpose after archive.
## Requirements
### Requirement: Paquete de ingreso minimo
El flujo SHALL requerir para cada pieza un tema o caso, tratamiento relacionado, contexto clinico provisto por Paula, inventario de imagenes, autorizacion de uso confirmada y objetivo editorial.

#### Scenario: Informacion incompleta
- **WHEN** faltan datos clinicos, asociacion de imagenes o confirmacion de uso
- **THEN** Codex mantiene la pieza como pendiente y enumera lo necesario sin inventar contenido

### Requirement: Borrador seguro por defecto
Todo articulo nuevo MUST crearse con estado `draft` y sin exposicion publica.

#### Scenario: Creacion inicial
- **WHEN** Codex transforma el paquete de ingreso en un documento del sitio
- **THEN** el documento queda como borrador aunque el texto parezca completo

### Requirement: Aprobacion clinica obligatoria
El flujo MUST exigir confirmacion de Paula sobre diagnostico, tecnica, tiempos, resultados, cifras, testimonios y recomendaciones antes de aprobar contenido clinico.

#### Scenario: Afirmacion no confirmada
- **WHEN** el borrador contiene una afirmacion clinica que Paula no confirmo
- **THEN** la pieza no puede avanzar a `approved` ni `published`

### Requirement: Privacidad y consentimiento
El flujo MUST verificar autorizacion de uso y minimizar identificadores antes de incorporar imagenes o relatos; MUST mantener historias clinicas y evidencia privada fuera del repositorio.

#### Scenario: Imagen sin autorizacion confirmada
- **WHEN** una imagen puede pertenecer a un paciente y no existe confirmacion de uso
- **THEN** no se copia a `public` ni se utiliza en el sitio

#### Scenario: Metadatos sensibles
- **WHEN** una imagen aprobada contiene metadatos innecesarios o un nombre de archivo identificatorio
- **THEN** se limpia y renombra antes de versionarla

### Requirement: Revision tecnica y visual
Antes de publicar, el cambio SHALL superar validacion de datos, TypeScript, lint, build, enlaces, metadata y revision visual desktop/mobile en preview.

#### Scenario: Falla de validacion
- **WHEN** cualquiera de los controles tecnicos o visuales detecta un defecto relevante
- **THEN** el articulo permanece no publicado hasta corregirlo

### Requirement: Produccion protegida por la rama principal
El flujo MUST tratar `main` como rama de produccion de Netlify y MUST mantener cada cambio OpenSpec en su propia rama hasta completar el preview y recibir aprobacion explicita de merge.

#### Scenario: Rama OpenSpec en revision
- **WHEN** una rama de contenido o infraestructura se envia a GitHub
- **THEN** se revisa mediante el preview disponible y no modifica el sitio de produccion

#### Scenario: Publicacion aprobada
- **WHEN** el cambio supera las aprobaciones y se autoriza su merge a `main`
- **THEN** Netlify genera el deploy de produccion y el responsable verifica el resultado

### Requirement: Trazabilidad editorial
El repositorio SHALL conservar de forma no sensible el estado, fechas editoriales, responsable clinico y cambios relevantes de cada articulo mediante JSON, OpenSpec y Git.

#### Scenario: Correccion posterior
- **WHEN** Paula actualiza una afirmacion de un articulo existente
- **THEN** se registra la correccion y se vuelve a validar el articulo antes de publicar

### Requirement: Testimonios temporalmente ocultos
El sitio SHALL mantener inactiva la seccion publica de testimonios y su enlace de navegacion hasta contar con material aprobado, sin eliminar el componente, sus estilos, datos ni integracion con el editor visual.

#### Scenario: Sitio sin testimonios publicados
- **WHEN** la funcionalidad de testimonios esta desactivada
- **THEN** la portada y la navegacion no muestran la seccion ni un enlace hacia ella

#### Scenario: Reactivacion futura
- **WHEN** se autoriza volver a publicar testimonios
- **THEN** la seccion y su enlace pueden reactivarse mediante una unica opcion de configuracion

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

### Requirement: Autoridad humana preservada
La automatizacion contractual MUST NOT modificar estados de publicacion, contenido clinico, imagenes de pacientes, ramas remotas ni produccion. Paula MUST conservar la aprobacion de contenido e imagenes clinicas, y Alejandro MUST conservar la validacion final, el archive y la autorizacion de merge.

#### Scenario: Pruebas exitosas sin aprobacion humana
- **WHEN** todos los controles automaticos finalizan correctamente pero falta una aprobacion aplicable
- **THEN** el cambio permanece en su rama y no se archiva, mezcla ni publica

#### Scenario: Imagen clinica presente en fixture real
- **WHEN** una prueba carga la referencia de una imagen de paciente ya versionada
- **THEN** solo valida estructura y no interpreta el activo como evidencia de consentimiento ni duplica su archivo

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

