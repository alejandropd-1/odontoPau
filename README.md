<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🦷 Paula Gualtieri | Clinical Excellence & Digital Precision
### High-End Dental Clinic Portfolio & Management Platform
</div>

---

## 🚀 Tech Stack & Core Architecture

This project is built with the latest web technologies to ensure performance, SEO, and a premium user experience.

- **Core**: [Next.js 15+](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Styling**: SASS/SCSS modular with design tokens, functions, mixins, and BEM naming convention (Modern Glassmorphism design system)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Smooth transitions and micro-interactions)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Content**: Dynamic JSON-driven architecture (`src/data/`) integrated with Stackbit CMS for visual editing.

---

## 📁 File Structure Reference

```text
odontoPau/
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, Metadata)
│   │   └── tratamientos/   # Dynamic routes for Treatment & Clinical Cases
│   ├── components/         # Reusable UI Components (Hero, Navbar, Footer, etc.)
│   ├── styles/             # Visual architecture (SASS)
│   │   ├── abstracts/      # Tokens, functions, mixins, breakpoints
│   │   ├── base/           # Reset, root (CSS custom props), global styles
│   │   ├── utilities/      # Reusable utility classes (glass-panel, no-scrollbar)
│   │   ├── components/     # BEM component styles
│   │   ├── pages/          # Page-specific styles
│   │   └── main.scss       # Entry point
│   ├── data/               # 💡 MAIN CONTENT SOURCE (Treatments, Cases)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and shared logic
│   └── assets/             # Images and local media (via public folder)
├── public/                 # Static assets (Images, Icons, Favicon)
├── DESIGN.md               # Detailed Design System & Brand Identity
└── package.json            # Dependencies and scripts
```

---

## 🛠️ Content Management (CMS)

The project has been migrated to a fully dynamic data architecture integrated with **Stackbit / Netlify Create** for visual, in-situ editing.

### 1. Stackbit Visual Editing
- The site uses `data-sb-object-id` and `data-sb-field-path` annotations across components.
- Content editors can click directly on text, images, and sections within the Netlify Create visual editor to modify them in real-time.

### 2. Data Sources (JSON)
All content is managed via JSON files located in the `src/data/` directory, which act as the single source of truth:
- `src/data/home.json`: Controls all sections of the landing page (Hero, Services, Team, Testimonials, Location).
- `src/data/settings.json`: Centralizes global configuration like contact info (WhatsApp), social media links, and footer text.
- `src/data/tratamientos/`: Contains individual `.json` files for each treatment (e.g., `implantes.json`), including their specific clinical cases. Each treatment page dynamically renders these cases in a horizontal scrollable carousel section directly below the Hero.

### 3. CMS Configuration
The content models and editing rules are defined in `stackbit.config.ts` located at the root of the project.

---

## 🎨 Visual Architecture

The project uses **SASS/SCSS** as its sole styling architecture, organized in a modular, tokenized system with BEM naming convention.

- **SASS is the single source of truth** for all visual styles. No utility-first frameworks are used.
- **Components use BEM classes** (e.g., `.hero`, `.hero__title`, `.hero__button--primary`).
- **Component styles live in** `src/styles/components/` (one `_component-name.scss` per component).
- **Tokens and functions** are defined in `src/styles/abstracts/` and consumed via `@use "../abstracts" as *;`.

### Available SASS Functions

| Function | Purpose | Example |
|---|---|---|
| `clr($family, $shade)` | Color tokens | `clr("primary", "600")` |
| `size($step)` | Spacing/sizing scale | `size(8)` → 2rem |
| `fs($step)` | Font-size scale (responsive) | `fs("750")` |
| `ff($family)` | Font-family | `ff(sans)` |
| `radius($size)` | Border-radius tokens | `radius("2xl")` |
| `shadow($level)` | Box-shadow tokens | `shadow(xl)` |
| `transition($speed)` | Transition presets | `transition(base)` |
| `container($type)` | Container widths | `container(max)` |
| `spacing($type)` | Semantic spacing | `spacing(section)` |
| `glass($prop)` | Glassmorphism tokens | `glass(bg)` |

### Responsive Design

Use `@include mq($breakpoint)` for responsive styles (mobile-first):

```scss
.hero__title {
  font-size: fs("750");

  @include mq(md) {
    font-size: fs("800");
  }
}
```

Available breakpoints: `sm` (40em), `md` (48em), `lg` (64em), `xl` (80em).

---

## 🤖 AI Agent Guidelines

If you are an AI assistant working on this project:
1. **Design Consistency**: Always refer to `DESIGN.md` before creating new components. Follow the "Vital Precision" (Modern Glassmorphism) aesthetic.
2. **Data Structure**: When adding new treatments or cases, ensure they follow the `Tratamiento` and `CasoClinico` interfaces defined in `src/data/tratamientos.ts`.
3. **Styling Convention**: Use BEM classes for components. Styles go in `src/styles/components/_component-name.scss` with `@use "../abstracts" as *;`. Use SASS tokens/functions (`clr()`, `size()`, `fs()`, etc.) instead of hardcoded values. Use `@include mq(...)` for responsive design. **Do not add utility-first CSS classes; the project does not use any utility-first framework.**
4. **Stackbit Preservation**: Preserve all `data-sb-object-id` and `data-sb-field-path` attributes when modifying components. These are required for the Netlify Create visual editor.
5. **Icons**: Always use `lucide-react` icons.

