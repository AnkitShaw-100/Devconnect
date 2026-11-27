import { CodeXml, Hash, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/shared/user-avatar";

const attachments = [
  { label: "Media", icon: ImageIcon },
  { label: "Code", icon: CodeXml },
  { label: "Tags", icon: Hash },
];

// Composer UI only: publishing needs the API planned for a later milestone.
export function CreatePost({ user }) {
  return (
    <Card className="gap-0 py-0 shadow-xs">
      <div className="flex items-center gap-3 px-4 pt-4 sm:px-5">
        <UserAvatar user={user} size="lg" />
        <Input
          name="post"
          placeholder="Share what you're building, learning or debugging…"
          aria-label="Write a post"
          className="h-10 rounded-full border-border bg-muted/50 px-4 shadow-none dark:bg-muted/50"
        />
      </div>
      <div className="flex items-center gap-1 py-2.5 pr-4 pl-[3.75rem] sm:pr-5 sm:pl-[4.25rem]">
        {attachments.map(({ label, icon: Icon }) => (
          <Button
            key={label}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            aria-label={label}
          >
            <Icon />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
        <Button
          size="sm"
          className="ml-auto rounded-full px-4"
          disabled
          title="Publishing arrives in a later milestone"
        >
          Post
        </Button>
      </div>
    </Card>
  );
}
