import type { Category } from "@/features/products/types";

const BLOCKED_PATTERN =
  /(%0d|%0a|<|>|script|cookie|bcc:|subject:|cmd|\r|\n|alert\(|content-type|return-path|x-mailer)/i;

const ALLOWED_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s&+/'().,-]*$/u;

function normalizeCategoryName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

export function isReadableCategoryName(name: string) {
  const normalized = normalizeCategoryName(name);
  if (normalized.length < 2 || normalized.length > 42) return false;
  if (BLOCKED_PATTERN.test(normalized)) return false;
  return ALLOWED_PATTERN.test(normalized);
}

export function buildUserSafeCategories(
  categories: Category[],
  categoryCounts: Record<number, number>
) {
  return categories
    .filter((category) => (categoryCounts[category.id] ?? 0) > 0)
    .map((category) => ({
      ...category,
      name: normalizeCategoryName(category.name),
    }))
    .filter((category) => isReadableCategoryName(category.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}
