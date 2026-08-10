## ADDED Requirements

### Requirement: Equipo de trabajo
La página de inicio SHALL mostrar las matrículas actualizadas de los cuatro profesionales y reflejar la especialidad de Paula Gualtieri como "Especialista en ortodoncia y ortopedia."

#### Scenario: Visualización del hero de equipo
- **WHEN** un usuario navega a la sección del equipo de trabajo en la página principal
- **THEN** observa las matrículas (MN 33337, MN 31757, MN 40113, MN 32457) y la descripción corregida de Paula.

### Requirement: Precisión clínica en Rehabilitación
El artículo "Renovación estética del sector anterior" y su metadata asociada SHALL utilizar terminología clínica precisa ("muñones", "anterior") en los epígrafes y descripciones.

#### Scenario: Lectura del caso de rehabilitación
- **WHEN** un usuario lee el caso de renovación estética frontal
- **THEN** los epígrafes y la explicación paso a paso muestran el lenguaje técnico aprobado.

### Requirement: Simplificación de Endodoncia y ajustes
Los textos de Endodoncia, Ortodoncia Invisible e Instrucciones SHALL estar purgados de secciones irrelevantes (FAQ, Fuentes) y reflejar las descripciones aprobadas.

#### Scenario: Visualización de caso de Endodoncia
- **WHEN** un usuario accede al caso clínico de Tratamiento de Conducto
- **THEN** no se muestran bloques de FAQ ni fuentes, y la descripción enfatiza la inflamación y tecnología mecanizada.

### Requirement: Nuevo caso clínico Ortopedia
El sistema SHALL incluir un nuevo caso de ortopedia (caso-01) renderizado correctamente con su metadata e imágenes locales procesadas.

#### Scenario: Visualización del caso de Ortopedia
- **WHEN** el usuario navega a los casos de Ortopedia
- **THEN** puede ver el nuevo caso documentando el inicio del tratamiento con las 4 fotografías.

### Requirement: Títulos canónicos en casos vinculados
Cada caso clínico que incluya `articleSlug` SHALL mostrar el mismo título que el artículo enlazado.

#### Scenario: Navegación desde un tratamiento hacia un artículo
- **WHEN** un usuario selecciona un caso clínico vinculado desde la página de un tratamiento
- **THEN** el título de la tarjeta coincide con el título de la página de artículo de destino.
