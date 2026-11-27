import { NotFoundPage } from "@/components/pages/not-found-page";

export const metadata = {
  title: "Page not found · DevConnect",
};

// Used for URLs that match no route, and when a page calls notFound().
// It renders inside the root layout, so the navbar and sidebars stay.
export default function NotFound() {
  return <NotFoundPage />;
}
