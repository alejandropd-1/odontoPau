## 1. Preparacion y alcance

- [x] 1.1 Crear la rama exclusiva `change/retirar-enlaces-inactivos-footer` desde `main` sincronizada.
- [x] 1.2 Confirmar que los tres enlaces del footer usan destinos inactivos y que las referencias editoriales a redes quedan fuera del alcance.

## 2. Implementacion

- [x] 2.1 Retirar del componente `Footer` los enlaces a Instagram, Facebook y Aviso Legal.
- [x] 2.2 Ajustar el layout responsive para marca y copyright y eliminar estilos BEM sin consumidores.

## 3. QA tecnico

- [x] 3.1 Verificar que el footer no contenga enlaces con `href="#"` y que no se modifiquen referencias a redes fuera del footer.
- [x] 3.2 Ejecutar `pnpm exec tsc --noEmit --incremental false`.
- [x] 3.3 Ejecutar `pnpm run lint`.
- [x] 3.4 Ejecutar `pnpm run build`.
- [x] 3.5 Ejecutar `pnpm exec openspec validate retirar-enlaces-inactivos-footer --strict` y `git diff --check`.

## 4. Preview y aprobacion

- [x] 4.1 Publicar un Deploy Preview y comprobar el footer en 320, 390 y 1024 pixeles sin enlaces inactivos ni desborde horizontal.
- [x] 4.2 Alejandro valida visualmente el footer sobre el Deploy Preview y autoriza el commit de cierre; esta tarea es exclusivamente manual y ningun agente puede marcarla.
