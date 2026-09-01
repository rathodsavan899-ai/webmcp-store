"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { formatUSD } from "@/lib/webmcp-tools";
import { useCart } from "@/context/CartContext";

const CATEGORY_LABEL: Record<Product["category"], string> = {
  audio: "Audio",
  kitchen: "Kitchen",
  outdoors: "Outdoors",
  desk: "Desk",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-stone bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-navy">
          {CATEGORY_LABEL[product.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-snug text-ink">{product.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-ink/70">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold text-navy">{formatUSD(product.price)}</span>
          <button
            onClick={() => addItem(product.id, 1)}
            className="rounded-md bg-navy px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-navy/90 active:bg-navy/80"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
