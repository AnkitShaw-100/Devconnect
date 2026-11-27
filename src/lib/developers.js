// Read helpers over the dummy data. When a database arrives, these become the
// data-access layer and the components that call them stay unchanged.
import { bookmarkedPostIds } from "../data/bookmarks.js";
import { suggestedDeveloperUsernames } from "../data/community.js";
import { currentUsername } from "../data/current-user.js";
import { developers } from "../data/developers.js";
import { posts } from "../data/posts.js";

const developersByUsername = new Map(
  developers.map((developer) => [developer.username, developer])
);

export function getDeveloper(username) {
  return developersByUsername.get(username) ?? null;
}

// GitHub-style usernames: letters, digits, dot, underscore, hyphen.
const USERNAME_PATTERN = /^[a-z0-9._-]{1,39}$/i;

// Looks up the developer for a [username] route param. The param comes from
// the URL, so it is treated as untrusted: anything malformed returns null.
export function findDeveloperByParam(param) {
  if (typeof param !== "string") return null;

  let username;
  try {
    username = decodeURIComponent(param);
  } catch {
    return null;
  }

  if (!USERNAME_PATTERN.test(username)) return null;
  return getDeveloper(username);
}

export function getAllDevelopers() {
  return developers;
}

// Everyone except the signed-in user, for discovery surfaces like Explore.
export function getOtherDevelopers() {
  return developers.filter((developer) => developer.username !== currentUsername);
}

export function getSuggestedDevelopers() {
  return suggestedDeveloperUsernames.map(getDeveloper).filter(Boolean);
}

export function isCurrentUser(username) {
  return username === currentUsername;
}

// Attach the author record to each post; posts with unknown authors are dropped.
function withAuthors(list) {
  return list
    .map((post) => ({ ...post, author: getDeveloper(post.authorUsername) }))
    .filter((post) => post.author);
}

export function getFeedPosts() {
  return withAuthors(posts);
}

export function getPostsByDeveloper(username) {
  return withAuthors(posts.filter((post) => post.authorUsername === username));
}

export function getBookmarkedPosts() {
  const ids = new Set(bookmarkedPostIds);
  return withAuthors(posts.filter((post) => ids.has(post.id)));
}

export function getPopularPosts(limit = 2) {
  return withAuthors([...posts].sort((a, b) => b.likes - a.likes).slice(0, limit));
}
