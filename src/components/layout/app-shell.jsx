import { BottomNav } from "@/components/layout/bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { MAIN_CONTENT_ID } from "@/lib/a11y";

// Three-column dashboard: left nav (md+), main content, right rail (lg+).
// Phones get a bottom tab bar instead of the left nav.
export function AppShell({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* First stop for keyboard users: jump past the navbar and sidebar. */}
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:outline-none focus:ring-3 focus:ring-ring"
      >
        Skip to main content
      </a>
      <Navbar />
      {/* pb-24 on phones keeps the last content clear of the bottom tab bar. */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 pt-6 pb-24 sm:px-6 md:grid-cols-[220px_minmax(0,1fr)] md:pb-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <aside className="hidden md:block">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </aside>
        {/* tabIndex -1: the skip link and focus recovery can move focus here. */}
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="min-w-0 scroll-mt-20 outline-none">
          {children}
        </main>
        <aside className="hidden lg:block" aria-label="Community highlights">
          <RightSidebar />
        </aside>
      </div>
      <BottomNav />
    </div>
  );
}
