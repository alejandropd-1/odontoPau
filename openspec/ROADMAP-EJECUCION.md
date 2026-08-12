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
| 3 | `adoptar-tina-y-completar-cms-articulos-instrucciones` | READY FOR IMPLEMENTATION | Tina operativa en rama no productiva; Artículos e Instrucciones editables sin pérdida y sin depender del workflow pago |
| 4 | CMS Tina slice C: tratamientos y casos | PLANNED | Tratamientos, profesionales y casos completos editables sin pérdida |
| 5 | CMS Tina slice D: portada e institucionales | PLANNED | Contenido cotidiano fuera del JSX y CMS probado por una persona autorizada |
| 6 | Piloto editorial de 2-3 ciclos | PLANNED | Flujo editar -> preview -> aprobar -> publicar medido y documentado |
| 7 | `preparar-redes-sociales-editoriales` | PARKED | CMS estable y articulos fuente publicados/aprobados |
| 8 | `dinamizar-dashboard-editorial-con-supabase` | PARKED / DECISION GATE | Implementar solo si el piloto demuestra necesidad de asignaciones, KPIs o auditoria operativa |
| 9 | `preparar-runner-editorial-lm-studio-link` | PARKED | Circuito estable, casos golden suficientes y retorno esperado justificado |

## Descomposicion del programa CMS

`hacer-sitio-autoadministrable-desde-cms` fue retirado sin implementar el 2026-08-12 y archivado como referencia histórica del programa. Sus 96 tareas quedaron deliberadamente sin marcar y sus delta specs no se sincronizaron, porque sus decisiones específicas de Stackbit/Netlify Visual Editor fueron reemplazadas por la adopción incremental de TinaCMS. Antes de cada etapa se creará un OpenSpec acotado que tome solo el delta necesario:

1. `alinear-contratos-y-seguridad-cms`.
2. `adoptar-tina-y-completar-cms-articulos-instrucciones`.
3. Futuro slice Tina de tratamientos y casos.
4. Futuro slice Tina de contenido institucional.

Cada slice reutilizara las specs del programa y evitara duplicar requisitos. El programa se cerrara cuando los cuatro slices y el piloto editorial esten terminados.

## Limites entre fuentes de verdad

| Preocupacion | Fuente de verdad |
|---|---|
| Contenido publico y estado de publicacion | JSON versionado en Git |
| Contrato y validacion del contenido | Schemas/validadores compartidos del repositorio |
| Experiencia de edicion | TinaCMS custom sobre JSON + Git, con un proyecto independiente por sitio |
| Integracion y produccion | Tina escribe rama no productiva -> Draft PR/CI/preview en GitCron/GitHub -> `main` aprobado -> Netlify |
| Operacion, responsables y KPIs futuros | Supabase, solo si se aprueba su gate |
| Derivados sociales | Paquetes trazables desde articulos publicados |
| Automatizacion local futura | Runner aislado que consume validadores compartidos y nunca publica |

TinaCloud administra autenticación y edición, pero no reemplaza las puertas Git. El programa inicial debe funcionar sin Editorial Workflow pago: ninguna escritura remota puede apuntar a `main`, y el PR, las aprobaciones y el merge continúan bajo GitCron/GitHub.

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
