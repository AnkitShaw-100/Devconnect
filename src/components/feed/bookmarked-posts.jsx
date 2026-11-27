"use client";

import { PostCard } from "@/components/feed/post-card";
import { useBookmarks, useCreatedPosts } from "@/components/providers/interactions-provider";

/**
 * Shows only the posts that are bookmarked right now. The server renders a
 * card for every post (`serverPosts`: [{ id, card }]); this Client
 * Component just decides which to show, so bookmarking anywhere in the app
 * is reflected here without another server request.
 */
export function BookmarkedPosts({ serverPosts, emptyState }) {
  const bookmarks = useBookmarks();
  const { posts: createdPosts } = useCreatedPosts();

  const ownPosts = createdPosts.filter((post) => bookmarks[post.id]);
  const shared = serverPosts.filter((post) => bookmarks[post.id]);

  if (ownPosts.length + shared.length === 0) return emptyState;

  return (
    <section aria-label="Bookmarked posts" className="space-y-4">
      {ownPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {shared.map((post) => (
        <div key={post.id}>{post.card}</div>
      ))}
    </section>
  );
}
