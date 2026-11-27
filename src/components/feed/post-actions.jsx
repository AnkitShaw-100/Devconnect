"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { BookmarkButton } from "@/components/feed/bookmark-button";
import { CommentSection } from "@/components/feed/comment-section";
import { LikeButton } from "@/components/feed/like-button";
import { ShareDialog } from "@/components/feed/share-dialog";
import { useComments } from "@/components/providers/interactions-provider";
import { ActionButton } from "@/components/shared/action-button";
import { formatCount } from "@/lib/format";
import { paths } from "@/lib/paths";

/**
 * The interactive part of a post card: like, comments, bookmark, share.
 * PostCard (no hooks) renders the static parts and hands this island only
 * the data it needs.
 */
export function PostActions({ post }) {
  const [open, setOpen] = useState(false);
  const { comments, add } = useComments(post.id, post.comments);
  const sectionId = `${post.id}-comments`;
  const count = comments.length;

  return (
    <>
      <div className="mt-4 flex items-center gap-1 border-t border-border px-2 py-1.5 sm:px-3">
        <LikeButton postId={post.id} initialLikes={post.likes} initialLiked={post.likedByMe} />
        <ActionButton
          icon={MessageCircle}
          active={open}
          activeClassName="text-foreground"
          fillWhenActive={false}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={open ? sectionId : undefined}
          aria-label={`${open ? "Hide" : "Show"} comments (${count})`}
        >
          <span className="tabular-nums">{formatCount(count)}</span>
        </ActionButton>
        <BookmarkButton postId={post.id} />
        <ShareDialog
          path={`${paths.developer(post.author.username)}#${post.id}`}
          authorName={post.author.name}
        />
      </div>
      {open && <CommentSection id={sectionId} comments={comments} onAdd={add} />}
    </>
  );
}
