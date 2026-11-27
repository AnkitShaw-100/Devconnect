import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Centered icon + message card for empty lists and missing pages.
export function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <Card
      className={cn(
        "items-center px-6 py-12 text-center shadow-xs",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand-soft-foreground">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </Card>
  );
}
