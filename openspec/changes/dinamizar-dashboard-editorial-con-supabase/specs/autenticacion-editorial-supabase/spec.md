## ADDED Requirements

### Requirement: Identidad individual con Supabase Auth
El dashboard MUST exigir una sesión Supabase Auth válida para cada usuario y MUST eliminar la contraseña compartida, su fallback y la cookie fija de autenticación.

#### Scenario: Usuario sin sesión
- **WHEN** una persona solicita `/editorial` sin una sesión válida
- **THEN** es redirigida al acceso y no recibe datos editoriales

### Requirement: Sesión SSR verificada
Next.js SHALL crear y renovar la sesión con clientes SSR y SHALL verificar el usuario en servidor antes de entregar rutas o ejecutar mutaciones protegidas.

#### Scenario: Token vencido
- **WHEN** la sesión no puede renovarse o validarse
- **THEN** la operación se rechaza y el usuario debe autenticarse nuevamente

### Requirement: Roles administrados
La autorización MUST usar roles controlados en `app_metadata` y MUST ignorar `user_metadata` para decisiones de acceso.

#### Scenario: Usuario autenticado sin rol editorial
- **WHEN** una cuenta válida no posee un rol editorial permitido en `app_metadata`
- **THEN** no puede consultar ni modificar el dashboard

### Requirement: Permisos por rol
El sistema SHALL distinguir `editorial_viewer`, `editorial_editor` y `editorial_admin` y SHALL limitar cada operación tanto en aplicación como en RLS.

#### Scenario: Viewer intenta actualizar
- **WHEN** un usuario con rol `editorial_viewer` intenta modificar una fila
- **THEN** la aplicación y la base rechazan la operación

### Requirement: Cierre y revocación de sesión
El dashboard SHALL permitir cerrar sesión, eliminar cookies SSR y contemplar la revocación o refresco obligatorio después de cambios de rol.

#### Scenario: Rol removido
- **WHEN** un administrador revoca el rol editorial de una cuenta
- **THEN** su siguiente validación de sesión pierde acceso y no puede conservar permisos mediante una cookie anterior

### Requirement: Claves seguras por contexto
El navegador MUST usar únicamente la publishable key; cualquier secret key o `service_role` MUST permanecer en código y variables exclusivas de servidor.

#### Scenario: Bundle público
- **WHEN** se inspeccionan JavaScript y variables expuestas del cliente
- **THEN** no aparece ninguna clave con capacidad de omitir RLS
