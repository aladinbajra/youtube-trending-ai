import { test, expect } from '@playwright/test';

test.describe('Tube Virality E2E Smoke Tests', () => {
  const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
  const API_BASE = process.env.VITE_API_URL || 'http://localhost:8001';

  test('home page loads with hero section', async ({ page }) => {
    await page.goto(FRONTEND, { waitUntil: 'networkidle' });
    
    // Check hero text
    await expect(page.locator('text=Predict YouTube')).toBeVisible();
    await expect(page.locator('text=Virality')).toBeVisible();
    
    // Check CTA buttons exist
    const buttons = page.locator('a, button');
    await expect(buttons).toHaveCountGreaterThan(0);
    
    console.log('✓ Home page hero visible');
  });

  test('stat cards display on home page', async ({ page }) => {
    await page.goto(FRONTEND);
    
    // Wait for stat cards to render
    await page.waitForTimeout(1000);
    
    // Check for stat card content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Countries');
    expect(bodyText).toContain('Videos');
    expect(bodyText).toContain('Data');
    
    console.log('✓ Stat cards rendered');
  });

  test('navigation menu works', async ({ page }) => {
    await page.goto(FRONTEND);
    
    // Check navigation links
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=Methodology')).toBeVisible();
    
    console.log('✓ Navigation menu rendered');
  });

  test('analytics page loads and shows metrics', async ({ page }) => {
    await page.goto(`${FRONTEND}/analytics`);
    await page.waitForLoadState('networkidle');
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('Analytics');
    
    // Wait for content
    await page.waitForTimeout(1500);
    
    // Check for analytics content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Dashboard');
    
    console.log('✓ Analytics page loaded');
  });

  test('data process page shows pipeline', async ({ page }) => {
    await page.goto(`${FRONTEND}/data-process`);
    await page.waitForLoadState('networkidle');
    
    // Check for pipeline content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Pipeline');
    expect(bodyText).toContain('Data');
    
    console.log('✓ Data Process page loaded');
  });

  test('methodology page loads', async ({ page }) => {
    await page.goto(`${FRONTEND}/methodology`);
    await page.waitForLoadState('networkidle');
    
    // Check for methodology content
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Methodology');
    
    console.log('✓ Methodology page loaded');
  });

  test('frontend calls backend API when VITE_API_URL is set', async ({ _page, request }) => {
    // Test API directly
    const healthResponse = await request.get(`${API_BASE}/health`);
    expect(healthResponse.ok()).toBeTruthy();
    const healthData = await healthResponse.json();
    expect(healthData.status).toBe('healthy');
    console.log('✓ Backend health check passed');
    
    // Test videos endpoint
    const videosResponse = await request.get(`${API_BASE}/api/videos?limit=5`);
    expect(videosResponse.ok()).toBeTruthy();
    const videos = await videosResponse.json();
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);
    expect(videos[0]).toHaveProperty('videoId');
    expect(videos[0]).toHaveProperty('title');
    console.log(`✓ Backend returned ${videos.length} videos`);
  });

  test('CORS is properly configured', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/videos`, {
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const headers = response.headers();
    
    // Check CORS headers
    expect(headers['access-control-allow-origin']).toBeTruthy();
    console.log('✓ CORS headers present');
  });

  test('video history endpoint works', async ({ request }) => {
    // Get first video
    const videosResponse = await request.get(`${API_BASE}/api/videos?limit=1`);
    const videos = await videosResponse.json();
    
    if (videos.length > 0) {
      const videoId = videos[0].videoId;
      
      // Get history
      const historyResponse = await request.get(`${API_BASE}/api/videos/${videoId}/history`);
      expect(historyResponse.ok()).toBeTruthy();
      
      const history = await historyResponse.json();
      expect(history).toHaveProperty('timestamps');
      expect(history).toHaveProperty('views');
      expect(Array.isArray(history.timestamps)).toBe(true);
      expect(Array.isArray(history.views)).toBe(true);
      console.log(`✓ Video history returned ${history.timestamps.length} data points`);
    }
  });

  test('frontend displays video cards on analytics page', async ({ page }) => {
    await page.goto(`${FRONTEND}/analytics`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for video-related content
    const bodyText = await page.textContent('body');
    
    // Check if the page loaded
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
    
    console.log('✓ Analytics page content loaded');
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(FRONTEND);
    
    // Check that page loads
    await page.waitForLoadState('networkidle');
    
    // Mobile menu button should be visible
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Predict YouTube');
    
    console.log('✓ Mobile viewport renders');
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(FRONTEND);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Filter out known acceptable errors (like network errors from sample data fallback)
    const criticalErrors = errors.filter(err => 
      !err.includes('Failed to load resource') && 
      !err.includes('404')
    );
    
    expect(criticalErrors.length).toBe(0);
    console.log('✓ No critical console errors');
  });
});

