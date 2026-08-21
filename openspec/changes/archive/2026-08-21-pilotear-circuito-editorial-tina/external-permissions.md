# Permisos externos y fallback

La automatización usa únicamente el `GITHUB_TOKEN` efímero del workflow. Tina no recibe tokens de GitHub o Netlify y ningún secreto se persiste en el singleton editorial.

## Configuración necesaria antes del piloto real

Un administrador del repositorio debe confirmar:

1. que GitHub Actions tiene permiso de lectura y escritura sobre contenidos;
2. que GitHub Actions puede crear y aprobar Pull Requests;
3. que las reglas de `main` aceptan el PR técnico sólo después de `quality-gates` verde;
4. que el workflow puede mezclar ese PR sin omitir protecciones;
5. que `editorial/tina` continúa siendo una rama indexada por Tina;
6. que `NEXT_PUBLIC_EDITORIAL_PREVIEW_URL` apunta al branch deploy editorial de Netlify.

No hace falta agregar `TINA_TOKEN`, `NETLIFY_AUTH_TOKEN`, un token personal de GitHub ni credenciales a la interfaz editorial.

## Fallback seguro

Si GitHub impide crear o mezclar el PR automático:

1. el workflow registra el request como fallido cuando puede hacerlo;
2. `main` y producción permanecen sin cambios;
3. el contenido sigue guardado en `editorial/tina` y visible en Preview;
4. un administrador abre o completa manualmente el PR `editorial/tina -> main`;
5. después de CI verde, integra el PR y sincroniza `editorial/tina` por avance directo, sin force-push.

El fallback no autoriza a saltear CI, incorporar archivos estructurales ni publicar contenido sin las aprobaciones humanas aplicables.
