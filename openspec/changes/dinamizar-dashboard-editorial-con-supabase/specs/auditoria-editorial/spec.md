## ADDED Requirements

### Requirement: Eventos append-only
Toda mutación editorial relevante SHALL generar un evento con pieza, acción, actor, fecha y cambio no sensible; los eventos MUST impedir UPDATE y DELETE desde roles de aplicación.

#### Scenario: Cambio de responsable
- **WHEN** un editor reasigna una pieza
- **THEN** se conserva un evento que identifica valores anterior y nuevo sin permitir su alteración posterior

### Requirement: Aprobaciones trazables
Cada aprobación SHALL registrar tipo, decisión, revisor y fecha, y MUST diferenciar aprobación clínica, visual, editorial y técnica de la autorización de publicación.

#### Scenario: Aprobación clínica registrada
- **WHEN** Paula aprueba datos clínicos de una pieza
- **THEN** el registro no cambia por sí solo el estado público ni habilita merge o deploy

### Requirement: Historial consultable
Usuarios autorizados SHALL poder consultar y filtrar eventos por pieza, actor, acción y rango temporal con paginación.

#### Scenario: Auditoría de una pieza
- **WHEN** un administrador abre el historial de un artículo
- **THEN** obtiene los eventos ordenados sin cargar todo el registro en una única respuesta

### Requirement: Integridad de actor y fecha
Actor y timestamp MUST derivarse de la sesión y del servidor o base, no de valores confiados al cliente.

#### Scenario: Cliente suplanta actor
- **WHEN** una mutación envía un identificador de actor diferente al usuario autenticado
- **THEN** el sistema ignora o rechaza ese valor y registra la identidad verificada

### Requirement: Retención sin datos clínicos
El historial MUST limitarse a metadatos operativos y MUST evitar texto libre clínico, datos de pacientes y secretos.

#### Scenario: Nota sensible
- **WHEN** una nota de aprobación contiene información prohibida
- **THEN** la validación impide almacenarla y solicita una referencia no sensible
