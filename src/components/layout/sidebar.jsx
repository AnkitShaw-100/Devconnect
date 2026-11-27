import { Card } from "@/components/ui/card";
import { RouterLink, SidebarNavLink } from "@/components/router/router-links";
import { UserAvatar } from "@/components/shared/user-avatar";
import { currentUser } from "@/data/current-user";
import { primaryNav } from "@/data/navigation";
import { paths } from "@/lib/paths";

function ProfileSummary() {
  return (
    <Card className="gap-0 py-0 shadow-xs ring-neutral-200">
      <div className="h-14 bg-neutral-100" />
      <div className="-mt-7 flex flex-col items-center px-4 pb-4 text-center">
        <UserAvatar
          user={currentUser}
          size="lg"
          className="size-14 ring-4 ring-white [&_[data-slot=avatar-fallback]]:text-base"
        />
        <RouterLink
          to={paths.profile}
          className="mt-2 font-semibold text-neutral-900 hover:underline focus-visible:underline focus-visible:outline-none"
        >
          {currentUser.name}
        </RouterLink>
        <p className="text-xs text-neutral-500">{currentUser.role}</p>
      </div>
      <dl className="grid grid-cols-2 border-t border-neutral-100 text-center">
        <div className="py-3">
          <dt className="text-xs text-neutral-500">Followers</dt>
          <dd className="text-sm font-semibold text-neutral-900">1,204</dd>
        </div>
        <div className="border-l border-neutral-100 py-3">
          <dt className="text-xs text-neutral-500">Posts</dt>
          <dd className="text-sm font-semibold text-neutral-900">86</dd>
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
              <SidebarNavLink to={href}>
                <Icon className="size-[18px]" aria-hidden="true" />
                {label}
              </SidebarNavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
