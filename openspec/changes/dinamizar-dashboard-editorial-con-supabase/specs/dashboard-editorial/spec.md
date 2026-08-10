## MODIFIED Requirements

### Requirement: Lectura Dinámica del Catálogo de Contenidos
El sistema SHALL obtener desde Supabase el inventario editorial persistente y sus estados operativos, SHALL identificar la revisión Git sincronizada y SHALL actualizar KPIs y listados sin requerir un nuevo build por cada mutación autorizada.

#### Scenario: Visualización del catálogo persistente
- **WHEN** un usuario editorial autorizado accede a `/editorial`
- **THEN** el sistema muestra artículos e instrucciones sincronizados, estados operativos, responsables y enlaces de vista previa desde Supabase

#### Scenario: Actualización autorizada
- **WHEN** un editor modifica un campo operativo permitido
- **THEN** el dashboard y las siguientes consultas reflejan el cambio sin editar archivos de código ni publicar el sitio

### Requirement: Trazabilidad con Google Drive
El sistema SHALL persistir para cada pieza únicamente una etiqueta o referencia no sensible de su carpeta de origen, junto con la ruta JSON, revisión y hash sincronizados, sin almacenar credenciales ni acceder automáticamente a Google Drive.

#### Scenario: Mapeo de fuente
- **WHEN** se visualiza la trazabilidad de una pieza
- **THEN** el dashboard muestra su referencia de origen, ruta Git, revisión sincronizada y estado de coincidencia

## ADDED Requirements

### Requirement: Mutaciones operativas protegidas
El dashboard SHALL permitir modificar sólo campos operativos autorizados y MUST impedir que una mutación publique contenido, cambie JSON, escriba en `main` o dispare Netlify.

#### Scenario: Editor marca una pieza como lista
- **WHEN** un editor actualiza el estado operativo después de una revisión
- **THEN** Supabase registra el cambio y el sitio público permanece intacto

### Requirement: Estados de carga, error y desincronización
El dashboard SHALL comunicar carga, ausencia de datos, fallo de Supabase y divergencia con Git sin reemplazar errores por datos hardcodeados.

#### Scenario: Supabase no disponible
- **WHEN** la consulta falla
- **THEN** la interfaz muestra un error recuperable y no presenta información estática como si estuviera actualizada

### Requirement: Interfaz responsive y accesible
KPIs, filtros, tablas, formularios y diálogos SHALL funcionar con teclado y tecnología asistiva y SHALL evitar overflow horizontal en viewports móviles.

#### Scenario: Gestión desde mobile
- **WHEN** un usuario accede al dashboard en 390 px
- **THEN** puede consultar y actualizar campos permitidos sin desplazamiento horizontal de la página

### Requirement: Autoridad pública visible
La interfaz MUST diferenciar estado operativo, estado del JSON y autorización de publicación, y MUST advertir cuando exista divergencia.

#### Scenario: Supabase aprobado y JSON en revisión
- **WHEN** una fila operativa está aprobada pero el JSON no está `published`
- **THEN** el dashboard muestra la diferencia y no presenta la pieza como publicada

## REMOVED Requirements

### Requirement: Módulo de Difusión para Redes Sociales

**Reason**: La producción y aprobación de derivados sociales se separó del dashboard y se gestiona mediante el OpenSpec `preparar-redes-sociales-editoriales`.

**Migration**: El dashboard podrá enlazar al estado de un paquete social en una fase posterior, pero no generará copys ni marcará piezas como listas para difusión dentro de este cambio.
