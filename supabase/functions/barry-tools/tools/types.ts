export type ToolErrorCode =
  | 'TIMEOUT'
  | 'NOT_FOUND'
  | 'UPSTREAM_ERROR'
  | 'RATE_LIMITED'
  | 'INVALID_INPUT'
  | 'UNKNOWN';

export interface ToolResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: {
    code: ToolErrorCode;
    message: string;
    retriable: boolean;
  };
  metadata: {
    latency_ms: number;
    source: string;
    timestamp: string;
  };
}

export type ToolFallback = 'none' | 'cached' | 'degrade';

export interface ToolConfig {
  timeout_ms: number;
  retries: number;
  fallback: ToolFallback;
}

// Anthropic tool definition shape
export interface AnthropicToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

// A registered tool
export interface RegisteredTool {
  definition: AnthropicToolDefinition;
  config: ToolConfig;
  phase: 1 | 2 | 3;
  execute: (input: Record<string, unknown>, ctx: ToolExecutionContext) => Promise<ToolResult>;
}

export interface ToolExecutionContext {
  supabaseUrl: string;
  supabaseServiceKey: string;
  anthropicKey: string;
  braveApiKey?: string;
  mapboxToken?: string;
  userId?: string;
  userLocation?: { latitude: number; longitude: number };
}

// Per-class call budgets enforced by the runtime
export const TOOL_CLASS_BUDGETS: Record<string, number> = {
  technical: 3,   // search_manual, search_rps, lookup_knowledge_base combined
  external: 2,    // get_weather, web_search, lookup_fuel_prices, find_nearby_services
  platform: 2,    // lookup_user_vehicle, search_marketplace, get_events, search_community_content
  utility: 5,     // convert_units, calculate_route, translate_text
};

export type ToolClass = keyof typeof TOOL_CLASS_BUDGETS;
