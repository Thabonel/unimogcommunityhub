/**
 * Barry OpenClaw Type Definitions
 * Shared types for Barry AI skills and services
 */

import { z } from 'zod';

// Domain classification
export const BarryDomainSchema = z.enum([
  'technical',      // Unimog technical questions
  'general',        // General questions
  'off_topic',      // Non-Unimog topics
  'dangerous'       // Safety-critical requests to block
]);

export type BarryDomain = z.infer<typeof BarryDomainSchema>;

// Task classification
export const BarryTaskSchema = z.enum([
  'procedure',      // How-to procedures
  'troubleshoot',   // Diagnosing problems
  'exploded_view',  // Parts diagrams
  'parts_lookup',   // Finding part numbers
  'specifications', // Torque specs, fluid capacities
  'weather',        // Weather-related queries
  'other'           // General assistance
]);

export type BarryTask = z.infer<typeof BarryTaskSchema>;

// Citation source types
export const CitationSourceSchema = z.enum([
  'manual',         // Workshop manual
  'rps',            // RPS parts catalog
  'knowledge_base'  // Validated knowledge base
]);

export type CitationSource = z.infer<typeof CitationSourceSchema>;

// Citation schema - every response MUST include citations
export const CitationSchema = z.object({
  source: CitationSourceSchema,
  title: z.string(),
  page_number: z.number(),
  confidence: z.number().min(0).max(1),
  storage_url: z.string().optional(),
  content_preview: z.string().optional(),
  chapter_filename: z.string().optional()
});

export type Citation = z.infer<typeof CitationSchema>;

// Manual reference for frontend
export const ManualReferenceSchema = z.object({
  type: z.string(),
  title: z.string(),
  page_number: z.number(),
  original_page: z.number(),
  pdf_page: z.number(),
  storage_url: z.string(),
  chapter_filename: z.string().optional(),
  system_category: z.string().optional(),
  match_type: z.string().optional(),
  match_score: z.number().optional(),
  manual_type: z.string(),
  content_preview: z.string().optional(),
  cdn_url: z.string().optional()
});

export type ManualReference = z.infer<typeof ManualReferenceSchema>;

// RPS illustration reference
export const RPSIllustrationSchema = z.object({
  type: z.literal('rps_illustration'),
  title: z.string(),
  page_number: z.number(),
  cdn_url: z.string(),
  storage_url: z.string(),
  manual_type: z.literal('RPS'),
  group_code: z.string().optional(),
  group_name: z.string().optional()
});

export type RPSIllustration = z.infer<typeof RPSIllustrationSchema>;

// Domain guard input/output schemas
export const DomainGuardInputSchema = z.object({
  query: z.string(),
  context: z.array(z.string()).optional()
});

export const DomainGuardOutputSchema = z.object({
  is_allowed: z.boolean(),
  domain: BarryDomainSchema,
  task: BarryTaskSchema,
  reason: z.string(),
  redirect_message: z.string().optional()
});

export type DomainGuardInput = z.infer<typeof DomainGuardInputSchema>;
export type DomainGuardOutput = z.infer<typeof DomainGuardOutputSchema>;

// Safety filter schemas
export const SafetyFilterInputSchema = z.object({
  query: z.string(),
  response_content: z.string(),
  task: BarryTaskSchema
});

export const SafetyFilterOutputSchema = z.object({
  is_safe: z.boolean(),
  modified_content: z.string().optional(),
  disclaimer: z.string().optional(),
  blocked_topics: z.array(z.string()).optional()
});

export type SafetyFilterInput = z.infer<typeof SafetyFilterInputSchema>;
export type SafetyFilterOutput = z.infer<typeof SafetyFilterOutputSchema>;

// Manual search schemas
export const ManualSearchInputSchema = z.object({
  query: z.string(),
  task: BarryTaskSchema,
  max_results: z.number().default(10)
});

