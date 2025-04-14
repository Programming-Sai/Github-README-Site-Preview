import sharp from "sharp";

/**
 * Embeds a screenshot (as buffer) into a mockup image with rounded corners.
 * @param {object} options - Configuration options.
 * @param {Buffer} options.screenshotBuffer - The screenshot buffer.
 * @param {string} options.mockupPath - Path to mockup image.
 * @param {string} options.outputPath - Output file path.
 * @param {object} options.screenPosition - { top, left, width, height }
 * @param {number} [options.borderRadius=20] - Optional rounded corner radius.
 */



export async function embedScreenshotInMockup({
  screenshotBuffer,
  mockupPath,
  outputPath,
  screenPosition, // { top, left, width, height }
  borderRadius = 20, // Optional: default to 40px
}) {
  // Resize screenshot
  const resizedScreenshot = await sharp(screenshotBuffer)
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




