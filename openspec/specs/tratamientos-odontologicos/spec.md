# tratamientos-odontologicos Specification

## Purpose
TBD - created by archiving change adoptar-tina-y-completar-cms-articulos-instrucciones. Update Purpose after archive.
## Requirements
### Requirement: Edición completa de tratamientos desde Tina
Tina SHALL exponer todos los campos persistidos de cada Tratamiento existente, incluidos metadata visible, icono, imagen hero, profesionales, características y casos clínicos completos. La colección MUST impedir altas, borrado y cambios accidentales de ruta durante este cambio.

#### Scenario: Edición de un tratamiento existente
- **WHEN** el editor modifica un campo raíz, un profesional, una característica o un dato de caso clínico
- **THEN** Tina conserva forma, orden, opcionales y ruta del JSON y la preview actualiza el mismo componente público

#### Scenario: Campo clínico opcional vacío
- **WHEN** un caso no contiene testimonio, diagnóstico, imágenes adicionales, solución o estadísticas
- **THEN** el JSON no recibe placeholders y la página no reserva espacio para ese bloque

### Requirement: Visual Editing en detalle y tarjetas de tratamientos
Cada Tratamiento SHALL resolver a `/tratamientos/{id}` para Visual Editing. Las tarjetas del Inicio y del índice SHALL consumir los mismos JSON y enlazar al documento correspondiente, evitando copias divergentes.

#### Scenario: Cambio de título o imagen
- **WHEN** el editor cambia el título, descripción o hero de un Tratamiento
- **THEN** la vista detalle reacciona en vivo y, una vez guardado y aprobado, Inicio e índice reutilizan el mismo valor

### Requirement: Artículo canónico para cada caso clínico
Cada caso clínico mostrado por un Tratamiento SHALL resolver un Artículo disponible mediante `articleSlug`. La tarjeta SHALL enlazar directamente al Artículo y el sistema MUST NOT renderizar una segunda ficha pública con cuerpo, captions o metadata divergentes. Las URL históricas de casos MAY conservarse únicamente como redirecciones permanentes de compatibilidad y MUST quedar fuera de navegación y sitemap.

#### Scenario: Caso con artículo relacionado
- **WHEN** un caso define un `articleSlug` enrutable
- **THEN** la tarjeta abre `/articulos/{articleSlug}` como única ficha pública del caso

#### Scenario: Acceso por una URL histórica
- **WHEN** se solicita `/tratamientos/{id}/casos/{casoId}` para un caso con Artículo resoluble
- **THEN** el sistema redirige permanentemente al Artículo canónico y no entrega contenido ni metadata alternativos

#### Scenario: Caso sin artículo canónico resoluble
- **WHEN** `articleSlug` está ausente o no resuelve un artículo disponible
- **THEN** la tarjeta no muestra un enlace vacío ni apunta a una ruta legacy y la auditoría editorial informa la relación faltante antes de publicar
