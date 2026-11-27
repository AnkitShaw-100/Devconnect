import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Uses the shadcn badge styles directly: the Badge component itself calls a
// hook, which would force this into a Client Component.
export function TechTag({ children, className }) {
  return (
    <span
      className={cn(
        badgeVariants({ variant: "secondary" }),
        "rounded-md font-normal text-neutral-600",
        className
      )}
    >
      #{children}
    </span>
  );
}
