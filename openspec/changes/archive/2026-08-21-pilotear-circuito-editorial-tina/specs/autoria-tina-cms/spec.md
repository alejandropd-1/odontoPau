## MODIFIED Requirements

### Requirement: Escritura exclusiva en rama no productiva
Toda escritura remota ordinaria iniciada desde Tina MUST apuntar a `editorial/tina` y MUST permanecer separada de `main`. Un `Save` MUST actualizar solamente el snapshot editorial y su Preview; Tina MUST NOT inferir intención de publicación a partir del guardado. La única promoción permitida SHALL comenzar con una acción explícita `Publicar cambios` y SHALL atravesar la automatización Git protegida.

#### Scenario: Configuracion resuelve main
- **WHEN** un build administrativo con escritura habilitada resuelve `main` como rama de edición
- **THEN** la validación falla y el admin no se declara apto para uso editorial

#### Scenario: Guardado ordinario
- **WHEN** un colaborador autorizado guarda un documento válido
- **THEN** el commit queda en `editorial/tina`, actualiza Preview y no modifica producción

#### Scenario: Publicacion explicita
- **WHEN** un colaborador autorizado activa `Publicar cambios`
- **THEN** Tina registra una solicitud versionada y delega la promoción a los gates Git sin escribir directamente en `main`

## ADDED Requirements

### Requirement: Solicitud editorial versionada e idempotente
El CMS SHALL exponer un singleton interno no renderizado que represente una solicitud de publicación del snapshot completo de `editorial/tina`. La solicitud MUST incluir un identificador único, fecha, estado y referencia al último identificador procesado, y MUST NOT contener secretos, datos clínicos privados ni credenciales.

#### Scenario: Nueva solicitud
- **WHEN** un colaborador confirma la publicación y no existe otra solicitud activa
- **THEN** se genera un identificador nuevo y el estado pasa a `pending`

#### Scenario: Doble activacion
- **WHEN** la interfaz recibe una segunda activación mientras la solicitud vigente está pendiente o procesándose
- **THEN** no genera una promoción duplicada y muestra el estado de la solicitud existente

#### Scenario: Resultado registrado
- **WHEN** la automatización finaliza o falla
- **THEN** el singleton conserva un resultado mínimo, fecha e identificador procesado sin copiar logs completos

### Requirement: Convergencia posterior de la rama editorial
Después de cada promoción editorial exitosa, `editorial/tina` MUST converger con el commit vigente de `main` y TinaCloud MUST poder indexar ese snapshot antes del siguiente ciclo. La rama editorial MUST permanecer disponible y MUST NOT eliminarse como rama efímera.

#### Scenario: Rama editorial publicable
- **WHEN** `main` es ancestro de `editorial/tina` y la promoción finaliza
- **THEN** el sistema puede integrar el snapshot y adelantar `editorial/tina` por fast-forward hasta el commit publicado

#### Scenario: Rama editorial divergente
- **WHEN** `editorial/tina` y `main` contienen commits exclusivos incompatibles
- **THEN** la promoción se bloquea y presenta la divergencia para revisión sin force-push ni pérdida de contenido

#### Scenario: Schema remoto pendiente
- **WHEN** TinaCloud todavía no indexó el commit convergente
- **THEN** el estado permanece observable como pendiente de índice y no se publica un segundo snapshot ambiguo
