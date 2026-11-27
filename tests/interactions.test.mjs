import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  interactionsReducer as reduce,
  selectBookmarkCount,
  selectComments,
  selectIsBookmarked,
  selectIsFollowing,
  selectLike,
} from "../src/lib/interactions.js";

const initial = () => createInitialState({ bookmarkedPostIds: ["post-2"] });

test("initial bookmarks come from the data", () => {
  const state = initial();
  assert.equal(selectIsBookmarked(state, "post-2"), true);
  assert.equal(selectIsBookmarked(state, "post-1"), false);
  assert.equal(selectBookmarkCount(state), 1);
});

test("likes fall back to the post's own values until toggled", () => {
  let state = initial();
  assert.deepEqual(selectLike(state, "post-1", false, 128), { liked: false, count: 128 });

  state = reduce(state, { type: "toggleLike", postId: "post-1", initialLiked: false, initialCount: 128 });
  assert.deepEqual(selectLike(state, "post-1", false, 128), { liked: true, count: 129 });

  state = reduce(state, { type: "toggleLike", postId: "post-1", initialLiked: false, initialCount: 128 });
  assert.deepEqual(selectLike(state, "post-1", false, 128), { liked: false, count: 128 });
});

test("unliking a post liked in the data lowers its count, never below 0", () => {
  let state = reduce(initial(), { type: "toggleLike", postId: "p", initialLiked: true, initialCount: 0 });
  assert.deepEqual(selectLike(state, "p", true, 0), { liked: false, count: 0 });
});

test("follow toggles per username", () => {
  let state = reduce(initial(), { type: "toggleFollow", username: "lenaf" });
  assert.equal(selectIsFollowing(state, "lenaf"), true);
  assert.equal(selectIsFollowing(state, "dokafor"), false);
  state = reduce(state, { type: "toggleFollow", username: "lenaf" });
  assert.equal(selectIsFollowing(state, "lenaf"), false);
});

test("bookmarks toggle", () => {
  let state = reduce(initial(), { type: "toggleBookmark", postId: "post-2" });
  assert.equal(selectIsBookmarked(state, "post-2"), false);
  state = reduce(state, { type: "toggleBookmark", postId: "post-1" });
  assert.equal(selectIsBookmarked(state, "post-1"), true);
  assert.equal(selectBookmarkCount(state), 1);
});

test("added comments come after the post's own comments", () => {
  const own = [{ id: "c-1" }];
  let state = reduce(initial(), { type: "addComment", postId: "post-1", comment: { id: "new-1" } });
  state = reduce(state, { type: "addComment", postId: "post-1", comment: { id: "new-2" } });
  assert.deepEqual(selectComments(state, "post-1", own).map((c) => c.id), ["c-1", "new-1", "new-2"]);
  assert.deepEqual(selectComments(state, "post-3", own), own);
});

test("created posts go first and can be deleted with their likes, bookmarks and comments", () => {
  let state = reduce(initial(), { type: "createPost", post: { id: "mine-1" } });
  state = reduce(state, { type: "createPost", post: { id: "mine-2" } });
  assert.deepEqual(state.createdPosts.map((p) => p.id), ["mine-2", "mine-1"]);

  state = reduce(state, { type: "toggleLike", postId: "mine-1", initialLiked: false, initialCount: 0 });
  state = reduce(state, { type: "toggleBookmark", postId: "mine-1" });
  state = reduce(state, { type: "addComment", postId: "mine-1", comment: { id: "c" } });
  state = reduce(state, { type: "deletePost", postId: "mine-1" });

  assert.deepEqual(state.createdPosts.map((p) => p.id), ["mine-2"]);
  assert.equal(state.likes["mine-1"], undefined);
  assert.equal(state.bookmarks["mine-1"], undefined);
  assert.equal(state.comments["mine-1"], undefined);
});

test("posts from the data can't be deleted", () => {
  const state = initial();
  assert.equal(reduce(state, { type: "deletePost", postId: "post-2" }), state);
});

test("unknown actions leave the state unchanged", () => {
  const state = initial();
  assert.equal(reduce(state, { type: "nope" }), state);
});
