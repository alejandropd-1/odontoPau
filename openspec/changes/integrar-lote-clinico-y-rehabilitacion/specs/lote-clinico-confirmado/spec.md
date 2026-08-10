## ADDED Requirements

### Requirement: Asociación trazable de cada caso
El sistema SHALL usar únicamente imágenes provenientes de la carpeta confirmada para cada caso y SHALL conservar una relación inequívoca entre el slug, el identificador editorial y los activos públicos.

#### Scenario: Corrección de la pieza 11
- **WHEN** se renderiza el artículo `resina-mano-alzada-pieza-11` en preview
- **THEN** todas sus imágenes provienen de `estetica_dental/caso-02` y ningún activo de `caso-03` aparece en la página

#### Scenario: Caso pediátrico autorizado
- **WHEN** se renderiza el caso de odontopediatría
- **THEN** se utiliza solamente la variante anonimizada autorizada y la imagen no recibe una etiqueta temporal no confirmada

### Requirement: Contenido proporcional a la evidencia
Cada artículo SHALL mostrar sólo módulos respaldados por la información recibida y SHALL omitir diagnósticos, duración, materiales, técnica, resultados o secuencias no confirmadas.

#### Scenario: Caso con información breve
- **WHEN** un caso sólo cuenta con una frase y una o dos imágenes confirmadas
- **THEN** la página muestra resumen, registro visual y CTA sin módulos vacíos ni texto de relleno

#### Scenario: Caso de ortodoncia
- **WHEN** se presenta el caso asociado al servicio Ortodoncia Invisible
- **THEN** el texto no afirma que el tratamiento fue invisible o convencional ni identifica un aparato no confirmado

#### Scenario: Segundo lote sin texto clínico
- **WHEN** un caso nuevo sólo cuenta con imágenes dentro de una carpeta de servicio confirmada
- **THEN** el artículo describe el registro de forma neutral, permanece en revisión técnica y omite diagnóstico, técnica, materiales, resultados y secuencia temporal

### Requirement: Control editorial antes de producción
Los artículos incorporados por este cambio MUST permanecer en un estado de revisión no publicado hasta que se registren las aprobaciones clínica, editorial, técnica y visual.

#### Scenario: Build de producción
- **WHEN** el sitio se construye en contexto de producción
- **THEN** los artículos en `technical_review` no aparecen en archivos, tratamiento relacionado, sitemap ni rutas públicas generadas

#### Scenario: Build de preview
- **WHEN** el sitio se construye en contexto de deploy preview
- **THEN** los artículos de revisión son accesibles para control y muestran su estado editorial sin ser indexables

### Requirement: Privacidad y accesibilidad de imágenes
Cada imagen SHALL contar con dimensiones explícitas y texto alternativo descriptivo que no exponga identidad ni infiera información clínica; las imágenes de menores MUST aplicar la protección visual acordada.

#### Scenario: Una sola imagen
- **WHEN** un artículo contiene una única imagen sin fase temporal confirmada
- **THEN** la plantilla no muestra etiquetas “Antes” o “Después” y mantiene una lectura accesible

#### Scenario: Galería sin secuencia confirmada
- **WHEN** un artículo contiene tres imágenes cuyo orden clínico no fue informado
- **THEN** la galería conserva un orden técnico estable pero no muestra etiquetas ni captions que impliquen fases del tratamiento

### Requirement: Hero de Ortopedia basado en activos pertinentes
El hero de Ortopedia SHALL utilizar un collage local optimizado construido sólo con fotografías de aparatología y MUST excluir capturas de redes, productos de blanqueamiento, pacientes y elementos ajenos al servicio.

#### Scenario: Render del hero de Ortopedia
- **WHEN** se abre `/tratamientos/ortopedia`
- **THEN** el hero muestra el collage de aparatos, mantiene un recorte legible en desktop y mobile y no presenta texto incrustado en la imagen

### Requirement: Voz institucional en contenido público
Los artículos, casos e instrucciones SHALL describir la información confirmada sin atribuir el relato a una persona específica y SHALL conservar la revisión nominal únicamente como metadato editorial interno.

#### Scenario: Texto proveniente de una revisión interna
- **WHEN** un dato clínico fue confirmado por una profesional del equipo
- **THEN** la copia pública expresa el dato directamente y no muestra fórmulas como “Paula informó”, “Paula indicó” o “según Paula”

#### Scenario: Caso con evidencia breve
- **WHEN** un artículo cuenta con poco texto clínico confirmado
- **THEN** la página usa una voz cercana y natural, evita narrar el proceso editorial o describir mecánicamente las imágenes y conserva únicamente afirmaciones prudentes respaldadas por el servicio

### Requirement: Portadas de tratamientos sincronizadas
El archivo de tratamientos SHALL usar como portada el `heroImage` vigente de cada servicio y MUST NOT mantener una asignación visual duplicada que pueda quedar desactualizada.

#### Scenario: Cambio de hero
- **WHEN** se actualiza el `heroImage` de un tratamiento
- **THEN** la tarjeta correspondiente en `/tratamientos` muestra el mismo activo en el siguiente build

### Requirement: Una experiencia canónica por caso documentado
Cada caso MAY declarar el slug de su artículo y el sistema SHALL priorizar la plantilla editorial cuando ese artículo sea accesible en el entorno actual.

#### Scenario: Artículo disponible
- **WHEN** un caso enlazado cuenta con un artículo accesible en preview o publicado en producción
- **THEN** la tarjeta del tratamiento y la ruta histórica del caso llevan al artículo modular

#### Scenario: Artículo todavía no publicable
- **WHEN** el artículo enlazado no está disponible en producción
- **THEN** la ficha histórica del caso permanece accesible como respaldo y no conduce a una ruta inexistente
