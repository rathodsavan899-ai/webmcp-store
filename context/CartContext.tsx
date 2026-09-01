"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { getProductById } from "@/lib/products";
import { buildCartSummary } from "@/lib/webmcp-tools";
import { CartItem, CartSummary } from "@/lib/types";

type Action =
  | { type: "ADD"; productId: string; quantity: number }
  | { type: "REMOVE"; productId: string; quantity?: number }
  | { type: "SET_QTY"; productId: string; quantity: number }
  | { type: "CLEAR" };

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "ADD": {
      if (!getProductById(action.productId)) return state; // unknown id, ignore
      const existing = state.find((i) => i.productId === action.productId);
      if (existing) {
        return state.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: i.quantity + action.quantity }
            : i
        );
      }
      return [...state, { productId: action.productId, quantity: action.quantity }];
    }
    case "REMOVE": {
      const existing = state.find((i) => i.productId === action.productId);
      if (!existing) return state;
      const decrementBy = action.quantity ?? existing.quantity; // default: remove all
      const newQty = existing.quantity - decrementBy;
      if (newQty <= 0) {
        return state.filter((i) => i.productId !== action.productId);
      }
      return state.map((i) =>
        i.productId === action.productId ? { ...i, quantity: newQty } : i
      );
    }
    case "SET_QTY": {
      if (action.quantity <= 0) {
        return state.filter((i) => i.productId !== action.productId);
      }
      const existing = state.find((i) => i.productId === action.productId);
      if (!existing) {
        if (!getProductById(action.productId)) return state;
        return [...state, { productId: action.productId, quantity: action.quantity }];
      }
      return state.map((i) =>
        i.productId === action.productId ? { ...i, quantity: action.quantity } : i
      );
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  summary: CartSummary;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  const addItem = useCallback((productId: string, quantity = 1) => {
    dispatch({ type: "ADD", productId, quantity });
  }, []);

  const removeItem = useCallback((productId: string, quantity?: number) => {
    dispatch({ type: "REMOVE", productId, quantity });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "SET_QTY", productId, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const summary = useMemo(() => buildCartSummary(items), [items]);

  const value = useMemo(
    () => ({ summary, addItem, removeItem, setQuantity, clearCart }),
    [summary, addItem, removeItem, setQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
