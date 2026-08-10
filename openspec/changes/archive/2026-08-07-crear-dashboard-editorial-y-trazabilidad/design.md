# Diseño Técnico: Dashboard Editorial Dinámico (/editorial)

## Arquitectura de Componentes

```
src/app/editorial/page.tsx (Server Component)
  ├── getRoutableArticles() -> src/data/articulos.ts
  ├── getRoutableInstructions() -> src/data/instrucciones.ts
  └── EditorialDashboard.tsx (Client Component)
       ├── StatCards (KPIs)
       ├── TabNav (Inventario | Drive | Redes Sociales)
       ├── FilterBar (Buscador, Filtro Estado, Filtro Especialidad)
       ├── InventoryGrid
       ├── DriveTable
       └── SocialMediaGrid
```

## Estilos y Accesibilidad
- Hoja de estilos SCSS modular: `src/styles/pages/_editorial-dashboard.scss`.
- Integrado con la paleta de tokens globales, Manrope font, glassmorphism y navegación responsive.
- Soporte para preferencias de movimiento reducido (`prefers-reduced-motion`).
