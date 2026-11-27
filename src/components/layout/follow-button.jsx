"use client";

import { Check, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFollow } from "@/components/providers/interactions-provider";

/**
 * Follow / unfollow toggle. State lives in the shared store, keyed by
 * username, so every button for the same developer (sidebar, Explore,
 * profile) stays in sync. While following, hovering or focusing shows
 * "Unfollow" so the next click's effect is clear.
 */
export function FollowButton({ username, name }) {
  const { following, toggle } = useFollow(username);

  return (
    <Button
      variant={following ? "secondary" : "outline"}
      size="sm"
      className="group/follow rounded-full"
      aria-pressed={following}
      aria-label={following ? `Unfollow ${name}` : `Follow ${name}`}
      onClick={toggle}
    >
      {following ? (
        <>
          <Check className="group-hover/follow:hidden group-focus-visible/follow:hidden" />
          <UserMinus className="hidden group-hover/follow:block group-focus-visible/follow:block" />
          <span className="group-hover/follow:hidden group-focus-visible/follow:hidden">Following</span>
          <span className="hidden group-hover/follow:inline group-focus-visible/follow:inline">
            Unfollow
          </span>
        </>
      ) : (
        <>
          <UserPlus />
          Follow
        </>
      )}
    </Button>
  );
}
