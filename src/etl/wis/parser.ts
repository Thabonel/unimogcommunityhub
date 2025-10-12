import { promises as fs } from 'fs';
import * as path from 'path';

export type ParsedProcedure = {
  title: string;
  steps: { step_number: number; instruction: string }[];
};

export async function parseHtmlProcedure(filePath: string): Promise<ParsedProcedure> {
  const html = await fs.readFile(filePath, 'utf8');
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : path.basename(filePath);
  const steps: { step_number: number; instruction: string }[] = [];
  const olMatch = html.match(/<ol[\s\S]*?<\/ol>/i);
  if (olMatch) {
    const items = Array.from(olMatch[0].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
    items.forEach((m, i) => {
      const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (text) steps.push({ step_number: i + 1, instruction: text });
    });
  }
  return { title, steps };
}

