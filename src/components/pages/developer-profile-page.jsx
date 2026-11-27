import { CalendarDays, FileText, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard } from "@/components/feed/post-card";
import { FollowButton } from "@/components/layout/follow-button";
import { EmptyState } from "@/components/shared/empty-state";
import { TechTag } from "@/components/shared/tech-tag";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatCount } from "@/lib/format";
import { getDeveloper, getPostsByDeveloper, isCurrentUser } from "@/lib/developers";

function ProfileHeader({ developer, postCount, isOwnProfile }) {
  const stats = [
    { label: "Followers", value: developer.followers },
    { label: "Following", value: developer.following },
    { label: "Posts", value: postCount },
  ];

  return (
    <Card className="gap-0 py-0 shadow-xs ring-neutral-200">
      <div className="h-24 bg-neutral-100 sm:h-28" />
      <div className="px-4 pb-5 sm:px-6">
        <div className="-mt-10 flex items-end justify-between gap-3">
          <UserAvatar
            user={developer}
            size="lg"
            className="size-20 ring-4 ring-white [&_[data-slot=avatar-fallback]]:text-2xl"
          />
          {isOwnProfile ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled
              title="Profile editing arrives in a later milestone"
            >
              <Pencil />
              Edit profile
            </Button>
          ) : (
            <FollowButton name={developer.name} />
          )}
        </div>

        <h1 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900">
          {developer.name}
        </h1>
        <p className="text-sm text-neutral-500">
          @{developer.username} · {developer.role}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">{developer.bio}</p>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
          <li className="flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {developer.location}
          </li>
          <li className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            {developer.joined}
          </li>
        </ul>

        <dl className="mt-4 flex gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="text-xs text-neutral-500">{stat.label}</dt>
              <dd className="font-semibold text-neutral-900 tabular-nums">
                {formatCount(stat.value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}

// Profile for any developer. /profile renders it for the signed-in user;
// /developers/:username renders it for everyone else.
export function DeveloperProfilePage({ username }) {
  const developer = getDeveloper(username);
  if (!developer) return null;

  const posts = getPostsByDeveloper(username);
  const isOwnProfile = isCurrentUser(username);

  return (
    <div className="space-y-4">
      <ProfileHeader
        developer={developer}
        postCount={posts.length}
        isOwnProfile={isOwnProfile}
      />

      <Card className="gap-3 shadow-xs ring-neutral-200">
        <CardHeader>
          <CardTitle className="font-semibold">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-1.5">
            {developer.skills.map((skill) => (
              <li key={skill}>
                <TechTag>{skill}</TechTag>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <section aria-labelledby="profile-posts" className="space-y-3">
        <h2 id="profile-posts" className="px-1 font-semibold text-neutral-900">
          Posts
        </h2>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No posts yet"
            description={
              isOwnProfile
                ? "Share what you're working on and it will show up here."
                : `${developer.name.split(" ")[0]} hasn't posted anything yet.`
            }
          />
        )}
      </section>
    </div>
  );
}
