import { execFileSync, execFile } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

interface ReprocessOptions {
  pdfPath: string;
  outDir: string;
  modelPath: string;
  mmprojPath: string;
  pageStart: number;
  pageEnd: number;
  dpi: number;
  prompt: string;
  maxTokens: number;
}

const DET_PATTERN = /<\|\/?det\|>([^<\s]+)(?:\s*\[[^\]]*\])?\s*<\|\/det\|>(.*)/s;
const STRAY_DET_TAG = /<\|\/?det\|>/g;

export function removeDetMarkers(raw: string): string {
  const blocks: string[] = [];
  let current: string[] | null = null;

  for (const line of raw.split('\n')) {
    const trimmed = line.trimEnd();
    if (!trimmed) continue;
    const match = trimmed.match(DET_PATTERN);
    if (match) {
      const category = match[1].trim();
      const content = match[2].trim();
      if (category === 'image') continue;
      if (current !== null) blocks.push(current.join('\n'));
      current = content ? [content] : [];
      continue;
    }
    const cleaned = trimmed.replace(STRAY_DET_TAG, '').trim();
    if (!cleaned) continue;
    if (current === null) current = [];
    current.push(cleaned);
  }
  if (current !== null) blocks.push(current.join('\n'));

  return blocks
    .map((block) => block.trim())
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function parseArgs(argv: string[]): ReprocessOptions {
  const options: ReprocessOptions = {
    pdfPath: '',
    outDir: '/tmp/barry-ocr-out',
    modelPath: process.env.BARRY_OCR_MODEL ?? '/tmp/ocr-pilot/model.gguf',
    mmprojPath: process.env.BARRY_OCR_MMPROJ ?? '/tmp/ocr-pilot/mmproj.gguf',
    pageStart: 1,
    pageEnd: 0,
    dpi: 300,
    prompt: 'document parsing.',
    maxTokens: 3000,
  };
  for (const arg of argv) {
    if (arg.startsWith('--pdf=')) options.pdfPath = arg.slice(6);
    else if (arg.startsWith('--out=')) options.outDir = arg.slice(6);
    else if (arg.startsWith('--model=')) options.modelPath = arg.slice(8);
    else if (arg.startsWith('--mmproj=')) options.mmprojPath = arg.slice(9);
    else if (arg.startsWith('--pages=')) {
      const [start, end] = arg.slice(8).split('-').map(Number);
      options.pageStart = start;
      options.pageEnd = end ?? start;
    } else if (arg.startsWith('--dpi=')) options.dpi = Number(arg.slice(6));
    else if (arg.startsWith('--max-tokens=')) options.maxTokens = Number(arg.slice(13));
    else throw new Error(`Unknown argument ${arg}`);
  }
  if (!options.pdfPath) throw new Error('Provide --pdf=<path>');
  if (!options.pageEnd) {
    const output = execFileSync('pdfinfo', [options.pdfPath], { encoding: 'utf8' });
    const match = output.match(/Pages:\s+(\d+)/);
    if (!match) throw new Error('Could not determine PDF page count; pass --pages=a-b');
    options.pageEnd = Number(match[1]);
  }
  return options;
}

async function processPage(options: ReprocessOptions, page: number): Promise<void> {
  const markdownPath = join(options.outDir, 'markdown', `page_${String(page).padStart(4, '0')}.md`);
  if (existsSync(markdownPath)) return;

  const imagePrefix = join(options.outDir, 'images', `page_${page}`);
  if (!existsSync(join(options.outDir, 'images'))) {
    mkdirSync(join(options.outDir, 'images'), { recursive: true });
  }
  mkdirSync(join(options.outDir, 'markdown'), { recursive: true });

  execFileSync('pdftoppm', [
    '-f', String(page),
    '-l', String(page),
    '-r', String(options.dpi),
    '-png',
    options.pdfPath,
    imagePrefix,
  ]);
  const imagePath = join(
    options.outDir,
    'images',
    `page_${page}-${String(page).padStart(4, '0')}.png`,
  );

  const { stdout } = await execFileAsync('llama-mtmd-cli', [
    '-m', options.modelPath,
    '--mmproj', options.mmprojPath,
    '--image', imagePath,
    '-p', options.prompt,
    '--temp', '0',
    '-n', String(options.maxTokens),
    '--jinja',
  ], { maxBuffer: 64 * 1024 * 1024 });

  const markdown = removeDetMarkers(stdout);
  writeFileSync(markdownPath, markdown + '\n');

  const indexLine = JSON.stringify({
    page,
    image: imagePath,
    markdown_chars: markdown.length,
    processed_at: new Date().toISOString(),
  });
  appendFileSync(join(options.outDir, 'index.jsonl'), indexLine + '\n');
}

async function run(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  mkdirSync(options.outDir, { recursive: true });
  writeFileSync(join(options.outDir, 'run-config.json'), JSON.stringify({
    ...options,
    pdfPath: options.pdfPath.split('/').pop(),
    started_at: new Date().toISOString(),
  }, null, 2));

  let processed = 0;
  let skipped = 0;
  const failures: number[] = [];
  const startedAt = Date.now();

  for (let page = options.pageStart; page <= options.pageEnd; page += 1) {
    const markdownPath = join(options.outDir, 'markdown', `page_${String(page).padStart(4, '0')}.md`);
    if (existsSync(markdownPath)) {
      skipped += 1;
      continue;
    }
    try {
      await processPage(options, page);
      processed += 1;
      const elapsedMin = (Date.now() - startedAt) / 60000;
      const rate = processed / elapsedMin;
      const remaining = (options.pageEnd - options.pageStart + 1) - processed - skipped;
      console.log(`[${page}/${options.pageEnd}] ok | ${processed} done, ${skipped} resumed, ~${Math.round(remaining / rate)} min left`);
    } catch (error) {
      failures.push(page);
      console.error(`[${page}/${options.pageEnd}] FAILED: ${(error as Error).message.slice(0, 160)}`);
    }
  }

  writeFileSync(join(options.outDir, 'run-result.json'), JSON.stringify({
    processed,
    skipped,
    failures,
    finished_at: new Date().toISOString(),
  }, null, 2));
  console.log(JSON.stringify({ processed, skipped, failures: failures.length, outDir: options.outDir }));
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
