# Especificación: Dashboard Editorial Dinámico

## ADDED Requirements

### Requirement: Lectura Dinámica del Catálogo de Contenidos
El sistema SHALL listar dinámicamente todos los artículos e instrucciones cargados en el sistema JSON.

#### Scenario: Visualización del catálogo en vivo
- **Dado** que se crean o modifican archivos JSON bajo `src/data/articulos` o `src/data/instrucciones`
- **Cuando** un usuario accede a la ruta `/editorial`
- **Entonces** el sistema compila y muestra dinámicamente el conteo total de artículos, guías de paciente, estado de revisión y enlaces de vista previa sin requerir cambios de código ni datos estáticos.

### Requirement: Trazabilidad con Google Drive
El sistema SHALL exponer la carpeta de origen en Google Drive para cada pieza editorial.

#### Scenario: Mapeo de carpetas origen
- **Dado** que cada pieza proviene de una carpeta de trabajo en Google Drive (`caso-01`, `caso-02`, `caso-03`, `caso-04`, `keep`, etc.)
- **Cuando** se visualiza la pestaña de Trazabilidad en `/editorial`
- **Entonces** el sistema muestra la correspondencia clara entre la pieza editorial, su ruta JSON en el proyecto y su carpeta correspondiente en Google Drive.

### Requirement: Módulo de Difusión para Redes Sociales
El sistema SHALL generar copys preparados para difusión en redes.

#### Scenario: Copiado de copys para Instagram y LinkedIn
- **Dado** que las piezas editoriales requieren adaptación para redes sociales
- **Cuando** se interactúa con la pestaña de Redes Sociales en `/editorial`
- **Entonces** el sistema ofrece bloques de texto con copys adaptados para Instagram/LinkedIn y un botón de copiado rápido al portapapeles.
