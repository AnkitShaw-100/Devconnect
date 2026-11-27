import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Placeholder with the same footprint as PostCard, so content doesn't jump.
export function PostCardSkeleton() {
  return (
    <Card className="gap-0 py-0 shadow-xs ring-neutral-200" aria-hidden="true">
      <div className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="space-y-2 px-4 pt-4 sm:px-5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-2/3" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      <div className="mt-4 flex gap-3 border-t border-neutral-100 px-4 py-3 sm:px-5">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
        <Skeleton className="ml-auto h-5 w-16" />
      </div>
    </Card>
  );
}
