"use client";

import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

// Client wrappers so Server Components can render router links without
// passing functions (like NavLink's className callback) across the boundary.

export function RouterLink({ className, ...props }) {
  return <Link className={className} {...props} />;
}

export function SidebarNavLink({ to, className, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
          className
        )
      }
    >
      {children}
    </NavLink>
  );
}
