import { Skeleton } from "@/components/ui/skeleton";
import { PostCardSkeleton } from "@/components/feed/post-card-skeleton";

// Loading placeholder for the main column. The layout around it is real.
export function PageSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      <div className="space-y-2 px-1">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <PostCardSkeleton />
      <PostCardSkeleton />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
