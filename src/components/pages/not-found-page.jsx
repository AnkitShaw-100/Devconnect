import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { paths } from "@/lib/paths";

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Page not found" />
      <EmptyState
        icon={SearchX}
        title="We couldn't find that page"
        description="The page or developer you're looking for doesn't exist. It may have moved, or the link may be wrong."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <Link href={paths.home} className={buttonVariants({ size: "sm" })}>
            Back to home
          </Link>
          <Link
            href={paths.explore}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Explore developers
          </Link>
        </div>
      </EmptyState>
    </div>
  );
}
