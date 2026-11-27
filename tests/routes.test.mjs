import { test } from "node:test";
import assert from "node:assert/strict";
import { getKnownRouteSlugs, resolveRoute } from "../src/lib/routes.js";
import { paths } from "../src/lib/paths.js";

test("resolves the static routes", () => {
  assert.deepEqual(resolveRoute([]), { name: "home" });
  assert.deepEqual(resolveRoute(undefined), { name: "home" });
  assert.deepEqual(resolveRoute(["explore"]), { name: "explore" });
  assert.deepEqual(resolveRoute(["bookmarks"]), { name: "bookmarks" });
  assert.deepEqual(resolveRoute(["profile"]), { name: "profile" });
});

test("resolves known developer profiles", () => {
  assert.deepEqual(resolveRoute(["developers", "priyacodes"]), {
    name: "developer",
    username: "priyacodes",
  });
  // Usernames may contain dots, and may arrive URL-encoded.
  assert.deepEqual(resolveRoute(["developers", "meilin.dev"]), {
    name: "developer",
    username: "meilin.dev",
  });
  assert.deepEqual(resolveRoute(["developers", "meilin%2Edev"]), {
    name: "developer",
    username: "meilin.dev",
  });
});

test("rejects unknown pages", () => {
  assert.equal(resolveRoute(["settings"]), null);
  assert.equal(resolveRoute(["explore", "extra"]), null);
  assert.equal(resolveRoute(["developers"]), null);
  assert.equal(resolveRoute(["developers", "priyacodes", "posts"]), null);
  assert.equal(resolveRoute("explore"), null);
});

test("rejects unknown or malformed developer usernames", () => {
  assert.equal(resolveRoute(["developers", "nobody"]), null);
  assert.equal(resolveRoute(["developers", ""]), null);
  assert.equal(resolveRoute(["developers", "%E0%A4%A"]), null); // bad encoding
  assert.equal(resolveRoute(["developers", "<script>"]), null);
  assert.equal(resolveRoute(["developers", "a".repeat(40)]), null);
});

test("ignores inherited object keys", () => {
  assert.equal(resolveRoute(["constructor"]), null);
  assert.equal(resolveRoute(["toString"]), null);
  assert.equal(resolveRoute(["developers", "constructor"]), null);
  assert.equal(resolveRoute(["developers", "__proto__"]), null);
});

test("every prerendered slug resolves", () => {
  const slugs = getKnownRouteSlugs();
  assert.ok(slugs.length >= 5);
  for (const slug of slugs) {
    assert.notEqual(resolveRoute(slug), null, `/${slug.join("/")} should resolve`);
  }
});

test("builds developer URLs that round-trip through the resolver", () => {
  assert.equal(paths.developer("priyacodes"), "/developers/priyacodes");
  const [, segment, username] = paths.developer("meilin.dev").split("/");
  assert.equal(segment, "developers");
  assert.equal(resolveRoute([segment, username])?.username, "meilin.dev");
});
