import path from "path";
import fs from "fs";
import { captureScreenshot } from "./utils/screenshot_capture.js";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";  
import { laptop, tablet, mobile } from "./config/deviceConfigs.js";
import { embedScreenshotInMockup } from "./utils/embed.js";

// Set up yargs to accept either named options or positional arguments
const argv = yargs(hideBin(process.argv))
  .command(
    "$0 <url> [devices] [output] [selectors]",
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
          default: "laptop",
        })
        .positional("output", {
          describe: "Path to save the result or the screenshot + mockups",
          type: "string",
          default: "public",
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
    default: "laptop",
  })
  .option("output", {
    alias: "o",
    description: "Path to save the result or the screenshot + mockups",
    type: "string",
    default: "public",
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

  if (argv.selectors === 'null') argv.selectors = null;

  const selectors = argv.selectors ? argv.selectors.split(",").map(s => s.trim()) : [];

  console.log("URL:", argv.url);
  console.log("Output:", path.resolve(argv.output));
  console.log("Devices:", devices);
  console.log("Selectors:", selectors);


  const testUrl = argv.url;
  const savePath = argv.output
  ? (path.isAbsolute(argv.output.trim()) ? path.resolve(argv.output.trim()) : path.resolve(argv.output.trim()))
  : path.resolve("public");

  // Reject if it looks like a file path (e.g., includes file extension)
  if (path.extname(savePath)) {
    console.error("❌ Error: Output must be a directory, not a file path.");
    process.exit(1);
  }

  // If the directory doesn't exist, create it
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
}



  const results = await Promise.all(
  devices.map(async (device) => {
      const screenshotBuffers = await captureScreenshot(
        testUrl,
        {
          width: device.screenPosition.width,
          height: device.screenPosition.height,
        },
        selectors
      );

      if (screenshotBuffers?.length) {
        return { device, screenshotBuffers };
      } else {
        console.warn(`⚠️ Skipping ${device.name} — no screenshots captured.`);
        return null;
      }
    })
  );

  const buffersPerDevice = results.filter(Boolean);


  if (buffersPerDevice.length === 0) {
    console.error("❌ The link provided appears to be invalid or unreachable.");
    process.exit(1); // optional: exit script with error code
  }

  
  for (const { device, screenshotBuffers } of buffersPerDevice) {
    const deviceLabel = device.name?.toLowerCase() || "device";

    for (let i = 0; i < screenshotBuffers.length; i++) {
      const themeLabel = screenshotBuffers.length === 2 ? `_theme${i + 1}` : "";
      const outputPath = path.join(savePath, `output_${deviceLabel}${themeLabel}.png`);
      await embedScreenshotInMockup({
        ...device,
        screenshotBuffer: screenshotBuffers[i],
        outputPath,
      });
    }
  }


}



