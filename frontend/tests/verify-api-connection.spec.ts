import { test, expect } from '@playwright/test';

test.describe('Verify Frontend → Backend Connection', () => {
  const FRONTEND_URL = 'http://localhost:3000';
  const BACKEND_URL = 'http://localhost:8001';

  test('Check if frontend makes API call to backend', async ({ page }) => {
    const apiCalls: string[] = [];
    const fallbackCalls: string[] = [];
    
    // Intercept all network requests
    page.on('request', request => {
      const url = request.url();
      
      // Track API calls to backend
      if (url.includes(BACKEND_URL)) {
        apiCalls.push(url);
        console.log('✓ API Call to Backend:', url);
      }
      
      // Track fallback calls to local data
      if (url.includes('/data/videos.json')) {
        fallbackCalls.push(url);
        console.log('⚠ Fallback Call:', url);
      }
    });

    // Load homepage
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Navigate to analytics (where videos are loaded)
    await page.click('text=Analytics');
    await page.waitForTimeout(3000);
    
    // Report findings
    console.log('\n=== NETWORK ANALYSIS ===');
    console.log('Backend API calls:', apiCalls.length);
    console.log('Fallback calls:', fallbackCalls.length);
    
    if (apiCalls.length > 0) {
      console.log('\n✅ FRONTI PO MERR TE DHENAT NGA BACKEND!');
      console.log('API Calls:', apiCalls);
    } else {
      console.log('\n❌ FRONTI NUK PO THËRRET BACKEND!');
      console.log('Using fallback data:', fallbackCalls.length > 0 ? 'YES' : 'NO');
    }
    
    // Verify backend is being used
    expect(apiCalls.length).toBeGreaterThan(0);
    expect(fallbackCalls.length).toBe(0);
  });

  test('Verify yellow banner is NOT shown', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.waitForTimeout(2000);
    
    // Check for sample data banner
    const bannerText = 'Using local sample data';
    const bannerExists = await page.locator(`text=${bannerText}`).count();
    
    console.log('Yellow banner count:', bannerExists);
    
    if (bannerExists === 0) {
      console.log('✅ Yellow banner NUK shfaqet (MIRE - backend connected)');
    } else {
      console.log('❌ Yellow banner SHFAQET (KEQ - using sample data)');
    }
    
    expect(bannerExists).toBe(0);
  });

  test('Verify real data from backend in UI', async ({ page, request }) => {
    // Get data from backend API
    const apiResponse = await request.get(`${BACKEND_URL}/api/videos?limit=5`);
    const apiVideos = await apiResponse.json();
    const firstApiVideo = apiVideos[0];
    
    console.log('Backend returned video:', firstApiVideo.title);
    
    // Load frontend analytics page
    await page.goto(`${FRONTEND_URL}/analytics`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if backend video title appears in UI
    const pageContent = await page.textContent('body');
    const videoTitleInUI = pageContent?.includes(firstApiVideo.title.substring(0, 20));
    
    if (videoTitleInUI) {
      console.log('✅ Video nga backend SHFAQET në UI!');
    } else {
      console.log('⚠ Video nga backend NUK u gjet në UI');
      console.log('Searching for:', firstApiVideo.title.substring(0, 30));
    }
  });
});

