export function getSafeImage(images: string[]): string {
  if (!images?.length) return "https://picsum.photos/seed/i-shop-no-image/400/400";

  const raw = images[0];
  const cleaned = raw.replace(/^\["|"\]$/g, '').trim();
  if (cleaned.startsWith('http')) return cleaned;

  return "https://picsum.photos/seed/i-shop-no-image/400/400";
}

export function getSafeImageUrl(images: string[]): string {
  return getSafeImage(images);
}
