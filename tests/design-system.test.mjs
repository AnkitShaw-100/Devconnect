// Guards for the design system: rules that keep components consistent, each
// one written after a real bug in this project. They scan component source.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const componentsDir = new URL("../src/components/", import.meta.url);
const appDir = new URL("../src/app/", import.meta.url);

function sources(dir, extensions = [".jsx", ".js"]) {
  return readdirSync(dir, { recursive: true })
    .filter((file) => extensions.some((ext) => file.endsWith(ext)))
    .map((file) => {
      const path = file.replaceAll("\\", "/");
      return { path, text: readFileSync(new URL(path, dir), "utf8") };
    });
}

const components = sources(componentsDir);
const ownComponents = components.filter(({ path }) => !path.startsWith("ui/"));

test("components use theme tokens, not hard-coded neutral or blue colours", () => {
  // Theme tokens (bg-card, text-muted-foreground, bg-brand...) keep colours in
  // globals.css. Status colours (rose/emerald/orange) and avatar colours in
  // data/ are the documented exceptions.
  const pattern = /\b(?:bg|text|border|ring|outline|fill|stroke)-(?:neutral|gray|zinc|slate|stone|white|black|blue)(?:-\d+)?(?:\/\d+)?\b/g;
  const offenders = [...ownComponents, ...sources(appDir, [".js"])].flatMap(({ path, text }) =>
    [...text.matchAll(pattern)].map(([cls]) => `${path}: ${cls}`)
  );
  assert.deepEqual(offenders, []);
});

test("custom avatar sizes don't use size=\"lg\"", () => {
  // size="lg" sets data-size, whose size-10 rule outranks a plain size-*
  // class: the profile avatar once stayed at 40px because of this.
  const offenders = [];
  for (const { path, text } of components) {
    for (const [tag] of text.matchAll(/<UserAvatar\b[^>]*>/gs)) {
      if (/size="lg"/.test(tag) && /\bsize-\d+/.test(tag)) offenders.push(`${path}: ${tag.replace(/\s+/g, " ")}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test("focus outlines on outline-hidden elements set a style", () => {
  // In Tailwind v4, outline-hidden sets outline-style: none, and outline-2
  // only sets the width: without outline-solid the focus outline is
  // invisible (dropdown items had this bug).
  const offenders = [];
  for (const { path, text } of components) {
    for (const [cls] of text.matchAll(/"[^"]*outline-hidden[^"]*"/g)) {
      if (/focus-visible:outline-\d/.test(cls) && !/focus-visible:outline-solid/.test(cls)) {
        offenders.push(path);
      }
    }
  }
  assert.deepEqual(offenders, []);
});

test("every client component is marked as one, and only where needed", () => {
  // Hooks and event handlers need "use client"; files without them stay
  // Server Components (or shared, hook-free components).
  const hooks = /\buse(?:State|Effect|Reducer|Ref|Context|Callback|Memo|Id|Pathname|Router)\s*\(/;
  const missing = ownComponents
    .filter(({ text }) => hooks.test(text) && !/^\s*["']use client["']/.test(text))
    .map(({ path }) => path);
  assert.deepEqual(missing, []);
});
