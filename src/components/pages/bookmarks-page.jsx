import { Bookmark } from "lucide-react";
import { PostCard } from "@/components/feed/post-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { getBookmarkedPosts } from "@/lib/developers";

export function BookmarksPage() {
  const posts = getBookmarkedPosts();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Bookmarks"
        description="Posts you've saved to come back to later."
      />
      {posts.length > 0 ? (
        <section aria-label="Bookmarked posts" className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Save posts you want to revisit and they'll show up here."
        />
      )}
    </div>
  );
}
