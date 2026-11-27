import { test, expect } from "./fixtures.mjs";

// Resolves a theme colour token (e.g. "--background") to the browser's
// computed colour string, the same format getComputedStyle returns for any
// element. Comparing raw variable text would depend on how the build
// serialises colours (oklch vs lab), so a probe element is used instead.
function themeColor(page, name) {
  return page.evaluate((variable) => {
    const probe = document.createElement("div");
    probe.style.color = `var(${variable})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, name);
}

// WCAG relative luminance (0 = black, 1 = white) of any CSS colour string.
// The browser paints the colour onto a canvas and the sRGB pixel is read
// back, so the result doesn't depend on how the colour is serialised
// (lab(), oklch(), rgb(), ...).
function luminance(page, color) {
  return page.evaluate((css) => {
    const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3), (v) => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }, color);
}

test("dark theme is on by default", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveClass(/(^|\s)dark(\s|$)/);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
    "dark"
  );
  // The page background is near-black, and text is near-white.
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const bodyText = await page.evaluate(() => getComputedStyle(document.body).color);
  expect(await luminance(page, bodyBg)).toBeLessThan(0.02);
  expect(await luminance(page, bodyText)).toBeGreaterThan(0.9);
});

test("surfaces use the theme tokens", async ({ page }) => {
  await page.goto("/");
  const [background, card] = await Promise.all([
    themeColor(page, "--background"),
    themeColor(page, "--card"),
  ]);

  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bodyBg).toBe(background);

  const postCardBg = await page
    .locator('[data-slot="card"]', { has: page.getByRole("article") })
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(postCardBg).toBe(card);
});

test("avatars show only the first letter of the first name", async ({ page }) => {
  await page.goto("/");

  // Navbar, sidebar profile card and create-post all show the current user.
  await expect(page.getByRole("button", { name: "Account menu" })).toHaveText("J");
  const feed = page.getByRole("region", { name: "Feed" });
  await expect(feed.getByRole("article").nth(0).locator('[data-slot="avatar-fallback"]')).toHaveText("P");
  await expect(feed.getByRole("article").nth(1).locator('[data-slot="avatar-fallback"]')).toHaveText("D");
  await expect(feed.getByRole("article").nth(2).locator('[data-slot="avatar-fallback"]')).toHaveText("M");

  // Every avatar on the page is a single character.
  const letters = await page.locator('[data-slot="avatar-fallback"]').allTextContents();
  expect(letters.length).toBeGreaterThan(5);
  for (const letter of letters) expect(letter).toMatch(/^[A-Z]$/);
});

test("profile and Explore avatars use the first-name letter", async ({ page }) => {
  await page.goto("/developers/dokafor");
  await expect(
    page.getByRole("main").locator('[data-slot="avatar-fallback"]').first()
  ).toHaveText("D");

  await page.goto("/explore");
  const lenaCard = page.getByRole("listitem").filter({ hasText: "Lena Fischer" }).first();
  await expect(lenaCard.locator('[data-slot="avatar-fallback"]')).toHaveText("L");
});

test("the active nav link uses the brand tokens", async ({ page }) => {
  await page.goto("/explore");
  const active = page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
    name: "Explore",
  });
  // toHaveCSS retries, so it isn't fooled by the link being re-rendered
  // during hydration.
  await expect(active).toHaveCSS("color", await themeColor(page, "--brand-soft-foreground"));
});

// Computed background of a throwaway element with the given utility classes,
// for comparing an element against what a token class should produce.
function classBackground(page, className) {
  return page.evaluate((cls) => {
    const probe = document.createElement("div");
    probe.className = cls;
    document.body.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  }, className);
}

test("inputs use their intended backgrounds, not the default input tint", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search DevConnect" });
  const composer = page.getByRole("textbox", { name: "Write a post" });

  await expect(search).toHaveCSS("background-color", await classBackground(page, "bg-muted"));
  // The composer text box is borderless and transparent, like the card behind it.
  await expect(composer).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

  // Focusing the search box switches it to the page background.
  await search.focus();
  await expect(search).toHaveCSS("background-color", await classBackground(page, "bg-background"));
});

test("avatars over a cover banner have one solid colour", async ({ page }) => {
  await page.goto("/developers/dokafor");
  // The big profile avatar overlaps the banner; its fill must be opaque so
  // the banner and the card don't show through as two different shades.
  const fill = await page
    .getByRole("main")
    .locator('[data-slot="avatar-fallback"]')
    .first()
    .evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      return ctx.getImageData(0, 0, 1, 1).data[3]; // alpha 0-255
    });
  expect(fill).toBe(255);
});

test("profile avatar is large and overlaps the banner's bottom edge", async ({ page }) => {
  await page.goto("/developers/priyacodes");
  const avatar = page.getByRole("main").locator('[data-slot="avatar"]').first();
  const banner = page.getByRole("main").locator('[data-slot="profile-banner"]');
  const [a, b] = [await avatar.boundingBox(), await banner.boundingBox()];

  // At least 96px wide (it once stayed at 40px: size="lg" outranked the class).
  expect(a.width).toBeGreaterThanOrEqual(96);
  // Its top half sits on the banner, its bottom half below it.
  const bannerBottom = b.y + b.height;
  expect(a.y).toBeLessThan(bannerBottom);
  expect(a.y + a.height).toBeGreaterThan(bannerBottom);
});

test("navbar search bar is centred", async ({ page }) => {
  await page.goto("/");
  const search = await page.getByRole("searchbox", { name: "Search DevConnect" }).boundingBox();
  const width = page.viewportSize().width;
  expect(Math.abs(search.x + search.width / 2 - width / 2)).toBeLessThanOrEqual(2);
});
