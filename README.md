<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🦷 Paula Gualtieri | Clinical Excellence & Digital Precision
### High-End Dental Clinic Portfolio & Management Platform
</div>

---

## 🚀 Tech Stack & Core Architecture

This project is built with the latest web technologies to ensure performance, SEO, and a premium user experience.

- **Core**: [Next.js 15+](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) (Using a custom Glassmorphism design system)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Smooth transitions and micro-interactions)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Content**: Data-driven architecture with static & dynamic routes.

---

## 📁 File Structure Reference

```text
odontoPau/
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, Metadata)
│   │   ├── tratamientos/   # Dynamic routes for Treatment & Clinical Cases
│   │   └── globals.css     # Global styles & Tailwind 4 configuration
│   ├── components/         # Reusable UI Components (Hero, Navbar, Footer, etc.)
│   ├── data/               # 💡 MAIN CONTENT SOURCE (Treatments, Cases)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and shared logic
│   └── assets/             # Images and local media (via public folder)
├── public/                 # Static assets (Images, Icons, Favicon)
├── DESIGN.md               # Detailed Design System & Brand Identity
└── package.json            # Dependencies and scripts
```

---

## 🛠️ Content Management (How to Update)

For both developers and AI agents, these are the primary files to modify to update the site's content:

### 1. Treatments & Clinical Cases (Main Content)
Modify `src/data/tratamientos.ts`. This file contains the array of all services provided, including:
- Treatment descriptions and icons.
- Clinical cases (Before/After galleries).
- Testimonials specific to a case.
- Success statistics and features.

### 2. General Patient Testimonials
Modify the `testimonials` constant in `src/components/Testimonials.tsx`. This section handles the rotating carousel of social proof on the landing page.

### 3. Team & Staff Information
Modify `src/components/Team.tsx`. This includes the professional staff list, their roles, and license numbers (MN).

### 4. Global Styles & Theme
- **Colors & Typography**: Defined in `DESIGN.md` and applied via `src/app/globals.css`.
- **Glassmorphism**: Logic is handled via Tailwind utility classes and CSS variables in `globals.css`.

---

## 🤖 AI Agent Guidelines

If you are an AI assistant working on this project:
1. **Design Consistency**: Always refer to `DESIGN.md` before creating new components. Follow the "Vital Precision" (Modern Glassmorphism) aesthetic.
2. **Data Structure**: When adding new treatments or cases, ensure they follow the `Tratamiento` and `CasoClinico` interfaces defined in `src/data/tratamientos.ts`.
3. **Responsive Design**: Use Tailwind's responsive prefixes. The site is optimized for mobile-first clinical environments.
4. **Icons**: Always use `lucide-react` icons.

---

## 🏁 Getting Started

1. **Prerequisites**: Node.js 20+ installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Create a `.env.local` file and add:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

---

<div align="center">
Built with ❤️ for Paula Gualtieri.
</div>
