import { Skeleton } from "@/components/ui/skeleton";
import { PostCardSkeleton } from "@/components/feed/post-card-skeleton";

// Loading version of AppShell. It renders outside the router, so it uses no
// links, only shapes matching the real layout.
export function AppShellSkeleton() {
  return (
    <div className="flex min-h-full flex-1 flex-col" role="status" aria-label="Loading">
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="ml-6 hidden h-9 w-full max-w-md rounded-full md:block" />
          <Skeleton className="ml-auto size-9 rounded-full" />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <div className="hidden space-y-4 md:block">
          <Skeleton className="h-44 w-full rounded-xl" />
          <div className="space-y-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-4">
          <Skeleton className="h-7 w-56" />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
        <div className="hidden space-y-4 lg:block">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      </div>
      <span className="sr-only">Loading DevConnect…</span>
    </div>
  );
}
