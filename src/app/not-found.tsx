import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-8xl font-black text-indigo-100 mb-0 leading-none select-none">404</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 -mt-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
