export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Package, Users, Tag, ShoppingBag, Pencil, Trash2, Search, X } from 'lucide-react';
import { getProducts, getCategories } from '@/features/products/queries';
import { getUsers } from '@/features/users/queries';
import { formatPrice, getSafeImage } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoryId?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? '').toLowerCase();
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;

  const [products, users, categories] = await Promise.all([
    getProducts({ limit: 200 }),
    getUsers(200),
    getCategories(),
  ]);

  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: ShoppingBag,
      tint: 'bg-indigo-50 text-indigo-600',
      delta: '+12%',
      deltaClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Total Products',
      value: products.length.toLocaleString(),
      icon: Package,
      tint: 'bg-blue-50 text-blue-600',
      delta: '+8%',
      deltaClass: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Active Users',
      value: users.length.toLocaleString(),
      icon: Users,
      tint: 'bg-violet-50 text-violet-600',
      delta: '-2%',
      deltaClass: 'bg-red-50 text-red-700',
    },
    {
      label: 'Categories',
      value: categories.length.toLocaleString(),
      icon: Tag,
      tint: 'bg-orange-50 text-orange-600',
      delta: '+5%',
      deltaClass: 'bg-emerald-50 text-emerald-700',
    },
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesQuery = query ? product.title.toLowerCase().includes(query) : true;
      const matchesCategory = categoryId ? product.category.id === categoryId : true;
      return matchesQuery && matchesCategory;
    })
    .slice(0, 10)
    .map((product) => {
    const stock = (product.id * 7) % 60;
    const lowStock = stock > 0 && stock <= 12;
    return {
      ...product,
      stock,
      status: stock === 0 ? 'Out of Stock' : lowStock ? 'Low Stock' : 'Active',
    };
  });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="mt-1 text-lg text-slate-500">Manage your store operations from one place.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tint, delta, deltaClass }) => (
          <article key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className={`rounded-lg px-2 py-1 text-xs font-bold ${deltaClass}`}>{delta}</span>
            </div>
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">{value}</p>
            <div className="mt-4 h-10 rounded-lg bg-gradient-to-r from-indigo-100 via-indigo-50 to-transparent" />
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Product Management</h2>
            <p className="text-slate-500">Showing {filteredProducts.length} of {products.length} products</p>
          </div>
          <form className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 lg:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1 lg:w-[260px] lg:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  defaultValue={params.q ?? ''}
                  placeholder="Search product title..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            <select
              name="categoryId"
              defaultValue={params.categoryId ?? ''}
              className="w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Apply
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-slate-500 hover:bg-white hover:text-slate-700"
            >
              <X className="h-4 w-4" />
              Reset
            </Link>
            <Link
              href="/dashboard/products"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Manage Products
            </Link>
            <Link
              href="/dashboard/products"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Add Product
              <ChevronRight className="h-4 w-4" />
            </Link>
            </div>
          </form>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={getSafeImage(product.images)}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{product.title}</p>
                        <p className="text-xs text-slate-500">ID: PRD-{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{product.category.name}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 text-slate-700">{product.stock} units</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-semibold ${
                        product.status === 'Active'
                          ? 'text-emerald-600'
                          : product.status === 'Low Stock'
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/dashboard/products"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-indigo-600 hover:bg-indigo-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
