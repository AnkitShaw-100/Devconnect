import { Bookmark, Compass, House, UserRound } from "lucide-react";
import { paths } from "../lib/paths.js";

// Primary app navigation, shared by the desktop sidebar and the mobile menu.
export const primaryNav = [
  { label: "Home", href: paths.home, icon: House },
  { label: "Explore", href: paths.explore, icon: Compass },
  { label: "Bookmarks", href: paths.bookmarks, icon: Bookmark },
  { label: "My Profile", href: paths.profile, icon: UserRound },
];
