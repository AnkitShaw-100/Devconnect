import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchBar } from "@/components/layout/search-bar";
import { UserMenu } from "@/components/layout/user-menu";
import { currentUser } from "@/data/current-user";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      {/* From md up: equal side columns keep the search bar centred in the navbar. */}
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6 md:grid md:grid-cols-[1fr_minmax(0,28rem)_1fr] md:gap-6">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Logo />
        </div>

        <SearchBar className="hidden w-full md:block" />

        <div className="ml-auto flex items-center justify-end gap-1 sm:gap-2">
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
          <UserMenu user={currentUser} />
        </div>
      </div>
    </header>
  );
}
