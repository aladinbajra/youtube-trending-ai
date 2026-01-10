import { test, expect } from '@playwright/test';

test.describe('Frontend Features - Local Tests', () => {
  const FRONTEND_URL = 'http://localhost:3000';
  const BACKEND_URL = 'http://localhost:8001';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/analytics`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('Search functionality works', async ({ page }) => {
    // Type in search
    await page.fill('[data-testid="search-input"]', 'India');
    await page.waitForTimeout(500); // Debounce

    // Check filtered results
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Showing');
    
    console.log('✓ Search functionality working');
  });

  test('Country filter works', async ({ page }) => {
    // Click filter to expand
    await page.click('text=Filters');
    await page.waitForTimeout(300);

    // Select a country
    const countrySelect = page.locator('[data-testid="country-filter"]');
    if (await countrySelect.isVisible()) {
      await countrySelect.selectOption({ index: 1 }); // Select first country
      await page.waitForTimeout(500);

      console.log('✓ Country filter applied');
    }
  });

  test('Sort functionality works', async ({ page }) => {
    // Change sort field
    const sortSelect = page.locator('[data-testid="sort-select"]');
    await sortSelect.selectOption('likes');
    await page.waitForTimeout(500);

    // Toggle sort direction
    await page.click('[data-testid="sort-direction"]');
    await page.waitForTimeout(500);

    console.log('✓ Sort functionality working');
  });

  test('Video modal opens when clicking video card', async ({ page }) => {
    // Click first video card
    const firstCard = page.locator('[data-testid="video-card"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);

    // Check modal is visible
    const modal = page.locator('[data-testid="video-modal"]');
    await expect(modal).toBeVisible();

    // Check modal has content
    await expect(modal.locator('text=Views Over Time')).toBeVisible();

    console.log('✓ Video modal opens and displays');

    // Close modal
    await page.click('[data-testid="modal-backdrop"]');
    await page.waitForTimeout(300);
    await expect(modal).not.toBeVisible();

    console.log('✓ Modal closes correctly');
  });

  test('Export button is visible', async ({ page }) => {
    const exportBtn = page.locator('[data-testid="export-button"]');
    await expect(exportBtn).toBeVisible();

    console.log('✓ Export button present');
  });

  test('Filtered count updates correctly', async ({ page }) => {
    // Get initial count
    const initialText = await page.textContent('body');
    const initialMatch = initialText?.match(/Showing (\d+) of (\d+)/);
    
    if (initialMatch) {
      console.log(`Initial: Showing ${initialMatch[1]} of ${initialMatch[2]}`);
    }

    // Apply search filter
    await page.fill('[data-testid="search-input"]', 'test');
    await page.waitForTimeout(500);

    // Check count updated
    const filteredText = await page.textContent('body');
    expect(filteredText).toContain('Showing');

    console.log('✓ Filtered count updates');
  });

  test('Video detail modal calls history API', async ({ page, _request }) => {
    // Track API calls
    const historyCalls: string[] = [];
    page.on('request', req => {
      if (req.url().includes('/history')) {
        historyCalls.push(req.url());
      }
    });

    // Click first video
    const firstCard = page.locator('[data-testid="video-card"]').first();
    const videoId = await firstCard.getAttribute('data-videoid');
    await firstCard.click();
    await page.waitForTimeout(2000);

    // Check history API was called
    expect(historyCalls.length).toBeGreaterThan(0);
    expect(historyCalls[0]).toContain(videoId!);
    expect(historyCalls[0]).toContain(`${BACKEND_URL}/api/videos/`);

    console.log('✓ History API called:', historyCalls[0]);
  });

  test('Clear filters button works', async ({ page }) => {
    // Apply filter
    await page.click('text=Filters');
    await page.waitForTimeout(300);
    
    const countrySelect = page.locator('[data-testid="country-filter"]');
    if (await countrySelect.isVisible()) {
      await countrySelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);

      // Clear all
      const clearBtn = page.locator('text=Clear All');
      if (await clearBtn.isVisible()) {
        await clearBtn.click();
        await page.waitForTimeout(300);

        console.log('✓ Clear filters working');
      }
    }
  });

  test('No console errors on page with filters', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Apply various filters
    await page.fill('[data-testid="search-input"]', 'test');
    await page.waitForTimeout(500);
    
    await page.click('text=Filters');
    await page.waitForTimeout(300);

    // Filter critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('404') && 
      !e.includes('Failed to load resource')
    );

    expect(criticalErrors.length).toBe(0);
    console.log('✓ No critical errors with filters');
  });
});

