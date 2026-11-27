import { test as base, expect } from "@playwright/test";

// Every test fails if the page logs a console error or throws, which is how
// React reports hydration mismatches between server and browser rendering.
// Specs can allow specific, expected messages with
// test.use({ allowedConsoleErrors: [/pattern/] }).
export const test = base.extend({
  allowedConsoleErrors: [[], { option: true }],
  page: async ({ page, allowedConsoleErrors }, runTest) => {
    const errors = [];
    const record = (text) => {
      if (!allowedConsoleErrors.some((pattern) => pattern.test(text))) errors.push(text);
    };
    page.on("console", (message) => {
      if (message.type() === "error") record(message.text());
    });
    page.on("pageerror", (error) => record(error.message));

    await runTest(page);

    expect(errors, "console errors on the page").toEqual([]);
  },
});

export { expect };

// Marks the current document so a test can prove a navigation was handled
// client-side (marker survives) rather than by a full page load (marker gone).
export async function markDocument(page) {
  await page.evaluate(() => {
    window.__devconnectMarker = true;
  });
}

export async function expectSameDocument(page) {
  expect(await page.evaluate(() => window.__devconnectMarker === true)).toBe(true);
}
