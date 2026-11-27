"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { CircleExclamationPoint, RotateCw } from "lucide-react";
import "./globals.css";

/**
 * Last-resort error page for errors in the root layout itself (navbar,
 * sidebars, providers), which app/error.js can't catch. It replaces the
 * whole document, so it brings its own <html>, <body>, styles and dark
 * theme, and uses only plain elements in case shared components are what
 * failed. Details stay in the console.
 */
export default function GlobalError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark scheme-dark h-full antialiased">
      <body className="flex min-h-full items-center justify-center bg-background p-6 font-sans text-foreground">
        <title>Something went wrong · DevConnect</title>
        <main className="w-full max-w-sm space-y-4 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand-soft-foreground">
            <CircleExclamationPoint className="size-6" aria-hidden="true" />
          </span>
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            DevConnect couldn&apos;t load. Try again, or reload the page.
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              <RotateCw className="size-4" aria-hidden="true" />
              Try again
            </button>
            {/* A full reload: the app shell itself failed, so client-side
                navigation can't be trusted. */}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              Reload page
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
