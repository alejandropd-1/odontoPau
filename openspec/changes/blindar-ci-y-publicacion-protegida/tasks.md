## 1. Linea base

- [x] 1.1 Registrar rama, revision, versiones de Node, pnpm y OpenSpec, y confirmar que no existen workflows previos que deban preservarse.
- [x] 1.2 Verificar que implementaciones de otros OpenSpecs y cambios locales ajenos permanezcan fuera del alcance; se admite unicamente la normalizacion metodologica transversal solicitada.

## 2. Dependencias e infraestructura CI

- [x] 2.1 Agregar `@fission-ai/openspec` 1.5.0 como devDependency exacta, versionar `pnpm-lock.yaml` y `pnpm-workspace.yaml`, y retirar la autorizacion global insegura de scripts de instalacion.
- [x] 2.2 Agregar scripts reproducibles para validacion OpenSpec y TypeScript sin modificar los scripts de build y lint existentes.
- [x] 2.3 Crear `.github/workflows/quality-gates.yml` para pull requests y pushes a `main`, con Node 22, pnpm 11.1.2, cache, lockfile congelado, timeout y concurrencia.
- [x] 2.4 Configurar el workflow con `permissions: contents: read` y sin secretos, deploys ni comandos mutables.
- [x] 2.5 Ejecutar OpenSpec, diff del pull request, TypeScript, lint y build en orden, usando variables de Deploy Preview para el build.

## 3. Evidencia y documentacion operativa

- [x] 3.1 Crear una plantilla de pull request que solicite OpenSpec, alcance, comandos, preview y aprobaciones clinica, privacidad y visual cuando correspondan.
- [x] 3.2 Crear un runbook con preflight, activacion y rollback de branch protection, checks requeridos, publicacion por PR en Visual Editor y deploys Git-only en Netlify.
- [x] 3.3 Documentar el nombre esperado del job y dejar como pendiente su confirmacion exacta despues del primer push.
- [x] 3.4 Confirmar que este cambio no modifica contenido clinico, estado editorial, rutas publicas ni configuracion de produccion.
- [x] 3.5 Alinear configuracion, roadmap y tareas de los seis OpenSpecs activos con rama exclusiva, ultimo checkbox manual, commit de cierre y archive previo al merge.

## 4. QA local

- [x] 4.1 Ejecutar `pnpm install --frozen-lockfile` desde el lockfile actualizado.
- [x] 4.2 Ejecutar `pnpm exec openspec validate --all --strict` y corregir cualquier falla.
- [x] 4.3 Ejecutar `pnpm run typecheck` sin escritura incremental y corregir cualquier falla atribuible al cambio.
- [x] 4.4 Ejecutar `pnpm run lint` y corregir cualquier falla atribuible al cambio.
- [x] 4.5 Ejecutar `pnpm run build` con `CI=true`, `CONTEXT=deploy-preview` y `NETLIFY_PREVIEW_SERVER=true`.
- [x] 4.6 Ejecutar `git diff --check`, revisar permisos/acciones del workflow y confirmar que no haya secretos ni archivos ajenos en el diff destinado al cambio.

## 5. Checkpoint remoto y publicacion protegida

- [x] 5.1 Preparar commit y push selectivos solo despues de revisar el checkpoint local y recibir autorizacion explicita.
- [x] 5.2 Abrir un pull request y confirmar que el workflow remoto aparece con el nombre previsto y finaliza correctamente.
- [ ] 5.3 Configurar Visual Editor para publicar mediante pull request desde una rama de trabajo separada y verificarlo con una edicion no clinica.
- [ ] 5.4 Activar proteccion de `main` con el check exitoso, sin force-push ni borrado, y comprobar el procedimiento de rollback.
- [ ] 5.5 Activar deploys de produccion Git-only en Netlify, manteniendo Deploy Previews, y registrar evidencia sin secretos.
- [ ] 5.6 Repetir el preflight final, confirmar el Draft PR y Deploy Preview de la revision exacta y dejar el cambio listo para validacion humana sin merge ni archive.

## 6. Mantenimiento

- [x] 6.1 Documentar la revision periodica de majors de GitHub Actions, version fijada de OpenSpec y compatibilidad Node/pnpm mediante un cambio separado.
- [x] 6.2 Documentar la obligacion de mantener el runbook sincronizado cuando cambien nombres de checks, permisos o pantallas de GitHub/Netlify.

## 7. Validacion final de Alejandro

- [ ] 7.1 Alejandro revisa el Deploy Preview final, confirma el funcionamiento de CI y las protecciones configuradas, y autoriza el commit de cierre, el OpenSpec Archive y la preparacion del merge a `main`. Esta tarea es exclusivamente manual y ningun agente puede marcarla.
