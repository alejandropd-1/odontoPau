## Context

El contenido publico se persiste como JSON bajo `src/data`, mientras los contratos de lectura viven principalmente en `src/data/articulos.ts`, `src/data/instrucciones.ts` y `src/data/tratamientos.ts`. Netlify Visual Editor obtiene sus modelos desde un unico `stackbit.config.ts`. TypeScript elimina sus tipos en runtime y Stackbit serializa documentos mediante una dependencia externa, por lo que hoy no existe una prueba local que demuestre que los campos persistidos, los validadores y el formulario CMS sean equivalentes.

Este cambio es el slice A del programa `hacer-sitio-autoadministrable-desde-cms`. Debe producir una base verificable para los slices funcionales posteriores sin cambiar contenido aprobado ni afirmar que una simulacion local reemplaza la futura prueba real en Visual Editor. Paula conserva autoridad sobre contenido e imagenes clinicas; Alejandro conserva la validacion final, el archive y la autorizacion de merge.

## Goals / Non-Goals

**Goals:**

- Disponer de un contrato declarativo inspeccionable para comparar persistencia JSON, validacion runtime y modelos CMS.
- Detectar campos ausentes, extras incompatibles, discriminantes, constantes, listas, objetos y diferencias de obligatoriedad con errores accionables.
- Demostrar mediante una proyeccion de ida y vuelta que los documentos vigentes no pierden informacion en el limite modelado del CMS.
- Mantener `stackbit.config.ts` funcionalmente equivalente al reorganizar definiciones para poder probarlas.
- Clasificar cada modelo como `safe`, `blocked` o `pending`, sin habilitar autoria funcional nueva.
- Ejecutar el control en local y CI sin red, credenciales ni escritura sobre documentos canonicos.

**Non-Goals:**

- Emular o certificar el serializador interno completo de Netlify Visual Editor.
- Completar los campos faltantes de cada familia editorial; los slices B, C y D resolveran esos contratos.
- Crear paginas, cambiar contenido, migrar JSON, modificar renderizado o alterar rutas publicas.
- Agregar Supabase, autenticacion nueva, dependencias remotas o automatizacion de publicacion.
- Reemplazar las validaciones clinicas, visuales o manuales por el resultado de una prueba.

## Decisions

### Registro de modelos CMS importable y configuracion delgada

Las definiciones de modelos se extraeran de `stackbit.config.ts` a modulos TypeScript importables bajo una ruta CMS explicita. `stackbit.config.ts` conservara `stackbitConfig`, `GitContentSource`, `contentDirs`, assets, version y opciones actuales, pero consumira el mismo registro que usan las pruebas.

La extraccion MUST preservar nombres, tipos, orden, labels, constantes, campos requeridos, rutas y comportamiento existentes. No se aprovechará el refactor para completar modelos de articulos, instrucciones, tratamientos o institucionales.

Alternativa descartada: analizar `stackbit.config.ts` como texto. Seria fragil ante formato, aliases y composicion de objetos, y no comprobaria el valor runtime real entregado a Stackbit.

### Manifest de contrato persistido, no introspeccion ilusoria de interfaces

Se creara un manifest versionado por modelo con rutas de campos, forma (`scalar`, `object`, `list`, `model`), tipo persistido, obligatoriedad, discriminante o constante, origen y estado editorial. El manifest sera la representacion runtime auditable del contrato; las interfaces TypeScript seguiran aportando chequeo estatico y sus validadores deberan consumir o concordar con esa definicion cuando resulte viable sin ampliar el slice.

La validacion combinara tres evidencias:

1. campos observados en todos los JSON vigentes y fixtures;
2. campos admitidos por el contrato/validador runtime declarado;
3. campos y objetos expuestos por el registro de modelos Stackbit.

Un campo derivado por codigo se marcara como tal y no se exigira como persistido. Un campo persistido sin representacion CMS segura bloqueara el modelo. Un campo CMS desconocido para el runtime tambien bloqueara el modelo.

Alternativa descartada: afirmar paridad leyendo solo interfaces TypeScript mediante expresiones regulares. Los tipos se borran al ejecutar, las uniones y campos anidados no se representan con fidelidad y el resultado produciria falsos positivos.

### Comparacion estructural recursiva

El comparador recorrera modelos y objetos anidados, listas y uniones discriminadas. No se limitara a comparar nombres de primer nivel. Para cada diferencia informara como minimo: modelo, ruta, capa faltante o incompatible, forma esperada, forma observada y clasificacion bloqueante.

Los estados `safe`, `blocked` y `pending` se calcularan de forma determinista. `safe` exige cobertura completa dentro del alcance medido; `blocked` indica perdida o dato incompatible; `pending` identifica una capacidad deliberadamente reservada a otro slice sin habilitar escritura.

Alternativa descartada: una lista manual sin comando de verificacion. Quedaria obsoleta en el siguiente cambio y no serviria como gate.

### Round-trip local como prueba del limite modelado

