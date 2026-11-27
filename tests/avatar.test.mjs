import { test } from "node:test";
import assert from "node:assert/strict";
import { getAvatarLetter } from "../src/lib/avatar.js";
import { developers } from "../src/data/developers.js";

test("uses the first letter of the first name", () => {
  assert.equal(getAvatarLetter("Priya Raman"), "P");
  assert.equal(getAvatarLetter("Jordan Lee"), "J");
});

test("never uses the middle or last name", () => {
  assert.equal(getAvatarLetter("Mary Jane Watson"), "M");
  assert.equal(getAvatarLetter("Lena Fischer"), "L");
});

test("single names", () => {
  assert.equal(getAvatarLetter("Madonna"), "M");
  assert.equal(getAvatarLetter("x"), "X");
});

test("extra and unusual whitespace", () => {
  assert.equal(getAvatarLetter("   Daniel   Okafor  "), "D");
  assert.equal(getAvatarLetter("\tMei\nLin"), "M");
});

test("lowercase names are uppercased", () => {
  assert.equal(getAvatarLetter("sofia martins"), "S");
  assert.equal(getAvatarLetter("élodie dupont"), "É");
});

test("characters outside the basic plane stay whole", () => {
  assert.equal(getAvatarLetter("𝒜lex Doe"), "𝒜");
});

// Always exactly one user-visible character.
const graphemeCount = (text) =>
  [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)].length;

test("never returns more than one letter when uppercasing expands", () => {
  // "ß".toUpperCase() is "SS"; keep the single original letter instead.
  assert.equal(getAvatarLetter("ßtefan Weiß"), "ß");
  assert.equal(graphemeCount(getAvatarLetter("ßtefan")), 1);
});

test("decomposed accents stay attached to their letter", () => {
  // "e" followed by a combining acute accent (U+0301).
  assert.equal(getAvatarLetter("élodie Dupont"), "É");
});

test("multi-part emoji stay whole", () => {
  assert.equal(getAvatarLetter("👩‍💻 Dev"), "👩‍💻");
  assert.equal(getAvatarLetter("🇮🇳 Team"), "🇮🇳");
});

test("empty or missing input falls back to ?", () => {
  assert.equal(getAvatarLetter(""), "?");
  assert.equal(getAvatarLetter("    "), "?");
  assert.equal(getAvatarLetter(undefined), "?");
  assert.equal(getAvatarLetter(null), "?");
  assert.equal(getAvatarLetter(42), "?");
});

test("every developer gets a single letter from their name", () => {
  for (const developer of developers) {
    const letter = getAvatarLetter(developer.name);
    assert.equal(letter, developer.name[0].toUpperCase());
    assert.equal(Array.from(letter).length, 1);
  }
});

test("dummy data no longer stores initials", () => {
  for (const developer of developers) {
    assert.ok(!("initials" in developer), `${developer.username} still has initials`);
  }
});
