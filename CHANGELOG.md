# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-06-01

### Added
- **SASS Architecture**: Created modular SASS architecture in `src/styles/` with abstracts (tokens, functions, mixins, breakpoints), base (reset, root, global), utilities (glass-panel, no-scrollbar), components (BEM), pages, and `main.scss` entry point.
- **Design Token System**: Implemented tokenized design system with SASS functions: `clr()`, `size()`, `fs()`, `ff()`, `radius()`, `shadow()`, `transition()`, `container()`, `spacing()`, `glass()`.
- **Responsive Mixin**: Added `@include mq($breakpoint)` mixin with mobile-first breakpoints (sm: 40em, md: 48em, lg: 64em, xl: 80em).
- **Page Styles**: Created `src/styles/pages/_home.scss` for home page layout.

### Changed
- **Full Styling Migration**: Migrated all 10 components from Tailwind CSS utility classes to BEM naming convention with SASS stylesheets: Footer, Breadcrumb, Navbar, Services, Team, Location, Testimonials, Hero, TreatmentDetailContent, CaseDetailContent.
- **Base Styles**: Moved `body` font-family and `html` scroll-behavior from Tailwind to SASS base styles (`src/styles/base/_general.scss`, `_global.scss`).
- **PostCSS Configuration**: Removed `@tailwindcss/postcss` plugin from `postcss.config.mjs`, keeping only `autoprefixer`.
- **Layout Import**: Replaced `import './globals.css'` with `import '@/styles/main.scss'` in `src/app/layout.tsx`.

### Removed
- **Tailwind CSS**: Completely removed Tailwind CSS and all related dependencies (`tailwindcss`, `@tailwindcss/postcss`, `tailwind-merge`, `clsx`, `tw-animate-css`).
- **globals.css**: Deleted `src/app/globals.css` — all content (theme tokens, glass-panel utility, no-scrollbar utility, scroll-behavior) was migrated to SASS equivalents.
- **Dead Dependencies**: Removed `tailwind-merge` and `clsx` (never used in any component).

### Preserved
- **Stackbit/Netlify Create**: All `data-sb-object-id` and `data-sb-field-path` attributes remain intact across Hero, TreatmentDetailContent, and page.tsx.
- **Visual Output**: No visual changes — the migration preserves the existing design pixel-for-pixel.
- **Motion/Animations**: All Framer Motion animations preserved without modification.
- **Content/Routes**: No changes to content, routes, CMS integration, or component behavior.

## [Unreleased] - 2026-05-20

### Removed
- **Dead Code Cleanup**: Removed unused files (`src/hooks/use-mobile.ts`, `src/lib/utils.ts`) detected via Fallow static analysis.
- **Orphaned Dependencies**: Cleaned up `package.json` by uninstalling unused production dependencies (`@google/genai`, `@hookform/resolvers`, `class-variance-authority`) and dev dependencies (`@tailwindcss/typography`, `firebase-tools`).

### Changed
- **DRY Refactoring**: Extracted duplicated logic for fetching treatments and cases in `src/app/tratamientos/[id]/casos/[casoId]/page.tsx` into a shared `getTratamientoYCaso` function, based on Fallow duplication reports.
- **Fallow Configuration**: Added inline `// fallow-ignore-file unused-file` to `stackbit.config.ts` to prevent false positive detection while maintaining CMS integration.

### Fixed
- **Treatment Page Layout Regression**: Restored the accidentally deleted "Clinical Cases" section below the Hero in the treatment detail view (`src/components/TreatmentDetailContent.tsx`) which was introduced during Stackbit visual editing integrations.

### Documentation
- **Data Templates**: Added comprehensive markdown tables to the README detailing the structure of JSON data models (Configuración General, Tratamientos, Casos Clínicos, Testimonios) for Excel-based content management and CMS alignment.
- **Clinical Cases Flow**: Documented in `README.md` the dynamic linkage and rendering of clinical cases on individual treatment pages.

## [Unreleased] - 2026-05-05

### Added
- **Stackbit CMS Integration**: Initialized `@stackbit/types` and `@stackbit/cms-git` to support the Netlify Create visual editor.
- **Global Settings JSON**: Created `src/data/settings.json` to manage global variables like WhatsApp numbers, social media links, and footer text dynamically.
- **Home Page JSON**: Created `src/data/home.json` to structure content for the Hero, Services, Team, Testimonials, and Location sections.
- **Stackbit Configuration**: Implemented `stackbit.config.ts` mapping `HomePage`, `Tratamiento`, `CasoClinico`, and `GlobalSettings` models to their respective UI components and data sources.

### Changed
- **Content Architecture Migration**: Migrated hardcoded static content from `src/data/tratamientos.ts` and individual page components into structured JSON files located in `src/data/` and `src/data/tratamientos/`.
- **Component Annotations**: Added `data-sb-object-id` and `data-sb-field-path` HTML attributes across all major components (`Navbar`, `Footer`, `Hero`, `Services`, `Team`, `Testimonials`, `Location`, `TreatmentDetailContent`, `CaseDetailContent`) to enable direct visual editing via Stackbit.
- **Dynamic Routing & Data Loading**: Refactored Next.js pages and data loading utilities to fetch content from the newly created JSON files instead of static TypeScript objects.

### Fixed
- **Visual Editing**: Ensured all text nodes, images, and nested array items (like clinical cases and testimonials) have exhaustive Stackbit field paths for seamless in-situ modifications.
