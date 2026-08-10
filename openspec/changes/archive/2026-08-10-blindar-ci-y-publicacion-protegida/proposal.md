## Why

El repositorio depende hoy de validaciones manuales antes de cada merge y no posee workflows de CI que impidan integrar un cambio con OpenSpec, TypeScript, lint o build rotos. Antes de ampliar el CMS y sumar superficies editoriales, se necesita una puerta automatica y reproducible que mantenga `main` como unica fuente de produccion y convierta cada publicacion en un cambio revisable.

## What Changes

- Incorporar un workflow de GitHub Actions para pull requests y actualizaciones de `main` con instalacion reproducible y permisos minimos.
- Ejecutar como gates obligatorios `openspec validate --all --strict`, `pnpm exec tsc --noEmit`, `pnpm run lint` y `pnpm run build`.
- Validar el diff de cada pull request y usar configuracion de preview para impedir que contenido editorial no publicado se trate como produccion durante el build de CI.
- Fijar OpenSpec como dependencia de desarrollo para que CI use la misma version declarada por el proyecto en lugar de una instalacion global mutable.
- Sustituir la autorizacion global `dangerously-allow-all-builds` de Netlify por una allowlist versionada de dependencias con scripts de instalacion auditados.
- Documentar la configuracion externa requerida: `main` protegida, checks requeridos, Netlify Visual Editor publicando mediante pull request y produccion limitada a despliegues Git.
- Incorporar una plantilla breve de pull request con alcance OpenSpec, evidencia tecnica, preview y aprobaciones necesarias.
- Normalizar la configuracion, el roadmap y las tareas de los OpenSpecs activos para usar rama exclusiva, validacion humana final, commit de cierre y archive previo al merge.
- Mantener el merge, los permisos de rama y los cambios de configuracion externos como acciones separadas y verificables; el workflow no publica por si solo.

### Alcance

- GitHub Actions, scripts de calidad, dependencia OpenSpec, plantilla de pull request y runbook de protecciones Git/Netlify.
- Migracion metodologica unica de los artefactos OpenSpec activos, sin implementar sus funcionalidades.
- Verificacion local y en la rama de trabajo antes de solicitar habilitar reglas externas.

### Fuera de alcance

- Implementar el CMS, el menu mobile, Supabase, redes sociales o el runner local.
- Modificar contenido clinico o estados editoriales.
- Hacer merge a `main`, activar reglas remotas o desplegar produccion sin checkpoint y autorizacion explicita.
- Agregar suites de pruebas funcionales que pertenecen a cambios posteriores.

### Riesgos clinicos y operativos

- Un build de CI con contexto incorrecto puede exponer o validar como publico contenido aun no aprobado.
- Un check mal configurado puede permanecer pendiente y bloquear todos los merges.
- Proteger `main` antes de que el workflow exista en remoto puede impedir integrar la propia configuracion.
- Una dependencia o accion flotante puede cambiar comportamiento sin revision.

### Criterio de exito

Todo pull request hacia `main` ejecuta gates reproducibles y falla ante OpenSpec, tipos, lint, build o diff invalidos; el workflow opera con permisos de solo lectura y no contiene secretos. El equipo dispone de un procedimiento probado para configurar pull requests, proteccion de `main` y deploys Git-only sin permitir que el CMS o una herramienta automatica publique directamente.

## Capabilities

### New Capabilities

- `gates-ci-y-publicacion`: Validaciones automatizadas, evidencia de pull request y protecciones de Git/Netlify previas a cualquier publicacion.

### Modified Capabilities

Ninguna.

## Impact

- Codigo operativo: `.github/workflows`, `.github/pull_request_template.md`, `.gitignore`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` y `netlify.toml`.
- Documentacion: runbook de configuracion y recuperacion de branch protection, Visual Editor y despliegues Netlify.
- OpenSpec: reglas globales, roadmap y cierre manual de los seis cambios activos alineados con el flujo por rama.
- GitHub: checks requeridos y proteccion de `main` se configuraran solo despues de validar el workflow remoto.
- Netlify: rama editorial separada, publicacion mediante PR y opcion Git-only se verificaran como acciones externas posteriores al codigo.
- Dependencias: `@fission-ai/openspec` fijado como devDependency; no se agregan dependencias de runtime.
