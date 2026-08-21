## 1. Línea base y contrato actualizado

- [x] 1.1 Registrar rama, commit base, estado del árbol, convergencia inicial de `main` y `editorial/tina`, y cierre publicado del OpenSpec anterior.
- [x] 1.2 Actualizar roadmap, propuesta, diseño y specs para el flujo Tina Free `Guardar -> Preview -> Publicar/Retirar -> Producción` accesible a todos los colaboradores.
- [x] 1.3 Versionar la clasificación `editorial-routine` / `structural-change`, la allowlist y las condiciones de detención.
- [x] 1.4 Crear el preflight breve y la plantilla de evidencia sin secretos, datos de pacientes ni logs verdes completos.

## 2. Estados y solicitud editorial

- [x] 2.1 Agregar `retired` a los contratos, validadores, etiquetas y campos Tina de artículos e instrucciones, conservando que sólo `published` renderiza en producción.
- [x] 2.2 Crear el singleton interno de solicitud de publicación con request único, estado pendiente/procesado y metadata mínima no sensible.
- [x] 2.3 Agregar la colección Tina singleton, valores iniciales y una acción de panel que genere solicitudes idempotentes.
- [x] 2.4 Extender las pruebas de contratos, runtime, round-trip y reglas editoriales para `retired`; preservar el fixture histórico de 188 rutas y validar la solicitud en un gate incremental separado.

## 3. Experiencia de publicación en Tina

- [x] 3.1 Actualizar el panel editorial para explicar que `Save` actualiza Preview y no producción.
- [x] 3.2 Mostrar un enlace configurable al Preview y un control explícito `Publicar cambios` disponible para cualquier colaborador autorizado.
- [x] 3.3 Mostrar estado pendiente, procesando, publicado o fallido y advertir que la acción promueve el snapshot completo.
- [x] 3.4 Facilitar `Publicado` / `Retirado` desde los documentos sin duplicar campos ni permitir borrados accidentales.
- [x] 3.5 Validar accesibilidad básica, estados ocupados, errores y comportamiento responsive del panel.

## 4. Automatización segura de producción

- [x] 4.1 Implementar un validador determinista del request, request idempotente, ancestro de ramas y allowlist editorial.
- [x] 4.2 Agregar un workflow que se active sólo ante una nueva solicitud en `editorial/tina`, ejecute los gates vigentes y conserve producción ante cualquier fallo.
- [x] 4.3 Crear o actualizar un PR técnico, mezclarlo automáticamente después de gates verdes y evitar PR o deploy duplicados.
- [x] 4.4 Consumir la solicitud, registrar resultado mínimo y sincronizar `editorial/tina` por fast-forward con el `main` publicado.
- [x] 4.5 Documentar el permiso externo requerido para `GITHUB_TOKEN` y el fallback manual sin exponer credenciales al CMS.

## 5. Rutina y bootstrap transferible

- [x] 5.1 Redactar una guía breve para usuarios no técnicos: editar, guardar, abrir Preview, publicar, retirar y reconocer errores.
- [x] 5.2 Reconstruir como línea base el ciclo de PR #12 y el fallo por schema remoto desactualizado, sin copiar logs completos.
- [x] 5.3 Con autorización previa, abrir Draft PR y comprobar que una guarda ordinaria actualiza Preview sin modificar producción.
- [x] 5.4 Registrar la dependencia de bootstrap que impide ejecutar ciclos reales antes de que el workflow exista en `main`, sin relajar la allowlist ni copiar código a `editorial/tina`.
- [x] 5.5 Trasladar explícitamente la actualización visible y el retiro o republicación reales al sucesor obligatorio `validar-operacion-editorial-tina-en-produccion`.
- [x] 5.6 Consolidar la evidencia, excepciones y configuración reusable en un handoff de bootstrap para OdontoPia y GitCron.

## 6. Validación y gate humano

- [x] 6.1 Ejecutar `openspec validate pilotear-circuito-editorial-tina --strict`, `git diff --check` y tests específicos del request/workflow.
- [x] 6.2 Ejecutar `validate:tina-content`, `validate:tina-lock`, contratos CMS, reglas editoriales y round-trip aplicable.
- [x] 6.3 Ejecutar TypeScript, lint y build una sola vez localmente antes del Draft PR; después confiar en CI sobre el mismo commit salvo fallo o diferencia de entorno.
- [x] 6.4 Auditar que dashboard, workflow y documentación no expongan secretos, rutas privadas, datos identificatorios ni evidencia clínica privada.
- [x] 6.5 Alejandro configura o confirma únicamente los permisos externos imprescindibles y autoriza la prueba en Preview; ningún agente modifica Netlify o GitHub antes de esa autorización.
- [ ] 6.6 Alejandro revisa el bootstrap, marca este checkbox y autoriza el commit de cierre y OpenSpec Archive. Esta tarea es exclusivamente manual y ningún agente puede marcarla.
