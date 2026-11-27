import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PostActions } from "@/components/feed/post-actions";
import { PostMenu } from "@/components/feed/post-menu";
import { TechTag } from "@/components/shared/tech-tag";
import { UserAvatar } from "@/components/shared/user-avatar";
import { paths } from "@/lib/paths";

/*
 * A post is composed of small parts. The static ones (header, body, tags)
 * have no hooks, so they render on the server; the interactive ones
 * (PostMenu, PostActions) are Client Component islands. PostCard has no
 * hooks either, so a Client Component can render it too (see NewPosts),
 * for posts that only exist in the browser.
 */

function PostHeader({ post, canDelete }) {
  const { author } = post;
  const profile = paths.developer(author.username);

  return (
    <header className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
      {/* Decorative duplicate of the name link: hidden from keyboard and screen readers. */}
      <Link href={profile} tabIndex={-1} aria-hidden="true" className="rounded-full">
        <UserAvatar user={author} size="lg" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={profile}
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
      <PostMenu post={post} canDelete={canDelete} />
    </header>
  );
}

function PostTags({ tags }) {
  if (!tags.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag}>
          <TechTag>{tag}</TechTag>
        </li>
      ))}
    </ul>
  );
}

function PostBody({ post }) {
  return (
    <div className="px-4 pt-3 sm:px-5">
      <p className="text-[15px] leading-relaxed break-words whitespace-pre-line text-foreground">
        {post.content}
      </p>
      <PostTags tags={post.tags} />
    </div>
  );
}

export function PostCard({ post }) {
  // Only posts the user wrote in this session can be deleted.
  const canDelete = Boolean(post.createdLocally);

  return (
    <Card className="scroll-mt-20 gap-0 py-0 shadow-xs" id={post.id}>
      <article aria-label={`Post by ${post.author.name}`}>
        <PostHeader post={post} canDelete={canDelete} />
        <PostBody post={post} />
        <PostActions post={post} />
      </article>
    </Card>
  );
}
