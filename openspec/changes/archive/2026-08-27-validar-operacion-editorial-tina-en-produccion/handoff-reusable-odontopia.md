# Handoff reusable para OdontoPia

> Handoff completado a partir de los tres ciclos reales de OdontoPau. No habilita por sí solo cambios en otro repositorio.

## Objetivo transferible

Validar que una persona no técnica pueda guardar, revisar, publicar, retirar y republicar contenido desde un único panel editorial. La experiencia saludable debe mostrar acciones y resultados cotidianos, mientras las comprobaciones técnicas permanecen detrás del panel.

## Condiciones de entrada

- El sitio destino ya cuenta con una rama editorial no productiva y una vista previa estable.
- Guardar contenido no modifica producción.
- La publicación protegida valida una tanda completa y aprobada.
- Existe una forma no sensible de confirmar qué revisión sirve producción.
- Los contenidos retirados permanecen editables y recuperables.
- La persona responsable confirmó la ventana temporal para cualquier retiro real.

## Secuencia de validación

1. Elegir una actualización visible, pequeña, reversible y ya aprobada.
2. Guardarla y confirmar que aparece en la vista previa mientras producción conserva la versión anterior.
3. Publicar desde el panel y esperar su confirmación final antes de iniciar otra tanda.
4. Elegir una pieza publicada con impacto conocido y autorización para una ventana breve de retiro.
5. Retirarla sin borrar el documento; comprobar ruta pública, listados, relaciones, buscadores y metadatos aplicables.
6. Confirmar convergencia antes de republicar.
7. Republicar el mismo documento y verificar que reaparecen sus superficies sin duplicados.

## Evidencia mínima por ciclo

| Dato | Actualización | Retiro | Republicación |
|---|---|---|---|
| Inicio y fin | 24/08; publicación protegida: 3 min 12 s | 26–27/08; ventana extendida por incidencias externas y defectos bloqueantes | 27/08; publicación final: 5 min 17 s |
| Pieza y cambio autorizado | Texto visible ya aprobado | Pieza existente con ventana temporal confirmada | La misma pieza, sin cambios adicionales |
| Vista previa revisada | Sí; producción conservó el texto anterior antes de publicar | Sí; documento completo, editable y fuera de producción sólo después de publicar | Sí; documento restaurado mientras producción seguía retirada |
| Controles internos aprobados | Sí, sobre el snapshot exacto | Sí; incluyó la regresión para relaciones con contenido retirado | Sí; la espera corregida confirmó el control del snapshot exacto |
| Actualización pública confirmada | Texto nuevo visible | Ruta, listados, relación y mapa público omitieron la pieza | Ruta, listados, relación, redirección histórica y mapa público restaurados |
| Superficies comprobadas | Portada y estado final del panel | Ruta canónica, listados, relación, ruta histórica y sitemap | Las mismas superficies en sentido inverso |
| Documento editable y sin duplicados | Sí | Sí; se conservó un único documento retirado | Sí; el mismo documento volvió a publicado |

Registrar sólo horarios, identificadores técnicos no sensibles y resultados. No copiar credenciales, logs completos, consentimientos ni información identificatoria de pacientes.

## Qué debe adaptarse por sitio

- Los tipos de contenido y sus estados permitidos.
- Las superficies públicas afectadas por cada pieza.
- Las relaciones entre contenidos y los metadatos aplicables.
- Las reglas locales de revisión clínica, visual y de imágenes.
- Los tiempos esperados y el canal de soporte.

No copiar nombres de modelos, rutas, listas de archivos permitidos ni identificadores propios de OdontoPau. Primero se releva el contrato real de OdontoPia y se crea su OpenSpec acotado.

## Decisiones de producto surgidas del uso real

- Una pieza retirada no tiene ruta pública, pero debe conservar una acción evidente para abrir su formulario y republicarla. La fila no puede depender exclusivamente de Visual Editing.
- En una operación individual donde el profesional administra su propio Tina, los estados intermedios de revisión clínica, revisión técnica y aprobación pueden resultar redundantes. El cambio de dashboard debe relevar si basta un ciclo reducido —por ejemplo borrador, publicado y retirado— y representar las confirmaciones aplicables como una acción previa a publicar, no necesariamente como estados persistentes separados.
- La simplificación no debe eliminar la posibilidad de revisión separada para instalaciones con colaboradores. El conjunto de estados y aprobaciones debe derivar del modelo operativo real de cada sitio.
- El panel debe distinguir visualmente tres momentos cotidianos: `Sólo en vista previa`, `Publicando en el sitio` y `Ya está publicado`. Un rótulo como `Publicación en curso` no alcanza si la persona no puede reconocer de inmediato qué versión está viendo y si el sitio público ya cambió.
- La confirmación final debe incluir resultado y hora en lenguaje coloquial. Los detalles de revisiones, integraciones y despliegues permanecen fuera de la experiencia normal y sólo aparecen en soporte.
- En mobile, el panel funciona en una columna después de cerrar la navegación de Tina. Debe comprobarse que la adaptación destino no deje la navegación abierta sobre el contenido y que todos sus botones, incluido el cierre, tengan nombre accesible.

## Experiencia esperada para la persona que edita

- Entra por una sola dirección editorial.
- Guarda y revisa todos los cambios de la tanda en la vista previa.
- Confirma las aprobaciones aplicables.
- Publica una vez y espera estados comprensibles que se actualizan solos.
- Ante un bloqueo, sabe si debe corregir, esperar o pedir soporte.
- No necesita conocer ramas, revisiones técnicas, despliegues ni herramientas de infraestructura.

## Criterio para cerrar este handoff

La tabla contiene la evidencia no sensible de los tres ciclos y los tiempos observados. Antes de reutilizarla debe relevarse el contrato real del sitio destino, definir sus superficies públicas y decidir si la operación es individual o colaborativa. Las mejoras de listado por contenido y simplificación de estados requieren su propio OpenSpec; este handoff no las implementa.
