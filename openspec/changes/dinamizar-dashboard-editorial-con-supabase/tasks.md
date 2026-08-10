## 1. Descubrimiento y precondiciones

- [ ] 1.1 Confirmar si se usará un proyecto Supabase nuevo o existente, su región, organización y responsables
- [ ] 1.2 Inventariar configuración actual de Data API, Auth, proveedores, URLs permitidas y entornos sin registrar secretos
- [ ] 1.3 Confirmar método de acceso inicial y cuentas autorizadas para Paula, Alejandro y futuros editores
- [ ] 1.4 Trabajar en `change/dinamizar-dashboard-editorial-con-supabase` y definir proyectos o entornos Supabase separados para desarrollo, Deploy Preview y producción
- [ ] 1.5 Auditar Supabase CLI, Node, pnpm y cambios incompatibles vigentes antes de fijar versiones
- [ ] 1.6 Documentar campos prohibidos: historias clínicas, identidad de pacientes, consentimientos, credenciales y secretos
- [ ] 1.7 Capturar una línea base verificable del dashboard JSON actual y del inventario publicado

## 2. Configuración y dependencias

- [ ] 2.1 Inicializar Supabase CLI siguiendo su ayuda vigente y sin enlazar todavía producción
- [ ] 2.2 Instalar versiones fijadas de `@supabase/supabase-js` y `@supabase/ssr` y actualizar el lockfile
- [ ] 2.3 Definir nombres de variables para URL, publishable key y secretos exclusivos de servidor sin versionar valores
- [ ] 2.4 Crear clientes Supabase tipados para browser, server y middleware con responsabilidades separadas
- [ ] 2.5 Configurar `.gitignore`, archivos de ejemplo y documentación para evitar que secretos o estados locales entren en Git
- [ ] 2.6 Generar y versionar tipos TypeScript desde el esquema Supabase

## 3. Esquema y migraciones

- [ ] 3.1 Crear mediante `supabase migration new` la migración inicial del plano editorial
- [ ] 3.2 Implementar `editorial_items` con identidad estable, fuente Git, hashes, estados, asignación y trazabilidad no sensible
- [ ] 3.3 Implementar `editorial_approvals` con tipos y decisiones separadas de la autorización de publicación
- [ ] 3.4 Implementar `editorial_events` append-only con actor y timestamp derivados de contexto confiable
- [ ] 3.5 Implementar `editorial_sync_runs` con revisión, conteos, resultado y errores no sensibles
- [ ] 3.6 Agregar enums o constraints, claves foráneas e índices para filtros, joins y unicidad lógica
- [ ] 3.7 Agregar grants explícitos para cada rol y no depender de la exposición automática de nuevas tablas
- [ ] 3.8 Aplicar migraciones en local y verificar `supabase migration list --local`
- [ ] 3.9 Ejecutar reset local y comprobar que el esquema se reproduce desde cero

## 4. Auth, RLS y seguridad

- [ ] 4.1 Habilitar RLS en cada tabla expuesta y revocar todo acceso editorial a `anon`
- [ ] 4.2 Definir roles `editorial_viewer`, `editorial_editor` y `editorial_admin` en `app_metadata`
- [ ] 4.3 Crear policies SELECT por rol y policies de mutación con autorización explícita
- [ ] 4.4 Asegurar que UPDATE tenga policy SELECT, `USING` y `WITH CHECK`
- [ ] 4.5 Impedir UPDATE y DELETE de eventos desde todos los roles de aplicación
- [ ] 4.6 Verificar que ninguna policy use `user_metadata`, `auth.role()` ni autenticación sin autorización de fila
- [ ] 4.7 Verificar que no existan vistas sin `security_invoker` ni funciones `SECURITY DEFINER` expuestas innecesariamente
- [ ] 4.8 Implementar login, callback si corresponde, renovación SSR y logout con Supabase Auth
- [ ] 4.9 Reemplazar middleware, contraseña compartida y cookie fija sin dejar un fallback de producción
- [ ] 4.10 Crear pruebas de matriz para anon, usuario sin rol, viewer, editor y admin
- [ ] 4.11 Ejecutar advisors de seguridad y rendimiento y resolver hallazgos relevantes

## 5. Importación y reconciliación

- [ ] 5.1 Definir identidad, serialización y hash estable para artículos e instrucciones cargados desde Git
- [ ] 5.2 Implementar un dry-run que compare loaders JSON con Supabase sin realizar mutaciones
- [ ] 5.3 Implementar sincronización idempotente que actualice sólo campos derivados de Git
- [ ] 5.4 Preservar asignaciones, aprobaciones y otros campos operativos durante cada upsert
- [ ] 5.5 Registrar altas, cambios, ausencias y errores en `editorial_sync_runs`
- [ ] 5.6 Marcar fuentes ausentes o divergentes para revisión sin eliminarlas automáticamente
- [ ] 5.7 Bloquear sincronización durante `next build` y cualquier escritura inversa automática hacia JSON
- [ ] 5.8 Ejecutar importación inicial en preview y revisar fila por fila contra el inventario aprobado

