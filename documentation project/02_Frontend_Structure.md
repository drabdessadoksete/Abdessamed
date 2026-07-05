## 1. Frontend Framework & Entry Points

### 1.1 Framework

The frontend is a **React 18** single‑page application built with **Vite**.  
Key pieces:
- React SPA with `react-router-dom` v6 for routing
- Animation via `framer-motion`
- SEO / structured data via `react-helmet-async`
- Internationalization via `i18next` + `react-i18next`
- Styling via **Tailwind CSS** (utility classes) with a small set of custom tokens

Main entry points:
- [`index.html`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/index.html) – static HTML shell, mounts React at `#root` and loads `src/main.jsx`.
- [`src/main.jsx`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/src/main.jsx) – bootstraps React, routing, helmet provider, and keep‑alive.
- [`src/App.jsx`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/src/App.jsx) – application shell (navbar, footer, page transitions).

---

## 2. Folder Structure (Frontend)

Relevant front‑end folders:

- `src/`
  - `main.jsx` – React root, router setup
  - `App.jsx` – layout shell; global Helmet; scroll‑to‑top behavior
  - `KeepAliveWrapper.jsx` – Supabase keep‑alive
  - `assets/` – images, favicon set, hero video, logos
  - `components/` – reusable UI components
  - `pages/` – route‑level pages
  - `services/` – API and data‑access helpers (Supabase, keepalive)
  - `i18n/` – i18next initialization
  - `locales/` – translation JSON files per language
  - `styles/` – global CSS and Tailwind entry

### 2.1 Components

Located in [`src/components`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/src/components):

- `Navbar.jsx` – top navigation bar, language switcher, call‑to‑action buttons.
- `Footer.jsx` – footer with contact info, hours, and tagline.
- `Hero.jsx` – homepage hero with autoplaying video and click‑to‑mute/unmute.
- `Features.jsx` – “why choose us” feature grid.
- `Testimonials.jsx` – testimonials/cards section.
- `CTA.jsx` – global call‑to‑action section.
- `GoogleReviews.jsx` – integration with Google Places API to show latest reviews.
- `KeepAlive.jsx` (if used) – small wrapper for keep‑alive logic (mainly replaced by `KeepAliveWrapper`).

### 2.2 Pages

Located in [`src/pages`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/src/pages):

- `Home.jsx` – marketing homepage; uses `Hero`, `Features`, `Testimonials`, `CTA`, Invisalign iframe.
- `About.jsx` – dentist bio, clinic video, FAQ, certifications, opening hours.
- `Services.jsx` – descriptions of major services (implantology, Invisalign, general care).
- `Gallery.jsx` – image gallery split into categories (`implant`, `invisalign`, `general`) loaded from Supabase.
- `Contact.jsx` – contact form, location info, Google Maps embed, contact FAQ.
- `Actualities.jsx` – list of news/articles (from Supabase `articles` table).
- `Article.jsx` – single article detail page (HTML content).
- `Admin.jsx` – admin dashboard to manage services, gallery, and messages.
- `ActualitiesAdmin.jsx` – admin interface to manage articles with a WYSIWYG‑style editor and media picker.
- `Login.jsx` – simple admin login screen (currently using hardcoded credentials and `localStorage` token).

---

## 3. Routing Strategy

Routing is defined in [`src/main.jsx`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/src/main.jsx) using `createBrowserRouter`:

- Root route:
  - `path: '/'`
  - `element: <App />`
  - `children`:
    - `/` (index) → `Home`
    - `/about` → `About`
    - `/services` → `Services`
    - `/gallery` → `Gallery`
    - `/contact` → `Contact`
    - `/actualities` → `Actualities`
    - `/actualities/:id` → `Article`
    - `/login` → `Login`
- Standalone admin routes:
  - `/admin` → `Admin`
  - `/admin/actualities` → `ActualitiesAdmin`

`App.jsx` wraps all child routes with:
- `<Navbar />` and `<Footer />`
- `<Outlet />` to render child route component
- `AnimatePresence` + `motion.div` for page transition animations

---

## 4. State Management

There is **no global state library** (no Redux, Zustand, etc.).  
State is handled via:

- Local component state with `useState` and `useEffect`
  - e.g. form fields, toggles (menus, modals, tabs)
- URL parameters via React Router
  - e.g. article ID in `Article.jsx`
- Translations via `react-i18next`
  - `useTranslation()` provides `t` and `i18n`.
  - Selected language is stored in `localStorage` in `Navbar.jsx` and read by `i18next`.
- Admin session via Supabase Auth
  - `AdminGuard.jsx` validates both the live user and the database-backed admin role.

Data fetching is done ad‑hoc within pages and admin components using async functions from `src/services/api.js`.

---

## 5. Styling Conventions

The app uses **Tailwind CSS** with custom theme extensions defined in [`tailwind.config.js`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/tailwind.config.js):

