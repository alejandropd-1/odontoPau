## ADDED Requirements

### Requirement: Inventario contractual versionado
El sistema SHALL mantener un inventario inspeccionable de cada modelo y objeto editorial que identifique campos persistidos, forma, tipo, obligatoriedad, constantes, discriminantes, origen, condicion editorial y estado `safe`, `blocked` o `pending`.

#### Scenario: Campo persistido descubierto
- **WHEN** un documento JSON vigente contiene una ruta de campo que no figura en el inventario contractual
- **THEN** la validacion falla e informa el documento, modelo y ruta desconocida

#### Scenario: Campo derivado por codigo
- **WHEN** el runtime produce un valor que no se persiste en el JSON fuente
- **THEN** el inventario lo clasifica como derivado y no exige un control CMS para almacenarlo

### Requirement: Paridad estructural entre capas
Cada modelo habilitable para escritura CMS MUST representar sin perdida los campos soportados por los JSON vigentes, el contrato o validador runtime neutral y el adaptador CMS evaluado. Stackbit SHALL ser el adaptador vigente medido en este cambio. La comparacion MUST incluir las 188 rutas inventariadas (31 modelos neutrales, 29 modelos Stackbit), objetos anidados, listas, uniones discriminadas, constantes, tipos y obligatoriedad, no solamente nombres de primer nivel o modelos raiz.

#### Scenario: Campo JSON ausente en CMS
- **WHEN** un campo persistido o admitido por el runtime no tiene representacion compatible en el modelo Stackbit
- **THEN** el modelo queda `blocked` y el reporte identifica la capa, ruta y forma incompatibles

#### Scenario: Campo CMS desconocido por runtime
- **WHEN** Stackbit admite persistir un campo que el contrato runtime no reconoce de forma segura
- **THEN** la validacion bloquea el modelo antes de preview o integracion

#### Scenario: Contrato completamente cubierto
- **WHEN** JSON, runtime e interfaz CMS coinciden en todos los campos del alcance medido
- **THEN** el modelo se clasifica `safe` con evidencia reproducible del comando ejecutado

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
El manifest contractual SHALL ser ejecutable y no depender de tipos de un proveedor CMS. Las definiciones entregadas a `GitContentSource` SHALL provenir de un adaptador Stackbit TypeScript importable por las pruebas. La reorganizacion MUST conservar la configuracion y representacion normalizada de los modelos existentes hasta que un slice funcional autorice cambios de autoria.

#### Scenario: Extraccion sin cambio funcional
- **WHEN** los modelos se extraen desde `stackbit.config.ts` a modulos reutilizables
- **THEN** nombres, orden, campos, labels, tipos, constantes, rutas y opciones existentes permanecen equivalentes

#### Scenario: Cambio incidental del formulario
- **WHEN** la salida normalizada antes y despues de la extraccion difiere fuera del alcance aprobado
- **THEN** la prueba falla y exige revertir o justificar el cambio mediante el OpenSpec correspondiente

#### Scenario: Evaluacion de un proveedor futuro
- **WHEN** un cambio posterior incorpore un adaptador como TinaCMS
- **THEN** reutiliza el manifest neutral y debe demostrar su propia paridad sin reemplazar silenciosamente la evidencia Stackbit de esta revision

### Requirement: Defaults editoriales seguros
Todo default preparado para altas futuras MUST usar estado `draft` y MUST dejar ausentes las fechas de publicacion, revision clinica y aprobaciones. Este slice MUST NOT habilitar nuevas rutas de creacion, presets de publicacion ni escritura de modelos incompletos.

#### Scenario: Default de documento nuevo
- **WHEN** se evalua la configuracion inicial de un tipo editorial
- **THEN** el estado resultante es `draft` y no existe `publishedAt`, revisor ni aprobacion inferida

#### Scenario: API de CMS insuficiente
- **WHEN** Stackbit no permite expresar un default seguro sin cambiar el comportamiento vigente
- **THEN** el modelo queda `pending` para su slice funcional y no se simula una garantia inexistente

### Requirement: Reporte accionable por modelo
El comando de validacion SHALL producir una salida estable que resuma cobertura, diferencias bloqueantes, pendientes deliberados y slice responsable. El reporte MUST distinguir una prueba local del limite modelado de una futura prueba punta a punta en Netlify Visual Editor.

#### Scenario: Desfase conocido
- **WHEN** el inventario encuentra un campo de `CasoClinico` usado por el sitio y no cubierto por el CMS
- **THEN** el reporte lo marca `blocked`, identifica su ruta y lo asigna al slice de tratamientos y casos

#### Scenario: Ejecucion repetida sin cambios
- **WHEN** el comando se ejecuta dos veces sobre la misma revision
- **THEN** produce el mismo resultado sin alterar documentos, fixtures ni orden del reporte
