# CodeTrends

A developer dashboard that shows **trending GitHub repositories**, **popular npm packages**, and **developer ecosystem highlights**. Built with Next.js, TypeScript, and Tailwind CSS.

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
│   ├── page.tsx              # Dashboard (SSR)
│   ├── loading.tsx           # Loading UI (streaming)
│   ├── layout.tsx            # Root layout
│   ├── globals.css
│   └── api/
│       ├── github-trending/
│       │   └── route.ts      # GET /api/github-trending
│       └── npm-trending/
│           └── route.ts     # GET /api/npm-trending
├── components/
│   ├── RepoCard.tsx          # GitHub repo card
│   ├── NpmCard.tsx           # npm package card
│   ├── StatsBar.tsx          # Summary stats
│   └── EcosystemActivity.tsx # Ecosystem section
├── lib/
│   ├── cache.ts              # In-memory cache + TTL
│   ├── github.ts             # GitHub API client
│   └── npm.ts                # npm registry + downloads API
└── types/
    └── index.ts              # Shared types
```

### Data flow

1. **SSR on the homepage**  
   `app/page.tsx` is an async Server Component. On each request (or after `revalidate`), it calls `fetchTrendingRepos()` and `fetchTrendingNpmPackages()` on the server. Data is fetched once per request and rendered to HTML, so the first paint includes content and is friendly to SEO.

2. **API routes**  
   - `GET /api/github-trending?limit=10` — Returns trending GitHub repos (uses internal cache).
   - `GET /api/npm-trending?limit=12` — Returns popular npm packages with weekly downloads (uses internal cache).

   These routes can be used by client-side code or other services; the dashboard itself uses direct server-side calls for SSR.

3. **Caching**  
   - **In-memory:** `lib/cache.ts` stores GitHub and npm responses with a TTL (e.g. 30 min for GitHub, 1 hour for npm). Reduces calls to GitHub and npm and keeps responses fast.
   - **Next.js:** `fetch(..., { next: { revalidate } })` is used where applicable for request-level caching.
   - **Optional:** You can replace the in-memory cache with Supabase (or Redis) for persistent or multi-instance caching; the interface in `lib/cache.ts` stays the same.

### SSR benefits

- **SEO** — Dashboard content is in the initial HTML, so search engines see full data.
- **Fast first load** — No client-side loading spinner for the main data; users see repos and packages immediately.
- **Stable URLs** — Same URL returns full content; shareable and cacheable by CDNs.
- **Lower client JS** — No need to ship data-fetching logic for the initial view; only interactivity (e.g. links) is hydrated.

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

Open [http://localhost:3000](http://localhost:3000). The dashboard loads with server-rendered data.

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

## Scripts

| Command       | Description                |
| ------------- | -------------------------- |
| `npm run dev` | Start dev server           |
| `npm run build` | Build for production    |
| `npm start`   | Start production server    |
| `npm run lint`| Run ESLint                 |

## License

MIT
