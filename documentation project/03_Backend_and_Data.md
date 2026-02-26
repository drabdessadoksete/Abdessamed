## 1. Overview

This project supports two backend strategies:

1. **Primary (in use): Supabase**
   - PostgreSQL database
   - Storage buckets for images
   - Authentication (email/password)
   - Accessed directly from the browser via `@supabase/supabase-js`

2. **Optional: Express + JSON backend**
   - Node/Express server (`server/index.js`)
   - File‑based store (`server/data.json`)
   - File uploads to `server/uploads`

The frontend API layer is [`src/services/api.js`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/src/services/api.js).  
Currently it delegates **only to Supabase** via [`src/services/supabase.js`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/src/services/supabase.js).

---

## 2. Supabase Backend (Primary)

### 2.1 Client and Environment

In `supabase.js`:

- Env variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Client:
  ```js
  import { createClient } from '@supabase/supabase-js'

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const useSupabase = true

  export const supabase = useSupabase && supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null
  ```

If `supabase` is `null`, helpers usually return empty data or `null` instead of throwing.

### 2.2 Tables & Data Models (Inferred)

The schema lives in Supabase, but the code implies these tables and fields.

#### `services`
- Used by: `getServices`, `createService`, `updateService`, `deleteService`
- Fields (typical):
  - `id` (UUID or serial, PK)
  - `title` (text)
  - `description` (text)
  - `created_at` (timestamptz default `now()`)

#### `gallery_images`
- Used by: `getGallery`, `uploadGalleryImage`, `deleteGalleryImage`
- Fields:
  - `id` (UUID)
  - `url` (text)
  - `thumb_url` (text)
  - `category` (text: `implant` | `invisalign` | `general`)
  - `created_at` (timestamptz)

#### `messages`
- Used by: `getMessages`, `createMessage`, `deleteMessage`
- Fields:
  - `id` (UUID)
  - `name`, `email`, `phone`
  - `message` (text)
  - `created_at` (timestamptz)

#### `articles`
- Used by: `getArticles`, `getArticle`, `createArticle`, `updateArticle`, `deleteArticle`
- Fields:
  - `id` (UUID)
  - `title` (text)
  - `status` (text: e.g. `draft`, `published`)
  - `content_html` (text)
  - `created_at`, `updated_at` (timestamptz)

#### `media`
- Used by: `getMedia`, `uploadMedia`, `deleteMedia`
- Fields:
  - `id` (UUID)
  - `url` (text)
  - `thumb_url` (text)
  - `meta` (jsonb, e.g. `{ width, height }`)
  - `created_at` (timestamptz)

### 2.3 Storage Buckets

`supabase.storage` is used with two buckets:

- **`gallery`**
  - Upload path: generated file name using timestamp + random string.
  - Public URL: `supabase.storage.from('gallery').getPublicUrl(fileName)`.

- **`media`**
  - Same pattern, used for article media and WYSIWYG uploads.

Deletion of media:
- Uses helper `extractStoragePath(url, 'media')` to compute the file path.
- Calls `supabase.storage.from('media').remove([path])` before deleting DB row.

### 2.4 Auth Flows

Supabase auth helpers in `supabase.js`:

- `signIn(email, password)` → `supabase.auth.signInWithPassword`.
- `signOut()` → `supabase.auth.signOut`.
- `getUser()` → `supabase.auth.getUser`.

High‑level login wrapper in `api.js`:

- `loginAdmin(email, password)`:
  - Calls `signIn`.
  - On success, stores `data.session.access_token` in `localStorage.admin_token`.
  - Returns `{ token }` or `{ error }`.

Note: the current `Login.jsx` page uses **hard‑coded credentials** and does not call `loginAdmin`. It sets `localStorage.admin_token` directly. Supabase auth is available but not yet wired to the UI.

### 2.5 API Layer (`src/services/api.js`)

This file exposes simple async functions directly used by pages/components:

- Services: `getServices`, `createService`, `updateService`, `deleteService`
- Gallery: `getGallery`, `addGalleryItem`, `deleteGalleryItem`
- Messages: `getMessages`, `submitMessage`, `deleteMessage`
- Articles: `getArticles`, `getArticle`, `createArticle`, `updateArticle`, `deleteArticle`
- Media: `uploadMedia`, `deleteMedia`, `listMedia`
- Auth: `loginAdmin`

