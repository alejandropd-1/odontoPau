## Context

El sitio ya carga tratamientos e instrucciones desde JSON recursivos, genera rutas estaticas con Next.js App Router y expone esos documentos en Netlify Visual Editor mediante Stackbit y una fuente Git. Netlify despliega `main` a produccion. No existe una coleccion editorial general. El paquete de AutoClaw propone un blog funcional en concepto, pero usa rutas en ingles, estilos ajenos al sistema, no integra listado/sitemap/tratamientos y mezcla borradores humanos con contenido marcado como publicado.

Los actores son Paula como autoridad clinica y proveedora de imagenes, el responsable del sitio como aprobador de publicacion y Codex como estratega, redactor, adaptador social y mantenedor tecnico. El repositorio publico no es una historia clinica ni un archivo de consentimientos.

## Goals / Non-Goals

**Goals:**

- Incorporar articulos sin cambiar el stack ni agregar un CMS nuevo.
- Hacer visible la relacion entre cada articulo y uno o mas tratamientos.
- Impedir que un borrador aparezca en rutas, listados o sitemap.
- Mantener una fuente editorial unica y derivar desde ella las piezas sociales.
- Integrar controles clinicos, de privacidad, tecnicos y visuales al flujo normal.
- Dejar cada cambio funcional y editorial relevante documentado en OpenSpec y Git.

**Non-Goals:**

- Automatizar la publicacion en Instagram, Facebook u otras cuentas en esta fase.
- Interpretar radiografias o confirmar diagnosticos por IA sin validacion profesional.
- Guardar nombres, fichas clinicas, consentimientos firmados o metadatos sensibles.
- Reemplazar Stackbit, introducir MDX o agregar una base de datos de contenido.

## Decisions

### Ruta y nomenclatura en espanol

Se usaran `/articulos` y `/articulos/[slug]`. Mantiene coherencia con `/tratamientos` e `/instrucciones` y evita introducir `/blog` como excepcion idiomatica.

Alternativa descartada: anidar cada articulo bajo `/tratamientos/[id]/articulos`. Un articulo puede vincularse con mas de un servicio y necesita una URL canonica estable.

### JSON como fuente publica canonica

Los documentos viviran en `src/data/articulos/<categoria>/<slug>.json` y se cargaran recursivamente con un modulo tipado. Los Markdown de trabajo o textos recibidos seran insumos editoriales, no contenido publicado.

Alternativa descartada: MDX. Agregaria otro pipeline y otra experiencia CMS sin necesidad demostrada.

### Estados editoriales explicitos

El modelo usara un estado editorial y solo `published` sera visible publicamente. Los estados previstos son `draft`, `clinical_review`, `technical_review`, `approved` y `published`. Las fechas y marcas de aprobacion seran no sensibles; los documentos de consentimiento permaneceran fuera del repositorio.

### Modelo de secciones estructurado

El articulo admitira bloques tipados para introduccion, texto, lista, comparacion, cifras, galeria antes/despues, preguntas frecuentes, cita y CTA. El renderizador no interpretara Markdown embebido dentro de strings. Stackbit y TypeScript compartiran la misma forma de datos, incluidas las filas de tablas.

### Imagenes y privacidad

Las imagenes aprobadas se copiaran a `public/images/articulos/<slug>/` con nombres semanticos, dimensiones conocidas y texto alternativo. Se eliminaran metadatos innecesarios antes de incorporarlas. El registro publico solo afirmara que el uso fue aprobado; no incluira identidad ni evidencia privada del consentimiento.

Las etiquetas visuales como `Antes` y `Despues` seran opcionales por imagen. Una imagen unica no mostrara etiqueta, y una secuencia numerada conservara su orden sin que el sistema infiera etapas clinicas. Los nombres recibidos (`antes`, `despues` o una secuencia numerica) sirven para asociar los archivos durante el ingreso; antes de versionarlos se copiaran con nombres semanticos.

### Integracion y presentacion

Se reutilizaran Navbar, Footer, Breadcrumb, ShareArticleMenu, `next/image`, metadata de Next, sitemap, anotaciones Stackbit y SASS BEM con tokens existentes. Los tratamientos mostraran articulos relacionados mediante `serviceIds`.

El CMS existente no se reemplazara. Los modelos nuevos se incorporaran a `stackbit.config.ts` y sus documentos seguiran siendo archivos JSON versionados por Git y editables desde Netlify Visual Editor.

