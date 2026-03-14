/**
 * Generate a URL-friendly slug from a title (lowercase, hyphens, no special chars).
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50)
}
