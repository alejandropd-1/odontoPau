# dashboard-editorial Specification

## Purpose
TBD - created by archiving change crear-dashboard-editorial-y-trazabilidad. Update Purpose after archive.
## Requirements
### Requirement: Lectura Dinámica del Catálogo de Contenidos
El sistema SHALL listar dinámicamente todos los artículos e instrucciones gestionados por Tina dentro del único Panel editorial de `/admin`. Cada fila MUST mostrar título, tipo, categoría, resumen, etiquetas, fechas editoriales guardadas, un estado cotidiano unificado, explicación de pendientes y acciones aplicables, sin requerir datos estáticos ni cambios de código cuando se agreguen documentos JSON válidos.

#### Scenario: Visualización del catálogo operativo
- **WHEN** un usuario autenticado abre el Panel editorial de `/admin`
- **THEN** el sistema consulta el catálogo vigente de Tina y muestra todos los Artículos e Instrucciones como filas operables

#### Scenario: Nuevo documento válido
- **WHEN** se crea un Artículo o Instrucción JSON admitido por el contrato
- **THEN** aparece en la lista con su tipo, categoría y situación derivada sin editar el dashboard

#### Scenario: Filtro sin coincidencias
- **WHEN** la búsqueda o los filtros no encuentran contenidos
- **THEN** el panel explica que no hay coincidencias y permite limpiar el criterio sin confundirlo con un error de carga

#### Scenario: Catálogo con varias piezas
- **WHEN** el resultado contiene más piezas que el límite elegido por página
- **THEN** el panel muestra un tramo acotado, informa el rango y el total y permite recorrer páginas o cambiar entre 6, 12 y 24 piezas sin alterar los filtros

#### Scenario: Preferencia de vista recordada
- **WHEN** una persona elige Tabla o Tarjetas y vuelve a cargar el Panel editorial en el mismo navegador
- **THEN** el panel conserva la vista elegida sin modificar contenidos, filtros ni estado de publicación

### Requirement: Estado cotidiano con verificación editorial y pública
El modelo MUST distinguir el estado guardado en Preview del estado confirmado en producción. El estado público SHALL derivarse de la última tanda confirmada mediante una huella estable por documento y MUST NOT inferirse solamente desde el campo editorial actual.

La interfaz SHALL condensar ambas fuentes en una única columna `Estado` con sólo tres valores visibles: `Publicado`, `No publicado` o `Borrador`. Una segunda columna `Qué pasa` MUST explicar si existen cambios sin publicar, una actualización en curso, un éxito, una falta de confirmación o un bloqueo, sin convertir esas situaciones transitorias en estados adicionales. Cuando todavía no exista evidencia suficiente para afirmar uno de los tres estados, la celda de Estado MUST quedar neutra y `Qué pasa` MUST explicar la falta de confirmación.

#### Scenario: Edición posterior a una publicación
- **WHEN** una pieza publicada cambia en la rama editorial y todavía no se promovió la nueva tanda
- **THEN** la fila conserva `Publicado` como estado confirmado y `Qué pasa` explica que la edición todavía no llegó al sitio

#### Scenario: Producción coincidente
- **WHEN** la huella actual coincide con la última tanda confirmada y la pieza está incluida públicamente
- **THEN** la fila informa `Publicado` y explica que esa versión ya está al día

#### Scenario: Estado público desconocido
- **WHEN** falta el índice confirmado o no puede correlacionarse de forma segura con el documento
- **THEN** la fila no presume uno de los tres estados y `Qué pasa` explica que todavía falta la primera comprobación del sitio

### Requirement: Preparación, bloqueos y acciones por contenido
El panel SHALL derivar para cada pieza si está lista para publicar, retirar o republicar, o si permanece bloqueada. Cuando exista un bloqueo MUST mostrar qué aprobación, validación o corrección falta, y las acciones SHALL conducir a una edición o vista válida sin publicar la fila de forma aislada.

#### Scenario: Pieza lista para retirar
- **WHEN** una pieza está publicada y satisface el contrato vigente
- **THEN** la fila ofrece editarla para preparar el retiro y aclara que el cambio se hará efectivo al publicar la tanda

#### Scenario: Pieza retirada editable
- **WHEN** una pieza está retirada del sitio público
- **THEN** la acción de edición abre su formulario Tina y no una ruta visual que responde 404

#### Scenario: Requisito faltante
- **WHEN** una pieza elegida para publicación carece de fecha, responsable clínico o confirmación aplicable
- **THEN** la fila identifica el requisito faltante y no la presenta como lista

### Requirement: Panel único, responsive y accesible
La operación editorial SHALL vivir dentro de `/admin`; la ruta histórica `/editorial` MUST eliminarse o redirigirse a esa entrada sin conservar un segundo acceso propio. La lista MUST ser comprensible en desktop y mobile, operable por teclado y lector de pantalla y no depender sólo del color.

#### Scenario: Acceso mediante marcador histórico
- **WHEN** un usuario visita `/editorial` o su login anterior
- **THEN** llega de forma segura a `/admin` sin ver un dashboard paralelo ni otra contraseña editorial

#### Scenario: Primer acceso desde la navegación de Tina
- **WHEN** una persona abre `Panel editorial` desde el editor visual de Tina
- **THEN** llega a la pantalla administrativa canónica ocupando todo el ancho útil, con el menú principal disponible y sin conservar una capa modal angosta

#### Scenario: Operación en pantalla angosta
- **WHEN** el Panel editorial se usa en un viewport móvil
- **THEN** cada contenido conserva etiquetas, estado, motivo y acciones en una disposición legible sin desplazamiento horizontal obligatorio

#### Scenario: Tabla elegida en pantalla angosta
- **WHEN** una persona elige explícitamente la vista `Tabla` y sus columnas no entran en el ancho disponible
- **THEN** la tabla conserva sus columnas, permite desplazamiento horizontal por gesto y teclado y muestra controles laterales para descubrir las columnas ocultas

#### Scenario: Uso con tecnología asistiva
- **WHEN** una persona navega la lista por teclado o lector de pantalla
- **THEN** puede identificar filtros, estado cotidiano, explicación de pendientes y propósito de cada acción sin depender del color

