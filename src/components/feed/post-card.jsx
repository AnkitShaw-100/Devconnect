import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PostActions } from "@/components/feed/post-actions";
import { PostMenu } from "@/components/feed/post-menu";
import { TechTag } from "@/components/shared/tech-tag";
import { UserAvatar } from "@/components/shared/user-avatar";
import { paths } from "@/lib/paths";
import { extractHashtags, splitHashtags } from "@/lib/validation";

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

// Chips for tags that aren't already written as #hashtags in the text.
function PostTags({ tags, content }) {
  const inline = new Set(extractHashtags(content).map((tag) => tag.toLowerCase()));
  const extra = tags.filter((tag) => !inline.has(tag.toLowerCase()));
  if (!extra.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
      {extra.map((tag) => (
        <li key={tag}>
          <TechTag>{tag}</TechTag>
        </li>
      ))}
    </ul>
  );
}

// Post text with #hashtags highlighted.
function PostText({ content }) {
  if (!content) return null;
  return (
    <p className="text-[15px] leading-relaxed break-words whitespace-pre-line text-foreground">
      {splitHashtags(content).map((part, index) =>
        part.tag ? (
          <span key={index} className="text-brand-soft-foreground">
            {part.text}
          </span>
        ) : (
          part.text
        )
      )}
    </p>
  );
}

// Images attached to a post (posts written in this session; blob: URLs).
function PostImages({ images }) {
  if (!images?.length) return null;
  return (
    <ul
      aria-label="Images"
      className={`mt-3 grid gap-1 overflow-hidden rounded-2xl ring-1 ring-foreground/10 ${images.length > 1 ? "grid-cols-2" : ""}`}
    >
      {images.map((image) => (
        <li key={image.url}>
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob: URLs can't use next/image */}
          <img
            src={image.url}
            alt={image.alt}
            className={`w-full object-cover ${images.length > 1 ? "aspect-square" : "max-h-[28rem]"}`}
          />
        </li>
      ))}
    </ul>
  );
}

function PostBody({ post }) {
  return (
    <div className="px-4 pt-3 sm:px-5">
      <PostText content={post.content} />
      <PostImages images={post.images} />
      <PostTags tags={post.tags} content={post.content} />
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
