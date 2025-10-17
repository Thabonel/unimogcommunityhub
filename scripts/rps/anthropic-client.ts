import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy-load client to ensure environment variables are set
let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface AnthropicResponse {
  content: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Call Claude Sonnet 4 for complex analysis tasks
 */
export async function callSonnet(
  prompt: string,
  pdfPath?: string,
  maxTokens: number = 4096
): Promise<AnthropicResponse> {
  console.log('🤖 Calling Claude Sonnet 4...');

  const messages: Anthropic.MessageParam[] = [];

  if (pdfPath) {
    // Read PDF and encode as base64
    const pdfData = fs.readFileSync(pdfPath);
    const base64Pdf = pdfData.toString('base64');

    messages.push({
      role: 'user',
      content: [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: base64Pdf,
          },
        },
        {
          type: 'text',
          text: prompt,
        },
      ],
    });
  } else {
    messages.push({
      role: 'user',
      content: prompt,
    });
  }

  const response = await getClient().messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: maxTokens,
    messages,
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';

  console.log(`✅ Sonnet response: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`);

  return {
    content,
    model: response.model,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  };
}

/**
 * Call Claude Haiku 4 for fast, structured extraction
 */
export async function callHaiku(
  prompt: string,
  pdfPath?: string,
  maxTokens: number = 4096
): Promise<AnthropicResponse> {
  console.log('⚡ Calling Claude Haiku 4...');

  const messages: Anthropic.MessageParam[] = [];

  if (pdfPath) {
    const pdfData = fs.readFileSync(pdfPath);
    const base64Pdf = pdfData.toString('base64');

    messages.push({
      role: 'user',
      content: [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: base64Pdf,
          },
        },
        {
          type: 'text',
          text: prompt,
        },
      ],
    });
  } else {
    messages.push({
      role: 'user',
      content: prompt,
    });
  }

  const response = await getClient().messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: maxTokens,
    messages,
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';

  console.log(`✅ Haiku response: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`);

  return {
    content,
    model: response.model,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  };
}

/**
 * Load prompt template from file
 */
export function loadPrompt(promptName: string): string {
  const promptPath = path.join(__dirname, 'prompts', `${promptName}.md`);
  return fs.readFileSync(promptPath, 'utf-8');
}

/**
 * Extract JSON from Claude response (handles markdown code blocks)
 */
export function extractJSON<T>(response: string): T {
  // Try to find JSON in markdown code block
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }

  // Try to find raw JSON
  const rawJsonMatch = response.match(/\{[\s\S]*\}/);
  if (rawJsonMatch) {
    return JSON.parse(rawJsonMatch[0]);
  }

  // Try to parse entire response
  return JSON.parse(response);
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⚠️ Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
