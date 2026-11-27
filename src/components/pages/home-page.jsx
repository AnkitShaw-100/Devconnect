import { CreatePost } from "@/components/feed/create-post";
import { PostCard } from "@/components/feed/post-card";
import { currentUser } from "@/data/current-user";
import { posts } from "@/data/posts";

export function HomePage() {
  const firstName = currentUser.name.split(" ")[0];

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Catch up on what developers in your network are shipping.
        </p>
      </div>
      <CreatePost user={currentUser} />
      <section aria-label="Feed" className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
