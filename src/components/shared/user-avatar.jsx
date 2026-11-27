import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarLetter } from "@/lib/avatar";
import { cn } from "@/lib/utils";

// Letter avatar: the first letter of the user's first name, derived from
// `name`. Dummy users have no photos, so no image request is made.
// For a custom size, pass a size-* class and leave `size` at "default":
// size="lg" sets data-size, whose size-10 rule outranks a plain size-* class.
export function UserAvatar({ user, size = "default", className }) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={cn("font-medium", user.avatarColor)}>
        {getAvatarLetter(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
