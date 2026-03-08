'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Grid2x2, List } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/features/products/types';
import { cn, truncate } from '@/lib/utils';

interface ProductsToolbarProps {
  categories: Category[];
}

export function ProductsToolbar({ categories }: ProductsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentView = searchParams.get('view') === 'list' ? 'list' : 'grid';
  const currentCategoryId = searchParams.get('categoryId') ?? '';
  const selectedCategory = categories.find((category) => String(category.id) === currentCategoryId);
  const visibleCategories = useMemo(() => {
    const normalizedSearch = categorySearch.trim().toLowerCase();
    const filtered = normalizedSearch
      ? categories.filter((category) => category.name.toLowerCase().includes(normalizedSearch))
      : categories;
    return filtered.slice(0, 30);
  }, [categories, categorySearch]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    return () => window.removeEventListener('mousedown', onPointerDown);
  }, []);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 w-56 max-w-[56vw] items-center justify-between gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground"
          title="Select category"
        >
          <span className="truncate">
            {selectedCategory ? truncate(selectedCategory.name, 30) : 'All Category'}
          </span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-border bg-popover p-2 shadow-xl">
            <input
              value={categorySearch}
              onChange={(event) => setCategorySearch(event.target.value)}
              placeholder="Search category..."
              className="mb-2 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <div className="max-h-72 overflow-y-auto overscroll-contain pr-1">
              <button
                onClick={() => {
                  updateParam('categoryId', null);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm',
                  currentCategoryId === '' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-muted'
                )}
              >
                <span>All Category</span>
                {currentCategoryId === '' && <Check className="h-4 w-4" />}
              </button>
              {visibleCategories.map((category) => {
                const active = currentCategoryId === String(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      updateParam('categoryId', String(category.id));
                      setOpen(false);
                    }}
                    className={cn(
                      'mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm',
                      active ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-muted'
                    )}
                    title={category.name}
                  >
                    <span className="truncate">{truncate(category.name, 42)}</span>
                    {active && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
              {visibleCategories.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">No category found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => updateParam('view', 'grid')}
        className={cn(
          'inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors',
          currentView === 'grid'
            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
        )}
        aria-label="Grid view"
      >
        <Grid2x2 className="h-5 w-5" />
      </button>

      <button
        onClick={() => updateParam('view', 'list')}
        className={cn(
          'inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors',
          currentView === 'list'
            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
        )}
        aria-label="List view"
      >
        <List className="h-5 w-5" />
      </button>
    </div>
  );
}
