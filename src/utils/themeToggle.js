export async function clickToggle(page, toggleSelectors) {
  if (!toggleSelectors) return false;

  const selectors = Array.isArray(toggleSelectors) ? toggleSelectors : [toggleSelectors];
  let toggleSuccessful = false;

  // Iterate through selectors to try each one
  for (const selector of selectors) {
    let elementHandle;

    try {
      // Try to get the element handle based on whether it's XPath or CSS
      const isXPath = selector.startsWith("//");
      if (isXPath) {
        elementHandle = (await page.$x(selector))[0];
      } else {
        elementHandle = await page.$(selector);
      }

      // If element is found, wait for visibility and check if it's clickable
      if (elementHandle) {
        await page.waitForSelector(selector, { visible: true, timeout: 5000 });

        // Check if the element is visible and clickable
        const isElementVisible = await page.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }, elementHandle);

        if (isElementVisible) {
          await elementHandle.click();
          await new Promise((r) => setTimeout(r, 1000)); // Wait a second after click
          toggleSuccessful = true;
          break; // Exit the loop if we successfully click the element
        } else {
          console.warn(`⚠️ Element ${selector} is not visible or interactable.`);
        }
      } else {
        console.warn(`⚠️ Selector ${selector} did not find an element.`);
      }
    } catch (err) {
      console.warn(`⚠️ Error with selector ${selector}: ${err.message}`);
    }
  }

  if (!toggleSuccessful) {
    console.warn("⚠️ No matching toggle element found!");
  }

  return toggleSuccessful;
}
