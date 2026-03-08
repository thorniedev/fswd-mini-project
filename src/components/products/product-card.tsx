"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatPrice, getSafeImage } from "@/lib/utils";
import { useCartStore, useAuthStore } from "@/store";
import type { Product } from "@/features/products/types";
import { useState } from "react";
import { LoginModal } from "@/components/shared/login-modal";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [loginOpen, setLoginOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const imageUrl = getSafeImage(product.images);
  const isAdmin = user?.role === "admin";

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    if (isAdmin) {
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (view === "list") {
    return (
      <>
        <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-4">
            <Link href={`/products/${product.id}`} className="relative block h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="112px"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="mb-1 inline-flex rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                {product.category.name}
              </div>
              <Link href={`/products/${product.id}`} className="block">
                <h3 className="line-clamp-1 text-2xl font-black tracking-tight text-slate-900">
                  {product.title}
                </h3>
              </Link>
              <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="text-3xl font-black tracking-tight text-indigo-700">{formatPrice(product.price)}</span>
              <button
                onClick={handleAddToCart}
                disabled={isAdmin}
                className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
                  isAdmin
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : added
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {added ? "Added" : "Add"}
              </button>
            </div>
          </div>
        </div>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:shadow-lg">
        <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden rounded-3xl bg-slate-100">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
            {product.category.name}
          </div>
        </Link>

        <div className="space-y-3 px-1 pb-1 pt-4">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="line-clamp-1 text-[30px] font-black leading-tight tracking-tight text-slate-900">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-black tracking-tight text-indigo-700">{formatPrice(product.price)}</span>
            <button
              onClick={handleAddToCart}
              disabled={isAdmin}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                isAdmin
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : added
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
