"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import type { Category } from "@/features/products/types";

interface ProductFiltersProps {
  categories: Category[];
  totalCount: number;
  categoryCounts: Record<number, number>;
}

export function ProductFilters({ categories, totalCount, categoryCounts }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [minValue, setMinValue] = useState(searchParams.get("price_min") ?? "50");
  const [maxValue, setMaxValue] = useState(searchParams.get("price_max") ?? "500");
  const [categorySearch, setCategorySearch] = useState("");

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 on filter change
      if (!("page" in updates)) params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  const handleCategory = (value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ categoryId: value || null })}`);
    });
  };

  const applyPriceRange = () => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          price_min: minValue || null,
          price_max: maxValue || null,
        })}`
      );
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters =
    searchParams.has("title") ||
    searchParams.has("categoryId") ||
    searchParams.has("price_min") ||
    searchParams.has("price_max");

  const selectedCategoryId = searchParams.get("categoryId");
  const minNumber = Number(minValue || "0");
  const maxNumber = Number(maxValue || "0");
  const visibleCategories = useMemo(() => {
    const normalizedSearch = categorySearch.trim().toLowerCase();
    const filtered = normalizedSearch
      ? categories.filter((category) => category.name.toLowerCase().includes(normalizedSearch))
      : categories;

    const selected = filtered.find((category) => String(category.id) === selectedCategoryId);
    const base = filtered.slice(0, 30);
    if (selected && !base.some((category) => category.id === selected.id)) {
      return [selected, ...base.slice(0, 29)];
    }
    return base;
  }, [categories, categorySearch, selectedCategoryId]);

  return (
    <aside
      key={searchParams.toString()}
      className={`space-y-8 rounded-3xl border border-border bg-card p-5 transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Categories</h3>
        <div className="space-y-1.5">
          <input
            value={categorySearch}
            onChange={(event) => setCategorySearch(event.target.value)}
            placeholder="Search category..."
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            onClick={() => handleCategory("")}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium transition-colors ${
              !selectedCategoryId ? "bg-indigo-100 text-indigo-700" : "text-foreground hover:bg-muted"
            }`}
          >
            <span>All Products</span>
            <span className="rounded-full bg-background px-2 py-0.5 text-xs">{totalCount}</span>
          </button>
          <div className="max-h-72 space-y-1.5 overflow-y-auto overscroll-contain pr-1">
            {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategory(String(category.id))}
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                selectedCategoryId === String(category.id)
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="max-w-[150px] truncate" title={category.name}>
                {category.name}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {categoryCounts[category.id] ?? 0}
              </span>
            </button>
            ))}
            {visibleCategories.length === 0 && (
              <p className="px-2 py-3 text-sm text-muted-foreground">No category found.</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={minNumber}
            onChange={(e) => setMinValue(e.target.value)}
            className="w-full accent-indigo-600"
          />
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={maxNumber}
            onChange={(e) => setMaxValue(e.target.value)}
            className="w-full accent-indigo-600"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="rounded-2xl bg-muted px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Min</p>
            <input
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              className="w-full bg-transparent text-lg font-bold text-foreground outline-none"
            />
          </label>
          <label className="rounded-2xl bg-muted px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Max</p>
            <input
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              className="w-full bg-transparent text-lg font-bold text-foreground outline-none"
            />
          </label>
        </div>
        <button
          onClick={applyPriceRange}
          className="w-full rounded-2xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Apply Price
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="w-full rounded-2xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Clear all filters
          </button>
        )}
      </section>
    </aside>
  );
}
