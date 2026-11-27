"use client";

import { useId, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/shared/action-button";

// Rendered only while the dialog is open (in the browser), so reading
// window.location here can't cause a hydration mismatch.
function ShareLink({ path }) {
  const inputId = useId();
  const [status, setStatus] = useState("idle"); // idle | copied | failed
  const url = `${window.location.origin}${path}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
        Post link
      </label>
      <div className="flex gap-2">
        <Input
          id={inputId}
          readOnly
          value={url}
          onFocus={(event) => event.target.select()}
          className="h-9 font-mono text-xs"
        />
        <Button onClick={copy} className="h-9">
          {status === "copied" ? <Check /> : <Copy />}
          {status === "copied" ? "Copied" : "Copy"}
        </Button>
      </div>
      <p role="status" className="min-h-5 text-xs text-muted-foreground">
        {status === "copied" && "Link copied to your clipboard."}
        {status === "failed" && "Couldn't copy automatically. Select the link and copy it."}
      </p>
    </div>
  );
}

export function ShareDialog({ path, authorName }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<ActionButton icon={Share2} className="ml-auto" fillWhenActive={false} />}
      >
        Share
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share post</DialogTitle>
          <DialogDescription>Send this post by {authorName} to someone.</DialogDescription>
        </DialogHeader>
        <ShareLink path={path} />
      </DialogContent>
    </Dialog>
  );
}
