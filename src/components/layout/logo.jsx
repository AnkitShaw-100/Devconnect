import { CodeXml } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring"
      aria-label="DevConnect home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
        <CodeXml className="size-[18px]" strokeWidth={2.25} />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-foreground">
        DevConnect
      </span>
    </Link>
  );
}