export const ManualSearchOutputSchema = z.object({
  found: z.boolean(),
  chunks: z.array(z.object({
    content: z.string(),
    section_title: z.string().optional(),
    page_number: z.number(),
    manual_title: z.string(),
    storage_url: z.string().optional(),
    relevance_score: z.number().optional()
  })),
  search_method: z.string()
});

export type ManualSearchInput = z.infer<typeof ManualSearchInputSchema>;
export type ManualSearchOutput = z.infer<typeof ManualSearchOutputSchema>;

// RPS search schemas
export const RPSSearchInputSchema = z.object({
  query: z.string(),
  component_name: z.string().optional()
});

export const RPSSearchOutputSchema = z.object({
  found: z.boolean(),
  group: z.object({
    group_code: z.string(),
    group_name: z.string(),
    rps_number: z.string().optional(),
    illustration_pages: z.array(z.number()),
    parts_list_pages: z.array(z.number()).optional(),
    total_parts: z.number().optional()
  }).optional(),
  parts: z.array(z.object({
    item_number: z.string(),
    description: z.string(),
    niin: z.string().optional(),
    callout: z.string().optional()
  })),
  illustrations: z.array(RPSIllustrationSchema)
});

export type RPSSearchInput = z.infer<typeof RPSSearchInputSchema>;
export type RPSSearchOutput = z.infer<typeof RPSSearchOutputSchema>;

// Knowledge base lookup schemas
export const KnowledgeLookupInputSchema = z.object({
  query: z.string()
});

export const KnowledgeLookupOutputSchema = z.object({
  found: z.boolean(),
  content: z.string().optional(),
  confidence: z.number().optional(),
  manual_references: z.array(ManualReferenceSchema).optional(),
  validated_count: z.number().optional()
});

export type KnowledgeLookupInput = z.infer<typeof KnowledgeLookupInputSchema>;
export type KnowledgeLookupOutput = z.infer<typeof KnowledgeLookupOutputSchema>;

// Response generator schemas
export const ResponseGeneratorInputSchema = z.object({
  query: z.string(),
  task: BarryTaskSchema,
  manual_context: z.string(),
  rps_context: z.string().optional(),
  conversation_history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional()
});

export const ResponseGeneratorOutputSchema = z.object({
  content: z.string(),
  citations: z.array(CitationSchema).min(1),
  knowledge_mode: z.string()
});

export type ResponseGeneratorInput = z.infer<typeof ResponseGeneratorInputSchema>;
export type ResponseGeneratorOutput = z.infer<typeof ResponseGeneratorOutputSchema>;

// Response validator schemas
export const ResponseValidatorInputSchema = z.object({
  content: z.string(),
  citations: z.array(CitationSchema),
  task: BarryTaskSchema
});

export const ResponseValidatorOutputSchema = z.object({
  is_valid: z.boolean(),
  issues: z.array(z.string()),
  modified_citations: z.array(CitationSchema).optional()
});

export type ResponseValidatorInput = z.infer<typeof ResponseValidatorInputSchema>;
export type ResponseValidatorOutput = z.infer<typeof ResponseValidatorOutputSchema>;

// Full Barry response
export const BarryResponseSchema = z.object({
  content: z.string(),
  manualReferences: z.array(ManualReferenceSchema),
  knowledgeMode: z.string(),
  searchResultCount: z.number(),
  confidence: z.number().optional(),
  source: z.string().optional(),
  cache: z.boolean().optional(),
  degraded: z.boolean().optional(),
  disclaimer: z.string().optional(),
  skill_chain: z.array(z.string()).optional(),
  execution_time_ms: z.number().optional()
});

export type BarryResponse = z.infer<typeof BarryResponseSchema>;

// Skill execution context
export interface SkillExecutionContext {
  supabaseAdmin: any;
  userId: string;
  sessionId: string;
  startTime: number;
  executedSkills: string[];
}

// Skill result wrapper
export interface SkillResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  executionTimeMs: number;
  skillName: string;
}

// Barry chat request
export interface BarryChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  location?: { latitude: number; longitude: number };
  userId?: string;
  vehicleId?: string;
}
