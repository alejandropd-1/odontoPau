# Handoff del bootstrap editorial Tina

## Resultado disponible

- Tina guarda exclusivamente en `editorial/tina`.
- Netlify publica esa rama en `https://editorial-tina--paulagualtieri.netlify.app`.
- `Save` fue probado con una modificación visible y una reversión; producción permaneció intacta.
- El panel nuevo separa `Save` de `Publicar cambios`, muestra el Preview y registra una solicitud idempotente.
- El preflight rechaza código, schema, configuración, workflows, OpenSpec y cualquier ruta fuera de la allowlist editorial.
- GitHub Actions posee permisos de escritura y creación de Pull Requests; no se agregaron tokens personales ni secretos al CMS.
- El Draft PR `#13` ejecuta los quality gates y el Deploy Preview sobre el mismo commit revisado.

## Límite deliberado

Los ciclos reales no pueden preceder al bootstrap: GitHub debe leer el workflow desde una rama que ya lo contenga, mientras que ese mismo workflow debe rechazar archivos estructurales dentro de `editorial/tina`. Copiar la implementación a staging o flexibilizar la allowlist invalidaría la seguridad que se intenta probar.

Este cambio instala la infraestructura. No declara todavía que la publicación autónoma está estable.

## Sucesor obligatorio

Crear desde `main` sincronizada, después de publicar este bootstrap:

`change/validar-operacion-editorial-tina-en-produccion`

El sucesor debe:

1. adelantar `editorial/tina` al `main` del bootstrap y confirmar reindexado Tina;
2. ejecutar una modificación visible aprobada desde `Save` hasta producción mediante `Publicar cambios`;
3. ejecutar un retiro o republicación reversible y confirmar rutas, listados, sitemap y editabilidad;
4. registrar tiempos, commits, gates, deploy y convergencia sin copiar logs completos;
5. producir la rutina final para usuarios no técnicos y la matriz de excepciones.

## Patrón reusable para OdontoPia

- Una rama editorial persistente independiente de `main`.
- Un branch deploy estable y una variable pública con su URL.
- Un singleton de solicitud no renderizado.
- Un preflight determinista con allowlist propia del contrato de ese sitio.
- Un PR técnico automático con gates del repositorio de destino.
- Un estado reversible de retiro, sin borrado físico.
- Credenciales efímeras del proveedor CI; nunca tokens en Tina o en contenido.

No se deben copiar a OdontoPia los modelos, rutas o allowlists de OdontoPau sin inventariar primero su contrato real.
