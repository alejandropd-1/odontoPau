## Context

El sitio publica contenido desde JSON bajo `src/data`, lo valida con loaders TypeScript y lo expone a Netlify Visual Editor mediante `GitContentSource` y modelos de Stackbit. Articulos e instrucciones ya usan renderizadores modulares y anotaciones `data-sb-object-id`/`data-sb-field-path`; tratamientos tambien son documentos, pero el modelo `CasoClinico` del CMS no representa todos los campos usados por los JSON actuales. La portada solo expone el hero, mientras encabezados de servicios, equipo y testimonios permanecen en componentes.

Los OpenSpecs archivados `crear-circuito-editorial-articulos-redes` y `crear-circuito-instrucciones-pacientes` ya fijaron JSON como fuente canonica, una plantilla modular unica, estados editoriales y preview obligatorio. El cambio activo `dinamizar-dashboard-editorial-con-supabase` mantiene Supabase como plano de control y excluye expresamente migrar el cuerpo clinico fuera de Git. El runner editorial local y las redes sociales son circuitos independientes.

Los editores previstos son personas autorizadas del equipo. Paula conserva autoridad sobre afirmaciones clinicas e imagenes; el responsable del sitio conserva la aprobacion final de preview, merge y publicacion. El CMS debe reducir la necesidad de editar codigo sin convertir el design system ni la publicacion en operaciones libres.

## Goals / Non-Goals

**Goals:**

- Hacer administrable desde Netlify Visual Editor todo contenido publico cotidiano que no requiera cambiar estructura o diseño.
- Mantener una unica plantilla adaptable para cada articulo, instruccion y tratamiento/especialidad.
- Garantizar paridad entre modelo CMS, tipo TypeScript, validador, JSON y renderizador.
- Omitir campos y modulos vacios sin placeholders, titulos huerfanos ni espacio reservado.
- Permitir crear documentos nuevos como borradores, ampliarlos con el tiempo y revisarlos en preview.
- Proteger estados, relaciones, activos, SEO, privacidad y aprobaciones con controles verificables.
- Mantener Git/JSON como unica autoridad del contenido publico y Supabase como plano operativo separado.

**Non-Goals:**

- Permitir que editores cambien grillas, breakpoints, colores, tipografia, animaciones o componentes desde el CMS.
- Crear tres plantillas de articulo, instruccion o tratamiento segun cantidad de contenido.
- Incorporar un campo de densidad que controle la maqueta.
- Migrar contenido publico a Supabase, un CMS headless nuevo, Markdown o MDX.
- Automatizar merge, deploy, publicacion, revision clinica o consentimiento.
- Resolver en este cambio el menu mobile, redes sociales, runner local o dashboard dinamico.

## Decisions

### Una plantilla por tipo y composicion por presencia

Articulo, instruccion y tratamiento/especialidad conservaran una unica plantilla. El renderizador decidira que mostrar segun la presencia de datos validos; no existira una variante `minima`, `intermedia` o `completa` en el documento. Un contenido podra crecer agregando modulos sin migracion, cambio de slug ni seleccion de otra maqueta.

Los campos estructurales minimos seran obligatorios para crear una pagina valida. Todo bloque editorial adicional sera opcional. Una lista vacia, un objeto incompleto o un string en blanco se normalizara como ausencia cuando sea seguro, o fallara validacion cuando represente un documento parcialmente cargado. El componente padre incluira titulo, superficie y espaciado solo cuando el bloque tenga contenido renderizable.

Alternativa descartada: tres modelos o presets obligatorios. Duplicarian decisiones de contenido, permitirian que un editor eligiera una densidad incorrecta y dificultarian ampliar un documento existente. Los presets podran evaluarse en el futuro solo como atajos de carga, nunca como variantes visuales ni requisito operativo.

### Contrato unico y paridad de esquema

Cada tipo de pagina tendra un contrato fuente compartido conceptualmente por:

1. interfaz o schema TypeScript;
2. validador de carga;
3. modelo Stackbit;
4. JSON persistido;
5. renderizador y anotaciones visuales.

Se inventariaran y reconciliaran todos los campos antes de habilitar escritura. Ninguna migracion del CMS se desplegara si un campo presente en JSON queda sin representar, porque guardar el documento podria producir perdida silenciosa. Las validaciones de contenido se ejecutaran tambien en build y no dependeran solo del formulario del CMS.

Alternativa descartada: mantener dos contratos manualmente sin auditoria de paridad. El desfase actual de `CasoClinico` demuestra que el formulario puede parecer valido y aun asi no cubrir el contenido real.

