# Everyday

A responsive product browsing app built with React, Vite, and Tailwind CSS. You can search products, filter by category, brand, or price, sort results, and open a product to see its details and reviews. Product data comes from DummyJSON.

## Setup instructions

You will need Node.js 22.12 or newer and npm. From the project folder, run:

```sh
npm install
npm run dev
```

Open the local address printed in the terminal, usually `http://localhost:5173`. No API key, environment file, or separate backend is needed. An internet connection is required to load products and images.

To build and preview the production version:

```sh
npm run build
npm run preview
```

The build is saved in `dist/`. When hosting it, configure your server to serve `index.html` for app routes so opening `/product/1` directly works.

To check the code:

```sh
npm run lint
```

Use `npm run format` to format the project.

## Assumptions made

- This is a product browsing demo. Accounts, a cart, checkout, and payments are outside the current scope.
- Prices are treated as USD. Minimum and maximum prices are inclusive. Leaving either field blank removes that limit, and negative values are blocked. A minimum greater than the maximum produces no matching products.
- Active filters work together: products must match the search results, category, brand, and price range. Changing a filter or sort order returns to page one. Each page shows up to 12 products.
- The brand dropdown includes unique, alphabetically sorted brands from the full catalog. Products without a brand can still appear under “All brands.” Selecting a category keeps the full brand list available, so some combinations may have no results.
- Filter choices live in memory. Refreshing or leaving and returning to the listing resets them. “Reset all” also clears search and restores the default sort order.
- The sample catalog is small enough to fetch in full when needed. Product details and reviews use API data, while the stock badge, shipping estimate, warranty, and returns text are presentation placeholders.

## Architectural decisions

The app uses React for the interface, React Router for navigation, Tailwind CSS for styling, and Axios for requests. There are two main pages: the listing at `/` and product details at `/product/:id`.

The code is organized by responsibility:

- `src/pages/` connects data and state to each page layout.
- `src/components/` contains filters, cards, pagination, the gallery, reviews, and shared feedback UI.
- `src/api/main.js` builds API URLs in one place.
- `src/hooks/useFetchData.js` handles loading, errors, retries, and cancellation of requests that are no longer needed.

The listing page owns filter, sort, and pagination state and passes values and callbacks to its child components. This keeps controls and results in sync without adding a global state library. Search waits 400 milliseconds after typing before updating the request.

Filtering combines API requests with local processing. Normal browsing uses API pagination. Search, category, and sorting are included in requests where supported by the current URL builder. A separate request loads the complete catalog to extract brand names for the dropdown.

When brand or price filters are active, the listing fetches all products for the current search or category and applies those filters locally. Search combined with category also uses local category matching. Filtering happens before pagination, so counts and page boundaries reflect all matches, not just the current API page. This is straightforward for a demo, but fetching the full dataset would not suit a large catalog.

Loading indicators, retry actions, native form controls, and a responsive grid provide basic feedback and usability. On desktop, the filter panel stays visible while scrolling.

## Improvements if given more time

- Move combined filtering and pagination to a backend for larger catalogs, and fetch brand options through a dedicated endpoint.
- Cache and share requests so the dropdown and listing can reuse catalog data instead of downloading it separately.
- Save filters, sorting, and the current page in the URL so results can be bookmarked and restored after viewing a product.
- Add a clear empty-results message and explain when the minimum price exceeds the maximum.
- Replace placeholder stock and delivery information with the corresponding API fields.
- Add a fuller keyboard and accessibility review.
- Remove unused starter assets and sample data, and add automated lint and build checks to CI.
