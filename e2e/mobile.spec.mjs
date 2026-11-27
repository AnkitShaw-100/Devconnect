import { test, expect, markDocument, expectSameDocument } from "./fixtures.mjs";

test("sidebars are hidden and the menu button is shown", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
  await expect(page.getByRole("complementary", { name: "Community highlights" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
});

test("mobile menu navigates and closes itself", async ({ page }) => {
  await page.goto("/");
  await markDocument(page);

  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Home" })
  ).toHaveAttribute("aria-current", "page");

  await menu.getByRole("link", { name: "Bookmarks" }).click();

  await expect(page).toHaveURL("/bookmarks");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bookmarks");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expectSameDocument(page);

  // Reopening shows the new active page.
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(
    page.getByRole("dialog").getByRole("link", { name: "Bookmarks" })
  ).toHaveAttribute("aria-current", "page");
});

test("profile pages fit the mobile viewport", async ({ page }) => {
  await page.goto("/developers/priyacodes");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Priya Raman");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
