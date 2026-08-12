> **Cambio retirado sin implementar el 2026-08-12.** Las 96 tareas se conservan sin marcar como evidencia historica; no representan trabajo pendiente vigente. El reemplazo y la justificacion estan documentados en `retirement.md`.

## 1. Relevamiento, decisiones y linea base

- [ ] 1.1 Registrar la rama, revision Git, estado de Netlify Visual Editor y lista de cambios OpenSpec activos antes de implementar.
- [ ] 1.2 Inventariar todos los documentos bajo `src/data`, sus loaders TypeScript, modelos Stackbit, componentes y anotaciones `data-sb-*` asociadas.
- [ ] 1.3 Construir una matriz campo por campo para `HomePage`, `Articulo`, `Instruccion`, `Tratamiento`, `CasoClinico`, profesionales y configuracion global, marcando datos soportados, requeridos, opcionales y hoy hardcodeados.
- [ ] 1.4 Identificar cualquier campo que pudiera perderse al abrir y guardar desde el CMS y bloquear la escritura de ese modelo hasta corregirlo.
- [ ] 1.5 Confirmar con Paula y el responsable la etiqueta publica unica entre `Especialidades`, `Servicios` y `Tratamientos`, manteniendo `Tratamiento` como entidad tecnica.
- [ ] 1.6 Confirmar editores autorizados, roles, rama de trabajo de Netlify y responsables de aprobacion clinica, visual y de merge.
- [ ] 1.7 Delimitar integracion con `dinamizar-dashboard-editorial-con-supabase`: Git/JSON publica; Supabase solo refleja inventario, responsables, aprobaciones y divergencias.
- [ ] 1.8 Delimitar integracion con `preparar-runner-editorial-lm-studio-link` y `preparar-redes-sociales-editoriales` sin incorporar automatizacion ni derivados a este cambio.
- [ ] 1.9 Ejecutar este programa mediante los slices definidos en el roadmap, cada uno en su rama `change/<id-exacto-del-openspec>`, sin mezclar implementaciones de slices distintos.

## 2. Contratos, validacion y pruebas de paridad

- [ ] 2.1 Definir o consolidar contratos TypeScript para todas las entidades editables sin cambiar el contenido publico aprobado.
- [ ] 2.2 Alinear validadores de articulos con fechas, estados, descargas, fuentes, imagenes, relaciones y secciones admitidas.
- [ ] 2.3 Alinear validadores de instrucciones con pasos, matrices, avisos, texto, recursos, galerias, imagenes y videos descargables.
- [ ] 2.4 Alinear el contrato de tratamientos y casos clinicos con todos los campos presentes en los JSON vigentes, incluidas imagenes multiples, etiquetas, desafio, diagnostico, duracion, solucion, caracteristicas y estadisticas.
- [ ] 2.5 Definir contratos tipados para contenido institucional, equipo, testimonios y configuracion global que se extraera del codigo.
- [ ] 2.6 Implementar validacion de IDs y slugs unicos, estados permitidos, fechas de publicacion, relaciones a tratamientos y rutas de activos existentes.
- [ ] 2.7 Implementar una comprobacion automatizada de paridad entre campos editables del CMS y contratos de datos soportados.
- [ ] 2.8 Implementar fixtures o pruebas de round-trip para documentos minimos, completos y con todos los campos vigentes.
- [ ] 2.9 Ejecutar el round-trip sin cambios sobre copias de los JSON actuales y comprobar que no haya perdida, conversion ni reordenamiento semantico.

## 3. Infraestructura comun de Netlify Visual Editor

