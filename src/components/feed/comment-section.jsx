import Link from "next/link";
import { CommentForm } from "@/components/feed/comment-form";
import { UserAvatar } from "@/components/shared/user-avatar";
import { paths } from "@/lib/paths";

function Comment({ comment }) {
  const { author } = comment;
  return (
    <li className="flex items-start gap-3">
      <UserAvatar user={author} />
      <div className="min-w-0 flex-1 rounded-lg bg-muted/50 px-3 py-2">
        <p className="flex flex-wrap items-baseline gap-x-2 text-xs">
          <Link
            href={paths.developer(author.username)}
            className="font-semibold text-foreground hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {author.name}
          </Link>
          <span className="text-muted-foreground">{comment.timestamp}</span>
        </p>
        <p className="mt-0.5 text-sm break-words text-foreground">{comment.content}</p>
      </div>
    </li>
  );
}

// List + form. Rendered by PostActions (a Client Component), so it runs in
// the browser too; it has no hooks of its own.
export function CommentSection({ id, comments, onAdd }) {
  return (
    <section
      id={id}
      aria-label="Comments"
      className="space-y-4 border-t border-border px-4 py-4 sm:px-5"
    >
      {comments.length > 0 ? (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No comments yet. Start the conversation.</p>
      )}
      <CommentForm onSubmit={onAdd} />
    </section>
  );
}
