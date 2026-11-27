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
  maxImages: 4,
  imageBytes: 5 * 1024 * 1024,
};

const isEmpty = (errors) => Object.keys(errors).length === 0;
const text = (value) => (typeof value === "string" ? value.trim() : "");

// Hashtags are written inline, as on X: "Shipping today #React #Next.js".
// A tag starts with a letter or digit and may contain . + # - _ (Next.js,
// C++, C#). "#" right after a letter or digit isn't a tag start (C#), and a
// trailing "." is sentence punctuation, not part of the tag.
const HASHTAG = /(^|[^\p{L}\p{N}_&/#])#([\p{L}\p{N}][\p{L}\p{N}_.+#-]*)/gu;

function cleanTag(raw) {
  return raw.replace(/[.\-]+$/, "");
}

// Tags written in a post, in order, case-insensitively unique.
export function extractHashtags(content) {
  if (typeof content !== "string") return [];
  const seen = new Set();
  const tags = [];
  for (const match of content.matchAll(HASHTAG)) {
    const tag = cleanTag(match[2]);
    const key = tag.toLowerCase();
    if (tag && !seen.has(key)) {
      seen.add(key);
      tags.push(tag);
    }
  }
  return tags;
}

// Splits post text into plain text and hashtag parts, for highlighting:
// "Hi #React!" -> [{ text: "Hi " }, { text: "#React", tag: "React" }, { text: "!" }]
export function splitHashtags(content) {
  const parts = [];
  let last = 0;
  for (const match of content.matchAll(HASHTAG)) {
    const tag = cleanTag(match[2]);
    const start = match.index + match[1].length;
    const end = start + 1 + tag.length;
    if (start > last) parts.push({ text: content.slice(last, start) });
    parts.push({ text: content.slice(start, end), tag });
    last = end;
  }
  if (last < content.length) parts.push({ text: content.slice(last) });
  return parts;
}

// Checks files picked for a post: images only, size and count limits.
// `existing` is how many images are already attached.
export function validateImages(files, existing = 0) {
  const list = Array.from(files ?? []);
  const room = Math.max(0, LIMITS.maxImages - existing);
  const accepted = [];
  let error = null;

  for (const file of list) {
    if (!file?.type?.startsWith("image/")) {
      error = `"${file?.name ?? "That file"}" isn't an image.`;
    } else if (file.size > LIMITS.imageBytes) {
      error = `"${file.name}" is over 5 MB.`;
    } else if (accepted.length >= room) {
      error = `You can attach up to ${LIMITS.maxImages} images.`;
    } else {
      accepted.push(file);
    }
  }
  return { accepted, error };
}

// A post needs text or at least one image. Tags come from the text.
export function validatePost({ content, images = [] } = {}) {
  const values = { content: text(content), tags: extractHashtags(content), images };
  const errors = {};

  if (!values.content && images.length === 0) {
    errors.content = "Write something or add an image before posting.";
  } else if (values.content.length > LIMITS.postLength) {
    errors.content = `Posts can be at most ${LIMITS.postLength} characters.`;
  } else if (values.tags.length > LIMITS.maxTags) {
    errors.content = `Use at most ${LIMITS.maxTags} hashtags.`;
  } else {
    const long = values.tags.find((tag) => tag.length > LIMITS.tagLength);
    if (long) errors.content = `#${long} is too long. Hashtags can be at most ${LIMITS.tagLength} characters.`;
  }
  if (images.length > LIMITS.maxImages) {
    errors.images = `You can attach up to ${LIMITS.maxImages} images.`;
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
