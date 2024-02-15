import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('.');
  await expect(page).toHaveTitle(/yFiles Orgchart Component Examples/);
});

test('examples', async ({ page }) => {
  await page.goto('.');
  
  const gcLocator = page.locator('css=.yfiles-canvascomponent:not(.graph-overview-component)')
  await expect(gcLocator).toHaveCount(1)
  
  const comboLocator = page.getByRole('combobox', {name: "examples"})
  await expect(comboLocator).toHaveCount(1)
  
  const options = comboLocator.getByRole("option")
  const optionCount = await options.count()
  for (let i = 0; i < optionCount; i++) {
    const option = options.nth(i)
    const exampleName = await option.textContent()
    console.log("Testing example", exampleName)
    await comboLocator.selectOption(exampleName)
    
    const gcCount = await gcLocator.count()
    for (let i = 0; i < gcCount; i++) {
      await gcLocator.nth(i).click()
    }
  }

});

