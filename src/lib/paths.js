// Single source of truth for app URLs. No imports, so it is safe to use in
// Client Components without pulling data into the browser bundle.
export const paths = {
  home: "/",
  explore: "/explore",
  bookmarks: "/bookmarks",
  profile: "/profile",
  developer: (username) => `/developers/${encodeURIComponent(username)}`,
};

// A nav link is active on its own URL and on any URL nested under it.
// Home ("/") only matches exactly, or it would match every page.
export function isActivePath(pathname, href) {
  if (!pathname) return false;
  if (href === paths.home) return pathname === paths.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}
