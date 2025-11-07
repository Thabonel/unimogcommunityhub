export type SupportedFileType = 'pdf' | 'image' | 'video' | 'unsupported';

export function detectFileType(url: string): SupportedFileType {
  if (!url) return 'unsupported';

  // Strip query string and hash fragments before detecting extension
  let clean = url;
  try {
    // Use URL parser when possible (absolute URLs)
    const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    clean = u.pathname; // only the path part (e.g., /path/file.pdf)
  } catch (_) {
    // Fallback: manually strip common fragments/queries
    clean = url.split('#')[0].split('?')[0];
  }

  const ext = clean.split('.').pop()?.toLowerCase();
  if (!ext) return 'unsupported';

  if (ext === 'pdf') return 'pdf';

  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext)) {
    return 'image';
  }

  if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
    return 'video';
  }

  return 'unsupported';
}

export function getFileExtension(url: string): string | null {
  if (!url) return null;
  let clean = url;
  try {
    const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    clean = u.pathname;
  } catch (_) {
    clean = url.split('#')[0].split('?')[0];
  }
  return clean.split('.').pop()?.toLowerCase() || null;
}

export function isImageFile(url: string): boolean {
  return detectFileType(url) === 'image';
}

export function isPdfFile(url: string): boolean {
  return detectFileType(url) === 'pdf';
}

export function isVideoFile(url: string): boolean {
  return detectFileType(url) === 'video';
}
