import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LIMITS,
  REPORT_REASONS,
  extractHashtags,
  splitHashtags,
  validateComment,
  validateImages,
  validatePost,
  validateReport,
} from "../src/lib/validation.js";

test("hashtags are read from the text, deduped case-insensitively", () => {
  assert.deepEqual(extractHashtags("Shipping #React and #Next.js. Also #react"), ["React", "Next.js"]);
  assert.deepEqual(extractHashtags("#C++ and #Objective-C, (#Rust)"), ["C++", "Objective-C", "Rust"]);
  assert.deepEqual(extractHashtags(""), []);
  assert.deepEqual(extractHashtags(undefined), []);
});

test("a # inside a word, or with no tag after it, is not a hashtag", () => {
  // C#, issue numbers inside words and URL fragments are not tags.
  assert.deepEqual(extractHashtags("I write C# daily, see a#b and https://x.dev/#top"), []);
  assert.deepEqual(extractHashtags("# heading and ## and #"), []);
  // Markup can't sneak in: only letters, digits and . + # - _ are kept.
  assert.deepEqual(extractHashtags("#<script>alert(1)</script>"), []);
});

test("splitHashtags marks the hashtag parts for highlighting", () => {
  assert.deepEqual(splitHashtags("Hi #React!"), [
    { text: "Hi " },
    { text: "#React", tag: "React" },
    { text: "!" },
  ]);
  assert.deepEqual(splitHashtags("no tags"), [{ text: "no tags" }]);
  // Joining the parts gives back the original text.
  const content = "Ship #Next.js. Then #Rust";
  assert.equal(splitHashtags(content).map((part) => part.text).join(""), content);
});

test("a valid post is trimmed and its hashtags become tags", () => {
  const result = validatePost({ content: "  Shipping today #Rust #C++  " });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.values.content, "Shipping today #Rust #C++");
  assert.deepEqual(result.values.tags, ["Rust", "C++"]);
});

test("a post needs text or an image, within the length limit", () => {
  assert.equal(
    validatePost({ content: "   " }).errors.content,
    "Write something or add an image before posting."
  );
  assert.equal(validatePost({}).valid, false);
  assert.equal(validatePost({ content: "", images: [{ url: "blob:x", alt: "" }] }).valid, true);

  const max = "x".repeat(LIMITS.postLength);
  assert.equal(validatePost({ content: max }).valid, true);
  assert.match(validatePost({ content: max + "x" }).errors.content, /at most 500/);
});

test("hashtags are limited in number and length", () => {
  assert.match(validatePost({ content: "#a #b #c #d #e #f" }).errors.content, /at most 5 hashtags/);
  assert.equal(validatePost({ content: "#a #b #c #d #e" }).valid, true);
  assert.match(validatePost({ content: `#${"y".repeat(25)}` }).errors.content, /too long/);
});

test("validateImages accepts images up to the count and size limits", () => {
  const image = (name, size = 1000, type = "image/png") => ({ name, size, type });

  assert.deepEqual(validateImages([image("a.png")]).accepted.map((f) => f.name), ["a.png"]);
  assert.match(validateImages([image("doc.pdf", 10, "application/pdf")]).error, /isn't an image/);
  assert.match(validateImages([image("big.png", LIMITS.imageBytes + 1)]).error, /over 5 MB/);

  // Already 3 attached: only one more fits.
  const result = validateImages([image("1.png"), image("2.png")], 3);
  assert.deepEqual(result.accepted.map((f) => f.name), ["1.png"]);
  assert.match(result.error, /up to 4 images/);
  assert.deepEqual(validateImages(null), { accepted: [], error: null });
});

test("comments are required and length-limited", () => {
  assert.equal(validateComment({ content: " ok " }).values.content, "ok");
  assert.equal(validateComment({ content: "" }).errors.content, "Write a comment first.");
  assert.equal(validateComment({ content: "c".repeat(LIMITS.commentLength) }).valid, true);
  assert.equal(validateComment({ content: "c".repeat(LIMITS.commentLength + 1) }).valid, false);
});

test("reports need a known reason; 'other' needs details", () => {
  for (const { value } of REPORT_REASONS.filter((r) => r.value !== "other")) {
    assert.equal(validateReport({ reason: value }).valid, true, value);
  }
  assert.equal(validateReport({}).errors.reason, "Choose a reason.");
  assert.equal(validateReport({ reason: "not-a-reason" }).errors.reason, "Choose a reason.");
  assert.equal(validateReport({ reason: "other" }).errors.details, "Tell us what's wrong.");
  assert.equal(validateReport({ reason: "other", details: "Impersonation" }).valid, true);
  assert.equal(
    validateReport({ reason: "spam", details: "d".repeat(LIMITS.reportDetailsLength + 1) }).valid,
    false
  );
});
