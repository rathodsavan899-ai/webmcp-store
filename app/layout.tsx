import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import WebMCPProvider from "@/components/WebMCPProvider";

export const metadata: Metadata = {
  title: "Fieldstone — goods for desk, kitchen, and trail",
  description:
    "A small e-commerce demo built with Next.js and exposed to AI agents via WebMCP.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body text-ink antialiased">
        <CartProvider>
          <WebMCPProvider>{children}</WebMCPProvider>
        </CartProvider>
      </body>
    </html>
  );
}