---

## 🧹 Code Quality & Maintenance

This project uses **Fallow** for static analysis, dead code elimination, and code deduplication. 
- **Orphaned code**: Fallow is used to detect and eliminate unused files, exports, and dependencies to keep the project lightweight.
- **Code Duplication**: Fallow's duplication analysis ensures adherence to DRY principles.
- **Ignored Files**: Files like `stackbit.config.ts` are explicitly ignored by Fallow using inline comments (`// fallow-ignore-file`), as they are required externally by the CMS platform.

---

## 🏁 Getting Started

1. **Prerequisites**: Node.js 20+ and pnpm 11+ installed.
2. **Install Dependencies**:
   ```bash
   pnpm install
   ```
3. **Run Development Server**:
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

---

<div align="center">
Built with ❤️ for Paula Gualtieri.
</div>

---

## 📊 Data Structure Templates (For Excel / CMS Content Management)

These tables define the schema for our dynamic content, ideal for exporting to Excel for clients to fill in, or for mapping to the visual CMS.

### 1. Configuración General y Contacto
*(Basado en `settings.json` / `Hero.tsx` / `Location.tsx`)*

| Propiedad / Campo | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Titulo_Hero_Completo** | Título que se divide por el símbolo "&". | Excelencia Clínica & Calidez Humana |
| **Descripcion_Hero** | Párrafo principal del inicio. | Odontología avanzada en un entorno de transparencia, luz y confort... |
| **Texto_Boton_Primario** | Texto del botón de acción principal. | Conoce a la Dra. Gualtieri |
| **Texto_Boton_Secundario** | Texto del botón de acción secundario. | Ver Especialidades |
| **Badge_Top_Hero** | Texto de marca arriba del título. | Paula Gualtieri Odontología |
| **Direccion_Fisica** | Dirección del consultorio. | Ramón Falcón 2401, Piso 1 Dpto. B, CABA |
| **Horarios** | Días y horarios detallados. | Lunes/Viernes 9-15hs, Martes 9-18hs, Mié/Jue 13-18hs |
| **WhatsApp_Numero** | Número de contacto. | 5491137854198 |
| **WhatsApp_Mensaje** | Mensaje pre-escrito para el cliente. | Hola, quiero sacar un turno |
| **Google_Maps_Iframe** | Link `src` para el mapa visual. | https://www.google.com/maps/embed?pb=... |

### 2. Tratamientos
*(Basado en `src/data/tratamientos/*.json`)*

| Campo (Propiedad) | Descripción | Ejemplo (Json: Implantes) |
| :--- | :--- | :--- |
| **id** | ID único (coincide con el nombre del archivo .json). | implantes |
| **tituloHero** | Nombre del tratamiento. | Implantes Dentales |
| **descripcionHero** | Párrafo descriptivo. | Recupera la funcionalidad total y la estética natural... |
| **icon** | Nombre del icono (Opciones: `Drill`, `Smile`, `Sparkles`). | Drill |
| **heroImage** | Ruta de la imagen principal. | /images/implantes-hero.jpg |
| **features** (Lista) | Beneficios clave (puedes poner varios). | Materiales Bio-compatibles, 98% Tasa de éxito, etc. |

### 3. Casos Clínicos
*(Mapeo de la interface `CasoClinico` en JSON)*

| Campo (Propiedad) | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **id** | Número identificador del caso. | 1 |
| **paciente** | Nombre/Seudónimo del paciente. | Ana |
| **titulo** | Título de la intervención. | Rehabilitación Superior |
| **descripcion** | Resumen del resultado. | Ana recuperó su seguridad al hablar y sonreír... |
| **imagenAntes** | Foto previa al tratamiento. | /images/casos/ana-antes.jpg |
| **imagenDespues** | Foto posterior al tratamiento. | /images/casos/ana-despues.jpg |
| **etiquetasImagenes** | Si hay más fotos, etiquetas (Ej: ANTES, PROGRESO, DESPUES). | ANTES, DESPUÉS |
| **testimonio** | Cita textual del paciente. | "No imaginé que el cambio sería tan radical..." |
| **desafio** | Problema inicial del paciente. | Ana llegó con una pérdida significativa de piezas... |
| **diagnostico** | Diagnóstico médico profesional. | Atrofia alveolar y colapso oclusal. |
| **duracion** | Tiempo total del proceso. | 3 meses de tratamiento. |
| **solucion** | Abordaje técnico realizado. | Implementamos un protocolo de implantes de carga inmediata... |
| **solucionFeatures** | Lista de técnicas usadas. | Cirugía Guiada, Prótesis Cerámica, Ajuste Oclusal. |
| **stats_label** | Nombre de la métrica (Ej: Éxito). | Recuperación Funcional |
| **stats_value** | Resultado de la métrica (Ej: 100%). | 100% |

### 4. Testimonios
*(Basado en `Testimonials.tsx`)*

| Campo (Propiedad) | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **name** | Nombre del paciente. | Martina R. |
| **content** | Texto de la reseña. | "El tratamiento de ortodoncia invisible fue tal como la Dra..." |
| **source** | Origen (Instagram, Facebook, WhatsApp, Google). | Instagram |
| **rating** | Estrellas (1 al 5). | 5 |
| **img** | Foto del paciente (URL). | https://picsum.photos/seed/patient1/100/100 |
