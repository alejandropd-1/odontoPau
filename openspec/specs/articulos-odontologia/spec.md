# articulos-odontologia Specification

## Purpose
TBD - created by archiving change crear-circuito-editorial-articulos-redes. Update Purpose after archive.
## Requirements
### Requirement: Fuente canonica de articulos
El sistema SHALL cargar articulos tipados desde archivos JSON ubicados recursivamente bajo `src/data/articulos` y SHALL considerar el slug como identificador publico unico.

#### Scenario: Carga de un articulo valido
- **WHEN** existe un JSON valido en una carpeta de categoria
- **THEN** el loader lo incorpora con su ruta de origen y relacion con tratamientos

#### Scenario: Slug duplicado
- **WHEN** dos documentos declaran el mismo slug
- **THEN** la validacion tecnica falla antes de publicar

### Requirement: Control de visibilidad publica
El sistema MUST excluir del build de produccion, listados, sitemap y relaciones publicas cualquier articulo cuyo estado no sea `published`. Los builds de preview MAY generar rutas no indexables para revisar contenido autorizado: los estados de revision distintos de `draft` MAY incorporarse a listados y relaciones editoriales de preview, mientras un `draft` puro MUST permanecer disponible solo por URL directa. Ningun contenido no publicado SHALL incorporarse al sitemap.

#### Scenario: Articulo en borrador
- **WHEN** un articulo tiene estado `draft`, `clinical_review`, `technical_review` o `approved` en produccion
- **THEN** no aparece en ninguna superficie publica del build

#### Scenario: Articulo en preview
- **WHEN** Netlify construye un Deploy Preview o Branch Deploy autorizado
- **THEN** la ruta directa puede renderizar el contenido con `noindex` y aviso de estado; los estados de revision pueden incorporarse a listados de preview, pero `draft` queda excluido y ninguno se agrega al sitemap

#### Scenario: Articulo publicado
- **WHEN** un articulo validado cambia a estado `published`
- **THEN** aparece en su detalle, listado, sitemap y tratamiento relacionado tras el build

### Requirement: Listado y detalle de articulos
El sitio SHALL ofrecer `/articulos` y `/articulos/[slug]` con navegacion, breadcrumb, fecha editorial, autor, tiempo de lectura, categorias, contenido estructurado y CTA.

#### Scenario: Navegacion desde el listado
- **WHEN** una persona selecciona una tarjeta de articulo
- **THEN** llega a la URL canonica del detalle correspondiente

#### Scenario: Slug inexistente
- **WHEN** se solicita un slug no publicado o inexistente
- **THEN** el sitio responde con la experiencia 404 existente

### Requirement: Archivos paginados de articulos
El archivo general y los archivos por tratamiento SHALL ordenar los articulos elegibles del mas reciente al mas antiguo y SHALL mostrar como maximo nueve tarjetas por pagina. La primera pagina SHALL conservar una URL sin sufijo y las siguientes SHALL usar `/pagina/[numero]` con canonical propio.

#### Scenario: Archivo general con hasta nueve articulos
- **WHEN** existen nueve articulos elegibles o menos
- **THEN** `/articulos` muestra todos y no renderiza controles de paginacion

#### Scenario: Archivo general con diez articulos
- **WHEN** existe un decimo articulo elegible
- **THEN** `/articulos` muestra los nueve mas recientes y ofrece navegacion a `/articulos/pagina/2`

#### Scenario: Archivo por tratamiento
- **WHEN** se visita `/articulos/tratamiento/[serviceId]`
- **THEN** se muestran unicamente articulos asociados a ese tratamiento, con la misma paginacion de nueve elementos y URLs estaticas enlazables

#### Scenario: Navegacion accesible entre paginas
- **WHEN** una persona usa teclado o tecnologia asistiva en un archivo con varias paginas
- **THEN** encuentra un `nav` etiquetado, enlaces anterior/siguiente y numerados, y la pagina actual indicada semanticamente

### Requirement: Relacion con tratamientos
Cada articulo SHALL declarar uno o mas `serviceIds` validos y los tratamientos SHALL poder mostrar hasta tres articulos elegibles relacionados.

#### Scenario: Tratamiento relacionado
- **WHEN** un articulo publicado incluye el ID de un tratamiento existente
- **THEN** se muestra un enlace reciproco entre articulo y tratamiento

#### Scenario: Tratamiento con mas de tres articulos
- **WHEN** un tratamiento posee cuatro o mas articulos elegibles
- **THEN** muestra solo los tres mas recientes y una accion hacia su archivo completo por tratamiento

#### Scenario: Tratamiento con hasta tres articulos
- **WHEN** un tratamiento posee tres articulos elegibles o menos
- **THEN** muestra todos y no presenta una accion redundante hacia el archivo completo

### Requirement: SEO y distribucion web
Cada articulo publicado SHALL incluir titulo, descripcion, canonical, OpenGraph, Twitter, imagen social, fecha de publicacion y datos estructurados apropiados; SHALL formar parte del sitemap.

#### Scenario: Preview social
- **WHEN** una plataforma consulta la URL de un articulo publicado
- **THEN** recibe titulo, descripcion e imagen absoluta correspondientes al articulo

