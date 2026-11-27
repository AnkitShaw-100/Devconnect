const FALLBACK_LETTER = "?";

let segmenter;

// Intl.Segmenter is missing in some browsers still in use (e.g. Firefox
// before 125), so it is created lazily and only when available. Creating it
// at module load would throw there and break every page that shows an avatar.
function getSegmenter() {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") return null;
  segmenter ??= new Intl.Segmenter("en", { granularity: "grapheme" });
  return segmenter;
}

// First user-visible character (grapheme cluster) of a string, so that
// "e" + combining accent or a multi-part emoji like 👩‍💻 stays whole.
// Without Intl.Segmenter it falls back to the first code point, which still
// never splits a surrogate pair.
function firstGrapheme(text) {
  const graphemes = getSegmenter();
  if (graphemes) {
    const [first] = graphemes.segment(text);
    return first ? first.segment : "";
  }
  return Array.from(text)[0] ?? "";
}

// The avatar letter is the first character of the first name only:
// "Priya Raman" -> "P", "  jordan   lee " -> "J". Middle and last names
// are never used. The result is always a single visible character.
export function getAvatarLetter(name) {
  if (typeof name !== "string") return FALLBACK_LETTER;

  const firstName = name.trim().split(/\s+/)[0];
  const letter = firstGrapheme(firstName);
  if (!letter) return FALLBACK_LETTER;

  // Some characters uppercase to more than one letter ("ß" -> "SS"); keep
  // the original then. NFC turns "e" + combining accent into one "É".
  const upper = letter.toUpperCase().normalize("NFC");
  return firstGrapheme(upper) === upper ? upper : letter.normalize("NFC");
}
