"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath } from "@/lib/paths";

function NavLinkView({ href, active, onClick, className, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "outline-none focus-visible:ring-3 focus-visible:ring-ring",
        active
          ? "bg-brand-soft text-brand-soft-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
