"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatUSD } from "@/lib/webmcp-tools";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { summary, setQuantity, removeItem, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);

  const handleCheckout = () => {
    setPlaced(true);
    setTimeout(() => {
      clearCart();
      setPlaced(false);
      onClose();
    }, 1800);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm transform flex-col bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-stone px-5 py-4">
          <h2 className="font-display text-lg text-ink">Your cart</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink/50 hover:bg-paper hover:text-ink"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {placed ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="text-3xl">✓</div>
            <p className="font-display text-lg text-ink">Order placed</p>
            <p className="text-sm text-ink/60">This is a demo checkout — nothing was charged.</p>
          </div>
        ) : summary.items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-ink/50">
            Your cart is empty. Add something from the catalog.
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-stone overflow-y-auto px-5">
              {summary.items.map((line) => (
                <li key={line.productId} className="flex gap-3 py-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-stone">
                    <Image
                      src={line.product.image}
                      alt={line.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-ink">
                        {line.product.name}
                      </p>
                      <button
                        onClick={() => removeItem(line.productId)}
                        className="text-xs text-ink/40 hover:text-rust"
                        aria-label={`Remove ${line.product.name}`}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          className="h-6 w-6 rounded border border-stone text-sm leading-none text-ink/70 hover:border-navy/40"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm text-ink">{line.quantity}</span>
                        <button
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          className="h-6 w-6 rounded border border-stone text-sm leading-none text-ink/70 hover:border-navy/40"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-navy">
                        {formatUSD(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-stone px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-ink/60">Subtotal · {summary.itemCount} items</span>
                <span className="text-base font-semibold text-ink">
                  {formatUSD(summary.subtotal)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full rounded-md bg-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
