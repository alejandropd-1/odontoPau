## ADDED Requirements

### Requirement: Entidad unica para servicios, tratamientos y especialidades
El sistema SHALL representar cada servicio, tratamiento o especialidad publica mediante el modelo tecnico unico `Tratamiento`, una identidad estable y una unica ruta canonica bajo `/tratamientos/[id]`. El CMS MUST NOT crear una coleccion paralela `Especializacion` para los mismos contenidos.

#### Scenario: Especialidad existente
- **WHEN** un editor abre Ortodoncia, Ortopedia, Endodoncia u otra especialidad en el CMS
- **THEN** edita el documento `Tratamiento` que alimenta su tarjeta, detalle y relaciones

#### Scenario: Etiqueta publica acordada
- **WHEN** el equipo define si la interfaz usara Servicios, Especialidades o Tratamientos
- **THEN** el texto visible cambia sin duplicar entidades, IDs ni URLs

### Requirement: Contrato completo de tratamiento
Cada tratamiento SHALL poder declarar identidad, orden, categoria, nombre visible, descripcion, icono, imagen hero, profesionales, caracteristicas y casos clinicos. El modelo CMS MUST exponer todos esos campos con controles compatibles con el contrato TypeScript.

#### Scenario: Edicion del hero
- **WHEN** un editor cambia nombre, descripcion, icono o imagen principal
- **THEN** el preview actualiza el detalle y las superficies derivadas sin editar codigo

#### Scenario: Cambio de orden
- **WHEN** un editor modifica el orden de un tratamiento con un valor valido
- **THEN** los listados que usan ese orden se actualizan de forma determinista

### Requirement: Secciones opcionales sin huecos
Profesionales, casos clinicos, articulos relacionados, instrucciones relacionadas y caracteristicas SHALL renderizarse solo cuando poseen elementos elegibles. La ausencia de una lista MUST ocultar su encabezado, contenedor y espacio asociado.

#### Scenario: Tratamiento sin profesionales
- **WHEN** un tratamiento no declara profesionales
- **THEN** el hero omite por completo el badge profesional

#### Scenario: Tratamiento sin casos clinicos
- **WHEN** un tratamiento no posee casos clinicos publicables
- **THEN** la pagina no muestra el encabezado ni la superficie de casos clinicos

#### Scenario: Tratamiento sin caracteristicas
- **WHEN** la lista de caracteristicas esta ausente o vacia
- **THEN** el recuadro `Aspectos de...` no se renderiza ni deja espacio vertical

### Requirement: Casos clinicos editables sin perdida
El modelo de caso clinico SHALL admitir todos los campos vigentes usados por el sitio, incluidos identidad, articulo relacionado, titulo, descripcion, paciente anonimizado cuando corresponda, imagenes, etiquetas de imagen, estado, desafio, diagnostico, duracion, solucion, caracteristicas de solucion, estadisticas y testimonio. Guardar desde el CMS MUST preservar los campos no modificados.

#### Scenario: Caso con galeria moderna
- **WHEN** un caso utiliza `imagenes` y `etiquetasImagenes` en lugar del par legado antes/despues
- **THEN** el CMS permite editarlas y guardarlas sin convertirlas ni eliminarlas

#### Scenario: Caso parcial aprobado
- **WHEN** Paula solo confirma descripcion e imagenes pero no diagnostico, duracion o testimonio
- **THEN** el caso se presenta con los campos confirmados y omite los submodulos ausentes

#### Scenario: Dato clinico incompleto
- **WHEN** un editor inicia una estadistica o solucion estructurada pero omite un campo interno obligatorio
- **THEN** la validacion bloquea el documento en lugar de publicar una tarjeta incompleta

### Requirement: Relaciones editoriales derivadas y validas
Articulos e instrucciones SHALL relacionarse con tratamientos mediante IDs existentes. El CMS SHALL permitir seleccionar esas relaciones sin reescribir manualmente enlaces publicos, y los listados derivados MUST respetar estado editorial y elegibilidad.

#### Scenario: Articulo relacionado publicado
- **WHEN** un articulo `published` referencia el ID del tratamiento
- **THEN** aparece en la superficie relacionada prevista y enlaza a su URL canonica

#### Scenario: Instruccion no publicada
- **WHEN** una instruccion vinculada permanece en revision
- **THEN** no aparece en la pagina publica de produccion aunque sea visible en el preview autorizado

#### Scenario: ID invalido
- **WHEN** un editor intenta vincular un ID inexistente
- **THEN** el sistema rechaza la relacion antes del despliegue

### Requirement: Creacion de tratamientos protegida
El CMS SHALL permitir preparar un nuevo tratamiento en una rama de trabajo con identidad y ruta validables, pero MUST mantenerlo fuera de navegacion, sitemap y produccion hasta completar contenido, SEO, revision visual y aprobacion explicita.

#### Scenario: Nuevo tratamiento en preparacion
- **WHEN** un editor crea un tratamiento que aun no fue aprobado
- **THEN** puede revisarlo en preview sin incorporarlo a las superficies publicas de produccion

#### Scenario: Identidad duplicada
- **WHEN** el nuevo tratamiento usa un ID o ruta ya existente
- **THEN** la validacion falla antes de generar o desplegar la pagina

### Requirement: Metadata y accesibilidad de tratamiento
Cada tratamiento publicable SHALL generar titulo, descripcion, canonical, imagen social o hero apta, sitemap y textos alternativos apropiados. Su plantilla MUST mantener uso por teclado, jerarquia de encabezados y composicion responsive con cualquier combinacion valida de secciones.

#### Scenario: Tratamiento con contenido minimo
- **WHEN** el tratamiento solo contiene sus campos obligatorios
- **THEN** genera metadata valida y una pagina completa sin referencias a secciones ausentes

#### Scenario: Tratamiento con contenido extenso
- **WHEN** posee multiples profesionales, casos, relaciones y caracteristicas
- **THEN** los bloques se adaptan sin desborde horizontal ni perdida de orden semantico
