import puppeteer from "puppeteer";

/**
 * Capture a screenshot of a webpage.
 * @param {string} url - The site URL to capture.
 * @param {object} options - { width, height, outputPath }
 */
export async function captureScreenshot(url, themeToggleSelector, { width = 1280, height = 720, outputPath }) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, });

  // Log page output and errors
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("error", (err) => console.error("PAGE ERROR:", err));

  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });

    // Delay manually
    await new Promise((r) => setTimeout(r, 3000));

    // Capture dark
    await clickToggle(page, toggleSelector);
    await page.screenshot({ path: darkOutput });

    // Capture light
    await clickToggle(page, toggleSelector);
    await page.screenshot({ path: lightOutput });
    console.log(`✅ Screenshot saved to ${outputPath}`);
  } catch (err) {
    console.error("❌ Error taking screenshot:", err.message);
  } finally {
    await browser.close();
  }
}
