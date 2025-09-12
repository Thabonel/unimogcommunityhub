import { z } from 'zod';

// Search procedures validation
export const SearchProceduresSchema = z.object({
  model_code: z.string().optional(),
  series: z.string().optional(),
  term: z.string().min(1, 'Search term is required'),
  since_year: z.number().int().min(1900).max(2100).optional(),
  until_year: z.number().int().min(1900).max(2100).optional(),
  limit: z.number().int().min(1).max(500).default(50),
  offset: z.number().int().min(0).default(0)
});

// Get procedure validation
export const GetProcedureSchema = z.object({
  id_or_code: z.string().min(1, 'Procedure ID or code is required')
});

// Get assets validation
export const GetAssetsSchema = z.object({
  procedure_id: z.string().min(1, 'Procedure ID is required'),
  types: z.array(z.enum(['diagram', 'photo', 'schematic', 'table', 'chart']))
    .default(['diagram', 'photo', 'schematic', 'table', 'chart']),
  limit: z.number().int().min(1).max(500).default(50),
  offset: z.number().int().min(0).default(0)
});

// Get parts validation
export const GetPartsSchema = z.object({
  procedure_id: z.string().optional(),
  group_code: z.string().optional(),
  model_code: z.string().optional(),
  limit: z.number().int().min(1).max(500).default(50),
  offset: z.number().int().min(0).default(0)
}).refine(
  (data) => data.procedure_id || data.group_code || data.model_code,
  {
    message: "At least one of procedure_id, group_code, or model_code must be provided"
  }
);

// Run named query validation
export const RunNamedQuerySchema = z.object({
  name: z.string().min(1, 'Query name is required').regex(/^[a-zA-Z0-9_-]+$/, 'Query name must be alphanumeric with hyphens/underscores only'),
  params_json: z.record(z.unknown()).default({})
});

// Response schemas
export const ProcedureResponseSchema = z.object({
  id: z.string(),
  procedure_code: z.string(),
  title: z.string(),
  model_code: z.string().optional(),
  series: z.string().optional(),
  revision_date: z.string().optional(),
  rank: z.number().optional()
});

export const AssetResponseSchema = z.object({
  type: z.enum(['diagram', 'photo', 'schematic', 'table', 'chart']),
  url: z.string().optional(),
  path: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional()
});

export const PartResponseSchema = z.object({
  part_no: z.string(),
  name: z.string(),
  qty: z.number().optional(),
  notes: z.string().optional(),
  exploded_view_refs: z.array(z.string()).optional()
});

export type SearchProceduresInput = z.infer<typeof SearchProceduresSchema>;
export type GetProcedureInput = z.infer<typeof GetProcedureSchema>;
export type GetAssetsInput = z.infer<typeof GetAssetsSchema>;
export type GetPartsInput = z.infer<typeof GetPartsSchema>;
export type RunNamedQueryInput = z.infer<typeof RunNamedQuerySchema>;