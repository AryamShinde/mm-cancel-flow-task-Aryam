# Migrate Mate – Cancellation & Downsell Flow

## Dev Setup
npm install
npm run db:setup (Docker desktop should be running)  
npm run dev  

## 1. Architecture
- **Stack:** Next.js (App Router), React, TypeScript, Tailwind  
- **Backend:** Supabase (Postgres + RLS); no extra services  
- **API:** Routes use anon (client) or service (server) keys  
- **Flow:** State machine in `src/app/cancel`  
  - `FoundJob*`, `Offer*`, `Visa*`, `Downsell*`, `PageEnd`  
- **Writes:**  
  - Early visa branch (found-job path)  
  - Final confirmation (still-looking path)  
- **Variants:** Deterministic hashing keeps pages stateless; profile dropdown enables instant user switching  

## 2. A/B Testing
- **Split:** 50/50 per user → `SHA256(SALT|lowercase_email)` first byte  
- **No server call, no drift, uniform distribution**  
- **Storage:** Variant saved with cancellation (localStorage only for visibility)  
- **Flows:**  
  - **Variant A:** Reason capture only  
  - **Variant B:** $10 discount (current plan – 1000 cents)  
    - Accept = complete (mock payment)  
    - Decline → reasons  

## 3. Security
- **CSRF:** `/api/csrf` sets httpOnly cookie → client echoes in header → server check  
- **Validation:** Free-form fields (`reason`, `visa_type`, `review_feedback`) trimmed/validated; others are enums/booleans  
- **XSS:** Escaped output; no raw HTML  
- **RLS:** Table-level policies; service role server-only  
- **Duplicate Prevention:** `useRef` guard + early visa protection  
- **Secrets:** Only Supabase keys; variant salt may be public  

## 4. Mock User
- Profile dropdown → `/api/users`  
- Stores email in `localStorage:mm_selected_user_email`  
- Drives subscription fetch, variant compute, cancellation actions  
- Replaces real auth (demo only); production would use Supabase Auth  

## 5. Row-Level Security
- **users:** SELECT self  
- **subscriptions:** SELECT by `user_id`; no UPDATE  
- **cancellations:**  
  - SELECT own  
  - INSERT only if user owns subscription  
  - Immutable log (no UPDATE/DELETE)  
- **Service role:** Bypasses RLS for admin ops (e.g. marking `pending_cancellation`)  

## 6. Data Model
- `users` → `subscriptions` → `cancellations`  
- **subscriptions.status:** `active | pending_cancellation | cancelled`  
- **cancellations fields:**  
  - variant, reason, accepted_downsell, visa_type, visa_help, found_job_with_mm, review_feedback  
- Logging cancellation on active subscription → status → `pending_cancellation`  

     
