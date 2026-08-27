# Roadmap de ejecucion OpenSpec

## Regla operativa

- Mantener un solo cambio en `apply` a la vez.
- Trabajar cada cambio implementable en una rama exclusiva `change/<id-exacto-del-openspec>` creada desde `main` sincronizada.
- No comenzar el siguiente cambio hasta completar validacion, preview, aprobacion manual de Alejandro, commit de cierre, archive y segundo commit, merge autorizado y verificacion de produccion del anterior.
- Los cambios marcados como `PARKED` conservan su plan, pero no consumen trabajo ni modifican el producto hasta superar su gate de entrada.
- Los cambios de contenido clinico requieren aprobacion de Paula; merge y produccion requieren aprobacion del responsable del sitio.
- Ningun agente puede marcar el ultimo checkbox de validacion humana ni archivar un cambio con tareas pendientes.
- El archive ocurre en la misma rama antes del merge; la verificacion postproduccion se registra en el pull request o reporte de release y no reabre el OpenSpec.

## Cola priorizada

| Orden | Cambio | Estado operativo | Gate de salida o entrada |
|---|---|---|---|
| 0 | `blindar-ci-y-publicacion-protegida` | DONE | Publicado y archivado el 2026-08-10 |
| 1 | `crear-menu-movil-topbar` | DONE | Publicado y archivado el 2026-08-11 |
| 2 | `alinear-contratos-y-seguridad-cms` | DONE | Archivado y publicado el 2026-08-11; contrato neutral de 188 rutas y gates reproducibles |
| 3 | `adoptar-tina-y-completar-cms-articulos-instrucciones` | DONE | Publicado y archivado el 2026-08-21; Tina edita Inicio, Tratamientos, casos, Artículos e Instrucciones desde `editorial/tina` |
| 4 | CMS Tina slice C: tratamientos y casos | ABSORBED BY 3 | Incorporado explícitamente al cambio activo mediante tareas 4.5–4.13; no crear un change duplicado |
| 5 | CMS Tina slice D: portada e institucionales | ABSORBED BY 3 | Inicio e índice de Tratamientos incorporados al cambio activo; la configuración global del sitio seguirá en un OpenSpec posterior |
| 6 | `pilotear-circuito-editorial-tina` | DONE | Bootstrap aprobado, archivado, integrado mediante PR #13 y publicado el 2026-08-21 |
| 6.1 | `validar-operacion-editorial-tina-en-produccion` | DONE | Tres ciclos reales completados; archivado, integrado mediante PR #24 y producción verificada el 2026-08-27 |
| 6.2 | `operativizar-dashboard-editorial-por-contenido` | PLANNED / ENTRY GATE | Después de cerrar 6.1, absorber la interfaz útil del dashboard histórico dentro del Panel editorial de `/admin`; mostrar por fila estado, bloqueos, vista previa y acción editorial, manteniendo una única tanda aprobada |
| 7 | `preparar-redes-sociales-editoriales` | PARKED | CMS estable y articulos fuente publicados/aprobados |
| 8 | `dinamizar-dashboard-editorial-con-supabase` | PARKED / DECISION GATE | Implementar solo si el piloto demuestra necesidad de asignaciones, KPIs o auditoria operativa |
| 9 | `preparar-runner-editorial-lm-studio-link` | PARKED | Circuito estable, casos golden suficientes y retorno esperado justificado |

## Descomposicion del programa CMS

`hacer-sitio-autoadministrable-desde-cms` fue retirado sin implementar el 2026-08-12 y archivado como referencia histórica del programa. Sus 96 tareas quedaron deliberadamente sin marcar y sus delta specs no se sincronizaron, porque sus decisiones específicas de Stackbit/Netlify Visual Editor fueron reemplazadas por la adopción incremental de TinaCMS. Antes de cada etapa se creará un OpenSpec acotado que tome solo el delta necesario:

1. `alinear-contratos-y-seguridad-cms`.
2. `adoptar-tina-y-completar-cms-articulos-instrucciones`.
3. Tratamientos, casos, Inicio e índice absorbidos de forma explícita por `adoptar-tina-y-completar-cms-articulos-instrucciones`.
4. Futuro slice acotado de configuración global del sitio: navegación, contacto, mapa y relaciones automáticas entre contenidos.
5. `pilotear-circuito-editorial-tina` para instalar y validar el bootstrap estructural.
6. `validar-operacion-editorial-tina-en-produccion` para ejecutar los dos ciclos reales después de integrar el workflow, antes de automatizarlo en GitCron o delegar trabajo a modelos locales.
7. `operativizar-dashboard-editorial-por-contenido` para trasladar las funciones útiles de la interfaz histórica de `/editorial` al Panel editorial de Tina dentro de `/admin`, conectarlas al circuito ya validado y presentar cada contenido como una fila operable, sin crear un segundo dashboard.

