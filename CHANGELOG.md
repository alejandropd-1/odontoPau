# Changelog

All notable changes to this project will be documented in this file.

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
