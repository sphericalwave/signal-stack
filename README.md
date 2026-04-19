# SignalStack

Crypto investing signal dashboard. Every indicator gets z-scored to a common scale — on-chain, macro, technical, sentiment — aggregated into a composite buy/sell signal.

## Stack

- Vite + React 19
- Tailwind CSS v4
- React Router v7
- Recharts

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/signal-stack/`

## Production build

```bash
npm run build
npm run preview   # serves dist/ locally at http://localhost:4173/signal-stack/
```

Output goes to `dist/`.

## Deploy to GitHub Pages

Deployment is automatic via GitHub Actions on every push to `main`.

**One-time setup:**

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** and set it to `gh-pages` branch
3. Push to `main` — the workflow builds and deploys automatically

The workflow lives at `.github/workflows/deploy.yml`. It runs `npm ci && npm run build` then pushes `dist/` to the `gh-pages` branch using `peaceiris/actions-gh-pages`.

Live URL will be: `https://<your-username>.github.io/signal-stack/`

> If your repo is named differently, update `base` in `vite.config.js` to match.
