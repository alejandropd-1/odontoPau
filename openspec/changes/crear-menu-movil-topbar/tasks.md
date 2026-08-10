## 1. Contrato y estructura de navegación

- [ ] 1.1 Centralizar los destinos de navegación para reutilizarlos en desktop y mobile, conservando `siteFeatures.testimonials`.
- [ ] 1.2 Incorporar en `Navbar.tsx` el estado, referencias y semántica accesible del control y panel mobile.

## 2. Interacción accesible

- [ ] 2.1 Implementar apertura y cierre mediante botón, Escape, backdrop, selección de enlace y cambio al breakpoint desktop.
- [ ] 2.2 Gestionar foco inicial, devolución de foco, recorrido de teclado y bloqueo de scroll con cleanup al desmontar.
- [ ] 2.3 Verificar nombres accesibles, `aria-expanded`, `aria-controls` y exclusión del panel cerrado del árbol interactivo.

## 3. Diseño responsive

- [ ] 3.1 Extender `_navbar.scss` con estilos BEM para botón, backdrop y panel reutilizando tokens, glass y breakpoint `md`.
- [ ] 3.2 Mantener marca y CTA utilizables sin overflow entre 320 y 767 px.
- [ ] 3.3 Implementar estados hover, active y focus-visible, y respetar `prefers-reduced-motion`.

## 4. QA técnico y visual

- [ ] 4.1 Ejecutar `openspec validate crear-menu-movil-topbar --strict`.
- [ ] 4.2 Ejecutar `pnpm exec tsc --noEmit`, `pnpm run lint`, `pnpm run build` y `git diff --check`.
- [ ] 4.3 Validar con Playwright 320, 375, 390, 767 y desktop, incluyendo `scrollWidth <= clientWidth`, apertura, cierre, navegación y consola limpia.
- [ ] 4.4 Revisar Inicio, Tratamientos, Artículos e Instrucciones en un Deploy Preview sin publicar producción.

## 5. Aprobación y release

- [ ] 5.1 Obtener aprobación visual y funcional del menú mobile.
- [ ] 5.2 Realizar commit, push, integración y verificación de producción sólo después de autorización explícita.
