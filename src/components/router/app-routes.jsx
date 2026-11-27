"use client";

import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * Route table. Each page arrives as an already-rendered element from a
 * Server Component, so the page content itself stays server-rendered.
 */
export function AppRoutes({ home, explore, bookmarks, profile, notFound }) {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={home} />
        <Route path="/explore" element={explore} />
        <Route path="/bookmarks" element={bookmarks} />
        <Route path="/profile" element={profile} />
        <Route path="*" element={notFound} />
      </Routes>
    </>
  );
}
