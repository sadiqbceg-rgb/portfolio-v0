import { chromium } from 'playwright';

/**
 * Launches Chromium for the repo's scripts.
 *
 * Normally Playwright finds the browser it downloaded itself, so a fresh
 * clone needs `npx playwright install chromium` once and nothing else.
 *
 * Some environments (CI images, sandboxes, Nix) ship a Chromium already and
 * block the download. Point CHROMIUM_PATH at that binary and it is used
 * instead. The version does not have to match the Playwright package — these
 * scripts only screenshot and read the DOM.
 */
export function launchChromium(options = {}) {
  const executablePath = process.env.CHROMIUM_PATH || undefined;
  return chromium.launch({
    ...options,
    ...(executablePath ? { executablePath } : {}),
  });
}
