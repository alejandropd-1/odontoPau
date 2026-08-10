## Why

El badge de profesionales ocupa demasiado alto sobre los heroes de tratamientos en mobile y, cuando hay dos personas o roles extensos, tapa el rostro principal de la imagen. La correccion debe preservar la atribucion profesional y el contenido completo en desktop, pero priorizar la fotografia y la lectura rapida entre 320 y 430 px.

## What Changes

- Incorporar una variante breve opcional del rol profesional para presentaciones compactas en mobile.
- Compactar avatares, espaciado, tipografia y superficie del badge compartido en todos los heroes de tratamientos.
- Reforzar la superficie compartida con un glassmorphism sobrio, translúcido y legible sobre fotografias claras u oscuras.
- Mantener nombres, roles completos y composicion vigente en tablet y desktop.
- Verificar servicios con cero, uno y multiples profesionales, sin overflow ni cobertura desproporcionada de la imagen.
- Fuera de alcance: cambiar asociaciones profesionales, credenciales clinicas, fotografias, heroes desktop, navegacion o modelos editoriales ajenos al rol breve.
- Riesgo clinico: una abreviacion puede alterar el sentido de una credencial. Solo se usaran textos breves explicitamente definidos y revisables; nunca se inferiran especialidades desde el nombre del tratamiento.
- Criterio de exito: en 320, 375, 390 y 430 px el badge conserva identidad y rol esencial, no desborda, deja visible el sujeto del hero y mantiene contraste sobre la superficie glass; desde tablet se mantiene el texto completo actual.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `profesionales-por-tratamiento`: el render responsive admite un rol breve confirmado para mobile y limita la superficie ocupada por el badge sin perder nombres, accesibilidad ni contenido completo en desktop.

## Impact

Se modificaran el contrato y loader de tratamientos, los JSON de servicios que declaran profesionales, `TreatmentDetailContent.tsx`, los estilos BEM de `_treatment-detail.scss` y las pruebas focalizadas correspondientes. No se agregan dependencias ni se modifican APIs externas, contenido de pacientes o infraestructura de publicacion.
