## MODIFIED Requirements

### Requirement: Compatibilidad de rutas históricas
El sistema MUST redirigir permanentemente las rutas públicas anteriores de implantes hacia sus destinos canónicos vigentes, sin sostener una ficha legacy duplicada.

#### Scenario: Página histórica del tratamiento
- **WHEN** se solicita `/tratamientos/implantes`
- **THEN** se responde con una redirección permanente a `/tratamientos/rehabilitacion`

#### Scenario: Caso histórico documentado
- **WHEN** se solicita `/tratamientos/implantes/casos/2`
- **THEN** se responde con una redirección permanente a `/articulos/rehabilitacion-sector-anterosuperior`
