"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { CircleExclamationPoint, RotateCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

// Replaces the page (including the app shell) when rendering throws.
// Only a generic message is shown; details stay in the console.
export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-16">
      <EmptyState
        icon={CircleExclamationPoint}
        title="Something went wrong"
        description="We couldn't load this page. Try again, or head back to the home feed."
        className="w-full"
      >
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" onClick={() => retry()}>
            <RotateCw />
            Try again
          </Button>
          {/* Outside React Router here, so this uses Next.js navigation. */}
          <Link href="/" className={buttonVariants({ size: "sm", variant: "outline" })}>
            Go to home
          </Link>
        </div>
      </EmptyState>
    </main>
  );
}
