"use client";

import { Heart } from "lucide-react";
import { useLike } from "@/components/providers/interactions-provider";
import { ActionButton } from "@/components/shared/action-button";
import { formatCount } from "@/lib/format";

// Like state comes from the shared store, so the same post shows the same
// like on every page (feed, Explore, profile, bookmarks).
export function LikeButton({ postId, initialLikes, initialLiked = false }) {
  const { liked, count, toggle } = useLike(postId, initialLiked, initialLikes);

  return (
    <ActionButton
      icon={Heart}
      active={liked}
      activeClassName="text-rose-600 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-400"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike post" : "Like post"}
    >
      <span className="tabular-nums">{formatCount(count)}</span>
    </ActionButton>
  );
}
