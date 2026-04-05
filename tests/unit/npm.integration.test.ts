import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { clearAllCaches } from "@/lib/cache";

/** Deterministic download count from package name for stable sort tests */
function downloadsForName(name: string): number {
  const weights: Record<string, number> = {
    react: 5_000_000,
    vue: 4_000_000,
    express: 3_000_000,
    lodash: 2_000_000,
    axios: 1_000_000,
  };
  return weights[name] ?? 100_000 + name.length * 1000;
}

describe("fetchTrendingNpmPackages (npm integration)", () => {
  beforeEach(() => {
    clearAllCaches();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

        if (url.includes("api.npmjs.org/downloads/point/last-week/")) {
          const name = decodeURIComponent(url.split("/").pop() ?? "");
          return new Response(
            JSON.stringify({
              downloads: downloadsForName(name),
              package: name,
              start: "",
              end: "",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        if (url.includes("registry.npmjs.org/")) {
          const segments = url.replace(/\/$/, "").split("/");
          const name = decodeURIComponent(segments[segments.length - 1] ?? "");
          return new Response(
            JSON.stringify({
              name,
              description: `${name} library`,
              "dist-tags": { latest: "2.0.0" },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response("not found", { status: 404 });
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    clearAllCaches();
  });

  it("fetches registry and downloads endpoints", async () => {
    const { fetchTrendingNpmPackages } = await import("@/lib/npm");
    const packages = await fetchTrendingNpmPackages(4);

    expect(packages.length).toBeGreaterThan(0);
    expect(packages.length).toBeLessThanOrEqual(4);
    const calls = vi.mocked(globalThis.fetch).mock.calls.map((c) => String(c[0]));
    expect(calls.some((u) => u.includes("registry.npmjs.org"))).toBe(true);
    expect(calls.some((u) => u.includes("api.npmjs.org/downloads"))).toBe(true);
  });

  it("sorts packages by weekly downloads descending", async () => {
    const { fetchTrendingNpmPackages } = await import("@/lib/npm");
    const packages = await fetchTrendingNpmPackages(8);
    for (let i = 1; i < packages.length; i++) {
      expect(packages[i - 1].weeklyDownloads).toBeGreaterThanOrEqual(packages[i].weeklyDownloads);
    }
    expect(packages[0].name).toBe("react");
  });

  it("returns cached list without refetching", async () => {
    const { fetchTrendingNpmPackages } = await import("@/lib/npm");
    await fetchTrendingNpmPackages(6);
    const callsAfterFirst = vi.mocked(globalThis.fetch).mock.calls.length;
    await fetchTrendingNpmPackages(6);
    expect(vi.mocked(globalThis.fetch).mock.calls.length).toBe(callsAfterFirst);
  });
});
