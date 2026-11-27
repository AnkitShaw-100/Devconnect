import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCardSkeleton } from "@/components/feed/post-card-skeleton";

// Same shape as the profile header (banner, overlapping avatar, name, bio,
// stats) so the page doesn't jump when the real profile arrives.
export function ProfileSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading profile">
      <Card className="gap-0 py-0 shadow-xs" aria-hidden="true">
        <Skeleton className="aspect-[3/1] max-h-52 w-full rounded-none" />
        <div className="px-4 pb-5 sm:px-6">
          <div className="flex items-start justify-between">
            <Skeleton className="-mt-12 size-24 rounded-full ring-4 ring-card sm:-mt-16 sm:size-32" />
            <Skeleton className="mt-3 h-9 w-28 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-6 w-44" />
          <Skeleton className="mt-2 h-4 w-28" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <div className="mt-4 flex gap-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </Card>
      <PostCardSkeleton />
      <span className="sr-only">Loading profile…</span>
    </div>
  );
}
