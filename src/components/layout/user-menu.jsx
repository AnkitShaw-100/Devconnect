"use client";

import Link from "next/link";
import { Bookmark, Compass, LogOut, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import { paths } from "@/lib/paths";

// Account menu behind the navbar avatar. Settings and sign-out are shown
// but disabled until authentication exists.
export function UserMenu({ user }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        <UserAvatar user={user} className="size-9" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <span className="block text-sm font-medium text-foreground">{user.name}</span>
            <span className="block text-xs font-normal">@{user.username}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem render={<Link href={paths.profile} />}>
          <UserRound />
          My profile
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href={paths.bookmarks} />}>
          <Bookmark />
          Bookmarks
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href={paths.explore} />}>
          <Compass />
          Explore
        </DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
