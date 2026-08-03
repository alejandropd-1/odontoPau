## ADDED Requirements

### Requirement: Fuente canonica de articulos
El sistema SHALL cargar articulos tipados desde archivos JSON ubicados recursivamente bajo `src/data/articulos` y SHALL considerar el slug como identificador publico unico.

#### Scenario: Carga de un articulo valido
- **WHEN** existe un JSON valido en una carpeta de categoria
- **THEN** el loader lo incorpora con su ruta de origen y relacion con tratamientos

#### Scenario: Slug duplicado
- **WHEN** dos documentos declaran el mismo slug
- **THEN** la validacion tecnica falla antes de publicar

### Requirement: Control de visibilidad publica
El sistema MUST excluir del build de produccion, listados, sitemap y relaciones publicas cualquier articulo cuyo estado no sea `published`. Los builds de preview MAY generar una ruta directa no indexable para revisar borradores autorizados, sin incluirlos en listados, sitemap ni relaciones publicas.

#### Scenario: Articulo en borrador
- **WHEN** un articulo tiene estado `draft`, `clinical_review`, `technical_review` o `approved` en produccion
- **THEN** no aparece en ninguna superficie publica del build

#### Scenario: Articulo en preview
- **WHEN** Netlify construye un Deploy Preview o Branch Deploy autorizado
- **THEN** la ruta directa puede renderizar el borrador con `noindex`, aviso de estado y sin incorporarlo al listado o sitemap

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

### Requirement: Relacion con tratamientos
Cada articulo SHALL declarar uno o mas `serviceIds` validos y los tratamientos SHALL poder mostrar sus articulos publicados relacionados.

#### Scenario: Tratamiento relacionado
- **WHEN** un articulo publicado incluye el ID de un tratamiento existente
- **THEN** se muestra un enlace reciproco entre articulo y tratamiento

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

### Requirement: Edicion mediante Netlify Visual Editor
Los modelos de Stackbit MUST reflejar exactamente el contrato TypeScript y las paginas SHALL conservar las anotaciones necesarias para editar los JSON desde Netlify Visual Editor mediante la fuente Git existente.

#### Scenario: Edicion de una seccion
- **WHEN** un editor cambia una seccion desde Netlify Visual Editor
- **THEN** el cambio se guarda en el JSON correcto y se representa sin conversion manual
