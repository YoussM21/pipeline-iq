# PipelineIQ

A sales pipeline dashboard for tracking deals from first contact to close. Built as a full-stack app with a Vue 3 frontend and a Node/Express backend.

## Features

- Kanban board with deals grouped by stage (Lead → Contacted → Quoted → Won/Lost)
- Drag and drop cards between stages
- Filter by owner and search across deal name, company, and owner
- Create, edit, and delete deals with validation on both client and server
- Summary metrics: open pipeline value, won value, win rate, and total deals
- Value-by-stage bar chart

## Stack

- **Frontend:** Vue 3, TypeScript, Pinia, Vite
- **Backend:** Node.js, Express, TypeScript

## Running locally

Start the API and the client in two separate terminals:

```bash
# Terminal 1 — API on :3001
cd server
npm install
npm run dev

# Terminal 2 — client on :5173
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## Deploying

The project is split into two services: the Vue client on Vercel and the Express API on Render. Config files for both are included at the repo root (`vercel.json`, `render.yaml`).

**Backend → Render**

1. Connect the repo on [render.com](https://render.com) — it will detect `render.yaml` automatically
2. Deploy and copy the service URL (e.g. `https://pipeline-iq-api.onrender.com`)

**Frontend → Vercel**

1. Import the repo on [vercel.com](https://vercel.com) — it will detect `vercel.json` automatically
2. Add one environment variable before deploying:
   - `VITE_API_URL` → your Render service URL
3. Deploy
