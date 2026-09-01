# flujo-editorial-clinico Specification

## Purpose
TBD - created by archiving change crear-circuito-editorial-articulos-redes. Update Purpose after archive.
## Requirements
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

### Requirement: Escritura CMS condicionada por paridad
El flujo editorial MUST mantener bloqueada la escritura Tina de todo modelo clasificado `blocked` o `pending`. Un resultado `safe` de las pruebas locales SHALL ser necesario pero MUST NOT reemplazar la revisión clínica, visual, de privacidad ni la prueba real posterior en Tina y Deploy Preview.

#### Scenario: Modelo con cobertura incompleta
- **WHEN** la matriz contractual identifica un campo persistido que Tina no conserva de forma segura
- **THEN** el modelo permanece sin capacidades de creación o edición hasta resolver el desfase

#### Scenario: Modelo tecnicamente seguro
- **WHEN** Artículo o Instrucción obtiene estado `safe` en paridad y round-trip Tina
- **THEN** queda habilitado solamente para el piloto en rama y no se considera aprobado ni publicado automáticamente

#### Scenario: Default sin aprobacion
- **WHEN** Tina inicializa un documento editorial
- **THEN** comienza como `draft` sin fecha de publicación, revisión clínica ni autorización de uso inferida

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

### Requirement: Presentación proporcional de estados editoriales
La interfaz SHALL admitir un perfil operativo `solo` y un perfil `collaborative` sin cambiar la validez histórica de los estados editoriales. El perfil `solo` MUST ofrecer como transiciones ordinarias `draft`, `published` y `retired`, mientras `collaborative` SHALL conservar las etapas diferenciadas de revisión clínica, revisión técnica y aprobación. La simplificación MUST NOT inferir aprobaciones ni omitir requisitos aplicables para publicar.

#### Scenario: Profesional opera su propio sitio
- **WHEN** la instalación usa el perfil `solo` y la profesional prepara una pieza
- **THEN** puede pasar de Borrador a Publicado confirmando dentro del documento su revisión clínica y demás requisitos aplicables, sin autoasignarse etapas intermedias redundantes

#### Scenario: Equipo con responsabilidades separadas
- **WHEN** la instalación usa el perfil `collaborative`
- **THEN** el selector conserva Borrador, Revisión clínica, Revisión técnica, Aprobado, Publicado y Retirado

#### Scenario: Documento histórico en estado intermedio
- **WHEN** el perfil `solo` carga un documento existente con un estado intermedio válido
- **THEN** el sistema preserva su valor y contenido hasta que una persona elija conscientemente una transición ordinaria

#### Scenario: Aprobación aplicable ausente
- **WHEN** una pieza clínica o una imagen requiere confirmación humana y ésta no está registrada
- **THEN** el perfil simple mantiene la pieza bloqueada y no la presenta como lista para publicar

