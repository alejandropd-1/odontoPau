# Circuito de ingreso de instrucciones por WhatsApp

## Información que envía Paula

- Título de la instrucción y tratamiento relacionado, si corresponde.
- Texto clínico confirmado, conservando tiempos, condiciones y excepciones.
- Imagen o infografía, si existe.
- Fecha de revisión y confirmación explícita de que el material puede prepararse para el sitio.

Los campos no informados se omiten. Codex no completa dosis, tiempos, diagnósticos, riesgos ni conductas clínicas por inferencia.

## Preparación

1. Codex transcribe y estructura el material en módulos de pasos, matriz, aviso o texto.
2. La información esencial se conserva como HTML aunque exista una infografía.
3. Las imágenes se renombran, optimizan y limpian de metadatos innecesarios.
4. El documento se crea en `draft` o `clinical_review` dentro de una rama `codex/` asociada al OpenSpec.
5. Netlify genera un Deploy Preview no indexado.

## Puertas de aprobación

- Paula valida la transcripción, las afirmaciones, los tiempos, las alertas y la vigencia clínica.
- El responsable del sitio valida maquetación, mobile, imagen, enlaces y funcionamiento del control general `Compartir`.
- Las comprobaciones técnicas validan OpenSpec, TypeScript, lint, build, metadata, sitemap y accesibilidad básica.
- Solo una autorización explícita habilita commit/push cuando corresponda, merge a `main` y publicación de Netlify.

## Mantenimiento

Cada cambio clínico actualiza `updatedAt`, vuelve a revisión y regenera el preview. Las indicaciones personalizadas entregadas durante la consulta prevalecen sobre la guía general publicada.
