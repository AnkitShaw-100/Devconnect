import { test, expect, markDocument, expectSameDocument } from "./fixtures.mjs";

const pages = [
  { path: "/", link: "Home", heading: "Welcome back, Jordan" },
  { path: "/explore", link: "Explore", heading: "Explore" },
  { path: "/bookmarks", link: "Bookmarks", heading: "Bookmarks" },
  { path: "/profile", link: "My Profile", heading: "Jordan Lee" },
];

function primaryNav(page) {
  return page.getByRole("navigation", { name: "Primary" });
}

for (const { path, link, heading } of pages) {
  test(`direct load of ${path} shows its page and active link`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(primaryNav(page).getByRole("link", { name: link })).toHaveAttribute(
      "aria-current",
      "page"
    );
    // Exactly one sidebar link is active at a time.
    await expect(primaryNav(page).locator('[aria-current="page"]')).toHaveCount(1);
  });
}

test("sidebar links navigate client-side without a page reload", async ({ page }) => {
  await page.goto("/");
  await markDocument(page);

  for (const { path, link, heading } of pages.slice(1)) {
    await primaryNav(page).getByRole("link", { name: link }).click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(primaryNav(page).getByRole("link", { name: link })).toHaveAttribute(
      "aria-current",
      "page"
    );
  }

  await expectSameDocument(page);
});

test("browser back and forward buttons move between routes", async ({ page }) => {
  await page.goto("/");
  await primaryNav(page).getByRole("link", { name: "Explore" }).click();
  await expect(page).toHaveURL("/explore");
  await primaryNav(page).getByRole("link", { name: "Bookmarks" }).click();
  await expect(page).toHaveURL("/bookmarks");

  await page.goBack();
  await expect(page).toHaveURL("/explore");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Explore");

  await page.goBack();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Welcome back, Jordan");

  await page.goForward();
  await expect(page).toHaveURL("/explore");
  await expect(primaryNav(page).getByRole("link", { name: "Explore" })).toHaveAttribute(
    "aria-current",
    "page"
  );
});

test("logo links home and the account menu links to the profile", async ({ page }) => {
  await page.goto("/explore");

  // The navbar avatar opens the account menu (Milestone 3) instead of linking directly.
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "My profile" }).click();
  await expect(page).toHaveURL("/profile");

  await page.getByRole("link", { name: "DevConnect home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Welcome back, Jordan");
});

test("home feed shows the create-post card and three posts", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("textbox", { name: "Write a post" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Feed" }).getByRole("article")).toHaveCount(3);
});

test("bookmarks page lists the saved posts", async ({ page }) => {
  await page.goto("/bookmarks");
  const saved = page.getByRole("region", { name: "Bookmarked posts" }).getByRole("article");
  await expect(saved).toHaveCount(2);
  await expect(saved.first()).toContainText("Daniel Okafor");
});

test("navigating after scrolling shows the new page from the top", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/");
  // Scroll to the bottom; any offset past ~120px puts the next page's heading
  // (which starts ~80px down) out of view, which is what this test needs.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);

  await primaryNav(page).getByRole("link", { name: "Explore" }).click();
  await expect(page).toHaveURL("/explore");

  // The heading must be in view and not hidden behind the sticky navbar.
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("Explore");
  await expect(heading).toBeInViewport();
  // Polled, because Next.js applies the scroll just after the new page renders.
  await expect
    .poll(() =>
      page.evaluate(() => {
        const header = document.querySelector("header").getBoundingClientRect();
        const h1 = document.querySelector("h1").getBoundingClientRect();
        return h1.top - header.bottom;
      })
    )
    .toBeGreaterThanOrEqual(0);
});

test("the layout keeps its state across navigations", async ({ page }) => {
  await page.goto("/");
  const suggestions = page.getByRole("complementary", { name: "Community highlights" });
  await suggestions.getByRole("button", { name: "Follow Sofia Martins" }).click();
  await expect(
    suggestions.getByRole("button", { name: "Unfollow Sofia Martins" })
  ).toBeVisible();

  // The sidebar lives in the root layout, which isn't re-rendered on navigation.
  await primaryNav(page).getByRole("link", { name: "Bookmarks" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bookmarks");
  await expect(
    suggestions.getByRole("button", { name: "Unfollow Sofia Martins" })
  ).toBeVisible();
});
