# paginas-institucionales Specification

## Purpose
TBD - created by archiving change adoptar-tina-y-completar-cms-articulos-instrucciones. Update Purpose after archive.
## Requirements
### Requirement: Inicio e índice de tratamientos editables sin page builder
El contenido visible propio de Inicio y del índice de Tratamientos SHALL residir en JSON versionado y SHALL exponerse en Tina con campos semánticos en español. Tina MUST permitir editar contenido, orden y medios admitidos, pero MUST NOT exponer controles de layout, clases, colores ni estructura libre.

#### Scenario: Edición visual de Inicio
- **WHEN** el editor abre Inicio y selecciona texto del hero, servicios, equipo o ubicación
- **THEN** Tina enfoca el campo correspondiente y la página reacciona en vivo sin cambiar la maqueta

#### Scenario: Edición visual del índice
- **WHEN** el editor abre `/tratamientos` desde su documento Tina
- **THEN** puede editar encabezados e introducciones de la página y navegar a cada Tratamiento para editar sus tarjetas y detalle desde la fuente única

#### Scenario: Campo institucional opcional ausente
- **WHEN** un bloque opcional se deja ausente
- **THEN** el componente no lo renderiza ni reserva espacio y Tina no persiste un placeholder vacío
