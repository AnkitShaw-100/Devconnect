import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The icon + label/count button used for post actions (like, comment,
 * bookmark, share). `active` switches to `activeClassName` and fills the
 * icon, so toggles look the same everywhere. No hooks, so it works in
 * Server and Client Components; the toggling itself lives in the caller.
 */
export function ActionButton({
  icon: Icon,
  active = false,
  activeClassName,
  fillWhenActive = true,
  className,
  children,
  ...props
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("text-muted-foreground", active && activeClassName, className)}
      {...props}
    >
      <Icon className={cn(active && fillWhenActive && "fill-current")} aria-hidden="true" />
      {children}
    </Button>
  );
}
