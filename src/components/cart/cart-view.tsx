"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCartStore, useAuthStore, useNotificationStore } from "@/store";
import { Button } from "@/components/ui/button";
import { formatPrice, getSafeImage } from "@/lib/utils";
import { LoginModal } from "@/components/shared/login-modal";
import { useState } from "react";

export function CartView() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { pushNotification } = useNotificationStore();
  const [loginOpen, setLoginOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const cartTotal = total();
  const isAdmin = user?.role === "admin";

  const handleCheckout = async () => {
    if (items.length === 0) {
      pushNotification({
        type: "error",
        title: "Checkout failed",
        message: "Your cart is empty.",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      // Simulate a payment/checkout API response.
      if (Math.random() < 0.2) {
        throw new Error("Checkout service unavailable");
      }

      clearCart();
      pushNotification({
        type: "success",
        title: "Checkout successful",
        message: "Your order has been placed.",
      });
    } catch {
      pushNotification({
        type: "error",
        title: "Checkout failed",
        message: "Please try again in a moment.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your cart</h2>
          <p className="text-gray-500 mb-8 max-w-sm">
            You need to be logged in to manage your cart and make purchases.
          </p>
          <Button onClick={() => setLoginOpen(true)} size="lg">
            Sign In
          </Button>
        </div>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Cart is not available for admin</h2>
        <p className="mb-8 max-w-sm text-gray-500">
          Admin accounts are used for store management. Please use a customer account for shopping.
        </p>
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started!</p>
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart
          <span className="ml-3 text-lg font-normal text-gray-400">({items.length} items)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const imageUrl = getSafeImage(item.product.images);
            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <Link href={`/products/${item.product.id}`} className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 hover:text-indigo-600 transition-colors">
                      {item.product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-400 mt-0.5">{item.product.category.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-indigo-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span className="truncate flex-1 mr-2">{item.product.title} ×{item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout} loading={isCheckingOut}>
              Checkout
            </Button>
            <Link href="/products" className="block text-center text-sm text-indigo-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
