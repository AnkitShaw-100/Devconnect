import { Bookmark, Compass, House, UserRound } from "lucide-react";

// Primary app navigation, shared by the desktop sidebar and the mobile menu.
export const primaryNav = [
  { label: "Home", href: "/", icon: House },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "My Profile", href: "/profile", icon: UserRound },
];
