## Context

Todos los detalles de tratamiento reutilizan `TreatmentDetailContent` y `_treatment-detail.scss`. El badge se posiciona sobre una imagen 4:5 y hoy presenta siempre `professional.role`; en mobile ocupa todo el ancho interior y los roles extensos aumentan su altura hasta cubrir el sujeto del hero. Los profesionales se cargan desde JSON, se validan en `src/data/tratamientos.ts` y se editan mediante el modelo `TreatmentProfessional` de Stackbit.

## Goals / Non-Goals

**Goals:**

- Reducir de forma consistente el alto y peso visual del badge entre 320 px y el breakpoint `md`.
- Conservar nombre, retrato y rol esencial de cada profesional en todos los servicios.
- Mantener el rol completo vigente desde `md` y ofrecer una abreviacion editorial explicita cuando sea necesaria.
- Preservar BEM, tokens SASS, accesibilidad, carga JSON y edicion desde el CMS.

**Non-Goals:**

- Cambiar asociaciones profesionales, credenciales clinicas, retratos o recortes de heroes.
- Ocultar profesionales o inferir especialidades a partir del tratamiento.
- Redisenar el hero desktop, la navegacion o el resto de las secciones.

## Decisions

### Rol breve opcional en la fuente editorial

`TratamientoProfessional` incorporara `mobileRole?: string`. El renderer usara ese texto solo debajo de `md` y conservara `role` en desktop. Si `mobileRole` no existe, mostrara `role`, por lo que los tratamientos con textos ya breves no necesitan duplicar contenido. El loader rechazara valores presentes pero vacios y Stackbit lo expondra como campo opcional.

Se descarta truncar con CSS porque ocultaria palabras sin control semantico, y se descarta generar abreviaciones desde codigo porque podria inventar o deformar credenciales clinicas.

### Dos variantes semanticas controladas por CSS

El componente renderizara una variante mobile y otra desktop del rol, ambas derivadas de datos confirmados. Las media queries alternaran `display` en el mismo breakpoint que ya gobierna el badge. Los nombres y el `aria-label` de la lista permanecen unicos; no se duplican retratos ni elementos de lista.

Se descarta resolverlo con deteccion JavaScript del viewport para evitar hidratacion divergente y listeners innecesarios.

### Compactacion visual compartida

Debajo de `md` se reduciran inset, padding, gap, avatar, tipografia e interlineado usando tokens existentes. La grilla seguira siendo `auto minmax(0, 1fr)` y los roles conservaran wrapping. Desde `md` se mantienen las dimensiones actuales para no alterar la composicion aprobada de desktop.

### Glassmorphism con contraste estable

La superficie combinara un degradado blanco translúcido, `backdrop-filter` con blur y saturacion, borde claro y una sombra exterior con brillo interior. La opacidad sera suficientemente alta para conservar la lectura sobre los seis heroes y se incluira `-webkit-backdrop-filter` para Safari. Se descarta un vidrio mas transparente o coloreado porque haria depender el contraste del encuadre fotografico.

## Risks / Trade-offs

- [El rol breve altera una credencial] → Definirlo manualmente en JSON, exponerlo en el CMS y mantener siempre el rol completo como fuente principal y variante desktop.
- [Dos variantes de texto quedan desincronizadas] → Hacer `mobileRole` opcional, usar fallback al rol completo y limitar su uso a textos que realmente necesitan abreviacion.
- [La compactacion vuelve ilegible el badge en 320 px] → Mantener tamaños accesibles, wrapping y verificar 320, 375, 390 y 430 px con uno y dos profesionales.
- [El badge sigue tapando un rostro por el encuadre particular] → Verificar todos los heroes; esta correccion no cambia fotos ni `object-position`, por lo que un caso residual se tratara como ajuste visual separado.
- [El vidrio pierde contraste sobre una zona compleja] → Mantener una base blanca dominante, sombra de separacion y verificar visualmente fotografias claras, oscuras y multicolor.

## Migration Plan

1. Extender contrato, validacion y modelo CMS con `mobileRole` opcional.
2. Agregar las abreviaciones fieles de Roberto en Estetica Dental y Rehabilitacion y de Maria Emilia en Pediatria.
3. Renderizar las variantes responsive y compactar estilos mobile compartidos.
4. Ejecutar validaciones tecnicas y revisar todos los heroes en los viewports definidos.
5. Publicar primero en Deploy Preview. El rollback consiste en revertir el cambio; los JSON siguen siendo compatibles porque el campo es opcional.

## Open Questions

Ninguna para implementar. La aceptacion visual final corresponde a Alejandro sobre el Deploy Preview.
