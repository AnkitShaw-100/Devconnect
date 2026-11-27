"use client";

import { PostCard } from "@/components/feed/post-card";
import { useCreatedPosts } from "@/components/providers/interactions-provider";

// Posts the user wrote this session. They exist only in the browser, so a
// Client Component renders them, reusing the same PostCard as the server.
export function NewPosts() {
  const { posts } = useCreatedPosts();
  return posts.map((post) => <PostCard key={post.id} post={post} />);
}
