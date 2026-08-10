# navegacion-footer Specification

## Purpose
TBD - created by archiving change retirar-enlaces-inactivos-footer. Update Purpose after archive.
## Requirements
### Requirement: El footer no ofrece enlaces sin destino
El sitio SHALL mostrar en el footer solamente enlaces que cuenten con un destino real, navegable y aprobado. Mientras Instagram, Facebook y Aviso Legal no tengan destinos definidos, esos controles MUST permanecer ausentes del DOM y del arbol de accesibilidad.

#### Scenario: Footer sin destinos sociales ni legales
- **WHEN** una persona visita cualquier pagina publica del sitio
- **THEN** el footer muestra la marca y el copyright sin enlaces a Instagram, Facebook ni Aviso Legal
- **AND** no existen enlaces con `href="#"` dentro del footer

### Requirement: Composicion responsive sin columna vacia
El footer SHALL reorganizar la marca y el copyright sin reservar espacio para enlaces ausentes y MUST evitar desborde horizontal en los breakpoints soportados.

#### Scenario: Footer en mobile
- **WHEN** el viewport tiene un ancho entre 320 y 430 pixeles
- **THEN** la marca y el copyright se presentan en una composicion legible y centrada
- **AND** el ancho del documento no supera el ancho del viewport

#### Scenario: Footer en desktop
- **WHEN** el viewport tiene un ancho de 1024 pixeles o superior
- **THEN** la marca y el copyright aprovechan el ancho disponible sin dejar una tercera columna vacia

### Requirement: Alcance y trazabilidad del retiro
El cambio SHALL limitarse al footer publico y MUST conservar las referencias editoriales a redes sociales que no funcionen como navegacion publica.

#### Scenario: Referencias internas fuera del footer
- **WHEN** se implementa el retiro de enlaces inactivos
- **THEN** no se eliminan etiquetas, iconos o metadatos de redes del dashboard editorial ni de testimonios

