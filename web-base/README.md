# web-base — Public Website Template

A standalone React + Vite + TypeScript web template without authentication.
Includes responsive Home, About, and not-found pages with public navigation.
No backend, environment file, or account is needed to run it.

## Setup

Use Node.js 24. Run inside `web-base`:

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. Edit `src/App.tsx` for content and routes, and
`src/styles.css` for styling. All routes are public, including direct visits to
`/about`. Login can be added later if the project needs accounts; there are no
placeholder credentials or simulated login flows.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Use `npm run preview` to preview the production build locally.

## Docker

```bash
docker build -t web-base .
docker run --rm -p 8080:80 web-base
```

Open `http://localhost:8080`. Nginx falls back to `index.html` for client-side
routes. Configure the same fallback when using another static host.
