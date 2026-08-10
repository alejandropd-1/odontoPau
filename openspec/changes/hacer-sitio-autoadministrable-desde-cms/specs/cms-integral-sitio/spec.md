## ADDED Requirements

### Requirement: CMS Git como fuente de autoria publica
El sistema SHALL usar Netlify Visual Editor sobre la fuente Git existente para crear y editar contenido publico, y MUST conservar los JSON versionados bajo `src/data` como fuente canonica del build.

#### Scenario: Edicion de un documento existente
- **WHEN** una persona autorizada guarda un cambio desde el CMS
- **THEN** el cambio queda representado en el JSON fuente correcto y puede revisarse como diff Git antes de publicarse

#### Scenario: Supabase no disponible
- **WHEN** el plano operativo de Supabase esta ausente o fuera de servicio
- **THEN** el CMS y el sitio publico continúan leyendo y versionando contenido desde Git sin sustituirlo por una segunda fuente clinica

### Requirement: Paridad verificable de contratos
Cada modelo de pagina u objeto editable MUST representar sin perdida todos los campos soportados por su contrato TypeScript, su validador, sus JSON vigentes y su renderizador. El sistema MUST bloquear la habilitacion de escritura de un modelo que no supere una prueba de lectura, guardado y relectura sin perdida semantica.

#### Scenario: Documento con campos existentes
- **WHEN** el CMS abre y guarda sin cambios un documento que usa todos los campos admitidos
- **THEN** el JSON resultante conserva los mismos valores, relaciones, listas y objetos

#### Scenario: Desfase de esquema
- **WHEN** un campo usado por un JSON o renderizador no existe en el modelo CMS
- **THEN** la validacion de paridad falla e identifica el modelo y el campo antes de habilitar su edicion

### Requirement: Omision de contenido opcional
Todo componente editorial SHALL renderizar un bloque opcional unicamente cuando contiene informacion valida y visible. Un bloque ausente o vacio MUST NOT generar titulo, contenedor, placeholder, separador, espacio reservado ni referencia accesible.

#### Scenario: Modulo ausente
- **WHEN** un documento valido no incluye un modulo opcional
- **THEN** la pagina reacomoda los bloques restantes sin dejar un hueco en desktop ni mobile

#### Scenario: Objeto parcialmente completado
- **WHEN** un objeto opcional contiene solo parte de sus campos obligatorios internos
- **THEN** la validacion impide guardarlo o publicarlo en lugar de renderizar una superficie incompleta

### Requirement: Controles editoriales seguros
El CMS MUST ofrecer valores controlados para estados, categorias, tonos y conjuntos cerrados, y SHALL usar referencias a documentos existentes para relaciones cuando la fuente Git lo permita. Los documentos nuevos MUST comenzar en `draft` y MUST NOT asignar automaticamente fecha de publicacion ni aprobacion clinica.

#### Scenario: Creacion de contenido
- **WHEN** una persona autorizada crea un documento nuevo
- **THEN** el CMS propone un identificador y slug validables, establece `draft` y deja vacios los datos de publicacion

#### Scenario: Relacion inexistente
- **WHEN** un documento referencia un tratamiento, categoria o recurso que no existe
- **THEN** el formulario o la validacion de build bloquea el cambio con un error identificable

#### Scenario: Estado desconocido
- **WHEN** se intenta persistir un estado fuera del conjunto editorial permitido
- **THEN** el sistema rechaza el documento antes del preview o despliegue

### Requirement: Contenido institucional administrable
Los textos institucionales visibles y repetibles SHALL provenir de documentos tipados editables desde el CMS, incluidos encabezados e introducciones de portada, equipo, testimonios habilitables, contacto y ubicacion cuando correspondan. La estructura, el orden de componentes y el design system MUST permanecer bajo control del codigo.

#### Scenario: Cambio de encabezado institucional
- **WHEN** una persona autorizada modifica el titulo o introduccion de una seccion modelada
- **THEN** el preview refleja el nuevo contenido dentro del componente aprobado sin alterar su estructura

#### Scenario: Lista institucional vacia
- **WHEN** una lista opcional como testimonios esta deshabilitada o no posee elementos publicables
- **THEN** la seccion completa permanece oculta y no aparece un enlace de navegacion huerfano

#### Scenario: Intento de cambiar diseño
- **WHEN** una persona necesita modificar columnas, colores, tipografia, orden estructural o responsive
- **THEN** el CMS no ofrece ese control y el cambio requiere codigo y su correspondiente proceso OpenSpec

### Requirement: Activos accesibles y validados
Toda imagen informativa administrada desde el CMS MUST incluir texto alternativo, usar una ruta publica permitida y existir antes del build. Videos y descargas MUST usar tipos y rutas admitidos, y ningun activo de paciente SHALL incorporarse sin autorizacion verificada fuera del repositorio.

#### Scenario: Imagen sin texto alternativo
- **WHEN** una persona intenta completar un documento con una imagen informativa sin `alt`
- **THEN** el CMS o la validacion impide que el documento avance a publicacion

#### Scenario: Video descargable valido
- **WHEN** una instruccion referencia un video existente bajo la ruta publica permitida
- **THEN** el CMS conserva la referencia y el preview ofrece la accion accesible prevista

#### Scenario: Imagen clinica sin autorizacion
- **WHEN** no existe confirmacion verificable de uso de una imagen de paciente
- **THEN** el activo no se carga al repositorio publico aunque el formulario permita seleccionar archivos

### Requirement: Edicion visual trazable
Las paginas editables SHALL conservar anotaciones `data-sb-object-id` y `data-sb-field-path` correctas para campos aptos para edicion inline. Los metadatos, relaciones y objetos complejos SHALL permanecer disponibles en Content Editor sin asociarse al documento equivocado.

#### Scenario: Seleccion de un campo visible
- **WHEN** una persona selecciona un titulo anotado en Visual Editor
- **THEN** el CMS abre el campo del documento fuente que renderiza ese titulo

#### Scenario: Edicion de una relacion compleja
- **WHEN** una persona necesita cambiar tratamientos vinculados o metadata
- **THEN** puede hacerlo desde Content Editor y el cambio se persiste en el mismo documento versionado

### Requirement: Calidad responsive de combinaciones validas
Cada tipo de contenido MUST mantener jerarquia semantica, foco visible, contraste, zoom utilizable y ausencia de desborde horizontal entre 320 px y desktop para combinaciones minimas, parciales y completas de sus modulos.

#### Scenario: Contenido minimo en mobile
- **WHEN** una pagina contiene solo sus campos minimos y se abre a 320 px
- **THEN** no presenta superficies vacias, recortes de texto, controles fuera de pantalla ni scroll horizontal del documento

#### Scenario: Contenido completo en desktop y mobile
- **WHEN** una pagina contiene todas sus secciones admitidas
- **THEN** conserva orden de lectura, encabezados, espaciado y controles operables en ambos rangos
