# rehabilitacion-canonica Specification

## Purpose
TBD - created by archiving change integrar-lote-clinico-y-rehabilitacion. Update Purpose after archive.
## Requirements
### Requirement: Rehabilitación como identidad canónica
El sistema SHALL identificar el tratamiento con `rehabilitacion`, presentar el nombre “Rehabilitación” y usar `/tratamientos/rehabilitacion` como URL canónica en navegación, metadata, sitemap, CMS y relaciones editoriales.

#### Scenario: Navegación al servicio
- **WHEN** una persona abre el listado de tratamientos y selecciona Rehabilitación
- **THEN** navega a `/tratamientos/rehabilitacion` y la página presenta contenido coherente con ese nombre

#### Scenario: Índices técnicos
- **WHEN** se genera el sitemap o el mapa del CMS
- **THEN** se emite la URL canónica de Rehabilitación y no una URL indexable duplicada bajo `implantes`

### Requirement: Compatibilidad de rutas históricas
El sistema MUST redirigir permanentemente las rutas públicas anteriores de implantes hacia sus destinos canónicos vigentes, sin sostener una ficha legacy duplicada.

#### Scenario: Página histórica del tratamiento
- **WHEN** se solicita `/tratamientos/implantes`
- **THEN** se responde con una redirección permanente a `/tratamientos/rehabilitacion`

#### Scenario: Caso histórico documentado
- **WHEN** se solicita `/tratamientos/implantes/casos/2`
- **THEN** se responde con una redirección permanente a `/articulos/rehabilitacion-sector-anterosuperior`

### Requirement: Evidencia clínica verificable
La página de Rehabilitación SHALL excluir testimonios, porcentajes, duraciones, diagnósticos, resultados y casos de demostración no confirmados, y SHALL presentar sólo el caso anterosuperior respaldado por Paula cuando corresponda.

#### Scenario: Revisión del contenido migrado
- **WHEN** se inspecciona la página y sus datos después de la migración
- **THEN** no aparecen nombres ficticios, promesas de ausencia de dolor, tasas de éxito ni plazos sin respaldo

### Requirement: Integridad de relaciones
Todo `serviceId` SHALL resolver a un tratamiento existente después de la migración.

#### Scenario: Validación de contenido
- **WHEN** se cargan artículos e instrucciones durante el build
- **THEN** ninguna referencia conserva `implantes` como identificador inexistente y el build no presenta relaciones huérfanas