El detalle usara una composicion editorial adaptable. Con una imagen, la pieza visual acompana al encabezado; con dos o mas, el encabezado sera tipografico y las imagenes se presentaran en una galeria ordenada dentro del cuerpo para evitar duplicaciones. Las secciones de texto compartiran una unica superficie visual: el contenedor y los medios usaran el ancho disponible, mientras los parrafos conservaran una medida maxima legible.

### Derivados sociales separados

Los paquetes sociales versionados se guardaran fuera de `src/data` para que no formen parte del build publico. Cada paquete identificara el articulo fuente, canal, formato, copy, assets, CTA, estado de aprobacion y fecha planificada.

### Trazabilidad con OpenSpec y Git

Cada cambio OpenSpec se trabajara en una rama `codex/` propia. Los cambios estructurales tendran una propuesta independiente; las publicaciones simples relacionadas podran agruparse en un OpenSpec editorial por lote. Ninguna rama se mezclara, publicara o desplegara sin el checkpoint y la aprobacion correspondientes.

El flujo de salida sera: rama OpenSpec -> commit/push autorizado -> Deploy Preview de Netlify -> revision clinica, editorial, tecnica y visual -> merge autorizado a `main` -> deploy de produccion -> verificacion posterior. Un cambio del CMS que escriba en Git debera respetar las mismas puertas y estados editoriales.

### Decisiones editoriales iniciales confirmadas

- Canales prioritarios: Instagram y Facebook. LinkedIn queda fuera del circuito habitual por ahora.
- Cadencia inicial: un articulo cada dos semanas y dos derivados sociales por semana, ajustable segun la capacidad real y las metricas.
- Aprobaciones: Paula valida hechos, tecnica e imagenes; el responsable del sitio da la aprobacion final de Git/preview/publicacion.
- Conversion primaria: clics y consultas a WhatsApp atribuibles al articulo o a la pieza social.
- `Ortodoncia Invisible` conserva su nombre. El caso recibido no usara la palabra `convencional` en el contenido.
- `Implantes Dentales` pasara a llamarse `Rehabilitacion` mediante un OpenSpec estructural separado que incluya rutas y redireccion.
- Endodoncia/caso-01 es el piloto inicial. La autorizacion de uso esta confirmada y el contenido se limitara a necrosis pulpar y tecnica mecanizada hasta recibir o validar otros datos.
- Rehabilitacion/caso-02 corresponde a una rehabilitacion del sector anterosuperior: remocion de coronas viejas, opacificacion de pernos metalicos y colocacion final de coronas libres de metal.

## Risks / Trade-offs

- [La IA infiere un diagnostico desde una imagen] -> Tratar el analisis visual como orientacion y bloquear publicacion hasta la validacion escrita de Paula.
- [Una imagen identifica a un paciente] -> Revisar encuadre, metadatos y consentimiento antes de copiarla al repositorio.
- [Una promesa absoluta genera riesgo clinico o reputacional] -> Prohibir garantias y exigir revision de cifras, duraciones y testimonios.
- [El estado editorial se cambia por error] -> `draft` por defecto, preview obligatorio y aprobacion explicita antes de pasar a `published`.
- [JSON estructurado ofrece menos libertad que Markdown] -> Mantener bloques suficientes y agregar nuevos tipos solo mediante cambios versionados.
- [Las redes quedan desactualizadas respecto del articulo] -> Regenerar derivados desde la fuente canonica cuando cambie contenido clinico relevante.

## Migration Plan

1. Crear loader, modelos y rutas sin incorporar articulos publicados.
2. Integrar estilos, SEO, sitemap, Stackbit y enlaces desde tratamientos.
3. Adaptar un articulo piloto de AutoClaw con `draft` y nuevas imagenes aprobadas.
4. Ejecutar chequeos estaticos, build y preview responsive/social.
5. Obtener aprobacion clinica y editorial; corregir hasta aprobar.
6. Publicar el piloto y observar enlaces, indexacion y conversion a WhatsApp.
7. Migrar los restantes borradores uno por uno, nunca en bloque sin revision.

Rollback: revertir la publicacion cambiando el estado del articulo y redesplegando. Si la infraestructura falla, retirar enlaces de navegacion/listados conservando los JSON como borradores.

## Open Questions

No quedan preguntas abiertas para seleccionar el piloto. Los detalles no informados de Endodoncia, como pieza dentaria, sintomas, tiempos, materiales, evolucion o testimonio, se omitiran del borrador y solo se agregaran si Paula los confirma durante la revision clinica.
