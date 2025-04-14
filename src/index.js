import path from "path";
import { captureScreenshot } from "./utils/screenshot_capture.js";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";  // use yargs/yargs for ESM
import { laptop, tablet, mobile } from "./config/deviceConfigs.js";
import { embedScreenshotInMockup } from "./utils/embed.js";

// Set up yargs to accept either named options or positional arguments
const argv = yargs(hideBin(process.argv))
  .command(
    "$0 <url> <devices> <output> [selectors]",
    "Capture screenshots with specified parameters",
    (yargs) => {
      yargs
        .positional("url", {
          describe: "URL to capture",
          type: "string",
        })
        .positional("devices", {
          describe: "Comma-separated list of devices (e.g. laptop,tablet,mobile)",
          type: "string",
        })
        .positional("output", {
          describe: "Path to save the screenshot",
          type: "string",
        })
        .positional("selectors", {
          describe: "Comma-separated list of CSS selectors",
          type: "string",
          default: null,
        });
    },
    (argv) => {
      // This callback is executed when the command is used without flag-based options
      processCapture(argv);
    }
  )
  .option("url", {
    alias: "u",
    description: "URL to capture the screenshot of",
    type: "string",
    demandOption: true,
  })
  .option("devices", {
    alias: "d",
    description: "Comma-separated list of devices (e.g., laptop,tablet,mobile)",
    type: "string",
    default: "laptop,tablet,mobile",
  })
  .option("output", {
    alias: "o",
    description: "Path to save the screenshot",
    type: "string",
    default: "public/preview.png",
  })
  .option("selectors", {
    alias: "s",
    description: "Comma-separated list of CSS selectors to capture specific elements",
    type: "string",
    default: null,
  })
  .help()
  .alias("help", "h")
  .argv;

async function processCapture(argv) {
  const devices = argv.devices.split(",").map((device) => {
    switch (device.trim().toLowerCase()) {
      case "laptop":
        return laptop;
      case "tablet":
        return tablet;
      case "mobile":
        return mobile;
      default:
        console.warn(`⚠️ Unknown device: ${device}, skipping.`);
        return null;
    }
  }).filter((device) => device !== null);

  if (devices.length === 0) {
    console.warn("⚠️ No valid devices were selected. Please choose from 'laptop', 'tablet', or 'mobile'.");
  }

  const selectors = argv.selectors ? argv.selectors.split(",").map(s => s.trim()) : [];

  // console.log("URL:", argv.url);
  // console.log("Output:", path.resolve(argv.output));
  // console.log("Devices:", devices);
  // console.log("Selectors:", selectors);


  const testUrl = argv.url;
  const savePath = path.resolve(argv.output);

  const buffersPerDevice = [];

  for (const device of devices) {
    const screenshotBuffers = await captureScreenshot(
      testUrl,
      {
        width: device.screenPosition.width,
        height: device.screenPosition.height,
        outputPath: savePath, // Temp name, will change later
      },
      // [
      //   "#categoryTop > div.navbar_header__KApwF > div.navbar_end__6YQcj > div.themetoggle_container__SfpgS",
      //   "#categoryTop > div.navbar_header__KApwF > div:nth-child(3) > div",
      // ]
      selectors,
    );

    if (screenshotBuffers?.length) {
      buffersPerDevice.push({ device, screenshotBuffers });
    } else {
      console.warn(`⚠️ Skipping ${device.name} — no screenshots captured.`);
    }
    
  }

  if (buffersPerDevice.length === 0) {
    console.error("❌ The link provided appears to be invalid or unreachable.");
    process.exit(1); // optional: exit script with error code
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


}






// // const testUrl = "https://v.com";
// // const testUrl = "https://blog-daa9s.vercel.app/about/llk";
// const testUrl = "https://blog-da9s.vercel.app/about/llk";
// // const testUrl = "https://github.com";
// const savePath = path.resolve("public\\preview.png");

// // const config = laptop;
// // const config = tablet;
// // const config = mobile;



// // const devices = [laptop, tablet, mobile];






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