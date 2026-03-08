export const dynamic = 'force-dynamic';
import { getProducts, getCategories } from "@/features/products/queries";
import { AdminProductsClient } from "@/components/products/admin-products-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const initialSearch = params.q?.trim() ?? "";

  const [products, categories] = await Promise.all([
    getProducts({ limit: 200 }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{products.length} total products</p>
        </div>
      </div>
      <AdminProductsClient
        products={products}
        categories={categories}
        initialSearch={initialSearch}
      />
    </div>
  );
}
