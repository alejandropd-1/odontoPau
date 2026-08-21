## ADDED Requirements

### Requirement: Promocion editorial activada por solicitud
Un workflow SHALL reaccionar en `editorial/tina` únicamente cuando cambie el singleton de publicación con un request nuevo. Antes de modificar `main`, MUST verificar request idempotente, convergencia de ramas, allowlist cerrada, estados editoriales y gates vigentes. Un fallo MUST conservar intacta la producción anterior.

#### Scenario: Save sin solicitud
- **WHEN** Tina guarda contenido sin crear un request nuevo
- **THEN** no se abre ni mezcla un PR de producción

#### Scenario: Solicitud valida
- **WHEN** existe un request nuevo, `main` es ancestro del snapshot y el diff pertenece a la allowlist
- **THEN** el workflow ejecuta los gates y prepara una única integración trazable

#### Scenario: Archivo estructural en el diff
- **WHEN** el snapshot incluye código, schema, configuración, dependencias, OpenSpec o cualquier ruta fuera de la allowlist
- **THEN** la promoción falla antes del merge e informa que requiere un cambio estructural

### Requirement: Integracion tecnica automatica e idempotente
Después de gates verdes, la automatización SHALL crear o actualizar un único PR técnico para el request, SHALL integrarlo a `main` mediante las protecciones del repositorio y SHALL evitar merges o deploys duplicados. Ninguna credencial MUST exponerse al cliente Tina.

#### Scenario: Request repetido
- **WHEN** el mismo identificador vuelve a disparar el workflow
- **THEN** se reconoce como procesado y no crea otro PR, merge o deploy

#### Scenario: Permiso insuficiente
- **WHEN** el token del workflow no puede crear o mezclar el PR protegido
- **THEN** el proceso falla de forma segura, conserva producción y muestra la acción administrativa requerida

#### Scenario: Gates verdes
- **WHEN** el PR técnico representa el request vigente y todos los checks requeridos pasan
- **THEN** se mezcla una sola vez y Netlify publica el nuevo commit de `main`

### Requirement: Cierre y convergencia del request
Tras una publicación exitosa, la automatización MUST registrar un resultado mínimo, consumir la solicitud y sincronizar `editorial/tina` con el `main` publicado por fast-forward. Si no puede demostrar convergencia, MUST detener el siguiente ciclo automático.

#### Scenario: Publicacion completada
- **WHEN** el commit autorizado está en `main`
- **THEN** se registra el request procesado y `editorial/tina` termina en el mismo commit o en un estado verificablemente convergente

#### Scenario: Fallo posterior al merge
- **WHEN** producción o el reindexado no alcanzan el commit esperado
- **THEN** el dashboard muestra el estado fallido o pendiente y no inicia otro ciclo ambiguo

### Requirement: Validacion proporcional sin evidencia duplicada
Un cambio `editorial-routine` SHALL ejecutar un preflight determinista limitado a request, alcance, contenido, activos, rutas, Tina lock y whitespace. El PR técnico MUST ejecutar los gates completos vigentes sobre el commit revisado; el operador MUST NOT repetir localmente esos gates después de un resultado remoto exitoso salvo investigación de fallo o diferencia de entorno.

#### Scenario: Preflight editorial limpio
- **WHEN** el diff sólo contiene rutas permitidas y supera los controles específicos
- **THEN** puede continuar al PR técnico sin ejecutar localmente una segunda copia de todos los gates remotos

#### Scenario: CI falla
- **WHEN** cualquier gate remoto falla sobre la revisión actual
- **THEN** producción permanece sin cambios y el ciclo solicita diagnóstico antes de reintentar

### Requirement: Verificacion escalonada del deploy
Un deploy exitoso SHALL verificarse mediante estado, commit publicado y rutas representativas. Los logs completos de Netlify MUST consultarse sólo ante fallo, bloqueo, timeout o commit inesperado.

#### Scenario: Produccion saludable
- **WHEN** Netlify publica el commit autorizado y las rutas seleccionadas responden correctamente
- **THEN** la verificación finaliza sin una auditoría adicional del build

#### Scenario: Deploy fallido
- **WHEN** Netlify no publica el commit autorizado
- **THEN** el flujo mantiene o recupera la última producción sana, inspecciona el tramo fallido y registra la corrección antes de reintentar
