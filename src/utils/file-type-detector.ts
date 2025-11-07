export type SupportedFileType = 'pdf' | 'image' | 'video' | 'unsupported';

export function detectFileType(url: string): SupportedFileType {
  if (!url) return 'unsupported';

  const ext = url.split('.').pop()?.toLowerCase();
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
  return url.split('.').pop()?.toLowerCase() || null;
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
