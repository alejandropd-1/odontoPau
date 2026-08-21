# gates-ci-y-publicacion Specification

## Purpose
TBD - created by archiving change blindar-ci-y-publicacion-protegida. Update Purpose after archive.
## Requirements
### Requirement: Gates automaticos en pull requests
Todo pull request hacia `main` SHALL ejecutar validacion OpenSpec estricta, TypeScript, lint y build mediante un workflow reproducible. El resultado MUST fallar si cualquiera de esos comandos termina con codigo distinto de cero.

#### Scenario: Cambio valido
- **WHEN** un pull request cumple OpenSpec, tipos, lint y build
- **THEN** el check de calidad finaliza correctamente y entrega evidencia de cada paso

#### Scenario: Spec invalida
- **WHEN** una delta spec o un cambio OpenSpec no supera validacion estricta
- **THEN** el workflow falla antes del merge e identifica el comando fallido

#### Scenario: Build roto
- **WHEN** Next no puede compilar el contenido o codigo de la rama
- **THEN** el check permanece fallido y el pull request no satisface la puerta de calidad

### Requirement: Instalacion y ejecucion reproducibles
CI MUST usar Node y pnpm declarados por el proyecto, instalar con lockfile congelado y ejecutar una version fijada de OpenSpec desde las dependencias locales. El workflow MUST NOT depender de instalaciones globales ni versiones `latest`.

#### Scenario: Lockfile desactualizado
- **WHEN** `package.json` y `pnpm-lock.yaml` no coinciden
- **THEN** la instalacion congelada falla y exige actualizar el lockfile en la rama

#### Scenario: Entorno limpio
- **WHEN** GitHub inicia el job sin dependencias preinstaladas
- **THEN** obtiene las versiones declaradas y ejecuta los mismos gates definidos para desarrollo

### Requirement: Contexto editorial seguro en CI
El build de pull request MUST usar configuracion de Deploy Preview y MUST NOT recibir secretos de publicacion. El workflow SHALL validar contenido de revision sin desplegarlo ni convertirlo en contenido indexable de produccion.

#### Scenario: Articulo en revision
- **WHEN** la rama contiene un articulo permitido en preview pero no `published`
- **THEN** el build de CI puede validarlo con semantica no indexable y no ejecuta una publicacion

#### Scenario: Workflow sin secretos
- **WHEN** se inspeccionan permisos, variables y pasos del workflow
- **THEN** no existen credenciales de Netlify, Supabase, pacientes ni APIs externas y el token de GitHub conserva solo lectura de contenido

### Requirement: Diff revisable
Los pull requests SHALL validar errores de whitespace en el rango modificado y SHALL presentar una plantilla con alcance, OpenSpec, comandos, preview y aprobaciones aplicables.

#### Scenario: Whitespace invalido
- **WHEN** el diff introduce espacios finales o marcadores que `git diff --check` considera invalidos
- **THEN** el check falla antes del build

#### Scenario: Cambio clinico
- **WHEN** un pull request modifica contenido clinico o imagenes de pacientes
- **THEN** la plantilla solicita evidencia no sensible de revision clinica, privacidad y preview sin almacenar consentimientos

### Requirement: Main protegida y publicacion por Git
Una vez validado el workflow remoto, `main` SHALL requerir el check de calidad y toda edición de Tina SHALL llegar desde una rama de trabajo separada mediante Draft PR. Tina MUST NOT escribir ni mezclar directamente a `main`; Netlify MUST limitar producción al flujo Git cuando la opción esté disponible y verificada.

#### Scenario: Guardado desde Tina
- **WHEN** un editor guarda cambios desde el Git CMS
- **THEN** el commit queda en la rama configurada y GitCron o GitHub permite abrir o actualizar el Draft PR sin mezclar a `main`

#### Scenario: Check pendiente o fallido
- **WHEN** el pull request no tiene un check exitoso en su última revisión
- **THEN** la protección de rama impide el merge

#### Scenario: Intento de escritura a main
- **WHEN** la configuración administrativa de Tina resuelve `main` como destino de escritura
- **THEN** el gate falla y exige seleccionar una rama no productiva antes de habilitar el editor

