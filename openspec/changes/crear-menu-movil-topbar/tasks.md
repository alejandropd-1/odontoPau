## 1. Contrato y estructura de navegación

- [x] 1.1 Centralizar los destinos de navegación para reutilizarlos en desktop y mobile, conservando `siteFeatures.testimonials`.
- [x] 1.2 Incorporar en `Navbar.tsx` el estado, referencias y semántica accesible del control y panel mobile.

## 2. Interacción accesible

- [x] 2.1 Implementar apertura y cierre mediante botón, Escape, backdrop, selección de enlace y cambio al breakpoint desktop.
- [x] 2.2 Gestionar foco inicial, devolución de foco, recorrido de teclado y bloqueo de scroll con cleanup al desmontar.
- [x] 2.3 Verificar nombres accesibles, `aria-expanded`, `aria-controls` y exclusión del panel cerrado del árbol interactivo.

## 3. Diseño responsive

- [x] 3.1 Extender `_navbar.scss` con estilos BEM para botón, backdrop y panel reutilizando tokens, glass y breakpoint `md`.
- [x] 3.2 Mantener marca y CTA utilizables sin overflow entre 320 y 767 px.
- [x] 3.3 Implementar estados hover, active y focus-visible, y respetar `prefers-reduced-motion`.

## 4. QA técnico y visual

- [x] 4.1 Ejecutar `openspec validate crear-menu-movil-topbar --strict`.
- [x] 4.2 Ejecutar `pnpm exec tsc --noEmit`, `pnpm run lint`, `pnpm run build` y `git diff --check`.
- [x] 4.3 Validar con Playwright 320, 375, 390, 767 y desktop, incluyendo `scrollWidth <= clientWidth`, apertura, cierre, navegación y consola limpia.
- [x] 4.4 Revisar Inicio, Tratamientos, Artículos e Instrucciones en un Deploy Preview sin publicar producción.

## 5. Preparación del cierre

- [ ] 5.1 Preparar commit y push selectivos en `change/crear-menu-movil-topbar`, abrir un Draft PR y confirmar que CI y Deploy Preview correspondan a la revisión exacta.
- [x] 5.2 Corregir observaciones y repetir OpenSpec, TypeScript, lint, build, Playwright y control de overflow sin hacer merge ni archive.

## 6. Validación final de Alejandro

- [ ] 6.1 Alejandro revisa el menú mobile en el Deploy Preview final y autoriza el commit de cierre, el OpenSpec Archive y la preparación del merge a `main`. Esta tarea es exclusivamente manual y ningún agente puede marcarla.
