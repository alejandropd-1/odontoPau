## ADDED Requirements

### Requirement: Esquema editorial versionado
El sistema SHALL definir mediante migraciones versionadas tablas normalizadas para inventario editorial, aprobaciones, eventos y ejecuciones de sincronización, con constraints, claves foráneas e índices verificables.

#### Scenario: Entorno limpio
- **WHEN** se aplican todas las migraciones a una base local vacía
- **THEN** el esquema completo se crea de manera reproducible sin pasos manuales en Supabase Studio

### Requirement: Grants explícitos y RLS
Toda tabla expuesta MUST tener RLS habilitado y grants explícitos; `anon` MUST carecer de permisos de lectura y escritura sobre datos editoriales.

#### Scenario: Solicitud anónima
- **WHEN** una petición usa la clave pública sin una sesión autenticada
- **THEN** no puede seleccionar, insertar, actualizar ni eliminar filas editoriales

### Requirement: Fuente pública canónica en Git
Supabase SHALL almacenar referencias y estado operativo, pero MUST tratar los JSON versionados y desplegados como única fuente de contenido y estado público durante esta fase.

#### Scenario: Cambio operativo a aprobado
- **WHEN** un editor marca una fila operativa como aprobada
- **THEN** el artículo público no cambia hasta que el JSON correspondiente atraviesa el flujo Git y Netlify autorizado

### Requirement: Sincronización idempotente
La importación desde loaders JSON SHALL usar una identidad estable y hashes de contenido, SHALL preservar campos operativos y SHALL producir el mismo resultado si se repite sin cambios de fuente.

#### Scenario: Segunda sincronización sin cambios
- **WHEN** se ejecuta la sincronización dos veces sobre la misma revisión Git
- **THEN** la segunda ejecución no duplica filas ni sobrescribe asignaciones o aprobaciones

### Requirement: Detección de desincronización
El sistema SHALL identificar altas, modificaciones, ausencias y diferencias de estado entre Git y Supabase sin eliminar automáticamente registros.

#### Scenario: JSON retirado del repositorio
- **WHEN** una fila existente ya no tiene una fuente correspondiente en la revisión sincronizada
- **THEN** queda marcada para revisión y conserva su historial

### Requirement: Tipos generados y dependencias fijadas
El proyecto SHALL versionar tipos TypeScript generados desde el esquema y SHALL fijar las versiones de clientes Supabase y su lockfile.

#### Scenario: Cambio de esquema
- **WHEN** una migración modifica tablas o enums consumidos por la aplicación
- **THEN** la validación exige regenerar tipos y compilar sin divergencias

### Requirement: Datos no sensibles
Las tablas y logs MUST excluir historias clínicas, datos identificatorios de pacientes, consentimientos, credenciales y secretos.

#### Scenario: Payload con campo prohibido
- **WHEN** una mutación intenta persistir información clínica identificable o una credencial
- **THEN** la validación rechaza el payload y el dato no se registra en tablas ni logs

### Requirement: Separación de entornos
Preview y producción MUST usar proyectos o ramas de base y variables diferenciadas, sin reutilizar secretos mediante archivos versionados.

#### Scenario: Deploy Preview
- **WHEN** Netlify construye una rama de revisión
- **THEN** el dashboard utiliza el entorno Supabase de preview y no modifica datos de producción
