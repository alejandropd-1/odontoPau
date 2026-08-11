# navegacion-movil-topbar Specification

## Purpose
TBD - created by archiving change crear-menu-movil-topbar. Update Purpose after archive.
## Requirements
### Requirement: Acceso a la navegación principal en mobile
El sistema SHALL ofrecer entre 320 y 767 px un control visible en la topbar que abra un panel con los mismos destinos habilitados en la navegación desktop.

#### Scenario: Apertura desde una página pública
- **WHEN** una persona activa el control de menú desde una ruta pública en viewport mobile
- **THEN** el panel muestra Inicio, Servicios, Artículos, Instrucciones, Ubicación y cualquier enlace opcional habilitado por configuración

#### Scenario: Navegación hacia un destino
- **WHEN** una persona selecciona un enlace del panel mobile
- **THEN** el sistema navega al destino y cierra el panel

### Requirement: Integración con la topbar y el design system
La navegación mobile SHALL conservar la marca y el CTA principal, reutilizar los tokens SASS, BEM, superficies, tipografía y breakpoint existentes, y no SHALL provocar overflow horizontal.

#### Scenario: Viewport mínimo soportado
- **WHEN** la topbar y el panel se renderizan a 320 px de ancho
- **THEN** marca, CTA y control permanecen utilizables y `scrollWidth` no supera `clientWidth`

#### Scenario: Navegación desktop
- **WHEN** el viewport alcanza el breakpoint `md`
- **THEN** se muestra la navegación desktop vigente y el panel mobile queda cerrado y fuera del recorrido interactivo

### Requirement: Operación accesible
El control y el panel SHALL ser operables con teclado y lector de pantalla, exponer su estado y administrar el foco de forma predecible.

#### Scenario: Apertura con teclado
- **WHEN** una persona enfoca el control y lo activa con teclado
- **THEN** `aria-expanded` refleja el estado abierto y el foco pasa al primer enlace disponible

#### Scenario: Cierre con Escape
- **WHEN** el panel está abierto y la persona presiona Escape
- **THEN** el panel se cierra, el fondo recupera su scroll y el foco vuelve al control de menú

#### Scenario: Panel cerrado
- **WHEN** el panel mobile está cerrado
- **THEN** sus enlaces no reciben foco ni son anunciados como contenido visible

### Requirement: Movimiento respetuoso
Las transiciones del menú SHALL respetar la preferencia `prefers-reduced-motion` sin afectar el acceso a los enlaces.

#### Scenario: Movimiento reducido activo
- **WHEN** el sistema operativo solicita movimiento reducido
- **THEN** el menú abre y cierra sin animaciones de desplazamiento no esenciales

### Requirement: Seguridad editorial y privacidad
La navegación mobile SHALL reutilizar únicamente rutas públicas o capacidades habilitadas y no SHALL exponer estados editoriales, rutas locales ni datos sensibles.

#### Scenario: Contenido en revisión
- **WHEN** el sitio contiene artículos o instrucciones que aún no están publicados
- **THEN** el menú sólo enlaza a los archivos públicos generales y no revela slugs privados ni rutas locales

