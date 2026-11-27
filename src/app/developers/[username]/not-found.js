import { NotFoundPage } from "@/components/pages/not-found-page";

export const metadata = {
  title: "Developer not found · DevConnect",
};

// Unknown usernames. This segment has its own loading.js (a Suspense
// boundary); a not-found file in the same segment sits inside it, so
// notFound() is handled there instead of escaping the boundary (which made
// React fall back to client rendering and log error #419).
export default function DeveloperNotFound() {
  return <NotFoundPage />;
}
