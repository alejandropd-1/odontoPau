## ADDED Requirements

### Requirement: Paquete de ingreso minimo
El flujo SHALL requerir para cada pieza un tema o caso, tratamiento relacionado, contexto clinico provisto por Paula, inventario de imagenes, autorizacion de uso confirmada y objetivo editorial.

#### Scenario: Informacion incompleta
- **WHEN** faltan datos clinicos, asociacion de imagenes o confirmacion de uso
- **THEN** Codex mantiene la pieza como pendiente y enumera lo necesario sin inventar contenido

### Requirement: Borrador seguro por defecto
Todo articulo nuevo MUST crearse con estado `draft` y sin exposicion publica.

#### Scenario: Creacion inicial
- **WHEN** Codex transforma el paquete de ingreso en un documento del sitio
- **THEN** el documento queda como borrador aunque el texto parezca completo

### Requirement: Aprobacion clinica obligatoria
El flujo MUST exigir confirmacion de Paula sobre diagnostico, tecnica, tiempos, resultados, cifras, testimonios y recomendaciones antes de aprobar contenido clinico.

#### Scenario: Afirmacion no confirmada
- **WHEN** el borrador contiene una afirmacion clinica que Paula no confirmo
- **THEN** la pieza no puede avanzar a `approved` ni `published`

### Requirement: Privacidad y consentimiento
El flujo MUST verificar autorizacion de uso y minimizar identificadores antes de incorporar imagenes o relatos; MUST mantener historias clinicas y evidencia privada fuera del repositorio.

#### Scenario: Imagen sin autorizacion confirmada
- **WHEN** una imagen puede pertenecer a un paciente y no existe confirmacion de uso
- **THEN** no se copia a `public` ni se utiliza en el sitio

#### Scenario: Metadatos sensibles
- **WHEN** una imagen aprobada contiene metadatos innecesarios o un nombre de archivo identificatorio
- **THEN** se limpia y renombra antes de versionarla

### Requirement: Revision tecnica y visual
Antes de publicar, el cambio SHALL superar validacion de datos, TypeScript, lint, build, enlaces, metadata y revision visual desktop/mobile en preview.

#### Scenario: Falla de validacion
- **WHEN** cualquiera de los controles tecnicos o visuales detecta un defecto relevante
- **THEN** el articulo permanece no publicado hasta corregirlo

### Requirement: Produccion protegida por la rama principal
El flujo MUST tratar `main` como rama de produccion de Netlify y MUST mantener cada cambio OpenSpec en su propia rama hasta completar el preview y recibir aprobacion explicita de merge.

#### Scenario: Rama OpenSpec en revision
- **WHEN** una rama de contenido o infraestructura se envia a GitHub
- **THEN** se revisa mediante el preview disponible y no modifica el sitio de produccion

#### Scenario: Publicacion aprobada
- **WHEN** el cambio supera las aprobaciones y se autoriza su merge a `main`
- **THEN** Netlify genera el deploy de produccion y el responsable verifica el resultado

### Requirement: Trazabilidad editorial
El repositorio SHALL conservar de forma no sensible el estado, fechas editoriales, responsable clinico y cambios relevantes de cada articulo mediante JSON, OpenSpec y Git.

#### Scenario: Correccion posterior
- **WHEN** Paula actualiza una afirmacion de un articulo existente
- **THEN** se registra la correccion y se vuelve a validar el articulo antes de publicar

### Requirement: Testimonios temporalmente ocultos
El sitio SHALL mantener inactiva la seccion publica de testimonios y su enlace de navegacion hasta contar con material aprobado, sin eliminar el componente, sus estilos, datos ni integracion con el editor visual.

#### Scenario: Sitio sin testimonios publicados
- **WHEN** la funcionalidad de testimonios esta desactivada
- **THEN** la portada y la navegacion no muestran la seccion ni un enlace hacia ella

#### Scenario: Reactivacion futura
- **WHEN** se autoriza volver a publicar testimonios
- **THEN** la seccion y su enlace pueden reactivarse mediante una unica opcion de configuracion
