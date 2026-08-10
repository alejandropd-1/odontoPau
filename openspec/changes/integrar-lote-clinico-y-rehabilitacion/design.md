## Context

Los tratamientos se cargan desde JSON y la ruta pública deriva directamente de `Tratamiento.id`. El hero contiene un badge codificado por condicionales e iniciales, mientras que los casos y el bloque de beneficios todavía incluyen demostraciones no verificadas. En paralelo, la plantilla editorial ya diferencia borradores de contenido publicado y acepta módulos opcionales, por lo que el lote nuevo puede integrarse sin crear una segunda plantilla.

Las fuentes del lote son las carpetas entregadas por Paula. `main` contiene fotografías institucionales y el retrato de Paula; los retratos de Pablo Martínez, Roberto Domínguez y María Emilia Omastott están dentro de sus respectivas especialidades. Las imágenes clínicas sólo se usarán cuando la carpeta, el orden y el texto hayan sido confirmados.

## Goals / Non-Goals

**Goals:**

- Representar profesionales como datos editables del tratamiento y renderizarlos de forma accesible en el hero.
- Corregir el caso de pieza 11 y preparar tres casos adicionales en la plantilla editorial única.
- Reemplazar demostraciones clínicas no verificadas por información confirmada o por ausencia explícita del módulo.
- Hacer de Rehabilitación la identidad canónica del servicio sin romper enlaces históricos.
- Mantener todo artículo nuevo fuera de producción hasta completar el circuito editorial.

**Non-Goals:**

- Publicar automáticamente al recibir archivos por WhatsApp.
- Completar casos sin texto clínico de Paula.
- Rediseñar toda la página de tratamientos o reemplazar el CMS Git-based.
- Crear perfiles profesionales independientes ni almacenar matrículas no confirmadas.

## Decisions

### 1. Una plantilla editorial y datos opcionales

Los cuatro casos usarán el modelo `Articulo` existente. Se completarán únicamente `case_summary`, `gallery` y CTA cuando la evidencia sea breve; no se agregarán módulos de diagnóstico, duración, solución o FAQ si Paula no proporcionó esa información. Esto preserva una identidad visual única y evita espacios vacíos.

Alternativa descartada: crear plantillas “corta”, “media” y “larga”. Duplicaría la lógica, el CMS y las pruebas, y haría que el diseño divergiera con el tiempo.

### 2. Estados de revisión, no publicación

Los casos con asociación confirmada quedarán en `technical_review`, visibles sólo en entornos de preview. Producción continuará filtrando estrictamente por `published`. La aprobación de estructura previa no se interpretará como autorización para omitir la revisión visual de los nuevos activos.

Alternativa descartada: marcarlos `published` al integrarlos. Mezclaría preparación con lanzamiento y activaría sitemap, listados y metadatos públicos antes del control final.

### 3. Profesionales declarados en JSON

`Tratamiento` incorporará una lista opcional `professionals` con `name`, `role`, `image` e `imageAlt`. El hero renderizará una foto o un pequeño grupo superpuesto y textos vinculados a esos datos. No habrá condicionales por ID ni roles generados a partir del título del tratamiento.

Asociaciones iniciales:

- Endodoncia: Pablo Alejandro Martínez.
- Estética Dental: Roberto Domínguez y Paula Gualtieri.
- Rehabilitación: Roberto Domínguez.
- Odontología Pediátrica: Paula Gualtieri y María Emilia Omastott.
- Ortodoncia Invisible y Ortopedia: Paula Gualtieri, usando sólo el rol ya publicado por el equipo y sin extrapolarlo a otros profesionales.

Alternativa descartada: seguir mostrando iniciales. No responde al pedido editorial y mantiene nombres y especialidades duplicados en el componente.

### 4. Activos normalizados y optimizados

Los retratos se copiarán a `public/images/profesionales` con nombres estables y se convertirán a WebP. Los casos se guardarán bajo `public/images/articulos/<slug>`, respetando el orden confirmado y generando dimensiones explícitas para reducir saltos de layout. La foto pediátrica será únicamente la variante con protección visual autorizada.

### 5. Migración canónica por identificador

El tratamiento cambiará de `implantes` a `rehabilitacion` en carpeta, archivo, ID, categoría, título, metadatos y enlaces relacionados. `next.config.ts` declarará redirecciones permanentes para la página del tratamiento y sus casos. El sitemap sólo emitirá las URLs nuevas.

Alternativa descartada: conservar `implantes` como ID interno. Mantendría rutas y archivos contradictorios con el nombre aprobado y complicaría futuras publicaciones.

### 6. Eliminación de evidencia ficticia

Los casos de demostración, testimonios, porcentajes, duraciones y estadísticas sin respaldo se eliminarán de Rehabilitación y Pediatría. Los bloques generales del tratamiento dejarán de mostrar estadísticas hardcodeadas. Los textos de CTA y casos se ajustarán a un tono informativo, sin promesas de éxito, ausencia de dolor o resultados universales.

