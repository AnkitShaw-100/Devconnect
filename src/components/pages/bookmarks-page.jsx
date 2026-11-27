import { Bookmark } from "lucide-react";
import { BookmarkedPosts } from "@/components/feed/bookmarked-posts";
import { PostCard } from "@/components/feed/post-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { getFeedPosts } from "@/lib/developers";

export function BookmarksPage() {
  // Every post is rendered on the server; BookmarkedPosts (client) shows the
  // ones that are bookmarked, so the page follows bookmarks made elsewhere.
  const serverPosts = getFeedPosts().map((post) => ({
    id: post.id,
    card: <PostCard post={post} />,
  }));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Bookmarks"
        description="Posts you've saved to come back to later."
      />
      <BookmarkedPosts
        serverPosts={serverPosts}
        emptyState={
          <EmptyState
            icon={Bookmark}
            title="No bookmarks yet"
            description="Save posts you want to revisit and they'll show up here."
          />
        }
      />
    </div>
  );
}