- [ ] 3.1 Reorganizar `stackbit.config.ts` por modelos de pagina, objetos reutilizables y conjuntos controlados sin cambiar la fuente `GitContentSource`.
- [ ] 3.2 Configurar valores constantes ocultos, defaults seguros de `draft`, labels editoriales claros y ayudas breves para campos clinicos o tecnicos.
- [ ] 3.3 Reemplazar strings libres por selectores para estados, tonos, categorias y demas valores cerrados soportados por el CMS.
- [ ] 3.4 Configurar referencias o selecciones validadas para tratamientos relacionados y evitar IDs tipeados sin asistencia cuando la API del CMS lo permita.
- [ ] 3.5 Configurar controles apropiados para fechas, imagenes, archivos, listas ordenables, dimensiones y texto alternativo.
- [ ] 3.6 Verificar y completar `siteMap` y rutas de creacion para documentos nuevos de articulos, instrucciones y tratamientos.
- [ ] 3.7 Preservar `data-sb-object-id` y completar `data-sb-field-path` solo en campos aptos para edicion inline.
- [ ] 3.8 Verificar que metadata, relaciones y estructuras complejas se puedan editar desde Content Editor aunque no tengan control inline.
- [ ] 3.9 Documentar explicitamente que el CMS edita contenido aprobado dentro de componentes existentes y no diseño, estructura ni responsive.

## 4. Articulos autoadministrables

- [ ] 4.1 Completar el modelo `Articulo` con todos los campos del contrato vigente, incluidas `createdAt`, descargas y cualquier metadata actualmente ausente del CMS.
- [ ] 4.2 Completar y validar los modelos de imagenes, fuentes y todos los tipos de seccion admitidos por el renderizador.
- [ ] 4.3 Configurar creacion de articulos nuevos con slug unico, estado `draft`, tratamiento relacionado e imagen principal con alt.
- [ ] 4.4 Eliminar cualquier dependencia de una variante manual minima, intermedia o completa; conservar una unica plantilla basada en presencia de contenido.
- [ ] 4.5 Auditar cada modulo y submodulo para que solo renderice titulo, contenedor y espaciado cuando tenga contenido valido.
- [ ] 4.6 Verificar que un articulo minimo valido mantenga composicion completa sin facts, abordaje, FAQ, fuentes, estadisticas, comparacion, galeria, cita o descargas.
- [ ] 4.7 Verificar que un articulo existente pueda ampliarse desde el CMS sin cambiar ID, slug, URL, canonical ni plantilla.
- [ ] 4.8 Probar edicion inline de titulo, resumen y secciones, y edicion desde Content Editor de relaciones, metadata y publicacion.

## 5. Instrucciones autoadministrables

- [ ] 5.1 Completar el modelo `Instruccion` y sus objetos para cubrir exactamente pasos, matrices, avisos, texto, recurso individual, galeria e imagen social.
- [ ] 5.2 Configurar creacion de instrucciones nuevas con categoria, slug, estado `draft`, tratamiento opcional y al menos un modulo valido.
- [ ] 5.3 Validar tonos, grupos de matriz y requisitos internos de cada tipo de seccion antes de guardar o construir.
- [ ] 5.4 Verificar carga o referencia controlada de imagenes y videos bajo rutas publicas permitidas, con portada, alt y accion accesible.
- [ ] 5.5 Auditar el renderizado para ocultar por completo matrices, estados, recursos, galerias y acciones ausentes.
- [ ] 5.6 Probar una instruccion solo con pasos, una solo con matriz y una completa con galeria, avisos y videos.
- [ ] 5.7 Verificar que una instruccion existente pueda incorporar un recurso posterior sin cambiar slug, URL ni plantilla.
- [ ] 5.8 Probar edicion inline de contenido visible y Content Editor para metadata, relaciones, activos y estado.

## 6. Tratamientos, especialidades y casos clinicos

