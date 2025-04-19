import puppeteer from "puppeteer";
import { clickToggle } from "./themeToggle.js";

/**
 * Capture one or two screenshots of a webpage.
 * @param {string} url - The site URL to capture.
 * @param {object} options - { width, height }
 * @param {string|null} themeToggleSelector - Optional selector to toggle themes.
 * @returns {Promise<Buffer[]>} - Array of screenshot buffers.
 */



export async function captureScreenshot(url, { width = 1280, height = 720 }, themeToggleSelector = null) {
  if (themeToggleSelector === "null") themeToggleSelector = null;
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const buffers = [];
  const page = await browser.newPage();
  await page.setViewport({ width, height, });

  // Log page output and errors
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("error", (err) => console.error("PAGE ERROR:", err));

  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });

    // Delay manually
    await new Promise((r) => setTimeout(r, 3000));

    if (Array.isArray(themeToggleSelector) && themeToggleSelector.length > 0) {

      const buffer1 = await page.screenshot();
      buffers.push(buffer1);
      await clickToggle(page, themeToggleSelector);
      const buffer2 = await page.screenshot();
      buffers.push(buffer2);

      console.log(`✅ Screenshots Taken.`);
    } else {
      const buffer = await page.screenshot();
      buffers.push(buffer);
      console.log(`✅ Screenshot Taken`);
    } 

    return buffers;
    
  } catch (err) {
    console.error("❌ Error   taking screenshot:", err.message);
    return []; 
  } finally {
    await browser.close();
  }
}
