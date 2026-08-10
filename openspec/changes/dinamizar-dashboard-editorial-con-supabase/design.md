## Context

`/editorial` es hoy una vista Next.js protegida por una contraseña compartida con fallback hardcodeado y una cookie fija. La página recibe artículos e instrucciones desde loaders JSON; el componente completa carpetas de Drive y copys sociales con constantes locales. Por eso los datos cambian sólo con código/build, no hay colaboración persistente y la sesión no representa una identidad auditable.

El sitio público ya funciona y los JSON versionados son la fuente clínica aprobada. La primera fase de Supabase debe mejorar la operación interna sin crear un segundo CMS capaz de publicar por fuera de Git/Netlify.

## Goals / Non-Goals

**Goals:**

- Persistir inventario operativo, asignaciones, trazabilidad, aprobaciones y eventos.
- Reemplazar la autenticación compartida por identidades Supabase Auth verificables en servidor.
- Aplicar RLS y grants mínimos a toda tabla expuesta.
- Sincronizar el inventario JSON en forma explícita, idempotente y auditable.
- Detectar divergencias entre la revisión de Git y el registro operativo.
- Mantener el dashboard usable y accesible en desktop y mobile.

**Non-Goals:**

- Mover el cuerpo clínico o las imágenes a Supabase en esta fase.
- Permitir que Supabase publique, modifique `main` o dispare un deploy.
- Guardar información clínica identificable, consentimientos o credenciales externas.
- Generar paquetes sociales dentro del dashboard.

## Decisions

### Git conserva la autoridad de publicación

Supabase funcionará como plano de control. `repo_status`, `source_path`, `source_revision` y `content_hash` permitirán comparar cada fila con su JSON; el estado público efectivo siempre será el del archivo desplegado. Una acción operativa nunca cambiará el contenido público por sí sola.

Alternativa descartada: migrar inmediatamente el CMS completo a Supabase. Duplicaría la fuente clínica y ampliaría el riesgo antes de validar el flujo interno.

### Modelo relacional mínimo

Se crearán, como mínimo:

- `editorial_items`: identidad estable, tipo, slug, título, fuente Git, hash, estado del repositorio, estado operativo, asignación y trazabilidad no sensible.
- `editorial_approvals`: tipo de aprobación, decisión, revisor, fecha y nota no clínica.
- `editorial_events`: historial append-only de mutaciones relevantes.
- `editorial_sync_runs`: resultado, revisión de origen, conteos y errores de cada reconciliación.

Los estados y tipos usarán constraints o enums explícitos. Slug y tipo formarán una identidad lógica única; las claves foráneas e índices cubrirán filtros por estado, tipo, responsable y fecha.

### Migraciones y tipos versionados

El esquema se creará con Supabase CLI y migraciones bajo `supabase/migrations`. Los cambios remotos no se realizarán manualmente una vez iniciado el historial. Los tipos TypeScript se generarán desde el esquema y se versionarán.

Las migraciones incluirán grants explícitos porque los proyectos actuales pueden no exponer tablas nuevas automáticamente a la Data API. No se dependerá de defaults del dashboard de Supabase.

### Auth SSR y autorización por `app_metadata`

Next.js utilizará versiones fijadas de `@supabase/ssr` y `@supabase/supabase-js`. Middleware y clientes server/browser gestionarán cookies y renovación de sesión. Las rutas internas comprobarán el usuario en servidor.

La autorización se basará en un rol administrado dentro de `app_metadata`, nunca en `user_metadata`. Los roles iniciales serán `editorial_viewer`, `editorial_editor` y `editorial_admin`; cambios de rol exigirán refrescar la sesión. No habrá contraseña de fallback ni cookie de autenticación inventada por la aplicación.

### RLS y permisos mínimos

Todas las tablas del esquema expuesto tendrán RLS. `anon` no recibirá acceso. `authenticated` tendrá sólo los grants requeridos y las policies combinarán el rol con la operación permitida. UPDATE tendrá policy SELECT, `USING` y `WITH CHECK`; eventos no permitirán UPDATE ni DELETE.

Se evitarán vistas; si se agregan, usarán `security_invoker = true`. No se usarán funciones `SECURITY DEFINER` para resolver fallos de permisos. La secret key o `service_role` nunca se expondrá mediante variables `NEXT_PUBLIC_*`.

### Sincronización explícita e idempotente

Una acción administrativa autenticada leerá los loaders del repositorio en servidor, calculará hashes estables y realizará upsert sólo de campos derivados de Git. Los campos operativos se preservarán. Cada ejecución registrará altas, actualizaciones, ausencias y errores.

No habrá escritura automática durante `next build` ni sincronización inversa hacia JSON. Un elemento ausente del repositorio se marcará como desactualizado o retirado; no se eliminará sin revisión.

### Lectura reactiva con fallback controlado

La primera carga será server-side. El cliente podrá revalidar o suscribirse a cambios autorizados para KPIs y tablas. Los errores de Supabase mostrarán un estado explícito y no se reemplazarán silenciosamente por datos hardcodeados. Un modo de diagnóstico podrá comparar Supabase contra loaders JSON sin mutar nada.

## Risks / Trade-offs

- [Dos estados parecen competir] → Diferenciar visualmente estado Git, estado operativo y permiso de publicación.
- [Policy RLS incorrecta] → Probar matrices anon/viewer/editor/admin y ejecutar advisors antes del release.
- [JWT con rol desactualizado] → Refrescar o cerrar sesiones al cambiar `app_metadata` y mantener expiración razonable.
- [Sync sobrescribe trabajo editorial] → Limitar el upsert a campos derivados y proteger columnas operativas.
- [Supabase no disponible] → Mostrar error recuperable y conservar el sitio público independiente de la base.
- [Inventario interno expone datos sensibles] → Guardar sólo etiquetas y referencias no identificatorias; validar payloads y logs.

## Migration Plan

1. Auditar proyecto Supabase, región, Data API, Auth y entornos sin modificar producción.
2. Inicializar CLI, crear migraciones, RLS, grants, índices y tipos localmente.
3. Crear proyecto o entorno de preview y ejecutar pruebas de políticas.
4. Implementar clientes SSR y reemplazar login/cookie actuales en una rama y Deploy Preview.
5. Ejecutar importación dry-run, revisar diff y luego sincronizar el inventario aprobado.
6. Conectar `/editorial` a Supabase y validar mutaciones, auditoría y desincronización.
7. Configurar variables por entorno en Netlify y verificar preview.
8. Con aprobaciones explícitas, desplegar y revocar el mecanismo de contraseña anterior.

Rollback: desactivar las mutaciones y restaurar temporalmente el dashboard JSON de sólo lectura, sin reactivar la contraseña hardcodeada; conservar migraciones y datos para diagnóstico y revertir el release de aplicación mediante Git/Netlify.

## Open Questions

- Confirmar si se usará un proyecto Supabase nuevo o uno existente y quién administrará los usuarios.
- Confirmar método de acceso inicial: magic link, contraseña individual o proveedor externo.
- Confirmar si Realtime es necesario desde el primer lote o si revalidación bajo demanda cubre la operación.
- Definir retención de eventos y si las notas de aprobación deben limitarse a códigos/etiquetas sin texto libre.
