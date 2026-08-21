## Why

TinaCMS ya permite editar el sitio desde una rama editorial no productiva, pero hoy guardar contenido no completa por sí solo un circuito comprensible para una persona no técnica. El usuario necesita que `Guardar` actualice un Preview y que una acción explícita dentro del mismo panel de Tina publique o retire ese contenido sin entrar a GitHub, GitCron o Netlify.

El flujo debe funcionar con los colaboradores disponibles en Tina Free. Todos los usuarios autorizados del proyecto se consideran responsables y pueden editar, solicitar una publicación y retirar contenido; no habrá una jerarquía adicional entre editor y profesional dentro del CMS.

## What Changes

- Convertir `editorial/tina` en el entorno editorial persistente: toda guarda desde el CMS remoto permanece fuera de `main` y actualiza el Preview.
- Agregar al panel de Tina un control de publicación explícito, separado del botón ordinario `Save`, para evitar que una edición se publique accidentalmente.
- Incorporar el estado `retired` para que artículos e instrucciones puedan retirarse de producción sin eliminarlos.
- Versionar una solicitud de publicación de un solo uso que represente el snapshot editorial aprobado por cualquier colaborador autorizado.
- Agregar una automatización de GitHub que sólo reaccione a esa solicitud, valide el alcance editorial, ejecute los gates vigentes, integre a `main` y vuelva a sincronizar `editorial/tina`.
- Mostrar en Tina el enlace al Preview, el estado de la solicitud y una explicación breve del circuito `Guardar -> Preview -> Publicar cambios -> Producción`.
- Mantener un carril separado para cambios estructurales de código, schema, rutas o configuración, que continúan requiriendo OpenSpec y el flujo de desarrollo habitual.
- Cerrar el bootstrap estructural de la rutina y dejar como sucesor obligatorio `validar-operacion-editorial-tina-en-produccion`, que ejecutará dos ciclos reales una vez que el workflow exista en `main` y `editorial/tina` vuelva a estar convergente.

### Fuera de alcance

- Contratar o depender del Editorial Workflow pago de TinaCloud.
- Exponer GitHub, GitCron, Netlify, tokens o credenciales a los usuarios del CMS.
- Restringir la publicación a un rol particular de Tina; todos los colaboradores del proyecto están autorizados.
- Permitir que un modelo local publique, haga merge o use credenciales.
- Automatizar cambios estructurales como si fueran mantenimiento editorial.
- Revalidar localmente todos los gates remotos después de un resultado verde sobre el mismo commit.

### Riesgos clínicos y operativos

- Una solicitud podría intentar incluir código o archivos ajenos; la automatización debe bloquear todo diff fuera de la allowlist editorial.
- Una rama editorial divergente puede mezclar contenido inesperado; sólo se permite publicación cuando `main` es ancestro del snapshot editorial.
- Los borradores clínicos y sus medios no deben llegar a producción por una publicación global accidental; cada ciclo debe revisar el snapshot completo y los estados editoriales antes de promoverlo.
- Una solicitud repetida no debe producir merges o deploys duplicados.
- La evidencia no debe incluir datos identificatorios, consentimientos, secretos ni material clínico privado.

### Criterio de éxito

- Un colaborador autorizado guarda una modificación y la ve en Preview sin alterar producción.
- El mismo colaborador puede solicitar la publicación desde Tina sin abrir herramientas técnicas.
- La automatización publica únicamente si el snapshot es editorial, válido y convergente; ante fallo conserva la producción anterior.
- Un artículo o instrucción con estado `retired` deja de renderizarse en producción después de publicar el snapshot, pero continúa editable en Tina y visible en Preview.
- `main`, `editorial/tina`, TinaCloud y Netlify terminan convergentes después de cada publicación.
- El bootstrap queda listo para integrarse sin presentar como probada una automatización que todavía no puede ejecutarse desde la rama editorial.
- La rutina sólo podrá declararse estable después del sucesor `validar-operacion-editorial-tina-en-produccion`, con una actualización visible y un retiro o republicación reales.

## Capabilities

### New Capabilities

- `piloto-operacion-editorial-tina`: operación autónoma `Guardar -> Preview -> Publicar/Retirar -> Producción` desde Tina para colaboradores no técnicos.

### Modified Capabilities

- `autoria-tina-cms`: asegura que el CMS remoto escriba sólo en la rama editorial y expone una solicitud versionada de publicación.
- `gates-ci-y-publicacion`: agrega la promoción automática y segura del snapshot editorial después de una orden explícita.
- `flujo-editorial-clinico`: reconoce a todos los colaboradores autorizados como publicadores y agrega el estado de retiro sin eliminar documentos.

## Impact

- Configuración y dashboard de Tina bajo `tina/` y `src/cms/tina/`.
- Contratos y renderizado editorial de artículos e instrucciones.
- Solicitud singleton de publicación bajo `src/data/`.
- Workflow de GitHub para alcance, validación, integración y convergencia.
- Documentación operativa, evidencia del bootstrap y contrato de entrada del piloto real sucesor.
- Netlify seguirá publicando producción exclusivamente desde `main`; su configuración externa sólo se tocará después de autorización explícita.
