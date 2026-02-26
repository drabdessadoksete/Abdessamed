## 1. Architecture Overview

### 1.1 High‑Level System Design

The project is a **single‑page web application** for a dental clinic, focused on:
- Marketing pages (home, about, services, gallery, contact)
- Multilingual content (FR/EN/ES) with i18n
- Admin tooling for services, gallery images, messages, and news articles

At a high level:
- The **frontend** is a React SPA built with **Vite** and deployed as static assets.
- The app talks directly to **Supabase** (PostgreSQL + Storage + Auth) from the browser.
- A **KeepAlive** helper periodically pings Supabase to avoid cold starts.
- There is an **optional Express backend** (`server/index.js`) that persists data to a JSON file and handles file uploads; it is not currently wired through the main `api.js` service layer.

Conceptual diagram:

- Browser (React SPA)
  - Routing: `react-router-dom`
  - Pages: Home, About, Services, Gallery, Actualities, Article, Contact, Admin, Login
  - Data access: `src/services/api.js` → `src/services/supabase.js`
  - i18n: `i18next` + `react-i18next`
  - UX: `framer-motion`, `react-helmet-async`
- Backend (primary)
  - Supabase database: `services`, `gallery_images`, `messages`, `articles`, `media`, etc.
  - Supabase storage: `gallery`, `media` buckets
  - Supabase auth: email/password sign‑in used by `loginAdmin` (API layer; not yet used by UI)
- Backend (optional / local)
  - Express server (`server/index.js`)
  - JSON data store (`server/data.json`)
  - File uploads and thumbnails (`server/uploads`, `sharp`, `multer`)

The live application, as wired in `src/services/api.js`, currently uses **Supabase only**.

---

### 1.2 Tech Stack

**Languages**
- JavaScript (ES modules)
- JSX for React components

**Frontend**
- **React 18** (`react`, `react-dom`)
- **Vite 5** as dev server and bundler
- **react-router-dom 6** for SPA routing
- **framer-motion** for animations
- **react-helmet-async** for SEO and structured data management
- **i18next** + **react-i18next** for internationalization
- **Tailwind CSS 3** + custom utility classes via `src/styles/index.css`

**Backend & Data**
- **Supabase** (`@supabase/supabase-js`):
  - PostgreSQL database
  - Storage buckets for media
  - Authentication (email/password)
- **Optional Node/Express server**:
  - `express`, `cors` for HTTP API
  - `multer` for file uploads
  - `sharp` for image processing (thumbnails, metadata)
  - `uuid` for IDs
  - Persistent JSON store at `server/data.json`

**Tooling**
- Vite plugins: `@vitejs/plugin-react`
- CSS build toolchain: `postcss`, `autoprefixer`, `tailwindcss`
- Deployment helpers:
  - `netlify.toml` and `public/.htaccess` for SPA routing

---

### 1.3 Runtime Responsibilities

**Client (browser)**
- Render all pages and admin interface
- Call Supabase directly for:
  - Fetching and mutating services, gallery images, messages, articles, and media
  - Admin authentication (via `loginAdmin` in `src/services/api.js`, when used)
- Handle local admin session via `localStorage` (`admin_token`)
- Perform Google Places API calls for live Google Reviews

**Supabase**
- Host and query PostgreSQL tables
- Store images in storage buckets (`gallery`, `media`)
- Perform authentication and issue access tokens

**Express server (optional)**
- Offer JSON‑file backed REST endpoints for:
  - Services
  - Gallery
  - Messages
  - Media library
  - Articles with version history
- Handle multipart uploads and thumbnail generation

---

## 2. Environment Setup

### 2.1 Prerequisites

- **Node.js**: v18+ recommended
- **npm**: 9+ recommended
- A **Supabase project** (if using Supabase backend)
- Optionally, a **Google Cloud** project with Maps/Places API access

### 2.2 Local Setup Steps

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Abdessamed
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (or `.env.local`) at the project root and define:
   ```bash
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

   VITE_GOOGLE_MAPS_API_KEY=<optional-google-maps-api-key>
   VITE_GOOGLE_PLACE_ID=<optional-google-place-id>
   VITE_GOOGLE_MAPS_LINK=<optional-public-google-maps-link>
   VITE_GOOGLE_MAPS_EMBED_URL=<optional-maps-embed-url>

   VITE_CLINIC_ADDRESS=<public-address-string>
   VITE_CLINIC_PHONE=<public-phone-number>
   ```

4. (Optional) If you plan to use the Express backend instead of Supabase:
   - Configure environment variables:
     ```bash
     ADMIN_EMAIL=<admin-login-email>
     ADMIN_PASSWORD=<admin-login-password>
     PORT=5000   # or any port
     ```
   - Start the backend:
     ```bash
     npm run server
     ```
   - Wire the frontend to this backend instead of Supabase (see `03_Backend_and_Data.md` for how to swap).

5. Start the frontend dev server:
   ```bash
   npm run dev
   ```

The app will be available at the URL printed by Vite (usually `http://localhost:5173`).

---

## 3. Data Flow Overview

### 3.1 Frontend → Supabase

The default production‑ready path is:

1. **UI components / pages** call functions from `src/services/api.js`.
2. `api.js` delegates to `src/services/supabase.js`.
3. `supabase.js` uses `@supabase/supabase-js` to talk to:
   - Database tables (`services`, `gallery_images`, `messages`, `articles`, `media`)
   - Storage buckets (`gallery`, `media`)
   - Supabase Auth.

Examples:
- `Admin` page uses `getServices`, `createService`, `updateService`, `deleteService`.
- `Gallery` and admin gallery tools use `getGallery`, `uploadGalleryImage`, `deleteGalleryImage`.
- `Contact` form uses `createMessage` (wrapped as `submitMessage`).
- `Actualities` and `ActualitiesAdmin` pages use `getArticles`, `getArticle`, `createArticle`, `updateArticle`, `deleteArticle`.

### 3.2 Keep‑Alive

`src/KeepAliveWrapper.jsx` + `src/services/keepalive.js`:
- On app mount and every 2 hours, run a trivial Supabase query:
  - `supabase.from("messages").select("id").limit(1)`
- Purpose: keep the Supabase instance “warm” so that the first user after a long idle period doesn’t experience latency spikes.

### 3.3 Optional Express Flow

If you decide to use the Express backend:
- The client would send HTTP requests to `/api/...` endpoints defined in `server/index.js`.
- The Express server persists data to `server/data.json` and files to `server/uploads`.
- This backend does **not** require Supabase and can be used for local or small deployments.

Currently, the shared `src/services/api.js` uses Supabase only. Switching to the Express backend requires changing the implementation of `api.js` functions to call the Express endpoints instead of Supabase (see `03_Backend_and_Data.md`).

---

## 4. Environments

Typical environments:

- **Local development**
  - Vite dev server + local Supabase (or remote Supabase project)
  - Optional local Express server

- **Staging / Production**
  - Static frontend hosted on a platform such as Netlify, Vercel, or static hosting with proper SPA routing:
    - `netlify.toml`
    - `public/.htaccess` and `dist/_redirects` for SPA fallback to `index.html`
  - Supabase project hosted on Supabase Cloud (or self‑hosted)

Configuration is controlled almost entirely by environment variables.  
When cloning or white‑labeling this app, you mostly:
- Point the frontend to a different Supabase URL/keys.
- Change Google Maps/Places identifiers.
- Adjust branding and content (see `05_Rebuild_Template.md`).

