## 1. Purpose

This file is a **strict blueprint** for rebuilding or white‑labelling this project for another business (e.g. another dental clinic, a medical practice, or an entirely different service business).

Fill in the blanks and follow the checklist to:
- Clone the architecture
- Swap branding, content, and configuration
- Point the app at a new Supabase project (and optional Express backend)
- Deploy under a new domain

---

## 2. Project Identity

Fill these fields for the **new brand**:

- **Business name**: `{{ BUSINESS_NAME }}`
- **Brand short name** (for navbar): `{{ BRAND_SHORT_NAME }}`
- **Business type**: `{{ BUSINESS_TYPE }}` (e.g. Dentist, Clinic, Spa)
- **Primary domain**: `{{ PRIMARY_DOMAIN }}` (e.g. `https://exampleclinic.com`)
- **Default locale**: `{{ DEFAULT_LOCALE }}` (e.g. `fr`, `en`)

SEO metadata (edit in `index.html` and `App.jsx`):
- Page `<title>`: `{{ SEO_TITLE }}`
- `<meta name="description">`: `{{ SEO_DESCRIPTION }}`
- `<meta name="keywords">`: `{{ SEO_KEYWORDS }}` (comma‑separated)

Structured data (JSON‑LD in `index.html` and `App.jsx`):
- `@type`: `{{ SCHEMA_ORG_TYPE }}` (e.g. `Dentist`, `MedicalClinic`, `LocalBusiness`)
- `name`: `{{ BUSINESS_NAME }}`
- `url`: `{{ PRIMARY_DOMAIN }}`
- `telephone`: `{{ PUBLIC_PHONE }}`
- Address fields:
  - `streetAddress`: `{{ STREET_ADDRESS }}`
  - `addressLocality`: `{{ CITY }}`
  - `postalCode`: `{{ POSTAL_CODE }}`
  - `addressCountry`: `{{ COUNTRY_CODE }}` (e.g. `FR`)

---

## 3. Branding & Design Tokens

Update **Tailwind tokens** in [`tailwind.config.js`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/tailwind.config.js):

- `colors.primary`: `{{ PRIMARY_COLOR_HEX }}`
- `colors.secondary`: `{{ SECONDARY_COLOR_HEX }}`
- `colors.accent`: `{{ ACCENT_COLOR_HEX }}`
- `colors.background`: `{{ BACKGROUND_COLOR_HEX }}`
- `colors.surface`: `{{ SURFACE_COLOR_HEX }}`
- `colors.foreground`: `{{ FOREGROUND_COLOR_HEX }}`
- `colors.rolexGreen`: `{{ BRAND_COLOR_1_HEX }}` (rename conceptually if needed)
- `colors.rolexGold`: `{{ BRAND_COLOR_2_HEX }}`

Logos & images (replace in `src/assets` and `public`):
- Favicon set (`src/assets/Favicon/*`, `public/*icon*.png`, `favicon.ico`):
  - New logo path: `{{ FAVICON_BASE_NAME }}`
- Navbar logo and hero logo:
  - `src/assets/Favicon/android-chrome-192x192.png` → `{{ NAV_LOGO_FILE }}` or update import paths.
- Replace hero and gallery images with new brand‑appropriate assets.

Typography:
- Optionally change `fontFamily.sans` in Tailwind or include new fonts in CSS.

---

## 4. Environment Variables (Frontend)

Create `.env` (or `.env.local`) with the following **frontend** variables:

```bash
VITE_SUPABASE_URL={{ NEW_SUPABASE_URL }}
VITE_SUPABASE_ANON_KEY={{ NEW_SUPABASE_ANON_KEY }}

VITE_GOOGLE_MAPS_API_KEY={{ GOOGLE_MAPS_API_KEY }}
VITE_GOOGLE_PLACE_ID={{ GOOGLE_PLACE_ID }}
VITE_GOOGLE_MAPS_LINK={{ PUBLIC_MAPS_LINK }}
VITE_GOOGLE_MAPS_EMBED_URL={{ MAPS_EMBED_URL }}

VITE_CLINIC_ADDRESS={{ PUBLIC_POSTAL_ADDRESS }}
VITE_CLINIC_PHONE={{ PUBLIC_PHONE_NUMBER }}
```

For a non‑clinic business, rename internally as appropriate but keep variable names to avoid code changes.

---

## 5. Environment Variables (Backend / Express, Optional)

If you use the **Express backend** (`npm run server`), configure these **server‑side** variables:

```bash
ADMIN_EMAIL={{ ADMIN_LOGIN_EMAIL }}
ADMIN_PASSWORD={{ ADMIN_LOGIN_PASSWORD }}
PORT={{ EXPRESS_PORT }}   # e.g. 5000
```

These are used only by `server/index.js` for `/api/auth/login`.  
If you rely solely on Supabase for auth, you can ignore this and later wire the UI to `loginAdmin` from `api.js`.

---

## 6. Database & Storage (Supabase)

Create a new **Supabase project**, then:

### 6.1 Tables

Create tables with at least these fields (you may extend them):

1. `services`
   - `id` UUID default `uuid_generate_v4()` (PK)
   - `title` text
   - `description` text
   - `created_at` timestamptz default `now()`

