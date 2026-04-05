# CodeTrends

Web dashboard that aggregates **GitHub repository trends** and **popular npm packages** (weekly downloads), with a short ecosystem summary. Implemented with Next.js (App Router), TypeScript, and Tailwind CSS against the public GitHub Search API and npm registry.

## Features

- **Trending GitHub repositories** — Top repos created in the last 30 days, sorted by stars (via GitHub Search API).
- **Top NPM packages** — Popular packages with weekly download stats from the npm registry.
- **Developer ecosystem activity** — Aggregated stats and highlights (total stars, downloads, top repo/package).
- **Cached API responses** — In-memory cache with TTL to reduce external API calls; optional Supabase for persistent caching.

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js (App Router)                |
| Language     | TypeScript                          |
| Styling      | Tailwind CSS                        |
| Data         | Server-Side Rendering (SSR) + API Routes |
| Caching      | In-memory (optional: Supabase)      |

## Architecture

### Directory structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard shell + Suspense boundaries
│   ├── actions.ts            # Server Actions (revalidateTag + clear cache)
│   ├── _components/          # Async Server Components per section
│   ├── loading.tsx           # Route-level loading UI
│   ├── layout.tsx
│   ├── globals.css
│   └── api/…                 # Route handlers
├── middleware.ts             # Security headers
├── components/…
├── lib/
│   ├── server-data.ts        # unstable_cache + cache tags
│   ├── cache-tags.ts
│   ├── cache.ts
│   ├── github.ts
│   └── npm.ts
└── types/
```

### Data flow

1. **Streaming + Suspense**  
   `app/page.tsx` is a synchronous Server Component that wraps **stats**, **GitHub**, **npm**, and **ecosystem** in separate `<Suspense>` boundaries. Each async child loads independently so skeletons can appear while slow APIs resolve.

2. **Tagged Data Cache**  
   `lib/server-data.ts` wraps fetches with `unstable_cache` and tags (`github-trending`, `npm-trending`). The **Atualizar** button runs the Server Action `refreshTrendingData()`, which calls `revalidateTag` for those tags and clears the in-memory `lib/cache` map, then `router.refresh()` refetches RSC payloads.

3. **API routes**  
   `GET /api/github-trending` and `GET /api/npm-trending` still use the same lib functions (in-memory cache + `fetch` revalidate). They are optional for clients or tooling; the dashboard page uses `server-data` + Suspense.

4. **Caching layers**  
   - **Next Data Cache:** `unstable_cache` with `revalidate` + tags.  
   - **In-memory:** `lib/cache.ts` TTL (cleared on manual refresh).  
   - **fetch:** `next: { revalidate }` on outbound GitHub/npm requests where used.

5. **Middleware**  
   Adds baseline security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) on matching routes.

### Rendering

Main content is built on the server (RSC + Suspense streaming): meaningful HTML early, less client JS for the first paint, stable URLs for sharing the same address.

## API integration

### GitHub

- **Endpoint:** [GitHub Search API](https://docs.github.com/en/rest/search/search#search-repositories) — `GET /search/repositories`.
- **Strategy:** GitHub does not expose an official “trending” endpoint. We approximate it with a query like `created:>YYYY-MM-DD stars:>100`, sorted by `stars` and `order=desc`, where the date is 30 days ago. Optional: set `GITHUB_TOKEN` in env for higher rate limits.
- **Usage:** `lib/github.ts` builds the query, fetches, and caches; `app/api/github-trending/route.ts` exposes the result as JSON.

### npm

- **Endpoints:**
  - [npm registry](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md) — `GET https://registry.npmjs.org/<package>` for package metadata.
  - [npm download counts](https://github.com/npm/registry/blob/main/docs/download-counts.md) — `GET https://api.npmjs.org/downloads/point/last-week/<package>` for weekly downloads.
- **Strategy:** A curated list of popular package names is used; for each we fetch metadata and weekly downloads, then sort by downloads and return the top N. Results are cached in memory.
- **Usage:** `lib/npm.ts` fetches and caches; `app/api/npm-trending/route.ts` returns the list as JSON.

## Getting started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Data is fetched on the server when the page renders.

### Optional: GitHub token

For higher GitHub API rate limits, add a Personal Access Token:

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxx
```

Restart the dev server after adding `.env.local`.

### Build and start

```bash
npm run build
npm start
```

## Testing

- **Unit / integration (Vitest)** — Mocks `fetch` to verify GitHub and npm client logic, cache behavior, and API route handlers (`tests/unit/`).
- **E2E (Playwright)** — Starts `next dev`, checks dashboard sections, footer, header controls, and that API routes return JSON (200 or 500 with `error`).

```bash
npm test                 # Vitest (once)
npm run test:watch       # Vitest watch mode
npx playwright install chromium   # first time only
npm run test:e2e         # Playwright (needs network for live APIs)
```

E2E is resilient: if GitHub/npm are unreachable, the UI still shows empty states and API tests accept `500` with an error message.

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start dev server                     |
| `npm run build`    | Build for production                 |
| `npm start`        | Start production server              |
| `npm run lint`     | Run ESLint                           |
| `npm test`         | Run Vitest (integration + API tests) |
| `npm run test:watch` | Vitest in watch mode               |
| `npm run test:e2e` | Playwright E2E tests                 |

## License

MIT
