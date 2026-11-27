import { BriefcaseBusiness, CalendarDays, FileText, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard } from "@/components/feed/post-card";
import { FollowButton } from "@/components/layout/follow-button";
import { EmptyState } from "@/components/shared/empty-state";
import { TechTag } from "@/components/shared/tech-tag";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ProfilePosts } from "@/components/profile/profile-posts";
import { ProfileStats } from "@/components/profile/profile-stats";
import { getDeveloper, getPostsByDeveloper, isCurrentUser } from "@/lib/developers";

// Profile header in the familiar social-profile layout: a wide banner, a
// large avatar overlapping its bottom edge, the main action on the right,
// then name, handle, bio, details and inline stats.
function ProfileHeader({ developer, postCount, isOwnProfile }) {
  return (
    <Card className="gap-0 py-0 shadow-xs">
      <div data-slot="profile-banner" className="aspect-[3/1] max-h-52 w-full bg-muted" aria-hidden="true" />
      <div className="px-4 pb-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <UserAvatar
            user={developer}
            className="-mt-12 size-24 ring-4 ring-card sm:-mt-16 sm:size-32 [&_[data-slot=avatar-fallback]]:text-4xl sm:[&_[data-slot=avatar-fallback]]:text-5xl"
          />
          <div className="pt-3">
            {isOwnProfile ? (
              <Button
                variant="outline"
                className="h-9 rounded-full px-4 font-semibold"
                disabled
                title="Profile editing arrives in a later milestone"
              >
                <Pencil />
                Edit profile
              </Button>
            ) : (
              <FollowButton username={developer.username} name={developer.name} />
            )}
          </div>
        </div>

        <h1 className="mt-3 text-xl leading-tight font-bold tracking-tight text-foreground sm:text-2xl">
          {developer.name}
        </h1>
        <p className="text-[15px] text-muted-foreground">@{developer.username}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground">{developer.bio}</p>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <BriefcaseBusiness className="size-4" aria-hidden="true" />
            {developer.role}
          </li>
          <li className="flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {developer.location}
          </li>
          <li className="flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            {developer.joined}
          </li>
        </ul>

        <ProfileStats
          username={developer.username}
          followers={developer.followers}
          following={developer.following}
          postCount={postCount}
          isOwnProfile={isOwnProfile}
        />
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

      <Card className="gap-3 shadow-xs">
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
        <h2 id="profile-posts" className="px-1 font-semibold text-foreground">
          Posts
        </h2>
        <ProfilePosts
          isOwnProfile={isOwnProfile}
          serverPostCount={posts.length}
          emptyState={
            <EmptyState
              icon={FileText}
              title="No posts yet"
              description={
                isOwnProfile
                  ? "Share what you're working on and it will show up here."
                  : `${developer.name.split(" ")[0]} hasn't posted anything yet.`
              }
            />
          }
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ProfilePosts>
      </section>
    </div>
  );
}
