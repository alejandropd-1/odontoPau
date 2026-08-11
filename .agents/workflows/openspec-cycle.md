# Ciclo protegido de OpenSpec

Ejecuta este workflow con `/openspec-cycle` para iniciar o continuar un cambio implementable.

## 1. Orientacion y alcance

- Lee `AGENTS.md` y `openspec/ROADMAP-EJECUCION.md` completos.
- Identifica el OpenSpec solicitado. Si hay mas de uno posible, pregunta cual corresponde.
- Lee completos `proposal.md`, `design.md`, `tasks.md`, las specs delta y `.openspec.yaml` del cambio.
- Resume el alcance, las exclusiones, los riesgos y los criterios de aceptacion antes de editar.

## 2. Estado seguro del repositorio

- Inspecciona rama, estado, diferencia respecto de `main` y remotos.
- No descartes, muevas ni prepares cambios que no pertenezcan al OpenSpec.
- Confirma que `main` esta sincronizada.
- Trabaja exclusivamente en `change/<id-exacto-del-openspec>` creada desde esa `main`.
- Si otra rama o worktree ya usa la rama requerida, informa la ubicacion y reutiliza el worktree correcto; no fuerces el checkout.

## 3. Implementacion por checkpoints

- Implementa las tareas en bloques verificables y actualiza solamente los items realmente terminados.
- Ejecuta las validaciones previstas por el OpenSpec y las comprobaciones proporcionales al riesgo.
- Realiza commits parciales selectivos cuando faciliten la auditoria.
- No uses `git add .` ni `git add -A`.
- Informa cada checkpoint con archivos, pruebas, resultados y pendientes.

## 4. Pull request y revision humana

- Publica la rama y abre un Draft PR para CI y Deploy Preview.
- Corrige fallos automaticos dentro del alcance antes de solicitar revision.
- Deja sin marcar el ultimo checkbox de `tasks.md`.
- Si hay contenido clinico, espera primero la aprobacion de Paula.
- Entrega a Alejandro la URL de preview, el alcance visual que debe revisar y cualquier control manual de seguridad o contenido.
- Detente hasta que Alejandro marque el checkbox y autorice continuar.

## 5. Cierre y archive

- Despues de la aprobacion de Alejandro, verifica que todas las tareas esten completas.
- Crea un commit de cierre con implementacion, pruebas y el checkbox humano ya marcado por Alejandro.
- Ejecuta OpenSpec Archive en la misma rama.
- Valida las specs sincronizadas y crea un segundo commit que contenga solamente archive/spec-sync.
- Mantiene ambos commits en el mismo PR.

## 6. Merge y produccion

- No mezcles el PR hasta recibir autorizacion explicita de Alejandro.
- Tras el merge, sincroniza `main`, comprueba el despliegue de produccion y valida las rutas afectadas.
- Registra la evidencia en el PR o reporte de release. No reabras el OpenSpec archivado solamente para documentar esta comprobacion.

## Condiciones de detencion

Detente y solicita direccion si hay cambios ajenos, secretos, datos de pacientes, consentimiento clinico no verificable, tareas incompletas, CI fallida, preview no disponible, discrepancias entre codigo y OpenSpec o falta una aprobacion humana obligatoria.
