## 1. Precondiciones y línea base

- [ ] 1.1 Confirmar que el circuito editorial vigente fue publicado, aceptado, documentado y archivado antes de implementar el runner
- [ ] 1.2 Seleccionar un commit limpio como línea base y uno o más casos aprobados como resultados golden
- [ ] 1.3 Inventariar versiones de LM Studio, `lms`, Codex CLI, sistema operativo, GPU, VRAM/RAM y nombres de dispositivo en Ale-Book y la PC de escritorio
- [ ] 1.4 Documentar qué información clínica, consentimientos, credenciales y rutas quedan prohibidos para cualquier modelo o log

## 2. LM Link, modelos y contexto

- [ ] 2.1 Conectar ambos dispositivos a LM Link y verificar identidad, cifrado, health y recuperación después de una desconexión
- [ ] 2.2 Configurar la PC de escritorio como dispositivo preferido y comprobar que Ale-Book resuelve inferencia remota sin exponer filesystem remoto
- [ ] 2.3 Inventariar modelos y cuantizaciones disponibles, estimar memoria y medir carga, latencia y tokens por segundo con al menos 32.768 tokens efectivos
- [ ] 2.4 Comprobar mediante API/CLI el modelo, dispositivo y contexto realmente activos, rechazando perfiles cargados con menos de 32.768 tokens
- [ ] 2.5 Verificar por separado visión, tool use, `/v1/responses`, salida estructurada y adherencia al 50%, 80% y límite operativo del contexto
- [ ] 2.6 Investigar si `mcp/filesystem`, `mcp/playwright`, `js-code-sandbox` y `rag-v1` de LM Studio se exponen a Codex/API o requieren configuración del cliente
- [ ] 2.7 Seleccionar y versionar perfiles mínimos `writer`, `vision-intake`, `code-worker` y `qa-reviewer`, con criterios de descarte y fallback explícitos

## 3. Contrato y almacenamiento de trabajos

- [ ] 3.1 Crear `ops/editorial-runner` con documentación, schemas, plantillas, políticas, prompts y benchmarks versionados
- [ ] 3.2 Definir el schema de job con fuentes, activos, autorización no sensible, alcance, allowlists, entregables, checks y condiciones `STOP`
- [ ] 3.3 Definir schemas para estados, checkpoints, salida final y handoff auditable
- [ ] 3.4 Crear plantillas específicas para artículo, instrucción, derivados sociales, mantenimiento y QA de sólo lectura
- [ ] 3.5 Configurar un runtime `.local/editorial-jobs/<job-id>` ignorado por Git y verificar que no filtre rutas privadas ni datos sensibles
- [ ] 3.6 Implementar validación previa que bloquee asociaciones ambiguas, autorizaciones faltantes, rutas prohibidas o instrucciones de release

## 4. Runner aislado

- [ ] 4.1 Implementar el comando de preflight para verificar repo, commit base, perfil, LM Link, modelo, contexto, MCP y schemas
- [ ] 4.2 Implementar creación segura de rama `local-worker/<job-id>` y worktree fuera del checkout principal
- [ ] 4.3 Implementar la invocación no interactiva de Codex CLI con proveedor LM Studio, modelo, perfil, sandbox `workspace-write`, schema y presupuesto fijados
- [ ] 4.4 Configurar filesystem, Playwright, sandbox JavaScript y RAG con mínimo privilegio y allowlists portables
- [ ] 4.5 Implementar locks, checkpoints, estados terminales y reanudación sin repetir pasos mutables
- [ ] 4.6 Implementar inspección y limpieza recuperable limitada a las rutas resueltas de cada job
- [ ] 4.7 Comprobar que el runner no dispone de credenciales ni comandos para push, merge, `main`, Netlify, CMS o redes sociales

## 5. Pipeline determinista

- [ ] 5.1 Implementar inventario, hashes, normalización de nombres y validación de dimensiones/metadatos de activos mediante scripts
- [ ] 5.2 Implementar optimización de imágenes y generación de manifiestos sin delegar operaciones binarias al modelo
- [ ] 5.3 Implementar validadores de JSON, slugs, tratamientos, estados editoriales, rutas públicas, alt text y frases clínicas prohibidas
- [ ] 5.4 Encapsular `pnpm exec tsc --noEmit`, `pnpm run lint`, `pnpm run build` y checks OpenSpec con captura real de exit codes
- [ ] 5.5 Implementar reporte de archivos modificados, diff, comandos, exit codes, modelo, contexto, dispositivo y checkpoints sin incluir secretos

## 6. QA, seguridad y casos golden

- [ ] 6.1 Preparar fixtures golden de casos aprobados con entradas, salidas esperadas y tolerancias documentadas
- [ ] 6.2 Ejecutar replay por perfil y comparar asociación de imágenes, afirmaciones, estructura, archivos tocados y resultado visual
- [ ] 6.3 Implementar un reviewer independiente con acceso de sólo lectura al producto y capacidad de marcar `needs-review`, `blocked` o `failed`
- [ ] 6.4 Verificar responsive, accesibilidad, metadata, sitemap, enlaces, consola y capturas mediante Playwright en el perfil de QA
- [ ] 6.5 Probar prompt injection desde archivos, HTML, metadata de imágenes y resultados MCP, comprobando que no amplíe permisos ni alcance
- [ ] 6.6 Probar caída de LM Link, cambio inesperado de modelo/contexto, job concurrente, timeout y recuperación de worktree

## 7. Piloto supervisado y adopción

- [ ] 7.1 Ejecutar un dry run completo sobre un caso golden sin material clínico nuevo y sin producir commit de release
- [ ] 7.2 Revisar el handoff y el diff con Codex principal, Alejandro y el responsable clínico cuando corresponda
- [ ] 7.3 Ajustar perfiles, prompts, schemas y políticas únicamente a partir de fallos reproducibles del piloto
- [ ] 7.4 Aprobar explícitamente qué tipos de job puede ejecutar cada perfil y cuáles permanecen manuales
- [ ] 7.5 Documentar la rutina operativa, diagnóstico, actualización de modelos, rollback y revisión periódica
- [ ] 7.6 Evaluar después del piloto si hace falta un runner residente en la PC de escritorio o si la inferencia remota cubre el objetivo

## 8. Validación y gate de habilitación

- [ ] 8.1 Ejecutar `openspec validate preparar-runner-editorial-lm-studio-link --strict`
- [ ] 8.2 Ejecutar `pnpm exec tsc --noEmit`, `pnpm run lint` y `pnpm run build`
- [ ] 8.3 Auditar que configuraciones, logs, fixtures y commits no contengan secretos, datos sensibles ni rutas privadas absolutas
- [ ] 8.4 Confirmar que ningún job puede cambiar estados a `published`, hacer push, merge, deploy o publicar en redes
- [ ] 8.5 Obtener aprobación explícita antes de habilitar el runner para preparar el primer borrador real

## 9. Cierre por OpenSpec

- [ ] 9.1 Preparar commit y push selectivos en `change/preparar-runner-editorial-lm-studio-link`, abrir un Draft PR y adjuntar el reporte del piloto, los checks y la demostración equivalente a preview sin habilitar producción.
- [ ] 9.2 Alejandro revisa el diff, el reporte del piloto, los límites de seguridad y la demostración final, y autoriza el commit de cierre y el OpenSpec Archive. Esta tarea es exclusivamente manual y ningún agente puede marcarla.
