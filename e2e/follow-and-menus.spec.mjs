import { test, expect } from "./fixtures.mjs";

test("follow state is shared by every button for a developer", async ({ page }) => {
  await page.goto("/");
  const sidebar = page.getByRole("complementary", { name: "Community highlights" });
  await sidebar.getByRole("button", { name: "Follow Sofia Martins" }).click();

  // Explore card for the same developer shows Following.
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Explore" }).click();
  const card = page.getByRole("main").getByRole("listitem").filter({ hasText: "Sofia Martins" }).first();
  await expect(card.getByRole("button", { name: "Unfollow Sofia Martins" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  // Profile shows Following and one more follower (1,870 -> 1,871).
  await card.getByRole("link", { name: "Sofia Martins" }).click();
  const main = page.getByRole("main");
  await expect(main.getByRole("button", { name: "Unfollow Sofia Martins" })).toBeVisible();
  await expect(main.locator('[data-stat="Followers"] dd')).toHaveText("1,871");

  // Unfollow from the profile; the sidebar follows.
  await main.getByRole("button", { name: "Unfollow Sofia Martins" }).click();
  await expect(main.locator('[data-stat="Followers"] dd')).toHaveText("1,870");
  await expect(sidebar.getByRole("button", { name: "Follow Sofia Martins" })).toBeVisible();
});

test("following shows 'Unfollow' on hover", async ({ page }) => {
  await page.goto("/developers/lenaf");
  const main = page.getByRole("main");
  await main.getByRole("button", { name: "Follow Lena Fischer" }).click();
  const button = main.getByRole("button", { name: "Unfollow Lena Fischer" });

  await page.mouse.move(0, 0);
  await expect(button.getByText("Following")).toBeVisible();
  await button.hover();
  await expect(button.getByText("Unfollow")).toBeVisible();
  await expect(button.getByText("Following")).toBeHidden();
});

test("account menu works with the keyboard", async ({ page }) => {
  await page.goto("/explore");
  const trigger = page.getByRole("button", { name: "Account menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu).toContainText("@jordanlee");
  await expect(menu.getByRole("menuitem", { name: "Settings" })).toHaveAttribute("aria-disabled", "true");
  await expect(menu.getByRole("menuitem", { name: "Sign out" })).toHaveAttribute("aria-disabled", "true");

  // Escape closes and returns focus to the avatar button.
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();

  // Opening from the keyboard focuses the first item (ARIA menu pattern);
  // arrow keys move between items and Enter follows the link.
  await page.keyboard.press("Enter");
  await expect(menu.getByRole("menuitem", { name: "My profile" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem", { name: "Bookmarks" })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(menu.getByRole("menuitem", { name: "My profile" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/profile");
});

test("post menu opens with the keyboard and its profile link navigates", async ({ page }) => {
  await page.goto("/");
  // Mei's post is bookmarked in the data, so the menu offers to remove it.
  const trigger = page.getByRole("button", { name: "More options for Mei Lin's post" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: "Remove bookmark" })).toBeFocused();
  await page.getByRole("menuitem", { name: "View Mei's profile" }).click();
  await expect(page).toHaveURL("/developers/meilin.dev");
});
