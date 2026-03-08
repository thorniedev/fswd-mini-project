import { ProductDetailSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-6 w-32 bg-gray-200 rounded-full mb-8 animate-pulse" />
      <ProductDetailSkeleton />
    </div>
  );
}
