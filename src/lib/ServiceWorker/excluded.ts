const serviceWorkerExclude = ["/preview"];

export function idIsExcluded(pageId: string | null): boolean {
  if (pageId === null) return true;
  return serviceWorkerExclude.includes(pageId);
}