### 7. Voz institucional sin atribuciones internas

La copia pública describirá los datos confirmados de forma directa e impersonal. Las fórmulas “Paula informó”, “Paula indicó”, “según Paula” y equivalentes no se mostrarán en artículos, casos ni instrucciones. La autoría pública será “Equipo clínico”; la revisión clínica nominal puede conservarse como metadato editorial interno.

### 8. El artículo como experiencia canónica del caso

Cada caso podrá declarar un `articleSlug`. Cuando ese artículo sea accesible en el entorno actual, las tarjetas del tratamiento y la ruta histórica del caso resolverán a `/articulos/<slug>`. Si el artículo todavía no es publicable, la ficha histórica seguirá disponible como respaldo. El sitemap excluirá la ruta histórica cuando el artículo correspondiente ya esté publicado.

### 9. Badge profesional contenido dentro del hero

El badge usará márgenes internos al hero, ancho máximo controlado y una grilla `auto/minmax(0, 1fr)` para que avatares y texto puedan convivir sin desbordes. En mobile ocupará el ancho disponible entre dos márgenes simétricos; en desktop se alineará a la derecha con un ancho máximo estable. Los roles extensos deberán envolver líneas sin tocar los bordes de la imagen.

### 10. Segundo lote con evidencia exclusivamente visual

Las carpetas `odontologia_pediatrica/caso-02`, `ortodoncia_invisible/caso-02` y `estetica_dental/caso-04` se incorporarán como artículos breves en `technical_review`. La ruta de carpeta prevalece sobre el rótulo contradictorio recibido para el primer caso. Como no existe texto clínico asociado, la copia pública describirá únicamente el registro y el servicio, sin diagnosticar, ordenar fases ni nombrar procedimientos específicos.

### 11. Collage editorial para el hero de Ortopedia

El hero de Ortopedia usará un único WebP horizontal derivado de cuatro fotografías de aparatología real. Se excluyen las capturas de historias y productos de blanqueamiento mezclados en la carpeta. El collage no llevará texto, logos ni pacientes y deberá soportar recorte central responsive sin perder los aparatos principales.

### 12. Voz cercana y portadas sincronizadas

Los artículos breves evitarán explicar el proceso editorial o describir mecánicamente que existe una imagen. La cautela clínica se conservará mediante afirmaciones generales respaldadas por el servicio, con un tono claro, cálido y conversacional. El archivo de tratamientos reutilizará directamente el `heroImage` vigente de cada servicio, de modo que una actualización del hero también actualice su portada sin mantener dos fuentes de datos.

## Risks / Trade-offs

- [Enlaces históricos a `/implantes`] → Redirecciones permanentes para página y casos; prueba local de códigos y destino.
- [Un artículo vinculado al ID anterior queda inválido] → Búsqueda global y validación del cargador contra todos los `serviceIds`.
- [Badge con dos profesionales se vuelve ilegible en mobile] → Avatares compactos, texto flexible y prueba en 320/375 px.
- [Recorte de retratos pierde el rostro] → `object-position` configurable por profesional y revisión visual de cada hero.
- [Imagen clínica incorrecta] → Mantener el artículo en preview y registrar la ruta de origen en el OpenSpec; no publicar hasta la aprobación visual.
- [El caso de ortodoncia se interpreta como alineadores] → Título y copia neutrales; no usar “invisible”, “convencional” ni describir aparato/técnica.
- [Las imágenes nuevas se interpretan como secuencia temporal] → Omitir etiquetas “Antes/Después” y presentar las galerías como registros sin orden clínico atribuido.
- [El collage altera detalles de aparatología] → Revisar visualmente el activo generado contra las cuatro referencias antes de incorporarlo y mantener los originales fuera de la publicación.

## Migration Plan

1. Incorporar activos optimizados y el modelo de profesionales.
2. Migrar JSON de tratamiento y reemplazar contenido clínico ficticio.
3. Añadir redirecciones y actualizar CMS, metadata y referencias internas.
4. Corregir/crear artículos en estado `technical_review`.
5. Validar OpenSpec, tipos, lint y ambos modos de build.
6. Ejecutar verificación visual de heroes, artículos y rutas antiguas en desktop y mobile.
7. Tras aprobación explícita, realizar en otro paso el commit, push, preview de Netlify y posterior integración a `main`.

Rollback: restaurar el JSON `implantes`, retirar las redirecciones y volver a los assets anteriores. Como no se borra historial Git ni se publica en este cambio, el rollback previo al merge es directo.

## Open Questions

- `estetica_dental/caso-03` y `Rehabilitacion/caso-01`/`caso-03` permanecen pendientes de texto y asociación clínica de Paula.
- La fecha pública final de cada artículo se definirá al aprobar el lote; no se anticipa en los borradores.
