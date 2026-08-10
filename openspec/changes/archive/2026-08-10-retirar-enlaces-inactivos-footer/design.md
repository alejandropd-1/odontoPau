## Context

El componente compartido `Footer` renderiza tres enlaces con `href="#"`. Ninguno tiene hoy una pagina o perfil publico definido, por lo que activarlos no produce una navegacion util. El footer se distribuye en tres columnas visuales en desktop y en una columna en mobile.

## Goals / Non-Goals

**Goals:**

- Eliminar controles de navegacion sin destino real.
- Mantener marca y copyright centrados y legibles en mobile y equilibrados en desktop.
- Retirar estilos BEM que queden sin consumidores.

**Non-Goals:**

- Crear URLs, perfiles sociales o contenido legal.
- Introducir configuracion CMS para el footer.
- Modificar otras referencias a redes sociales dentro del dashboard editorial o testimonios.

## Decisions

- Se elimina el bloque `footer__links` completo en lugar de ocultarlo con CSS. Asi el DOM y el arbol de accesibilidad representan honestamente el contenido disponible.
- El contenedor conserva `flex`; en desktop distribuye marca y copyright entre ambos extremos. Se descarto conservar una tercera columna vacia porque produciria un equilibrio artificial y espacio sin funcion.
- Se eliminan los selectores `footer__links` y `footer__link` porque ya no tendran consumidores. Si en el futuro existen destinos reales, su regreso debe incluir URLs validas y estados accesibles.

## Risks / Trade-offs

- [El footer queda visualmente mas simple] → Mantener espaciado, tipografia y ancho maximo del sistema actual.
- [Se agregan redes en el futuro] → Reintroducir enlaces solo junto con sus destinos reales y una nueva validacion responsive.
- [El copyright puede ocupar mas ancho en pantallas intermedias] → Conservar el apilado mobile y permitir una distribucion flexible desde `md`.

## Migration Plan

1. Retirar los enlaces y sus estilos sin uso.
2. Validar mobile y desktop en Deploy Preview.
3. Revertir ambos archivos si el layout pierde legibilidad.

## Open Questions

- Ninguna para este alcance; las URLs futuras se resolveran en un cambio independiente.
