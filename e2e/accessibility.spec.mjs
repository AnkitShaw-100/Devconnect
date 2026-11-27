import { test, expect } from "./fixtures.mjs";

const feed = (page) => page.getByRole("region", { name: "Feed" });
const announcer = (page) => page.locator("[data-announcer]");

test("the first Tab reaches a skip link that jumps to the main content", async ({ page }) => {
  await page.goto("/explore");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible(); // visible while focused, hidden otherwise

  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  // The next Tab continues inside the main content, past the navbar and sidebar.
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.querySelector("main").contains(document.activeElement))).toBe(true);
});

test("deleting your own post keeps keyboard focus on the page and announces it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Write a post" }).fill("Short-lived post");
  await page.getByRole("button", { name: "Post", exact: true }).click();

  const trigger = page.getByRole("button", { name: "More options for Jordan Lee's post" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("menuitem", { name: "Delete post" }).press("Enter");
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete post" }).press("Enter");

  await expect(feed(page).getByRole("article", { name: "Post by Jordan Lee" })).toHaveCount(0);
  await expect(page.getByRole("main")).toBeFocused();
  await expect(announcer(page)).toHaveText("Post deleted.");
});

test("removing a bookmark on the Bookmarks page doesn't lose focus", async ({ page }) => {
  await page.goto("/bookmarks");
  const saved = page.getByRole("region", { name: "Bookmarked posts" });
  await expect(saved.getByRole("article")).toHaveCount(2);

  const remove = saved.getByRole("button", { name: "Remove bookmark" }).first();
  await remove.focus();
  await page.keyboard.press("Enter");

  await expect(saved.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("main")).toBeFocused();
  await expect(announcer(page)).toHaveText("Removed from bookmarks.");
});

test("menu items show a visible outline when focused with the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Account menu" }).focus();
  await page.keyboard.press("Enter");
  const item = page.getByRole("menuitem", { name: "My profile" });
  await expect(item).toBeFocused();
  await expect(item).toHaveCSS("outline-style", "solid");
  await expect(item).toHaveCSS("outline-width", "2px");
});

test("empty states offer a next step", async ({ page }) => {
  await page.goto("/profile");
  await page.getByRole("link", { name: "Write a post" }).click();
  await expect(page).toHaveURL("/");

  await page.goto("/bookmarks");
  const saved = page.getByRole("region", { name: "Bookmarked posts" });
  for (let i = 0; i < 2; i += 1) {
    await saved.getByRole("button", { name: "Remove bookmark" }).first().click();
  }
  await expect(page.getByText("No bookmarks yet")).toBeVisible();
  await page.getByRole("link", { name: "Explore posts" }).click();
  await expect(page).toHaveURL("/explore");
});

test("every button and link has an accessible name", async ({ page }) => {
  for (const url of ["/", "/explore", "/profile", "/developers/priyacodes"]) {
    await page.goto(url);
    const unnamed = await page.evaluate(() =>
      [...document.querySelectorAll("a[href], button")]
        .filter((el) => el.offsetParent !== null) // rendered
        .filter((el) => !el.closest("[aria-hidden='true']"))
        .filter((el) => {
          const label = el.getAttribute("aria-label") || el.textContent || el.title;
          return !label.trim();
        })
        .map((el) => el.outerHTML.slice(0, 80))
    );
    expect(unnamed, `unnamed controls on ${url}`).toEqual([]);
  }
});
