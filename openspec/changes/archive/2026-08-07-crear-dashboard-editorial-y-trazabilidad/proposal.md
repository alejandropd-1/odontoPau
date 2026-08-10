# Propuesta: Dashboard Editorial Dinámico y Trazabilidad de Contenidos

## Contexto y Problema
A medida que aumenta el volumen de artículos clínicos, guías de instrucciones e imágenes de casos recibidas desde Google Drive, se requiere una herramienta web interna que consolide y contabilice de forma dinámica todo el stock de contenidos sin depender exclusivamente de auditorías manuales en archivos Markdown.

## Solución Propuesta
Crear la vista interna de Dashboard Editorial en la ruta `/editorial` de Next.js, conectada en tiempo real a los cargadores de datos del sistema (`articulos.ts` e `instrucciones.ts`).

### Capacidades Clave
1. **KPIs en Vivo**: Métricas agregadas por estado editorial (`published`, `technical_review`, `draft`), tipo de pieza y especialidad.
2. **Inventario Filtrable**: Tabla interactiva con búsqueda por palabras clave, etiquetas y especialidades.
3. **Trazabilidad Google Drive**: Mapeo transparente entre la ruta física del código (`JSON`) y la carpeta origen en Google Drive (`caso-01`, `caso-02`, `caso-03`, `caso-04`, `keep`, etc.).
4. **Módulo de Redes Sociales & Difusión**: Pestaña preparada con copys adaptados para Instagram, LinkedIn y WhatsApp con botón de copiado al portapapeles.
