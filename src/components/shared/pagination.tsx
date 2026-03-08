"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-between gap-3">
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-300">
          <ChevronLeft className="h-4 w-4" /> Previous
        </span>
      )}

      <div className="flex items-center justify-center gap-2">
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page as number)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                page === currentPage
                  ? "bg-indigo-700 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-300">
          Next <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
