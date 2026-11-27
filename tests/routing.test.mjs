import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { findDeveloperByParam, getAllDevelopers } from "../src/lib/developers.js";
import { isActivePath, paths } from "../src/lib/paths.js";

const appDir = fileURLToPath(new URL("../src/app/", import.meta.url));
const pageFileFor = (url) => `${appDir}${url === "/" ? "" : url.slice(1) + "/"}page.js`;

// With file-based routing, a URL exists when its folder has a page.js.
test("every static path has a page file", () => {
  for (const url of [paths.home, paths.explore, paths.bookmarks, paths.profile]) {
    assert.ok(existsSync(pageFileFor(url)), `missing page for ${url}`);
  }
  assert.ok(existsSync(`${appDir}developers/[username]/page.js`), "missing developer page");
});

test("unknown static paths have no page file", () => {
  for (const url of ["/settings", "/developers"]) {
    assert.ok(!existsSync(pageFileFor(url)), `${url} should not exist`);
  }
});

test("finds known developers from the username param", () => {
  assert.equal(findDeveloperByParam("priyacodes")?.username, "priyacodes");
  // Usernames may contain dots, and may arrive URL-encoded.
  assert.equal(findDeveloperByParam("meilin.dev")?.username, "meilin.dev");
  assert.equal(findDeveloperByParam("meilin%2Edev")?.username, "meilin.dev");
});

test("rejects unknown or malformed username params", () => {
  assert.equal(findDeveloperByParam("nobody"), null);
  assert.equal(findDeveloperByParam(""), null);
  assert.equal(findDeveloperByParam("%E0%A4%A"), null); // bad encoding
  assert.equal(findDeveloperByParam("<script>"), null);
  assert.equal(findDeveloperByParam("a".repeat(40)), null);
  assert.equal(findDeveloperByParam(undefined), null);
  assert.equal(findDeveloperByParam(["priyacodes"]), null);
});

test("ignores inherited object keys", () => {
  assert.equal(findDeveloperByParam("constructor"), null);
  assert.equal(findDeveloperByParam("toString"), null);
  assert.equal(findDeveloperByParam("__proto__"), null);
});

// generateStaticParams prerenders one profile per developer, so each one
// must pass the same validation the page applies at request time.
test("every developer username is a valid, resolvable param", () => {
  const developers = getAllDevelopers();
  assert.ok(developers.length >= 5);
  for (const { username } of developers) {
    assert.equal(findDeveloperByParam(username)?.username, username);
  }
});

test("developer URLs round-trip through the param lookup", () => {
  assert.equal(paths.developer("priyacodes"), "/developers/priyacodes");
  const [, segment, param] = paths.developer("meilin.dev").split("/");
  assert.equal(segment, "developers");
  assert.equal(findDeveloperByParam(param)?.username, "meilin.dev");
});

test("active link matching", () => {
  assert.ok(isActivePath("/", paths.home));
  assert.ok(!isActivePath("/explore", paths.home)); // Home matches exactly
  assert.ok(isActivePath("/explore", paths.explore));
  assert.ok(isActivePath("/profile/settings", paths.profile)); // nested
  assert.ok(!isActivePath("/profiles", paths.profile)); // not just a prefix
  assert.ok(!isActivePath("/developers/jordanlee", paths.profile));
  assert.ok(!isActivePath(null, paths.home));
});
