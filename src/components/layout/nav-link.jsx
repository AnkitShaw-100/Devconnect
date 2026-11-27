"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath } from "@/lib/paths";

// "sidebar": icon + label in a row (desktop sidebar, mobile menu).
// "tab": icon over a small label (mobile bottom bar).
const variants = {
  sidebar: {
    base: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
    active: "bg-brand-soft text-brand-soft-foreground",
    inactive: "text-muted-foreground hover:bg-muted hover:text-foreground",
  },
  tab: {
    base: "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium",
    active: "text-brand-soft-foreground",
    inactive: "text-muted-foreground hover:text-foreground",
  },
};

function NavLinkView({ href, active, onClick, variant = "sidebar", className, children }) {
  const styles = variants[variant];
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        styles.base,
        "transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring",
        active ? styles.active : styles.inactive,
        className
      )}
    >
      {children}
    </Link>
  );
}

function ActiveNavLink(props) {
  const pathname = usePathname();
  return <NavLinkView {...props} active={isActivePath(pathname, props.href)} />;
}

/**
 * Sidebar / mobile-menu link with an active state.
 *
 * With Cache Components, usePathname() suspends while prerendering a URL
 * whose dynamic params weren't known at build time (e.g. an unknown
 * /developers/... URL). The Suspense fallback renders the same link without
 * the highlight, so the rest of the layout can still be prerendered.
 */
export function NavLink(props) {
  return (
    <Suspense fallback={<NavLinkView {...props} active={false} />}>
      <ActiveNavLink {...props} />
    </Suspense>
  );
}
