import path from "path";
import { captureScreenshot } from "./utils/screenshot_capture.js";

import { laptop, tablet, mobile } from "./config/deviceConfigs.js";
import { embedScreenshotInMockup } from "./utils/embed.js";

const testUrl = "https://blog-da9s.vercel.app/about";
// const testUrl = "https://github.com";
const savePath = path.resolve("public\\preview.png");

// const config = laptop;
// const config = tablet;
// const config = mobile;



const devices = [laptop, tablet, mobile];

const buffersPerDevice = [];

for (const device of devices) {
  const screenshotBuffers = await captureScreenshot(
    testUrl,
    {
      width: device.screenPosition.width,
      height: device.screenPosition.height,
      outputPath: path.resolve("public/preview.png"), // Temp name, will change later
    },
    [
      "#categoryTop > div.navbar_header__KApwF > div.navbar_end__6YQcj > div.themetoggle_container__SfpgS",
      "#categoryTop > div.navbar_header__KApwF > div:nth-child(3) > div",
    ]
  );

  if (screenshotBuffers?.length) {
    buffersPerDevice.push({ device, screenshotBuffers });
  } else {
    console.warn(`⚠️ Skipping ${device.name} — no screenshots captured.`);
  }
  
}

for (const { device, screenshotBuffers } of buffersPerDevice) {
  const deviceLabel = device.name?.toLowerCase() || "device";

  for (let i = 0; i < screenshotBuffers.length; i++) {
    const themeLabel = screenshotBuffers.length === 2 ? `_theme${i + 1}` : "";
    const outputPath = path.resolve(`public/output_${deviceLabel}${themeLabel}.png`);
    await embedScreenshotInMockup({
      ...device,
      screenshotBuffer: screenshotBuffers[i],
      outputPath,
    });
  }
}




// const buffers = await captureScreenshot(
//   testUrl,
//   {
//     width: config?.screenPosition?.width,
//     height: config?.screenPosition?.height,
//     outputPath: savePath,
//   },
//   [
//     "#categoryTop > div.navbar_header__KApwF > div.navbar_end__6YQcj > div.themetoggle_container__SfpgS",
//     "#categoryTop > div.navbar_header__KApwF > div:nth-child(3) > div",
//   ]
// );


// for (let i = 0; i < buffers.length; i++) {
//   const themeLabel = buffers.length === 2 ? `_theme${i + 1}` : "";
//   const outputPath = savePath.replace(/\.png$/, `${themeLabel}.png`);
//   await embedScreenshotInMockup({
//     screenshotBuffer: buffers[i],
//     mockupPath: config.mockupPath,
//     outputPath,
//     screenPosition: config.screenPosition,
//     borderRadius: config.borderRadius,
//   });
  
// }





// // await embedScreenshotInMockup(config);