## MODIFIED Requirements

### Requirement: Autoridad humana preservada
La automatización contractual MUST NOT inventar ni modificar contenido clínico, imágenes, consentimientos o estados editoriales. Paula SHALL conservar la aprobación aplicable de contenido e imágenes clínicas. Para el carril `editorial-routine`, cualquier colaborador autorizado del proyecto Tina MAY confirmar esa aprobación y ordenar la publicación desde el CMS; no se exigirá un rol técnico adicional ni intervención rutinaria de Alejandro. Los cambios estructurales y el cierre de este OpenSpec conservan sus gates humanos habituales.

#### Scenario: Falta aprobacion clinica aplicable
- **WHEN** el snapshot contiene una novedad clínica o imagen que todavía no fue aprobada
- **THEN** el colaborador no confirma la publicación y los cambios permanecen sólo en Preview

#### Scenario: Colaborador autorizado publica
- **WHEN** un colaborador revisó el Preview, confirma las aprobaciones aplicables y activa `Publicar cambios`
- **THEN** la solicitud se considera la autorización humana del ciclo editorial rutinario y continúa por los gates automáticos

#### Scenario: Cambio estructural
- **WHEN** el diff altera código, schema, configuración, rutas o contratos
- **THEN** la publicación rápida se bloquea y conserva el circuito OpenSpec con validación final de Alejandro

### Requirement: Circuito Tina a preview con autoridad humana
Toda edición Tina SHALL guardarse primero en `editorial/tina` y SHALL verse en un Preview no productivo. Seleccionar `published` o `retired` en un documento MUST NOT modificar producción por sí solo. La promoción SHALL requerir una acción separada y explícita disponible para todos los colaboradores autorizados, seguida por diff, gates, PR técnico e integración protegida.

#### Scenario: Guardado sin publicacion
- **WHEN** Tina guarda un documento válido
- **THEN** el cambio permanece en Preview aunque el documento tenga estado `published`

#### Scenario: Publicacion del snapshot
- **WHEN** un colaborador confirma la acción `Publicar cambios`
- **THEN** la automatización evalúa el snapshot completo de `editorial/tina` y sólo lo integra si todos los controles pasan

#### Scenario: Evidencia de consentimiento
- **WHEN** una imagen clínica requiere consentimiento
- **THEN** el flujo registra únicamente la confirmación no sensible y mantiene el documento privado fuera de Git y Tina

## ADDED Requirements

### Requirement: Mantenimiento rutinario sin OpenSpec por pieza
Una corrección, alta, retiro o actualización editorial SHALL poder atravesar Tina, Preview, autorización, gates y producción sin crear un OpenSpec nuevo cuando el clasificador confirme que no cambia comportamiento, contratos, estructura ni configuración. Git y el PR técnico MUST conservar la trazabilidad aunque sean invisibles para el usuario del CMS.

#### Scenario: Correccion dentro del contrato
- **WHEN** un colaborador modifica contenido soportado, revisa Preview y el diff permanece en la allowlist
- **THEN** puede completar el carril editorial rutinario desde Tina

#### Scenario: Ambiguedad de alcance
- **WHEN** no puede demostrarse que todos los archivos y efectos pertenecen al mantenimiento rutinario
- **THEN** el ciclo se detiene y requiere un OpenSpec estructural antes de continuar

### Requirement: Retiro reversible sin borrado
Artículos e Instrucciones SHALL admitir el estado `retired`. Un documento retirado MUST permanecer editable y visible en Preview, pero MUST quedar excluido de rutas, listados, relaciones, sitemap y metadata pública de producción después de promover el snapshot.

#### Scenario: Retiro de una pieza publicada
- **WHEN** un colaborador cambia una pieza a `retired`, guarda, revisa Preview y publica el snapshot
- **THEN** la pieza deja de renderizarse en producción sin eliminar su JSON ni sus metadatos editoriales

#### Scenario: Republicacion posterior
- **WHEN** un documento retirado vuelve a `published`, satisface sus requisitos y se publica un nuevo snapshot
- **THEN** recupera sus superficies públicas canónicas sin crear un duplicado

### Requirement: Intervencion de Codex por excepcion
La rutina SHALL solicitar intervención técnica ante gates fallidos, divergencia Git, inconsistencia contractual, error de deploy, duda clínica o cambio estructural. Un ciclo saludable MUST poder completarse desde Tina sin un relevamiento general repetido.

#### Scenario: Todos los indicadores estan verdes
- **WHEN** alcance, gates, aprobación, convergencia y producción coinciden con el request esperado
- **THEN** el ciclo finaliza sin pedir a Codex que vuelva a inspeccionar todas las capas
