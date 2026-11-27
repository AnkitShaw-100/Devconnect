"use client";

import { Bookmark } from "lucide-react";
import { useBookmark } from "@/components/providers/interactions-provider";
import { ActionButton } from "@/components/shared/action-button";

export function BookmarkButton({ postId }) {
  const { bookmarked, toggle } = useBookmark(postId);

  return (
    <ActionButton
      icon={Bookmark}
      active={bookmarked}
      activeClassName="text-brand-soft-foreground hover:text-brand-soft-foreground"
      onClick={toggle}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
    />
  );
}
