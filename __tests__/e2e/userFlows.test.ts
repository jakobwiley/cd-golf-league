import { test, expect, Page } from '@playwright/test';

// This test requires Playwright to be installed
// Run: npm install --save-dev @playwright/test

test.describe('CD Golf League E2E Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(process.env.TEST_BASE_URL || 'http://localhost:3000');
  });

  test('Navigation works correctly', async () => {
    // Check home page loads
    await expect(page.getByText('CD Golf League')).toBeVisible();

    // Navigate to Teams page
    await page.getByRole('link', { name: 'Teams' }).click();
    await expect(page.url()).toContain('/teams');
    
    // Navigate to Schedule page
    await page.getByRole('link', { name: 'Schedule' }).click();
    await expect(page.url()).toContain('/schedule');
    await expect(page.getByText('Match Schedule')).toBeVisible();
    
    // Navigate to Matches page
    await page.getByRole('link', { name: 'Matches' }).click();
    await expect(page.url()).toContain('/matches');
    
    // Navigate to Standings page
    await page.getByRole('link', { name: 'Standings' }).click();
    await expect(page.url()).toContain('/standings');
    await expect(page.getByText('League Standings')).toBeVisible();
  });

  test('Mobile navigation menu works correctly', async () => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that hamburger menu is visible
    const menuButton = page.getByRole('button', { name: /open main menu/i });
    await expect(menuButton).toBeVisible();
    
    // Menu should be hidden initially
    await expect(page.getByRole('link', { name: 'Teams' })).not.toBeVisible();
    
    // Open menu
    await menuButton.click();
    
    // Menu links should now be visible
    await expect(page.getByRole('link', { name: 'Teams' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Schedule' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Matches' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Standings' })).toBeVisible();
    
    // Click a link to navigate
    await page.getByRole('link', { name: 'Schedule' }).click();
    await expect(page.url()).toContain('/schedule');
  });

  test('Schedule page expands weeks and shows matches', async () => {
    // Navigate to Schedule page
    await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/schedule`);
    
    // Find and click on a week header
    const weekHeader = page.getByText('Week 1');
    await weekHeader.click();
    
    // Check that matches are displayed
    await expect(page.getByText('Play Match')).toBeVisible({ timeout: 5000 });
    
    // Click on Play Match button
    await page.getByText('Play Match').first().click();
    
    // Should navigate to match page
    await expect(page.url()).toContain('/matches/');
  });

  test('Match scoring workflow', async () => {
    // Navigate to Matches page
    await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/matches`);
    
    // Find and click on a Play Match button
    await page.getByText('Play Match').first().click();
    
    // Should navigate to match page
    await expect(page.url()).toContain('/matches/');
    
    // Check that scorecard is displayed
    await expect(page.getByText('Hole')).toBeVisible();
    
    // Try to enter a score (if the match allows it)
    const scoreInputs = await page.$$('input[type="number"]');
    if (scoreInputs.length > 0) {
      await scoreInputs[0].fill('4');
      
      // Check if Save button exists and click it
      const saveButton = page.getByRole('button', { name: /save/i });
      if (await saveButton.isVisible()) {
        await saveButton.click();
      }
    }
  });

  test('View scorecard summary', async () => {
    // Navigate to Matches page
    await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/matches`);
    
    // Find and click on a View Scorecard button if available
    const viewScorecardButton = page.getByText('View Scorecard');
    if (await viewScorecardButton.isVisible()) {
      await viewScorecardButton.first().click();
      
      // Should navigate to scorecard summary page
      await expect(page.url()).toContain('/scorecard-summary');
      
      // Check that scorecard summary is displayed
      await expect(page.getByText('Scorecard Summary')).toBeVisible();
    }
  });

  test('Standings page shows team rankings', async () => {
    // Navigate to Standings page
    await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/standings`);
    
    // Check that standings table is displayed
    await expect(page.getByText('League Standings')).toBeVisible();
    await expect(page.getByText('Team')).toBeVisible();
    await expect(page.getByText('Points')).toBeVisible();
  });
});
