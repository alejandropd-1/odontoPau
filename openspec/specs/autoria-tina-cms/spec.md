# autoria-tina-cms Specification

## Purpose
TBD - created by archiving change adoptar-tina-y-completar-cms-articulos-instrucciones. Update Purpose after archive.
## Requirements
### Requirement: TinaCMS como interfaz de autoria Git-backed
El sistema SHALL usar TinaCMS como interfaz de autoría vigente y SHALL conservar los JSON bajo `src/data` y Git como fuente canónica. El sitio público MUST continuar funcionando desde los loaders locales sin depender en runtime de TinaCloud.

#### Scenario: TinaCloud no disponible
- **WHEN** TinaCloud o su API de edición no responde
- **THEN** el sitio desplegado continúa sirviendo el contenido de `main` y solo se interrumpe la capacidad de edición

#### Scenario: Guardado editorial
- **WHEN** un editor autorizado guarda un Artículo o una Instrucción
- **THEN** Tina persiste un cambio revisable en el JSON canónico de la rama configurada

### Requirement: Administracion autenticada y aislada por proyecto
La ruta `/admin` MUST exigir autenticación de Tina y el proyecto OdontoPau MUST mantener usuarios, tokens y contenido aislados de otros sitios. Los secretos MUST permanecer fuera del repositorio y el panel público MUST NOT exponer tokens de build.

#### Scenario: Persona no autenticada
- **WHEN** una persona sin sesión válida visita `/admin`
- **THEN** no puede leer ni modificar formularios editoriales y recibe el flujo de autenticación correspondiente

#### Scenario: Credencial de otro proyecto
- **WHEN** una cuenta no autorizada para el proyecto OdontoPau intenta acceder
- **THEN** Tina rechaza el acceso y no muestra colecciones ni contenido de este sitio

### Requirement: Escritura exclusiva en rama no productiva
Toda escritura remota ordinaria iniciada desde Tina MUST apuntar a `editorial/tina` y MUST permanecer separada de `main`. Un `Save` MUST actualizar solamente el snapshot editorial y su Preview; Tina MUST NOT inferir intención de publicación a partir del guardado. La única promoción permitida SHALL comenzar con una acción explícita `Publicar cambios` y SHALL atravesar la automatización Git protegida.

#### Scenario: Configuracion resuelve main
- **WHEN** un build administrativo con escritura habilitada resuelve `main` como rama de edición
- **THEN** la validación falla y el admin no se declara apto para uso editorial

#### Scenario: Guardado ordinario
- **WHEN** un colaborador autorizado guarda un documento válido
- **THEN** el commit queda en `editorial/tina`, actualiza Preview y no modifica producción

#### Scenario: Publicacion explicita
- **WHEN** un colaborador autorizado activa `Publicar cambios`
- **THEN** Tina registra una solicitud versionada y delega la promoción a los gates Git sin escribir directamente en `main`

### Requirement: Experiencia editorial para personas no tecnicas
El panel SHALL presentar Artículos e Instrucciones con labels y ayudas en español, agrupaciones comprensibles, títulos reconocibles y controles cerrados cuando exista un conjunto válido. Las constantes y rutas derivadas MUST ocultarse o calcularse sin exigir conocimiento de código.

#### Scenario: Edicion de un modulo
- **WHEN** una persona agrega o reordena un módulo admitido
- **THEN** identifica su tipo por un nombre editorial, edita solo sus campos válidos y conserva el orden elegido

#### Scenario: Campo opcional omitido
- **WHEN** una persona no completa un bloque opcional
- **THEN** el JSON no recibe placeholders y el sitio no reserva título, contenedor ni espacio para ese bloque

#### Scenario: Sistema visual coherente
- **WHEN** una persona recorre campos simples, selectores, fechas, imágenes, listas y objetos anidados
- **THEN** reconoce la misma jerarquía de label, ayuda, foco, error y espaciado, mientras cada control conserva la interacción apropiada para su tipo

#### Scenario: Campo de texto
- **WHEN** un campo simple recibe foco o contiene un valor
- **THEN** el label se mantiene visible en posición flotante, el control conserva una altura base de 56 px y el foco se distingue por teclado sin depender solo del color

#### Scenario: Lista breve repetible
- **WHEN** el editor confirma un ítem breve mediante coma o Enter
- **THEN** el valor se representa como chip individual, puede eliminarse sin reescribir los demás y se persiste como elemento separado del array

#### Scenario: Texto largo repetible
- **WHEN** el editor agrega párrafos, pasos o recomendaciones extensas
- **THEN** cada elemento mantiene su propio control y orden, sin serializar la lista como un textarea separado por comas

