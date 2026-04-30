---
name: Vital Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#584235'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#8c7263'
  outline-variant: '#e0c0af'
  surface-tint: '#994700'
  primary: '#994700'
  on-primary: '#ffffff'
  primary-container: '#ff7a00'
  on-primary-container: '#5c2800'
  inverse-primary: '#ffb68b'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#5f5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#a2a0a0'
  on-tertiary-container: '#383737'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#ffb68b'
  on-primary-fixed: '#321200'
  on-primary-fixed-variant: '#753400'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The brand identity for this design system centers on the intersection of clinical excellence and human warmth. It moves away from the sterile, cold blues typical of the dental industry, instead utilizing a vibrant orange to signal energy, health, and approachability.

The aesthetic is firmly rooted in **Modern Glassmorphism**. This style uses translucent layers and soft background blurs to communicate transparency and technological sophistication. By layering frosted elements over subtle gradients, the interface achieves a sense of depth that feels airy and high-end. The visual narrative is one of "luminous clarity"—representing the bright results of dental care and the clear, honest communication between the clinic and its patients.

## Colors

This design system utilizes a high-contrast palette to maintain professional readability while injecting personality through the primary vibrant orange.

*   **Primary (Vibrant Orange):** Used for calls to action, highlights, and status indicators. It represents vitality and the brand's unique signature.
*   **Secondary (Pure White):** The foundation of the glassmorphic effects and the primary surface color, ensuring a "sterile" and clean clinical feel.
*   **Tertiary (Deep Charcoal):** Reserved for high-contrast typography and iconography to ensure WCAG accessibility.
*   **Neutral (Soft Grey):** Used for subtle background zoning to prevent eye fatigue in data-heavy medical environments.

Gradients should be used sparingly, transitioning from the primary orange to a slightly lighter, sun-kissed coral to add dimension to interactive elements.

## Typography

**Manrope** has been selected as the sole typeface for its exceptional balance of geometric modernism and humanistic warmth. It mirrors the precision of dental instruments while remaining highly legible in both digital interfaces and physical signage.

Headlines should utilize the heavier weights (Bold/ExtraBold) with slight negative letter-spacing to create a confident, authoritative presence. Body text utilizes a generous line height (1.6) to ensure patient forms and treatment descriptions are easy to digest. Labels and navigation items use SemiBold weights in uppercase for clear information hierarchy.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism and Layered Blurs** rather than traditional heavy shadows.

1.  **Surfaces:** Elements use semi-transparent white backgrounds (e.g., `rgba(255, 255, 255, 0.7)`) with a `backdrop-filter: blur(15px)`.
2.  **Borders:** Glass elements are defined by a 1px solid white border with 20% opacity. This "inner glow" provides a crisp edge against colorful backgrounds.
3.  **Shadows:** When necessary for functional elevation (like a modal), use "Ambient Shadows"—highly diffused, low-opacity (5-10%) shadows that use a slight orange tint to maintain color harmony with the brand.
4.  **Z-Index:** Clear layering ensures that active treatment cards appear to float above the background canvas.

## Shapes

The shape language is defined by **Softened Precision**. While the clinic is a place of medical accuracy, sharp corners can feel aggressive. A "Rounded" setting (0.5rem / 8px base) is applied to all standard components to echo the friendly curves of the logo's "P".

Large containers and feature cards should use `rounded-xl` (1.5rem) to emphasize the soft, approachable glass effect. Buttons and input fields use `rounded-lg` (1rem) to create a distinct, modern silhouette that feels comfortable for touch-based interaction on mobile devices.

## Components

### Buttons
Primary buttons utilize a linear gradient from the brand orange to a lighter coral. Text is white and bold. The "Glass" button variant uses a transparent background with an orange border and a subtle backdrop blur, intended for secondary actions.

### Cards
Cards are the primary vehicle for the glassmorphic style. They feature the 15px backdrop blur and the subtle 1px white border. Use these for service highlights (e.g., "Invisalign," "Dental Implants") and appointment reminders.

### Inputs & Forms
Input fields are minimalist with a soft grey background. On focus, the border transitions to the primary orange with a soft "glow" effect (a 4px blurred orange outer shadow). Labels are always positioned above the field for maximum clarity.

### Chips & Badges
Used for status updates (e.g., "Confirmed," "Pending"). These use high-saturation orange backgrounds with white text or a soft orange "tint" background with dark orange text for lower emphasis.

### Appointment Scheduler
A custom component featuring a calendar view with glass-layered time slots. Selected slots use the primary orange gradient to provide immediate visual feedback.