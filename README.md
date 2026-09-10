# Everyday UI

Simple responsive React and Tailwind components for the assessment. The listing uses `useFetchData` and `API.ALL_PRODUCTS(12, 0)` to display the API response, with loading and error states. Filtering controls are still UI only.

```sh
npm install
npm run dev
```

- `src/components/`: filters, search field, toolbar, product cards, pagination, and product detail UI.
- `src/pages/`: listing and detail page layouts.
- `src/assets/products.js`: sample products, categories, and brands.
- `src/hooks/useFetchData.js`: shared Axios fetching hook.
- `src/api/main.js`: API endpoint definitions.

Search, category, price, brand, sort, and pagination controls are UI only. They do not change the product list. Inputs use normal browser state, and Reset clears the filter form. Product links navigate between the sample screens. The desktop filter column stays visible while scrolling.

The listing fetches the first 12 products. Categories, brands, and the detail preview still use sample data. Product images load directly from the DummyJSON image CDN.

Checks: `npm run lint`, `npm run build`, and `npm run test:browser`.
