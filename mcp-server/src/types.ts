export interface WISProcedure {
  id: string;
  procedure_code: string;
  title: string;
  model_code?: string;
  series?: string;
  revision_date?: string;
  content?: string;
  keywords?: string[];
  rank?: number;
}

export interface ProcedureDetail {
  metadata: {
    id: string;
    procedure_code: string;
    title: string;
    model_code?: string;
    series?: string;
    revision_date?: string;
    description?: string;
  };
  steps: ProcedureStep[];
  cautions: Caution[];
  required_tools: Tool[];
  linked_assets: AssetReference[];
  related_parts: PartReference[];
}

export interface ProcedureStep {
  step_number: number;
  title: string;
  description: string;
  image_refs?: string[];
}

export interface Caution {
  type: 'warning' | 'caution' | 'note';
  title: string;
  description: string;
}

export interface Tool {
  tool_id: string;
  name: string;
  specification?: string;
  required: boolean;
}

export interface AssetReference {
  type: 'diagram' | 'photo' | 'schematic' | 'table' | 'chart';
  url?: string;
  path?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface PartReference {
  part_no: string;
  name: string;
  qty?: number;
  notes?: string;
  exploded_view_refs?: string[];
}

export interface WISPart {
  part_no: string;
  name: string;
  qty?: number;
  notes?: string;
  exploded_view_refs?: string[];
  group_code?: string;
  model_code?: string;
}

export interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number;
}

export interface QueryResult {
  rows: any[];
  count?: number;
  error?: string;
}