### Servicios, tratamientos y especialidades comparten entidad

El identificador tecnico continuara siendo `Tratamiento`, sus documentos permaneceran bajo `src/data/tratamientos` y las rutas seguiran en `/tratamientos/[id]`. El CMS usara una etiqueta editorial comprensible como `Especialidades y tratamientos`. No se creara un segundo modelo `Especializacion`, porque Ortodoncia, Ortopedia, Endodoncia, Estetica Dental, Pediatria y Rehabilitacion ya son instancias del mismo contrato.

El contrato completo incluira identidad, orden, categoria, nombre visible, hero, icono, profesionales, caracteristicas, casos clinicos y relaciones derivadas con articulos e instrucciones. Los casos clinicos admitiran los campos reales usados por el sitio, incluidas imagenes multiples, etiquetas, estado, desafio, diagnostico, duracion, solucion, caracteristicas de solucion y estadisticas. Ninguna seccion opcional se renderizara si su lista esta vacia.

Alternativa descartada: separar `Servicio`, `Especialidad` y `Tratamiento`. Introduciria tres fuentes para la misma navegacion y relaciones ambiguas con articulos e instrucciones.

### Contenido institucional estructurado

Los textos visibles y repetibles que hoy estan hardcodeados se moveran a documentos JSON apropiados. `HomePage` conservara hero y agregara encabezados o introducciones de secciones. La configuracion global alojara datos de contacto, ubicacion, etiquetas de navegacion y CTA estables cuando sean contenido y no logica. Equipo y testimonios usaran listas tipadas; testimonios conservaran el feature flag vigente y no se habilitaran por el solo hecho de ser editables.

Se evitara un constructor libre de paginas. El CMS editara contenido dentro de componentes aprobados; agregar una seccion nueva o alterar su orden estructural seguira siendo un cambio de codigo/OpenSpec.

Alternativa descartada: exponer cada string del JSX como campo aislado. Generaria una interfaz fragmentada y permitiria combinaciones que no respeten jerarquia, accesibilidad o tono.

### Campos controlados y referencias validas

Estados editoriales, tonos, categorias y otros conjuntos cerrados se mostraran como selectores. Las asociaciones a tratamientos usaran referencias o listas derivadas de documentos existentes cuando la integracion lo permita; como minimo, el build validara identidad y unicidad. Los campos de fecha usaran controles de fecha, los activos controles de imagen/archivo y los textos alternativos seran obligatorios para imagenes informativas.

Los documentos nuevos recibiran valores seguros: estado `draft`, identificador/slug validable y campos de publicacion vacios. Cambiar a `published` no sera suficiente por si solo: el validador exigira fecha, revisor, referencias validas y los datos obligatorios del tipo de contenido.

Alternativa descartada: conservar strings libres para estado, icono, tono o relaciones. Un error tipografico puede bloquear el build o producir contenido no relacionado.

### Activos administrables sin perder seguridad

El CMS cargara imagenes bajo `public/images` mediante el `assets` ya configurado. Videos y otros recursos descargables conservaran rutas publicas permitidas y validacion de existencia; si la interfaz de carga de Git CMS no resuelve un tipo de archivo, se documentara un ingreso controlado y el CMS editara su referencia sin aceptar URLs arbitrarias.

Cada activo informativo tendra texto alternativo y, cuando el contrato lo requiera, dimensiones. Las imagenes de pacientes solo se incorporaran despues de verificar autorizacion fuera del repositorio; el documento publico almacenara como maximo trazabilidad no sensible. El CMS no guardara consentimientos ni datos identificatorios.

### Edicion Git, preview y publicacion protegida

Netlify Visual Editor escribira sobre una rama de trabajo o flujo de cambios revisable. Cada operacion conservara autor y revision Git. El sitio mostrara borradores autorizados en Deploy Preview con `noindex` segun las reglas vigentes; produccion continuara incluyendo solo `published`.

El flujo sera: editar/crear en CMS como `draft` -> preview -> revision clinica/editorial/privacidad -> revision tecnica y visual -> aprobacion del responsable -> merge autorizado a `main` -> deploy de produccion -> verificacion. Despublicar se resolvera con un cambio de estado versionado y el mismo flujo, no mediante borrado fisico inmediato.

Supabase podra reflejar inventario, responsables y aprobaciones, pero no escribira el cuerpo JSON ni publicara. La reconciliacion del dashboard usara la revision Git para detectar diferencias. Este OpenSpec no depende de que Supabase este implementado para que el CMS funcione.

