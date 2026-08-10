# downloadable-resources Specification

## Purpose
TBD - created by archiving change content-updates-and-ortopedia-case. Update Purpose after archive.
## Requirements
### Requirement: Galería descargable de la instrucción KeepSmiling
Las imágenes fuente 01 y 05–09 de la instrucción KeepSmiling SHALL renderizarse con numeración visual consecutiva 01–06 como una secuencia responsiva junto al bloque “Hábitos durante el tratamiento”, con una columna izquierda de menor ancho en desktop. No SHALL mostrarse ningún botón textual debajo de las portadas y las cards de una misma fila SHALL conservar igual altura.

#### Scenario: Descarga de imagen
- **WHEN** un usuario abre la instrucción de alineadores KeepSmiling
- **THEN** puede recorrer las seis portadas numeradas 01–06 en orden y distinguir portada, pasos y video brochure.

#### Scenario: Descarga de videos
- **WHEN** el usuario activa el ícono de descarga superpuesto arriba a la derecha de la tarjeta visual 01
- **THEN** recibe `paso-a-paso-video.mp4`.
- **WHEN** el usuario activa el ícono de descarga superpuesto arriba a la derecha de la tarjeta visual 06
- **THEN** recibe `video-brochute.mp4`.

#### Scenario: Identificación y reproducción de videos
- **WHEN** el usuario consulta las tarjetas visuales 01 y 06
- **THEN** ambas muestran un indicador de reproducción centrado sobre la portada y la propia portada abre el video correspondiente.

#### Scenario: Acciones intermedias ocultas
- **WHEN** el usuario consulta las tarjetas visuales 02–05
- **THEN** no se muestran botones “Ver completa”, indicadores de video ni acciones de descarga.

#### Scenario: Composición responsiva
- **WHEN** la guía se visualiza en desktop
- **THEN** la galería ocupa la columna derecha junto al bloque de hábitos, que utiliza una columna más angosta.
- **WHEN** la guía se visualiza en mobile
- **THEN** ambos bloques se apilan sin overflow horizontal.