- `fontFamily.sans`: `Poppins`, `Inter`, and system fallbacks
- Custom colors:
  - `primary` – main accent blue
  - `secondary` – cyan accent
  - `accent` – green accent
  - `muted` – subdued text
  - `background` – page background
  - `surface` – surfaces/cards background
  - `foreground` – main text color
  - `card` – card background
  - `rolexGreen` / `rolexGold` – brand‑specific colors
- Extra radii and shadows:
  - `rounded-xl`, `rounded-2xl`
  - `shadow-soft`, `shadow-glow`

Global styles are composed in [`src/styles/index.css`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/src/styles/index.css) and imported from `main.jsx`.  
Tailwind’s `content` configuration includes `index.html` and all `src/**/*.{js,jsx,ts,tsx}` files.

Custom utility patterns:
- Layout: `container-max`, `section`, `navbar-gold`, etc. (defined via CSS classes and Tailwind utilities).
- Cards: `card` with border, background, and shadow.
- Buttons: `btn-primary`, `btn-outline` for consistent CTA styling.

When adding new UI, reusing these existing utility classes keeps the design consistent.

---

## 6. Core Components & Interactions

### 6.1 Application Shell (`App.jsx`)

- Adds site‑wide SEO tags and JSON‑LD structured data via `Helmet`.
- Renders `Navbar`, `Footer`, and the current route.
- Handles smooth scroll‑to‑top on route change via `useEffect`.
- Animates route transitions with `AnimatePresence` and `motion.div`.

### 6.2 Navigation (`Navbar.jsx`)

- Desktop & mobile navigation using `NavLink` and `Link`.
- Language selector that calls `i18n.changeLanguage(code)` and persists to `localStorage`.
- Call‑to‑action links that open Doctolib booking pages.
- Mobile menu with animated open/close behavior.

### 6.3 Hero (`Hero.jsx`)

- Displays clinic hero text with a video:
  - Video autoplay
  - Sound on by default (subject to browser auto‑play rules)
  - Clicking the video toggles muted/unmuted
- Uses `motion` for entrance animation.

### 6.4 Admin Modules

- `Admin.jsx`:
  - Sidebar with tabs for **Pre-appointments**, **Services**, **Gallery**, **Messages**, plus link to actualities admin.
  - Protected by `AdminGuard` and Supabase row-level security.
  - For each tab, fetches data using `getServices`, `getGallery`, `getMessages`, etc.
- `ActualitiesAdmin.jsx`:
  - Article editor with toolbar (bold, italic, heading, lists).
  - Uses `contentEditable` and `document.execCommand` for inline HTML editing.
  - Integrates with media library (Supabase `media` table) via `uploadMedia`, `listMedia`.

---

## 7. Adding or Deleting UI Components

### 7.1 Adding a New Component

1. **Create the component file**
   - Place it under `src/components/` or `src/pages/` depending on its role.
   - Follow the existing code style: functional components, hooks, Tailwind utility classes, no inline comments unless necessary.

2. **Wire data (if needed)**
   - If the component needs data from Supabase:
     - Import functions from `src/services/api.js`.
     - Call them in `useEffect` and store results in `useState`.
     - Handle loading and error states as needed.

3. **Style the component**
   - Use `btn-primary`, `btn-outline`, `card`, `section`, `container-max` and the brand colors defined in Tailwind.
   - Prefer Tailwind utility classes to new CSS where possible.

4. **Add translations**
   - For any user‑visible text, use `useTranslation()` and keys from the `locales/*/common.json` files.
   - Add matching keys in `fr`, `en`, and `es` JSON files to keep languages in sync.

5. **Expose the component**
   - For pages: add a route entry in `src/main.jsx`.
   - For sub‑components: import into the relevant page or layout.

### 7.2 Deleting a Component

1. **Remove references**
   - Delete all imports and JSX usage of the component from pages or other components.
   - Remove any route entries in `src/main.jsx` if it is a page.

2. **Remove translations**
   - Remove translation keys that are no longer used (optional but recommended to avoid clutter).

3. **Delete the file**
   - Remove the file from `src/components` or `src/pages`.

4. **Test**
   - Run the app and navigate through all routes to ensure no runtime errors or missing imports.

---

## 8. Routing & State Patterns for New Features

When adding a new feature, follow these patterns:

- **New public page** (e.g., “Team”, “Pricing”):
  - Create `src/pages/Team.jsx`.
  - Add a child route under the root route in `src/main.jsx`.
  - Add navigation entry in `Navbar.jsx`.

- **New admin tool** (e.g., “Promotions”):
  - Create `src/pages/AdminPromotions.jsx` or integrate into `Admin.jsx` as a new tab.
  - Add a new route (e.g., `/admin/promotions`) in `src/main.jsx`.
  - Implement data access via functions in `src/services/api.js` (and `supabase.js`).

- **Global UX features** (e.g., toasts, modals):
  - Implement a small stateful component (e.g., `ToastProvider`) at the `App` level.
  - Use React context or local state depending on scope.

By conforming to these patterns, new code will integrate cleanly with existing routing, styling, and i18n infrastructure.
