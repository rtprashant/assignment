export const API = {
  SINGLE_PRODUCT: (id) => `https://dummyjson.com/products/${id}`,
  ALL_PRODUCTS: (limit, skip, search = '', sortBy = '', order = '', category = '') => {
    const endpoint = search.trim()
      ? '/products/search'
      : category.trim()
        ? `/products/category/${encodeURIComponent(category.trim())}`
        : '/products'
    const query = new URLSearchParams({ limit, skip })
    if (search.trim()) query.set('q', search.trim())
    if (sortBy && order) {
      query.set('sortBy', sortBy)
      query.set('order', order)
    }
    return `https://dummyjson.com${endpoint}?${query}`
  },
  CATEGORIES: 'https://dummyjson.com/products/categories',
}
