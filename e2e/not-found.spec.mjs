import { test, expect } from "./fixtures.mjs";

// Once Next.js has cached a not-found result, the document itself is served
// with HTTP 404, and the browser logs that. It is the expected outcome here.
test.use({ allowedConsoleErrors: [/Failed to load resource: .*status of 404/] });

const unknownUrls = [
  "/settings",
  "/explore/extra",
  "/developers",
  "/developers/nobody",
  "/developers/constructor",
  "/developers/%3Cscript%3E",
];

for (const url of unknownUrls) {
  test(`${url} shows the not-found page`, async ({ page }) => {
    await page.goto(url);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await expect(page.getByText("We couldn't find that page")).toBeVisible();
    // Search engines are told not to index it. Next.js may emit the tag twice.
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/
    );
    // The app shell stays usable around the 404 view.
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });
}

test("the 404 page links back into the app", async ({ page }) => {
  await page.goto("/developers/nobody");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");

  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Welcome back, Jordan");

  await page.goto("/settings");
  await page.getByRole("link", { name: "Explore developers" }).click();
  await expect(page).toHaveURL("/explore");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Explore");
});

test("sidebar navigation works from the 404 page", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Bookmarks" }).click();

  await expect(page).toHaveURL("/bookmarks");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bookmarks");
});
