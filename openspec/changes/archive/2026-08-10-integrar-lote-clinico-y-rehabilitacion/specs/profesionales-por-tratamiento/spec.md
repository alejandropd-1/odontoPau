## ADDED Requirements

### Requirement: Profesionales definidos por contenido
Cada tratamiento SHALL poder declarar cero, uno o varios profesionales con nombre, rol, retrato y texto alternativo, y el componente del hero SHALL renderizar esos datos sin condicionales por identificador.

#### Scenario: Un profesional
- **WHEN** un tratamiento declara un profesional
- **THEN** el hero muestra su retrato, nombre y rol confirmados

#### Scenario: Más de un profesional
- **WHEN** un tratamiento declara dos profesionales
- **THEN** el hero presenta ambos retratos y nombres sin superposición de texto ni pérdida de legibilidad

#### Scenario: Estética Dental compartida
- **WHEN** se renderiza el hero de Estética Dental
- **THEN** presenta a Roberto Domínguez y Paula Gualtieri con sus roles confirmados

#### Scenario: Sin asociación confirmada
- **WHEN** un tratamiento no declara profesionales
- **THEN** el hero omite el badge completo y no inventa una especialidad o responsable

### Requirement: Retratos reales y accesibles
Los retratos MUST ser activos locales optimizados, mantener el rostro visible en los recortes responsive y contar con texto alternativo que identifique a la persona sin describir atributos irrelevantes.

#### Scenario: Render responsive
- **WHEN** el hero se visualiza entre 320 px y desktop
- **THEN** los retratos conservan proporción, foco y contraste suficientes, el badge mantiene separación simétrica respecto de los bordes y ningún nombre o rol se desborda fuera del contenedor

### Requirement: Edición desde el CMS
El modelo `Tratamiento` del CMS SHALL exponer la lista de profesionales y todos sus campos sin requerir cambios de código para actualizar un nombre, rol o retrato.

#### Scenario: Edición de un profesional
- **WHEN** una persona autorizada modifica un profesional desde Netlify Create
- **THEN** el cambio se persiste en el JSON del tratamiento y se refleja en el hero correspondiente

### Requirement: Afirmaciones profesionales verificables
El sistema MUST mostrar únicamente roles proporcionados o ya confirmados y MUST NOT generar automáticamente “Especialista en <tratamiento>” a partir del título de la página.

#### Scenario: Tratamiento con nombre comercial
- **WHEN** el tratamiento se llama Ortodoncia Invisible
- **THEN** el rol del profesional no se deriva del nombre comercial y conserva sólo la descripción confirmada
