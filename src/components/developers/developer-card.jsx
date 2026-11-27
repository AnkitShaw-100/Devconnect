import { Card } from "@/components/ui/card";
import { FollowButton } from "@/components/layout/follow-button";
import Link from "next/link";
import { TechTag } from "@/components/shared/tech-tag";
import { UserAvatar } from "@/components/shared/user-avatar";
import { paths } from "@/lib/paths";

// Compact developer summary used in discovery grids.
export function DeveloperCard({ developer }) {
  return (
    <Card className="h-full gap-3 px-4 shadow-xs ring-neutral-200">
      <div className="flex items-start gap-3">
        <UserAvatar user={developer} size="lg" />
        <div className="min-w-0 flex-1">
          <Link
            href={paths.developer(developer.username)}
            className="block truncate font-semibold text-neutral-900 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {developer.name}
          </Link>
          <p className="truncate text-xs text-neutral-500">{developer.role}</p>
        </div>
        <FollowButton name={developer.name} />
      </div>
      <ul className="flex flex-wrap gap-1.5" aria-label={`${developer.name}'s skills`}>
        {developer.skills.slice(0, 3).map((skill) => (
          <li key={skill}>
            <TechTag>{skill}</TechTag>
          </li>
        ))}
      </ul>
    </Card>
  );
}
