import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeveloperCard } from "@/components/developers/developer-card";
import { PostCard } from "@/components/feed/post-card";
import { PageHeader } from "@/components/shared/page-header";
import { TechTag } from "@/components/shared/tech-tag";
import { trendingTechnologies } from "@/data/community";
import { getOtherDevelopers, getPopularPosts } from "@/lib/developers";

export function ExplorePage() {
  const developers = getOtherDevelopers();
  const popularPosts = getPopularPosts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explore"
        description="Discover developers, technologies and the conversations people are having."
      />

      <Card className="gap-3 shadow-xs ring-neutral-200">
        <CardHeader>
          <CardTitle className="font-semibold">Trending topics</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {trendingTechnologies.map((tech) => (
              <li key={tech.name}>
                <TechTag className="h-7 px-2.5 text-[13px]">
                  {tech.name}
                  <span className="text-neutral-400">· {tech.posts}</span>
                </TechTag>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <section aria-labelledby="explore-developers" className="space-y-3">
        <h2 id="explore-developers" className="px-1 font-semibold text-neutral-900">
          Developers to follow
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {developers.map((developer) => (
            <li key={developer.username}>
              <DeveloperCard developer={developer} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="explore-popular" className="space-y-3">
        <h2
          id="explore-popular"
          className="flex items-center gap-2 px-1 font-semibold text-neutral-900"
        >
          <Flame className="size-4 text-orange-500" aria-hidden="true" />
          Popular this week
        </h2>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
