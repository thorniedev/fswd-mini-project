import Link from "next/link";
import { AppLogo } from "@/components/common/app-logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <AppLogo width={130} height={40} />
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
            <Link href="/#categories" className="hover:text-indigo-600 transition-colors">Categories</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            <Link href="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link>
          </nav>
          <p className="text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} I-Shop · Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
