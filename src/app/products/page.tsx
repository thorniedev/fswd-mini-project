export const dynamic = 'force-dynamic';

import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductsToolbar } from '@/components/products/products-toolbar';
import { Pagination } from '@/components/shared/pagination';
import { getProducts, getCategories } from '@/features/products/queries';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Products' };

const LIMIT = 12;

interface PageProps {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    price_min?: string;
    price_max?: string;
    view?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const offset = (page - 1) * LIMIT;

  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const price_min = params.price_min ? Number(params.price_min) : undefined;
  const price_max = params.price_max ? Number(params.price_max) : undefined;
  const view = params.view === 'list' ? 'list' : 'grid';

  const [products, filteredProducts, categories, allCatalogProducts] = await Promise.all([
    getProducts({
      limit: LIMIT,
      offset,
      categoryId,
      price_min,
      price_max,
    }),
    getProducts({
      categoryId,
      price_min,
      price_max,
      limit: 300,
    }),
    getCategories(),
    getProducts({ limit: 300 }),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / LIMIT));
  const categoryCounts = allCatalogProducts.reduce<Record<number, number>>((acc, product) => {
    acc[product.category.id] = (acc[product.category.id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto w-full max-w-[1400px] overflow-x-clip px-3 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProductFilters
          categories={categories}
          totalCount={allCatalogProducts.length}
          categoryCounts={categoryCounts}
        />

        <section className="min-w-0 space-y-6">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900">All Products</h1>
              <p className="mt-1 text-lg text-slate-500">
                Showing {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, filteredProducts.length)} of {filteredProducts.length} results
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ProductsToolbar categories={categories} />
            </div>
          </header>

          {products.length > 0 ? (
            <div className={view === 'list' ? 'min-w-0 space-y-4' : 'min-w-0 grid gap-4 md:grid-cols-2 xl:grid-cols-3'}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} view={view} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-white text-2xl leading-[56px] text-slate-400">☹</div>
              <h2 className="text-4xl font-black text-slate-900">No products found</h2>
              <p className="mx-auto mt-2 max-w-xl text-lg text-slate-500">
                We could not find anything matching your filters. Try a different category or price range.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Reset Filters
              </Link>
            </div>
          )}

          <div className="border-t border-slate-200 pt-6">
            <Pagination totalPages={totalPages} currentPage={page} />
          </div>
        </section>
      </div>
    </div>
  );
}