- [ ] 6.1 Renombrar solo las etiquetas editoriales y publicas aprobadas, manteniendo el modelo tecnico `Tratamiento`, IDs y rutas canonicas existentes.
- [ ] 6.2 Completar el modelo CMS de tratamiento para identidad, orden, categoria, hero, icono, profesionales, caracteristicas y casos clinicos.
- [ ] 6.3 Reemplazar el modelo desactualizado `CasoClinico` por el contrato completo sin eliminar soporte necesario durante la migracion de campos legados.
- [ ] 6.4 Verificar round-trip de cada tratamiento actual, con especial atencion a Rehabilitacion y cualquier caso que use imagenes multiples o solucion estructurada.
- [ ] 6.5 Configurar altas, edicion, reordenamiento y omision de profesionales con nombre, rol confirmado, retrato y alt obligatorios.
- [ ] 6.6 Hacer condicional el bloque `Aspectos de...` para que desaparezca completamente cuando `features` este ausente o vacio.
- [ ] 6.7 Auditar profesionales, casos clinicos, articulos relacionados e instrucciones relacionadas para ocultar encabezados y superficies sin elementos elegibles.
- [ ] 6.8 Configurar preparacion de nuevos tratamientos en rama/preview sin incorporarlos a navegacion, sitemap ni produccion antes de la aprobacion.
- [ ] 6.9 Validar metadata, canonical, imagen social, orden, relaciones y accesibilidad de cada tratamiento desde el contenido administrable.

## 7. Portada y contenido institucional

- [ ] 7.1 Inventariar textos visibles hardcodeados en portada, servicios, equipo, testimonios, contacto, ubicacion, navegacion y footer.
- [ ] 7.2 Clasificar cada texto como contenido administrable o microcopy estructural que debe permanecer en codigo.
- [ ] 7.3 Extender `HomePage` o documentos institucionales tipados para encabezados e introducciones aprobados sin crear un page builder libre.
- [ ] 7.4 Migrar encabezados de servicios y demas contenido aprobado desde JSX a JSON preservando texto y presentacion actuales.
- [ ] 7.5 Modelar integrantes del equipo con nombre, rol, retrato, alt y campos realmente usados por el componente.
- [ ] 7.6 Modelar testimonios sin reactivarlos; conservar el feature flag y exigir material aprobado antes de exponer la seccion o su enlace.
- [ ] 7.7 Modelar datos de contacto, ubicacion, CTA y etiquetas globales que deban mantenerse sin cambios de codigo.
- [ ] 7.8 Completar anotaciones visuales y verificar que listas vacias o secciones deshabilitadas no generen contenedores ni navegacion huerfana.

## 8. Activos, privacidad y operacion editorial

- [ ] 8.1 Confirmar el flujo real de carga de imagenes desde Visual Editor y verificar rutas, nombres, dimensiones y optimizacion resultantes.
- [ ] 8.2 Probar si el CMS admite carga segura de MP4; si no, documentar un ingreso controlado de videos con referencia editable y validada.
- [ ] 8.3 Exigir alt para imagenes informativas y documentar cuando corresponde alt vacio para activos puramente decorativos.
- [ ] 8.4 Incorporar controles que impidan versionar URLs arbitrarias, rutas inexistentes o extensiones no admitidas.
- [ ] 8.5 Documentar el control externo de consentimiento y la prohibicion de almacenar pacientes, historias clinicas o evidencia privada en Git/CMS.
- [ ] 8.6 Preparar una guia breve para crear, editar, ampliar, previsualizar, enviar a revision, publicar y despublicar contenido.
- [ ] 8.7 Documentar resolucion de conflictos Git y recuperacion mediante historial ante una edicion incorrecta.
- [ ] 8.8 Verificar que el dashboard Supabase pueda detectar la nueva revision de contenido sin habilitar sincronizacion inversa ni publicacion.

## 9. QA tecnico, visual, SEO y accesibilidad

