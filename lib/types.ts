export type Category = "audio" | "kitchen" | "outdoors" | "desk";

export interface Product {
  id: string;
  name: string;
  price: number; // USD, in dollars
  category: Category;
  description: string;
  image: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface CartSummary {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
}
