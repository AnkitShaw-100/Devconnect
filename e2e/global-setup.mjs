import { chromium } from "@playwright/test";

// Runs once after the web server starts and before any test. Loading each
// route once warms the server and the disk cache, so the first tests aren't
// slowed down by a cold start (on a busy machine, cold first loads took
// 15-40s and used up the 30s test timeout). Tests still run every page
// themselves; this only removes start-up cost.
const routes = ["/", "/explore", "/bookmarks", "/profile", "/developers/priyacodes", "/not-a-page"];

export default async function globalSetup(config) {
  const baseURL = config.projects[0].use.baseURL;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { timeout: 120_000 });
    await page.waitForSelector("html[data-hydrated]", { state: "attached", timeout: 120_000 });
  }
  await browser.close();
}