#### Scenario: Personalización mantenible
- **WHEN** se actualiza TinaCMS
- **THEN** la experiencia editorial depende de componentes registrados por APIs públicas y no de selectores o estilos internos sobrescritos

### Requirement: Visual Editing reactivo y desacoplado de produccion
El admin SHALL mostrar la ruta pública real de Inicio, índice de Tratamientos, cada Tratamiento, cada Artículo y cada Instrucción junto al formulario y SHALL actualizarla en vivo mediante `useTina` y marcas `tinaField`. La página fuera del iframe editorial MUST conservar el JSON local como dato inicial y MUST NOT consultar TinaCloud en runtime.

#### Scenario: Seleccion visual de un campo
- **WHEN** un editor abre cualquier documento del alcance desde Tina y selecciona su título, imagen, objeto anidado o un campo de módulo en la preview
- **THEN** el panel enfoca el campo correspondiente y la vista refleja los cambios sin alterar la plantilla pública

#### Scenario: Visita publica fuera del editor
- **WHEN** una persona visita la misma URL sin estar dentro del iframe de Tina
- **THEN** recibe el contenido generado desde JSON local sin request de contenido a Tina ni exposición de credenciales

#### Scenario: Primer guardado de un borrador
- **WHEN** un editor crea un documento nuevo que todavía no posee una ruta materializada
- **THEN** el formulario explica que la vista visual estará disponible después del primer guardado y la ruta resultante permanece no indexable y fuera de producción

### Requirement: Activos y privacidad controlados
Tina SHALL limitar imágenes, descargas y referencias de video a rutas y formatos admitidos por el contrato. Toda imagen informativa MUST tener alt; ningún flujo MUST almacenar historias clínicas, consentimientos privados, secretos o datos identificatorios innecesarios.

#### Scenario: Imagen sin alt
- **WHEN** un editor intenta guardar una imagen informativa sin texto alternativo
- **THEN** el formulario o la validación contractual bloquea el cambio e identifica el campo

#### Scenario: Video fuera del flujo admitido
- **WHEN** un archivo MP4 no puede cargarse de forma segura mediante el media manager probado
- **THEN** el editor usa el ingreso controlado documentado y solo guarda una referencia pública validada

### Requirement: Configuracion reproducible y auditable
Versiones, schema, lockfile, variables requeridas sin valores y reglas de archivos generados SHALL quedar documentados y reproducibles en local y CI. El build administrativo MUST diferenciar variables públicas de secretos de build.

#### Scenario: Checkout limpio sin secretos
- **WHEN** CI instala dependencias con lockfile congelado
- **THEN** puede validar y construir el schema sin revelar credenciales ni requerir una escritura externa

### Requirement: Solicitud editorial versionada e idempotente
El CMS SHALL exponer un singleton interno no renderizado que represente una solicitud de publicación del snapshot completo de `editorial/tina`. La solicitud MUST incluir un identificador único, fecha, estado y referencia al último identificador procesado, y MUST NOT contener secretos, datos clínicos privados ni credenciales.

#### Scenario: Nueva solicitud
- **WHEN** un colaborador confirma la publicación y no existe otra solicitud activa
- **THEN** se genera un identificador nuevo y el estado pasa a `pending`

#### Scenario: Doble activacion
- **WHEN** la interfaz recibe una segunda activación mientras la solicitud vigente está pendiente o procesándose
- **THEN** no genera una promoción duplicada y muestra el estado de la solicitud existente

#### Scenario: Resultado registrado
- **WHEN** la automatización finaliza o falla
- **THEN** el singleton conserva un resultado mínimo, fecha e identificador procesado sin copiar logs completos

### Requirement: Convergencia posterior de la rama editorial
Después de cada promoción editorial exitosa, `editorial/tina` MUST converger con el commit vigente de `main` y TinaCloud MUST poder indexar ese snapshot antes del siguiente ciclo. La rama editorial MUST permanecer disponible y MUST NOT eliminarse como rama efímera.

#### Scenario: Rama editorial publicable
- **WHEN** `main` es ancestro de `editorial/tina` y la promoción finaliza
- **THEN** el sistema puede integrar el snapshot y adelantar `editorial/tina` por fast-forward hasta el commit publicado

#### Scenario: Rama editorial divergente
- **WHEN** `editorial/tina` y `main` contienen commits exclusivos incompatibles
- **THEN** la promoción se bloquea y presenta la divergencia para revisión sin force-push ni pérdida de contenido

#### Scenario: Schema remoto pendiente
- **WHEN** TinaCloud todavía no indexó el commit convergente
- **THEN** el estado permanece observable como pendiente de índice y no se publica un segundo snapshot ambiguo
