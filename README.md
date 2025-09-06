# NEXA Prototype

A mobile-first Next.js (App Router) prototype with PWA support. It showcases the Foreman Home experience and three pillars:

- Nexa Design (O-Calc demo): upload circuit map + description → generate engineered design (mock/API)
- Message / Nexa Field: DM coworkers + AI assistant chat
- To Do: Human-required tasks backed by a minimal API and Prisma DB

## Local Development

Requirements:
- Node 18+

Install deps:
```bash
npm install
```

PWA works best over HTTPS or localhost. For local dev:
```bash
npm run dev
```

Open http://localhost:3000

## API Routes

- `POST /api/design` → `{ description: string }` → returns mock design + materials
- `GET /api/todos` → list of todos
- `POST /api/todos` → create todo `{ title, due?, canAiHandle? }`
- `PATCH /api/todos/:id` → update todo `{ title?, due?, canAiHandle?, done? }`

## Database (Prisma + SQLite for local)

This project uses Prisma. For local development we use SQLite so you don’t need any external DB.

Set env (PowerShell example):
```powershell
$env:DATABASE_URL="file:./dev.db"
```

Generate client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Optional reset:
```bash
npm run db:reset
```

## PWA

- Manifest: `app/manifest.ts`
- Service worker: `public/sw.js`
- Icons: place your logo as `public/icons/source.png`, then:
```bash
npm run icons
```
This generates `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png`.

## Deployment (Vercel)

Recommended: GitHub → Vercel integration.

Settings:
- Framework preset: Next.js
- Build command: `prisma generate && prisma migrate deploy && next build` (defined in `vercel.json`)
- Env vars:
  - `DATABASE_URL` (use Postgres in production; e.g., Neon/Supabase). Example:
    - `postgresql://user:password@host:5432/dbname?schema=public`

After setting `DATABASE_URL`, Vercel will run migrations on build and ship the API.

## Roadmap

- Auth0 facade for MVP (JWT with `org_id` & `roles`), swappable with Cognito
- Connect Nexa Design to real engineering service (O-Calc or internal API)
- Wire To Do to Microsoft Graph (Outlook tasks / flagged emails)
- Persist messaging to a backend service and add presence
