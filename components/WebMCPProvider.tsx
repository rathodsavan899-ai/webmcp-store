"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/lib/products";
import { searchProducts, formatUSD } from "@/lib/webmcp-tools";

/**
 * Minimal shape of the WebMCP tool-registration surface. The spec has moved
 * from `navigator.modelContext` to `document.modelContext` over 2026 Chrome
 * builds (see README), so we feature-detect both and register on whichever
 * exists. Neither exists in most browsers today, so every call in this file
 * is guarded and the app works identically with WebMCP absent.
 */
interface ModelContextTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean };
  execute: (args: any) => Promise<unknown> | unknown;
}

interface ModelContextHost {
  registerTool: (tool: ModelContextTool) => void;
  unregisterTool: (name: string) => void;
}

function getModelContext(): ModelContextHost | undefined {
  if (typeof window === "undefined") return undefined;
  // Prefer the newer document-scoped getter; fall back to the deprecated
  // navigator-scoped one for older Chrome Canary builds.
  return (document as any).modelContext ?? (window.navigator as any).modelContext;
}

/**
 * Registers this storefront's shopping capabilities as WebMCP tools so a
 * page-aware AI agent (Chrome's built-in agent, or any WebMCP client) can
 * search the catalog and operate the cart without clicking through the UI.
 *
 * Mount once near the root, inside CartProvider, so tool handlers always see
 * live cart state without needing a page reload between registrations.
 */
export default function WebMCPProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  // Keep a ref to the latest cart so tool `execute` closures (registered
  // once on mount) always read current state rather than a stale snapshot.
  const cartRef = useRef(cart);
  cartRef.current = cart;

  useEffect(() => {
    const host = getModelContext();
    if (!host) {
      // WebMCP not available in this browser build — no-op.
      return;
    }

    const tools: ModelContextTool[] = [
      {
        name: "search_products",
        description:
          "Search the store catalog by free-text query and/or a price range. Returns matching products with id, name, price, category, and description.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Free-text search across product name, description, and category.",
            },
            minPrice: { type: "number", description: "Minimum price in USD, inclusive." },
            maxPrice: { type: "number", description: "Maximum price in USD, inclusive." },
            category: {
              type: "string",
              enum: ["audio", "kitchen", "outdoors", "desk"],
              description: "Restrict results to a single category.",
            },
          },
        },
        annotations: { readOnlyHint: true },
        execute: async (args: {
          query?: string;
          minPrice?: number;
          maxPrice?: number;
          category?: string;
        }) => {
          const results = searchProducts(args ?? {});
          return {
            count: results.length,
            products: results.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              priceFormatted: formatUSD(p.price),
              category: p.category,
              description: p.description,
            })),
          };
        },
      },
      {
        name: "get_product",
        description: "Fetch full details for a single product by its id.",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "The product id, e.g. 'aud-01'." },
          },
          required: ["productId"],
        },
        annotations: { readOnlyHint: true },
        execute: async (args: { productId: string }) => {
          const product = getProductById(args.productId);
          if (!product) {
            return { error: `No product found with id "${args.productId}".` };
          }
          return { ...product, priceFormatted: formatUSD(product.price) };
        },
      },
      {
        name: "add_to_cart",
        description:
          "Add a quantity of a product to the shopping cart. Use search_products first to find a valid productId.",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "The product id to add." },
            quantity: {
              type: "number",
              description: "How many units to add (default 1).",
              minimum: 1,
            },
          },
          required: ["productId"],
        },
        execute: async (args: { productId: string; quantity?: number }) => {
          const product = getProductById(args.productId);
          if (!product) {
            return { success: false, error: `No product found with id "${args.productId}".` };
          }
          const qty = args.quantity && args.quantity > 0 ? Math.floor(args.quantity) : 1;
          cartRef.current.addItem(args.productId, qty);
          return {
            success: true,
            added: { productId: args.productId, name: product.name, quantity: qty },
          };
        },
      },
      {
        name: "remove_from_cart",
        description:
          "Remove a product from the cart. If quantity is omitted, removes the item entirely regardless of its current quantity.",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "The product id to remove." },
            quantity: {
              type: "number",
              description: "How many units to remove. Omit to remove all units of this product.",
              minimum: 1,
            },
          },
          required: ["productId"],
        },
        annotations: { destructiveHint: true },
        execute: async (args: { productId: string; quantity?: number }) => {
          cartRef.current.removeItem(args.productId, args.quantity);
          return { success: true, productId: args.productId };
        },
      },
      {
        name: "get_cart",
        description:
          "Get the current cart contents: each line item with quantity and line total, plus the item count and subtotal.",
        inputSchema: { type: "object", properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () => {
          const { items, itemCount, subtotal } = cartRef.current.summary;
          return {
            itemCount,
            subtotal,
            subtotalFormatted: formatUSD(subtotal),
            items: items.map((line) => ({
              productId: line.productId,
              name: line.product.name,
              quantity: line.quantity,
              unitPrice: line.product.price,
              lineTotal: line.lineTotal,
            })),
          };
        },
      },
    ];

    tools.forEach((tool) => host.registerTool(tool));

    return () => {
      tools.forEach((tool) => host.unregisterTool(tool.name));
    };
    // Tools are registered once; they read live state via cartRef, so this
    // effect intentionally has no dependency on `cart`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

// Re-exported so other modules (e.g. a future declarative <form toolname>
// island) can check availability without duplicating the feature-detect.
export { getModelContext };
