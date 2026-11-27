import { Bookmark, Compass, SearchX, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PlaceholderPage } from "@/components/pages/placeholder-page";
import { RouterLink } from "@/components/router/router-links";

export function ExplorePage() {
  return (
    <PlaceholderPage
      icon={Compass}
      title="Explore"
      description="Discover trending projects, technologies and developers. Coming in a later milestone."
    />
  );
}

export function BookmarksPage() {
  return (
    <PlaceholderPage
      icon={Bookmark}
      title="Bookmarks"
      description="Posts you save will appear here so you can come back to them."
    />
  );
}

export function ProfilePage() {
  return (
    <PlaceholderPage
      icon={UserRound}
      title="My Profile"
      description="Your profile, skills and activity will live here."
    />
  );
}

export function NotFoundPage() {
  return (
    <PlaceholderPage
      icon={SearchX}
      title="Page not found"
      description="That page doesn't exist. It may have moved, or the link may be wrong."
    >
      <RouterLink to="/" className={buttonVariants({ size: "sm", className: "mt-1" })}>
        Back to home
      </RouterLink>
    </PlaceholderPage>
  );
}
