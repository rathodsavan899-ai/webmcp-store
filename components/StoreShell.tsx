"use client";

import { useState } from "react";
import Header from "./Header";
import CartDrawer from "./CartDrawer";
import ProductGrid from "./ProductGrid";

export default function StoreShell() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-2xl text-ink sm:text-3xl">
            Well-made things, plainly described
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink/60">
            Twelve products across audio, kitchen, outdoors, and desk. Search,
            filter by category or price, and add to your cart — or let an
            AI agent do it for you via WebMCP.
          </p>
        </div>

        <ProductGrid />
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
