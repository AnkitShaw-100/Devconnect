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

test("logo and navbar avatar link home and to the profile", async ({ page }) => {
  await page.goto("/explore");

  await page.getByRole("link", { name: "Your profile" }).click();
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
