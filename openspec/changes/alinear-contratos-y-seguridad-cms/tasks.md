## 1. Linea base e inventario

- [x] 1.1 Registrar rama `change/alinear-contratos-y-seguridad-cms`, SHA base de `main`, estado limpio y versiones de Node, pnpm, OpenSpec y dependencias Stackbit sin modificar archivos operativos ajenos.
- [x] 1.2 Inventariar `HomePage`, `GlobalSettings`, `Articulo`, `Instruccion`, `Tratamiento`, `CasoClinico` y objetos reutilizables en JSON, tipos/validadores runtime, modelos Stackbit y renderizadores.
- [x] 1.3 Crear una matriz versionada campo por campo y una fotografia normalizada del registro Stackbit base, con ruta, forma, tipo, obligatoriedad, constante/discriminante, origen, condicion editorial y estado `safe`, `blocked` o `pending`.
- [x] 1.4 Demostrar en el reporte inicial los desfases reales, incluido `CasoClinico`, asignar cada pendiente al slice B, C o D y detenerse para el primer checkpoint de auditoria de Codex.

## 2. Registro CMS y contrato inspeccionable

- [x] 2.1 Extraer las definiciones de modelos desde `stackbit.config.ts` a un adaptador Stackbit TypeScript importable, preservando configuracion, orden, nombres, labels, tipos, constantes, rutas y opciones vigentes.
- [x] 2.2 Implementar un manifest runtime neutral para las 188 rutas inventariadas, incluidos campos persistidos, objetos anidados, listas y uniones discriminadas, sin tratar interfaces TypeScript borradas como evidencia ejecutable.
- [x] 2.3 Representar defaults seguros `draft` sin `publishedAt`, revisor ni aprobacion, y dejar `pending` cualquier modelo cuya API no permita declararlos sin habilitar autoria nueva.
- [x] 2.4 Agregar una prueba de equivalencia normalizada ejecutable con dependencias y comando reproducibles que impida cambios incidentales en la configuracion Stackbit durante la extraccion.
- [x] 2.5 Separar explicitamente manifest neutral y adaptador Stackbit, documentando que TinaCMS y otros proveedores quedan fuera de este cambio y requeriran su propia prueba de paridad.

## 3. Paridad, fixtures y round-trip

- [x] 3.1 Implementar el comparador estructural recursivo entre campos observados, manifest runtime neutral y adaptador Stackbit, con errores de modelo, ruta, capa, proveedor y forma esperada/observada.
- [x] 3.2 Cubrir todos los JSON editoriales vigentes y fixtures sinteticos no clinicos para campos opcionales, objetos, listas y discriminantes no presentes en muestras reales.
- [x] 3.3 Implementar round-trip semantico sobre copias en memoria, conservando valores y orden de listas, y fallar ante cualquier mutacion de archivos bajo `src/data`.
- [x] 3.4 Generar una salida determinista que clasifique cada modelo `safe`, `blocked` o `pending`, distinga bloqueos de pendientes deliberados y reproduzca el mismo resultado sobre la misma revision.

## 4. Gate y documentacion operativa

- [x] 4.1 Agregar `pnpm run validate:cms-contracts` para ejecutar inventario, paridad, round-trip y no mutacion sin red, secretos ni servicios externos.
- [x] 4.2 Incorporar el comando a `.github/workflows/quality-gates.yml` antes de TypeScript, lint y build, usando las versiones y permisos restringidos existentes.
- [x] 4.3 Documentar alcance medido, limitaciones frente a una sesion real de Netlify, modelos bloqueados, owner/slice de resolucion y prohibicion de habilitar escritura por el solo resultado local.

## 5. QA, auditoria y preview

- [x] 5.1 Ejecutar las pruebas especificas y `openspec validate alinear-contratos-y-seguridad-cms --strict`, conservando evidencia de comandos, cobertura y casos negativos.
- [x] 5.2 Ejecutar `pnpm exec tsc --noEmit --incremental false`, `pnpm run lint`, `pnpm run build` y `git diff --check`, confirmando que `src/data` no tenga cambios.
- [x] 5.3 Tras la auditoria de Codex, preparar commit y push selectivos, Draft PR y Deploy Preview para verificar que sitio y Visual Editor conserven comportamiento sin ampliar autoria ni publicar produccion.
- [ ] 5.4 Resolver observaciones de auditoria, CI y preview, y repetir paridad, round-trip, no mutacion, OpenSpec, TypeScript, lint, build y diff antes de solicitar validacion humana.

## 6. Validacion final de Alejandro

- [ ] 6.1 Alejandro revisa la evidencia contractual, el reporte de modelos, CI y Deploy Preview final, y autoriza el commit de cierre, OpenSpec Archive y preparacion del merge a `main`. Esta tarea es exclusivamente manual y ningun agente puede marcarla.
