const FALLBACK_LETTER = "?";

const graphemes = new Intl.Segmenter("en", { granularity: "grapheme" });

// First user-visible character (grapheme cluster) of a string, so that
// "e" + combining accent or a multi-part emoji like 👩‍💻 stays whole.
function firstGrapheme(text) {
  const [first] = graphemes.segment(text);
  return first ? first.segment : "";
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
