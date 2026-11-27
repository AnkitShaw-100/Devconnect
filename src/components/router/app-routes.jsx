"use client";

import { useEffect } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import { paths } from "@/lib/paths";

function ScrollToTop() {
  const { pathname } = useLocation();

  // Syncing with the browser's scroll position is a legitimate effect.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Picks the server-rendered profile for :username, or the 404 view.
function DeveloperRoute({ profiles, notFound }) {
  const { username } = useParams();
  return Object.hasOwn(profiles, username) ? profiles[username] : notFound;
}

/**
 * Route table. Each page arrives as an already-rendered element from a
 * Server Component, so the page content itself stays server-rendered.
 */
export function AppRoutes({ home, explore, bookmarks, profile, developerProfiles, notFound }) {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path={paths.home} element={home} />
        <Route path={paths.explore} element={explore} />
        <Route path={paths.bookmarks} element={bookmarks} />
        <Route path={paths.profile} element={profile} />
        <Route
          path={paths.developerPattern}
          element={<DeveloperRoute profiles={developerProfiles} notFound={notFound} />}
        />
        <Route path="*" element={notFound} />
      </Routes>
    </>
  );
}
