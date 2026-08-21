# Clasificador del carril editorial

## `editorial-routine`

Puede usar el botón `Publicar cambios` solamente un snapshot cuyo diff contra `main` esté compuesto por rutas admitidas y contenido válido.

### Allowlist cerrada

- `src/data/home.json`
- `src/data/tratamientos-page.json`
- `src/data/articulos/**/*.json`
- `src/data/instrucciones/**/*.json`
- `src/data/tratamientos/**/*.json`
- `src/data/editorial/publication-request.json`
- `public/images/**`
- `public/videos/**`

Los archivos binarios nuevos sólo se admiten si están referenciados por un documento del snapshot y respetan los contratos de medios. La presencia en una carpeta permitida no basta por sí sola.

## `structural-change`

Se clasifica como estructural y se bloquea la publicación automática si aparece cualquier otra ruta o si la modificación requiere:

- código, componentes o estilos;
- schema, configuración o campos Tina;
- validadores, contratos o fixtures contractuales;
- navegación, rutas o comportamiento público;
- dependencias, lockfiles o scripts;
- workflows, Netlify, GitHub u otra infraestructura;
- OpenSpec o documentación de desarrollo.

## Condiciones de detención

El carril se detiene sin modificar `main` cuando:

1. el request es ausente, inválido, repetido o ya procesado;
2. existe otro request pendiente o procesándose;
3. `main` no es ancestro de `editorial/tina`;
4. el diff contiene una ruta fuera de la allowlist;
5. un medio no tiene referencia válida o metadata accesible;
6. un documento `published` no satisface fecha, revisión clínica o validación runtime;
7. cualquier gate falla;
8. falta una aprobación clínica o de imagen aplicable;
9. el PR o la sincronización no pueden completarse de forma inequívoca.

No se usa force-push, no se elimina contenido y no se intenta una integración parcial.
