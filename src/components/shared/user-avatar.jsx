import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Initials avatar. Dummy users have no photos, so no image request is made.
export function UserAvatar({ user, size = "default", className }) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={cn("font-medium", user.avatarColor)}>
        {user.initials}
      </AvatarFallback>
    </Avatar>
  );
}
