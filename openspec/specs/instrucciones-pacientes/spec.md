# instrucciones-pacientes Specification

## Purpose
TBD - created by archiving change crear-circuito-instrucciones-pacientes. Update Purpose after archive.
## Requirements
### Requirement: Plantilla modular única
El sistema SHALL representar todas las instrucciones con una única plantilla que renderice exclusivamente los módulos con contenido y admita bloques de pasos, matriz, aviso y texto.

#### Scenario: Instrucción basada en pasos
- **WHEN** una instrucción contiene un módulo `steps`
- **THEN** el sistema muestra una lista ordenada semántica sin reservar espacio para matrices ausentes

#### Scenario: Instrucción basada en matriz
- **WHEN** una instrucción contiene grupos con estados `Sí`, `Precaución` y `No`
- **THEN** el sistema muestra cada estado presente con texto visible además de su color y omite los estados vacíos

#### Scenario: Grupos de matriz con alturas diferentes
- **WHEN** dos o mas grupos contienen cantidades distintas de recomendaciones
- **THEN** las tarjetas se compactan verticalmente sin igualar sus alturas, sin huecos de fila y sin alterar la representacion semantica del documento

### Requirement: Flujo editorial seguro
El sistema SHALL admitir los estados `draft`, `clinical_review`, `technical_review`, `approved` y `published`, y SHALL exponer públicamente en producción únicamente instrucciones `published` con revisor clínico y fecha de publicación.

#### Scenario: Borrador en Deploy Preview
- **WHEN** el build corresponde a desarrollo, branch deploy o Deploy Preview
- **THEN** la ruta del borrador existe para revisión y su metadata usa `noindex, nofollow`

#### Scenario: Borrador en producción
- **WHEN** el build corresponde a producción y una instrucción no está `published`
- **THEN** la instrucción no genera ruta, no aparece en listados y no entra al sitemap

#### Scenario: Publicación incompleta
- **WHEN** una instrucción tiene estado `published` pero no tiene revisor clínico o fecha de publicación
- **THEN** la validación falla antes del despliegue

### Requirement: Validación del contenido
El sistema MUST validar identificadores, slugs, estados, tratamientos relacionados, módulos e imágenes antes de generar las páginas.

#### Scenario: Recurso inexistente
- **WHEN** un JSON referencia una imagen que no existe bajo `/public/images`
- **THEN** el build falla con un mensaje que identifica el documento y el campo inválido

#### Scenario: Módulo vacío
- **WHEN** una instrucción no tiene módulos o un módulo requerido carece de contenido
- **THEN** el build falla y la instrucción no puede desplegarse

### Requirement: Recurso gráfico accesible
El sistema SHALL tratar la infografía como un recurso complementario y SHALL mantener toda indicación esencial como HTML semántico.

#### Scenario: Infografía disponible
- **WHEN** la instrucción tiene `resourceImage`
- **THEN** la página ofrece una vista legible y una acción de descarga con nombre accesible, dimensiones conocidas y texto alternativo descriptivo

#### Scenario: Infografía ausente
- **WHEN** la instrucción no tiene `resourceImage`
- **THEN** el cuerpo textual conserva toda la funcionalidad sin mostrar un contenedor vacío

### Requirement: Compartir sin acciones redundantes
El sistema SHALL conservar un único control general `Compartir` debajo del título y MUST NOT agregar un botón independiente exclusivo para WhatsApp.

#### Scenario: Compartir un preview
- **WHEN** se abre una instrucción no publicada en un Deploy Preview
- **THEN** el control general comparte la URL pública del deploy y no la ruta inexistente de producción

### Requirement: Metadata e indexación
El sistema SHALL generar título, descripción, canonical, Open Graph y Twitter Card para cada instrucción, y SHALL incluir datos estructurados públicos solo para documentos publicados.

#### Scenario: Imagen social en preview
- **WHEN** una instrucción define una imagen social durante un Deploy Preview
- **THEN** Open Graph usa una URL absoluta descargable desde ese deploy

#### Scenario: Sitemap de producción
- **WHEN** se genera el sitemap
- **THEN** solo incluye instrucciones con estado `published`

### Requirement: Trazabilidad clínica visible
El sistema SHALL mostrar la fecha de actualización, el responsable de revisión clínica y un aviso de que las indicaciones personalizadas del profesional prevalecen sobre la guía general.

#### Scenario: Lectura de una instrucción
- **WHEN** un paciente abre una instrucción
- **THEN** puede identificar cuándo fue revisada, por quién y cómo proceder si recibió una indicación diferente

### Requirement: Accesibilidad responsive
La plantilla MUST cumplir una base WCAG 2.2 AA: jerarquía de encabezados, listas nativas, foco visible, objetivos táctiles suficientes, contraste mínimo y contenido utilizable con zoom y movimiento reducido.

#### Scenario: Navegación con teclado
- **WHEN** una persona recorre la instrucción usando Tab, Enter y Space
- **THEN** puede activar compartir, abrir el recurso y volver al índice con foco visible y sin trampas

#### Scenario: Lectura sin color
- **WHEN** una persona no distingue los colores de estado
- **THEN** puede diferenciar `Sí`, `Precaución` y `No` mediante texto e iconografía accesible

### Requirement: Edición en CMS existente
El sistema SHALL exponer los campos y módulos de instrucciones en Stackbit/Netlify Visual Editor sin agregar otro CMS ni cambiar la fuente JSON versionada.

#### Scenario: Campo opcional vacío
- **WHEN** el editor deja vacío un módulo opcional
- **THEN** el sitio no muestra placeholders ni huecos de maquetación

### Requirement: Casos iniciales aprobados
El sistema SHALL incorporar `Dieta blanca` y `Indicaciones post extracción` como casos de referencia utilizando el contenido aprobado por Paula y sin agregar indicaciones clínicas inferidas.

#### Scenario: Comparación con el material fuente
- **WHEN** se revisa cualquiera de las dos instrucciones iniciales
- **THEN** los alimentos, tiempos, pasos y criterios de consulta coinciden con la pieza entregada o con una corrección explícita de Paula

