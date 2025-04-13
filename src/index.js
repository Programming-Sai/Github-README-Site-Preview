import path from "path";
import { captureScreenshot } from "./utils/screenshot_capture.js";

import { laptop, tablet, mobile } from "./config/deviceConfigs.js";
import { embedScreenshotInMockup } from "./utils/embed.js";

const testUrl = "https://blog-da9s.vercel.app/about";
// const testUrl = "https://github.com";
const savePath = path.resolve("public\\preview.png");

// const config = laptop;
const config = tablet;
// const config = mobile;


await captureScreenshot(testUrl, {
    width: config?.screenPosition?.width,
    height: config?.screenPosition?.height,
  outputPath: savePath,
});





await embedScreenshotInMockup(config);