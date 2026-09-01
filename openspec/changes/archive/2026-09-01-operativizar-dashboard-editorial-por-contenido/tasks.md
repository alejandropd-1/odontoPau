## 1. Contrato del estado público por contenido

- [x] 1.1 Definir el índice mínimo de producción en el documento operativo, con tipos, validación retrocompatible y campos ocultos en Tina.
- [x] 1.2 Implementar una huella determinista y compartida de la revisión editorial, basada en identidad, estado y `updatedAt`, con pruebas focalizadas.
- [x] 1.3 Extender el workflow para registrar el índice sólo después de confirmar la revisión exacta en producción y verificar por prueba que un fallo no sobrescribe el último índice sano.

## 2. Perfil editorial proporcional

- [x] 2.1 Incorporar los perfiles tipados `solo` y `collaborative`, configurando OdontoPau para ofrecer Borrador, Publicado y Retirado sin invalidar estados históricos.
- [x] 2.2 Mantener responsable clínico, fecha, consentimiento aplicable y gates existentes como requisitos de publicación, con pruebas para ambos perfiles y documentos intermedios heredados.

## 3. Lista operativa dentro de Tina

- [x] 3.1 Implementar un modelo puro que derive por contenido estado editorial, estado público, preparación, bloqueos, explicación cotidiana y acciones seguras.
- [x] 3.2 Reemplazar el resumen limitado de Artículos e Instrucciones por una lista completa con búsqueda y filtros de tipo y estado cotidiano.
- [x] 3.3 Mostrar por fila título, tipo, categoría, resumen, etiquetas, fechas editoriales guardadas, un único estado visible, motivo y enlaces válidos para editar y revisar Preview, sin conducir piezas retiradas al 404 visual.
- [x] 3.4 Mantener `Publicar cambios` como única acción global, limitar Estado a Publicado, No publicado o Borrador y explicar Preview, publicación en curso y confirmación dentro de `Qué pasa` sin jerga técnica.
- [x] 3.5 Adaptar la lista a mobile y teclado, agregar nombres accesibles y extender la simulación local para revisar estados y bloqueos sin guardar ni llamar servicios externos.

## 4. Consolidación del panel único

- [x] 4.1 Redirigir `/editorial` y `/editorial/login` a `/admin` preservando marcadores y sin crear un segundo punto de autenticación.
- [x] 4.2 Eliminar selectivamente el componente, estilos y endpoints de sesión exclusivos del dashboard histórico después de comprobar que no tienen otros consumidores.
- [x] 4.3 Verificar que ninguna ruta pública expone documentos no publicados, estado interno, credenciales, índices privados ni datos sensibles.

## 5. Validaciones focalizadas de implementación

- [x] 5.1 Ejecutar pruebas específicas del índice, huellas, perfiles, reglas editoriales, acciones y workflow sin iniciar publicaciones reales.
- [x] 5.2 Validar la carga, búsqueda, filtros, estados vacío/error y navegación de filas con fixtures representativos de publicado, modificado, bloqueado y retirado.
- [x] 5.3 Ejecutar las comprobaciones CMS y de rutas públicas afectadas, incluyendo retiro reversible, sitemap, metadata y ausencia del dashboard histórico.

## 6. Cierre técnico y humano

- [x] 6.1 Ejecutar una única tanda final de `pnpm exec tsc --noEmit`, `pnpm run lint` y `pnpm run build`, separando cualquier limitación ambiental de una falla de aplicación.
- [x] 6.2 Ejecutar `openspec validate operativizar-dashboard-editorial-por-contenido --strict` y revisar que proposal, design, specs y tareas coincidan con el diff real.
- [x] 6.3 Auditar el diff y el staging selectivo, excluyendo `.codex-remote-attachments/`, `tsconfig.tsbuildinfo` ajeno y cualquier residuo no atribuible al OpenSpec.
- [x] 6.4 Completar revisión local desktop/mobile, teclado, lector de pantalla y simulación de estados sin guardar contenido ni consumir Netlify.
- [x] 6.5 Evaluar si el gate protegido o un Preview compartido requieren una revisión remota final; se decidió que no era necesaria y no se creó PR, build ni consumo adicional de Netlify.
- [x] 6.6 Alejandro valida manualmente la experiencia final en `/admin` y marca este último checkbox; ningún agente puede marcarlo.
