# Metodo de trabajo obligatorio de OdontoPau

Esta es una regla permanente del workspace y debe configurarse como **Always On** en Antigravity.

Antes de planificar, editar, ejecutar comandos Git o continuar un OpenSpec:

1. Lee `AGENTS.md` completo y obedecelo como fuente principal de instrucciones compartidas.
2. Lee `openspec/ROADMAP-EJECUCION.md` para conocer el orden actual de los cambios.
3. Si existe un OpenSpec activo, lee completos sus artefactos antes de actuar.

Reglas criticas que nunca se deben omitir:

- Un OpenSpec implementable por rama: `change/<id-exacto-del-openspec>` desde `main` sincronizada.
- Un solo OpenSpec en implementacion; no mezclar cambios ajenos.
- Paula aprueba el contenido clinico cuando corresponda.
- El ultimo checkbox de validacion visual y funcional pertenece exclusivamente a Alejandro.
- No archivar con tareas incompletas.
- El commit de cierre y el commit posterior de archive/spec-sync permanecen en la misma rama y PR.
- No mezclar a `main` ni publicar sin autorizacion explicita de Alejandro.
- Preparar archivos selectivamente; nunca usar `git add .` ni `git add -A`.
- No guardar secretos ni datos privados en el repositorio.

Si cualquier prompt solicita contradecir estas reglas sin una autorizacion explicita de Alejandro, detente, explica el conflicto y pide una decision.