Cada slice reutilizara las specs del programa y evitara duplicar requisitos. El programa se cerrara cuando los cuatro slices y el piloto editorial esten terminados.

## Limites entre fuentes de verdad

| Preocupacion | Fuente de verdad |
|---|---|
| Contenido publico y estado de publicacion | JSON versionado en Git |
| Contrato y validacion del contenido | Schemas/validadores compartidos del repositorio |
| Experiencia de edicion | `/admin` como entrada única a TinaCMS y a su Panel editorial custom sobre JSON + Git, con un proyecto independiente por sitio |
| Integracion y produccion | Tina guarda en rama no productiva y actualiza Preview -> el panel solicita publicar -> PR/CI técnico oculto al usuario -> `main` aprobado -> Netlify |
| Operacion, responsables y KPIs futuros | Supabase, solo si se aprueba su gate |
| Derivados sociales | Paquetes trazables desde articulos publicados |
| Automatizacion local futura | Runner aislado que consume validadores compartidos y nunca publica |

TinaCloud administra autenticación y edición, pero no reemplaza las puertas Git. El programa inicial debe funcionar sin Editorial Workflow pago: ninguna escritura remota puede apuntar a `main`, y el PR, las aprobaciones y el merge continúan bajo GitCron/GitHub.

## Decisión de producto para el dashboard por contenido

El dashboard final vivirá como pantalla personalizada de Tina dentro de `/admin`. Tomará las funciones útiles de la interfaz histórica de `/editorial`, pero no conservará dos paneles que compitan entre sí. Al completar la migración, la ruta independiente `/editorial` deberá eliminarse o redirigirse a `/admin`, según la alternativa que preserve mejor seguridad y enlaces internos. Cada fila deberá mostrar, con lenguaje cotidiano:

- título, tipo y categoría del contenido;
- estado editorial y estado público;
- si está listo para publicar o retirar;
- qué aprobación, validación o corrección falta cuando esté bloqueado;
- enlaces para editar y revisar la vista previa;
- la acción editorial aplicable, sin exponer PR, CI, SHA, merge ni Netlify.

La unidad de despliegue seguirá siendo la tanda completa aprobada en Preview. Una fila podrá quedar lista, bloqueada o retirada y podrá cambiar su estado editorial, pero el botón final promoverá el snapshot aprobado completo. Publicar una sola fila de manera aislada exigiría una rama, request y despliegue independiente por pieza; no se incorporará salvo que un OpenSpec futuro demuestre una necesidad real que justifique ese costo.

Supabase no es requisito para esta experiencia. El cambio 6.2 debe funcionar primero con Tina + JSON + Git como fuentes canónicas. El cambio 8 seguirá estacionado y sólo se habilitará si hacen falta colaboración avanzada, responsables, KPIs o auditoría operativa persistente.

La URL y la rama cumplen funciones diferentes: `/admin` es la dirección que usa la persona; `editorial/tina` es la rama Git no productiva que alimenta Preview y evita que **Save** modifique producción. El nombre de la rama no crea ni requiere una ruta `/editorial`.

## Definicion de terminado por slice

1. Rama exclusiva `change/<id-exacto-del-openspec>` creada desde `main` sincronizada.
2. OpenSpec estricto valido y alcance revisado sin archivos ajenos.
3. TypeScript, lint, build y pruebas especificas exitosas.
4. Revision responsive y accesible cuando exista interfaz.
5. Draft PR y Deploy Preview verificados.
6. Aprobacion de Paula cuando corresponda contenido clinico.
7. Ultimo checkbox marcado manualmente por Alejandro sobre la evidencia final.
8. Commit de cierre con la implementacion y la validacion registradas.
9. OpenSpec Archive y segundo commit de archive en la misma rama y PR.
10. Merge a `main` explicitamente autorizado.
11. Produccion verificada y evidencia registrada fuera del OpenSpec ya archivado.
