import { Card } from "@/components/ui/card";

// Shared layout for routes whose features arrive in later milestones.
export function PlaceholderPage({ icon: Icon, title, description, children }) {
  return (
    <div className="space-y-4">
      <h1 className="px-1 text-2xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h1>
      <Card className="items-center px-6 py-14 text-center shadow-xs ring-neutral-200">
        <span className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <p className="max-w-sm text-sm text-neutral-500">{description}</p>
        {children}
      </Card>
    </div>
  );
}
