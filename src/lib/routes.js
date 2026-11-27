// Server-side route validation for the Next.js catch-all page. React Router
// still renders the UI; this decides whether a URL exists at all, so unknown
// pages and developers get Next.js' not-found handling.
import { getAllDevelopers, getDeveloper } from "./developers.js";

// GitHub-style usernames: letters, digits, dot, underscore, hyphen.
const USERNAME_PATTERN = /^[a-z0-9._-]{1,39}$/i;

const staticRoutes = {
  explore: "explore",
  bookmarks: "bookmarks",
  profile: "profile",
};

function decodeSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

export function resolveRoute(slug = []) {
  if (!Array.isArray(slug)) return null;
  if (slug.length === 0) return { name: "home" };

  if (slug.length === 1 && Object.hasOwn(staticRoutes, slug[0])) {
    return { name: staticRoutes[slug[0]] };
  }

  if (slug.length === 2 && slug[0] === "developers") {
    const username = decodeSegment(slug[1]);
    if (!username || !USERNAME_PATTERN.test(username)) return null;

    const developer = getDeveloper(username);
    return developer ? { name: "developer", username: developer.username } : null;
  }

  return null;
}

// Every URL that exists today, for generateStaticParams.
export function getKnownRouteSlugs() {
  return [
    [],
    ...Object.keys(staticRoutes).map((segment) => [segment]),
    ...getAllDevelopers().map((developer) => ["developers", developer.username]),
  ];
}
