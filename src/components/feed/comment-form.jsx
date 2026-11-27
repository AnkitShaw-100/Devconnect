"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/shared/user-avatar";
import { currentUser } from "@/data/current-user";
import { cn, idList } from "@/lib/utils";
import { LIMITS, validateComment } from "@/lib/validation";

// Controlled comment box: live character count, validation on submit,
// Ctrl/Cmd + Enter to send. Errors are linked to the field for screen readers.
export function CommentForm({ onSubmit }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const fieldId = useId();
  const counterId = `${fieldId}-count`;
  const errorId = `${fieldId}-error`;
  const length = content.trim().length;
  const tooLong = length > LIMITS.commentLength;

  function handleSubmit(event) {
    event.preventDefault();
    const { values, errors, valid } = validateComment({ content });
    if (!valid) {
      setError(errors.content);
      return;
    }
    onSubmit(values.content);
    setContent("");
    setError(null);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3" noValidate>
      <UserAvatar user={currentUser} />
      <div className="min-w-0 flex-1 space-y-1.5">
        <label htmlFor={fieldId} className="sr-only">
          Write a comment
        </label>
        <Textarea
          id={fieldId}
          name="comment"
          rows={2}
          autoFocus
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment…"
          aria-invalid={Boolean(error) || tooLong}
          aria-describedby={idList(counterId, error && errorId)}
          className="min-h-10 resize-none bg-muted/50 dark:bg-muted/50"
        />
        <div className="flex items-center gap-3">
          <p
            id={counterId}
            className={cn("text-xs tabular-nums text-muted-foreground", tooLong && "text-destructive")}
          >
            {length}/{LIMITS.commentLength}
          </p>
          {error && (
            <p id={errorId} className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" size="sm" className="ml-auto rounded-full px-3" disabled={!length}>
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
}
