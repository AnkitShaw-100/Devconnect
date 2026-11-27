"use client";

import { useId, useState } from "react";
import { Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCreatedPosts } from "@/components/providers/interactions-provider";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn, idList } from "@/lib/utils";
import { LIMITS, validatePost } from "@/lib/validation";

/**
 * Post composer. Validates on submit (lib/validation.js), shows errors next
 * to the fields, and adds the post to the top of the feed. Nothing is sent
 * anywhere yet: posts live in the browser until the page is reloaded.
 */
export function CreatePost({ user }) {
  const { create } = useCreatedPosts();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const id = useId();
  const ids = {
    content: `${id}-content`,
    counter: `${id}-counter`,
    contentError: `${id}-content-error`,
    tags: `${id}-tags`,
    tagsHint: `${id}-tags-hint`,
    tagsError: `${id}-tags-error`,
  };
  const length = content.trim().length;
  const tooLong = length > LIMITS.postLength;

  function handleSubmit(event) {
    event.preventDefault();
    const result = validatePost({ content, tags });
    setErrors(result.errors);
    if (!result.valid) {
      setStatus("");
      return;
    }
    create(result.values);
    setContent("");
    setTags("");
    setShowTags(false);
    setStatus("Your post is live at the top of the feed.");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  }

  // The tags field opens from the toolbar, and stays open while it has a
  // value or an error so nothing typed is hidden.
  const tagsOpen = showTags || Boolean(tags) || Boolean(errors.tags);

  return (
    // No border on the text box itself: the card shows focus instead
    // (focus-within ring), so keyboard users still see where they are.
    <Card className="gap-0 px-4 py-3 shadow-xs focus-within:ring-ring sm:px-5">
      <form onSubmit={handleSubmit} noValidate aria-label="Create a post">
        <div className="flex items-start gap-3">
          <UserAvatar user={user} className="size-10" />
          <div className="min-w-0 flex-1">
            <label htmlFor={ids.content} className="sr-only">
              Write a post
            </label>
            <Textarea
              id={ids.content}
              name="content"
              rows={1}
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setStatus("");
                if (errors.content) setErrors((current) => ({ ...current, content: undefined }));
              }}
              onKeyDown={handleKeyDown}
              placeholder="What are you building?"
              aria-invalid={Boolean(errors.content) || tooLong}
              aria-describedby={idList(ids.counter, errors.content && ids.contentError)}
              className="min-h-10 resize-none rounded-none border-0 bg-transparent px-0 py-2 text-lg shadow-none focus-visible:ring-0 aria-invalid:ring-0 md:text-lg dark:bg-transparent dark:aria-invalid:ring-0"
            />
            {errors.content && (
              <p id={ids.contentError} className="text-xs text-destructive" role="alert">
                {errors.content}
              </p>
            )}

            {tagsOpen && (
              <div className="mt-1">
                <label htmlFor={ids.tags} className="sr-only">
                  Tags
                </label>
                <div className="flex items-center gap-1.5 text-brand-soft-foreground">
                  <Hash className="size-4 shrink-0" aria-hidden="true" />
                  <input
                    id={ids.tags}
                    name="tags"
                    autoFocus={showTags && !tags}
                    value={tags}
                    onChange={(event) => {
                      setTags(event.target.value);
                      if (errors.tags) setErrors((current) => ({ ...current, tags: undefined }));
                    }}
                    placeholder="Add tags, comma separated"
                    aria-invalid={Boolean(errors.tags)}
                    aria-describedby={idList(ids.tagsHint, errors.tags && ids.tagsError)}
                    className="h-8 w-full min-w-0 bg-transparent text-sm text-brand-soft-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <p id={ids.tagsHint} className="sr-only">
                  Up to {LIMITS.maxTags} tags, for example: React, Next.js
                </p>
                {errors.tags && (
                  <p id={ids.tagsError} className="text-xs text-destructive" role="alert">
                    {errors.tags}
                  </p>
                )}
              </div>
            )}

            <div className="mt-2 flex items-center gap-1 border-t border-border pt-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-brand-soft-foreground hover:bg-brand-soft hover:text-brand-soft-foreground"
                aria-label={tagsOpen ? "Hide tags" : "Add tags"}
                aria-expanded={tagsOpen}
                onClick={() => {
                  if (tagsOpen) {
                    setShowTags(false);
                    setTags("");
                    setErrors((current) => ({ ...current, tags: undefined }));
                  } else {
                    setShowTags(true);
                  }
                }}
              >
                <Hash />
              </Button>
              <div className="ml-auto flex items-center gap-3">
                <p
                  id={ids.counter}
                  className={cn(
                    "text-xs tabular-nums text-muted-foreground",
                    !length && "sr-only",
                    tooLong && "text-destructive"
                  )}
                >
                  {length}/{LIMITS.postLength}
                </p>
                <Button type="submit" className="h-9 rounded-full px-5 font-bold" disabled={!length}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
        <p role="status" className="sr-only">
          {status}
        </p>
      </form>
    </Card>
  );
}
