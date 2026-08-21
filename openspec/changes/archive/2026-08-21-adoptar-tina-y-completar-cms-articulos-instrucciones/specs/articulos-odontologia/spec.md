## ADDED Requirements

### Requirement: Creacion segura de articulos desde TinaCMS
Tina SHALL permitir crear y ampliar Artículos con slug único, estado inicial `draft`, relaciones válidas, metadata, imagen con alt y cualquiera de los módulos admitidos por la plantilla única. Los campos opcionales MUST poder permanecer ausentes.

#### Scenario: Articulo minimo
- **WHEN** un editor crea un Artículo con los campos mínimos y omite módulos opcionales
- **THEN** el JSON valida, la preview conserva una composición completa y no aparecen objetos, títulos ni huecos vacíos

#### Scenario: Ampliacion posterior
- **WHEN** un editor agrega contenido a un Artículo existente
- **THEN** conserva ID, slug, URL y plantilla mientras incorpora únicamente los módulos completados

## REMOVED Requirements

### Requirement: Edicion mediante Netlify Visual Editor
**Reason**: TinaCMS fue elegido como interfaz de autoría y el adaptador Stackbit deja de ser la herramienta vigente.

**Migration**: El JSON versionado y la plantilla pública se conservan; la edición pasa a la colección Tina de Artículos después de superar paridad y round-trip.

## ADDED Requirements

### Requirement: Edicion de articulos mediante TinaCMS
Los modelos Tina MUST reflejar el contrato runtime de Artículos, incluidos imágenes, fuentes, descargas, relaciones y todas las variantes de sección. La edición SHALL persistir directamente en el JSON correcto de una rama no productiva y MUST conservar ausencia, valores y orden sin conversión manual.

#### Scenario: Edicion de una seccion
- **WHEN** un editor cambia, agrega o reordena una sección desde Tina
- **THEN** el cambio se guarda en el documento correcto y el round-trip conserva el resto del Artículo

#### Scenario: Descarga opcional
- **WHEN** un Artículo no define descargas o fuentes
- **THEN** Tina no genera listas vacías y la página no renderiza sus encabezados ni superficies

#### Scenario: Edicion visual de un modulo
- **WHEN** un editor modifica un campo raíz o un módulo discriminado del Artículo desde la vista visual
- **THEN** la página reacciona en vivo, el campo seleccionado se vincula al control correcto y el normalizador conserva la forma JSON original

#### Scenario: Edición de una imagen compuesta
- **WHEN** el editor abre una imagen del artículo o de una galería
- **THEN** identifica archivo, alt, dimensiones, etiqueta y epígrafe como una unidad, recibe ayuda contextual y puede regresar claramente al formulario que la contiene sin perder cambios

