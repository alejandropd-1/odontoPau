## MODIFIED Requirements

### Requirement: Edicion en CMS existente
El sistema SHALL exponer en Stackbit/Netlify Visual Editor todos los campos y modulos admitidos por el contrato TypeScript y JSON de instrucciones, incluidos pasos, matrices, avisos, texto, recursos individuales, galerias, imagen social y archivos descargables de imagen o video. Guardar desde el CMS MUST conservar campos no modificados y MUST NOT agregar otro CMS ni cambiar la fuente JSON versionada.

#### Scenario: Campo opcional vacio
- **WHEN** el editor no incluye un modulo, recurso o galeria opcional
- **THEN** el sitio no muestra placeholders, acciones, encabezados ni huecos de maquetacion asociados

#### Scenario: Instruccion con video
- **WHEN** un recurso declara una imagen de portada y un `downloadSrc` de video valido
- **THEN** el CMS conserva ambos activos y el preview muestra la indicacion visual y accion accesible previstas

#### Scenario: Guardado de una instruccion completa
- **WHEN** un editor abre y guarda una instruccion que combina matriz, galeria, descargas y avisos
- **THEN** el JSON conserva tipos, orden, activos, dimensiones, etiquetas y textos alternativos

#### Scenario: Contrato CMS incompleto
- **WHEN** el modelo omite un campo soportado por el loader o el renderizador
- **THEN** la prueba de paridad bloquea la habilitacion de escritura para instrucciones

## ADDED Requirements

### Requirement: Creacion modular de instrucciones
El CMS SHALL permitir crear una instruccion con una unica plantilla y agregar solo los modulos requeridos por el material aprobado. Todo documento nuevo MUST comenzar en `draft`, declarar categoria y slug validos y contener al menos un modulo con contenido.

#### Scenario: Instruccion solo con pasos
- **WHEN** Paula entrega un protocolo ordenado sin matriz, galeria ni recurso descargable
- **THEN** el editor crea una instruccion valida que muestra unicamente sus pasos y elementos estructurales obligatorios

#### Scenario: Instruccion ampliada
- **WHEN** luego se incorpora una infografia o video aprobado
- **THEN** el editor agrega el recurso al mismo documento sin cambiar plantilla, slug ni URL

#### Scenario: Instruccion sin contenido
- **WHEN** un editor intenta guardar un documento sin modulos validos
- **THEN** la validacion lo rechaza con un mensaje que identifica el requisito ausente

### Requirement: Controles clinicos y de relaciones
Estado, categoria, tono de avisos y tratamiento vinculado SHALL usar opciones controladas o validacion equivalente. Una instruccion `published` MUST incluir revisor clinico, fecha de publicacion, fecha de actualizacion y recursos existentes.

#### Scenario: Tono invalido
- **WHEN** se intenta persistir un aviso con un tono desconocido
- **THEN** el CMS o el build rechaza el modulo

#### Scenario: Publicacion sin revision
- **WHEN** se intenta publicar una instruccion sin revisor clinico o fecha requerida
- **THEN** el documento permanece no publicable
