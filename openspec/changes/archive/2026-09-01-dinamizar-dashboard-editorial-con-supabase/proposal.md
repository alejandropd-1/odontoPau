## Why

El dashboard `/editorial` actual calcula inventario desde archivos JSON durante el render y completa trazabilidad y copys con datos definidos en el componente; no posee persistencia, colaboración ni autenticación verificable. Se necesita una capa operativa en Supabase que permita gestionar estados, responsables, aprobaciones y eventos en forma dinámica sin convertir la base en una vía de publicación automática ni reemplazar todavía el contenido Git del sitio.

## What Changes

- Incorporar Supabase Postgres como plano de control editorial para inventario, estados operativos, trazabilidad no sensible, aprobaciones y auditoría.
- Mantener los JSON versionados en Git como fuente canónica del contenido público durante esta fase, con sincronización explícita e idempotente hacia Supabase y detección de diferencias.
- Reemplazar la contraseña de fallback y la cookie fija actuales por Supabase Auth con sesión SSR y autorización por usuario editorial.
- Crear migraciones versionadas, tipos TypeScript generados, grants explícitos y RLS para todas las tablas expuestas.
- Hacer que `/editorial` lea datos persistidos, refleje actualizaciones autorizadas y muestre errores, desactualización y estados vacíos sin depender de constantes del componente.
- Registrar eventos de cambios y aprobaciones sin almacenar historias clínicas, consentimientos, credenciales ni datos identificatorios de pacientes.
- Mantener publicación, cambio a `published`, commit, push, merge y deploy detrás del flujo humano y Git/Netlify existente.

### Alcance

- Proyecto Supabase separado por entorno, configuración local no sensible y variables de Netlify.
- Supabase Auth para usuarios editoriales autorizados.
- Esquema de inventario editorial, fuentes, aprobaciones y eventos de auditoría.
- Importación inicial y reconciliación desde los JSON actuales.
- Lectura, filtros, KPIs y actualizaciones operativas desde `/editorial`.
- QA de RLS, sesiones, sincronización, responsive y accesibilidad.

### Fuera de alcance

- Migrar el cuerpo clínico completo de artículos e instrucciones desde Git hacia Supabase como CMS público.
- Publicar automáticamente, escribir en `main`, desplegar Netlify o cambiar un JSON a `published` desde el dashboard.
- Integrar Google Drive, cuentas sociales o documentos de consentimiento mediante credenciales almacenadas en el repositorio.
- Guardar historias clínicas, nombres de pacientes u otra información sanitaria identificable.
- Implementar el menú mobile, el runner de LM Studio o la producción de redes sociales.

### Riesgos clínicos y de seguridad

- Una base accesible sin RLS podría exponer inventario o trazabilidad interna.
- Un estado operativo podría confundirse con autorización de publicación.
- Una sincronización bidireccional prematura podría sobrescribir contenido clínico aprobado en Git.
- La autenticación SSR mal configurada podría aceptar sesiones vencidas o dejar rutas internas accesibles.
- La clave `service_role` o una secret key no debe llegar nunca al navegador.

### Criterio de éxito

Usuarios editoriales autorizados pueden iniciar sesión, consultar y actualizar metadatos operativos persistentes, ver KPIs y trazabilidad actualizados y auditar cambios; usuarios anónimos no pueden leer ni escribir datos. Los JSON y el proceso Git/Netlify siguen siendo la única vía de publicación pública, y toda diferencia entre Git y Supabase queda visible y recuperable.

## Capabilities

### New Capabilities

- `persistencia-editorial-supabase`: Esquema, migraciones, sincronización idempotente, grants, RLS y tipos para los datos operativos del dashboard.
- `autenticacion-editorial-supabase`: Inicio de sesión, sesión SSR y autorización de usuarios internos mediante Supabase Auth.
- `auditoria-editorial`: Registro inmutable y consultable de cambios operativos y aprobaciones no sensibles.

### Modified Capabilities

- `dashboard-editorial`: Sustituir inventario calculado y datos hardcodeados por consultas persistentes y mutaciones autorizadas con estados de carga, error y desincronización.

## Impact

- Dependencias: versiones fijadas de `@supabase/supabase-js`, `@supabase/ssr` y Supabase CLI.
- Base de datos: nuevas migraciones bajo `supabase/migrations`, RLS, índices, constraints y grants explícitos.
- Código: clientes Supabase server/browser, middleware, acciones o endpoints internos, `/editorial` y sus componentes.
- Autenticación: eliminación de `EDITORIAL_PASSWORD` como mecanismo de acceso y revocación de la cookie fija `editorial_session`.
- Deploy: variables públicas y secretas configuradas por entorno en Netlify, sin versionar valores.
- Operación: importación inicial desde Git, reconciliación manual o controlada y verificación separada antes de cualquier release.
