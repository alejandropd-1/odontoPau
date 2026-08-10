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
| 0 | `blindar-ci-y-publicacion-protegida` | IN PROGRESS | Workflow remoto exitoso, PR obligatorio, `main` protegida y Netlify Git-only verificado |
| 1 | `crear-menu-movil-topbar` | READY | Navegacion accesible 320-767 px, preview aprobado y produccion verificada |
| 2 | CMS slice A: contratos y seguridad | PLANNED | Paridad JSON/TypeScript/CMS, round-trip sin perdida y defaults seguros |
| 3 | CMS slice B: articulos e instrucciones | PLANNED | Crear, editar y ampliar ambos tipos desde Visual Editor sin huecos |
| 4 | CMS slice C: tratamientos y casos | PLANNED | Tratamientos, profesionales y casos completos editables sin perdida |
| 5 | CMS slice D: portada e institucionales | PLANNED | Contenido cotidiano fuera del JSX y CMS probado por una persona autorizada |
| 6 | Piloto editorial de 2-3 ciclos | PLANNED | Flujo editar -> preview -> aprobar -> publicar medido y documentado |
| 7 | `preparar-redes-sociales-editoriales` | PARKED | CMS estable y articulos fuente publicados/aprobados |
| 8 | `dinamizar-dashboard-editorial-con-supabase` | PARKED / DECISION GATE | Implementar solo si el piloto demuestra necesidad de asignaciones, KPIs o auditoria operativa |
| 9 | `preparar-runner-editorial-lm-studio-link` | PARKED | Circuito estable, casos golden suficientes y retorno esperado justificado |

## Descomposicion del programa CMS

`hacer-sitio-autoadministrable-desde-cms` conserva la arquitectura y los requisitos globales, pero no se aplicara como un unico cambio de 94 tareas. Antes de cada etapa se creara un OpenSpec acotado de entre 10 y 20 tareas que tome solo el delta necesario:

1. `alinear-contratos-y-seguridad-cms`.
2. `completar-cms-articulos-instrucciones`.
3. `completar-cms-tratamientos-casos`.
4. `completar-cms-contenido-institucional`.

Cada slice reutilizara las specs del programa y evitara duplicar requisitos. El programa se cerrara cuando los cuatro slices y el piloto editorial esten terminados.

## Limites entre fuentes de verdad

| Preocupacion | Fuente de verdad |
|---|---|
| Contenido publico y estado de publicacion | JSON versionado en Git |
| Contrato y validacion del contenido | Schemas/validadores compartidos del repositorio |
| Experiencia de edicion | Netlify Visual Editor sobre Git CMS |
| Integracion y produccion | Pull request aprobado -> `main` -> Netlify |
| Operacion, responsables y KPIs futuros | Supabase, solo si se aprueba su gate |
| Derivados sociales | Paquetes trazables desde articulos publicados |
| Automatizacion local futura | Runner aislado que consume validadores compartidos y nunca publica |

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
