import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { getProductById } from "@/features/products/queries";
import { formatPrice, getSafeImage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productId } = await params;
  try {
    const product = await getProductById(Number(productId));
    return { title: product.title };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;

  let product;
  try {
    product = await getProductById(Number(productId));
  } catch {
    notFound();
  }

  const imageUrl = getSafeImage(product.images);
  const extraImages = product.images.slice(1, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {extraImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {extraImages.map((img, i) => {
                const url = img.replace(/^\["|"\]$/g, "").trim();
                if (!url.startsWith("http")) return null;
                return (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={url}
                      alt={`${product.title} ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="info">
                <Tag className="h-3 w-3 mr-1" />
                {product.category.name}
              </Badge>
              <span className="text-xs text-gray-400">ID: #{product.id}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
          </div>

          <div className="text-4xl font-bold text-indigo-600">
            {formatPrice(product.price)}
          </div>

          <div className="prose prose-sm text-gray-600 max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <AddToCartButton product={product} />
          </div>

          {/* Meta */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Category</span>
              <Link href={`/products?categoryId=${product.category.id}`} className="font-medium text-indigo-600 hover:underline">
                {product.category.name}
              </Link>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price</span>
              <span className="font-semibold">{formatPrice(product.price)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
