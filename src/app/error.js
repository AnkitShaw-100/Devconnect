"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { CircleExclamationPoint, RotateCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { paths } from "@/lib/paths";

// Replaces the page in the main column when rendering throws; the navbar and
// sidebars from the root layout stay. Only a generic message is shown;
// details stay in the console.
export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <PageHeader title="Something went wrong" />
      <EmptyState
        icon={CircleExclamationPoint}
        title="We couldn't load this page"
        description="Try again, or head back to the home feed."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" onClick={() => retry()}>
            <RotateCw />
            Try again
          </Button>
          <Link
            href={paths.home}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Go to home
          </Link>
        </div>
      </EmptyState>
    </div>
  );
}
