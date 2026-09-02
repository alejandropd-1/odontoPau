## Why

El Panel editorial conserva el resultado de la publicación más reciente, pero al iniciar un pedido nuevo deja de ofrecer un historial cotidiano de qué ocurrió, cuándo terminó y si hubo que intervenir. Antes de preparar derivados para redes sociales necesitamos una referencia persistente y comprensible de las tandas realmente publicadas, sin sumar otro login ni complejizar los tres estados que ya usa la profesional.

## What Changes

- Registrar cada ciclo de publicación como un evento operativo persistente, vinculado con la solicitud que lo originó y con su resultado final.
- Conservar fecha de pedido, fecha de finalización, resultado, explicación legible y referencia interna de producción, sin guardar contenido clínico, datos de pacientes, consentimientos ni secretos.
- Derivar un resumen mínimo: última publicación confirmada, cantidad de tandas exitosas o detenidas y duración de los ciclos recientes.
- Incorporar en el Panel editorial de Tina una vista compacta y accesible de movimientos recientes, usando lenguaje coloquial y sin mostrar ramas, PR, CI, SHA, GitHub ni Netlify.
- Mantener `Publicado`, `No publicado` y `Borrador` como únicos estados cotidianos del contenido; la trazabilidad explicará acontecimientos y no introducirá una cuarta condición editorial.
- Mantener Tina y los JSON versionados en Git como fuentes canónicas. La primera implementación no incorporará Supabase ni otro servicio persistente externo mientras el uso siga siendo individual y el volumen operativo sea bajo.
- Mantener la publicación por tanda completa; este cambio no habilita publicación individual mediante switches por fila.

### Alcance

- Ciclos iniciados desde el Panel editorial y procesados por el flujo de publicación vigente.
- Historial y resumen operativo visibles sólo dentro del `/admin` autenticado por Tina.
- Persistencia versionada, validación, recuperación ante datos incompletos y presentación responsive.

### Fuera de alcance

- Supabase Auth, roles, responsables, asignaciones o aprobaciones multiusuario.
- Publicación individual por contenido, cambios en las puertas clínicas o nuevos estados editoriales.
- Derivados o programación de redes sociales.
- Analítica de pacientes, métricas comerciales o almacenamiento de información clínica.

### Riesgos clínicos

- El historial podría interpretarse como aprobación clínica si mezcla acontecimientos técnicos con estados editoriales. La interfaz deberá distinguir explícitamente el resultado de una tanda de la aprobación del contenido.
- Un registro con datos libres podría incorporar información sensible. El contrato admitirá sólo campos operativos acotados y validados.

### Criterio de éxito

Una persona no técnica puede abrir el Panel editorial y entender cuándo terminó cada publicación reciente, si llegó al sitio o por qué se detuvo, sin perder los estados simples por contenido. El historial sobrevive a pedidos posteriores, no expone infraestructura y puede reutilizarse como referencia confiable por el futuro flujo de redes sociales.

## Capabilities

### New Capabilities

- `trazabilidad-operativa-editorial`: registro persistente, seguro y consultable de los ciclos de publicación y sus resultados resumidos.

### Modified Capabilities

- `dashboard-editorial`: presentación integrada y accesible del historial operativo sin duplicar estados, autenticación ni acciones de publicación.

## Impact

- Contratos y validadores de publicación en `src/cms/tina`.
- Script y workflow de publicación editorial.
- Contenido operativo versionado bajo `src/data/editorial` y su configuración Tina.
- Pantalla custom del Panel editorial en `tina/dashboard`.
- Pruebas focalizadas del modelo, persistencia y renderizado del dashboard.
- No se agrega una base de datos, proveedor de autenticación ni servicio de pago.
