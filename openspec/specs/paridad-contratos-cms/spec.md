# paridad-contratos-cms Specification

## Purpose
TBD - created by archiving change alinear-contratos-y-seguridad-cms. Update Purpose after archive.
## Requirements
### Requirement: Inventario contractual versionado
El sistema SHALL mantener un inventario inspeccionable de cada modelo y objeto editorial que identifique campos persistidos, forma, tipo, obligatoriedad, constantes, discriminantes, origen, condicion editorial y estado `safe`, `blocked` o `pending`.

#### Scenario: Campo persistido descubierto
- **WHEN** un documento JSON vigente contiene una ruta de campo que no figura en el inventario contractual
- **THEN** la validacion falla e informa el documento, modelo y ruta desconocida

#### Scenario: Campo derivado por codigo
- **WHEN** el runtime produce un valor que no se persiste en el JSON fuente
- **THEN** el inventario lo clasifica como derivado y no exige un control CMS para almacenarlo

### Requirement: Paridad estructural entre capas
Cada modelo habilitable para escritura CMS MUST representar sin pérdida los campos soportados por los JSON vigentes, el contrato o validador runtime neutral y el adaptador CMS evaluado. Tina SHALL ser el adaptador vigente medido para Artículos e Instrucciones; la fotografía Stackbit MUST conservarse como evidencia histórica. La comparación MUST cubrir todas las rutas de Slice B dentro de las 188 rutas inventariadas, objetos anidados, listas, uniones discriminadas, constantes, tipos y obligatoriedad, no solamente nombres de primer nivel o modelos raíz.

#### Scenario: Campo JSON ausente en Tina
- **WHEN** un campo persistido o admitido por el runtime de Artículos o Instrucciones no tiene representación compatible en el schema Tina
- **THEN** el modelo queda `blocked` y el reporte identifica la capa, ruta y forma incompatibles

#### Scenario: Campo Tina desconocido por runtime
- **WHEN** Tina admite persistir un campo que el contrato runtime no reconoce de forma segura
- **THEN** la validación bloquea el modelo antes de preview o integración

#### Scenario: Contrato de Slice B completamente cubierto
- **WHEN** JSON, runtime e interfaz Tina coinciden en todos los campos del alcance medido
- **THEN** los modelos se clasifican `safe` con evidencia reproducible y las rutas C/D continúan fuera de alcance sin falsa cobertura

### Requirement: Round-trip semantico sin mutaciones
El sistema MUST probar documentos reales y fixtures mediante carga, proyeccion por el contrato CMS y reconstruccion, conservando valores, objetos, listas, orden y discriminantes. La prueba MUST operar sobre copias y MUST NOT modificar archivos canonicos bajo `src/data`.

#### Scenario: Documento compatible
- **WHEN** un documento cubierto se proyecta y reconstruye sin cambios editoriales
- **THEN** el resultado es semanticamente equivalente al original y no existe diff en `src/data`

#### Scenario: Perdida durante reconstruccion
- **WHEN** la proyeccion omite, convierte o reordena semanticamente un valor persistido
- **THEN** el round-trip falla con la ruta exacta y el modelo no puede declararse `safe`

#### Scenario: Fixture de campo opcional
- **WHEN** un campo opcional valido no aparece en los documentos reales pero si en un fixture contractual
- **THEN** la prueba verifica su conservacion sin incorporar contenido sintetico al sitio publico

### Requirement: Contrato neutral y adaptador CMS importable y equivalente
El manifest contractual SHALL ser ejecutable y no depender de tipos de un proveedor CMS. Las definiciones de Tina SHALL provenir de un adaptador TypeScript importable por las pruebas. La normalización MUST demostrar equivalencia del Slice B sin modificar silenciosamente el baseline neutral ni borrar la evidencia normalizada del adaptador Stackbit anterior.

#### Scenario: Incorporacion del adaptador Tina
- **WHEN** el schema Tina se normaliza para la prueba contractual
- **THEN** sus modelos y campos de Artículos e Instrucciones se comparan contra el manifest neutral mediante rutas, formas, tipos, constantes y obligatoriedad

#### Scenario: Cambio incidental del formulario
- **WHEN** la salida Tina agrega, elimina o cambia un campo fuera del alcance aprobado
- **THEN** la prueba falla y exige justificar el delta mediante el OpenSpec correspondiente

#### Scenario: Evidencia historica preservada
- **WHEN** Tina reemplaza a Stackbit como herramienta vigente
- **THEN** las fotografías y comparaciones Stackbit ya archivadas permanecen disponibles y no se presentan como validación de Tina

### Requirement: Defaults editoriales seguros
Todo default de Tina para documentos nuevos MUST usar estado `draft` y MUST dejar ausentes `publishedAt`, revisión clínica y aprobaciones. Ningún preset, formulario o callback SHALL inferir estado publicable ni evidencia de consentimiento.

#### Scenario: Default de documento nuevo
- **WHEN** Tina inicializa un Artículo o una Instrucción
- **THEN** el estado resultante es `draft` y no existe fecha de publicación, revisor ni aprobación inferida

#### Scenario: API de Tina insuficiente
- **WHEN** Tina no permite expresar o conservar un default seguro para un campo
- **THEN** el modelo queda `blocked`, no se habilita escritura y la limitación se registra de forma reproducible

### Requirement: Reporte accionable por modelo
El comando de validación SHALL producir una salida estable que resuma cobertura Tina, diferencias bloqueantes, pendientes deliberados y slice responsable. El reporte MUST distinguir pruebas locales del schema y round-trip de la posterior prueba punta a punta autenticada en Tina y Deploy Preview.

#### Scenario: Desfase de Slice B
- **WHEN** el inventario encuentra un campo de Artículo o Instrucción no cubierto por Tina
- **THEN** el reporte lo marca `blocked`, identifica su ruta y evita habilitar ese modelo

#### Scenario: Ejecucion repetida sin cambios
- **WHEN** el comando se ejecuta dos veces sobre la misma revisión
- **THEN** produce el mismo resultado sin alterar documentos, fixtures ni orden del reporte
