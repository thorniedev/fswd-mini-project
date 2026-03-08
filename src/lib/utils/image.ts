export function getSafeImage(images: string[]): string {
  if (!images?.length) return 'https://placehold.co/400x400?text=No+Image';

  const raw = images[0];
  const cleaned = raw.replace(/^\["|"\]$/g, '').trim();
  if (cleaned.startsWith('http')) return cleaned;

  return 'https://placehold.co/400x400?text=No+Image';
}

export function getSafeImageUrl(images: string[]): string {
  return getSafeImage(images);
}
