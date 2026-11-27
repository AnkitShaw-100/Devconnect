import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar({ className }) {
  return (
    <form role="search" className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400"
        aria-hidden="true"
      />
      <Input
        type="search"
        name="q"
        placeholder="Search developers, posts, technologies"
        aria-label="Search DevConnect"
        className="h-9 rounded-full border-neutral-200 bg-neutral-100 pl-9 shadow-none focus-visible:bg-white"
      />
    </form>
  );
}
