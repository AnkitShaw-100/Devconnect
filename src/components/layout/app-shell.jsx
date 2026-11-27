import { Navbar } from "@/components/layout/navbar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Sidebar } from "@/components/layout/sidebar";

// Three-column dashboard: left nav (md+), main content, right rail (lg+).
export function AppShell({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <aside className="hidden md:block">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
        <aside className="hidden lg:block" aria-label="Community highlights">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}
