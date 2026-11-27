"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { REPORT_REASONS, validateReport } from "@/lib/validation";

function ReportForm({ authorName, onDone }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const detailsId = useId();
  const reasonErrorId = `${detailsId}-reason-error`;
  const detailsErrorId = `${detailsId}-details-error`;

  function handleSubmit(event) {
    event.preventDefault();
    const result = validateReport({ reason, details });
    setErrors(result.errors);
    // No backend yet: a valid report only shows the confirmation.
    if (result.valid) setSent(true);
  }

  if (sent) {
    return (
      <>
        <p role="status" className="text-sm">
          Thanks. We&apos;ll review this post by {authorName}.
        </p>
        <DialogFooter>
          <Button onClick={onDone}>Done</Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <fieldset
        className="space-y-2"
        aria-invalid={Boolean(errors.reason)}
        aria-describedby={errors.reason ? reasonErrorId : undefined}
      >
        <legend className="mb-2 text-sm font-medium">Why are you reporting this post?</legend>
        {REPORT_REASONS.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="radio"
              name="reason"
              value={option.value}
              checked={reason === option.value}
              onChange={() => {
                setReason(option.value);
                setErrors((current) => ({ ...current, reason: undefined }));
              }}
              className="size-4 accent-brand"
            />
            {option.label}
          </label>
        ))}
        {errors.reason && (
          <p id={reasonErrorId} className="text-xs text-destructive" role="alert">
            {errors.reason}
          </p>
        )}
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor={detailsId} className="text-sm font-medium">
          Details{" "}
          <span className="font-normal text-muted-foreground">
            {reason === "other" ? "(required)" : "(optional)"}
          </span>
        </label>
        <Textarea
          id={detailsId}
          rows={3}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          aria-invalid={Boolean(errors.details)}
          aria-describedby={errors.details ? detailsErrorId : undefined}
        />
        {errors.details && (
          <p id={detailsErrorId} className="text-xs text-destructive" role="alert">
            {errors.details}
          </p>
        )}
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        <Button type="submit">Send report</Button>
      </DialogFooter>
    </form>
  );
}

// Opened from the post menu. `finalFocusRef` returns focus to the menu
// button when the dialog closes, so keyboard users don't lose their place.
export function ReportDialog({ open, onOpenChange, authorName, finalFocusRef }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent finalFocus={finalFocusRef} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report post</DialogTitle>
          <DialogDescription>
            Reports are anonymous. {authorName} won&apos;t see who reported the post.
          </DialogDescription>
        </DialogHeader>
        {/* Remounts on every open, so the form starts empty each time. */}
        {open && <ReportForm authorName={authorName} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
