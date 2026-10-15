import { expect, test } from "@playwright/test";

test("homepage keeps normal spacing and stays inside the viewport", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const heading = page.getByRole("heading", { name: "Ethan Grebmeier", exact: true });
  await expect(heading).toBeVisible();
  const width = page.viewportSize()!.width;
  const layout = await heading.evaluate((element) => {
    const intro = element.parentElement!.parentElement!;
    const pageContent = intro.parentElement!.parentElement!;
    const bounds = element.getBoundingClientRect();
    return {
      left: bounds.left,
      right: bounds.right,
      width: bounds.width,
      padding: getComputedStyle(intro).paddingLeft,
      gap: getComputedStyle(pageContent).rowGap,
      documentWidth: document.documentElement.scrollWidth,
    };
  });

  // Tailwind v4 owns --spacing. A local 48px override previously made
  // md:px-16 resolve to 768px and squeezed the heading to zero width.
  expect(layout.padding).toBe(width >= 768 ? "64px" : "16px");
  expect(layout.gap).toBe("32px");
  expect(layout.width).toBeGreaterThan(300);
  expect(layout.left).toBeGreaterThanOrEqual(0);
  expect(layout.right).toBeLessThanOrEqual(width);
  expect(layout.documentWidth).toBe(width);
  const logo = await page.getByRole("img", { name: "Github logo" }).boundingBox();
  expect(logo!.width).toBeGreaterThan(32);
  expect(logo!.width).toBeLessThanOrEqual(44);

  await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });
});
