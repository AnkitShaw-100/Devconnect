import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAllDevelopers,
  getBookmarkedPosts,
  getCommentsForPost,
  getDeveloper,
  getFeedPosts,
  getOtherDevelopers,
  getPopularPosts,
  getPostsByDeveloper,
  getSuggestedDevelopers,
  isCurrentUser,
} from "../src/lib/developers.js";
import { currentUser, currentUsername } from "../src/data/current-user.js";
import { commentsByPostId } from "../src/data/comments.js";

test("developer usernames are unique", () => {
  const usernames = getAllDevelopers().map((developer) => developer.username);
  assert.equal(new Set(usernames).size, usernames.length);
});

test("getDeveloper finds known developers and returns null otherwise", () => {
  assert.equal(getDeveloper("dokafor")?.name, "Daniel Okafor");
  assert.equal(getDeveloper("nobody"), null);
  assert.equal(getDeveloper(undefined), null);
});

test("the current user is a real developer", () => {
  assert.ok(currentUser);
  assert.equal(currentUser.username, currentUsername);
  assert.ok(isCurrentUser(currentUsername));
  assert.ok(!isCurrentUser("priyacodes"));
});

test("discovery lists exclude the current user", () => {
  const others = getOtherDevelopers().map((developer) => developer.username);
  assert.ok(!others.includes(currentUsername));
  assert.equal(others.length, getAllDevelopers().length - 1);

  const suggested = getSuggestedDevelopers();
  assert.ok(suggested.length > 0);
  assert.ok(suggested.every((developer) => developer.username !== currentUsername));
});

test("every feed post has its author attached", () => {
  const posts = getFeedPosts();
  assert.equal(posts.length, 3);
  for (const post of posts) {
    assert.equal(post.author.username, post.authorUsername);
  }
});

test("posts by developer", () => {
  const posts = getPostsByDeveloper("priyacodes");
  assert.deepEqual(posts.map((post) => post.id), ["post-1"]);
  assert.deepEqual(getPostsByDeveloper("sofiabuilds"), []); // empty state
  assert.deepEqual(getPostsByDeveloper("nobody"), []);
});

test("bookmarked posts", () => {
  assert.deepEqual(getBookmarkedPosts().map((post) => post.id), ["post-2", "post-3"]);
});

test("popular posts are sorted by likes and limited", () => {
  const popular = getPopularPosts(2);
  assert.equal(popular.length, 2);
  assert.ok(popular[0].likes >= popular[1].likes);
  assert.equal(popular[0].id, "post-2");
});

test("feed posts carry their comments, with authors, oldest first", () => {
  const [first] = getFeedPosts();
  assert.equal(first.id, "post-1");
  assert.ok(first.comments.length > 0);
  for (const comment of first.comments) {
    assert.ok(comment.author, `${comment.id} has no author`);
    assert.equal(comment.author.username, comment.authorUsername);
  }
});

test("comments data only references known posts and developers", () => {
  for (const [postId, comments] of Object.entries(commentsByPostId)) {
    assert.ok(getFeedPosts().some((post) => post.id === postId), `unknown post ${postId}`);
    for (const comment of comments) {
      assert.ok(getDeveloper(comment.authorUsername), `unknown author in ${comment.id}`);
    }
  }
  assert.deepEqual(getCommentsForPost("no-such-post"), []);
});
