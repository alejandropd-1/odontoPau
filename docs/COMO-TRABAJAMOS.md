# OpenSpec explicado sin vueltas

Podés pedir el trabajo en tus palabras; no hace falta conocer los comandos para usar estos planes.

## Para qué sirve OpenSpec

OpenSpec guarda el acuerdo de un cambio dentro del proyecto. Nos ayuda a retomar después de unas semanas sin depender de recordar todo el chat. No es la aplicación y no hace funcionar una feature por escribirla.

| Archivo | Para qué nos sirve |
|---|---|
| `proposal.md` | Explica qué problema queremos resolver y qué entra en el trabajo. |
| `design.md` | Anota las decisiones importantes sobre cómo hacerlo. No todos los cambios necesitan una explicación larga. |
| `specs/` del cambio | Describe cómo debe comportarse el resultado, con ejemplos para comprobarlo. |
| `tasks.md` | Lista los pasos y marca cuáles se hicieron de verdad. |
| `openspec/specs/` | Guarda el contrato general del producto; no debe confundirse con propuestas todavía pendientes. |

Un **change** es la carpeta de un cambio concreto. **Validar** revisa que los documentos tengan el formato y las relaciones que OpenSpec espera; no prueba por sí solo que el código funcione. **Implementar** es hacer el cambio en el producto y comprobarlo. **Archivar** guarda el cambio cerrado en el historial y, cuando corresponde, incorpora sus requisitos al contrato general. **Publicar** es llevar una versión a la web real: es otra acción distinta.

Cuando aparezca uno de esos pasos, te voy a decir qué estoy haciendo en palabras simples. Por ejemplo: “estoy actualizando la lista de pendientes porque encontramos un caso que faltaba” o “el plan está completo; todavía falta construirlo”. No hace falta repasar todos los archivos en cada mensaje.

## Un ejemplo práctico

Pedido: “quiero que se avise cuando se cancela un turno”. Primero miro si ya hay un cambio de notificaciones. Si existe, agrego ahí el comportamiento esperado y las tareas faltantes. Después implemento y pruebo que se envíe al destinatario correcto, una sola vez y con el permiso correspondiente. Recién entonces marco esas tareas como hechas. Que la carpeta diga “4/4 documentos completos” solo significa que el plan está escrito.
