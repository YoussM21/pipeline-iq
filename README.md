# PipelineIQ

A sales pipeline dashboard: track deals through stages (Lead → Contacted → Quoted → Won/Lost),
see live pipeline metrics, and manage deals with full CRUD. Built as a small, production-shaped
full-stack app.

## Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`) · TypeScript · Pinia · Vite
- **Backend:** Node · Express · TypeScript · REST API
- **Tooling:** Vite, vue-tsc, end-to-end TypeScript

## Features

- Kanban-style board grouped by pipeline stage
- Create / edit / delete deals with input validation (client + server)
- Move a deal between stages inline (PATCH)
- Live summary metrics (open pipeline value, won value, win rate, total deals)
- Server-computed "value by stage" chart (hand-rolled SVG, no chart library)
- Text search across deal name, company, and owner

## REST API

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET    | `/api/deals`        | List all deals |
| GET    | `/api/deals/stats`  | Aggregated pipeline metrics |
| POST   | `/api/deals`        | Create a deal (validated) |
| PATCH  | `/api/deals/:id`    | Partial update (e.g. move stage) |
| DELETE | `/api/deals/:id`    | Delete a deal |

Data lives in an in-memory store seeded at startup, accessed only through a small
repository layer (`server/src/db.ts`) so it can be swapped for SQLite/Postgres
without touching the routes.

## Run locally

Two terminals:

```bash
# Terminal 1 — API on :3001
cd server
npm install
npm run dev

# Terminal 2 — client on :5173 (proxies /api to :3001)
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Deploy (Vercel/Netlify + Render)

**Frontend → Vercel or Netlify**
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Set env var `VITE_API_URL` to your deployed API URL (e.g. `https://pipeline-iq-api.onrender.com`)

**Backend → Render (free web service)**
- Root directory: `server`
- Build command: `npm install && npm run build`
- Start command: `npm start`

> The server also serves the built client from `client/dist` if present, so you can
> alternatively deploy both as a single service.
