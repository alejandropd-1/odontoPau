# Operacion de CI y publicacion protegida

Este runbook describe como habilitar los gates del repositorio sin bloquear `main` ni permitir publicaciones directas. No contiene credenciales ni reemplaza las aprobaciones clinica, editorial o visual.

## Contrato del workflow

- Workflow: `Quality Gates`.
- Job/check esperado: `quality-gates`.
- Eventos: pull requests hacia `main` y pushes sobre `main`.
- Runtime: Node 22 y pnpm 11.1.2.
- Scripts de dependencias: allowlist versionada en `pnpm-workspace.yaml`; no se permite `dangerously-allow-all-builds`.
- Permisos: `contents: read`.
- Contexto de build: Deploy Preview, sin deploy ni secretos.
- Gates: OpenSpec estricto, diff de PR, TypeScript, lint y build.

El nombre exacto mostrado por GitHub debe confirmarse despues del primer push antes de configurar un required check.

## Preflight local

Desde una rama distinta de `main`:

```powershell
pnpm install --frozen-lockfile
pnpm run validate:openspec
pnpm run typecheck
pnpm run lint
$env:CI='true'
$env:CONTEXT='deploy-preview'
$env:NETLIFY_PREVIEW_SERVER='true'
pnpm run build
git diff --check
```

Revisar `git status --short` y seleccionar archivos de staging de forma explicita. No usar `git add .` ni `git add -A` cuando existan cambios locales ajenos.

Si pnpm detecta un nuevo paquete con script de instalacion, el install debe fallar. Auditar paquete, version y script; agregarlo a `allowBuilds` solo mediante un cambio revisado. No restaurar `dangerously-allow-all-builds`.

## Primer push y pull request

1. Confirmar que el diff incluye solo workflow, scripts, lockfile, documentacion y el OpenSpec correspondiente.
2. Crear un commit en la rama del cambio y hacer push solo con autorizacion.
3. Abrir un pull request hacia `main` usando la plantilla del repositorio.
4. Verificar que `Quality Gates / quality-gates` aparezca y termine correctamente.
5. Registrar el nombre exacto del check antes de proteger la rama.

No habilitar branch protection antes de este punto: GitHub no puede requerir de forma segura un check que todavia no existe en remoto.

## GitHub: proteccion de `main`

Aplicar desde Settings > Branches o Rulesets una vez que el check remoto exista:

1. Requerir pull request antes del merge.
2. Requerir el check exacto de Quality Gates.
3. Requerir que las conversaciones esten resueltas.
4. Bloquear force-push y borrado de `main`.
5. Evitar bypass general; conservar acceso Owner para recuperacion controlada.
6. Si hay mas de una persona con permiso de escritura, requerir aprobacion distinta del ultimo autor del cambio.

Verificacion: intentar actualizar un PR con un fallo controlado en una rama descartable y confirmar que GitHub impide el merge. Retirar el fallo y comprobar que el check vuelve a habilitarlo.

Configuracion verificada el 10 de agosto de 2026:

- `main` quedo protegida y requiere un pull request antes del merge.
- El required check es `quality-gates`, restringido a GitHub Actions (`app_id` 15368), con rama actualizada (`strict: true`).
- Las conversaciones deben estar resueltas y no se permiten force-push ni borrado de `main`.
- El repositorio tiene un unico colaborador directo con escritura; por eso no se exige una segunda aprobacion. El Owner conserva recuperacion controlada mediante `enforce_admins: false`.
- El rollback se comprobo sin desproteger la rama: la sesion Owner tiene permiso administrativo, la regla bloqueante se puede aislar en `required_status_checks` y la configuracion completa fue leida de vuelta despues de aplicarla. Ante una incidencia real, desactivar solo esa regla y restaurar este mismo conjunto de valores.

## Netlify Visual Editor: publicacion mediante PR

1. Confirmar que la working branch es `editorial-preview`, creada desde el `main` vigente y distinta de la rama de produccion.
2. Confirmar que la content publishing branch es `main`.
3. Configurar Git CMS para abrir pull request en lugar de mezclar directamente.
4. Usar una edicion institucional inocua para verificar que el cambio queda en la working branch y genera un PR.
5. Descartar o revertir la prueba si no forma parte de un cambio aprobado.

No usar una afirmacion clinica, imagen de paciente ni estado `published` como prueba de configuracion.

Configuracion verificada el 10 de agosto de 2026:

