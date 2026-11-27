"use client";

import { NewPosts } from "@/components/feed/new-posts";
import { useCreatedPosts } from "@/components/providers/interactions-provider";

/**
 * Composition example: the server-rendered posts arrive as `children` and
 * stay Server Components; this Client Component only adds the posts the
 * user wrote (on their own profile) and picks the empty state.
 */
export function ProfilePosts({ isOwnProfile, serverPostCount, emptyState, children }) {
  const { posts } = useCreatedPosts();
  const localCount = isOwnProfile ? posts.length : 0;

  if (serverPostCount + localCount === 0) return emptyState;

  return (
    <div className="space-y-4">
      {isOwnProfile && <NewPosts />}
      {children}
    </div>
  );
}