All of them currently just **proxy to Supabase** implementations in `supabase.js`.  
To switch to a different backend, change these functions while preserving their signatures.

---

## 3. Optional Express Backend

File: [`server/index.js`](file:///c:/Users/Ordi/Desktop/Abdessadok/Abdessamed/server/index.js)

### 3.1 Server Setup

- Uses `express`, `cors`, `multer`, `sharp`, `uuid`.
- Data directory: `server/`
  - `DATA_FILE = server/data.json`
  - `UPLOAD_DIR = server/uploads`
- On startup:
  - Ensures directories exist.
  - If `data.json` is missing, seeds it with:
    ```json
    {
      "services": [],
      "gallery": { "implant": [], "invisalign": [], "general": [] },
      "messages": [],
      "articles": [],
      "media": []
    }
    ```
- Middleware:
  - `cors({ origin: true })`
  - `express.json({ limit: '5mb' })`
  - Static `/uploads` for serving uploaded files.

### 3.2 Auth

- Environment:
  - `ADMIN_EMAIL` (default `admin@example.com`)
  - `ADMIN_PASSWORD` (default `admin`)
- Endpoint:
  - `POST /api/auth/login` → returns `{ token }` on success.
- A simple in‑memory `tokens` set is created, but `requireAuth` is currently a no‑op (`next()` only).  
  In other words, the auth check is **not enforced** in this file and would need to be implemented if used.

### 3.3 REST Endpoints

The server exposes CRUD endpoints for the same concepts that Supabase tables handle.

**Services**
- `GET /api/services` → list services
- `POST /api/services` → create service
- `PUT /api/services/:id` → update service
- `DELETE /api/services/:id` → delete service

**Gallery**
- `GET /api/gallery` → get `{ implant, invisalign, general }`
- `POST /api/gallery/:section` → upload image or URL to a section
- `DELETE /api/gallery/:section/:id` → delete gallery item

**Messages**
- `GET /api/messages` → list messages
- `POST /api/messages` → create message

**Media**
- `POST /api/media/upload` → upload image, generate thumbnail, store metadata
- `GET /api/media` → list media items

**Articles**
- `GET /api/articles` (optional `status` query)
- `GET /api/articles/:id`
- `POST /api/articles`
- `PUT /api/articles/:id`
- `DELETE /api/articles/:id`

All of these operate on the JSON document in `data.json` via helper functions `readData()` and `writeData()`.

### 3.4 When to Use Express vs Supabase

- Use **Supabase** when:
  - You want managed PostgreSQL, storage, and auth.
  - You deploy the frontend as a static site.

- Use **Express backend** when:
  - You need a self‑contained demo without external services.
  - You prefer file‑based storage and have low traffic.

You can swap between them by changing `src/services/api.js` to call HTTP endpoints on the Express server instead of Supabase helpers.

---

## 4. Adding or Modifying Data Models & Endpoints

### 4.1 With Supabase (Recommended)

1. **Create or alter table in Supabase**
   - Define fields and types in the Supabase dashboard.
   - Set appropriate RLS (Row Level Security) policies.

2. **Add helper in `supabase.js`**
   - Implement functions like:
     ```js
     export const getFoo = async () => {
       const { data, error } = await supabase.from('foo').select('*').order('created_at', { ascending: false })
       if (error) throw error
       return data
     }
     ```

3. **Expose via `api.js`**
   - Add a wrapper that forwards to `supabase.js` while keeping a stable interface for the UI.

4. **Use in pages/components**
   - Import from `api.js` and call inside React components.

### 4.2 With Express Backend

1. **Extend `data.json` structure**
   - Add a new top‑level key (e.g., `"foo": []`) and adjust seed data.

2. **Add REST endpoints in `server/index.js`**
   - Use `readData`/`writeData` helpers.
   - Implement validation and error handling.

3. **Create frontend API functions**
   - Either:
     - Add HTTP fetch calls directly in a new service file, or
     - Adjust `api.js` to target the Express server instead of Supabase.

4. **Plug into React components**
   - Use the new API functions in pages or admin tools.

By keeping `api.js` as the single integration layer for the frontend, switching or mixing backends remains straightforward.

