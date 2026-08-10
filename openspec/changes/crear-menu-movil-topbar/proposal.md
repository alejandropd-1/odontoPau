## Why

La navegación principal desaparece por debajo del breakpoint `md`, dejando en mobile sólo la marca y el CTA de WhatsApp. Las personas necesitan acceder a Servicios, Artículos, Instrucciones, Ubicación y las capacidades opcionales del sitio sin volver a la portada ni depender de enlaces secundarios.

## What Changes

- Incorporar un control de menú claramente identificable en la topbar móvil.
- Presentar los enlaces de navegación vigentes en un panel móvil coherente con el vidrio, la paleta naranja y la tipografía del sitio.
- Mantener visible el CTA de turno sin competir con el control del menú ni provocar overflow horizontal.
- Definir apertura, cierre, navegación, foco, teclado, bloqueo de scroll y movimiento reducido de forma accesible.
- Conservar sin cambios la navegación desktop actual desde el breakpoint `md`.

## Capabilities

### New Capabilities

- `navegacion-movil-topbar`: Navegación principal desplegable en mobile, con comportamiento accesible, responsive y alineado al design system.

### Modified Capabilities

Ninguna.

## Impact

- **Código:** `src/components/Navbar.tsx` y, si la separación de responsabilidades lo requiere, un componente cliente específico para el panel móvil.
- **Estilos:** `src/styles/components/_navbar.scss`, reutilizando tokens, mixins y breakpoints existentes.
- **Dependencias:** Lucide React y Motion ya instalados; no se prevén dependencias nuevas.
- **SEO y contenido:** Sin cambios en rutas, sitemap, metadata ni contenido clínico.
- **Fuera de alcance:** Rediseñar la navegación desktop, alterar el CTA de WhatsApp, agregar rutas nuevas o modificar el dashboard Editorial.
- **Riesgos clínicos:** No aplica contenido clínico nuevo; debe evitarse ocultar accesos a instrucciones de pacientes o mostrar enlaces condicionales deshabilitados.
- **Criterio de éxito:** Entre 320 y 767 px, todas las rutas disponibles en desktop son alcanzables desde la topbar, el panel puede operarse con teclado y lector de pantalla, el foco se administra correctamente y `scrollWidth <= clientWidth` en las rutas representativas.
