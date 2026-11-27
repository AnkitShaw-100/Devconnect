import { CreatePost } from "@/components/feed/create-post";
import { PostCard } from "@/components/feed/post-card";
import { PageHeader } from "@/components/shared/page-header";
import { currentUser } from "@/data/current-user";
import { getFeedPosts } from "@/lib/developers";

export function HomePage() {
  const firstName = currentUser.name.split(" ")[0];
  const posts = getFeedPosts();

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Catch up on what developers in your network are shipping."
      />
      <CreatePost user={currentUser} />
      <section aria-label="Feed" className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
