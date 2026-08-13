## ADDED Requirements

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
Toda escritura remota iniciada desde Tina MUST apuntar a una rama explícita distinta de `main`. GitCron o GitHub SHALL gestionar el Draft PR, CI, preview y merge; Tina MUST NOT considerarse autoridad de publicación.

#### Scenario: Configuracion resuelve main
- **WHEN** un build administrativo con escritura habilitada resuelve `main` como rama destino
- **THEN** la validación falla y el admin no se declara apto para uso editorial

#### Scenario: Edicion en rama autorizada
- **WHEN** un editor guarda en la rama de revisión configurada
- **THEN** `main` y producción permanecen sin cambios hasta el merge explícitamente autorizado

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

