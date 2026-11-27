// Accessibility helpers shared by server and client code. No imports, so
// Client Components can use them without pulling layout code into the bundle.

// id of the <main> element; the skip link points here.
export const MAIN_CONTENT_ID = "main-content";

// After the focused element is removed (a deleted post, an unbookmarked card),
// browsers move focus to <body> and keyboard users lose their place. This
// puts focus on the main content instead, so the next Tab continues there.
export function focusMainContent() {
  if (typeof document === "undefined") return;
  document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
}

// True when focus has been lost (nothing focused, or the focused element is
// no longer in the page).
export function isFocusLost() {
  if (typeof document === "undefined") return false;
  const active = document.activeElement;
  return !active || active === document.body || !active.isConnected;
}
