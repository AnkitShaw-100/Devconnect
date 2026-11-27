import { Ellipsis, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LikeButton } from "@/components/feed/like-button";
import Link from "next/link";
import { TechTag } from "@/components/shared/tech-tag";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatCount } from "@/lib/format";
import { paths } from "@/lib/paths";

export function PostCard({ post }) {
  const { author } = post;

  return (
    <Card className="gap-0 py-0 shadow-xs">
      <article>
        <header className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <Link
            href={paths.developer(author.username)}
            className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring"
            tabIndex={-1}
            aria-hidden="true"
          >
            <UserAvatar user={author} size="lg" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={paths.developer(author.username)}
              className="block truncate font-semibold text-foreground hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {author.name}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              @{author.username} · {author.role}
            </p>
            <p className="text-xs text-muted-foreground">
              <time>{post.timestamp}</time>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label="More options"
          >
            <Ellipsis />
          </Button>
        </header>

        <div className="px-4 pt-3 sm:px-5">
          <p className="text-[15px] leading-relaxed text-foreground">{post.content}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
            {post.tags.map((tag) => (
              <li key={tag}>
                <TechTag>{tag}</TechTag>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-4 flex items-center gap-1 border-t border-border px-2 py-1.5 sm:px-3">
          <LikeButton initialLikes={post.likes} initialLiked={post.likedByMe} />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            aria-label={`${post.comments} comments`}
          >
            <MessageCircle />
            <span className="tabular-nums">{formatCount(post.comments)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
            <Share2 />
            Share
          </Button>
        </footer>
      </article>
    </Card>
  );
}
