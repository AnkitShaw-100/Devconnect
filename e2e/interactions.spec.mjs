import { test, expect } from "./fixtures.mjs";

test("like button toggles the liked state and count", async ({ page }) => {
  await page.goto("/");
  const firstPost = page.getByRole("region", { name: "Feed" }).getByRole("article").first();
  const like = firstPost.getByRole("button", { name: /like post/i });

  await expect(like).toHaveAttribute("aria-pressed", "false");
  await expect(like).toHaveText("128");

  await like.click();
  await expect(like).toHaveAttribute("aria-pressed", "true");
  await expect(like).toHaveAccessibleName("Unlike post");
  await expect(like).toHaveText("129");

  await like.click();
  await expect(like).toHaveAttribute("aria-pressed", "false");
  await expect(like).toHaveText("128");
});

test("a post liked in the data starts liked and can be unliked", async ({ page }) => {
  await page.goto("/");
  const secondPost = page.getByRole("region", { name: "Feed" }).getByRole("article").nth(1);
  const like = secondPost.getByRole("button", { name: /like post/i });

  await expect(like).toHaveAttribute("aria-pressed", "true");
  await expect(like).toHaveText("342");
  await like.click();
  await expect(like).toHaveText("341");
});

test("follow button toggles between Follow and Following", async ({ page }) => {
  await page.goto("/developers/lenaf");
  // Lena also appears in the sidebar suggestions; test the profile's button.
  const main = page.getByRole("main");
  await main.getByRole("button", { name: "Follow Lena Fischer" }).click();

  const following = main.getByRole("button", { name: "Unfollow Lena Fischer" });
  await expect(following).toHaveAttribute("aria-pressed", "true");
  await expect(following).toContainText("Following");

  await following.click();
  await expect(main.getByRole("button", { name: "Follow Lena Fischer" })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
});

test("post button is disabled until the post has text", async ({ page }) => {
  await page.goto("/");
  const post = page.getByRole("button", { name: "Post", exact: true });
  await expect(post).toBeDisabled();
  await page.getByRole("textbox", { name: "Write a post" }).fill("   ");
  await expect(post).toBeDisabled(); // whitespace only
  await page.getByRole("textbox", { name: "Write a post" }).fill("Hello DevConnect");
  await expect(post).toBeEnabled();
});
