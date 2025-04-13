import sharp from "sharp";

/**
 * Embeds a screenshot into a mockup image with rounded corners.
 * @param {object} options - Configuration options
 */
export async function embedScreenshotInMockup({
  screenshotPath,
  mockupPath,
  outputPath,
  screenPosition, // { top, left, width, height }
  borderRadius = 20, // Optional: default to 40px
}) {
  // Resize screenshot
  const resizedScreenshot = await sharp(screenshotPath)
    .resize(screenPosition.width, screenPosition.height)
    .toBuffer();

  // Create SVG mask with rounded corners
  const maskSvg = Buffer.from(`
    <svg width="${screenPosition.width}" height="${screenPosition.height}">
      <rect x="0" y="0" width="${screenPosition.width}" height="${screenPosition.height}" rx="${borderRadius}" ry="${borderRadius}" />
    </svg>
  `);

  // Apply the mask to get rounded corners
  const clippedScreenshot = await sharp(resizedScreenshot)
    .composite([{ input: maskSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Place the clipped screenshot onto the mockup
  await sharp(mockupPath)
    .composite([
      {
        input: clippedScreenshot,
        top: screenPosition.top,
        left: screenPosition.left,
      },
    ])
    .toFile(outputPath);

  console.log(`✅ Embedded image with rounded corners saved to ${outputPath}`);
}






// import sharp from 'sharp';
// import fs from 'fs';

// /**
//  * Embed screenshot into a mockup with rounded corners
//  * @param {Buffer} screenshotImage - The screenshot image buffer.
//  * @param {string} mockupImagePath - The mockup image path.
//  * @param {object} position - Positioning of the screenshot (top, left, width, height).
//  * @param {string} outputPath - Where to save the final mockup with embedded screenshot.
//  */
// export async function embedScreenshotInMockupWithRoundedCorners(screenshotImage, mockupImagePath, position, outputPath) {
//   // Load the mockup image
//   const mockupImage = sharp(mockupImagePath);

//   // Load the screenshot image and resize to fit the screen area
//   const resizedScreenshot = await sharp(screenshotImage)
//     .resize(position.width, position.height)
//     .toBuffer();

//   // Create a rounded rectangle mask (for clipping corners)
//   const mask = Buffer.from(`
//     <svg width="${position.width}" height="${position.height}">
//       <rect x="0" y="0" width="${position.width}" height="${position.height}" rx="40" ry="40" />
//     </svg>
//   `);

//   // Composite the screenshot and the mask onto the mockup
//   await mockupImage
//     .composite([
//       { input: resizedScreenshot, top: position.top, left: position.left, raw: { width: position.width, height: position.height, channels: 4 }, blend: 'over' },
//       { input: mask, raw: { width: position.width, height: position.height, channels: 4 }, blend: 'dest-in' },
//     ])
//     .toFile(outputPath);

//   console.log(`✅ Final image with rounded corners saved to ${outputPath}`);
// }

// // // Example usage:
// // embedScreenshotInMockupWithRoundedCorners(
// //   'screenshot.png',   // Screenshot image path
// //   'mockup.png',       // Mockup image path
// //   { top: 120, left: 80, width: 375, height: 812 }, // Position
// //   'final_mockup.png'  // Output path for final image
// // );
