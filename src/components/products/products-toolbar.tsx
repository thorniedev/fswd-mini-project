'use client';

import { Grid2x2, List } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/features/products/types';
import { cn } from '@/lib/utils';

interface ProductsToolbarProps {
  categories: Category[];
}

export function ProductsToolbar({ categories }: ProductsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = searchParams.get('view') === 'list' ? 'list' : 'grid';

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={searchParams.get('categoryId') ?? ''}
        onChange={(e) => updateParam('categoryId', e.target.value || null)}
        className="w-48 max-w-[52vw] truncate rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none"
        title="Select category"
      >
        <option value="">All Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

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
