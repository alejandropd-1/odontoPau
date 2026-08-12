## 1. Preparación y trazabilidad

- [x] 1.1 Confirmar rama exclusiva desde `main`, working tree sin cambios ajenos, fuentes accesibles y los dos consumidores del `heroImage`.
- [x] 1.2 Registrar la procedencia de las fuentes y comprobar que no se incorporen al repositorio documentos privados ni archivos externos innecesarios.

## 2. Composición e integración

- [x] 2.1 Generar una composición no destructiva que preserve a la paciente y sustituya únicamente el fondo por el consultorio real `main/1.jpeg`, con desenfoque suave y sin texto.
- [x] 2.2 Inspeccionar la identidad, sonrisa, dentición visible, anatomía, bordes, luz y ausencia de elementos inventados; iterar si alguna condición falla.
- [x] 2.3 Exportar el activo final como WebP optimizado dentro de `public/images` y conservar una única referencia compartida desde el tratamiento.
- [x] 2.4 Verificar que el texto alternativo describa apropiadamente la imagen y que `/tratamientos` y `/tratamientos/estetica-dental` usen el mismo activo.

## 3. QA automático y responsive

- [x] 3.1 Ejecutar `pnpm exec tsc --noEmit` y resolver errores atribuibles al cambio.
- [x] 3.2 Ejecutar `pnpm run lint` y resolver errores atribuibles al cambio.
- [x] 3.3 Ejecutar `pnpm run build` y confirmar la generación de ambas rutas.
- [x] 3.4 Ejecutar las pruebas específicas aplicables y `openspec validate actualizar-hero-estetica-fondo-consultorio --strict`.
- [x] 3.5 Verificar ambas rutas en desktop y entre 320–430 px, sin overflow, deformación ni pérdida del rostro o la sonrisa.

## 4. Preview y publicación controlada

- [ ] 4.1 Publicar la rama en un Draft PR y obtener un Deploy Preview sin mezclar a `main`.
- [ ] 4.2 Registrar las URLs o capturas que permitan comparar la portada y el detalle en desktop/mobile.

## 5. Aprobaciones humanas

- [ ] 5.1 Paula confirma consentimiento verificable y aprueba la composición clínica antes de publicar.
- [ ] 5.2 Alejandro valida manualmente el Deploy Preview y marca este checkbox; ningún agente puede completarlo.
