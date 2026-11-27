import { AppShell } from "@/components/layout/app-shell";
import { BookmarksPage } from "@/components/pages/bookmarks-page";
import { DeveloperProfilePage } from "@/components/pages/developer-profile-page";
import { ExplorePage } from "@/components/pages/explore-page";
import { HomePage } from "@/components/pages/home-page";
import { NotFoundPage } from "@/components/pages/not-found-page";
import { AppRouter } from "@/components/router/app-router";
import { AppRoutes } from "@/components/router/app-routes";
import { currentUsername } from "@/data/current-user";
import { getAllDevelopers } from "@/lib/developers";

/**
 * The whole app for one URL: router + shell + every route's server-rendered
 * page. Shared by the catch-all page and the not-found page so both hydrate
 * into the same client-side router.
 */
export function RouteTree({ location }) {
  const developerProfiles = Object.fromEntries(
    getAllDevelopers().map(({ username }) => [
      username,
      <DeveloperProfilePage key={username} username={username} />,
    ])
  );

  return (
    <AppRouter location={location}>
      <AppShell>
        <AppRoutes
          home={<HomePage />}
          explore={<ExplorePage />}
          bookmarks={<BookmarksPage />}
          profile={<DeveloperProfilePage username={currentUsername} />}
          developerProfiles={developerProfiles}
          notFound={<NotFoundPage />}
        />
      </AppShell>
    </AppRouter>
  );
}
