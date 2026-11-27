import { PageSkeleton } from "@/components/shared/page-skeleton";

// Shown in the main column while a page that isn't prerendered is rendered
// on the server. The layout (navbar, sidebars) stays visible around it.
export default function Loading() {
  return <PageSkeleton />;
}
