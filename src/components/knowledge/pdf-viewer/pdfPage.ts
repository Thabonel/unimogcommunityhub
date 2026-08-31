export function clampPdfPage(page: number | undefined, numPages: number): number {
  if (!Number.isFinite(page) || !page) return 1;
  return Math.max(1, Math.min(Math.trunc(page), Math.max(1, numPages)));
}
