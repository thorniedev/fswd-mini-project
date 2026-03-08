import { UserCardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-2 mb-8">
        <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 w-40 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(12)].map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