- `editorial-preview` se creo desde `main@75ef693` sin reescribir la rama historica `preview`, que estaba divergida y contenia cambios obsoletos.
- Visual Editor quedo configurado con working branch `editorial-preview` y `Pull request to main`.
- Una edicion temporal de `src/data/home.json.title` creo el PR de prueba #3. El valor se restauro, la rama quedo sin diferencias de contenido respecto de `main` y el PR se cerro sin merge.
- El Preview Server de `editorial-preview` quedo operativo en `https://devserver-editorial-preview--paulagualtieri.netlify.app`.
- El log del editor aun informa incompatibilidades de modelado en secciones anidadas de instrucciones y configuracion de assets. Esas correcciones pertenecen al OpenSpec `hacer-sitio-autoadministrable-desde-cms` y no impiden considerar probado el circuito rama -> PR para un campo institucional simple.

## Netlify: produccion Git-only

Despues de validar Deploy Previews y el PR editorial:

1. Abrir Project configuration > Build & deploy > Continuous deployment > Enforce deployment methods.
2. Habilitar el flujo que permite publicar produccion solo mediante Git.
3. Confirmar que Deploy Previews y branch deploys continuan disponibles.
4. Confirmar que una promocion directa o un deploy CLI de produccion queda rechazado sin ejecutar una publicacion real.

Configuracion verificada el 10 de agosto de 2026:

- El proyecto `paulagualtieri` esta conectado a `alejandropd-1/odontoPau` y su rama de produccion es `main`.
- `prevent_non_git_prod_deploys` quedo activo, por lo que la produccion solo admite el flujo Git.
- El Deploy Preview del PR #2 continuo operativo con HTTP 200 despues de activar la restriccion.
- No se intento un deploy productivo de prueba: la comprobacion segura consistio en leer nuevamente la configuracion activa y verificar el preview, evitando el riesgo de publicar si la proteccion no se hubiera aplicado.

## Rollback

Si un check o proteccion bloquea un cambio valido por configuracion incorrecta:

1. Registrar el motivo y la configuracion observada.
2. Como Owner, desactivar temporalmente solo la regla bloqueante.
3. Corregir workflow o nombre del required check mediante PR cuando sea posible.
4. Reactivar la regla y repetir la verificacion.

Si Git-only interfiere con el deploy continuo esperado, desactivarlo temporalmente desde Netlify, verificar la rama de produccion y corregir la configuracion antes de reactivarlo. Nunca usar el rollback para omitir aprobaciones de contenido.

## Evidencia de cierre

- URL del pull request.
- Check exacto y resultado exitoso.
- URL del Deploy Preview.
- Captura o registro no sensible de branch protection.
- Confirmacion de Visual Editor publicando mediante PR.
- Confirmacion de Netlify Git-only y previews operativos.
- Autorizacion explicita de merge.
- Verificacion posterior de produccion.

## Cierre de cada OpenSpec

1. Trabajar en `change/<id-exacto-del-openspec>` y abrir un Draft PR para obtener CI y Deploy Preview.
2. Completar todas las tareas tecnicas y aprobaciones clinicas aplicables, dejando ultimo el checkbox manual de Alejandro.
3. Alejandro revisa la revision exacta del preview y marca personalmente ese ultimo checkbox.
4. Realizar un commit de cierre con la implementacion y la validacion registradas.
5. Ejecutar OpenSpec Archive solamente con el cambio al 100% y realizar un segundo commit exclusivo del archive y la sincronizacion de specs.
6. Mantener ambos commits en el mismo PR y mezclar a `main` solo con autorizacion explicita.
7. Verificar produccion despues del deploy y registrar la evidencia en el PR o reporte de release; no reabrir el OpenSpec archivado.

No usar `Archivar` si GitCron informa tareas sin tildar. Ningun agente puede completar el ultimo checkbox manual en nombre de Alejandro.

## Mantenimiento

- Revisar trimestralmente, y antes de cada cambio mayor, las versiones de GitHub Actions, OpenSpec, Node y pnpm. Cualquier actualizacion se implementa y valida en un pull request separado.
- Mantener este runbook sincronizado cuando cambien los nombres de checks, permisos o pantallas de GitHub y Netlify.
- Revisar `allowBuilds` cada vez que cambie el lockfile. Una dependencia nueva con script de instalacion requiere auditoria explicita y version fijada.

## Referencias oficiales

- Netlify Visual Editor, ramas: https://docs.netlify.com/manage/visual-editor/cloud-setup/git-branching/
- Netlify Visual Editor, publicacion: https://docs.netlify.com/manage/visual-editor/cloud-setup/publishing/
- Netlify, deploys Git-only: https://docs.netlify.com/build/git-workflows/overview/
- GitHub, ramas protegidas: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
