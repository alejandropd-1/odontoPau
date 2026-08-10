## Context

`main` esta vinculada a produccion en Netlify. El repositorio no contiene workflows bajo `.github/workflows`, por lo que OpenSpec, TypeScript, ESLint y Next build se verifican manualmente. Netlify Visual Editor usa contenido Git y puede trabajar sobre una rama separada, pero sus opciones de publicacion y las protecciones remotas no estan documentadas ni verificadas en el repositorio.

El proyecto declara Node 22 en `netlify.toml`, pnpm 11.1.2 en `package.json` y utiliza OpenSpec 1.5.0 localmente. Los builds de preview necesitan `CONTEXT=deploy-preview` y `NETLIFY_PREVIEW_SERVER=true` para conservar el comportamiento no indexable y las rutas editoriales de revision.

## Goals / Non-Goals

**Goals:**

- Ejecutar gates reproducibles en cada pull request hacia `main`.
- Usar versiones declaradas y lockfile congelado.
- Dar evidencia clara de cada fallo sin permisos de escritura ni secretos.
- Hacer que todo contenido del CMS llegue a produccion mediante PR revisable.
- Documentar una secuencia segura para activar protecciones externas sin bloquear el repositorio.

**Non-Goals:**

- Desplegar desde GitHub Actions o reemplazar el deploy continuo de Netlify.
- Ejecutar pruebas visuales completas o Playwright en esta primera puerta.
- Configurar Supabase, CMS, menu mobile, contenido o redes.
- Activar automaticamente reglas externas antes de comprobar el workflow remoto.

## Decisions

### Un workflow unico de calidad

Se agregara `.github/workflows/quality-gates.yml` con eventos `pull_request` hacia `main` y `push` sobre `main`. Un unico job secuencial mantendra logs simples y evitara que varios jobs repitan instalacion y build en un repositorio pequeno.

Alternativa descartada: separar cada comando en jobs paralelos. Reduciria algunos minutos cuando todo pasa, pero duplicaria setup y produciria varias superficies de fallo para un pipeline inicial.

### Runtime reproducible y permisos minimos

El workflow usara checkout, pnpm y Node 22 con cache de pnpm, `pnpm install --frozen-lockfile`, timeout explicito, cancelacion de ejecuciones obsoletas y `permissions: contents: read`. No recibira tokens del sitio, Supabase ni Netlify.

OpenSpec 1.5.0 se agregara como devDependency exacta. CI ejecutara el binario local mediante `pnpm exec openspec`; no instalara `latest` ni dependera del entorno global. Su `postinstall`, auditado como un aviso opcional de completado de shell que se omite en CI, se autorizara por version.

Pnpm 11 bloquea por defecto scripts de dependencias no revisados. `pnpm-workspace.yaml` declarara una allowlist versionada para los paquetes nativos ya presentes en el lockfile. Esta lista reemplazara `PNPM_FLAGS=--config.dangerously-allow-all-builds=true` de Netlify, evitando que una dependencia futura ejecute scripts automaticamente.

### Build con semantica de preview

El job definira `CI=true`, `CONTEXT=deploy-preview` y `NETLIFY_PREVIEW_SERVER=true`. Asi podra compilar documentos de revision sin tratarlos como contenido publico de produccion. El workflow no tendra credenciales y no ejecutara `netlify deploy`.

### Gates ordenados de menor a mayor costo

El orden sera OpenSpec, diff del PR, TypeScript, lint y build. Los errores estructurales se detectaran antes del paso mas costoso. `git diff --check` se aplicara al rango del pull request; en `push` a `main` se conservaran los restantes gates y el build como verificacion post-merge.

### Publicacion por PR y Git-only como configuracion externa

Despues de que el workflow exista en remoto y pase, se configurara:

1. Visual Editor con rama de trabajo separada de `main`.
2. Publicacion de Git CMS mediante pull request, no merge directo.
3. Proteccion de `main` con el check de calidad requerido y sin force-push ni borrado.
4. Netlify con despliegues de produccion Git-only.

Estas acciones no se automatizaran desde el workflow. Se documentaran con preflight, evidencia y rollback porque una regla incorrecta puede bloquear el release.

### Evidencia de PR y aprobaciones

Una plantilla de pull request pedira OpenSpec, alcance, comandos, preview y aprobaciones clinica/visual cuando correspondan. No reemplazara los estados editoriales ni guardara consentimiento; solo estandarizara el checkpoint.

### Rama y cierre por OpenSpec

Cada cambio implementable se trabajara en `change/<id-exacto-del-openspec>`. Tras CI y Deploy Preview, Alejandro marcara personalmente el ultimo checkbox de validacion. Con todas las tareas completas se hara un commit de cierre, luego OpenSpec Archive y un segundo commit de archive en la misma rama y pull request. El merge a `main` requerira autorizacion explicita y sera el unico disparador de produccion; la verificacion posterior se registrara en el pull request o reporte de release sin reabrir el cambio archivado.

## Risks / Trade-offs

- [El build de preview difiere de produccion] -> Mantener tambien el gate `push` sobre `main` y verificar el deploy real despues del merge autorizado.
- [OpenSpec agrega tiempo de instalacion] -> Fijarlo como devDependency y reutilizar cache de pnpm.
- [Una accion de GitHub queda obsoleta] -> Usar majors estables, Dependabot o revision periodica y lockfile para dependencias del proyecto.
- [Una dependencia actualiza su version con script de instalacion] -> Mantener versiones resueltas y revisar explicitamente la nueva version antes de incorporarla a `allowBuilds`.
- [El check requerido cambia de nombre] -> Documentar el nombre estable del job antes de activar branch protection.
- [La proteccion impide un hotfix] -> Mantener procedimiento de desactivacion temporal solo para Owner, con registro y reactivacion posterior.
- [Visual Editor mezcla directamente] -> Configurar explicitamente modo pull request y verificarlo con un cambio editorial inocuo.

## Migration Plan

1. Agregar OpenSpec fijado, workflow, plantilla y runbook en rama.
2. Ejecutar localmente todos los comandos exactos del workflow.
3. Revisar diff, realizar commit/push selectivo y abrir Draft PR.
4. Confirmar que el workflow remoto aparece y pasa, y revisar el Deploy Preview.
5. Configurar Visual Editor para publicar mediante PR y probar una edicion no clinica.
6. Activar proteccion de `main` requiriendo el check ya existente.
7. Activar deploys Git-only en Netlify y verificar que previews sigan disponibles.
8. Obtener la validacion manual final de Alejandro y realizar el commit de cierre.
9. Ejecutar OpenSpec Archive y realizar el segundo commit en la misma rama y PR.
10. Mezclar solo con autorizacion y verificar produccion, registrando la evidencia fuera del OpenSpec archivado.

Rollback: desactivar temporalmente el check requerido o Git-only desde los paneles correspondientes, revertir el commit del workflow y conservar el runbook para diagnostico. No se elimina historial ni contenido.

## Open Questions

- Confirmar en el checkpoint remoto el nombre exacto con que GitHub registra el check requerido.
- Confirmar que el plan actual de Netlify expone permisos editoriales y la opcion Git-only indicadas antes de activarlas.
