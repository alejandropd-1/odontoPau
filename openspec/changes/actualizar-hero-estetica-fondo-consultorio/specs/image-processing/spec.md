## MODIFIED Requirements

### Requirement: Imágenes Hero adaptadas
El sistema SHALL servir una imagen Hero de Estética Dental que preserve la identidad y los rasgos visibles de la paciente de la fotografía fuente, sustituya únicamente su entorno por el consultorio real provisto en `main/1.jpeg` con integración visual y desenfoque suave, y SHALL mantener la imagen vigente de “niña con anteojos” para Odontología Pediátrica.

#### Scenario: Visualización de Estética Dental
- **WHEN** un usuario ingresa a `/tratamientos/estetica-dental`
- **THEN** la imagen principal muestra a la misma paciente sin deformaciones sobre el consultorio real aprobado, sin texto incrustado ni elementos inventados

#### Scenario: Portada sincronizada de Estética Dental
- **WHEN** un usuario visita `/tratamientos`
- **THEN** la tarjeta de Estética Dental reutiliza el mismo activo declarado como `heroImage` por el tratamiento

#### Scenario: Recorte responsive de Estética Dental
- **WHEN** la imagen se presenta entre 320 px y desktop mediante los componentes existentes
- **THEN** el rostro y la sonrisa permanecen visibles y el activo no provoca overflow ni pérdida del centro de interés

#### Scenario: Visualización de Odontología Pediátrica
- **WHEN** un usuario ingresa a la página de Odontología Pediátrica
- **THEN** la imagen principal mantiene la composición vigente de una niña con anteojos

## ADDED Requirements

### Requirement: Control humano y accesibilidad del hero clínico
El hero de Estética Dental MUST conservar un texto alternativo descriptivo, MUST NOT incluir documentación privada de consentimiento en el repositorio y SHALL permanecer fuera de producción hasta contar con consentimiento verificable, aprobación de Paula sobre la imagen y validación visual final de Alejandro.

#### Scenario: Imagen todavía no aprobada
- **WHEN** falta cualquiera de las aprobaciones humanas requeridas
- **THEN** la variante puede revisarse localmente o en Deploy Preview pero no se mezcla a `main`

#### Scenario: Imagen renderizada
- **WHEN** cualquiera de los dos consumidores muestra el hero aprobado
- **THEN** la imagen expone un texto alternativo apropiado desde el dato compartido del tratamiento o su componente
