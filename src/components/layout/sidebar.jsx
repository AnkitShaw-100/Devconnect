import { Card } from "@/components/ui/card";
import Link from "next/link";
import { NavLink } from "@/components/layout/nav-link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { currentUser } from "@/data/current-user";
import { primaryNav } from "@/data/navigation";
import { paths } from "@/lib/paths";

function ProfileSummary() {
  return (
    <Card className="gap-0 py-0 shadow-xs">
      <div className="h-14 bg-muted" />
      <div className="-mt-7 flex flex-col items-center px-4 pb-4 text-center">
        <UserAvatar
          user={currentUser}
          size="lg"
          className="size-14 ring-4 ring-card [&_[data-slot=avatar-fallback]]:text-base"
        />
        <Link
          href={paths.profile}
          className="mt-2 font-semibold text-foreground hover:underline focus-visible:underline focus-visible:outline-none"
        >
          {currentUser.name}
        </Link>
        <p className="text-xs text-muted-foreground">{currentUser.role}</p>
      </div>
      <dl className="grid grid-cols-2 border-t border-border text-center">
        <div className="py-3">
          <dt className="text-xs text-muted-foreground">Followers</dt>
          <dd className="text-sm font-semibold text-foreground">1,204</dd>
        </div>
        <div className="border-l border-border py-3">
          <dt className="text-xs text-muted-foreground">Posts</dt>
          <dd className="text-sm font-semibold text-foreground">86</dd>
        </div>
      </dl>
    </Card>
  );
}

export function Sidebar() {
  return (
    <div className="space-y-4">
      <ProfileSummary />
      <nav aria-label="Primary">
        <ul className="space-y-1">
          {primaryNav.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <NavLink href={href}>
                <Icon className="size-[18px]" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
