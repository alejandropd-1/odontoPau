## ADDED Requirements

### Requirement: Historial operativo integrado

El Panel editorial MUST presentar dentro de la pantalla existente un resumen compacto y una lista de movimientos recientes que permitan entender cuándo terminó cada tanda y cuál fue su resultado.

#### Scenario: Movimientos recientes disponibles

- **WHEN** el historial contiene ciclos válidos
- **THEN** el panel muestra primero el más reciente con fecha y hora de Argentina, resultado cotidiano, duración disponible y una explicación breve

#### Scenario: Historial sin movimientos

- **WHEN** todavía no existe un ciclo finalizado
- **THEN** el panel explica de forma neutral que aún no hay publicaciones registradas y mantiene disponibles las funciones editoriales actuales

#### Scenario: Historial temporalmente no disponible

- **WHEN** el historial no puede consultarse o contiene datos inválidos
- **THEN** el panel muestra una explicación recuperable sin bloquear la edición, la revisión ni una nueva solicitud de publicación

### Requirement: Estados cotidianos sin duplicación

El Panel editorial MUST mantener `Publicado`, `No publicado` y `Borrador` como únicos estados visibles por contenido; los resultados históricos DEBERÁN presentarse como movimientos de una tanda y no como estados adicionales de cada fila.

#### Scenario: Tanda publicada con contenido sin cambios

- **WHEN** un ciclo exitoso aparece en el historial y una pieza continúa coincidiendo con producción
- **THEN** la pieza conserva el estado `Publicado` y el historial explica el acontecimiento sin agregar otra condición a la fila

#### Scenario: Tanda detenida

- **WHEN** el último ciclo terminó con una incidencia
- **THEN** el panel explica la incidencia en el área de publicación o historial sin cambiar artificialmente los estados editoriales de los contenidos

### Requirement: Lenguaje no técnico y divulgación progresiva

La vista MUST comunicar resultados con lenguaje coloquial y DEBERÁ mantener ocultas las referencias internas de ramas, PR, CI, SHA, GitHub y Netlify.

#### Scenario: Vista resumida

- **WHEN** la persona abre el Panel editorial
- **THEN** ve un resumen breve de la última publicación y no una lista de identificadores de infraestructura

#### Scenario: Consulta de movimientos anteriores

- **WHEN** la persona decide revisar el historial
- **THEN** puede expandir o recorrer los movimientos sin abandonar el Panel editorial ni enfrentarse a terminología técnica

### Requirement: Presentación responsive y accesible del historial

El historial MUST poder operarse con teclado, anunciar cambios relevantes mediante semántica accesible y adaptarse a pantallas móviles sin producir desplazamiento horizontal de toda la página.

#### Scenario: Navegación con teclado

- **WHEN** una persona recorre el resumen y los detalles mediante teclado
- **THEN** los controles reciben foco visible, exponen nombre accesible y conservan un orden comprensible

#### Scenario: Pantalla móvil

- **WHEN** el Panel editorial se muestra en un ancho móvil
- **THEN** el historial se apila dentro del ancho disponible y los textos y acciones permanecen legibles y utilizables
