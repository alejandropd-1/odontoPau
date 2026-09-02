## Purpose

Conservar una referencia operativa confiable y comprensible de cada ciclo de publicación editorial, sin almacenar información clínica ni exponer infraestructura.

## ADDED Requirements

### Requirement: Registro persistente por ciclo de publicación

El sistema MUST conservar un registro independiente por cada solicitud de publicación que alcance un resultado final, sin sobrescribir los ciclos anteriores cuando se inicie una solicitud nueva.

#### Scenario: Publicación confirmada

- **WHEN** una solicitud termina con confirmación del sitio público
- **THEN** el sistema conserva un registro exitoso con las fechas de pedido y finalización, una explicación legible y la referencia interna necesaria para correlacionar el resultado

#### Scenario: Publicación detenida

- **WHEN** una solicitud termina por un control fallido o una confirmación pública no alcanzada
- **THEN** el sistema conserva un registro detenido con una explicación operativa que permita saber si hace falta intervenir o volver a intentar

#### Scenario: Procesamiento repetido

- **WHEN** el flujo recibe nuevamente el mismo identificador de solicitud
- **THEN** el sistema no duplica el ciclo ni altera un resultado final ya registrado

### Requirement: Contrato operativo acotado

El registro MUST aceptar únicamente datos necesarios para explicar el ciclo de publicación y DEBERÁ excluir contenido clínico, datos de pacientes, consentimientos, secretos y texto libre no controlado.

#### Scenario: Registro válido

- **WHEN** el flujo genera un resultado con identificador, fechas, resultado y explicación dentro del contrato permitido
- **THEN** el sistema valida y conserva el evento

#### Scenario: Dato sensible o campo inesperado

- **WHEN** se intenta guardar un campo no permitido o un valor que no cumple el contrato
- **THEN** el sistema rechaza el registro sin reemplazar el historial válido existente

### Requirement: Consulta cronológica y recuperación segura

El sistema MUST ofrecer los ciclos más recientes primero y DEBERÁ mantener utilizable la operación editorial cuando el historial esté vacío, incompleto o temporalmente no disponible.

#### Scenario: Varios ciclos disponibles

- **WHEN** existen varios resultados registrados
- **THEN** la consulta devuelve primero el ciclo finalizado más recientemente y conserva cada resultado como una entrada separada

#### Scenario: Primera publicación

- **WHEN** todavía no existe ningún ciclo registrado
- **THEN** la consulta devuelve un historial vacío válido, sin presentar el caso como error

#### Scenario: Registro parcial o inválido

- **WHEN** una entrada histórica no puede validarse
- **THEN** el sistema omite o señala esa entrada de forma segura y conserva disponibles las demás entradas válidas

### Requirement: Resumen derivado verificable

El sistema MUST calcular el resumen operativo exclusivamente a partir de ciclos válidos y finalizados, sin convertir etapas intermedias en publicaciones exitosas.

#### Scenario: Última publicación confirmada

- **WHEN** existe al menos un ciclo exitoso
- **THEN** el resumen identifica la fecha de la confirmación exitosa más reciente

#### Scenario: Solicitud todavía en curso

- **WHEN** la solicitud actual sigue pendiente, en controles o esperando confirmación pública
- **THEN** el resumen histórico no incrementa los resultados exitosos ni detenidos hasta que exista un resultado final

#### Scenario: Duración del ciclo

- **WHEN** un ciclo válido posee fecha de pedido y fecha de finalización coherentes
- **THEN** el resumen puede informar su duración sin exponer identificadores técnicos

### Requirement: Autoridad de la publicación pública

El historial MUST considerar publicada una tanda sólo después de la confirmación pública prevista por el circuito editorial vigente.

#### Scenario: Integración sin confirmación pública

- **WHEN** los cambios fueron integrados pero el sitio público todavía no confirmó la nueva versión
- **THEN** el ciclo no se registra ni presenta como publicación exitosa

#### Scenario: Referencia para derivados futuros

- **WHEN** otro proceso necesita saber si una tanda puede usarse como fuente publicada
- **THEN** sólo los ciclos exitosos y públicamente confirmados se ofrecen como referencia confiable
