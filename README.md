# Fieldstone — Next.js Store with WebMCP

A small e-commerce demo (Next.js App Router + Tailwind) that exposes its
product search, cart, and checkout state as **WebMCP tools**, so a browser
AI agent (Chrome's `document.modelContext` / `navigator.modelContext`) can
shop the site programmatically alongside the human user.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- React Context for cart state (no backend — mock in-memory catalog)
- WebMCP tool registration via `document.modelContext` with a
  `navigator.modelContext` fallback for older Chrome builds, and a no-op
  fallback when neither exists (regular browsers).

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

No environment variables are required — the catalog is static mock data
in `lib/products.ts`.

## Testing WebMCP in Chrome

1. Open `chrome://flags/#enable-webmcp-testing` (also try
   `#webmcp-for-testing`, the flag name has shifted between Chrome builds)
   and enable it. Relaunch Chrome.
2. Load the deployed site or `localhost:3000`.
3. Open DevTools Console and confirm tools registered:
   ```js
   document.modelContext ?? navigator.modelContext
   ```
4. Use Chrome's WebMCP dev surface (or the Model Context Tool Inspector
   extension) to list and manually invoke tools, or call one directly from
   the console:
   ```js
   await (document.modelContext ?? navigator.modelContext)
     .callTool?.('search_products', { query: 'headphones' })
   ```
   (Exact inspector API differs by Chrome build — see
   `components/WebMCPProvider.tsx` for the tool names/schemas registered.)

## Registered tools

| Tool name          | Purpose                                            |
|---------------------|-----------------------------------------------------|
| `search_products`   | Search catalog by text query and/or min/max price  |
| `get_product`       | Fetch a single product by id                       |
| `add_to_cart`       | Add N units of a product id to the cart             |
| `remove_from_cart`  | Remove a product (or reduce quantity) from the cart |
| `get_cart`          | Return current cart line items + totals             |

See `components/WebMCPProvider.tsx` for full JSON schemas and handlers, and
`lib/webmcp-tools.ts` for the pure functions the handlers wrap (also unit
testable without a browser).

## Structure

```
app/
  layout.tsx          root layout, wraps app in CartProvider + WebMCPProvider
  page.tsx             product listing page (server component shell)
  globals.css
components/
  Header.tsx           nav bar + cart toggle button
  ProductGrid.tsx       client grid w/ search & price filter UI
  ProductCard.tsx       single product card w/ add-to-cart
  CartDrawer.tsx        slide-over cart with qty controls + checkout
  WebMCPProvider.tsx    registers/unregisters WebMCP tools on the client
context/
  CartContext.tsx       cart state (add/remove/clear, totals) via useReducer
lib/
  types.ts              Product / CartItem types
  products.ts            mock catalog (12 products across 4 categories)
  webmcp-tools.ts        pure search/cart-math helpers shared by UI + tools
```
