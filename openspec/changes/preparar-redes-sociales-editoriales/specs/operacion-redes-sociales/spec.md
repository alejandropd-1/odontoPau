## ADDED Requirements

### Requirement: Artículo aprobado como fuente editorial
Cada pieza social MUST derivarse de un artículo en estado `published` y MUST conservar una referencia trazable a su slug, URL canónica y versión o fecha de fuente.

#### Scenario: Cambio del artículo fuente
- **WHEN** cambia un dato clínico, una recomendación o una imagen del artículo fuente
- **THEN** toda pieza pendiente se marca para regeneración o nueva revisión antes de utilizarse

### Requirement: Formato condicionado por activos autorizados
El circuito SHALL seleccionar post simple, carrusel, Stories o Reel únicamente cuando existan activos autorizados y suficientes para ese formato.

#### Scenario: Sólo existe una imagen aprobada
- **WHEN** un artículo dispone de una única imagen autorizada
- **THEN** el paquete propone un post simple y no inventa imágenes, etapas ni comparaciones faltantes

### Requirement: Adaptación por canal
Cada derivado SHALL adaptar hook, longitud, estructura, CTA y hashtags a Instagram o Facebook y MUST funcionar de manera independiente.

#### Scenario: Carrusel para Instagram
- **WHEN** se prepara un carrusel para Instagram
- **THEN** el paquete especifica portada, contenido slide por slide, caption, CTA, hashtags y activos asociados

### Requirement: Revisión clínica y visual
Ninguna pieza social MUST considerarse aprobada hasta que Paula valide los datos clínicos y las imágenes utilizadas.

#### Scenario: Afirmación no presente en el artículo
- **WHEN** una pieza introduce un resultado, tiempo, diagnóstico o recomendación no confirmado por la fuente
- **THEN** la pieza se bloquea y vuelve a revisión clínica

### Requirement: Aprobación editorial y publicación externa separadas
El responsable del sitio MUST aprobar copy, formato, calendario y enlaces antes de la entrega, y la publicación o programación en cuentas externas MUST requerir una autorización explícita adicional.

#### Scenario: Paquete editorial aprobado
- **WHEN** copy, imágenes y calendario reciben aprobación
- **THEN** el paquete puede marcarse como entregado pero no obtiene permiso automático para publicar en una cuenta social

### Requirement: Privacidad y consentimiento
Cada activo de paciente MUST contar con autorización confirmada y MUST excluir datos identificatorios, documentos de consentimiento y metadatos sensibles del repositorio.

#### Scenario: Autorización ambigua
- **WHEN** no puede confirmarse el permiso de uso de una imagen
- **THEN** el activo queda bloqueado y no participa de ningún derivado social

### Requirement: Enlaces medibles
Las piezas que dirijan tráfico SHALL usar la URL canónica del artículo con identificación UTM consistente para canal, campaña y pieza.

#### Scenario: Preparación de un CTA hacia el sitio
- **WHEN** una pieza invita a leer un artículo o consultar por WhatsApp
- **THEN** el paquete incluye el enlace final verificable y sus parámetros de atribución acordados

### Requirement: Calendario y trazabilidad
Cada paquete SHALL registrar canal, formato, artículo fuente, versión, estado, responsables de aprobación y fecha planificada sin almacenar información sensible.

#### Scenario: Pieza reprogramada
- **WHEN** cambia la fecha o el canal previsto
- **THEN** el historial conserva la planificación anterior y registra la nueva decisión

### Requirement: Aprendizaje continuo
El circuito SHALL registrar únicamente las métricas disponibles por pieza y SHALL usar esos resultados como insumo para priorizar futuros temas y formatos.

#### Scenario: Revisión mensual
- **WHEN** se revisan las piezas del período
- **THEN** se documentan alcance, interacción, clics, consultas y aprendizajes disponibles sin inventar datos faltantes

### Requirement: Accesibilidad de piezas
El paquete SHALL incluir texto alternativo o descripción visual para las imágenes y SHALL mantener textos legibles, contraste suficiente y subtítulos cuando un video contenga información hablada relevante.

#### Scenario: Reel con explicación hablada
- **WHEN** un Reel incluye información clínica mediante voz
- **THEN** el entregable incorpora subtítulos revisados y una descripción accesible del contenido visual
