## MODIFIED Requirements

### Requirement: Edicion mediante Netlify Visual Editor
Los modelos de Stackbit MUST reflejar exactamente el contrato TypeScript y JSON completo de articulos, incluidas fechas, descargas, imagenes, fuentes, relaciones y todos los tipos de seccion. Las paginas SHALL conservar las anotaciones necesarias para editar desde Netlify Visual Editor mediante la fuente Git existente, y guardar un documento MUST preservar todo campo no modificado.

#### Scenario: Edicion de una seccion
- **WHEN** un editor cambia una seccion desde Netlify Visual Editor
- **THEN** el cambio se guarda en el JSON correcto y se representa sin conversion manual

#### Scenario: Guardado sin cambios
- **WHEN** un editor abre y vuelve a guardar un articulo que usa todos los campos soportados
- **THEN** fechas, descargas, fuentes, imagenes, relaciones y secciones conservan sus valores y orden

#### Scenario: Campo no modelado
- **WHEN** un campo admitido por TypeScript no se encuentra en el modelo CMS
- **THEN** la verificacion de paridad falla antes de habilitar escritura para articulos

### Requirement: Plantilla clinica modular unica
El sistema SHALL usar una unica plantilla de articulo con un resumen de caso compuesto por contexto, datos confirmados y abordaje opcional, mas los modulos editoriales admitidos. Cada modulo y submodulo MUST renderizarse unicamente cuando contiene informacion valida y MUST mantener una jerarquia semantica y visual consistente. La densidad minima, intermedia o completa MUST surgir de los campos presentes y MUST NOT almacenarse como variante de plantilla.

#### Scenario: Caso minimo con una imagen
- **WHEN** el articulo solo dispone de contexto confirmado, una imagen y CTA
- **THEN** el resumen ocupa el ancho util, no muestra tarjetas ni panel de abordaje vacios y la pagina conserva una composicion completa

#### Scenario: Caso intermedio con datos parciales
- **WHEN** el articulo dispone de contexto, uno o mas datos confirmados y una o dos imagenes pero no tiene un abordaje detallado
- **THEN** las tarjetas presentes se adaptan al ancho disponible y no se reserva espacio para el panel naranja ausente

#### Scenario: Caso completo
- **WHEN** el articulo dispone de contexto, datos confirmados, abordaje, contenido educativo y fuentes o preguntas frecuentes
- **THEN** el resumen se presenta en dos columnas en escritorio, el abordaje usa el panel de acento y todos los modulos se apilan en orden logico en mobile

#### Scenario: Informacion agregada despues de la revision
- **WHEN** un editor completa un submodulo anteriormente ausente
- **THEN** el articulo incorpora ese contenido dentro de la misma plantilla y contrato de datos sin migracion ni seleccion manual de maqueta

#### Scenario: Campo opcional sin contenido
- **WHEN** un articulo no incluye FAQ, estadisticas, comparacion, galeria, cita, fuentes o descargas
- **THEN** cada modulo ausente omite tambien su encabezado, contenedor, separador y espacio

## ADDED Requirements

### Requirement: Creacion segura de articulos desde el CMS
El CMS SHALL permitir crear un articulo nuevo con slug unico, metadatos minimos, uno o mas tratamientos validos, imagen principal accesible y al menos una seccion. Todo articulo nuevo MUST comenzar en `draft` y MUST poder ampliarse posteriormente sin cambiar de modelo ni URL.

#### Scenario: Articulo con informacion minima
- **WHEN** un editor solo dispone de titulo, resumen, imagen, contexto confirmado y tratamiento relacionado
- **THEN** puede crear un borrador valido con la plantilla unica sin completar modulos clinicos inexistentes

#### Scenario: Ampliacion posterior
- **WHEN** Paula aporta nuevos datos, imagenes o fuentes para un articulo existente
- **THEN** el editor agrega los modulos correspondientes conservando ID, slug, URL y plantilla

#### Scenario: Requisito minimo ausente
- **WHEN** faltan imagen principal, texto alternativo, tratamiento valido o toda seccion de contenido
- **THEN** el CMS o la validacion impide avanzar el documento a publicacion

### Requirement: Campos editoriales controlados
Estado, categoria, tratamientos relacionados y tipos de seccion SHALL ofrecer opciones controladas o referencias validables. El sistema MUST exigir revisor clinico y fecha de publicacion antes de aceptar `published`.

#### Scenario: Seleccion de tratamiento
- **WHEN** un editor vincula un articulo desde el CMS
- **THEN** selecciona un tratamiento existente o recibe un error antes del build

#### Scenario: Publicacion incompleta
- **WHEN** se intenta marcar `published` sin revisor clinico o fecha de publicacion
- **THEN** la validacion rechaza el documento
