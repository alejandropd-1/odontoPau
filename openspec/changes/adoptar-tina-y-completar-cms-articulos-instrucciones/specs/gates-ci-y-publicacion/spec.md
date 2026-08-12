## MODIFIED Requirements

### Requirement: Main protegida y publicacion por Git
Una vez validado el workflow remoto, `main` SHALL requerir el check de calidad y toda edición de Tina SHALL llegar desde una rama de trabajo separada mediante Draft PR. Tina MUST NOT escribir ni mezclar directamente a `main`; Netlify MUST limitar producción al flujo Git cuando la opción esté disponible y verificada.

#### Scenario: Guardado desde Tina
- **WHEN** un editor guarda cambios desde el Git CMS
- **THEN** el commit queda en la rama configurada y GitCron o GitHub permite abrir o actualizar el Draft PR sin mezclar a `main`

#### Scenario: Check pendiente o fallido
- **WHEN** el pull request no tiene un check exitoso en su última revisión
- **THEN** la protección de rama impide el merge

#### Scenario: Intento de escritura a main
- **WHEN** la configuración administrativa de Tina resuelve `main` como destino de escritura
- **THEN** el gate falla y exige seleccionar una rama no productiva antes de habilitar el editor

#### Scenario: Intento de deploy directo
- **WHEN** una herramienta intenta publicar producción mediante CLI, API o promoción de preview
- **THEN** la configuración Git-only rechaza el deploy y exige integrar el cambio por la rama de producción

## ADDED Requirements

### Requirement: Gate reproducible del adaptador Tina
Todo pull request que modifique schema, modelos o contenido del Slice B SHALL normalizar y comparar el adaptador Tina contra el contrato neutral, ejecutar round-trip y confirmar no mutación antes de TypeScript, lint y build. El gate MUST funcionar sin credenciales ni acceso de escritura a TinaCloud.

#### Scenario: Schema Tina alineado
- **WHEN** modelos, fixtures y documentos copiados conservan todas las rutas de Artículos e Instrucciones
- **THEN** CI informa cobertura del Slice B y continúa con los restantes controles

#### Scenario: Campo perdido o documento mutado
- **WHEN** Tina omite un campo contractual o la prueba altera un JSON canónico
- **THEN** CI falla e identifica modelo, ruta y clase de diferencia antes del build

