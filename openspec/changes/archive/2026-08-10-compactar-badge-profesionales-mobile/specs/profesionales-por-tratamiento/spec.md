## MODIFIED Requirements

### Requirement: Profesionales definidos por contenido
Cada tratamiento SHALL poder declarar cero, uno o varios profesionales con nombre, rol, rol mobile breve opcional, retrato y texto alternativo, y el componente del hero SHALL renderizar esos datos sin condicionales por identificador ni especialidades inferidas.

#### Scenario: Un profesional
- **WHEN** un tratamiento declara un profesional
- **THEN** el hero muestra su retrato, nombre y rol confirmados

#### Scenario: Mas de un profesional
- **WHEN** un tratamiento declara dos profesionales
- **THEN** el hero presenta ambos retratos y nombres sin superposicion de texto ni perdida de legibilidad

#### Scenario: Estetica Dental compartida
- **WHEN** se renderiza el hero de Estetica Dental
- **THEN** presenta a Roberto Dominguez y Paula Gualtieri con sus roles confirmados y puede usar una variante breve explicita en mobile

#### Scenario: Sin asociacion confirmada
- **WHEN** un tratamiento no declara profesionales
- **THEN** el hero omite el badge completo y no inventa una especialidad o responsable

#### Scenario: Rol mobile no declarado
- **WHEN** un profesional no posee `mobileRole`
- **THEN** el hero reutiliza su rol completo sin generar, truncar ni inferir otro texto

## ADDED Requirements

### Requirement: Jerarquia compacta del badge en mobile
El hero SHALL presentar entre 320 px y el breakpoint `md` un badge compacto que conserve nombres, retratos y rol esencial, MUST permitir wrapping sin overflow horizontal y MUST reducir la cobertura de la imagen respecto de la composicion desktop.

#### Scenario: Dos profesionales con un rol extenso
- **WHEN** el hero se visualiza entre 320 y 430 px con dos profesionales y uno posee un rol completo extenso
- **THEN** muestra el `mobileRole` confirmado, mantiene ambos nombres legibles y deja visible el sujeto principal de la imagen

#### Scenario: Uno o dos profesionales con roles breves
- **WHEN** el tratamiento ya declara roles que caben en la composicion compacta
- **THEN** el hero los muestra mediante el fallback sin exigir contenido duplicado y sin modificar su significado

#### Scenario: Vista tablet o desktop
- **WHEN** el viewport alcanza el breakpoint `md`
- **THEN** el badge muestra el rol completo y recupera las dimensiones aprobadas para desktop

### Requirement: Edicion y accesibilidad del rol breve
El CMS SHALL exponer `mobileRole` como texto opcional y el sitio MUST mantener una lista semantica de profesionales, textos legibles y retratos con alt confirmado sin publicar datos sensibles ni contenido de pacientes.

#### Scenario: Edicion desde el CMS
- **WHEN** una persona autorizada define o elimina el rol breve de un profesional
- **THEN** el JSON conserva el cambio y el hero usa el valor o su fallback sin afectar el rol completo

#### Scenario: Campo breve vacio o invalido
- **WHEN** un JSON incluye `mobileRole` con un valor que no es texto no vacio
- **THEN** la carga falla con un error que identifica el profesional y el campo invalido

### Requirement: Superficie glass legible
El badge SHALL usar una superficie glassmorphism coherente con el design system y MUST conservar separacion visual y contraste legible sobre heroes claros, oscuros o multicolor sin ocultar informacion mediante transparencia excesiva.

#### Scenario: Hero fotografico con detalle detras del badge
- **WHEN** nombres y roles se superponen a una zona visualmente compleja de la imagen
- **THEN** el fondo translúcido, blur, borde y sombras mantienen el texto legible y distinguen el badge de la fotografia

#### Scenario: Navegador compatible con backdrop filter
- **WHEN** el navegador soporta `backdrop-filter` o su variante WebKit
- **THEN** el badge aplica blur y saturacion sin alterar la estructura, el foco ni la semantica del contenido