- [ ] 9.1 Ejecutar pruebas de paridad y round-trip sobre todos los modelos editables y revisar el diff de cada documento.
- [ ] 9.2 Ejecutar `pnpm exec tsc --noEmit` y corregir todos los errores atribuibles al cambio.
- [ ] 9.3 Ejecutar `pnpm run lint` y corregir todos los errores atribuibles al cambio.
- [ ] 9.4 Ejecutar `pnpm run build` con configuracion equivalente a preview y comprobar loaders, rutas, metadata y sitemap.
- [ ] 9.5 Ejecutar `openspec validate --all --strict` y corregir cualquier incumplimiento de specs o artefactos.
- [ ] 9.6 Verificar en desktop y mobile, desde 320 px, articulos minimos/parciales/completos e instrucciones con cada composicion representativa.
- [ ] 9.7 Verificar en desktop y mobile tratamientos con cero, uno y multiples profesionales, casos y caracteristicas.
- [ ] 9.8 Verificar portada e institucionales con contenido largo, listas vacias, testimonios deshabilitados y zoom sin desborde horizontal.
- [ ] 9.9 Auditar teclado, foco, encabezados, listas semanticas, contraste, nombres accesibles y movimiento reducido en superficies modificadas.
- [ ] 9.10 Auditar title, description, canonical, Open Graph, Twitter, imagen social, datos estructurados y sitemap para contenido publicado y preview.
- [ ] 9.11 Comprobar que borradores y estados de revision permanezcan fuera de produccion y no indexables en preview segun las reglas vigentes.
- [ ] 9.12 Ejecutar una prueba de edicion real de punta a punta en Netlify Visual Editor para articulo, instruccion, tratamiento y contenido institucional.

## 10. Preview, aprobaciones y publicacion

- [ ] 10.1 Preparar commit y push en la rama del cambio solo despues de revisar alcance y diff, sin incluir archivos ajenos.
- [ ] 10.2 Generar Deploy Preview y verificar que los cambios del CMS se guarden en la rama prevista y no en `main`.
- [ ] 10.3 Obtener aprobacion clinica de Paula para contratos, campos visibles, imagenes y pruebas de contenido clinico.
- [ ] 10.4 Recopilar y resolver las observaciones editoriales y visuales de Alejandro sobre la experiencia CMS y todas las combinaciones responsive.
- [ ] 10.5 Verificar accesos y roles de editores sin compartir credenciales ni habilitar permisos de merge innecesarios.
- [ ] 10.6 Corregir observaciones y repetir TypeScript, lint, build, OpenSpec, preview y QA afectado.
- [ ] 10.7 Preparar el Draft PR y dejar CI y Deploy Preview de la revision exacta listos para la validacion humana, sin merge ni archive.
- [ ] 10.8 Documentar el checklist postproduccion para rutas, contenido, SEO, activos y ausencia de borradores sin ejecutarlo antes del merge.
- [ ] 10.9 Ejecutar en preview una primera edicion real supervisada desde el CMS y confirmar el circuito editar -> preview -> aprobar, sin publicar produccion.

## 11. Mantenimiento y cierre

- [ ] 11.1 Registrar modelos, campos opcionales, valores controlados y responsables en la documentacion operativa del proyecto.
- [ ] 11.2 Documentar como agregar un nuevo tipo de modulo mediante OpenSpec sin crear variantes de plantilla ni campos hardcodeados.
- [ ] 11.3 Incorporar la comprobacion de paridad CMS/TypeScript/JSON al mantenimiento habitual para evitar futuros desfases.
- [ ] 11.4 Registrar cualquier limitacion real de Netlify Visual Editor, especialmente creacion de archivos, referencias y carga de videos, con su procedimiento seguro.
- [ ] 11.5 Revisar que las delta specs esten listas para sincronizarse mediante OpenSpec Archive despues de la validacion final, sin ejecutar el archive anticipadamente.
- [ ] 11.6 Preparar el commit y push selectivos de la revision final en la rama correspondiente, sin incluir archivos ajenos ni otros OpenSpecs.

## 12. Validacion final de Alejandro

- [ ] 12.1 Alejandro revisa el programa CMS en el Deploy Preview final, confirma la aprobacion clinica aplicable y autoriza el commit de cierre, el OpenSpec Archive y la preparacion del merge a `main`. Esta tarea es exclusivamente manual y ningun agente puede marcarla.
