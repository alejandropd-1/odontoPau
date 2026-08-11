## Why

Netlify Visual Editor puede abrir documentos cuyo modelo no representa todos los campos que usan los JSON, los contratos TypeScript o los renderizadores actuales. Antes de ampliar la autoria del sitio, se necesita una puerta automatizada que detecte esos desfases y demuestre que leer, guardar y releer contenido no elimina ni transforma informacion aprobada.

## What Changes

- Inventariar los contratos efectivos de `HomePage`, `Articulo`, `Instruccion`, `Tratamiento`, `CasoClinico` y sus objetos reutilizables en JSON, TypeScript, validadores, Stackbit y renderizadores.
- Definir una matriz versionada de paridad que identifique campos requeridos, opcionales, constantes, controlados, derivados y aun no editables.
- Separar los modelos CMS en una estructura inspeccionable y reutilizable sin cambiar todavia la forma ni el contenido publico de las paginas.
- Incorporar una validacion automatizada que falle con mensajes accionables cuando un campo persistido o soportado no tenga representacion segura en el CMS, o cuando el CMS admita datos que el runtime no comprenda.
- Incorporar pruebas de round-trip sobre copias en memoria de documentos reales y fixtures representativos, verificando conservacion semantica y ausencia de mutaciones sobre `src/data`.
- Establecer defaults editoriales seguros para futuras altas: `draft`, sin fecha de publicacion ni aprobacion implicita, sin habilitar todavia los flujos de creacion de los slices posteriores.
- Integrar los controles de paridad y round-trip al quality gate local y remoto antes de preview o publicacion.
- Documentar que un modelo con paridad incompleta permanece bloqueado para escritura y debe resolverse en el slice especifico correspondiente.

### Alcance

- Contratos y modelos actuales de `src/data`, `src/data/*.ts` y `stackbit.config.ts`.
- Herramientas de inventario, validacion, fixtures, pruebas de paridad y round-trip.
- Scripts reproducibles y su integracion en CI sin secretos ni dependencias de servicios externos.
- Evidencia de que los JSON vigentes no cambian como consecuencia de las pruebas.

### Fuera de alcance

- Habilitar la creacion o edicion completa de articulos, instrucciones, tratamientos, casos o contenido institucional.
- Cambiar textos, imagenes, slugs, rutas, estados de publicacion o contenido clinico vigente.
- Modificar componentes, maquetacion, responsive, SEO visible o design system.
- Probar una sesion real de autoria en Netlify Visual Editor; corresponde a los slices funcionales y al piloto editorial.
- Implementar Supabase, redes sociales, el runner de LM Studio o automatizacion de merge y deploy.
- Hacer archive, merge o publicar sin la validacion manual final de Alejandro.

### Riesgos clinicos y operativos

- Una comparacion solo nominal puede marcar paridad aunque difieran nulabilidad, tipos internos o discriminantes.
- Una prueba que escriba sobre documentos reales puede alterar contenido clinico aprobado o generar ruido de formato.
- Convertir `stackbit.config.ts` en codigo reutilizable puede cambiar inadvertidamente el orden, labels o comportamiento del CMS.
- Un default inseguro puede hacer que una alta futura parezca publicada o revisada.
- Un gate incompleto puede dar una falsa sensacion de seguridad y permitir perdida silenciosa al guardar.

### Criterio de exito

El repositorio dispone de un inventario verificable y comandos deterministas que comparan los contratos JSON, TypeScript/runtime y CMS, ejecutan round-trip sin modificar `src/data`, detectan al menos los desfases conocidos con mensajes precisos y quedan integrados al quality gate. Ningun comportamiento o contenido publico cambia, y cada modelo queda clasificado como seguro para continuar, bloqueado o pendiente del slice funcional que lo completara.

## Capabilities

### New Capabilities

- `paridad-contratos-cms`: Inventario, comparacion automatizada y pruebas de round-trip que impiden habilitar escritura CMS cuando JSON, runtime y Stackbit no conservan el mismo contrato semantico.

### Modified Capabilities

- `gates-ci-y-publicacion`: Incorporar la paridad CMS y el round-trip sin mutaciones como controles obligatorios y reproducibles antes de integrar cambios editoriales.
- `flujo-editorial-clinico`: Mantener bloqueada la escritura de modelos con cobertura incompleta y conservar defaults de borrador sin inferir aprobacion ni publicacion.

## Impact

- **CMS:** reorganizacion acotada de `stackbit.config.ts` y/o extraccion de definiciones de modelos sin ampliar aun la superficie editable.
- **Contratos:** `src/data/articulos.ts`, `src/data/instrucciones.ts`, `src/data/tratamientos.ts`, `src/data/home.json`, `src/data/settings.json` y documentos JSON vigentes como entradas de validacion, no como contenido a reescribir.
- **Pruebas y herramientas:** nuevos manifests, fixtures, scripts o tests bajo rutas versionadas del repositorio.
- **CI:** `package.json` y `.github/workflows/quality-gates.yml` para ejecutar el nuevo gate con versiones fijadas y sin red.
- **Operacion:** reporte de modelos seguros, bloqueados y pendientes que servira como entrada obligatoria para los slices B, C y D del programa CMS.
