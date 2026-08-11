## ADDED Requirements

### Requirement: Gate de paridad contractual CMS
Todo pull request que modifique contratos, modelos o contenido editorial SHALL ejecutar un comando local y remoto de paridad CMS, round-trip semantico y no mutacion antes de TypeScript, lint y build. El gate MUST ser determinista, usar dependencias fijadas y MUST NOT requerir red, credenciales ni servicios externos.

#### Scenario: Contratos alineados
- **WHEN** el inventario, la paridad y el round-trip pasan sin modificar `src/data`
- **THEN** el gate entrega evidencia de los modelos evaluados y permite continuar con los restantes controles de CI

#### Scenario: Regresion contractual
- **WHEN** un cambio agrega, elimina o altera un campo sin representarlo de forma compatible en todas las capas exigidas
- **THEN** CI falla antes del build e identifica el modelo y la ruta contractual afectada

#### Scenario: Mutacion de contenido durante pruebas
- **WHEN** el comando de round-trip modifica cualquier documento canonico bajo `src/data`
- **THEN** el gate falla aunque la reconstruccion resultante compile correctamente

#### Scenario: Entorno sin secretos
- **WHEN** GitHub Actions ejecuta el control en un checkout limpio
- **THEN** la prueba termina usando solamente archivos y dependencias versionadas del repositorio
