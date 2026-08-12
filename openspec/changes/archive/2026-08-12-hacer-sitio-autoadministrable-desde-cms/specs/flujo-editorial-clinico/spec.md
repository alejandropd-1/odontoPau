## ADDED Requirements

### Requirement: Edicion CMS versionada y autorizada
Toda creacion o edicion clinica desde el CMS MUST realizarse por una persona autorizada y SHALL quedar asociada a una rama o cambio Git revisable. El acceso de edicion MUST NOT otorgar por si mismo permiso para mezclar a `main` ni publicar.

#### Scenario: Editor prepara un cambio
- **WHEN** una persona autorizada modifica contenido desde Netlify Visual Editor
- **THEN** el cambio queda disponible como revision Git y Deploy Preview sin alterar produccion

#### Scenario: Persona sin autorizacion
- **WHEN** una persona no posee el rol o acceso editorial requerido
- **THEN** no puede crear, modificar ni publicar documentos desde el CMS

### Requirement: Puertas de publicacion para cambios del CMS
Un cambio originado en el CMS MUST superar las mismas revisiones clinica, privacidad/consentimiento, editorial, tecnica y visual que un cambio realizado manualmente. Solo el responsable autorizado SHALL aprobar el merge a `main` y la verificacion posterior del deploy.

#### Scenario: Contenido visualmente correcto sin aprobacion clinica
- **WHEN** un preview no presenta fallos tecnicos pero Paula no confirmo las afirmaciones clinicas
- **THEN** el cambio no puede mezclarse ni publicarse

#### Scenario: Todas las puertas aprobadas
- **WHEN** el contenido posee aprobaciones requeridas, validaciones tecnicas correctas y autorizacion explicita de merge
- **THEN** puede incorporarse a `main`, desplegarse y verificarse en produccion

### Requirement: Despublicacion y retiro trazables
El retiro de contenido SHALL realizarse mediante estado editorial y cambio Git revisable antes de considerar borrado fisico. El sistema MUST conservar trazabilidad no sensible del motivo y revision sin exponer datos clinicos privados.

#### Scenario: Correccion urgente
- **WHEN** Paula solicita retirar temporalmente una pieza publicada
- **THEN** se prepara un cambio de estado que la excluye de produccion tras el flujo autorizado y conserva su historial Git

#### Scenario: Solicitud de eliminacion definitiva
- **WHEN** se requiere borrar activos o documentos por privacidad o consentimiento
- **THEN** se identifica el alcance exacto, se ejecuta un proceso autorizado especifico y se verifica que rutas, caches y derivados no sigan exponiendolos

### Requirement: Separacion entre CMS y plano operativo
El estado publico efectivo MUST provenir del JSON desplegado. Supabase MAY registrar inventario, responsables y aprobaciones, pero MUST NOT sobrescribir el cuerpo clinico, cambiar `published`, hacer merge ni desplegar desde el dashboard.

#### Scenario: Estado operativo divergente
- **WHEN** Supabase y la revision Git muestran estados diferentes
- **THEN** el dashboard señala la divergencia y el sitio publico conserva el estado del JSON desplegado

#### Scenario: Sincronizacion editorial
- **WHEN** el dashboard importa inventario desde Git
- **THEN** preserva metadatos operativos y no escribe cambios inversos en los documentos del CMS
