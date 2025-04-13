import path from "path";
import { captureScreenshot } from "./utils/screenshot_capture.js";

// import { embedScreenshotInMockupWithRoundedCorners } from "./utils/embed.js";
import { embedScreenshotInMockup } from "./utils/embed.js";

// // const testUrl = "https://blog-da9s.vercel.app/about";
// const testUrl = "https://github.com";
// const savePath = path.resolve("public\\preview.png");

// captureScreenshot(testUrl, {
//     // width: 686,   // Landscape iPad (11-inch)
//     // height: 985,
//     // width: 335,
//     // height: 670,
//     width: 1560,
//     height: 980,
//   outputPath: savePath,
// });









const mockupPath = "assets\\Laptop.png";
const screenshotPath = "public\\preview.png";
const outputPath = "public\\outputLaptop.png";

// Adjust the values below based on your mockup's screen size and position
const screenPosition = {
  top: 142,
  left: 270,
  width: 1560,
  height: 980,
};
const borderRadius = 1;

embedScreenshotInMockup({
  screenshotPath,
  mockupPath,
  outputPath,
  screenPosition,
  borderRadius,
});














// MOBILE DEVICE
// const mockupPath = "assets\\Mobile.png";
// const screenshotPath = "public\\preview.png";
// const outputPath = "public\\outputMobile.png";

// // Adjust the values below based on your mockup's screen size and position
// const screenPosition = {
//   top: 70,
//   left: 30,
//   width: 335,
//   height: 670,
// };
// const borderRadius = 20;

// embedScreenshotInMockup({
//   screenshotPath,
//   mockupPath,
//   outputPath,
//   screenPosition,
//   borderRadius,
// });












//TABLET DEVICE
// const mockupPath = "assets\\Tablet.png";
// const screenshotPath = "public\\preview.png";
// const outputPath = "public\\output.png";

// // Adjust the values below based on your mockup's screen size and position
// const screenPosition = {
//   top: 63,
//   left: 82,
//   width: 686,
//   height: 985,
// };
// const borderRadius = 20;

// embedScreenshotInMockup({
//   screenshotPath,
//   mockupPath,
//   outputPath,
//   screenPosition,
//   borderRadius,
// });
