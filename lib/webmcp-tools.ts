import { PRODUCTS, getProductById } from "./products";
import { CartItem, CartLine, CartSummary, Product } from "./types";

export interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

/** Pure product search — used by both the on-page search box and the
 *  `search_products` WebMCP tool, so agent results always match what a
 *  human sees in the UI. */
export function searchProducts(params: SearchParams): Product[] {
  const { query, minPrice, maxPrice, category } = params;
  const q = query?.trim().toLowerCase();

  return PRODUCTS.filter((p) => {
    if (q) {
      const haystack = `${p.name} ${p.description} ${p.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (typeof minPrice === "number" && p.price < minPrice) return false;
    if (typeof maxPrice === "number" && p.price > maxPrice) return false;
    if (category && p.category !== category) return false;
    return true;
  });
}

/** Builds the derived cart view (line items + totals) from raw {productId,
 *  quantity} pairs. Kept pure/stateless so it can run both in React state
 *  updates and inside WebMCP tool handlers. */
export function buildCartSummary(items: CartItem[]): CartSummary {
  const lines: CartLine[] = items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return {
        ...item,
        product,
        lineTotal: Math.round(product.price * item.quantity * 100) / 100,
      };
    })
    .filter((l): l is CartLine => l !== null);

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal =
    Math.round(lines.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100;

  return { items: lines, itemCount, subtotal };
}

export function formatUSD(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
