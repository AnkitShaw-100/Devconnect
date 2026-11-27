"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "@/components/layout/nav-link";
import { SearchBar } from "@/components/layout/search-bar";
import { primaryNav } from "@/data/navigation";

// Slide-out navigation for screens below the md breakpoint.
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 p-0">
        <SheetHeader className="border-b">
          <SheetTitle>DevConnect</SheetTitle>
          <SheetDescription>Navigate the community</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <SearchBar />
        </div>
        <nav aria-label="Mobile" className="px-3">
          <ul className="space-y-1">
            {primaryNav.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <NavLink href={href} onClick={() => setOpen(false)}>
                  <Icon className="size-[18px]" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
