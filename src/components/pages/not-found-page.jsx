import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { RouterLink } from "@/components/router/router-links";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { paths } from "@/lib/paths";

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Page not found" />
      <EmptyState
        icon={SearchX}
        title="We couldn't find that page"
        description="The page or developer you're looking for doesn't exist. It may have moved, or the link may be wrong."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <RouterLink to={paths.home} className={buttonVariants({ size: "sm" })}>
            Back to home
          </RouterLink>
          <RouterLink
            to={paths.explore}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Explore developers
          </RouterLink>
        </div>
      </EmptyState>
    </div>
  );
}
