import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowButton } from "@/components/layout/follow-button";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { communityStats, trendingTechnologies } from "@/data/community";
import { getSuggestedDevelopers } from "@/lib/developers";
import { paths } from "@/lib/paths";

const cardClass = "gap-3 shadow-xs";

function TrendingCard() {
  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold">
          <TrendingUp className="size-4 text-brand-soft-foreground" aria-hidden="true" />
          Trending technologies
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ol>
          {trendingTechnologies.map((tech, index) => (
            <li
              key={tech.name}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted"
            >
              <span className="w-4 text-xs font-medium text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.posts}</p>
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                {tech.change}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function SuggestedDevelopersCard() {
  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="font-semibold">Suggested developers</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {getSuggestedDevelopers().map((dev) => (
            <li key={dev.username} className="flex items-center gap-3">
              <UserAvatar user={dev} size="lg" />
              <div className="min-w-0 flex-1">
                <Link
                  href={paths.developer(dev.username)}
                  className="block truncate font-medium text-foreground hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {dev.name}
                </Link>
                <p className="truncate text-xs text-muted-foreground">{dev.role}</p>
              </div>
              <FollowButton name={dev.name} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CommunityStatsCard() {
  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="font-semibold">Community</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3">
          {communityStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse rounded-lg bg-muted/50 px-3 py-2.5"
            >
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="text-lg font-semibold text-foreground tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export function RightSidebar() {
  return (
    <div className="space-y-4">
      <TrendingCard />
      <SuggestedDevelopersCard />
      <CommunityStatsCard />
    </div>
  );
}
