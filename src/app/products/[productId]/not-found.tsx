import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-6xl mb-4">📦</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
      <p className="text-gray-500 mb-8">The product you are looking for does not exist.</p>
      <Link href="/products">
        <Button>Browse Products</Button>
      </Link>
    </div>
  );
}
