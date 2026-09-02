# Release: trazabilidad operativa editorial — 2026-09-02

## Alcance y autorización

Alejandro marcó la validación humana 6.2, realizó el cierre y el archive, y autorizó resolver la higiene Git, hacer commits, push y merge. Se trabajó en el checkout existente, sin crear worktrees, cambiar la rama activa ni borrar archivos locales. No se reabrió el OpenSpec archivado ni se inició el cambio de redes sociales.

## Integración

- Implementación corregida: `6dfeaea`; archive y sincronización de specs: `c50fc95`.
- Higiene y descripciones finales de las specs: `990df4d`.
- Merge autorizado a `main`: `fecc278dc860c2599588646e3f3a7b38ad8a141f`.
- Ajuste de la prueba de paginación: `28e959d`, integrado en `ec98eae2d7b97e5e6ea344af779144165c003ea2` con `[skip netlify]`.
- Sincronización del esquema y código de publicación en `editorial/tina`: `b7b369ffa3a074d35de743763ed9d3d98eae1cc9`, también con `[skip netlify]`.

La sincronización conservó exactamente el manifiesto operativo de Tina, que ya estaba en `published`. No se reemplazó por el antiguo `pending` de la rama de código, no se envió un pedido nuevo ni se inventaron movimientos históricos. El contrato admite que el documento legado todavía no tenga `history`; los próximos resultados finales lo incorporarán.

## Higiene y comprobaciones

- Se reconstruyeron únicamente los commits aún no integrados para excluir 91 adjuntos, capturas y salidas de pruebas agregados por accidente. La actualización remota usó una protección por SHA esperado (`force-with-lease`), sin forzar `main`.
- Se dejó de versionar `tsconfig.tsbuildinfo` y se agregaron exclusiones específicas a `.gitignore`.
- Las 92 copias locales conservaron sus hashes SHA-256. No se eliminaron archivos del disco ni se limpiaron artefactos históricos ajenos a estos commits.
- El código de producto resultante coincidió con el cierre validado; el archive conservó su diff propio. La exclusión del historial alcanzable no garantiza que el proveedor haya eliminado objetos o cachés de los SHA anteriores.
- `pnpm run validate:openspec`: 22 elementos aprobados; se completaron dos `Purpose` provisionales y se retiraron líneas vacías finales de las specs canónicas.
- `git diff --check`: correcto.
- El primer control remoto detectó una aserción que aún buscaba `setVisibleHistoryCount`, anterior al ajuste de paginación con clave. Se actualizó para comprobar reinicio a cinco, recorte de movimientos e incremento de cinco con el estado actual, sin cambiar la interfaz.
- `pnpm run test:tina-publication-workflow` y `pnpm run test:tina-dashboard-model`: correctos tras esa corrección.
- El manifiesto legado de la rama editorial pasó `validatePublicationRequest`; su estado confirmado se preservó.
- CI de la revisión corregida: [Quality Gates 33660974044](https://github.com/alejandropd-1/odontoPau/actions/runs/33660974044), completado correctamente en `ec98eae`; incluye contratos, pruebas del circuito, construcción del administrador, TypeScript, lint y build de Preview.

## Producción: pendiente de confirmación

La consulta del 2026-09-02 a las 17:27 UTC a `/deployment.json` todavía devolvía `e0ae8f88704fc505d3b53e0cc2ee4869e552343b`, la versión anterior, generada el 2026-09-01. Esto no confirma el deploy nuevo ni demuestra por sí solo su causa de demora o fallo.

`/admin/` respondió HTTP 200 con `X-Robots-Tag: noindex, nofollow, noarchive`; esa respuesta comprueba disponibilidad, no el funcionamiento autenticado del historial nuevo.

La conexión de Netlify solicitó reautenticación y una consulta CLI no devolvió resultado; se detuvo esa consulta, sin lanzar reintentos de build ni un deploy manual. Los commits de prueba, sincronización y documentación omiten Netlify para no consumir builds adicionales.

Para cerrar el release:

1. Consultar el deploy del merge `fecc278` con la conexión de Netlify restablecida o con el reporte proporcionado por Alejandro; el CI corregido ya terminó correctamente.
2. Si el deploy falló, identificar su causa antes de solicitar un único reintento. No usar «Publicar cambios» de Tina para desplegar cambios de código.
3. Confirmar la marca pública correspondiente y comprobar el historial desde una sesión autenticada de `/admin`; no inventar publicaciones para poblarlo.
4. Actualizar este reporte y el roadmap cuando la publicación esté efectivamente verificada. Mantener redes sociales en `PARKED` hasta entonces.
