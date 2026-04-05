import { test, expect } from "@playwright/test";

test.describe("CodeTrends dashboard", () => {
  test("loads home page with title and main sections", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBeTruthy();

    await expect(page).toHaveTitle(/CodeTrends/i);
    await expect(page.getByRole("heading", { name: "CodeTrends", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Trending Repositories" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Top npm packages" })).toBeVisible();
  });

  test("footer documents data sources", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: /API de pesquisa do GitHub/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /registro público npm/i })).toBeVisible();
    await expect(footer.getByText("CodeTrends")).toBeVisible();
  });

  test("header has refresh and theme controls", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Atualizar dados/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Tema/i })).toBeVisible();
  });

  test("either shows repo cards or empty-state for GitHub section", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section").filter({ hasText: "Trending Repositories" });
    const hasCards = await section.locator("a[href*='github.com']").first().isVisible().catch(() => false);
    const hasEmpty = await section.getByText(/Nenhum repositório carregado/i).isVisible().catch(() => false);
    expect(hasCards || hasEmpty).toBe(true);
  });

  test("either shows npm cards or empty-state for npm section", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section").filter({ hasText: "Top npm packages" });
    const hasCards = await section.locator("a[href*='npmjs.com']").first().isVisible().catch(() => false);
    const hasEmpty = await section.getByText(/Nenhum pacote carregado/i).isVisible().catch(() => false);
    expect(hasCards || hasEmpty).toBe(true);
  });

  test("API github-trending returns JSON", async ({ request }) => {
    const res = await request.get("/api/github-trending?limit=2");
    expect([200, 500]).toContain(res.status());
    const json = await res.json();
    if (res.status() === 200) {
      expect(Array.isArray(json.repos)).toBe(true);
    } else {
      expect(typeof json.error).toBe("string");
    }
  });

  test("API npm-trending returns JSON", async ({ request }) => {
    const res = await request.get("/api/npm-trending?limit=2");
    expect([200, 500]).toContain(res.status());
    const json = await res.json();
    if (res.status() === 200) {
      expect(Array.isArray(json.packages)).toBe(true);
    } else {
      expect(typeof json.error).toBe("string");
    }
  });
});
