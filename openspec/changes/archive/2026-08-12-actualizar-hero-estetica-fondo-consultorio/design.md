## Context

Estética Dental declara `/images/estetica-dental-hero.webp` como `heroImage`. Ese único dato alimenta el hero del detalle mediante `TreatmentDetailContent` y la portada del archivo mediante `src/app/tratamientos/page.tsx`, por lo que no hace falta duplicar asignaciones. El activo vigente es una composición cuadrada de la paciente sobre un consultorio generado; las fuentes aprobadas son la fotografía original de la paciente y `main/1.jpeg`, una fotografía real del consultorio.

## Goals / Non-Goals

**Goals:**

- Reemplazar sólo el entorno de la fotografía y preservar la identidad y anatomía de la paciente.
- Integrar el consultorio real con un desenfoque suave que mantenga a la paciente como foco.
- Producir un WebP suficientemente grande y optimizado para los dos consumidores actuales.
- Mantener una única referencia de datos y verificar recortes desktop/mobile.

**Non-Goals:**

- Rediseñar componentes, badges, textos o estilos.
- Cambiar otros heroes o introducir un pipeline general de imágenes.
- Versionar las fotografías fuente externas ni documentación de consentimiento.
- Publicar antes de las aprobaciones humanas.

## Decisions

### D1. Edición de identidad preservada con dos fuentes explícitas

La fotografía de la paciente es el objetivo de edición y `main/1.jpeg` es el fondo de composición. La edición debe conservar rostro, sonrisa, dentición visible, cabello, cuerpo, ropa, pose y encuadre de la paciente; sólo puede sustituir el parque y armonizar bordes, luz y profundidad.

La alternativa de generar nuevamente a la persona se descarta porque altera identidad y rasgos clínicamente visibles.

### D2. Un único activo consumido desde `heroImage`

Se mantendrá una sola imagen web en `public/images` y la referencia del tratamiento seguirá siendo la fuente común. Si el archivo conserva el nombre actual no hará falta tocar el JSON; si se crea una versión sucesora, se actualizará solamente `heroImage`.

La alternativa de crear imágenes separadas para archivo y detalle se descarta porque contradice la sincronización vigente y puede volver a generar desfases.

### D3. Encuadre maestro cuadrado con centro de interés protegido

La composición conservará resolución cuadrada y a la paciente en una zona segura para `object-fit: cover`. El consultorio tendrá detalle suficiente para ser reconocible, pero un desenfoque óptico suave reducirá competencia visual. La verificación final se hará sobre los componentes reales, no sobre el archivo aislado.

### D4. Reemplazo reversible

La versión anterior permanece recuperable en Git. No se incluyen las fuentes de `G:` en el repositorio y no se altera metadata editorial ajena. El Deploy Preview será la evidencia para aprobación antes del merge.

## Risks / Trade-offs

- [La edición modifica rasgos o dentición] → comparar visualmente con la fuente original y rechazar cualquier variante que no preserve identidad.
- [El fondo real no coincide en luz o perspectiva] → usar integración leve y desenfoque, sin inventar equipamiento adicional.
- [El recorte mobile oculta el rostro o el badge lo cubre] → probar entre 320 y 430 px además de desktop.
- [Una imagen clínica se publica sin autorización] → mantener pendientes las aprobaciones de Paula y Alejandro; no mergear ni desplegar a producción.
- [Peso excesivo] → exportar WebP optimizado y revisar dimensiones/peso antes del preview.

## Migration Plan

1. Generar una variante no destructiva y compararla con las fuentes.
2. Integrar el activo aprobado localmente bajo `public/images`.
3. Ejecutar validaciones automáticas y comprobar ambas rutas en desktop/mobile.
4. Publicar sólo un Deploy Preview para revisión humana.
5. Ante rechazo, restaurar el activo anterior desde Git o iterar sin tocar producción.

## Open Questions

Ninguna técnica. La aceptación visual y la autorización de uso siguen siendo decisiones humanas.
