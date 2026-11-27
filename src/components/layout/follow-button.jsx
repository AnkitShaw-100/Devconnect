"use client";

import { useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Local-only follow toggle until there is a backend to persist it.
export function FollowButton({ name }) {
  const [following, setFollowing] = useState(false);

  return (
    <Button
      variant={following ? "secondary" : "outline"}
      size="sm"
      className="rounded-full"
      aria-pressed={following}
      aria-label={following ? `Unfollow ${name}` : `Follow ${name}`}
      onClick={() => setFollowing((value) => !value)}
    >
      {following ? <Check /> : <UserPlus />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
