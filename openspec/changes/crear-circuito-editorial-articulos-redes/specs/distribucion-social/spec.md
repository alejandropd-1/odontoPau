## ADDED Requirements

### Requirement: Articulo como fuente editorial
Los derivados sociales MUST generarse desde la version clinicamente aprobada del articulo y MUST conservar un enlace trazable a esa fuente.

#### Scenario: Cambio del articulo fuente
- **WHEN** cambia un dato clinico, resultado o recomendacion del articulo
- **THEN** los derivados pendientes se marcan para revision o regeneracion

### Requirement: Paquete multiformato
Para cada articulo aprobado, Codex SHALL poder producir un paquete con copy de Instagram/Facebook, carrusel slide por slide, Stories y guion breve de Reel cuando las imagenes disponibles lo permitan.

#### Scenario: Solo hay una imagen aprobada
- **WHEN** el paquete no alcanza para un carrusel o video
- **THEN** se propone un post simple y no se inventan assets faltantes

#### Scenario: Existe secuencia antes y despues
- **WHEN** ambas imagenes estan correctamente asociadas y aprobadas
- **THEN** el paquete puede incluir una comparacion con contexto y aclaracion de que los resultados varian por caso

### Requirement: Adaptacion por plataforma
Cada derivado SHALL funcionar de manera independiente y adaptar longitud, hook, formato, CTA y hashtags a la plataforma definida.

#### Scenario: Publicacion en Instagram
- **WHEN** se prepara un carrusel para Instagram
- **THEN** incluye hook inicial, narrativa por slides, caption, CTA y especificacion de assets

### Requirement: Aprobacion previa a redes
Ninguna pieza social MUST considerarse lista para programar hasta recibir aprobacion editorial y clinica sobre copy e imagenes.

#### Scenario: Copy con promesa absoluta
- **WHEN** una pieza usa expresiones como garantia, cero dolor o resultado asegurado
- **THEN** se bloquea y se reformula antes de su aprobacion

### Requirement: Enlaces y medicion
Las piezas que deriven trafico SHALL usar la URL canonica del articulo y SHALL permitir identificar el canal sin alterar la fuente editorial.

#### Scenario: Campana publicada
- **WHEN** se prepara el enlace de una pieza social
- **THEN** se agrega identificacion de canal/campana compatible con la medicion disponible

### Requirement: Aprendizaje continuo
El circuito SHALL registrar resultados disponibles por pieza y SHALL usar los aprendizajes para ajustar temas, hooks y formatos futuros.

#### Scenario: Revision periodica
- **WHEN** se realiza la revision mensual de contenido
- **THEN** se identifican piezas fuertes, piezas debiles, dudas recurrentes y oportunidades de actualizacion
