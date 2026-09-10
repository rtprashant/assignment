import { test, expect } from '@playwright/test'
const products = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: `Sample ${index + 1}`,
  category: 'beauty',
  brand: 'Essence',
  price: 9.99,
  rating: 4.3,
  thumbnail: '',
}))

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/dummyjson\.com\/products\/\d+$/, (route) =>
    route.fulfill({ json: products[0] }),
  )
  await page.route('https://dummyjson.com/products?*', (route) =>
    route.fulfill({ json: { products, total: products.length, limit: 12, skip: 0 } }),
  )
})

test('product details show loading, error, and successful retry', async ({ page }) => {
  let attempts = 0
  let retrySucceeds = false
  await page.route('https://dummyjson.com/products/42', async (route) => {
    attempts += 1
    if (!retrySucceeds) {
      await page.getByRole('status').filter({ hasText: 'Loading product' }).waitFor()
      return route.fulfill({ status: 500, json: { message: 'Failed' } })
    }
    return route.fulfill({ json: { ...products[0], id: 42, title: 'Retried product' } })
  })
  await page.goto('/product/42')
  await expect(page.getByText('Unable to load product')).toBeVisible()
  retrySucceeds = true
  await page.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Retried product' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Retry', exact: true })).toHaveCount(0)
  expect(attempts).toBeGreaterThanOrEqual(2)
})

test('product reviews render API data and fractional stars', async ({ page }) => {
  await page.route('https://dummyjson.com/products/42', (route) =>
    route.fulfill({
      json: {
        ...products[0],
        rating: 3.3,
        reviews: [
          {
            reviewerName: 'Alex',
            rating: 3.5,
            comment: 'Useful everyday product.',
            date: '2026-09-01T00:00:00Z',
          },
        ],
      },
    }),
  )
  await page.goto('/product/42')
  const reviews = page.getByRole('region', { name: 'Customer reviews (1)' })
  await expect(reviews.getByText('Alex')).toBeVisible()
  await expect(reviews.getByText('Useful everyday product.')).toBeVisible()
  const stars = reviews.getByLabel('3.3 out of 5 stars').locator('span.absolute')
  const widths = await stars.evaluateAll((elements) =>
    elements.map((element) => parseFloat(element.style.width)),
  )
  expect(widths[0]).toBe(100)
  expect(widths[2]).toBe(100)
  expect(widths[3]).toBeCloseTo(30)
  expect(widths[4]).toBe(0)
  await page.goto('/product/1')
  await expect(page.getByText('No reviews yet.')).toBeVisible()
})

test('API brands filter products together with category and reset', async ({ page }) => {
  await page.route('https://dummyjson.com/products/categories', (route) =>
    route.fulfill({
      json: [
        { slug: 'beauty', name: 'Beauty' },
        { slug: 'fragrances', name: 'Fragrances' },
      ],
    }),
  )
  await page.route('https://dummyjson.com/products/category/fragrances?*', (route) =>
    route.fulfill({
      json: { products: [{ ...products[0], category: 'fragrances', brand: 'Other' }], total: 1 },
    }),
  )
  const requests = []
  page.on('request', (request) => {
    if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') requests.push(request.url())
  })
  await page.goto('/')
  const cards = page.locator('section[aria-label="Products"] a')
  await expect(cards).toHaveCount(8)
  await expect(page.getByLabel('Brand', { exact: true }).locator('option')).toHaveText([
    'All brands',
    'Essence',
  ])
  await page.getByLabel('Brand', { exact: true }).selectOption('Essence')
  await expect(cards).toHaveCount(8)
  await page.getByRole('radio', { name: 'Fragrances', exact: true }).check()
  await expect(cards).toHaveCount(0)
  await page.getByRole('button', { name: 'Reset all' }).click()
  await expect(page.getByLabel('Brand', { exact: true })).toHaveValue('')
  await expect(cards).toHaveCount(8)
  await cards.first().click()
  await expect(page.getByRole('heading', { name: 'About this product' })).toBeVisible()
  expect(requests.some((url) => url.includes('dummyjson.com/products?limit=12&skip=0'))).toBeTruthy()
})

