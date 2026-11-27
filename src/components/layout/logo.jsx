import { CodeXml } from "lucide-react";
import { RouterLink } from "@/components/router/router-links";

export function Logo() {
  return (
    <RouterLink
      to="/"
      className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label="DevConnect home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
        <CodeXml className="size-[18px]" strokeWidth={2.25} />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-neutral-900">
        DevConnect
      </span>
    </RouterLink>
  );
}
