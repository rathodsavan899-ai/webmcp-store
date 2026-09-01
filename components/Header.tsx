"use client";

import { useCart } from "@/context/CartContext";

export default function Header({ onCartClick }: { onCartClick: () => void }) {
  const { summary } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-stone bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="font-display text-xl tracking-tight text-ink">Fieldstone</p>
          <p className="text-xs text-ink/50">goods for the desk, kitchen, and trail</p>
        </div>

        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 rounded-md border border-stone bg-white px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:border-navy/40"
          aria-label="Open cart"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart
          {summary.itemCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rust px-1 text-xs font-semibold text-white">
              {summary.itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
