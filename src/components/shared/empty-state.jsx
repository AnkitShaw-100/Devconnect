import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Centered icon + message card for empty lists and missing pages.
export function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <Card
      className={cn(
        "items-center px-6 py-12 text-center shadow-xs ring-neutral-200",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-neutral-900">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-neutral-500">{description}</p>
      </div>
      {children}
    </Card>
  );
}
