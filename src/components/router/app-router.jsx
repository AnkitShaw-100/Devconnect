"use client";

import { BrowserRouter, StaticRouter } from "react-router-dom";

/**
 * React Router entry point inside the Next.js App Router.
 *
 * On the server there is no `window`, so the tree is rendered with
 * StaticRouter at the URL Next.js resolved. In the browser BrowserRouter
 * takes over the same tree, so hydration matches and later navigations are
 * handled client-side by React Router.
 */
export function AppRouter({ location, children }) {
  if (typeof window === "undefined") {
    return <StaticRouter location={location}>{children}</StaticRouter>;
  }

  return <BrowserRouter>{children}</BrowserRouter>;
}
