"use client";

import { useCreatedPosts, useFollow } from "@/components/providers/interactions-provider";
import { formatNumber } from "@/lib/format";

// Profile counts that react to what the user does: following someone adds
// one to their followers; writing a post adds one to your own post count.
// Shown inline ("318 Following  1,204 Followers"); in the DOM each label
// (dt) comes before its value (dd), as a description list requires, and
// flex-row-reverse puts the number first on screen.
export function ProfileStats({ username, followers, following, postCount, isOwnProfile }) {
  const { following: isFollowing } = useFollow(username);
  const { posts: createdPosts } = useCreatedPosts();

  const stats = [
    { label: "Following", value: following },
    { label: "Followers", value: followers + (!isOwnProfile && isFollowing ? 1 : 0) },
    { label: "Posts", value: postCount + (isOwnProfile ? createdPosts.length : 0) },
  ];

  return (
    <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-row-reverse items-baseline justify-end gap-1" data-stat={stat.label}>
          <dt className="text-muted-foreground">{stat.label}</dt>
          <dd className="font-bold text-foreground tabular-nums">{formatNumber(stat.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
