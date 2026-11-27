import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LIMITS,
  REPORT_REASONS,
  parseTags,
  validateComment,
  validatePost,
  validateReport,
} from "../src/lib/validation.js";

test("parseTags splits, trims, strips # and dedupes case-insensitively", () => {
  assert.deepEqual(parseTags("React, next.js,  #react , ,System   Design"), [
    "React",
    "next.js",
    "System Design",
  ]);
  assert.deepEqual(parseTags(""), []);
  assert.deepEqual(parseTags(undefined), []);
});

test("a valid post is trimmed and its tags parsed", () => {
  const result = validatePost({ content: "  Shipping today!  ", tags: "Rust, C#, C++" });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.values, { content: "Shipping today!", tags: ["Rust", "C#", "C++"] });
});

test("post content is required and length-limited", () => {
  assert.equal(validatePost({ content: "   " }).errors.content, "Write something before posting.");
  assert.equal(validatePost({}).valid, false);

  const max = "x".repeat(LIMITS.postLength);
  assert.equal(validatePost({ content: max }).valid, true);
  assert.match(validatePost({ content: max + "x" }).errors.content, /at most 500/);
});

test("post tags are limited in number and characters", () => {
  assert.match(validatePost({ content: "hi", tags: "a,b,c,d,e,f" }).errors.tags, /at most 5/);
  assert.match(validatePost({ content: "hi", tags: "good, <script>" }).errors.tags, /<script>/);
  assert.match(validatePost({ content: "hi", tags: "y".repeat(25) }).errors.tags, /isn't a valid tag/);
  assert.equal(validatePost({ content: "hi", tags: "Objective-C, Node.js" }).valid, true);
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