### Edicion visual y editor de contenido se complementan

Se preservaran y completaran anotaciones `data-sb-object-id` y `data-sb-field-path` para campos que puedan editarse de forma intuitiva sobre la pagina. Estructuras complejas, relaciones y metadatos se administraran desde Content Editor. No se forzara edicion inline cuando reduzca claridad o pueda seleccionar el documento equivocado.

### QA de combinaciones, no solo de paginas completas

Las pruebas cubriran matrices representativas: contenido minimo valido, bloques parciales, contenido completo, cero/uno/multiples profesionales, cero/uno/multiples casos, recursos ausentes, una o varias imagenes y textos largos. Cada combinacion se verificara entre 320 px y desktop para detectar overflow, encabezados vacios, superficies sin contenido, alturas artificiales y orden semantico incorrecto.

## Risks / Trade-offs

- [Guardar desde un modelo incompleto elimina datos existentes] -> Ejecutar inventario de paridad campo por campo, pruebas round-trip y backups Git antes de habilitar escritura.
- [Un campo opcional crea una seccion vacia] -> Centralizar predicados de contenido renderizable y probar combinaciones minimas y parciales.
- [Un editor publica por error] -> `draft` por defecto, selectores controlados, validacion de requisitos de publicacion, preview y merge humano obligatorio.
- [Terminologia Servicio/Especialidad/Tratamiento confunde] -> Mantener una entidad tecnica y acordar una unica etiqueta publica antes del release.
- [Demasiados campos vuelven dificil el CMS] -> Agrupar por identidad, contenido, relaciones, SEO y publicacion; usar ayuda breve y ocultar campos tecnicos constantes.
- [Carga de videos no soportada de forma segura por la UI] -> Mantener un flujo de activos controlado y validar extensiones/rutas antes de aceptar referencias.
- [Ediciones simultaneas producen conflictos Git] -> Trabajar sobre ramas, mostrar la revision base y resolver conflictos antes del merge.
- [Contenido institucional editable rompe el tono o accesibilidad] -> Usar modelos estructurados, limites claros y preview visual; no exponer estructura libre.
- [CMS y dashboard muestran estados diferentes] -> Distinguir estado Git/publico de estado operativo y reconciliar por revision/hash sin sincronizacion inversa automatica.

## Migration Plan

1. Congelar una fotografia de los contratos JSON actuales e inventariar campos del CMS, TypeScript, validadores y componentes.
2. Definir schemas finales y pruebas de paridad/round-trip sin modificar todavia los documentos de produccion.
3. Corregir primero modelos de articulos, instrucciones y tratamientos, especialmente `CasoClinico`, recursos y campos editoriales faltantes.
4. Agregar condicionales de renderizado para toda seccion opcional y verificar combinaciones minimas, parciales y completas.
5. Extraer contenido institucional hardcodeado hacia JSON tipado preservando exactamente el contenido y la presentacion aprobados.
6. Completar anotaciones visuales, controles, referencias, defaults de borrador y ayuda del CMS.
7. Probar edicion round-trip de copias de documentos existentes y creacion de un articulo, una instruccion y un tratamiento de prueba en rama/preview.
8. Ejecutar TypeScript, lint, build, validaciones OpenSpec, SEO, accesibilidad y revision visual responsive.
9. Obtener aprobacion de Paula para superficies clinicas y del responsable para UX editorial, preview y publicacion.
10. Habilitar el flujo a editores autorizados, documentar operacion y verificar el primer cambio real de punta a punta.

Rollback: revertir el commit o deploy de los modelos y restaurar los JSON desde Git. Si el CMS no conserva campos durante round-trip, se deshabilitara temporalmente la escritura de ese modelo y se mantendra lectura/renderizado publico desde la revision anterior. Ninguna migracion eliminara contenido hardcodeado hasta verificar equivalencia en preview.

## Open Questions

- Definir con Paula la etiqueta publica unica entre `Especialidades`, `Servicios` y `Tratamientos`; la entidad tecnica seguira siendo `Tratamiento` cualquiera sea la eleccion.
- Confirmar que personas, ademas del responsable actual, recibiran acceso de edicion y que rol tendra cada una.
- Confirmar si los videos se cargaran directamente desde Visual Editor o mediante un ingreso de activos controlado con referencia editable desde el CMS.
- Enumerar en el relevamiento de implementacion que textos globales son contenido administrable y cuales deben permanecer como microcopy del sistema.
