import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
}

/** Advance one step: pick the first unlocked choice, the next button, or the first destination. */
async function step(page: Page): Promise<'ended' | 'continued'> {
  if (await page.getByText('The End').isVisible()) return 'ended'
  const next = page.getByRole('button', { name: /다음 장으로|책을 덮는다/ })
  if (await next.isVisible()) {
    await next.click()
    return 'continued'
  }
  const choices = page.locator('section[aria-label="선택지"] button:not([disabled])')
  if (await choices.count()) {
    await choices.first().click()
    return 'continued'
  }
  const dest = page.getByRole('heading', { name: '다음은 어디로' })
  if (await dest.isVisible()) {
    await page.locator('article ol li button').first().click()
    return 'continued'
  }
  await page.waitForTimeout(100)
  return 'continued'
}

test('plays a full journey from cover to diary', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: '상하이 여행기' })).toBeVisible()
  await noHorizontalScroll(page)
  await page.getByRole('button', { name: '새 여행 시작' }).click()
  await page.getByRole('button', { name: '언어 학습자로 떠난다 →' }).click()
  await expect(page.getByRole('heading', { name: '여행 안내' })).toBeVisible()
  await page.getByRole('button', { name: '상하이로 출발 →' }).click()

  // first chapter: real photo loads, locked choice is inert
  await expect(page.getByRole('heading', { name: '상하이 도착' })).toBeVisible()
  const plate = page.locator('figure.plate').first()
  await expect(plate).toBeVisible()
  const locked = page.locator('section[aria-label="선택지"] button[disabled]')
  await expect(locked).toHaveCount(1)
  await expect(locked).toContainText('잠김')
  await locked.click({ force: true })
  await expect(page.getByRole('heading', { name: '상하이 도착' })).toBeVisible()
  await expect(page.getByRole('button', { name: /다음 장으로/ })).toHaveCount(0)
  await noHorizontalScroll(page)

  let guard = 0
  while ((await step(page)) !== 'ended') {
    if (++guard > 80) throw new Error('journey did not end')
  }
  await expect(page.getByText(/\/ 100/).first()).toBeVisible()
  await noHorizontalScroll(page)

  await page.getByRole('button', { name: '여행일지 펼치기' }).click()
  await expect(page.getByRole('heading', { name: '나의 상하이 여행일지' })).toBeVisible()
  await expect(page.getByText('Day 1').first()).toBeVisible()
  await expect(page.getByRole('heading', { name: '상하이 도착' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '마지막 여행의 선택' })).toBeVisible()
  await noHorizontalScroll(page)
})

test('progress survives a reload and can be continued', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: '새 여행 시작' }).click()
  await page.getByRole('button', { name: '자유 여행자로 떠난다 →' }).click()
  await page.getByRole('button', { name: '상하이로 출발 →' }).click()
  for (let i = 0; i < 6; i++) await step(page)
  const head = await page.locator('h1').first().textContent()
  await page.reload()
  await page.getByRole('button', { name: /이어 읽기/ }).click()
  await expect(page.locator('h1').first()).toHaveText(head ?? '')
})

test('photos on the first pages actually load', async ({ page }) => {
  await page.goto('./')
  const img = page.locator('figure.plate img').first()
  await expect(img).toBeVisible()
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
})

test('settings change text size and persist', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: '설정' }).click()
  await page.getByRole('radio', { name: '크게' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-text', 'large')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-text', 'large')
})

test('looping video can be paused and respects reduced motion', async ({ browser }) => {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    const ctx = await browser.newContext({ reducedMotion })
    const page = await ctx.newPage()
    await page.goto('./')
    await page.getByRole('button', { name: '새 여행 시작' }).click()
    await page.getByRole('button', { name: '음식 탐험가로 떠난다 →' }).click()
    await page.getByRole('button', { name: '상하이로 출발 →' }).click()
    const video = page.locator('figure.plate video')
    await expect(video).toBeVisible()
    const toggle = page.locator('figure.plate button', { hasText: /영상/ })
    if (reducedMotion === 'reduce') {
      await page.waitForTimeout(1000)
      expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
      await expect(toggle).toHaveText(/재생/)
    } else {
      await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true)
      await toggle.click()
      await expect(toggle).toHaveText(/재생/)
      expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
      await toggle.click()
      await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true)
    }
    await ctx.close()
  }
})
