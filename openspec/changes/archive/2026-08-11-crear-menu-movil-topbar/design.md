## Context

`Navbar.tsx` renderiza hoy una marca, un grupo de enlaces y el CTA de WhatsApp. `_navbar.scss` oculta por completo `.navbar__links` por debajo de `md`, sin ofrecer un control alternativo. La topbar es fija, usa superficies glass y debe funcionar en todas las rutas públicas, incluidas páginas largas de artículos e instrucciones.

## Goals / Non-Goals

**Goals:**

- Dar acceso mobile a los mismos destinos disponibles en desktop.
- Conservar marca, CTA, tokens SASS, BEM, breakpoint `md` y configuración condicional de testimonios.
- Resolver teclado, foco, lector de pantalla, cierre predecible, scroll del documento y movimiento reducido.
- Evitar overflow horizontal entre 320 y 767 px y mantener áreas táctiles de al menos 44 px.

**Non-Goals:**

- Rediseñar la navegación desktop o cambiar sus rutas.
- Crear una navegación distinta para Editorial.
- Añadir dependencias, contenido, rutas o tracking.
- Implementar la change durante la fase de propuesta.

## Decisions

### Extender el componente existente

`Navbar.tsx` seguirá siendo el dueño de la navegación y añadirá estado local para mobile. Los enlaces se definirán una sola vez y se reutilizarán en desktop y en el panel, preservando la condición `siteFeatures.testimonials`. Se evita duplicar rutas y labels en componentes desconectados.

Alternativa considerada: crear una segunda navbar completa. Se descarta porque aumenta la posibilidad de divergencia y duplica semántica.

### Botón explícito y panel bajo la topbar

La topbar incorporará un botón con icono de menú/cierre, nombre accesible, `aria-expanded` y `aria-controls`. El panel se posicionará debajo de la barra fija sobre una superficie glass reforzada, con enlaces apilados y un backdrop discreto. En `md` o superior no se renderizará visualmente y la navegación actual permanecerá sin cambios.

Alternativa considerada: ocultar el CTA dentro de un menú hamburguesa. Se descarta para conservar la acción principal visible, ajustando espaciados y tipografía en anchos estrechos.

### Gestión accesible del estado

Al abrir, el foco pasará al primer enlace. Escape, selección de un destino, clic en backdrop o cambio a viewport desktop cerrarán el panel. Al cerrar mediante Escape o el botón, el foco regresará al disparador. Mientras el panel esté abierto se bloqueará el scroll de fondo desde un efecto con limpieza garantizada.

El panel no permanecerá interactivo cuando esté cerrado. Se usarán elementos semánticos y no se emularán botones con `div`.

### Movimiento y diseño

La transición será breve y funcional, reutilizando `transition()` y los tokens actuales. `prefers-reduced-motion: reduce` eliminará desplazamientos y animaciones no esenciales. No se introducirán colores, sombras, radios ni breakpoints hardcodeados cuando exista un token equivalente.

## Risks / Trade-offs

- [Marca, CTA y botón no caben en 320 px] → Ajustar gaps, padding y escala tipográfica sólo en mobile; comprobar 320, 375 y 390 px con contenido real.
- [El panel queda abierto después de navegar] → Cerrar en cada enlace y ante cambios de pathname.
- [Foco perdido o contenido de fondo alcanzable] → Administrar foco explícitamente, ocultar el panel cerrado y validar recorrido con Tab, Shift+Tab y Escape.
- [Scroll lock persiste después de desmontar] → Implementar la mutación dentro de un efecto con cleanup y prueba de navegación.
- [La topbar tapa el primer contenido] → Reutilizar `--navbar-height` y validar las variantes de breadcrumb/hero existentes.

## Migration Plan

1. Implementar en la rama de la change sin alterar rutas ni datos.
2. Validar TypeScript, lint, build y OpenSpec.
3. Probar localmente en 320, 375, 390 y 767 px; confirmar `scrollWidth <= clientWidth`.
4. Verificar teclado, lector de pantalla básico, movimiento reducido y cierre en navegación.
5. Generar Deploy Preview y revisar Inicio, Tratamientos, Artículos e Instrucciones antes de solicitar aprobación.
6. Para rollback, revertir el componente y estilos de navbar; no hay migraciones de datos.

## Open Questions

- Confirmar durante la revisión visual si el CTA conserva su texto completo en 320 px o necesita una variante mobile equivalente como “Turno”.
