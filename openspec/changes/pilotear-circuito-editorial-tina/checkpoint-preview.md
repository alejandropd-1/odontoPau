# Checkpoint remoto: Draft PR y Save a Preview

Fecha: 2026-08-21.

## Infraestructura verificada

- Draft PR: `#13`, rama `change/pilotear-circuito-editorial-tina` hacia `main`.
- Commit auditado por CI: `0392cb6`.
- `quality-gates` y Deploy Preview del PR: verdes.
- GitHub Actions: permisos de escritura y creación de Pull Requests confirmados por Alejandro.
- Branch deploy persistente de Netlify habilitado para `editorial/tina`.
- URL estable observada: `https://editorial-tina--paulagualtieri.netlify.app`.
- `NEXT_PUBLIC_EDITORIAL_PREVIEW_URL` configurada por Alejandro con la URL estable para todos los deploy contexts.

## Prueba reversible de Save

1. Tina guardó el texto temporal `Ver Especialidades · prueba Preview` en `editorial/tina` mediante el commit `29f65da`.
2. El branch deploy terminó correctamente y el texto temporal apareció una vez en Preview.
3. Producción continuó mostrando `Ver Especialidades`; `main` permaneció en `cf2a100`.
4. Tina restauró el texto original mediante el commit `ecd5667`.
5. El segundo branch deploy terminó correctamente: Preview y producción volvieron a mostrar `Ver Especialidades` y ninguno mostró el texto temporal.

La prueba demuestra `Save -> editorial/tina -> Preview` sin publicación ni modificación de producción. No se activó `Publicar cambios`.

## Pendiente de bootstrap

- Resolver el bootstrap estructural antes de ejecutar los ciclos reales: el workflow de publicación debe existir en la rama desde la que GitHub recibe la solicitud, sin introducir archivos estructurales en el diff editorial.
