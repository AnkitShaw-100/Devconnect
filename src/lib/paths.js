// Single source of truth for app URLs. No imports, so it is safe to use in
// Client Components without pulling data into the browser bundle.
export const paths = {
  home: "/",
  explore: "/explore",
  bookmarks: "/bookmarks",
  profile: "/profile",
  developerPattern: "/developers/:username",
  developer: (username) => `/developers/${encodeURIComponent(username)}`,
};
