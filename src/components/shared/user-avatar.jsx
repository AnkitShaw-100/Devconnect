import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarLetter } from "@/lib/avatar";
import { cn } from "@/lib/utils";

// Letter avatar: the first letter of the user's first name, derived from
// `name`. Dummy users have no photos, so no image request is made.
export function UserAvatar({ user, size = "default", className }) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={cn("font-medium", user.avatarColor)}>
        {getAvatarLetter(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
