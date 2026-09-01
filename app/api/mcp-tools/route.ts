import { NextResponse } from "next/server";

/**
 * This endpoint does NOT execute tools — WebMCP tools run client-side,
 * bound to live React cart state (see components/WebMCPProvider.tsx).
 * It exists so CI, docs generators, or non-browser MCP tooling can
 * introspect the exact JSON Schemas the client registers, without
 * duplicating them by hand.
 */
export async function GET() {
  const tools = [
    {
      name: "search_products",
      description:
        "Search the store catalog by free-text query and/or a price range.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
          category: {
            type: "string",
            enum: ["audio", "kitchen", "outdoors", "desk"],
          },
        },
      },
      annotations: { readOnlyHint: true },
    },
    {
      name: "get_product",
      description: "Fetch full details for a single product by its id.",
      inputSchema: {
        type: "object",
        properties: { productId: { type: "string" } },
        required: ["productId"],
      },
      annotations: { readOnlyHint: true },
    },
    {
      name: "add_to_cart",
      description: "Add a quantity of a product to the shopping cart.",
      inputSchema: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity: { type: "number", minimum: 1 },
        },
        required: ["productId"],
      },
    },
    {
      name: "remove_from_cart",
      description: "Remove a product (or a quantity of it) from the cart.",
      inputSchema: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity: { type: "number", minimum: 1 },
        },
        required: ["productId"],
      },
      annotations: { destructiveHint: true },
    },
    {
      name: "get_cart",
      description: "Get current cart line items, item count, and subtotal.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
    },
  ];

  return NextResponse.json({ tools });
}
