# Evidencia de ciclos editoriales

## Actualización visible

Fecha de comprobación humana: 2026-08-24.

- Documento editado desde Tina: `src/data/home.json`.
- Campo: `location.description`.
- Acción ejecutada por Alejandro: `Save`, sin solicitar publicación.
- Preview compartible: mostró `equipado con tecnología de vanguardia`.
- Producción: conservó `equipado con la mejor tecnología`.
- Evidencia visual: captura aportada por Alejandro sobre el branch deploy `editorial-tina--paulagualtieri.netlify.app`.

Resultado: `Save` y Preview funcionan de forma independiente de producción. Todavía no se activó `Publicar cambios`.

## Defectos observados

- El `Panel editorial` fullscreen no permitía desplazamiento vertical porque su contenido usaba una altura mínima basada en el viewport dentro de un contenedor Tina sin scroll. Se clasificó como defecto del bootstrap y se ajustó el contenedor para usar la altura disponible con scroll propio; requiere comprobación visual después de desplegar la corrección.
- El primer intento de `Publicar cambios` se detuvo antes de crear el request con `requestId no es válido`. Producción no cambió. La causa fue que Tina GraphQL representa campos opcionales vacíos como `null`, mientras el contrato persistido usa ausencia de campo. Se normalizó esa frontera antes de validar o crear transiciones y se agregó una regresión con la forma real devuelta por Tina.
- La repetición desde el Deploy Preview técnico del PR creó el request en `change/validar-operacion-editorial-tina-en-produccion`, no en `editorial/tina`; por diseño el workflow no lo procesó y producción permaneció sin cambios. Se devolvió ese request aislado a `idle` y se limitó la acción de publicación a la rama operativa `editorial/tina`, dejando los previews técnicos sólo para revisión de interfaz.
