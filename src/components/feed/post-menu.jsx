"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkX, Ellipsis, Flag, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeletePostDialog } from "@/components/feed/delete-post-dialog";
import { ReportDialog } from "@/components/feed/report-dialog";
import { useBookmark, useCreatedPosts } from "@/components/providers/interactions-provider";
import { paths } from "@/lib/paths";

/**
 * The "…" menu on a post. Report and delete open dialogs; focus goes back to
 * the "…" button when they close. Delete is offered only for posts the user
 * wrote (`canDelete`); you can't report your own post.
 */
export function PostMenu({ post, canDelete = false }) {
  const triggerRef = useRef(null);
  const [dialog, setDialog] = useState(null); // "report" | "delete" | null
  const { bookmarked, toggle } = useBookmark(post.id);
  const { remove } = useCreatedPosts();
  const closeDialog = (open) => !open && setDialog(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          ref={triggerRef}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label={`More options for ${post.author.name}'s post`}
            />
          }
        >
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={toggle}>
            {bookmarked ? <BookmarkX /> : <Bookmark />}
            {bookmarked ? "Remove bookmark" : "Bookmark post"}
          </DropdownMenuItem>
          <DropdownMenuLinkItem render={<Link href={paths.developer(post.author.username)} />}>
            <UserRound />
            View {post.author.name.split(" ")[0]}&apos;s profile
          </DropdownMenuLinkItem>
          <DropdownMenuSeparator />
          {canDelete ? (
            <DropdownMenuItem variant="destructive" onClick={() => setDialog("delete")}>
              <Trash2 />
              Delete post
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setDialog("report")}>
              <Flag />
              Report post
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDialog
        open={dialog === "report"}
        onOpenChange={closeDialog}
        authorName={post.author.name}
        finalFocusRef={triggerRef}
      />
      {canDelete && (
        <DeletePostDialog
          open={dialog === "delete"}
          onOpenChange={closeDialog}
          onConfirm={() => remove(post.id)}
        />
      )}
    </>
  );
}
