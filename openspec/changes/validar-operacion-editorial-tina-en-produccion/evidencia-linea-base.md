# Evidencia de línea base

Fecha de registro: 2026-08-22.

## Git

- Rama de trabajo: `change/validar-operacion-editorial-tina-en-produccion`.
- Commit base de la rama: `de917089c2ddb3da787761dfbeabcb1858456672`.
- `main`, `origin/main`, `HEAD` y el merge-base coincidían en ese commit al crear y comprobar la rama.
- El commit base es `Merge pull request #13 from alejandropd-1/change/pilotear-circuito-editorial-tina`, fechado el 2026-08-21.
- El commit de archive del bootstrap `193ebb2` es ancestro de `main`.
- El árbol actual contiene únicamente el roadmap actualizado y los artefactos todavía no confirmados de este OpenSpec; no se detectaron cambios ajenos.

## Bootstrap presente en main

La revisión base contiene las superficies estructurales del piloto, entre ellas:

- `.github/workflows/editorial-publication.yml`
- `scripts/editorial-publication.ts`
- `src/cms/tina/publication.ts`
- `src/cms/tina/publication-preflight.ts`
- `src/cms/tina/publication-workflow-test.ts`
- `src/data/editorial/publication-request.json`
- `tina/dashboard/EditorialDashboard.tsx`

Esta evidencia confirma integración Git del bootstrap. La comprobación externa de rama editorial, branch deploy e índice TinaCloud pertenece a la tarea 1.2 y no se ejecutó todavía.

## Herramientas

| Herramienta | Versión registrada |
|---|---|
| Git | `2.51.0.windows.1` |
| Node.js | `22.19.0` |
| pnpm | `11.1.2` |
| OpenSpec | `1.5.0` |
| Next.js | `15.5.18` |
| TinaCMS | `3.11.0` |
| `@tinacms/cli` | `2.5.6` |

No se ejecutaron builds, deploys, reindexados, pushes ni operaciones sobre servicios externos para registrar esta línea base.

## Comprobación externa autorizada

Verificada el 2026-08-22 sin disparar builds, deploys ni publicaciones:

- `origin/main`: `de917089c2ddb3da787761dfbeabcb1858456672`.
- `origin/editorial/tina`: `fc8aa17af1cf896517d813b03dccb175c8c905a5`.
- `origin/main` es ancestro de `origin/editorial/tina`; la rama editorial está tres commits por delante y no está divergida.
- El diff editorial respecto de `main` afecta únicamente el fin de archivo de `src/data/home.json`; no contiene una modificación visible pendiente.
- Branch deploy Netlify: `ready`, deploy `6a88c8facff5180008ec9d9c`, commit `fc8aa17af1cf896517d813b03dccb175c8c905a5`.
- Preview estable: `https://editorial-tina--paulagualtieri.netlify.app`; `/` y `/admin/` respondieron HTTP 200.
- TinaCloud mostró `editorial/tina` y `main` con estado de índice `complete`.
- No fue necesario sincronizar, reindexar ni modificar configuración externa.

## Modificación visible seleccionada

La primera prueba real usará un texto institucional de la página de inicio, sin contenido clínico ni imágenes:

- Documento: `src/data/home.json`.
- Campo: `location.description`.
- Texto publicado: `Un espacio diseñado para tu tranquilidad y confort, equipado con la mejor tecnología para tu cuidado dental.`
- Texto de prueba: `Un espacio diseñado para tu tranquilidad y confort, equipado con tecnología de vanguardia para tu cuidado dental.`

La modificación es visible, pequeña, reversible y elimina un superlativo publicitario sin alterar una indicación clínica. No requiere aprobación clínica o de imagen de Paula. Alejandro autorizó comenzar el ciclo real el 2026-08-22. El contenido todavía no fue guardado desde Tina ni solicitado para publicación.
