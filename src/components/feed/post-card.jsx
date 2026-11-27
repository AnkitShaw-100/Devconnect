import { Ellipsis, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LikeButton } from "@/components/feed/like-button";
import { TechTag } from "@/components/shared/tech-tag";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatCount } from "@/lib/format";

export function PostCard({ post }) {
  const { author } = post;

  return (
    <Card className="gap-0 py-0 shadow-xs ring-neutral-200">
      <article>
        <header className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <UserAvatar user={author} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-neutral-900">{author.name}</p>
            <p className="truncate text-xs text-neutral-500">
              @{author.username} · {author.role}
            </p>
            <p className="text-xs text-neutral-400">
              <time>{post.timestamp}</time>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-neutral-400"
            aria-label="More options"
          >
            <Ellipsis />
          </Button>
        </header>

        <div className="px-4 pt-3 sm:px-5">
          <p className="text-[15px] leading-relaxed text-neutral-800">{post.content}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
            {post.tags.map((tag) => (
              <li key={tag}>
                <TechTag>{tag}</TechTag>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-4 flex items-center gap-1 border-t border-neutral-100 px-2 py-1.5 sm:px-3">
          <LikeButton initialLikes={post.likes} initialLiked={post.likedByMe} />
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-600"
            aria-label={`${post.comments} comments`}
          >
            <MessageCircle />
            <span className="tabular-nums">{formatCount(post.comments)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto text-neutral-600">
            <Share2 />
            Share
          </Button>
        </footer>
      </article>
    </Card>
  );
}
