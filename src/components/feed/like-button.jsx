"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/format";

export function LikeButton({ initialLikes, initialLiked = false }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  function toggleLike() {
    setLikes((count) => (liked ? count - 1 : count + 1));
    setLiked(!liked);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      aria-pressed={liked}
      aria-label={liked ? "Unlike post" : "Like post"}
      className={cn(
        "text-muted-foreground",
        liked && "text-rose-600 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-400"
      )}
    >
      <Heart className={cn(liked && "fill-current")} />
      <span className="tabular-nums">{formatCount(likes)}</span>
    </Button>
  );
}
