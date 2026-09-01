"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { searchProducts } from "@/lib/webmcp-tools";
import { Category } from "@/lib/types";
import ProductCard from "./ProductCard";

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "audio", label: "Audio" },
  { value: "kitchen", label: "Kitchen" },
  { value: "outdoors", label: "Outdoors" },
  { value: "desk", label: "Desk" },
];

export default function ProductGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(300);

  const results = useMemo(
    () =>
      searchProducts({
        query: query || undefined,
        category: category === "all" ? undefined : category,
        maxPrice,
      }),
    [query, category, maxPrice]
  );

  const priceCeiling = useMemo(
    () => Math.max(...PRODUCTS.map((p) => p.price)),
    []
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-stone bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-md border border-stone bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy sm:max-w-xs"
        />

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c.value
                  ? "border-navy bg-navy text-white"
                  : "border-stone bg-white text-ink/70 hover:border-navy/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-ink/60 sm:min-w-[180px]">
          Up to ${maxPrice}
          <input
            type="range"
            min={20}
            max={priceCeiling}
            step={5}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-navy"
          />
        </label>
      </div>

      {results.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone bg-white py-16 text-center text-sm text-ink/60">
          No products match those filters. Try widening the price range.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
