import { AppShellSkeleton } from "@/components/layout/app-shell-skeleton";

// Shown while a page that isn't prerendered is rendered on the server.
// Navigations inside the app are client-side and don't need it.
export default function Loading() {
  return <AppShellSkeleton />;
}
