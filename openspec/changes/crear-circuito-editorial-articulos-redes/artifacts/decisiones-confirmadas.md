# Decisiones confirmadas - 2026-08-02

## Operacion editorial

- Instagram y Facebook son los canales prioritarios; LinkedIn queda fuera del circuito habitual.
- La cadencia inicial es un articulo cada dos semanas y dos piezas sociales por semana.
- Paula aprueba datos clinicos, tecnica, resultados e imagenes. El responsable del sitio aprueba el preview y la publicacion.
- La conversion principal se medira por clics y consultas a WhatsApp con origen identificable.
- Cada OpenSpec tendra su propia rama `codex/`. Las publicaciones simples relacionadas pueden agruparse en un lote editorial trazable.

## Material recibido

- Endodoncia/caso-01: los archivos `antes.jpeg` y `despues.jpeg` definen la asociacion visual. La autorizacion de uso fue confirmada y el caso queda seleccionado como piloto inicial.
- Ortodoncia Invisible/caso-01: los archivos `antes.jpeg` y `despues.jpeg` definen la asociacion visual. El servicio conserva el nombre `Ortodoncia Invisible` y el contenido no mencionara `convencional`.
- Rehabilitacion/caso-02: los archivos `1.jpeg` a `5.jpeg` definen el orden. Es una rehabilitacion del sector anterosuperior con remocion de coronas viejas, opacificacion de pernos metalicos y colocacion final de coronas libres de metal.
- Odontopediatria/caso-01: la autorizacion de uso fue confirmada. La imagen horizontal `caso-01-a.jpg` ya tiene anteojos oscuros tipo emoji sobre los ojos de la menor y queda como candidata. La cobertura visual reduce exposicion, pero no convierte la foto en anonima.
- Las etiquetas `Antes` y `Despues` son opcionales. Una imagen unica no mostrara etiqueta.

## Cambios estructurales separados

- `Implantes Dentales` se renombra a `Rehabilitación` mediante el OpenSpec `integrar-lote-clinico-y-rehabilitacion`, incluyendo identificador, carpetas, rutas, enlaces, SEO, Stackbit y redirección de la URL anterior.
- La carga flexible de profesionales, galerias y etiquetas opcionales se tratara en otro OpenSpec antes de incorporar todos los casos.

## Piloto pendiente

Endodoncia/caso-01 queda seleccionado como piloto por tener antes/despues, autorizacion confirmada y una descripcion clinica concreta: tratamiento endodontico en necrosis pulpar con tecnica mecanizada. Todo dato no informado se omitira hasta la revision de Paula.

## Validación de las tres maquetas - 2026-08-04

- Prueba 1, Endodoncia/necrosis pulpar: Paula aprobó la estructura, el contenido y las imágenes. Pasa a `technical_review`; todavía requiere la revisión visual y autorización de publicación del responsable del sitio.
- Prueba 2, Estética dental/blanqueamiento ambulatorio: Paula aprobó la estructura, el contenido y las imágenes. Pasa a `technical_review`; todavía requiere la revisión visual y autorización de publicación del responsable del sitio.
- Prueba 3, Estética dental/resina a mano alzada en pieza 11: Paula aprobó la estructura y el contenido, pero rechazó la imagen porque no corresponde al traumatismo de la pieza 11. Permanece en `draft`, bloqueada para publicación hasta recibir y validar la imagen correcta. No se reemplazará por una imagen inferida o similar.

## Produccion y CMS

- El proyecto `paulagualtieri.com` se despliega en Netlify desde GitHub.
- `main` es la rama de produccion.
- El sitio usa Netlify Visual Editor con la integracion Git/Stackbit existente; no se incorporara otro CMS.
- Los cambios se revisaran en una rama y preview antes de autorizar el merge a `main`.

## Testimonios

- La seccion de testimonios y su enlace de navegacion quedan temporalmente ocultos.
- El componente, los estilos, los datos y los modelos del editor visual se conservan para una futura reactivacion.
- La visibilidad se controla desde una unica opcion en `src/config/site-features.ts`.

## Maquetacion de articulos

- Una imagen se presenta junto al encabezado en escritorio y apilada en mobile.
- Dos o tres imagenes se presentan dentro del cuerpo como galeria ordenada y no se duplica una imagen en el encabezado.
- Las secciones de contenido forman un unico cuerpo editorial; los encabezados conservan la jerarquia sin crear una tarjeta por seccion.
- El cuerpo y los medios usan el ancho disponible del contenedor, mientras que los parrafos mantienen una medida maxima de lectura.
