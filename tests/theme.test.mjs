// Checks WCAG contrast of the dark theme using the real colour values from
// src/app/globals.css (.dark block) and Tailwind's palette, so the test
// follows the theme if its colours change.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { developers } from "../src/data/developers.js";

const require = createRequire(import.meta.url);
const globalsCss = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const tailwindCss = readFileSync(require.resolve("tailwindcss/theme.css"), "utf8");

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3; // icons and focus indicators

// --- colour maths: oklch -> sRGB, alpha compositing, relative luminance ---

function parseOklch(value) {
  const match = value.match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)(%?))?\s*\)/);
  assert.ok(match, `not an oklch colour: ${value}`);
  const [, l, lPercent, c, h, alpha, alphaPercent] = match;
  return {
    l: Number(l) / (lPercent ? 100 : 1),
    c: Number(c),
    h: Number(h),
    alpha: alpha === undefined ? 1 : Number(alpha) / (alphaPercent ? 100 : 1),
  };
}

const toGamma = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const toLinear = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const clamp = (x) => Math.min(1, Math.max(0, x));

// Returns gamma-encoded sRGB channels (0..1) plus alpha.
function oklchToSrgb({ l, c, h, alpha }) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return { rgb: linear.map((x) => toGamma(clamp(x))), alpha };
}

// Browsers blend translucent colours in gamma-encoded sRGB.
function composite(top, bottom) {
  return {
    rgb: top.rgb.map((x, i) => x * top.alpha + bottom.rgb[i] * (1 - top.alpha)),
    alpha: 1,
  };
}

const luminance = ({ rgb }) => {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

function contrast(foreground, background) {
  const [hi, lo] = [luminance(foreground), luminance(background)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// --- reading the theme ---

function cssVariables(block) {
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()])
  );
}

const darkBlock = globalsCss.match(/\.dark\s*\{([^}]*)\}/)[1];
const dark = cssVariables(darkBlock);
const palette = cssVariables(tailwindCss);

const token = (name) => oklchToSrgb(parseOklch(dark[name]));
const tailwind = (name, alpha = 1) => {
  const colour = oklchToSrgb(parseOklch(palette[`color-${name}`]));
  return { ...colour, alpha };
};

// Solid surfaces the UI is drawn on.
const background = token("background");
const card = token("card");
const muted = token("muted");
const secondary = token("secondary");
const on = (colour, surface) => composite(colour, surface);

function assertContrast(label, foreground, surface, minimum) {
  const ratio = contrast(on(foreground, surface), surface);
  assert.ok(
    ratio >= minimum,
    `${label}: contrast ${ratio.toFixed(2)}:1 is below ${minimum}:1`
  );
}

// --- tests ---

test("the root layout turns the dark theme on by default", () => {
  const layout = readFileSync(new URL("../src/app/layout.js", import.meta.url), "utf8");
  assert.match(layout, /className=\{`dark /);
});

test("body text is readable on every surface", () => {
  for (const [name, surface] of [["background", background], ["card", card], ["muted", muted]]) {
    assertContrast(`foreground on ${name}`, token("foreground"), surface, AA_TEXT);
    assertContrast(`muted-foreground on ${name}`, token("muted-foreground"), surface, AA_TEXT);
  }
});

test("secondary text is readable on tags and stat tiles", () => {
  // Tech tags: muted-foreground on the secondary badge background.
  assertContrast("tag text", token("muted-foreground"), secondary, AA_TEXT);
  // Stat tiles: bg-muted/50 over a card.
  const tile = on({ ...muted, alpha: 0.5 }, card);
  assertContrast("stat label", token("muted-foreground"), tile, AA_TEXT);
});

test("blue accent is readable", () => {
  // Active nav link sits on the page background; empty-state icons on cards.
  for (const [name, surface] of [["background", background], ["card", card]]) {
    const softSurface = on(token("brand-soft"), surface);
    assertContrast(`active link on ${name}`, token("brand-soft-foreground"), softSurface, AA_TEXT);
  }
  assertContrast("accent icon on card", token("brand-soft-foreground"), card, AA_NON_TEXT);
  // Logo mark: white icon on the solid brand colour.
  assertContrast("logo", token("brand-foreground"), token("brand"), AA_TEXT);
  assertContrast("primary button", token("primary-foreground"), token("primary"), AA_TEXT);
});

test("focus rings stay visible", () => {
  for (const [name, surface] of [["background", background], ["card", card]]) {
    assertContrast(`focus ring on ${name}`, token("ring"), surface, AA_NON_TEXT);
  }
});

// Every focus ring in every component, shadcn ui/ included: a translucent
// ring (e.g. focus-visible:ring-ring/50) must still reach 3:1 on its own.
test("every component's focus ring opacity keeps 3:1 contrast", () => {
  const componentsDir = new URL("../src/components/", import.meta.url);
  const files = readdirSync(componentsDir, { recursive: true }).filter((f) => f.endsWith(".jsx"));
  assert.ok(files.length > 20);

  for (const file of files) {
    const source = readFileSync(new URL(file.replaceAll("\\", "/"), componentsDir), "utf8");
    for (const [, opacity] of source.matchAll(/focus-visible:ring-ring(?:\/(\d+))?\b/g)) {
      const ring = { ...token("ring"), alpha: opacity ? Number(opacity) / 100 : 1 };
      for (const [name, surface] of [["background", background], ["card", card]]) {
        const ratio = contrast(on(ring, surface), surface);
        assert.ok(
          ratio >= AA_NON_TEXT,
          `${file}: focus ring ring-ring/${opacity} is ${ratio.toFixed(2)}:1 on ${name}`
        );
      }
    }
  }
});

test("status colours are readable on cards", () => {
  assertContrast("liked count", tailwind("rose-400"), card, AA_TEXT);
  assertContrast("trend change", tailwind("emerald-400"), card, AA_TEXT);
});

test("every avatar colour is readable in dark mode", () => {
  for (const { username, avatarColor } of developers) {
    const bg = avatarColor.match(/dark:bg-([a-z]+-\d+)\/(\d+)/);
    const text = avatarColor.match(/dark:text-([a-z]+-\d+)/);
    assert.ok(bg && text, `${username} has no dark avatar colours`);

    // Avatars appear on cards and on the navbar (page background).
    for (const [name, surface] of [["card", card], ["background", background]]) {
      const avatarSurface = on(tailwind(bg[1], Number(bg[2]) / 100), surface);
      assertContrast(`${username} avatar on ${name}`, tailwind(text[1]), avatarSurface, AA_TEXT);
    }
  }
});

test("the checker catches low contrast (why focus rings use ring-ring, not ring-ring/50)", () => {
  const halfRing = { ...token("ring"), alpha: 0.5 };
  const ratio = contrast(on(halfRing, card), card);
  assert.ok(ratio < AA_NON_TEXT, `expected ring-ring/50 to fail, got ${ratio.toFixed(2)}:1`);
});