La prueba cargara copias en memoria de documentos reales y fixtures minimo/completo, proyectara cada valor mediante el contrato CMS importable, reconstruira el documento y comparara semanticamente el resultado. Se preservaran orden de listas, valores, objetos, discriminantes y ausencia frente a opcionalidad; se permitira ignorar exclusivamente diferencias documentadas que no alteren significado, nunca campos desconocidos.

Antes y despues del comando se verificara que los archivos bajo `src/data` no hayan cambiado. Los temporales, si fueran necesarios, se crearan fuera de `src/data` y se eliminaran con cleanup garantizado.

Esta prueba valida la cobertura del modelo local, no una sesion real de Netlify. La prueba punta a punta del proveedor permanece como gate de los slices funcionales y del piloto.

### Defaults seguros sin habilitar altas

El manifest y los modelos que ya admitan defaults editoriales declararan `draft` y no completaran `publishedAt`, `clinicalReviewer` ni ninguna aprobacion. Si la API o un modelo actual no permite expresar el default sin cambiar comportamiento, el resultado quedara `pending` y documentado para el slice funcional correspondiente.

Ningun cambio de `siteMap`, `create`, presets o rutas de alta forma parte de este slice.

### Gate unico, determinista y sin red

Se agregara un comando dedicado, por ejemplo `pnpm run validate:cms-contracts`, que ejecute inventario, paridad, round-trip y comprobacion de no mutacion. El workflow `quality-gates` lo ejecutara antes de TypeScript, lint y build con las dependencias fijadas existentes. El comando no usara Netlify, Supabase, GitHub, variables secretas ni acceso de red.

El reporte humano versionado resumira cobertura y responsables de los bloqueos, pero la fuente del resultado sera el comando ejecutable. CI fallara ante diferencias bloqueantes nuevas o corrupcion de fixtures.

### Entrega en dos checkpoints de auditoria

La implementacion se organizara en dos checkpoints sin mezclar otros OpenSpecs:

1. inventario, manifest y reporte inicial, demostrando los desfases conocidos sin refactor funcional;
2. registro importable, round-trip y gate de CI, con equivalencia de `stackbit.config.ts` verificada.

El ejecutor no hara commit, push, archive ni merge. Codex auditara alcance, diffs, resultados y ausencia de cambios en `src/data` antes de preparar cualquier commit. El ultimo checkbox pertenece exclusivamente a Alejandro.

## Risks / Trade-offs

- [El manifest se convierte en una cuarta fuente manual] → Mantenerlo ejecutable, exigir que JSON y modelos CMS lo satisfagan y documentar claramente que describe persistencia, no contenido.
- [La extraccion cambia Stackbit sin que TypeScript lo detecte] → Comparar antes/despues una representacion normalizada del registro y ejecutar build y preview sin completar campos nuevos.
- [Round-trip local no reproduce Netlify] → Nombrarlo como prueba del limite modelado y conservar una prueba real del proveedor en slices posteriores.
- [Los JSON reales no cubren campos opcionales] → Agregar fixtures sinteticos no clinicos para formas minimas, completas y uniones, sin inventar contenido medico.
- [Una diferencia conocida impide terminar todo el slice] → Registrarla como `blocked` o `pending` con owner y slice destino; el gate impide regresiones y escritura insegura, no exige completar autoria fuera de alcance.
- [Los tests reescriben contenido] → Operar en memoria, comparar estado Git y hashes de `src/data`, y fallar si existe cualquier mutacion.
- [CI aumenta tiempo de ejecucion] → Reutilizar Node/TypeScript existentes, evitar red y mantener el comando acotado a contratos y fixtures.

## Migration Plan

1. Registrar SHA base, estado limpio y fotografia de los modelos y documentos actuales.
2. Construir el inventario y la matriz sin modificar `stackbit.config.ts` ni `src/data`.
3. Definir manifests y fixtures; ejecutar el comparador para obtener una linea base explicita.
4. Extraer el registro de modelos CMS conservando una salida normalizada equivalente.
5. Implementar round-trip y no mutacion sobre copias en memoria.
6. Integrar el comando en `package.json` y CI, y ejecutar OpenSpec, TypeScript, lint y build.
7. Preparar Draft PR y Deploy Preview para comprobar que el CMS y el sitio conservan comportamiento, sin habilitar autoria nueva.
8. Tras observaciones, repetir todos los gates y dejar la aprobacion final a Alejandro.

Rollback: revertir la extraccion del registro y retirar el nuevo paso de CI. Los JSON no requieren restauracion porque el cambio no debe escribirlos; cualquier diff en `src/data` se considera una falla y se excluye del cambio.

## Open Questions

- Confirmar durante el inventario si `HomePage` y `settings.json` cuentan hoy con validadores runtime suficientes o deben quedar `pending` para el slice institucional.
- Definir el formato final del reporte versionado una vez que se conozca la cantidad real de rutas de campo, priorizando lectura humana y diff estable.
- Confirmar mediante la API instalada de Stackbit que los defaults se pueden expresar sin habilitar rutas de creacion ni modificar documentos existentes.
