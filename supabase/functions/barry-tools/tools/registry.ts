import { RegisteredTool, AnthropicToolDefinition } from './types.ts';
import { searchManualTool } from './search-manual.ts';
import { lookupKnowledgeBaseTool } from './lookup-knowledge-base.ts';
import { lookupUserVehicleTool, searchMarketplaceTool, getEventsTool } from './platform-tools.ts';
import { getWeatherTool } from './get-weather.ts';
import { webSearchTool } from './web-search.ts';
import { convertUnitsTool } from './convert-units.ts';
import { translateTextTool } from './translate-text.ts';

export const ALL_TOOLS: RegisteredTool[] = [
  lookupKnowledgeBaseTool,
  searchManualTool,
  lookupUserVehicleTool,
  getWeatherTool,
  webSearchTool,
  searchMarketplaceTool,
  getEventsTool,
  convertUnitsTool,
  translateTextTool,
];

export function getToolDefinitions(): AnthropicToolDefinition[] {
  return ALL_TOOLS.map(t => t.definition);
}

export function getToolByName(name: string): RegisteredTool | undefined {
  return ALL_TOOLS.find(t => t.definition.name === name);
}
