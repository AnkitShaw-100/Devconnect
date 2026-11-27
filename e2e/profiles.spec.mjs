import { test, expect, markDocument, expectSameDocument } from "./fixtures.mjs";

test("clicking a post author opens their profile", async ({ page }) => {
  await page.goto("/");
  await markDocument(page);

  await page.getByRole("region", { name: "Feed" }).getByRole("link", { name: "Priya Raman" }).click();

  await expect(page).toHaveURL("/developers/priyacodes");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Priya Raman");
  await expect(page.getByText("@priyacodes · Frontend engineer at Lumen").first()).toBeVisible();
  await expectSameDocument(page);
});

test("developer cards on Explore link to profiles", async ({ page }) => {
  await page.goto("/explore");
  await page.getByRole("link", { name: "Lena Fischer" }).first().click();

  await expect(page).toHaveURL("/developers/lenaf");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lena Fischer");
});

test("suggested developers in the right sidebar link to profiles", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("complementary", { name: "Community highlights" })
    .getByRole("link", { name: "Arjun Mehta" })
    .click();

  await expect(page).toHaveURL("/developers/arjunml");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Arjun Mehta");
});

test("usernames with dots load directly", async ({ page }) => {
  await page.goto("/developers/meilin.dev");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mei Lin");
  await expect(page.getByRole("article")).toHaveCount(1);
});

test("another developer's profile shows Follow, skills and posts", async ({ page }) => {
  await page.goto("/developers/dokafor");

  await expect(page.getByRole("button", { name: "Follow Daniel Okafor" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit profile" })).toHaveCount(0);
  await expect(page.getByText("#Go", { exact: true })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(1);
  // Viewing someone else's profile highlights no sidebar link.
  await expect(
    page.getByRole("navigation", { name: "Primary" }).locator('[aria-current="page"]')
  ).toHaveCount(0);
});

test("own profile shows a disabled Edit profile button", async ({ page }) => {
  await page.goto("/profile");
  const main = page.getByRole("main");
  await expect(main.getByRole("button", { name: "Edit profile" })).toBeDisabled();
  // Follow buttons in the sidebar are fine; the profile itself has none.
  await expect(main.getByRole("button", { name: /^Follow / })).toHaveCount(0);
});

test("a developer without posts shows the empty state", async ({ page }) => {
  await page.goto("/developers/sofiabuilds");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sofia Martins");
  await expect(page.getByText("No posts yet")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("URL-encoded usernames load the same profile", async ({ page }) => {
  await page.goto("/developers/meilin%2Edev");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mei Lin");
});
