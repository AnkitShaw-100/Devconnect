import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchBar } from "@/components/layout/search-bar";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { currentUser } from "@/data/current-user";
import { paths } from "@/lib/paths";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <MobileNav />
        <Logo />

        <SearchBar className="ml-6 hidden w-full max-w-md md:block" />

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon-lg"
            className="relative rounded-full text-muted-foreground"
            aria-label="Notifications, 3 unread"
          >
            <Bell className="size-5" />
            <span
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand ring-2 ring-background"
              aria-hidden="true"
            />
          </Button>
          <Link
            href={paths.profile}
            aria-label="Your profile"
            className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <UserAvatar user={currentUser} className="size-9" />
          </Link>
        </div>
      </div>
    </header>
  );
}
