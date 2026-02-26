## 1. Current State: No Payment Integration

As of the current codebase, **no payment or checkout system is implemented**:

- There are **no** payment providers (e.g. Stripe, PayPal, banking gateways) configured.
- There are **no** payment‑related environment variables, webhooks, or cryptographic routines.
- The app contains only informational copy about accepted payment methods (e.g. cards, checks, cash) in static content and translations.

This file documents that fact and provides a template for how to add payments in a way that fits the existing architecture.

---

## 2. Target Design for Future Payment Integration

If you decide to add a payment gateway, the recommended design is:

- Keep the React SPA as the **UI layer only**; all sensitive operations (keys, MAC/HMAC generation, payment verification) should run on a **backend**:
  - Either a new service (serverless functions or separate API),
  - Or the existing Express server (`server/index.js`) extended with payment routes.
- The frontend will:
  - Collect the minimal necessary data (e.g. treatment type, amount, patient reference).
  - Call a **backend endpoint** to create a payment session.
  - Redirect the user to the provider’s hosted payment page (or render a provider widget).
  - Listen for redirect or success/failure state and update UI.

Supabase itself is not used for payments, but you can store payment records in a Supabase table if convenient.

---

## 3. Cryptographic & Security Requirements (Future)

Because the current project has **no payment code**, there are **no concrete algorithms or keys** to document.

When integrating a provider, follow these principles:

- **Never expose secrets** (API keys, HMAC keys, private certs) in:
  - Frontend code
  - Vite `VITE_...` env vars
- **Do** store secrets in:
  - Server‑side environment variables (e.g. `PAYMENT_API_KEY`, `PAYMENT_HMAC_SECRET`)
  - The deployment platform’s secure config (Netlify/Vercel/Render environment settings, Docker secrets, etc.).

Typical cryptographic operations (to be implemented on backend only):

- Signing request payloads with an HMAC (e.g. HMAC‑SHA256) using a shared secret.
- Validating webhooks by:
  - Recomputing the MAC (Message Authentication Code) from request body + timestamp.
  - Comparing it to the provider‑sent signature.
- Using HTTPS exclusively and verifying TLS on the provider side.

Details such as “MAC formula” or “hashing algorithm” depend on the chosen provider and must follow its documentation.

---

## 4. Example Data Flows (Design Template)

### 4.1 Initiating a Payment

1. **Frontend**:
   - User clicks “Pay online” on a service or invoice.
   - React component sends `POST /api/payments/create-session` with:
     - `amount`
     - `currency`
     - `description`
     - `patientId` or `email`

2. **Backend** (Express or serverless):
   - Validates the payload.
   - Calls the payment provider’s “create session” API with:
     - Amount / currency
     - Return URLs (success/cancel)
     - Internal reference
   - Signs the request if required.
   - Stores a pending record (e.g. in Supabase `payments` table).
   - Returns the provider’s redirect URL or client secret to the frontend.

3. **Frontend**:
   - Redirects to the provider’s hosted payment page **or** mounts the provider widget (e.g. Stripe Elements).

### 4.2 Handling Success / Failure

1. **Provider → Browser redirect**:
   - Provider redirects back to `/payment/success` or `/payment/cancel` with a reference.

2. **Frontend**:
   - Reads the reference from query params.
   - Calls `GET /api/payments/:id` to display status.

3. **Backend**:
   - Returns the status based on stored payment record.

### 4.3 Webhooks / Callbacks

Use a backend endpoint such as `POST /api/payments/webhook`.

- Provider sends signed webhook events (e.g. `payment_succeeded`, `payment_failed`).
- Backend:
  - Verifies signature (MAC/HMAC) using the provider’s documented algorithm.
  - Updates the internal payment record (Supabase table or `data.json` if Express).
  - Optionally notifies the clinic by email.

---

## 5. Suggested Schema for Future Payment Table

If you choose to keep payment state in **Supabase**, a possible table is:

- Table: `payments`
  - `id` (UUID, PK)
  - `patient_email` (text)
  - `provider` (text) – e.g. `"stripe"`, `"bank_xyz"`
  - `provider_session_id` (text)
  - `status` (text) – `"pending" | "succeeded" | "failed" | "canceled"`
  - `amount` (numeric, in smallest currency unit)
  - `currency` (text, e.g. `"EUR"`)
  - `created_at`, `updated_at` (timestamptz)
  - `raw_payload` (jsonb) – optional for debugging

Alternatively, you may reuse or extend the existing `messages` or `articles` structures for simpler flows, but a dedicated `payments` table is cleaner.

---

## 6. Sandbox / Testing (To Be Defined Per Provider)

Because there is no integration now, there are no live or sandbox credentials in this codebase.

When adding a provider:

- Create separate **test keys** (sandbox) and **live keys**.
- Add server‑side env vars such as:
  - `PAYMENT_PROVIDER=...`
  - `PAYMENT_API_KEY_TEST=...`
  - `PAYMENT_API_KEY_LIVE=...`
  - `PAYMENT_WEBHOOK_SECRET=...`
- Implement a configuration switch to use the test keys in non‑production environments.
- Document:
  - Test card numbers
  - Common response flows
  - How to trigger success/failure/canceled test scenarios.

Until such integration is implemented, this file remains a design template and an explicit confirmation that **no payment gateway is active in the current project**.

