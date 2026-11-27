import { test, expect, markDocument, expectSameDocument } from "./fixtures.mjs";

const feed = (page) => page.getByRole("region", { name: "Feed" });
const nav = (page) => page.getByRole("navigation", { name: "Primary" });
const postBy = (scope, name) => scope.getByRole("article", { name: `Post by ${name}` });

async function writePost(page, content, tags = "") {
  await page.getByRole("textbox", { name: "Write a post" }).fill(content);
  if (tags) {
    await page.getByRole("button", { name: "Add tags" }).click();
    await page.getByRole("textbox", { name: "Tags" }).fill(tags);
  }
  await page.getByRole("button", { name: "Post", exact: true }).click();
}

test.describe("create post", () => {
  test("a new post appears first, clears the form and survives navigation", async ({ page }) => {
    await page.goto("/");
    await markDocument(page);
    await writePost(page, "Learning Server Components today", "React, Next.js");

    const mine = postBy(feed(page), "Jordan Lee");
    await expect(feed(page).getByRole("article").first()).toHaveAccessibleName("Post by Jordan Lee");
    await expect(mine).toContainText("Learning Server Components today");
    await expect(mine).toContainText("#React");
    await expect(mine).toContainText("Just now");
    await expect(page.getByRole("textbox", { name: "Write a post" })).toHaveValue("");
    await expect(page.getByRole("status").filter({ hasText: "Your post is live" })).toBeAttached();

    // Own profile shows it and counts it; it's still in the feed afterwards.
    await nav(page).getByRole("link", { name: "My Profile" }).click();
    await expect(postBy(page.getByRole("main"), "Jordan Lee")).toContainText("Learning Server Components");
    await expect(page.getByText("No posts yet")).toHaveCount(0);
    await expect(page.getByRole("main").locator('[data-stat="Posts"] dd')).toHaveText("1");
    await nav(page).getByRole("link", { name: "Home" }).click();
    await expect(postBy(feed(page), "Jordan Lee")).toBeVisible();
    await expectSameDocument(page);
  });

  test("shows validation errors next to the fields", async ({ page }) => {
    await page.goto("/");
    const content = page.getByRole("textbox", { name: "Write a post" });

    await writePost(page, "Valid text", "good, <bad>");
    const tags = page.getByRole("textbox", { name: "Tags" });
    await expect(tags).toHaveAttribute("aria-invalid", "true");
    const form = page.getByRole("form", { name: "Create a post" });
    await expect(form.getByRole("alert")).toContainText(`"<bad>" isn't a valid tag`);
    await expect(feed(page).getByRole("article")).toHaveCount(3); // nothing posted

    await content.fill("x".repeat(501));
    await expect(page.getByText("501/500")).toBeVisible();
    await expect(content).toHaveAttribute("aria-invalid", "true");
  });

  test("Ctrl+Enter submits", async ({ page }) => {
    await page.goto("/");
    const content = page.getByRole("textbox", { name: "Write a post" });
    await content.fill("Posted from the keyboard");
    await content.press("Control+Enter");
    await expect(postBy(feed(page), "Jordan Lee")).toContainText("Posted from the keyboard");
  });

  test("own posts can be deleted after confirming", async ({ page }) => {
    await page.goto("/");
    await writePost(page, "Temporary post");
    const mine = postBy(feed(page), "Jordan Lee");
    const menuButton = page.getByRole("button", { name: "More options for Jordan Lee's post" });

    // Cancel keeps it.
    await menuButton.click();
    await page.getByRole("menuitem", { name: "Delete post" }).click();
    const confirm = page.getByRole("alertdialog", { name: "Delete this post?" });
    await expect(confirm).toBeVisible();
    await confirm.getByRole("button", { name: "Cancel" }).click();
    await expect(mine).toBeVisible();

    await menuButton.click();
    await page.getByRole("menuitem", { name: "Delete post" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Delete post" }).click();
    await expect(mine).toHaveCount(0);
  });

  test("posts by others offer Report instead of Delete", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "More options for Priya Raman's post" }).click();
    await expect(page.getByRole("menuitem", { name: "Report post" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Delete post" })).toHaveCount(0);
  });
});

test.describe("comments", () => {
  test("open, read and add a comment; the count follows everywhere", async ({ page }) => {
    await page.goto("/");
    const priya = postBy(feed(page), "Priya Raman");
    const toggle = priya.getByRole("button", { name: "Show comments (3)" });

    await toggle.click();
    const comments = priya.getByRole("region", { name: "Comments" });
    await expect(comments.getByRole("listitem")).toHaveCount(3);
    await expect(priya.getByRole("button", { name: "Hide comments (3)" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    // The comment box is focused on open; submit is disabled while empty.
    const box = comments.getByRole("textbox", { name: "Write a comment" });
    await expect(box).toBeFocused();
    await expect(comments.getByRole("button", { name: "Comment" })).toBeDisabled();

    await box.fill("Great write-up!");
    await box.press("Control+Enter");
    await expect(comments.getByRole("listitem")).toHaveCount(4);
    await expect(comments.getByRole("listitem").last()).toContainText("Jordan Lee");
    await expect(comments.getByRole("listitem").last()).toContainText("Great write-up!");
    await expect(box).toHaveValue("");
    await expect(priya.getByRole("button", { name: "Hide comments (4)" })).toBeVisible();

    // Same post on Explore shows the new count.
    await nav(page).getByRole("link", { name: "Explore" }).click();
    const onExplore = postBy(page.getByRole("main"), "Priya Raman");
    await expect(onExplore.getByRole("button", { name: "Show comments (4)" })).toBeVisible();
  });

  test("too-long comments are rejected", async ({ page }) => {
    await page.goto("/");
    const mei = postBy(feed(page), "Mei Lin");
    await mei.getByRole("button", { name: /Show comments/ }).click();
    const comments = mei.getByRole("region", { name: "Comments" });
    await comments.getByRole("textbox", { name: "Write a comment" }).fill("c".repeat(301));
    await expect(comments.getByText("301/300")).toBeVisible();
    await comments.getByRole("button", { name: "Comment" }).click();
    await expect(comments.getByRole("alert")).toHaveText("Comments can be at most 300 characters.");
    await expect(comments.getByRole("listitem")).toHaveCount(1);
  });
});

test.describe("shared state", () => {
  test("likes are the same on every page", async ({ page }) => {
    await page.goto("/");
    await postBy(feed(page), "Priya Raman").getByRole("button", { name: "Like post" }).click();

    await nav(page).getByRole("link", { name: "Explore" }).click();
    const like = postBy(page.getByRole("main"), "Priya Raman").getByRole("button", { name: /like post/i });
    await expect(like).toHaveAttribute("aria-pressed", "true");
    await expect(like).toHaveText("129");
  });

  test("bookmarks page follows bookmarks made anywhere", async ({ page }) => {
    await page.goto("/");
    await postBy(feed(page), "Priya Raman").getByRole("button", { name: "Bookmark post" }).click();

    await nav(page).getByRole("link", { name: "Bookmarks" }).click();
    const saved = page.getByRole("region", { name: "Bookmarked posts" });
    await expect(saved.getByRole("article")).toHaveCount(3);

    // Remove all three (one through the menu); the empty state appears.
    await page.getByRole("button", { name: "More options for Daniel Okafor's post" }).click();
    await page.getByRole("menuitem", { name: "Remove bookmark" }).click();
    await expect(saved.getByRole("article")).toHaveCount(2);
    await saved.getByRole("button", { name: "Remove bookmark" }).first().click();
    await saved.getByRole("button", { name: "Remove bookmark" }).first().click();
    await expect(page.getByText("No bookmarks yet")).toBeVisible();
  });
});

test.describe("dialogs", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("share dialog shows and copies the post link", async ({ page }) => {
    await page.goto("/");
    const share = postBy(feed(page), "Priya Raman").getByRole("button", { name: "Share" });
    await share.click();

    const dialog = page.getByRole("dialog", { name: "Share post" });
    await expect(dialog).toBeVisible();
    const link = dialog.getByRole("textbox", { name: "Post link" });
    await expect(link).toHaveValue(/\/developers\/priyacodes#post-1$/);

    await dialog.getByRole("button", { name: "Copy" }).click();
    await expect(dialog.getByRole("status")).toHaveText("Link copied to your clipboard.");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/#post-1$/);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(share).toBeFocused();
  });

  test("report form validates, confirms and returns focus to the menu", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "More options for Daniel Okafor's post" });
    await menuButton.click();
    await page.getByRole("menuitem", { name: "Report post" }).click();

    const dialog = page.getByRole("dialog", { name: "Report post" });
    await dialog.getByRole("button", { name: "Send report" }).click();
    await expect(dialog.getByRole("alert")).toHaveText("Choose a reason.");

    await dialog.getByRole("radio", { name: "Something else" }).check();
    await dialog.getByRole("button", { name: "Send report" }).click();
    await expect(dialog.getByRole("alert")).toHaveText("Tell us what's wrong.");

    await dialog.getByRole("radio", { name: "Spam or self-promotion" }).check();
    await dialog.getByRole("button", { name: "Send report" }).click();
    await expect(dialog.getByRole("status")).toContainText("We'll review this post by Daniel Okafor");

    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toBeHidden();
    await expect(menuButton).toBeFocused();
  });
});

test("composer: tags open from the toolbar, focus shows on the card", async ({ page }) => {
  await page.goto("/");
  const form = page.getByRole("form", { name: "Create a post" });
  await expect(form.getByRole("textbox", { name: "Tags" })).toHaveCount(0);

  await form.getByRole("button", { name: "Add tags" }).click();
  const tags = form.getByRole("textbox", { name: "Tags" });
  await expect(tags).toBeFocused();
  await expect(form.getByRole("button", { name: "Hide tags" })).toHaveAttribute("aria-expanded", "true");

  // Hiding clears what was typed.
  await tags.fill("rust");
  await form.getByRole("button", { name: "Hide tags" }).click();
  await expect(form.getByRole("textbox", { name: "Tags" })).toHaveCount(0);

  // The borderless text box has no ring of its own; the card shows focus.
  await form.getByRole("textbox", { name: "Write a post" }).focus();
  const card = page.locator('[data-slot="card"]', { has: form });
  const ring = await card.evaluate((el) => getComputedStyle(el).getPropertyValue("--tw-ring-color"));
  expect(ring.trim()).not.toBe("");
  await expect(form.getByText(/\/500/)).toHaveClass(/sr-only/); // counter hidden until typing
  await form.getByRole("textbox", { name: "Write a post" }).fill("hi");
  await expect(form.getByText("2/500")).toBeVisible();
});
