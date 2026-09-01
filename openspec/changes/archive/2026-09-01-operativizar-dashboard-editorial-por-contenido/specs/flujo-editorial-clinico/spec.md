## ADDED Requirements

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
