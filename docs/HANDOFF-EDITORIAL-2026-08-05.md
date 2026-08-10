# Handoff editorial y operativo — Paula Gualtieri Odontología

- Fecha de corte: 5 de agosto de 2026
- Repositorio: `odontoPau`
- Checkout de trabajo: `C:\www\odontoPau`
- Rama actual: `codex/openspec-base-editorial`
- Producción: `https://paulagualtieri.com`
- Netlify project: `paulagualtieri`
- Netlify site ID: `b2b9d5a8-e87f-4b22-8452-53e726025db8`
Inventario de Contenidos: [`docs/CONTENIDOS-Y-ARTICULOS.md`](file:///C:/www/odontoPau/docs/CONTENIDOS-Y-ARTICULOS.md)

## 1. Resumen ejecutivo

Se construyó y validó un circuito editorial completo para transformar imágenes y textos breves recibidos de Paula en artículos odontológicos, casos asociados a tratamientos e instrucciones para pacientes.

La implementación está preparada y visible en un draft aislado de Netlify, pero todavía no fue versionada ni publicada:

- no hay commit del lote;
- no hubo push de estos cambios;
- no hubo merge;
- `main` no fue modificada;
- producción sigue excluyendo todos los artículos en revisión;
- faltan las aprobaciones finales de Paula y Alejandro antes de cambiar estados editoriales o iniciar el release.

El punto de reanudación correcto no es “seguir desarrollando la plantilla”. La plantilla y el circuito ya están hechos. La próxima IA debe comenzar verificando el estado local y el preview, recopilar correcciones/aprobaciones y cerrar los cuatro gates pendientes del OpenSpec.

## 2. Preview vigente

Draft verificado:

- Base: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app`
- Deploy ID: `6a7368a1efc601008519c9fd`
- Detalle en Netlify: `https://app.netlify.com/projects/paulagualtieri/deploys/6a7368a1efc601008519c9fd`

Enlaces principales para revisión:

- Tratamientos: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app/tratamientos`
- Artículos: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app/articulos`
- Instrucciones: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app/instrucciones`
- Rehabilitación: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app/tratamientos/rehabilitacion`
- Ortopedia: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app/tratamientos/ortopedia`
- Odontopediatría, caso 02: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app/articulos/aprendizaje-higiene-oral-infancia`
- Ortodoncia, caso 02: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app/articulos/registro-clinico-ortodoncia-invisible`
- Estética Dental, caso 04: `https://6a7368a1efc601008519c9fd--paulagualtieri.netlify.app/articulos/registro-clinico-estetica-dental-caso-04`

Los deploys draft tienen una URL única y pueden expirar según la política de retención de Netlify. Si este enlace deja de funcionar, generar uno nuevo con el procedimiento de la sección 12. No reutilizar un preview antiguo para aprobar cambios nuevos.

## 3. Estado Git: advertencia obligatoria

La rama está deliberadamente sucia. No ejecutar `git reset`, `git checkout --`, limpieza masiva ni staging global.

Antes de tocar cualquier archivo:

```powershell
Set-Location C:\www\odontoPau
git branch --show-current
git status --short
git diff --check
```

La rama esperada es:

```text
codex/openspec-base-editorial
```

Hay archivos de producto, datos, imágenes y OpenSpecs sin incorporar. También hay artefactos locales que no deben entrar en un commit:

- `.playwright-cli/`
- `output/`
- `.codegraph/daemon.pid`
- `.netlify/`
- `.next/`
- `tsconfig.tsbuildinfo`
- logs, capturas y servidores temporales

No usar:

```powershell
git add .
git add -A
```

Cuando exista autorización de release, hacer staging selectivo y revisar cada ruta.

## 4. Qué hizo cada agente o participante

### AutoClaw / Z.ai

- Generó un handoff inicial y propuestas de contenido.
- Ese material se usó únicamente como insumo de relevamiento.
- No se copió directamente porque no respetaba por completo el stack Next.js/JSON/Stackbit, el modelo de artículos, los gates clínicos ni las rutas reales.

### Codex principal

Todo el trabajo técnico, editorial y de QA de esta etapa fue realizado por el agente principal de Codex:

- relevamiento del repositorio y del stack real;
- definición de OpenSpecs;
- arquitectura de artículos e instrucciones;
- implementación de loaders, rutas, componentes y estilos;
- migración de Implantes a Rehabilitación;
- asociación y optimización de imágenes;
- incorporación de profesionales en los heroes;
- redacción, reescritura y ajuste de voz;
- validación TypeScript, lint, builds y OpenSpec;
- revisión visual con Playwright;
- creación y verificación de drafts de Netlify;
- actualización de README, CHANGELOG y este handoff.

No se delegaron cambios de producto a subagentes durante este cierre. Por lo tanto, no existen ramas, parches ni resultados pendientes de “otro agente” que haya que recuperar.

### Skills consultados por Codex

- `openspec-apply-change`: continuidad y registro de tareas.
- `copywriting` y `copy-editing`: voz clara, cálida y sin narración robótica del proceso.
- `accessibility`: textos alternativos, etiquetas opcionales, foco y responsive.
- `seo` / criterios SEO existentes: metadata, canonical, sitemap y OpenGraph.
- `playwright`: verificación real de desktop, mobile y consola.
- skills de diseño/frontend instalados en `.agents`: usados como referencia para conservar el sistema visual existente.

### Paula

- Proporcionó imágenes y textos breves.
- Confirmó autorización para el material pediátrico.
- Aprobó la estructura de los dos primeros artículos de prueba.
- Rechazó una imagen incorrecta que se había asociado al caso de traumatismo de pieza 11; fue reemplazada con el material de `estetica_dental/caso-02`.
- Debe realizar la aprobación clínica y visual final del lote completo.

### Alejandro

- Definió decisiones de producto, navegación, tono, casos de uso y flujo de publicación.
- Debe aprobar el resultado visual, los heroes, Rehabilitación y la navegación antes del release.

### LM Studio / modelos locales

- No ejecutaron trabajos sobre el repositorio.
- No existe todavía un runner productivo ni un perfil de modelo habilitado.
- Sólo se creó el OpenSpec `preparar-runner-editorial-lm-studio-link` para investigar la futura delegación controlada.

## 5. Arquitectura implementada

### Artículos

Fuente de datos:

```text
src/data/articulos/<categoria>/<slug>.json
```

Loader, tipos y validaciones:

```text
src/data/articulos.ts
```

Rutas:

```text
/articulos
/articulos/[slug]
/articulos/pagina/[page]
/articulos/tratamiento/[serviceId]
/articulos/tratamiento/[serviceId]/pagina/[page]
```

Componentes principales:

```text
src/components/ArticleArchive.tsx
src/components/ArticleContent.tsx
src/components/ArticlePagination.tsx
```

Reglas implementadas:

- nueve artículos por página;
- archivo general y archivo por servicio;
- plantilla única con módulos opcionales;
- una imagen sin etiqueta temporal por defecto;
- galerías de varias imágenes sin secuencia si no fue confirmada;
- metadata y OpenGraph con URL del deploy en preview;
- artículos en revisión visibles sólo en desarrollo/preview;
- producción y sitemap sólo incluyen `published`.

### Tratamientos

Fuente:

```text
src/data/tratamientos/<categoria>/<slug>.json
```

Cambios principales:

- `implantes` fue reemplazado por `rehabilitacion` como ID y ruta canónica;
- las URLs anteriores redirigen de forma permanente;
- cada tratamiento puede tener uno o varios `professionals`;
- los retratos y roles se definen en JSON, no mediante condicionales del componente;
- Estética Dental muestra a Roberto Domínguez y Paula Gualtieri;
- Odontopediatría muestra a Paula Gualtieri y María Emilia Omastott;
- Endodoncia muestra a Pablo Alejandro Martínez;
- Rehabilitación muestra a Roberto Domínguez;
- Ortodoncia Invisible y Ortopedia muestran a Paula Gualtieri con el rol confirmado;
- las pills profesionales tienen márgenes, ancho máximo y wrapping responsive;
- `/tratamientos` usa el `heroImage` vigente de cada servicio como portada;
- Ortopedia usa `public/images/ortopedia-hero-collage.webp`.

### Instrucciones

Fuente:

```text
src/data/instrucciones/<categoria>/<slug>.json
```

Rutas:

```text
/instrucciones
/instrucciones/[category]/[slug]
```

Contenidos preparados:

- Dieta Blanca;
- Indicaciones post extracción;
- Cuidados de alineadores.

Las cards de categorías de Dieta Blanca fluyen con alturas independientes para evitar huecos verticales extensos.

### Testimonios

La sección fue retirada de la home, pero su componente no fue borrado para poder recuperarlo en el futuro. No volver a activarla hasta contar con testimonios reales, autorización y fuente verificable.

## 6. Artículos incorporados

Todos los casos nuevos deben inspeccionarse desde sus JSON y su estado actual antes de modificarlos.

```text
src/data/articulos/endodoncia/tratamiento-endodontico-necrosis-pulpar.json
src/data/articulos/estetica/blanqueamiento-dentario-tecnica-ambulatoria.json
src/data/articulos/estetica/resina-mano-alzada-pieza-11.json
src/data/articulos/estetica/registro-clinico-estetica-dental-caso-04.json
src/data/articulos/ortodoncia/evolucion-tratamiento-ortodoncia.json
src/data/articulos/ortodoncia/registro-clinico-ortodoncia-invisible.json
src/data/articulos/pediatria/atencion-odontologica-pediatrica.json
src/data/articulos/pediatria/aprendizaje-higiene-oral-infancia.json
src/data/articulos/rehabilitacion/rehabilitacion-sector-anterosuperior.json
```

Detalles importantes:

- Endodoncia: necrosis pulpar y técnica mecanizada, con radiografías anterior/posterior confirmadas.
- Blanqueamiento: técnica ambulatoria y menor sensibilidad informada.
- Pieza 11: usa solamente las dos imágenes confirmadas de `estetica_dental/caso-02`.
- Ortodoncia caso 01: no se menciona “convencional” en la copia final.
- Ortodoncia caso 02: una imagen, sin etiqueta temporal ni inferencia de modalidad.
- Odontopediatría caso 01: una imagen autorizada y anonimizada, sin `Antes/Después`.
- Odontopediatría caso 02: tres imágenes anonimizadas y una voz cercana orientada al aprendizaje del cuidado bucal.
- Estética caso 04: tres imágenes sin diagnóstico, técnica ni secuencia inventada.
- Rehabilitación: sector anterosuperior, remoción de coronas anteriores, opacificación de pernos metálicos y coronas libres de metal según el texto confirmado.

Pendientes por falta de contexto clínico:

- `estetica_dental/caso-03`;
- `Rehabilitacion/caso-01`;
- `Rehabilitacion/caso-03`.

No crear artículos para esos casos hasta recibir una asociación y un texto suficientes.

## 7. Imágenes y privacidad

Los originales están fuera del repositorio, en una carpeta local sincronizada de Google Drive. La ruta absoluta no se versiona por privacidad y portabilidad; solicitarla a Alejandro si hace falta volver a los originales.

Destinos públicos:

```text
public/images/articulos/<slug>/
public/images/instrucciones/<slug>/
public/images/profesionales/
```

Reglas:

1. Conservar la asociación entre carpeta fuente, slug y activo público.
2. Usar nombres estables, minúsculas y guiones.
3. Convertir fotografías a WebP cuando corresponda.
4. Registrar dimensiones reales en el JSON.
5. No generar ni alterar clínicamente una fotografía.
6. No inferir una secuencia por el número de archivo.
7. No quitar la anonimización pediátrica.
8. No versionar consentimientos, originales sensibles o datos identificatorios.
9. Revisar visualmente cada conversión antes de enlazarla.

## 8. Voz y límites editoriales

Leer antes de escribir:

```text
.agents/product-marketing.md
openspec/changes/integrar-lote-clinico-y-rehabilitacion/design.md
openspec/changes/integrar-lote-clinico-y-rehabilitacion/specs/lote-clinico-confirmado/spec.md
```

La voz esperada es profesional, cálida, cercana y tranquila. Español claro de Argentina.

Evitar:

- “Paula dijo”, “Paula indicó”, “según Paula”;
- “imagen aportada”, “registro incorporado”, “material recibido” en la copia pública;
- explicar que falta información dentro del artículo;
- completar texto para que la página parezca más larga;
- diagnósticos, técnicas, materiales, plazos o resultados no confirmados;
- “sin dolor”, “éxito asegurado”, “resultado definitivo”, porcentajes o testimonios ficticios.

Preferir:

- frases simples y conversacionales;
- explicar el cuidado y la experiencia sin prometer resultados;
- CTA a una evaluación individual;
- módulos breves cuando la evidencia es breve;
- `Equipo clínico` como autor público.

## 9. Estados y gates

Estados editoriales:

```text
draft
clinical_review
technical_review
approved
published
```

Regla central:

```text
preparado != aprobado != publicado
```

Un artículo `published` requiere `publishedAt`. No modificar estados en lote sin revisar cada caso.

OpenSpec principal:

```text
openspec/changes/integrar-lote-clinico-y-rehabilitacion/
```

Estado esperado después de este handoff: 43/47 tareas completas. Las cuatro tareas pendientes son intencionales:

1. aprobación clínica y visual de Paula;
2. aprobación de Alejandro sobre heroes, Rehabilitación y navegación;
3. actualizar estados y fechas sólo después de ambas aprobaciones;
4. commit, push, preview Git e integración a `main` sólo con autorización explícita.

Otros OpenSpecs activos:

- `crear-circuito-editorial-articulos-redes`: implementación histórica y gates de redes/publicación.
- `crear-circuito-instrucciones-pacientes`: falta el gate final de publicación.
- `preparar-runner-editorial-lm-studio-link`: 0/46; investigación futura, bloqueada hasta cerrar y archivar el circuito editorial actual.

## 10. Rutina completa para un nuevo artículo

### Fase A — Intake

1. Recibir imágenes y texto breve.
2. No copiar nada al repositorio todavía.
3. Inventariar carpetas, cantidad de imágenes, dimensiones, nombres y posibles duplicados.
4. Confirmar:
   - tratamiento;
   - número de caso;
   - orden si existe;
   - qué representa cada imagen;
   - consentimiento;
   - si hay un menor;
   - texto clínico literal;
   - profesional asociado;
   - si corresponde `Antes/Después`.
5. Si algo es ambiguo, detenerse y preguntar. No resolver por apariencia visual.

### Fase B — OpenSpec

1. Revisar cambios activos:

   ```powershell
   openspec list --json
   ```

2. Crear un cambio o ampliar uno existente si el alcance encaja.
3. Documentar fuente lógica, riesgos, límites, criterios de éxito y tareas.
4. Mantener fuera de alcance publicación, redes o mejoras no solicitadas.

### Fase C — Activos

1. Copiar sólo los originales confirmados.
2. Normalizar nombres.
3. Optimizar sin alterar el contenido clínico.
4. Guardar bajo `public/images/articulos/<slug>/`.
5. Verificar visualmente cada salida y obtener dimensiones.

### Fase D — Contenido

1. Crear el JSON en la categoría correcta.
2. Usar `technical_review` o el estado solicitado; nunca `published` por defecto.
3. Completar `heroImage`, alt, dimensiones, autor, tags y servicios.
4. Agregar sólo módulos respaldados.
5. Para una sola imagen, omitir label temporal.
6. Para varias imágenes sin secuencia, omitir `Antes/Después` y captions que sugieran evolución.
7. Vincular desde el tratamiento con `articleSlug`.
8. Revisar la copia con los criterios de la sección 8.

### Fase E — QA

Ejecutar la rutina de la sección 11. Si cualquier comando falla, no declarar el trabajo terminado.

### Fase F — Preview y aprobación

1. Generar un draft nuevo de Netlify.
2. Verificar las rutas online.
3. Compartir enlaces directos con Paula y Alejandro.
4. Registrar correcciones sin interpretar el silencio como aprobación.
5. Mantener producción intacta.

### Fase G — Release

Sólo después de aprobación explícita:

1. actualizar estados y `publishedAt` caso por caso;
2. ejecutar build de producción y confirmar que sólo se publica lo aprobado;
3. revisar el diff;
4. hacer staging selectivo;
5. commit y push en la rama autorizada;
6. revisar Deploy Preview generado por Git si corresponde;
7. integrar a `main` únicamente con autorización;
8. verificar el deploy de producción y las URLs finales;
9. archivar/sincronizar OpenSpecs cuando corresponda.

## 11. Rutina de validación ejecutada

### OpenSpec, tipos y lint

```powershell
openspec validate integrar-lote-clinico-y-rehabilitacion --strict
openspec validate --all --strict
pnpm exec tsc --noEmit
pnpm run lint
git diff --check
```

### Build de producción

```powershell
Remove-Item Env:CONTEXT -ErrorAction SilentlyContinue
Remove-Item Env:NETLIFY_PREVIEW_SERVER -ErrorAction SilentlyContinue
pnpm run build
```

Comprobar que los artículos en revisión no aparezcan en las rutas generadas, archivo ni sitemap.

### Build de preview

```powershell
$env:CONTEXT='deploy-preview'
$env:NETLIFY_PREVIEW_SERVER='true'
pnpm run build
```

### Servidor local

```powershell
pnpm exec next start -p 3013
```

No asumir que el puerto está libre. Antes de iniciar, inspeccionar:

```powershell
Get-NetTCPConnection -LocalPort 3013 -State Listen -ErrorAction SilentlyContinue
```

### Playwright

Se usó Playwright CLI, no una suite persistente de tests.

Comando probado en Windows:

```powershell
npx --yes --package @playwright/cli playwright-cli --session odonto-qa open http://localhost:3013/tratamientos
npx --yes --package @playwright/cli playwright-cli --session odonto-qa resize 1440 1100
npx --yes --package @playwright/cli playwright-cli --session odonto-qa snapshot
npx --yes --package @playwright/cli playwright-cli --session odonto-qa screenshot
npx --yes --package @playwright/cli playwright-cli --session odonto-qa console warning
```

Repetir con ancho móvil:

```powershell
npx --yes --package @playwright/cli playwright-cli --session odonto-qa resize 390 844
npx --yes --package @playwright/cli playwright-cli --session odonto-qa snapshot
```

Revisar como mínimo:

- `/tratamientos`;
- cada tratamiento tocado;
- una variante de artículo con una imagen;
- una variante con dos imágenes;
- una variante con tres o más;
- `/instrucciones` y sus páginas;
- consola con cero errores y advertencias;
- `scrollWidth <= clientWidth`;
- foco, botones, breadcrumbs y CTA;
- image alt y etiquetas temporales.

Problema conocido: el wrapper Bash de Playwright instalado en Windows tenía finales CRLF y falló dentro de WSL con `bash\r`. El fallback usado fue el comando `npx` anterior.

### Verificación online

Después de cada draft:

```powershell
$base='URL_DEL_DRAFT'
Invoke-WebRequest -UseBasicParsing "$base/tratamientos"
Invoke-WebRequest -UseBasicParsing "$base/articulos"
Invoke-WebRequest -UseBasicParsing "$base/instrucciones"
```

También se abrió el draft con Playwright en desktop y mobile. Se confirmó que las rutas nuevas devolvían 200 en preview y 404 en producción mientras permanecían en revisión.

## 12. Cómo levantar un draft en Netlify

### Acceso al panel

1. Entrar a `https://app.netlify.com` con la cuenta autorizada.
2. Abrir el proyecto `paulagualtieri`.
3. Entrar a `Deploys`.
4. Buscar por deploy ID o revisar el deploy más reciente.
5. Abrir el detalle y usar su permalink único para compartir.

Ruta directa del proyecto:

```text
https://app.netlify.com/projects/paulagualtieri/deploys
```

No usar `Publish deploy`, `Trigger deploy` de producción ni ninguna acción equivalente durante la revisión editorial. Producción se alimenta de `main` y se trata como un gate separado.

### Preparación inicial del CLI

Si el equipo no está autenticado:

```powershell
npx --yes netlify-cli@23.15.1 login
```

Si el repositorio no está enlazado localmente:

```powershell
npx --yes netlify-cli@23.15.1 link --id b2b9d5a8-e87f-4b22-8452-53e726025db8
```

Esto crea `.netlify/state.json`, que está ignorado por Git y no debe versionarse.

### Por qué se usa WSL

`netlify deploy --build` sobre el checkout de Windows presentó errores `EPERM` al crear enlaces simbólicos de artefactos Next.js. El procedimiento estable fue copiar el árbol a un directorio Linux temporal, instalar dependencias y desplegar desde allí.

Abrir una terminal WSL y ejecutar:

```bash
export PATH="$HOME/.local/opt/node-v22.19.0-linux-x64/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

SOURCE=/mnt/c/www/odontoPau
PREVIEW_DIR=$(mktemp -d -p "$HOME" odonto-pau-preview.XXXXXX)

rsync -a \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.netlify' \
  --exclude='output' \
  --exclude='.playwright-cli' \
  --exclude='.codegraph' \
  "$SOURCE/" "$PREVIEW_DIR/"

mkdir -p "$PREVIEW_DIR/.netlify"
cp "$SOURCE/.netlify/state.json" "$PREVIEW_DIR/.netlify/state.json"

cd "$PREVIEW_DIR"
CI=true pnpm install --frozen-lockfile

export CONTEXT='deploy-preview'
export NETLIFY_PREVIEW_SERVER='true'

npm exec --yes --package=netlify-cli@23.15.1 -- \
  netlify deploy \
  --build \
  --context deploy-preview \
  --message 'Descripcion breve del draft' \
  --json \
  --timeout 900
```

Condiciones de seguridad:

- no agregar `--prod`;
- no copiar `.git` ni credenciales al directorio temporal;
- no incluir `output`, capturas o `.codegraph`;
- revisar que el resultado JSON tenga el site ID correcto;
- verificar las URLs online antes de compartir;
- no considerar el éxito del build como aprobación clínica.

### Problemas conocidos del deploy

1. `EPERM` o symlink en Windows: usar WSL.
2. `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`: ejecutar la instalación con `CI=true`.
3. PATH mixto Windows/WSL: fijar un PATH Linux explícito como en el script.
4. CLI colgado al consultar estado: no asumir que falló el deploy; revisar el permalink y la pestaña Deploys.
5. Un draft antiguo no contiene cambios nuevos: generar otro deploy y compartir el nuevo ID.

## 13. OpenSpec de LM Studio Link

Ruta:

```text
openspec/changes/preparar-runner-editorial-lm-studio-link/
```

Estado: 0/46 tareas.

No comenzar a implementarlo todavía. Su primera precondición exige que el circuito editorial actual esté publicado, aceptado, documentado y archivado.

Decisiones ya tomadas:

- Codex CLI correrá inicialmente en Ale-Book;
- LM Studio Link aportará inferencia desde la PC de escritorio;
- contexto efectivo mínimo: 32.768 tokens;
- filesystem limitado a un worktree;
- perfiles separados para escritura, visión, código y QA;
- jobs en ramas `local-worker/<job-id>` y worktrees aislados;
- validaciones deterministas fuera del modelo;
- ningún modelo local tendrá permisos para push, merge, `main`, Netlify, CMS o redes;
- primero se debe reproducir un caso aprobado como golden.

No asumir que los MCP visibles en el chat de LM Studio están disponibles automáticamente desde Codex CLI o la API. Deben probarse por cliente.

## 14. Desde dónde debe retomar la próxima IA

Orden obligatorio:

1. Abrir `C:\www\odontoPau`.
2. Leer `README.md`, este handoff, `.agents/product-marketing.md` y los cuatro artefactos del OpenSpec `integrar-lote-clinico-y-rehabilitacion`.
3. Ejecutar:

   ```powershell
   git branch --show-current
   git status --short
   openspec list --json
   openspec instructions apply --change integrar-lote-clinico-y-rehabilitacion --json
   ```

4. Confirmar que la rama siga siendo `codex/openspec-base-editorial` y que no exista un commit o merge realizado por otra sesión.
5. Abrir el preview vigente. Si expiró o el árbol cambió, generar uno nuevo.
6. Pedir o registrar el feedback actual de Paula y Alejandro.
7. Corregir únicamente lo observado, sin ampliar el alcance.
8. Repetir QA completo y generar un draft nuevo.
9. No marcar 6.1 ni 6.2 como completas sin aprobación explícita.
10. No cambiar estados a `published` ni ejecutar Git/release hasta recibir autorización expresa.

Si Paula y Alejandro aprueban todo, la próxima IA debe retomar exactamente en la sección 6 del archivo:

```text
openspec/changes/integrar-lote-clinico-y-rehabilitacion/tasks.md
```

y completar, en orden, las tareas 6.1, 6.2, 6.3 y 6.4 con evidencia.

## 15. Prompt listo para la próxima IA

```text
Trabajá en C:\www\odontoPau.

Antes de editar, leé completamente:
- README.md
- docs/HANDOFF-EDITORIAL-2026-08-05.md
- .agents/product-marketing.md
- openspec/changes/integrar-lote-clinico-y-rehabilitacion/proposal.md
- openspec/changes/integrar-lote-clinico-y-rehabilitacion/design.md
- todos los specs y tasks de ese cambio.

Después ejecutá git branch --show-current, git status --short, openspec list --json y openspec instructions apply --change integrar-lote-clinico-y-rehabilitacion --json.

El checkout está deliberadamente sucio y no existe todavía un commit del lote. No limpies, resetees ni sobrescribas cambios. No uses git add ., no hagas commit, push, merge, deploy de producción ni cambies main sin autorización explícita.

El circuito editorial y las plantillas ya están implementados. Retomá desde la revisión del draft de Netlify y los cuatro gates pendientes de la sección 6 del OpenSpec. Confirmá el feedback de Paula y Alejandro; no interpretes silencio como aprobación.

Mantené cualquier artículo nuevo fuera de producción, no inventes datos clínicos, no atribuyas la copia pública a Paula y no uses etiquetas Antes/Después si la secuencia no fue confirmada. Repetí OpenSpec, TypeScript, lint, build de producción, build de preview y Playwright desktop/mobile después de cada corrección relevante.

Si el preview vigente expiró o el árbol cambió, generá un draft nuevo con el procedimiento WSL documentado en el handoff, sin --prod, y verificá online todas las rutas tocadas.

Al terminar, informá archivos modificados, comandos y exit codes, URLs verificadas, gates pendientes y el punto exacto de reanudación. No avances al OpenSpec de LM Studio Link hasta que el circuito editorial esté publicado, aceptado y archivado.
```

## 16. Criterio de cierre de este handoff

Este handoff se considera correcto si la próxima IA puede:

- ubicar el código y los contenidos;
- distinguir preview de producción;
- entender qué está aprobado y qué no;
- reproducir la validación;
- crear un draft sin tocar `main`;
- continuar desde los gates correctos;
- evitar staging de artefactos locales;
- no atribuir trabajo inexistente a subagentes o modelos locales;
- postergar LM Studio hasta que se cumplan sus precondiciones.

## 17. Referencias operativas de Netlify

- Crear deploys: `https://docs.netlify.com/deploy/create-deploys/`
- Netlify CLI y draft deploys: `https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/`
- Buscar y administrar deploys desde el panel: `https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/`
- Deploy Previews y colaboración: `https://docs.netlify.com/deploy/deploy-types/deploy-previews/`

Estas referencias explican la plataforma. Para este repositorio se debe seguir además el procedimiento WSL documentado arriba, porque responde a un problema específico del checkout en Windows.
