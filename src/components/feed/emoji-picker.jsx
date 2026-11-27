"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

// A small, curated set: enough for a dev community, no extra package.
const EMOJIS = [
  ["😀", "grinning face"], ["😂", "tears of joy"], ["🙂", "slightly smiling face"], ["😉", "winking face"],
  ["😍", "heart eyes"], ["🤔", "thinking face"], ["😅", "sweat smile"], ["😎", "cool face"],
  ["🥳", "partying face"], ["😴", "sleeping face"], ["🤯", "mind blown"], ["😬", "grimacing face"],
  ["👍", "thumbs up"], ["👎", "thumbs down"], ["👏", "clapping hands"], ["🙌", "raised hands"],
  ["🙏", "folded hands"], ["💪", "flexed biceps"], ["👀", "eyes"], ["🤝", "handshake"],
  ["❤️", "red heart"], ["🔥", "fire"], ["✨", "sparkles"], ["🎉", "party popper"],
  ["🚀", "rocket"], ["💡", "light bulb"], ["⚡", "high voltage"], ["✅", "check mark"],
  ["❌", "cross mark"], ["⚠️", "warning"], ["🐛", "bug"], ["🛠️", "hammer and wrench"],
  ["💻", "laptop"], ["⌨️", "keyboard"], ["🧠", "brain"], ["📦", "package"],
  ["📈", "chart increasing"], ["☕", "hot beverage"], ["🌙", "crescent moon"], ["🎯", "direct hit"],
];

/**
 * Emoji button + popover grid. Picking an emoji calls `onPick(emoji)` and
 * closes the popover; focus returns to the button (Base UI default).
 */
export function EmojiPicker({ onPick }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full text-brand-soft-foreground hover:bg-brand-soft hover:text-brand-soft-foreground"
            aria-label="Add emoji"
          />
        }
      >
        <Smile />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={6} className="z-50">
          <Popover.Popup className="w-72 rounded-xl bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none">
            <Popover.Title className="px-1 pb-1.5 text-xs font-medium text-muted-foreground">
              Emoji
            </Popover.Title>
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJIS.map(([emoji, name]) => (
                <button
                  key={name}
                  type="button"
                  aria-label={name}
                  title={name}
                  onClick={() => {
                    onPick(emoji);
                    setOpen(false);
                  }}
                  className="flex size-8 items-center justify-center rounded-md text-lg hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