2. `gallery_images`
   - `id` UUID
   - `url` text
   - `thumb_url` text
   - `category` text (`implant` / `invisalign` / `general` or your own categories)
   - `created_at` timestamptz default `now()`

3. `messages`
   - `id` UUID
   - `name` text
   - `email` text
   - `phone` text
   - `message` text
   - `created_at` timestamptz default `now()`

4. `articles`
   - `id` UUID
   - `title` text
   - `status` text (`draft`, `published`, etc.)
   - `content_html` text
   - `created_at` timestamptz default `now()`
   - `updated_at` timestamptz default `now()`

5. `media`
   - `id` UUID
   - `url` text
   - `thumb_url` text
   - `meta` jsonb
   - `created_at` timestamptz default `now()`

### 6.2 Storage Buckets

Create Supabase Storage buckets:

- Bucket `gallery` – for gallery images.
- Bucket `media` – for article/editor media.

Set public read access or signed URL policies according to your security requirements.

### 6.3 Auth

Decide how admins log in:

- Option 1 (simplest for now): keep **hard‑coded admin login** in `src/pages/Login.jsx` and update:
  - `expectedEmail = '{{ ADMIN_EMAIL }}'`
  - `expectedPassword = '{{ ADMIN_PASSWORD }}'`

- Option 2 (recommended long‑term): use Supabase auth:
  - Create an admin user in Supabase.
  - Wire `Login.jsx` to call `loginAdmin` (from `src/services/api.js`) instead of using hard‑coded checks.

---

## 7. Content & Translations

Update **translations** in `src/locales`:

- `src/locales/fr/common.json`
- `src/locales/en/common.json`
- `src/locales/es/common.json`

For each file, adapt:
- Navigation labels (`nav`)
- Hero text (`hero`)
- Section texts (`sections`, `servicesPage`, etc.)
- About page copy (`about`)
- Contact details & FAQ (`contact`, `about.faq`)

You can keep the same key structure and just swap strings for the new business.

---

## 8. Route & Feature Mapping for New Business

Use existing routes as templates:

- `/` → main landing page (`Home.jsx`)
- `/about` → company/about page (`About.jsx`)
- `/services` → list of services or offerings (`Services.jsx`)
- `/gallery` → portfolio / case gallery (`Gallery.jsx`)
- `/actualities` + `/actualities/:id` → blog/news (`Actualities.jsx`, `Article.jsx`)
- `/contact` → contact form and location (`Contact.jsx`)
- `/login`, `/admin`, `/admin/actualities` → admin screens

For a non‑medical business, rename:
- Components and page headings
- Navigation labels
- Content inside `Home`, `About`, `Services`, `Gallery`, etc.

The **data models** (`services`, `gallery_images`, `articles`, `media`, `messages`) are generic enough for many service businesses.

---

## 9. White‑Label Rebuild Checklist

Use this checklist when cloning the project for a new brand:

1. **Clone & install**
   - [ ] Clone repo to new directory.
   - [ ] Run `npm install`.

2. **Create Supabase project**
   - [ ] Create new Supabase project.
   - [ ] Create tables (`services`, `gallery_images`, `messages`, `articles`, `media`).
   - [ ] Create storage buckets (`gallery`, `media`).
   - [ ] Configure auth (create admin user if needed).

3. **Set environment variables**
   - [ ] Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - [ ] Add Google Maps keys and IDs (optional but recommended).
   - [ ] Add address and phone env values.
   - [ ] (Optional) Add Express server env vars (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PORT`).

4. **Update branding**
   - [ ] Replace logos and favicon assets.
   - [ ] Update Tailwind color tokens.
   - [ ] Adjust typography if desired.

5. **Update content**
   - [ ] Update SEO tags in `index.html` and `App.jsx`.
   - [ ] Update JSON‑LD structured data (business name, address, etc.).
   - [ ] Update translations in `locales/*/common.json`.
   - [ ] Adjust copy in `Home`, `About`, `Services`, `Contact`, `Gallery`, etc.

6. **Configure admin**
   - [ ] Decide on auth strategy:
     - Hard‑coded credentials in `Login.jsx` (dev/demo), or
     - Supabase auth via `loginAdmin`.
   - [ ] Ensure `Admin` and `ActualitiesAdmin` screens load data from the new Supabase tables.

7. **Run & verify locally**
   - [ ] Run `npm run dev`.
   - [ ] Test all routes, forms, and admin flows.
   - [ ] Verify Supabase reads/writes and file uploads (gallery/media).

8. **Deploy**
   - [ ] Build with `npm run build`.
   - [ ] Deploy `dist/` to hosting (Netlify, Vercel, etc.).
   - [ ] Configure SPA routing (Netlify redirects, Apache/Nginx rewrite, etc.).
   - [ ] Set production env vars on the hosting platform.

9. **Post‑deployment checks**
   - [ ] Verify SSL (`https://`).
   - [ ] Check SEO tags and structured data using browser tools / validators.
   - [ ] Test contact form, admin login, and all CRUD flows.

Following this template, you can reliably reuse the architecture for multiple brands with minimal changes to core code.

