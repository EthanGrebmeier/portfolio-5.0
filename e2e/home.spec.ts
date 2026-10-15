import { expect, test } from "@playwright/test";

test("project navigation follows the visible viewport while pinned", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Personal projects" });
  await expect(section).toHaveAttribute("data-enhanced", "true");
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByText("Scroll to explore", { exact: true })).toHaveCount(0);
  await expect(section.locator("[data-flap]")).toHaveText(["", "", ""]);

  const navigation = page.getByRole("navigation", { name: "Choose a project" });
  const scrollIntoStage = async () => {
    await section.evaluate((element) => {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY + 250, behavior: "instant" });
    });
  };
  const expectBottomNavigation = async () => {
    await expect.poll(async () => {
      const bounds = await navigation.boundingBox();
      return Math.abs(page.viewportSize()!.height - bounds!.y - bounds!.height - 16);
    }).toBeLessThan(2);
  };

  await scrollIntoStage();
  await expectBottomNavigation();

  // Model the visible viewport growing as mobile browser controls collapse.
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: viewport.width, height: viewport.height + 90 });
  await expectBottomNavigation();

  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await scrollIntoStage();
  await expectBottomNavigation();
});

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
