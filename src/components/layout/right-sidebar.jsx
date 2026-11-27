import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowButton } from "@/components/layout/follow-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  communityStats,
  suggestedDevelopers,
  trendingTechnologies,
} from "@/data/community";

const cardClass = "gap-3 shadow-xs ring-neutral-200";

function TrendingCard() {
  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold">
          <TrendingUp className="size-4 text-blue-600" aria-hidden="true" />
          Trending technologies
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ol>
          {trendingTechnologies.map((tech, index) => (
            <li
              key={tech.name}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-neutral-50"
            >
              <span className="w-4 text-xs font-medium text-neutral-400 tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-900">{tech.name}</p>
                <p className="text-xs text-neutral-500">{tech.posts}</p>
              </div>
              <span className="text-xs font-medium text-emerald-600 tabular-nums">
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
          {suggestedDevelopers.map((dev) => (
            <li key={dev.username} className="flex items-center gap-3">
              <UserAvatar user={dev} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-900">{dev.name}</p>
                <p className="truncate text-xs text-neutral-500">{dev.role}</p>
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
              className="flex flex-col-reverse rounded-lg bg-neutral-50 px-3 py-2.5"
            >
              <dt className="text-xs text-neutral-500">{stat.label}</dt>
              <dd className="text-lg font-semibold text-neutral-900 tabular-nums">
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
