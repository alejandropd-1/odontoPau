## 1. Panel editorial honesto

- [ ] 1.1 Modelar la lectura editorial como unión discriminada `cargando` / `confirmado` / `indisponible` en `editorial-dashboard-model.ts`, con la clase de fallo (sesión, permisos, plazo agotado, servicio) como dato del estado, y probar que totales, catálogo y acciones sólo se derivan del caso confirmado.
- [ ] 1.2 Retirar `publicLabel` del modelo, de su tabla de etiquetas y de las pruebas que lo fijan, verificando que ninguna vista lo consumía.
- [ ] 1.3 Conectar el estado al panel: ante una lectura fallida, las cuatro tarjetas superiores y el listado dejan de mostrar cifras y presentan el aviso; una falla posterior no conserva las cifras anteriores como vigentes.
- [ ] 1.4 Bloquear únicamente las acciones dependientes del dato no confirmado, conservando navegación, reintento y contacto, y manteniendo la edición y revisión permitidas cuando sólo falla el historial.
- [ ] 1.5 Definir un plazo finito de espera, liberar el estado ocupado al agotarse y descartar la respuesta tardía de una consulta cancelada para que no sobrescriba una más reciente.
- [ ] 1.6 Incorporar un reintento manual único que conserve filtros, orden, página y preferencia de tabla o tarjetas, y que no guarde contenido, no cree solicitudes de publicación y no llame a Netlify.
- [ ] 1.7 Redactar los avisos diferenciados de sesión inválida, permisos insuficientes, espera agotada y servicio no disponible, sin culpar a la conexión personal, sin afirmar una caída del proveedor y sin agregar estados editoriales.
- [ ] 1.8 Centralizar el contacto de Alejandro en configuración no secreta con `mailto:admin@useodontopro.com` y `https://wa.me/541160513261`, separado del contacto del consultorio, y preparar el borrador y el diagnóstico copiable con una lista cerrada de campos, envío decidido por la persona y alternativa seleccionable si falla el portapapeles.
- [ ] 1.9 Reordenar la parte superior para que el estado de la tanda de publicación ocupe lugar propio sólo mientras hay una tanda en curso, sin agregar estados ni duplicar la respuesta del historial.
- [ ] 1.10 Verificar con teclado, lector de pantalla y viewports de escritorio y móvil que carga, aviso, detalle, reintento y contacto tienen semántica, foco, contraste y distribución utilizables.

## 2. Validación y aprobación

- [ ] 2.1 Ejecutar las pruebas focalizadas del modelo y del panel, y registrar comandos y resultados reproducibles sin servicios externos.
- [ ] 2.2 Ejecutar `pnpm run validate:openspec` y una única tanda final de `pnpm exec tsc --noEmit`, `pnpm run lint` y `pnpm run build`.
- [ ] 2.3 Revisar el diff completo y verificar que no contiene contenido clínico, cambios editoriales, secretos ni archivos de otros OpenSpecs.
- [ ] 2.4 Con autorización de Alejandro, publicar la rama en un Draft PR y obtener un único Deploy Preview después de CI verde, verificando que no se inicia un deploy de producción.
- [ ] 2.5 Alejandro revisa manualmente el Deploy Preview o evidencia equivalente, confirma los textos y que correo y WhatsApp abren el destinatario correcto sin enviar mensajes de prueba, y marca personalmente este último checkbox; ningún agente puede marcarlo.
