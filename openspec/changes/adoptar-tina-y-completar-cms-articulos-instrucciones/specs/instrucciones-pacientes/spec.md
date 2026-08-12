## ADDED Requirements

### Requirement: Creacion segura de instrucciones desde TinaCMS
Tina SHALL permitir crear Instrucciones con slug único, categoría, estado inicial `draft`, tratamiento opcional y al menos un módulo válido. El editor MUST poder elegir y ordenar pasos, matrices, avisos, texto, recursos y galerías sin editar discriminantes técnicos.

#### Scenario: Instruccion basada en pasos
- **WHEN** un editor crea una Instrucción con un módulo de pasos y omite matriz, recursos y galería
- **THEN** el JSON valida y la preview no reserva superficies para módulos ausentes

#### Scenario: Instruccion completa
- **WHEN** un editor combina módulos, imágenes y recursos admitidos
- **THEN** Tina conserva discriminantes, orden, alt, acciones y rutas sin perder campos durante el round-trip

## REMOVED Requirements

### Requirement: Edición en CMS existente
**Reason**: La decisión de no agregar otro CMS queda reemplazada por la adopción explícita de TinaCMS.

**Migration**: Los JSON, loaders y plantilla modular permanecen; la edición pasa de Stackbit/Netlify Visual Editor a la colección Tina de Instrucciones una vez demostrada su paridad.

## ADDED Requirements

### Requirement: Edicion de instrucciones mediante TinaCMS
El sistema SHALL exponer en Tina todos los campos y módulos de Instrucciones, incluidos recursos individuales, galerías, imágenes sociales y referencias validadas de descarga o video. Los opcionales vacíos MUST permanecer ausentes y no producir placeholders ni huecos.

#### Scenario: Recurso agregado posteriormente
- **WHEN** un editor incorpora un recurso a una Instrucción existente
- **THEN** conserva slug, URL, plantilla y contenido previo mientras agrega la referencia y sus metadatos accesibles

#### Scenario: Referencia de video
- **WHEN** una tarjeta de recurso representa un video público admitido
- **THEN** Tina exige portada/alt y valida la ruta de reproducción o descarga sin almacenar material privado

