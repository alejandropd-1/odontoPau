## ADDED Requirements

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

### Requirement: Ficha propia para cada caso clínico
Cada caso clínico SHALL conservar una ruta pública propia y un renderizador reactivo con marcas granulares vinculado a su objeto dentro del Tratamiento. La entrada visual estándar MAY continuar en la ruta del Tratamiento mientras los casos permanezcan anidados en el mismo documento. Una relación opcional con un Artículo MUST NOT reemplazar la ficha ni provocar una redirección automática.

#### Scenario: Caso con artículo relacionado
- **WHEN** un caso define un `articleSlug` enrutable
- **THEN** la tarjeta abre primero `/tratamientos/{id}/casos/{casoId}` y la ficha ofrece el artículo como acceso secundario

#### Scenario: Edición visual del caso
- **WHEN** el editor modifica título, descripción, imágenes, contexto, abordaje o métricas del caso
- **THEN** las superficies del caso reaccionan en vivo y cada marcador editable apunta al campo anidado correspondiente sin duplicar el documento

#### Scenario: Caso sin artículo relacionado
- **WHEN** `articleSlug` está ausente o no resuelve un artículo disponible
- **THEN** la ficha permanece completa y no muestra un enlace vacío ni reserva espacio para él