## 6. Integración de datos del dashboard

- [ ] 6.1 Reemplazar props construidas sólo desde loaders por consultas server-side tipadas a Supabase
- [ ] 6.2 Implementar paginación, búsqueda, filtros y ordenamiento eficientes desde la base
- [ ] 6.3 Calcular KPIs desde consultas persistentes sin descargar el catálogo completo al cliente
- [ ] 6.4 Implementar mutaciones operativas permitidas con validación de payload y sesión en servidor
- [ ] 6.5 Registrar eventos y aprobaciones de manera atómica con sus mutaciones asociadas
- [ ] 6.6 Implementar revalidación o Realtime autorizado para reflejar cambios sin rebuild
- [ ] 6.7 Implementar comparación visible entre estado operativo, estado Git y revisión sincronizada
- [ ] 6.8 Implementar estados de carga, vacío, error, reintento y Supabase no disponible
- [ ] 6.9 Eliminar `driveFolderMap`, copys y estados de difusión hardcodeados del componente
- [ ] 6.10 Mantener el sitio público y sus loaders independientes de la disponibilidad de Supabase

## 7. Experiencia editorial

- [ ] 7.1 Adaptar KPIs, filtros, inventario y trazabilidad al nuevo contrato tipado
- [ ] 7.2 Crear formularios o controles para asignación y campos operativos según el rol
- [ ] 7.3 Crear historial paginado y filtros de auditoría por pieza, actor, acción y fecha
- [ ] 7.4 Diferenciar visualmente aprobación operativa, estado JSON y publicación efectiva
- [ ] 7.5 Mostrar errores de policy o sesión con mensajes accionables sin exponer detalles internos
- [ ] 7.6 Validar teclado, foco, labels, tablas, diálogos, contraste y `prefers-reduced-motion`
- [ ] 7.7 Validar desktop y 390 px sin overflow horizontal ni controles inaccesibles
- [ ] 7.8 Mantener `/editorial` y sus APIs fuera de indexación, sitemap y acceso anónimo

## 8. QA y validación técnica

- [ ] 8.1 Probar migraciones, reset, tipos y sincronización idempotente en local
- [ ] 8.2 Probar aislamiento entre preview y producción y ausencia de escrituras cruzadas
- [ ] 8.3 Probar expiración, renovación, logout, revocación y cambio de rol de sesiones
- [ ] 8.4 Probar RLS directamente para todas las operaciones y roles, no sólo mediante la interfaz
- [ ] 8.5 Probar payloads inválidos, campos sensibles, concurrencia y caída de Supabase
- [ ] 8.6 Ejecutar `pnpm exec tsc --noEmit`
- [ ] 8.7 Ejecutar `pnpm run lint`
- [ ] 8.8 Ejecutar `pnpm run build` y confirmar que el build público no escribe en Supabase
- [ ] 8.9 Ejecutar `openspec validate dinamizar-dashboard-editorial-con-supabase --strict`
- [ ] 8.10 Auditar bundle, variables y logs para confirmar que no contienen secret key, `service_role` ni datos sensibles

## 9. Preview y preparación del release

- [ ] 9.1 Configurar variables de Supabase preview en Netlify sin copiar valores a archivos versionados
- [ ] 9.2 Desplegar un Deploy Preview y verificar login, roles, inventario, mutaciones, auditoría y responsive
- [ ] 9.3 Comparar inventario Supabase contra los JSON de la revisión exacta y resolver toda divergencia
- [ ] 9.4 Obtener validación de Paula sobre el circuito clínico, sin convertirla en autorización de merge o producción
- [ ] 9.5 Preparar plan de rollback que no reactive la contraseña ni la cookie inseguras anteriores
- [ ] 9.6 Ensayar las migraciones en un entorno aislado y documentar el orden coordinado para producción sin aplicarlas todavía
- [ ] 9.7 Verificar que nombres de variables, roles y permisos de producción estén preparados sin versionar valores ni mutar el entorno
- [ ] 9.8 Incorporar al checklist postproducción la revocación del acceso anterior, cookies viejas, usuarios, RLS, KPIs, historial y separación de publicación
- [ ] 9.9 Preparar commit y push selectivos en `change/dinamizar-dashboard-editorial-con-supabase`, abrir un Draft PR y repetir CI, seguridad y Deploy Preview sin merge ni archive
- [ ] 9.10 Documentar proyecto, migraciones, responsables, recuperación, altas/bajas de usuarios y mantenimiento periódico

## 10. Validación final de Alejandro

- [ ] 10.1 Alejandro revisa el dashboard, el Deploy Preview, la validación de Paula, la seguridad y el plan coordinado de migración, y autoriza el commit de cierre y el OpenSpec Archive. Esta tarea es exclusivamente manual y ningún agente puede marcarla; la migración productiva y el merge requieren la autorización de release posterior.
