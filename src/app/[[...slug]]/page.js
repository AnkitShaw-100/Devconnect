import { AppShell } from "@/components/layout/app-shell";
import { HomePage } from "@/components/pages/home-page";
import {
  BookmarksPage,
  ExplorePage,
  NotFoundPage,
  ProfilePage,
} from "@/components/pages/route-pages";
import { AppRouter } from "@/components/router/app-router";
import { AppRoutes } from "@/components/router/app-routes";

// Every URL lands on this one Next.js page (optional catch-all segment), and
// React Router decides what to show. These are the routes prerendered at build.
export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["explore"] },
    { slug: ["bookmarks"] },
    { slug: ["profile"] },
  ];
}

export default async function Page({ params }) {
  const { slug = [] } = await params;
  const location = `/${slug.join("/")}`;

  return (
    <AppRouter location={location}>
      <AppShell>
        <AppRoutes
          home={<HomePage />}
          explore={<ExplorePage />}
          bookmarks={<BookmarksPage />}
          profile={<ProfilePage />}
          notFound={<NotFoundPage />}
        />
      </AppShell>
    </AppRouter>
  );
}
