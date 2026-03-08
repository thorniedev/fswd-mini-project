export { cn } from '@/lib/utils/cn';
export { formatPrice } from '@/lib/utils/currency';
export { getSafeImage, getSafeImageUrl } from '@/lib/utils/image';

export function truncate(str: string, n: number): string {
  return str.length > n ? `${str.slice(0, n - 1)}...` : str;
}
