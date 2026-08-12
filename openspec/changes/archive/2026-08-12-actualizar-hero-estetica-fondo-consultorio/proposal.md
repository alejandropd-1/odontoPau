## Why

El hero vigente de Estética Dental conserva correctamente a la paciente, pero usa un consultorio generado que no representa el espacio real de Paula. La portada debe recomponerse con la fotografía real `main/1.jpeg`, manteniendo la identidad de la paciente y la lectura responsive ya aprobada.

## What Changes

- Reemplazar únicamente el fondo del hero de Estética Dental por el consultorio real aportado por Paula, con desenfoque suave e integración coherente de luz y perspectiva.
- Conservar sin cambios reconocibles el rostro, sonrisa, cuerpo, cabello, ropa y pose de la paciente de la fotografía fuente.
- Generar un activo web optimizado, sin texto incrustado ni marcas, reutilizado por el detalle de Estética Dental y su tarjeta en el archivo de tratamientos.
- Verificar el encuadre en desktop y mobile, el texto alternativo existente y la ausencia de regresiones visuales.
- Mantener pendiente la aprobación humana de Paula sobre la imagen clínica y la validación visual final de Alejandro antes de publicar.
- Fuera de alcance: cambiar textos, profesionales, layout, demás tratamientos o el programa CMS/Tina.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `image-processing`: el hero de Estética Dental debe usar como fondo el consultorio real aprobado, preservando la identidad de la paciente y funcionando en ambos puntos de consumo.

## Impact

- Activo principal: `public/images/estetica-dental-hero.webp` o una versión sucesora referenciada por el tratamiento.
- Consumidores: `/tratamientos` y `/tratamientos/estetica-dental`, ambos derivados del `heroImage` del JSON del tratamiento.
- No se agregan dependencias ni se altera el contrato editorial.
- Riesgo clínico y de privacidad: la publicación exige consentimiento verificable y aprobación de Paula; el repositorio no almacenará documentación privada de consentimiento.
- Criterio de éxito: ambas páginas muestran la misma composición optimizada, la paciente permanece reconocible y sin deformaciones, el consultorio corresponde a la foto provista y el recorte se mantiene legible entre 320 px y desktop.
