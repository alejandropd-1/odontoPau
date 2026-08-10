## Context

El sitio requiere actualizaciones puntuales de contenido, correcciones clínicas en la redacción, y la integración de un nuevo caso clínico de ortopedia (imágenes e historia). El desafío técnico principal radica en el procesamiento de imágenes (recorte para ocultar identidad en un caso existente, y adición de anteojos/cambio de fondo vía IA en los hero de pediatría y estética), junto con la integración de descargas directas para los recursos de ortodoncia invisible.

## Goals / Non-Goals

**Goals:**
- Asegurar que la información clínica y descriptiva (JSONs y arrays estáticos) esté perfectamente alineada con las indicaciones del cliente.
- Procesar, nombrar secuencialmente e integrar las imágenes del nuevo caso de Ortopedia y las modificaciones de Hero.
- Implementar una galería visual ordenada con dos descargas directas para los videos de la instrucción KeepSmiling.
- Mantener un único título canónico por artículo y reutilizarlo en el caso clínico que lo enlaza.

**Non-Goals:**
- No se migrará a Supabase en este alcance (eso será un OpenSpec futuro).
- No se creará una funcionalidad global de galería descargable generalizada; la descarga será específica para los recursos mencionados.

## Decisions

**Image Processing & AI Generation:**
Para los casos de alteración de imagen (anteojos en pediatría, consultorio en estética, y ocultar rostro en estética):
- El recorte se realizará mediante CSS (`object-position` o `clip-path`) o mediante un pre-procesamiento del archivo local si es más óptimo, priorizando la solución que mejor resguarde la privacidad.
- Las imágenes hero se generarán y reemplazarán manteniendo las mismas proporciones para no afectar el diseño.

**Downloadable Resources:**
Para permitir la consulta visual y descarga de los recursos KeepSmiling:
- El modelo de instrucciones admitirá una galería opcional de recursos, sin reemplazar la imagen usada para metadata social.
- Las seis imágenes fuente (01 y 05–09) se presentarán con numeración visual consecutiva 01–06 junto al bloque “Hábitos durante el tratamiento”; en desktop la columna de hábitos será más angosta y la galería ocupará la columna principal.
- Las tarjetas 02–05 mantendrán su imagen como enlace de previsualización, sin un botón textual “Ver completa”.
- En las tarjetas visuales 01 y 06, la portada enlazará a la reproducción del MP4 y mostrará un indicador de play centrado. Un control circular de descarga, compuesto solo por ícono y con nombre accesible, se superpondrá arriba a la derecha y conservará el atributo HTML `download`.
- La tarjeta 01 apuntará a `paso-a-paso-video.mp4` y la tarjeta 06, usada como tapa, a `video-brochute.mp4`. Las tarjetas 02–05 no mostrarán acciones ni indicadores de video.
- Al retirar los botones del cuerpo, las seis tarjetas compartirán la misma estructura y las cards de cada fila conservarán igual altura.
- En mobile ambos bloques volverán a una sola columna sin generar desborde horizontal.

**Static Data Strategy:**
- Toda modificación de texto se hará in-place en los archivos `src/data/tratamientos/*.json`, `src/data/articulos.ts` y componentes TSX, siguiendo la arquitectura estática actual del proyecto.

## Risks / Trade-offs

- **Risk:** Las nuevas imágenes generadas por IA pueden diferir sutilmente de la estética fotográfica original del sitio.
  **Mitigation:** Se revisarán con el cliente y se utilizarán prompts que fuercen fotorrealismo médico y tonos de color consistentes con la paleta de la web.
- **Risk:** El atributo `download` puede tener comportamientos erráticos en navegadores si las imágenes están servidas desde un dominio cruzado (CORS).
  **Mitigation:** Como los recursos gráficos están alojados estáticamente en el mismo origen (`/images/...`), el atributo `download` funcionará de forma nativa.
