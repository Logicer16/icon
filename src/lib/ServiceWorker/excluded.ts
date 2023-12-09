/**
 * @file
 */

/**
 * Paths which the service worker is excluded from operating on.
 */
const serviceWorkerExclude = ["/preview"];

/**
 * Checks if the page ID is an excluded path.
 * @param pageId The page ID which should be checked if it is excluded.
 * @returns True if the page ID is excluded, otherwise false.
 */
export function idIsExcluded(pageId: string | null): boolean {
  if (pageId === null) return true;
  return serviceWorkerExclude.includes(pageId);
}
