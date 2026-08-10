# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-08-05

### Added
- **Editorial Articles**: Added the JSON-driven `/articulos` archive, dynamic article routes, service-specific archives and pagination with nine articles per page.
- **Adaptive Article Template**: Added one modular article experience that renders only the sections supplied by each case and supports one, two, three or more images without empty modules.
- **Clinical Article Batch**: Added review versions for Endodontics, whitening, piece 11 resin reconstruction, orthodontics, pediatric dentistry, anterior rehabilitation and the second visual-only batch.
- **Patient Instructions**: Added complete Dieta Blanca and post-extraction instruction pages with structured mobile-friendly content and downloadable/source artwork.
- **Professional Heroes**: Added editable professional data and optimized portraits for Paula Gualtieri, Roberto Domínguez, Pablo Alejandro Martínez and María Emilia Omastott.
- **Ortopedia Hero**: Added an optimized collage created from confirmed appliance photographs.
- **OpenSpec History**: Added changes for the editorial circuit, patient instructions, the confirmed clinical batch and future LM Studio Link runner research.
- **Operational Handoff**: Added `docs/HANDOFF-EDITORIAL-2026-08-05.md` with the full continuation routine, Netlify draft procedure and remaining approval gates.

### Changed
- **Rehabilitación Canonical Service**: Renamed the Implantes Dentales service, folder, ID, metadata and canonical route to Rehabilitación.
- **Historical URLs**: Added permanent redirects from the former `/tratamientos/implantes` routes to their Rehabilitación equivalents.
- **Treatment Heroes**: Replaced hardcoded professional badges with JSON-driven one-or-many professional cards and stabilized their responsive layout.
- **Estética Dental Team**: Added Paula Gualtieri alongside Roberto Domínguez in the service hero.
- **Treatment Covers**: Made `/tratamientos` reuse each service's current `heroImage`, including the new Rehabilitación and Ortopedia assets.
- **Case Navigation**: Linked treatment cases to their canonical articles when the article is available in the current environment.
- **Editorial Voice**: Rewrote public copy with a warmer institutional tone, removed internal attributions such as “Paula dijo” and avoided mechanical descriptions of supplied images.
- **Article Body Layout**: Consolidated content into a continuous modular body and retained optional richer case-summary modules only when supported by confirmed information.
- **Article Footer**: Reorganized sources, topics and related treatments into a clearer closing area.
- **Social Metadata**: Updated preview URLs and image resolution so article links can expose an OpenGraph image in supported clients.
- **Treatments and Instructions Copy**: Reworked headings and descriptions to use clear Argentine Spanish and a more approachable tone.

### Fixed
- **Piece 11 Asset Association**: Replaced the incorrect image with the confirmed files from `estetica_dental/caso-02`.
- **Pediatric Case Contamination**: Removed inherited implant content and replaced it with authorized pediatric material.
- **Minor Privacy**: Used only the authorized anonymized pediatric images and kept identity protection visible.
- **Optional Image Labels**: Prevented `Antes`/`Después` labels from appearing when a single image or an unconfirmed sequence is supplied.
- **Hero Overflow**: Fixed professional pills shrinking, touching image edges or overflowing with long roles.
- **Instruction Masonry**: Removed equal-height gaps from instruction cards so short and long categories flow naturally.
- **Unsupported Claims**: Removed fictitious testimonials, hardcoded success percentages, unsupported durations and universal outcome promises from the migrated services.

### Safety and publication gates
- All new clinical articles remain in review states and are excluded from production routes, archives and sitemap until explicitly approved.
- The public author is `Equipo clínico`; named clinical reviewers remain internal metadata.
- Production continues to deploy from `main`; no commit, push, merge or production deploy has been performed for this batch.
- The LM Studio Link runner is documented as a future research change only and has not been implemented or granted release permissions.

### Validation
- Passed strict OpenSpec validation, TypeScript, ESLint and Next.js builds in production and deploy-preview contexts.
- Verified desktop and mobile layouts with Playwright, including hero cards, article variants, instructions, console output and horizontal overflow.
- Deployed and verified the isolated Netlify draft `6a7368a1efc601008519c9fd`; the corresponding new article routes continued to return 404 on production.

## [Unreleased] - 2026-06-19

### Added
- **Patient Instructions**: Added the `/instrucciones` index and shareable instruction detail pages at `/instrucciones/[category]/[slug]`.
- **Initial Instruction Content**: Added categorized patient instructions for whitening aftercare/dieta blanca and aligner care.
- **Share Menu**: Added an inline article share control with Web Share API support plus WhatsApp, email, and copy-link fallbacks.
- **Treatments Index**: Added a dedicated `/tratamientos` page so all services can be browsed outside the home page.
- **Instruction Cards**: Added reusable instruction cards for the instructions index and treatment/service sections.
- **SEO Metadata**: Added canonical, OpenGraph, and Twitter metadata for instruction pages, including image support for shared links.

### Changed
- **Navigation**: Added `Instrucciones` to the header and routed `Servicios` to the new treatments index.
- **Categorized Content Model**: Reorganized treatment JSON files into `src/data/tratamientos/<categoria>/` and added `category`, `categoryLabel`, and `order` metadata.
- **Recursive Loaders**: Updated treatment and instruction data loading to discover JSON files recursively from category folders.
- **Client/Server Data Flow**: Refactored client components to receive treatment data through page props instead of importing server-side filesystem loaders.
- **CMS Configuration**: Updated Stackbit models to support nested `tratamientos/**/*.json` and `instrucciones/**/*.json` documents.
- **Sitemap & Static Params**: Updated route generation so treatment, case, and instruction URLs are derived from the JSON content.

### Preserved
- **Stackbit Editing Hooks**: Kept visual editing object/field annotations compatible with the Git CMS flow while adding nested content support.

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
