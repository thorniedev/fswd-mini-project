export const dynamic = 'force-dynamic';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Users, Star, Zap, Laptop, Camera, Package, ShoppingBagIcon, Watch, Headphones } from "lucide-react";
import { getProducts, getCategories } from "@/features/products/queries";
import { ProductCard } from "@/components/products/product-card";
import { getSafeImage } from "@/lib/utils";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Meteors } from "@/components/ui/meteors";
import { SparklesText } from "@/components/ui/sparkles-text";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(),
  ]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-20">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-100" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Meteors
            number={32}
            minDelay={0.2}
            maxDelay={1.6}
            minDuration={2}
            maxDuration={8}
            angle={215}
            className="bg-white/60 shadow-[0_0_0_1px_#ffffff30]"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium mb-6">
                <Zap className="h-4 w-4 text-yellow-300" />
                New arrivals every day
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-3">
                <SparklesText>Shop the</SparklesText>
                
                <span className="text-yellow-300">Future</span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-200 mb-8 max-w-xl">
                Discover thousands of products across every category. Quality, style, and value all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-indigo-700 px-7 py-3.5 font-semibold text-base hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 text-white px-7 py-3.5 font-semibold text-base hover:bg-white/10 transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:flex h-[520px] items-center justify-end pr-2">
              <div className="relative h-[520px] w-[520px] rounded-full">
                <OrbitingCircles radius={190} iconSize={68} speed={0.8}>
                  <Laptop className="h-9 w-9 text-white/95" />
                  <Camera className="h-9 w-9 text-white/95" />
                  <Package className="h-9 w-9 text-white/95" />
                  <ShoppingBagIcon className="h-9 w-9 text-white/95" />
                  <Watch className="h-9 w-9 text-white/95" />
                </OrbitingCircles>
                <OrbitingCircles reverse radius={130} iconSize={52} speed={1.2}>
                  <Headphones className="h-7 w-7 text-white/95" />
                  <ShoppingBag className="h-7 w-7 text-white/95" />
                  <Star className="h-7 w-7 text-white/95" />
                </OrbitingCircles>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShoppingBag, label: "Products", value: "200+" },
            { icon: Users, label: "Happy Customers", value: "10k+" },
            { icon: Star, label: "Avg. Rating", value: "4.8★" },
            { icon: Zap, label: "Fast Delivery", value: "24h" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
              <Icon className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link href="/products" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100"
            >
              <Image
                src={getSafeImage([cat.image])}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-semibold text-sm text-center">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