test('price bounds filter the full results before pagination and combine with brand and category', async ({
  page,
}) => {
  const catalog = Array.from({ length: 26 }, (_, index) => ({
    ...products[0],
    id: index + 1,
    title: `Price product ${index}`,
    price: index,
    brand: index === 20 ? 'Other' : 'Essence',
    category: index === 21 ? 'fragrances' : 'beauty',
  }))
  await page.route('https://dummyjson.com/products/categories', (route) =>
    route.fulfill({ json: [{ slug: 'beauty', name: 'Beauty' }] }),
  )
  await page.route(/https:\/\/dummyjson\.com\/products(?:\?|\/category\/)/, (route) => {
    const url = new URL(route.request().url())
    const matching = url.pathname.includes('/category/')
      ? catalog.filter((p) => p.category === 'beauty')
      : catalog
    const limit = Number(url.searchParams.get('limit'))
    const skip = Number(url.searchParams.get('skip'))
    return route.fulfill({
      json: { products: limit ? matching.slice(skip, skip + limit) : matching, total: matching.length },
    })
  })
  await page.goto('/')
  const cards = page.locator('section[aria-label="Products"] a')
  await expect(cards).toHaveCount(12)
  await page.getByLabel('Min price').fill('10')
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(cards).toHaveCount(4)
  await page.getByLabel('Max price').fill('22')
  await expect(cards).toHaveCount(12)
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(cards).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Price product 22', exact: true })).toBeVisible()
  await page.getByLabel('Brand', { exact: true }).selectOption('Essence')
  await expect(cards).toHaveCount(12)
  await page.getByRole('radio', { name: 'Beauty', exact: true }).check()
  await expect(cards).toHaveCount(11)
  await page.getByLabel('Min price').fill('22')
  await expect(cards).toHaveCount(1)
  await page.getByLabel('Min price').fill('23')
  await expect(cards).toHaveCount(0)
  await page.getByLabel('Min price').fill('')
  await page.getByLabel('Max price').fill('0')
  await expect(cards).toHaveCount(1)
  await page.getByRole('button', { name: 'Reset all' }).click()
  await expect(page.getByLabel('Min price')).toHaveValue('')
  await expect(page.getByLabel('Max price')).toHaveValue('')
  await expect(cards).toHaveCount(12)
})

test('responsive UI and sticky desktop filters', async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 600 })
    await page.goto('/')
    await expect(page.locator('section[aria-label="Products"] a')).toHaveCount(8)
    await expect(page.getByLabel('Min price')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
    if (width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 400))
      const sidebar = page.locator('form').locator('..')
      await expect.poll(async () => Math.round((await sidebar.boundingBox()).y)).toBe(24)
    }
  }
})

test('pagination requests the correct API page and respects boundaries', async ({ page }) => {
  const catalog = Array.from({ length: 26 }, (_, index) => ({
    ...products[index % products.length],
    id: index + 1,
    title: `Product ${index + 1}`,
  }))
  const skips = []
  await page.route('https://dummyjson.com/products?*', (route) => {
    const params = new URL(route.request().url()).searchParams
    const skip = Number(params.get('skip'))
    const limit = Number(params.get('limit'))
    skips.push(skip)
    return route.fulfill({ json: { products: catalog.slice(skip, skip + limit), total: 26, limit, skip } })
  })
  await page.goto('/')
  const cards = page.locator('section[aria-label="Products"] a')
  await expect(cards).toHaveCount(12)
  await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(page.getByRole('heading', { name: 'Product 13', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Page 3', exact: true }).click()
  await expect(cards).toHaveCount(2)
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled()
  await page.getByRole('button', { name: 'Previous page' }).click()
  await expect(page.getByRole('heading', { name: 'Product 13', exact: true })).toBeVisible()
  expect(skips).toEqual(expect.arrayContaining([0, 12, 24]))
})
