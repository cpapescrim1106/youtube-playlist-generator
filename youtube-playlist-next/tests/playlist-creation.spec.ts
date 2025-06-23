import { test, expect } from '@playwright/test'

test.describe('Playlist Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080')
  })

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/YouTube Playlist Generator/)
    await expect(page.locator('h1')).toContainText('YouTube Playlist Generator')
  })

  test('can add YouTube URLs', async ({ page }) => {
    const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    
    // Find the URL input
    const urlInput = page.locator('input[placeholder*="YouTube URL"]')
    await urlInput.fill(youtubeUrl)
    await urlInput.press('Enter')
    
    // Check if URL was added
    await expect(page.locator('text=' + youtubeUrl)).toBeVisible()
  })

  test('can toggle between single and bulk mode', async ({ page }) => {
    // Click bulk mode button
    await page.click('text=Bulk Mode')
    
    // Check if textarea is visible
    await expect(page.locator('textarea[placeholder*="multiple YouTube URLs"]')).toBeVisible()
    
    // Switch back to single mode
    await page.click('text=Single Mode')
    
    // Check if input is visible again
    await expect(page.locator('input[placeholder*="YouTube URL"]')).toBeVisible()
  })

  test('shows error for empty playlist creation', async ({ page }) => {
    // Try to create playlist without URLs
    await page.click('text=Create Playlist')
    
    // Check for error message
    await expect(page.locator('text=Please add at least one YouTube URL')).toBeVisible()
  })

  test('can navigate to history page', async ({ page }) => {
    await page.click('text=View History & Stats')
    await expect(page).toHaveURL(/.*\/history/)
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('keyboard shortcuts work', async ({ page }) => {
    // Test Ctrl+H navigation
    await page.keyboard.press('Control+h')
    await expect(page).toHaveURL(/.*\/history/)
    
    // Test Ctrl+N navigation back to home
    await page.keyboard.press('Control+n')
    await expect(page).toHaveURL(/\/$/)
  })
})