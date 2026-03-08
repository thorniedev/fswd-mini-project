"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, useAuthStore } from "@/store";
import { LoginModal } from "@/components/shared/login-modal";
import type { Product } from "@/features/products/types";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [added, setAdded] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const isAdmin = user?.role === "admin";

  const handleAdd = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    if (isAdmin) {
      return;
    }
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Quantity</span>
          <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              −
            </button>
            <span className="w-10 text-center font-semibold text-sm">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          size="lg"
          className="w-full"
          variant={added ? "success" : "default"}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>

        {!isAuthenticated && (
          <p className="text-xs text-center text-gray-400">
            You need to{" "}
            <button
              onClick={() => setLoginOpen(true)}
              className="text-indigo-600 font-medium hover:underline"
            >
              sign in
            </button>{" "}
            to add items to cart
          </p>
        )}
        {isAuthenticated && isAdmin && (
          <p className="text-xs text-center text-amber-600">
            Admin accounts are for management only. Shopping cart is disabled.
          </p>
        )}
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
