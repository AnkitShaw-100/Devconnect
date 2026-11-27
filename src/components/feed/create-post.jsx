"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/feed/emoji-picker";
import { useCreatedPosts } from "@/components/providers/interactions-provider";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn, idList } from "@/lib/utils";
import { LIMITS, validateImages, validatePost } from "@/lib/validation";

const toolbarButton =
  "rounded-full text-brand-soft-foreground hover:bg-brand-soft hover:text-brand-soft-foreground";

/**
 * Post composer in the familiar social layout: avatar, borderless text,
 * then a toolbar (media, emoji) and the Post button. Hashtags are written
 * in the text ("#React") and become the post's tags. Images stay in the
 * browser (object URLs); nothing is uploaded until a backend exists.
 */
export function CreatePost({ user }) {
  const { create } = useCreatedPosts();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // { id, url, name }
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const id = useId();
  const ids = {
    content: `${id}-content`,
    counter: `${id}-counter`,
    contentError: `${id}-content-error`,
    imagesError: `${id}-images-error`,
  };
  const length = content.trim().length;
  const tooLong = length > LIMITS.postLength;
  const canPost = length > 0 || images.length > 0;

  // Free the previews of images that were never posted when the composer
  // unmounts (posted images keep their URL for the post to show).
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url)), []);

  function clearError(field) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleFiles(event) {
    const { accepted, error } = validateImages(event.target.files, images.length);
    event.target.value = ""; // allow picking the same file again
    setImages((current) => [
      ...current,
      ...accepted.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    ]);
    setErrors((current) => ({ ...current, images: error ?? undefined, content: undefined }));
  }

  function removeImage(imageId) {
    setImages((current) => {
      const removed = current.find((image) => image.id === imageId);
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter((image) => image.id !== imageId);
    });
    clearError("images");
    textareaRef.current?.focus();
  }

  // Insert at the caret (or replace the selection), then put the caret after it.
  function insertEmoji(emoji) {
    const field = textareaRef.current;
    const start = field?.selectionStart ?? content.length;
    const end = field?.selectionEnd ?? content.length;
    setContent(content.slice(0, start) + emoji + content.slice(end));
    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = validatePost({
      content,
      images: images.map(({ url, name }) => ({ url, alt: `Image shared by ${user.name}: ${name}` })),
    });
    setErrors(result.errors);
    if (!result.valid) {
      setStatus("");
      return;
    }
    create(result.values);
    setContent("");
    setImages([]); // the URLs now belong to the post; don't revoke them
    imagesRef.current = [];
    setStatus("Your post is live at the top of the feed.");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  }

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
              ref={textareaRef}
              id={ids.content}
              name="content"
              rows={1}
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setStatus("");
                clearError("content");
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

            {images.length > 0 && (
              <ul
                aria-label="Attached images"
                className={cn("mt-2 grid gap-2", images.length > 1 && "grid-cols-2")}
              >
                {images.map((image) => (
                  <li key={image.id} className="relative overflow-hidden rounded-2xl bg-muted">
                    {/* Local preview (blob: URL), which next/image can't optimise. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={`Preview: ${image.name}`}
                      className={cn("w-full object-cover", images.length > 1 ? "aspect-square" : "max-h-80")}
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="secondary"
                      className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur"
                      aria-label={`Remove ${image.name}`}
                      onClick={() => removeImage(image.id)}
                    >
                      <X />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {errors.images && (
              <p id={ids.imagesError} className="mt-1 text-xs text-destructive" role="alert">
                {errors.images}
              </p>
            )}

            <div className="mt-2 flex items-center gap-1 border-t border-border pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={handleFiles}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={toolbarButton}
                aria-label="Add images"
                aria-describedby={errors.images ? ids.imagesError : undefined}
                disabled={images.length >= LIMITS.maxImages}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus />
              </Button>
              <EmojiPicker onPick={insertEmoji} />

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
                <Button type="submit" className="h-9 rounded-full px-5 font-bold" disabled={!canPost}>
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
