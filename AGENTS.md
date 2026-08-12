# Instrucciones de trabajo para agentes

Estas instrucciones son obligatorias para cualquier agente que trabaje en este repositorio, incluyendo Codex, Claude y Antigravity. Ante una contradiccion, prevalece una instruccion explicita y reciente de Alejandro.

## Fuente de verdad

- Leer este archivo antes de modificar el repositorio.
- Leer `openspec/ROADMAP-EJECUCION.md` para conocer el orden vigente del programa.
- Leer completos los artefactos del OpenSpec activo antes de implementar.
- No asumir que la memoria, el chat o las instrucciones privadas de otro agente estan disponibles.
- Si el codigo, el OpenSpec y una descripcion externa difieren, detenerse, mostrar la diferencia y pedir una decision.

## Circuito obligatorio de OpenSpec

1. Sincronizar `main` y confirmar que el arbol de trabajo no contiene cambios ajenos.
2. Crear o usar una rama exclusiva `change/<id-exacto-del-openspec>` desde `main` sincronizada.
3. Implementar un solo OpenSpec a la vez. No mezclar archivos ni tareas de otros cambios.
4. Mantener `proposal.md`, `design.md`, las specs y `tasks.md` alineados con el alcance real.
5. Ejecutar las validaciones automaticas previstas por el cambio y registrar evidencia verificable.
6. Publicar la rama en un Draft PR para ejecutar CI y obtener un Deploy Preview cuando corresponda.
7. Detenerse en el ultimo item de validacion humana. Ningun agente puede marcarlo.
8. Paula debe aprobar primero cualquier contenido clinico o imagen clinica. Alejandro realiza la inspeccion final, marca el ultimo checkbox y autoriza la preparacion del merge.
9. Despues de la aprobacion humana, crear un commit de cierre que incluya implementacion, pruebas y el checkbox marcado por Alejandro.
10. Ejecutar OpenSpec Archive en la misma rama. No archivar si existen tareas incompletas.
11. Crear un segundo commit que contenga solamente el archive y la sincronizacion de specs.
12. Mezclar a `main` unicamente con autorizacion explicita de Alejandro.
13. Verificar produccion despues del merge y registrar la evidencia en el PR o reporte de release, sin reabrir el OpenSpec archivado solo para ese registro.

### Retiro excepcional de cambios obsoletos

- Un cambio activo no implementado que haya quedado obsoleto, duplicado o reemplazado no debe archivarse como si estuviera completado ni sincronizar sus delta specs.
- El retiro requiere autorizacion explicita de Alejandro, las tareas pendientes deben conservarse sin marcar y el cambio debe incluir un `retirement.md` con motivo, estado de implementacion, reemplazo y consecuencias.
- En ese caso excepcional se usa `openspec archive <id> --yes --skip-specs`. El historial debe distinguirlo permanentemente de un cambio completado.
- Este retiro no autoriza commit, push, merge, deploy, borrado de ramas ni cambios de producto. Esas acciones conservan sus autorizaciones habituales.

## Seguridad Git y publicacion

- Preparar archivos de manera selectiva. Nunca usar `git add .` ni `git add -A`.
- No borrar, resetear, sobrescribir ni limpiar cambios ajenos.
- No hacer push, merge, archive o despliegue a produccion sin la autorizacion exigida por el circuito.
- No versionar secretos, credenciales, datos de pacientes ni documentos privados de consentimiento.
- `main` publica automaticamente el sitio. Tratar todo merge a `main` como una publicacion, salvo que el commit o PR use deliberadamente el mecanismo oficial de Netlify para omitir el deploy.

## Revisiones y pausas obligatorias

- Una auditoria o relevamiento es de solo lectura salvo autorizacion expresa para implementar.
- Informar con claridad el alcance, los archivos tocados, las validaciones y cualquier limitacion.
- Si una comprobacion visual, clinica, de seguridad o de producto depende de Alejandro o Paula, detenerse y dejarla pendiente; no simular su aprobacion.
- La compilacion correcta no sustituye la revision visual, clinica ni la comprobacion en produccion.

## Contenido y CMS

- Un campo editorial opcional sin contenido no debe renderizarse ni reservar espacio en la maqueta.
- Mantener fuera de produccion los estados editoriales de borrador o revision.
- Las imagenes deben tener texto alternativo adecuado; el material clinico requiere consentimiento verificable y aprobacion humana.
- No exponer paneles administrativos, tokens o datos internos mediante el sitio publico.
