async function clickToggle(page, toggleSelector) {
    if (!toggleSelector) return;
  
    const isXPath = toggleSelector.startsWith("//");
    const elementHandle = isXPath
      ? (await page.$x(toggleSelector))[0]
      : await page.$(toggleSelector);
  
    if (elementHandle) {
      await elementHandle.click();
      await page.waitForTimeout(1000); // wait for theme to apply
    } else {
      console.warn("⚠️ Toggle element not found!");
    }
  }
  