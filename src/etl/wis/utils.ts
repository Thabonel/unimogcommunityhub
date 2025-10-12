import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';

export async function sha256File(filePath: string): Promise<string> {
  const h = createHash('sha256');
  const buf = await fs.readFile(filePath);
  h.update(buf);
  return h.digest('hex');
}

export function guessContentType(p: string): string {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.pdf':
      return 'application/pdf';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

