## Why

El bootstrap editorial de Tina ya está integrado y publicado, pero la rutina todavía no fue demostrada de extremo a extremo con ciclos editoriales reales. Antes de delegarla a Paula, otros clientes o modelos locales, necesitamos comprobar que una edición ordinaria y un retiro reversible pueden llegar desde Tina hasta producción sin intervención técnica rutinaria, sin relajar los gates y sin repetir relevamientos generales.

## What Changes

- Sincronizar `editorial/tina` con el `main` que contiene el bootstrap y confirmar que TinaCloud indexa el mismo contrato.
- Ejecutar una modificación visible, aprobada y reversible mediante `Save -> Preview -> Publicar cambios -> Producción`.
- Ejecutar un retiro y una republicación reales sobre contenido no sensible, verificando rutas, listados, relaciones, sitemap y editabilidad.
- Confirmar que cada publicación deja `main`, `editorial/tina`, TinaCloud y Netlify en un estado convergente antes del ciclo siguiente.
- Registrar evidencia mínima por ciclo —request, commits, checks, deploy y rutas— sin copiar logs verdes completos ni información clínica privada.
- Entregar una rutina breve para usuarios no técnicos y una matriz de excepciones que indique cuándo detenerse y pedir intervención.
- Corregir el roadmap para reflejar que `pilotear-circuito-editorial-tina` ya fue integrado y que este cambio es el sucesor operativo vigente.

### Alcance

- Validación del circuito editorial ya implementado con contenido existente y previamente aprobado.
- Ajustes mínimos de configuración, mensajes o automatización únicamente si una prueba real revela un defecto del bootstrap y sin ampliar el contrato editorial.
- Evidencia de funcionamiento proporcional al riesgo, reutilizando los checks remotos sobre la revisión exacta.

### Fuera de alcance

- Crear o modificar modelos, campos, categorías, servicios, navegación, teléfono, WhatsApp, mapa o relaciones automáticas.
- Implementar redes sociales, Supabase, GitCron o el runner local de LM Studio.
- Publicar contenido clínico nuevo, incorporar imágenes sin consentimiento confirmado o borrar físicamente documentos.
- Sustituir los gates Git, TinaCloud o Netlify por operaciones manuales directas sobre producción.

### Riesgos clínicos

- La prueba visible usará contenido ya aprobado y no cambiará afirmaciones clínicas ni consentimiento de imágenes.
- El retiro o republicación será reversible y no eliminará archivos ni metadata editorial.
- Ante una diferencia clínica, visual, de privacidad o de alcance, el ciclo se detendrá antes de producción.

### Criterio de éxito

- Una actualización visible y un retiro/republicación completan el circuito real con los gates vigentes.
- Producción publica exactamente el commit autorizado y las superficies públicas esperadas coinciden con el estado editorial.
- `editorial/tina` vuelve a converger con `main`, Tina permanece editable y la rutina puede repetirse sin Codex en el caso saludable.
- Paula o cualquier colaborador autorizado puede seguir la guía sin abrir GitHub, GitCron o Netlify durante una operación ordinaria.

## Capabilities

### New Capabilities

- `validacion-operativa-editorial-tina`: Define los dos ciclos reales, la convergencia obligatoria, la evidencia mínima y el handoff final que convierten el bootstrap en una rutina operativa validada.

### Modified Capabilities

<!-- No se modifican requisitos existentes; este cambio demuestra y cierra operativamente el contrato ya sincronizado. -->

## Impact

- OpenSpec y roadmap del programa CMS.
- Rama persistente `editorial/tina`, TinaCloud y su índice de schema.
- Workflow de promoción editorial, PR técnico, checks de GitHub y convergencia de ramas.
- Deploy Preview y producción de Netlify, consultados de forma escalonada.
- Documentación operativa para OdontoPau y patrón reusable para OdontoPia.
