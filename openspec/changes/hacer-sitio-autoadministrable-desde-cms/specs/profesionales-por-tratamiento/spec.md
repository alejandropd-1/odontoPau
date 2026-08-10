## MODIFIED Requirements

### Requirement: Edicion desde el CMS
El modelo unico `Tratamiento` del CMS SHALL exponer la lista de profesionales y todos sus campos —nombre, rol confirmado, retrato y texto alternativo— sin requerir cambios de codigo para altas, modificaciones, reordenamiento u omisiones. Guardar el tratamiento MUST preservar los profesionales no modificados y MUST validar cada elemento completo.

#### Scenario: Edicion de un profesional
- **WHEN** una persona autorizada modifica un profesional desde Netlify Visual Editor
- **THEN** el cambio se persiste en el JSON del tratamiento y se refleja en el hero correspondiente

#### Scenario: Alta de un profesional
- **WHEN** una persona autorizada agrega un profesional con nombre, rol, retrato y alt confirmados
- **THEN** el preview lo incorpora usando el componente existente sin condicionales por tratamiento

#### Scenario: Profesional incompleto
- **WHEN** un elemento carece de nombre, rol, retrato o texto alternativo
- **THEN** el CMS o el build rechaza el tratamiento en lugar de mostrar un badge parcial

#### Scenario: Lista vacia
- **WHEN** el tratamiento no declara profesionales
- **THEN** el hero omite el badge completo y el CMS no exige crear una asociacion ficticia
