> **Estado: RETIRADO / NO IMPLEMENTADO (2026-08-12).** Este cambio fue reemplazado por `adoptar-tina-y-completar-cms-articulos-instrucciones` y los slices Tina posteriores. Sus delta specs de Stackbit/Netlify Visual Editor no se sincronizaron. Ver `retirement.md` para el registro de la decision.

## Why

El sitio ya usa contenido JSON y Netlify Visual Editor, pero la cobertura del CMS es desigual: articulos e instrucciones estan mayormente modelados, mientras tratamientos, casos clinicos y contenidos institucionales conservan campos ausentes, contratos desactualizados o textos hardcodeados. Se necesita completar una experiencia autoadministrable para que una persona autorizada pueda crear, ampliar y mantener el contenido cotidiano sin tocar codigo y sin debilitar las puertas clinicas, tecnicas y de publicacion existentes.

## What Changes

- Completar Netlify Visual Editor como CMS Git-based unico para el contenido publico del sitio, manteniendo `src/data` como fuente canonica y `main` como rama de produccion.
- Conservar una sola plantilla modular por tipo de contenido: articulo, instruccion y tratamiento/especialidad. Los campos y modulos opcionales vacios no se renderizan, no reservan espacio y no requieren seleccionar variantes de maqueta.
- Alinear los modelos de Stackbit con los contratos TypeScript y JSON reales, incluidos casos clinicos, profesionales, imagenes, videos, recursos descargables, metadata, relaciones y estados editoriales.
- Permitir crear y editar articulos con densidad minima, intermedia o completa mediante la misma plantilla; la densidad surge del contenido disponible y puede crecer sin cambiar slug, URL ni modelo.
- Permitir crear y editar instrucciones compuestas solo por los modulos disponibles: pasos, matrices, avisos, texto, recursos, galerias y descargas de imagen o video.
- Convertir servicios, tratamientos y especialidades en una unica entidad editorial administrable, normalizando sus nombres publicos y exponiendo hero, profesionales, caracteristicas, casos clinicos y relaciones.
- Llevar al CMS los textos institucionales y globales que hoy estan hardcodeados, como encabezados de portada, presentaciones de servicios, equipo, testimonios habilitables y textos de contacto o ubicacion definidos por contenido.
- Reemplazar campos libres sensibles a errores por selectores, referencias, valores enumerados y validaciones compatibles con el contrato del sitio.
- Definir permisos y flujo editorial para editar en una rama de trabajo, revisar un Deploy Preview y publicar solo despues de las aprobaciones clinica, editorial, tecnica, visual y del responsable del sitio.
- Verificar que toda combinacion valida de modulos mantenga SEO, accesibilidad y composicion responsive sin contenedores vacios ni desborde horizontal.

### Alcance

- Modelos, documentos, anotaciones visuales, validaciones y experiencia de autor en Netlify Visual Editor.
- Articulos, instrucciones, tratamientos/especialidades, casos clinicos, profesionales y contenido institucional visible.
- Creacion, edicion, ampliacion, despublicacion y preview de contenido versionado en Git.
- Documentacion operativa para que una persona autorizada use el CMS sin editar JSON manualmente.

### Fuera de alcance

- Editar desde el CMS la estructura de componentes, grilla, colores, tipografia, responsive o design system.
- Reemplazar Git/JSON por Supabase como fuente del contenido clinico publico.
- Duplicar la autenticacion, persistencia o trazabilidad del cambio `dinamizar-dashboard-editorial-con-supabase`.
- Automatizar generacion editorial, ingreso de archivos o trabajo con modelos locales definido en `preparar-runner-editorial-lm-studio-link`.
- Producir o publicar derivados para redes sociales.
- Hacer merge, desplegar o publicar contenido sin aprobacion humana explicita.

### Riesgos clinicos y operativos

- Un editor puede seleccionar un estado, tratamiento o recurso incorrecto y publicar informacion clinica invalida.
- Un modelo CMS desalineado puede borrar campos existentes o producir JSON que falle durante el build.
- Una opcion aparentemente vacia puede dejar contenedores, titulos o espacios sin contenido en desktop o mobile.
- La facilidad de edicion puede confundirse con autorizacion de publicacion o permitir el uso de imagenes sin consentimiento verificado.
- Los cambios concurrentes entre CMS, Git y el dashboard operativo pueden divergir si no se identifica la revision de origen.

### Criterio de exito

Una persona autorizada puede crear y editar desde Netlify Visual Editor un articulo, una instruccion y un tratamiento/especialidad, completar solo la informacion disponible, cargar activos con texto alternativo y revisar el resultado en preview. Los campos ausentes no aparecen ni ocupan espacio, los modelos conservan todo dato existente, las validaciones bloquean referencias o estados invalidos y ningun cambio llega a produccion sin las aprobaciones y el merge previstos.

## Capabilities

### New Capabilities

- `cms-integral-sitio`: Cobertura global de Netlify Visual Editor, fidelidad entre modelos y datos, campos institucionales, controles de autor, preview Git y comportamiento de modulos opcionales.
- `tratamientos-especialidades-editables`: Modelo editorial unico para servicios, tratamientos y especialidades, incluidos profesionales, caracteristicas, casos clinicos y relaciones sin contenido hardcodeado.

### Modified Capabilities

- `articulos-odontologia`: Completar la autoria CMS de la plantilla modular unica, sus campos, relaciones, recursos y combinaciones validas de contenido.
- `instrucciones-pacientes`: Completar la autoria CMS de modulos, recursos descargables y videos manteniendo la omision segura de campos vacios.
- `flujo-editorial-clinico`: Incorporar el uso autorizado del CMS, rama de trabajo, preview y aprobaciones como circuito normal de edicion y publicacion.
- `profesionales-por-tratamiento`: Integrar la administracion de profesionales al modelo completo de tratamientos/especialidades y validar altas, cambios y omisiones desde el CMS.

## Impact

- CMS: `stackbit.config.ts`, fuente Git, modelos de pagina/objeto, referencias, controles, presets solo cuando aporten datos iniciales y anotaciones `data-sb-*`.
- Datos: `src/data/home.json`, `src/data/settings.json`, colecciones de articulos, instrucciones y tratamientos, mas nuevos documentos institucionales cuando correspondan.
- Codigo: loaders y validadores TypeScript, componentes de portada, articulos, instrucciones, tratamientos, casos, equipo, testimonios, ubicacion, navegacion, metadata y sitemap.
- Activos: `public/images`, `public/videos`, carga desde el CMS, texto alternativo, dimensiones y validacion de rutas.
- Operacion: acceso de editores, ramas/preview de Netlify, aprobaciones clinicas y visuales, merge autorizado y documentacion de uso.
- Dependencias: el cambio reutiliza el circuito archivado `crear-circuito-editorial-articulos-redes`, el circuito archivado `crear-circuito-instrucciones-pacientes` y la fuente JSON vigente; coordina limites con los cambios activos de Supabase y del runner editorial sin depender de ellos para editar contenido publico.
