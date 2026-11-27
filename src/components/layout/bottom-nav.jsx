import { NavLink } from "@/components/layout/nav-link";
import { primaryNav } from "@/data/navigation";

// Tab bar fixed to the bottom on phones (below md), so the main sections
// are always one tap away. The desktop sidebar takes over from md up.
export function BottomNav() {
  return (
    <nav
      aria-label="Bottom"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch gap-1 px-2 py-1">
        {primaryNav.map(({ label, href, icon: Icon }) => (
          <li key={href} className="flex flex-1">
            <NavLink href={href} variant="tab">
              <Icon className="size-[22px]" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
