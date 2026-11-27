// Form validation shared by the create-post, comment and report forms.
// Pure functions: they take raw form values and return cleaned `values` plus
// an `errors` object keyed by field. An empty `errors` object means valid.
// When a backend exists, the server must run the same checks again.

export const LIMITS = {
  postLength: 500,
  commentLength: 300,
  reportDetailsLength: 500,
  maxTags: 5,
  tagLength: 24,
};

// Letters, digits, spaces and the symbols used in tech names
// (C#, C++, Next.js, Objective-C).
const TAG_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .+#-]*$/u;

const isEmpty = (errors) => Object.keys(errors).length === 0;
const text = (value) => (typeof value === "string" ? value.trim() : "");

// "React, next.js,  react" -> ["React", "next.js"] (case-insensitive dedupe).
export function parseTags(raw) {
  if (typeof raw !== "string") return [];
  const seen = new Set();
  const tags = [];
  for (const part of raw.split(",")) {
    const tag = part.trim().replace(/^#/, "").replace(/\s+/g, " ");
    const key = tag.toLowerCase();
    if (tag && !seen.has(key)) {
      seen.add(key);
      tags.push(tag);
    }
  }
  return tags;
}

export function validatePost({ content, tags } = {}) {
  const values = { content: text(content), tags: parseTags(tags) };
  const errors = {};

  if (!values.content) errors.content = "Write something before posting.";
  else if (values.content.length > LIMITS.postLength) {
    errors.content = `Posts can be at most ${LIMITS.postLength} characters.`;
  }

  if (values.tags.length > LIMITS.maxTags) {
    errors.tags = `Use at most ${LIMITS.maxTags} tags.`;
  } else {
    const bad = values.tags.find(
      (tag) => tag.length > LIMITS.tagLength || !TAG_PATTERN.test(tag)
    );
    if (bad) {
      errors.tags = `"${bad}" isn't a valid tag. Use letters, numbers, spaces and . + # - (max ${LIMITS.tagLength} characters).`;
    }
  }

  return { values, errors, valid: isEmpty(errors) };
}

export function validateComment({ content } = {}) {
  const values = { content: text(content) };
  const errors = {};

  if (!values.content) errors.content = "Write a comment first.";
  else if (values.content.length > LIMITS.commentLength) {
    errors.content = `Comments can be at most ${LIMITS.commentLength} characters.`;
  }

  return { values, errors, valid: isEmpty(errors) };
}

export const REPORT_REASONS = [
  { value: "spam", label: "Spam or self-promotion" },
  { value: "harassment", label: "Harassment or hate" },
  { value: "misinformation", label: "Misleading or false information" },
  { value: "other", label: "Something else" },
];

export function validateReport({ reason, details } = {}) {
  const values = { reason: text(reason), details: text(details) };
  const errors = {};

  if (!REPORT_REASONS.some((option) => option.value === values.reason)) {
    errors.reason = "Choose a reason.";
  }
  if (values.reason === "other" && !values.details) {
    errors.details = "Tell us what's wrong.";
  } else if (values.details.length > LIMITS.reportDetailsLength) {
    errors.details = `Keep it under ${LIMITS.reportDetailsLength} characters.`;
  }

  return { values, errors, valid: isEmpty(errors) };
}
