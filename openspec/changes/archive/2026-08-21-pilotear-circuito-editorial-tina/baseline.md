# Línea base del piloto

Registrada el 2026-08-21 antes de implementar el circuito autónomo.

## Git

| Referencia | Commit |
|---|---|
| Rama de trabajo | `change/pilotear-circuito-editorial-tina` |
| `HEAD` | `cf2a100c0c71f62ca6a7b1e4b7f06ee78c99e7bb` |
| `main` | `cf2a100c0c71f62ca6a7b1e4b7f06ee78c99e7bb` |
| `origin/main` | `cf2a100c0c71f62ca6a7b1e4b7f06ee78c99e7bb` |
| `origin/editorial/tina` | `cf2a100c0c71f62ca6a7b1e4b7f06ee78c99e7bb` |

`main` y `editorial/tina` son ancestros mutuos en esta línea base: no existe divergencia inicial.

## Estado heredado

- El OpenSpec `adoptar-tina-y-completar-cms-articulos-instrucciones` está publicado y archivado.
- Su integración final es el merge commit `cf2a100` (PR #12).
- Tina remoto escribe en `editorial/tina`; `main` continúa siendo producción.
- Artículos, Instrucciones, Inicio, Tratamientos y casos ya son editables mediante Tina.
- El árbol sólo contenía la actualización prevista del roadmap y este OpenSpec nuevo; no había cambios de producto ajenos.

## Problema todavía abierto

Guardar en Tina produce un snapshot revisable, pero todavía no existe una acción no técnica, idempotente y protegida que lo publique o retire desde el mismo panel. Ese es el único alcance de este piloto.

## Ciclo de referencia: PR #12

El cierre anterior requirió un PR técnico para integrar el contenido guardado en `editorial/tina` a `main`. La publicación terminó correctamente, pero dejó dos enseñanzas que este piloto convierte en reglas automáticas:

- una imagen reemplazada desde Tina pertenece al snapshot editorial completo y debe promoverse junto con el JSON que la referencia;
- después del merge, `editorial/tina` debe avanzar hasta el `main` publicado para que TinaCloud indexe el mismo schema y contenido que producción.

Cuando esa convergencia no se hizo inmediatamente, el editor remoto mostró temporalmente una versión de schema o contenido desactualizada. No fue pérdida de información: fue una diferencia entre las referencias de Git/Tina. Por eso el nuevo circuito bloquea ramas divergentes y sincroniza staging después de cada integración.
