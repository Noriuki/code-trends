/**
 * In-memory cache with TTL for API responses.
 * Optional: Replace with Supabase or Redis for persistent/multi-instance caching.
 */

const cache = new Map<string, { data: unknown; expiresAt: number }>();

const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export const CACHE_KEYS = {
  GITHUB_TRENDING: "github-trending",
  NPM_TRENDING: "npm-trending",
  NPM_PACKAGE: (name: string) => `npm-pkg-${name}`,
} as const;

export const CACHE_TTL = {
  GITHUB: 60 * 30 * 1000,      // 30 min
  NPM: 60 * 60 * 1000,         // 1 hour
} as const;

/** Clears all in-memory cache entries (useful for tests). */
export function clearAllCaches(): void {
  cache.clear();
}
