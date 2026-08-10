## Context

El sitio ya publica artículos JSON con estados editoriales, metadata, imágenes aprobadas y URL canónica. El circuito anterior mezclaba esa infraestructura web con derivados sociales; la web ya fue aprobada y desplegada, mientras que redes se realizará en una etapa independiente.

Paula conserva la autoridad sobre datos clínicos e imágenes. Alejandro aprueba el enfoque editorial, el calendario y cualquier acción externa. El repositorio puede guardar paquetes de trabajo no sensibles, pero no credenciales, consentimientos ni datos identificatorios.

## Goals / Non-Goals

**Goals:**

- Usar el artículo publicado como única fuente clínica para cada paquete social.
- Adaptar cada pieza a Instagram o Facebook sin copiar mecánicamente el artículo.
- Mantener trazabilidad entre fuente, versión, activos, aprobación, calendario y medición.
- Entregar piezas listas para revisión o programación manual, nunca publicarlas automáticamente.

**Non-Goals:**

- Administrar cuentas sociales o incorporar credenciales al proyecto.
- Generar nuevos hechos clínicos mediante interpretación de imágenes.
- Modificar el contenido público del sitio como parte de la preparación social.
- Implementar el runner de LM Studio, el menú mobile o el dashboard dinámico.

## Decisions

### Artículo publicado como fuente canónica

Cada paquete referenciará el slug, URL canónica y versión o fecha del artículo fuente. Si el artículo cambia, toda pieza todavía no publicada volverá a revisión.

Alternativa descartada: redactar piezas directamente desde imágenes o mensajes sueltos. Esa vía pierde contexto y aumenta el riesgo clínico.

### Paquetes fuera del build público

Los entregables se guardarán en una ruta editorial versionada que no sea cargada por `src/data`, con un manifiesto legible que identifique canal, formato, copy, CTA, hashtags, activos, estado y fecha planificada.

Alternativa descartada: incorporar las piezas al CMS público antes de necesitar una interfaz social. Agregaría superficie de publicación sin una necesidad aprobada.

### Formato condicionado por los activos

Una imagen permite un post simple; una secuencia coherente puede habilitar carrusel, Stories o Reel. La ausencia de material no se completará con imágenes inferidas ni con etapas clínicas inventadas.

### Aprobaciones separadas de la entrega

Los estados operativos distinguirán borrador, revisión clínica, revisión editorial, aprobado y entregado. “Aprobado” no significa publicado en una cuenta externa; cualquier programación o publicación requerirá otra autorización explícita.

### Medición sin dependencia externa inicial

Los enlaces usarán parámetros UTM acordados y el paquete registrará las métricas que puedan obtenerse manualmente. No se integrarán APIs sociales ni herramientas de programación en esta primera etapa.

## Risks / Trade-offs

- [Una pieza simplifica demasiado un caso] → Comparar copy y assets contra el artículo fuente durante la revisión clínica.
- [Una imagen identifica a un paciente] → Exigir autorización confirmada y control visual antes de incluirla.
- [El artículo cambia después de preparar la pieza] → Marcar derivados pendientes para regeneración o nueva aprobación.
- [No hay activos suficientes para el formato deseado] → Elegir un formato más simple y documentar la limitación.
- [La medición manual es incompleta] → Registrar sólo métricas disponibles y evitar conclusiones causales no respaldadas.

## Migration Plan

1. Seleccionar artículos publicados y activos autorizados para el primer lote.
2. Definir plantilla de paquete, nomenclatura, UTM y calendario.
3. Preparar piezas y previews sin acceso a cuentas externas.
4. Obtener revisión clínica y editorial; corregir hasta aprobar.
5. Entregar el paquete y registrar cualquier publicación realizada por una persona autorizada.
6. Revisar métricas disponibles y ajustar el siguiente lote.

Rollback: retirar una pieza del calendario, invalidar su estado de aprobación y conservar el historial de la decisión sin eliminar el artículo fuente.

## Open Questions

- Confirmar qué artículos integrarán el primer lote social.
- Confirmar si la programación será manual o mediante una herramienta externa en una etapa posterior.
- Acordar responsables y formato del reporte mensual de métricas.