### Requirement: Imagenes accesibles y responsive
Las imagenes de articulos SHALL renderizarse con `next/image`, dimensiones o contenedor estable, `sizes` y texto alternativo descriptivo sin revelar identidad innecesaria.

#### Scenario: Visualizacion movil
- **WHEN** el articulo se abre en un viewport movil
- **THEN** las imagenes y comparaciones se adaptan sin desborde ni salto de layout evitable

### Requirement: Maquetacion editorial adaptable
El detalle de articulo SHALL presentar un cuerpo editorial continuo, con el ancho visual disponible para medios y componentes y una medida de lectura acotada para parrafos extensos.

#### Scenario: Articulo con una imagen
- **WHEN** el articulo tiene una unica imagen clinica
- **THEN** el encabezado permanece centrado y la imagen se muestra inmediatamente debajo, centrada y sin duplicarse en el cuerpo

#### Scenario: Articulo con dos imagenes
- **WHEN** el articulo tiene dos imagenes clinicas
- **THEN** el encabezado prioriza titulo y resumen, y las imagenes se muestran inmediatamente debajo como un par ordenado

#### Scenario: Articulo con tres imagenes
- **WHEN** el articulo tiene tres imagenes clinicas
- **THEN** las imagenes forman una grilla de tres columnas en escritorio y se apilan en mobile respetando su orden editorial

#### Scenario: Lectura del cuerpo
- **WHEN** el articulo contiene varias secciones de texto
- **THEN** las secciones pertenecen a una unica superficie visual, conservan jerarquia de encabezados y no se presentan como tarjetas independientes

#### Scenario: Articulo con poco contenido textual
- **WHEN** un caso aprobado solo dispone de un resumen breve y una o mas imagenes
- **THEN** el encabezado, la galeria principal y el CTA conservan una composicion completa sin exigir bloques clinicos no confirmados

#### Scenario: Imagen social de un borrador en preview
- **WHEN** una plataforma consulta la URL de un articulo no publicado dentro de un Deploy Preview
- **THEN** recibe una URL absoluta de imagen accesible en ese mismo deploy mientras la canonical permanece en produccion y la pagina continua no indexable

#### Scenario: Cierre editorial con fuentes y tratamiento
- **WHEN** un articulo incluye etiquetas, fuentes y uno o mas tratamientos relacionados
- **THEN** el detalle los agrupa en un cierre compacto, jerarquico y responsive que conserva las fuentes visibles y ofrece una accion clara para continuar navegando

### Requirement: Plantilla clinica modular unica
El sistema SHALL usar una unica plantilla de articulo con un resumen de caso compuesto por contexto, datos confirmados y abordaje opcional. Cada submodulo MUST renderizarse unicamente cuando contiene informacion y MUST mantener una jerarquia semantica y visual consistente.

#### Scenario: Caso minimo con una imagen
- **WHEN** el articulo solo dispone de contexto confirmado, una imagen y CTA
- **THEN** el resumen ocupa el ancho util, no muestra tarjetas ni panel de abordaje vacios y la pagina conserva una composicion completa

#### Scenario: Caso intermedio con datos parciales
- **WHEN** el articulo dispone de contexto, uno o mas datos confirmados y una o dos imagenes pero no tiene un abordaje detallado
- **THEN** las tarjetas presentes se adaptan al ancho disponible y no se reserva espacio para el panel naranja ausente

#### Scenario: Caso completo
- **WHEN** el articulo dispone de contexto, datos confirmados, abordaje, contenido educativo y fuentes o preguntas frecuentes
- **THEN** el resumen se presenta en dos columnas en escritorio, el abordaje usa el panel de acento y todos los modulos se apilan en orden logico en mobile

#### Scenario: Informacion agregada despues de la revision
- **WHEN** un editor completa un submodulo anteriormente ausente
- **THEN** el articulo incorpora ese contenido dentro de la misma plantilla y contrato de datos sin migracion ni seleccion manual de maqueta

### Requirement: Edicion de articulos mediante TinaCMS
Los modelos Tina MUST reflejar el contrato runtime de Artículos, incluidos imágenes, fuentes, descargas, relaciones y todas las variantes de sección. La edición SHALL persistir directamente en el JSON correcto de una rama no productiva y MUST conservar ausencia, valores y orden sin conversión manual.

#### Scenario: Edicion de una seccion
- **WHEN** un editor cambia, agrega o reordena una sección desde Tina
- **THEN** el cambio se guarda en el documento correcto y el round-trip conserva el resto del Artículo

#### Scenario: Descarga opcional
- **WHEN** un Artículo no define descargas o fuentes
- **THEN** Tina no genera listas vacías y la página no renderiza sus encabezados ni superficies

#### Scenario: Edicion visual de un modulo
- **WHEN** un editor modifica un campo raíz o un módulo discriminado del Artículo desde la vista visual
- **THEN** la página reacciona en vivo, el campo seleccionado se vincula al control correcto y el normalizador conserva la forma JSON original

#### Scenario: Edición de una imagen compuesta
- **WHEN** el editor abre una imagen del artículo o de una galería
- **THEN** identifica archivo, alt, dimensiones, etiqueta y epígrafe como una unidad, recibe ayuda contextual y puede regresar claramente al formulario que la contiene sin perder cambios