#### Scenario: Intento de deploy directo
- **WHEN** una herramienta intenta publicar producción mediante CLI, API o promoción de preview
- **THEN** la configuración Git-only rechaza el deploy y exige integrar el cambio por la rama de producción

### Requirement: Activacion y rollback verificables
Las protecciones externas MUST activarse en orden, con evidencia del check existente y un procedimiento de recuperacion documentado. Ninguna regla SHALL habilitarse a ciegas antes de que el repositorio pueda satisfacerla.

#### Scenario: Activacion inicial
- **WHEN** el workflow remoto pasa en un pull request
- **THEN** el responsable puede seleccionar ese check como requerido y registra la configuracion aplicada

#### Scenario: Regla bloqueante
- **WHEN** una proteccion impide integrar un cambio valido por error de configuracion
- **THEN** un Owner puede aplicar el rollback documentado, corregir la regla y reactivarla sin alterar contenido ni historial

### Requirement: Rama y cierre trazables por OpenSpec
Cada OpenSpec implementable SHALL usar una rama exclusiva `change/<id-exacto-del-openspec>` y SHALL finalizar con una validacion manual de Alejandro que ningun agente puede completar. Con todas las tareas terminadas, el cambio MUST registrar un commit de cierre y un segundo commit producido por OpenSpec Archive en la misma rama antes de solicitar el merge a `main`.

#### Scenario: Validacion final pendiente
- **WHEN** CI y Deploy Preview pasan pero Alejandro aun no marco el ultimo checkbox
- **THEN** el cambio permanece activo y no se archiva ni se solicita su merge a `main`

#### Scenario: Cierre aprobado
- **WHEN** Alejandro valida la revision exacta y todas las tareas quedan completas
- **THEN** se registra el commit de cierre, se archiva OpenSpec en la misma rama y se agrega un segundo commit antes del merge autorizado

#### Scenario: Produccion posterior al archive
- **WHEN** el pull request con implementacion y archive se mezcla a `main`
- **THEN** Netlify ejecuta el deploy de produccion y su verificacion se registra en el pull request o reporte de release sin reabrir el OpenSpec

### Requirement: Gate de paridad contractual CMS
Todo pull request que modifique contratos, modelos o contenido editorial SHALL ejecutar un comando local y remoto de paridad CMS, round-trip semantico y no mutacion antes de TypeScript, lint y build. El gate MUST ser determinista, usar dependencias fijadas y MUST NOT requerir red, credenciales ni servicios externos.

#### Scenario: Contratos alineados
- **WHEN** el inventario, la paridad y el round-trip pasan sin modificar `src/data`
- **THEN** el gate entrega evidencia de los modelos evaluados y permite continuar con los restantes controles de CI

#### Scenario: Regresion contractual
- **WHEN** un cambio agrega, elimina o altera un campo sin representarlo de forma compatible en todas las capas exigidas
- **THEN** CI falla antes del build e identifica el modelo y la ruta contractual afectada

#### Scenario: Mutacion de contenido durante pruebas
- **WHEN** el comando de round-trip modifica cualquier documento canonico bajo `src/data`
- **THEN** el gate falla aunque la reconstruccion resultante compile correctamente

#### Scenario: Entorno sin secretos
- **WHEN** GitHub Actions ejecuta el control en un checkout limpio
- **THEN** la prueba termina usando solamente archivos y dependencias versionadas del repositorio

### Requirement: Gate reproducible del adaptador Tina
Todo pull request que modifique schema, modelos o contenido del Slice B SHALL normalizar y comparar el adaptador Tina contra el contrato neutral, ejecutar round-trip y confirmar no mutación antes de TypeScript, lint y build. El gate MUST funcionar sin credenciales ni acceso de escritura a TinaCloud.

#### Scenario: Schema Tina alineado
- **WHEN** modelos, fixtures y documentos copiados conservan todas las rutas de Artículos e Instrucciones
- **THEN** CI informa cobertura del Slice B y continúa con los restantes controles

#### Scenario: Campo perdido o documento mutado
- **WHEN** Tina omite un campo contractual o la prueba altera un JSON canónico
- **THEN** CI falla e identifica modelo, ruta y clase de diferencia antes del build
