## Why

El footer publica enlaces a Instagram, Facebook y Aviso Legal con destinos vacios (`#`). Esto crea una expectativa de navegacion que no se cumple y perjudica la claridad y la accesibilidad del sitio.

## What Changes

- Retirar del footer los tres enlaces inactivos mientras no existan destinos reales y aprobados.
- Reequilibrar el layout del footer para conservar una composicion correcta en mobile y desktop sin dejar un espacio vacio.
- Mantener la marca y el texto de copyright existentes.

Fuera de alcance: crear perfiles sociales, redactar una pagina legal o definir sus futuras URLs. No hay contenido clinico ni imagenes de pacientes involucrados, por lo que el riesgo clinico es nulo.

El cambio se considera exitoso cuando el footer no ofrece controles sin destino, conserva su jerarquia visual y no genera desborde horizontal en los breakpoints soportados.

## Capabilities

### New Capabilities

- `navegacion-footer`: Define que el footer solo muestre enlaces con destinos reales y que mantenga una composicion responsive cuando no haya enlaces disponibles.

### Modified Capabilities

- Ninguna.

## Impact

- `src/components/Footer.tsx`: eliminacion del bloque de enlaces inactivos.
- `src/styles/components/_footer.scss`: ajuste del layout y retiro de estilos sin uso.
- Sin cambios de APIs, dependencias, CMS, SEO ni contenido clinico.
