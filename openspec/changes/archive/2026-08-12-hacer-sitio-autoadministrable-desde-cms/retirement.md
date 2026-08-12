# Retiro del cambio

```yaml
schemaVersion: 1
closureKind: retired
disposition: superseded
retiredAt: 2026-08-12
replacementChange: adoptar-tina-y-completar-cms-articulos-instrucciones
specSync: skipped
implementationState: none
completedTasks: 0
totalTasks: 96
sourceBranch: change/adoptar-tina-y-completar-cms-articulos-instrucciones
sourceHead: 706e88f7a50836b70d36ba6ab655b54a93202681
confirmedBy: Alejandro
```

## Motivo

El cambio proponia completar el sitio autoadministrable mediante Stackbit/Netlify Visual Editor. Antes de iniciar sus tareas se decidio adoptar TinaCMS como interfaz editorial, manteniendo JSON + Git como fuente canonica, Netlify como hosting y GitCron/GitHub como puerta de revision y publicacion.

La nueva direccion se implementa incrementalmente mediante `adoptar-tina-y-completar-cms-articulos-instrucciones` y slices posteriores para tratamientos, casos clinicos, portada y contenido institucional. Esto vuelve obsoletas las decisiones de proveedor y la ejecucion monolitica de 96 tareas del cambio retirado.

## Estado de implementacion

- No se implemento ninguna de las 96 tareas de este cambio.
- Las tareas permanecen sin marcar para no presentar el retiro como trabajo completado.
- No se revierte ni elimina funcionalidad del sitio.
- La base contractual neutral realizada en `alinear-contratos-y-seguridad-cms` se conserva y es reutilizada por TinaCMS.

## Delta specs

El retiro omite deliberadamente la sincronizacion de delta specs. Aplicarlas incorporaria requisitos obsoletos de Stackbit/Netlify Visual Editor y entraria en conflicto con el adaptador Tina vigente.

Comando autorizado para el cierre:

```text
openspec archive hacer-sitio-autoadministrable-desde-cms --yes --skip-specs
```

## Consecuencias

- Este registro es historico y no debe aparecer como cambio completado ni como trabajo activo.
- El OpenSpec de reemplazo es la fuente vigente para Articulos e Instrucciones.
- Los alcances restantes se definiran en OpenSpecs Tina acotados, siguiendo el orden del roadmap.
- El retiro no implica commit, push, merge, deploy ni borrado de ramas.
