#!/usr/bin/env node

import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { 
  WISProcedure, 
  ProcedureDetail, 
  AssetReference, 
  WISPart,
  QueryResult 
} from './types.js';
import {
  SearchProceduresSchema,
  GetProcedureSchema,
  GetAssetsSchema,
  GetPartsSchema,
  RunNamedQuerySchema
} from './validation.js';
import { TokenBucketRateLimiter } from './rate-limiter.js';
import { 
  supabaseClient, 
  serviceClient,
  executeQuery, 
  signStorageUrl, 
  validateEnvironment 
} from './supabase.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const rateLimiter = new TokenBucketRateLimiter();

class UnimogWISMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: 'unimog-wis-server',
      version: '1.0.0'
    });

    this.setupTools();
  }

  private setupTools() {
    // Search procedures tool
    this.server.registerTool(
      'search_procedures',
      {
        title: 'Search WIS Procedures',
        description: 'Search WIS procedures with full-text search and filtering',
        inputSchema: {
          term: z.string().min(1).describe('Search term for title/keywords/content'),
          model_code: z.string().optional().describe('Unimog model code filter'),
          series: z.string().optional().describe('Model series filter'),
          since_year: z.number().int().min(1900).max(2100).optional().describe('Filter procedures from year'),
          until_year: z.number().int().min(1900).max(2100).optional().describe('Filter procedures until year'),
          limit: z.number().int().min(1).max(500).default(50).describe('Results limit'),
          offset: z.number().int().min(0).default(0).describe('Results offset')
        }
      },
      async ({ term, model_code, series, since_year, until_year, limit, offset }) => {
        try {
          let query = supabaseClient
            .from('manual_chunks')
            .select('id, title, metadata, created_at')
            .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
            .order('created_at', { ascending: false });

          if (model_code) query = query.eq('metadata->>model_code', model_code);
          if (series) query = query.eq('metadata->>series', series);

          const { data, error } = await query
            .limit(limit || 50)
            .range(offset || 0, (offset || 0) + (limit || 50) - 1);

          if (error) throw error;

          const procedures: WISProcedure[] = (data || []).map(row => ({
            id: row.id,
            procedure_code: row.id,
            title: row.title,
            model_code: row.metadata?.model_code || '',
            series: row.metadata?.series || ''
          }));

          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                success: true,
                procedures,
                total: procedures.length,
                query_info: { term, model_code, series, limit, offset }
              }, null, 2)
            }]
          };
        } catch (error) {
          logger.error(`Search procedures failed: ${error instanceof Error ? error.message : String(error)}`);
          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: 'Search procedures failed'
              }, null, 2)
            }]
          };
        }
      }
    );

    // Get procedure tool
    this.server.registerTool(
      'get_procedure',
      {
        title: 'Get Procedure Details',
        description: 'Get detailed procedure information including steps, cautions, and tools',
        inputSchema: {
          id_or_code: z.string().min(1).describe('Procedure ID or procedure code')
        }
      },
      async ({ id_or_code }) => {
        try {
          const { data, error } = await supabaseClient
            .from('manual_chunks')
            .select('*')
            .eq('id', id_or_code)
            .single();

          if (error) throw error;

          const procedure: ProcedureDetail = {
            metadata: {
              id: data.id,
              procedure_code: data.id,
              title: data.title,
              model_code: data.metadata?.model_code || '',
              series: data.metadata?.series || '',
              revision_date: data.created_at,
              description: data.content
            },
            steps: [],
            cautions: [],
            required_tools: [],
            linked_assets: [],
            related_parts: []
          };

          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                success: true,
                procedure
              }, null, 2)
            }]
          };
        } catch (error) {
          logger.error(`Get procedure failed: ${error instanceof Error ? error.message : String(error)}`);
          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: 'Get procedure failed'
              }, null, 2)
            }]
          };
        }
      }
    );

    // Get assets tool
    this.server.registerTool(
      'get_assets',
      {
        title: 'Get Procedure Assets',
        description: 'Retrieve assets (diagrams, photos, schematics) for a procedure',
        inputSchema: {
          procedure_id: z.string().min(1).describe('Procedure ID'),
          types: z.array(z.enum(['diagram', 'photo', 'schematic', 'table', 'chart']))
            .default(['diagram', 'photo', 'schematic', 'table', 'chart'])
            .describe('Asset types to retrieve'),
          limit: z.number().int().min(1).max(500).default(50).describe('Results limit'),
          offset: z.number().int().min(0).default(0).describe('Results offset')
        }
      },
      async ({ procedure_id, types, limit, offset }) => {
        // Mock implementation - you would implement actual asset retrieval
        const assets: AssetReference[] = [];

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              assets,
              procedure_id,
              total: assets.length
            }, null, 2)
          }]
        };
      }
    );

    // Get parts tool
    this.server.registerTool(
      'get_parts',
      {
        title: 'Get Parts Information',
        description: 'Get parts information by procedure, group, or model',
        inputSchema: {
          procedure_id: z.string().optional().describe('Procedure ID'),
          group_code: z.string().optional().describe('Parts group code'),
          model_code: z.string().optional().describe('Model code filter'),
          limit: z.number().int().min(1).max(500).default(50).describe('Results limit'),
          offset: z.number().int().min(0).default(0).describe('Results offset')
        }
      },
      async ({ procedure_id, group_code, model_code, limit, offset }) => {
        // Validation: at least one parameter required
        if (!procedure_id && !group_code && !model_code) {
          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: 'At least one of procedure_id, group_code, or model_code must be provided'
              }, null, 2)
            }]
          };
        }

        // Mock implementation - you would implement actual parts retrieval
        const parts: WISPart[] = [];

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              parts,
              total: parts.length
            }, null, 2)
          }]
        };
      }
    );

    // Run named query tool
    this.server.registerTool(
      'run_named_query',
      {
        title: 'Run Named Query',
        description: 'Execute pre-defined SELECT-only SQL queries',
        inputSchema: {
          name: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/).describe('Query name (alphanumeric with hyphens/underscores)'),
          params_json: z.record(z.unknown()).default({}).describe('Query parameters as object')
        }
      },
      async ({ name, params_json }) => {
        try {
          const queryPath = path.join(__dirname, '../queries', `${name}.sql`);
          
          if (!fs.existsSync(queryPath)) {
            throw new Error(`Query '${name}' not found`);
          }

          let sqlQuery = fs.readFileSync(queryPath, 'utf-8');
          
          // Simple parameter substitution
          if (params_json) {
            for (const [key, value] of Object.entries(params_json)) {
              sqlQuery = sqlQuery.replaceAll(`:${key}`, String(value));
            }
          }

          if (!serviceClient) {
            throw new Error('Service client not available');
          }

          const { data, error } = await serviceClient.rpc('execute_sql', {
            query: sqlQuery
          });

          if (error) throw error;

          const result: QueryResult = {
            rows: data || [],
            count: (data || []).length
          };

          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                success: true,
                result,
                query_name: name
              }, null, 2)
            }]
          };
        } catch (error) {
          logger.error(`Named query execution failed: ${error instanceof Error ? error.message : String(error)}`);
          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                success: false,
                error: 'Named query execution failed',
                details: error instanceof Error ? error.message : String(error)
              }, null, 2)
            }]
          };
        }
      }
    );
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('MCP server started on stdio transport');
  }
}

// HTTP server for health checks and asset signing
function createHttpServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: 'unimog-wis-mcp-server',
      version: '1.0.0'
    });
  });

  // Asset signing endpoint
  app.post('/sign', async (req, res) => {
    try {
      const bucket = req.query.bucket as string;
      const filePath = req.query.path as string;

      if (!bucket || !filePath) {
        return res.status(400).json({ error: 'Missing bucket or path parameters' });
      }

      const signedUrl = await signStorageUrl(bucket, filePath);
      res.json({ signedUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to sign URL' });
    }
  });

  return app;
}

// Main execution
async function main() {
  try {
    validateEnvironment();

    const mcpServer = new UnimogWISMCPServer();
    
    const transport = process.env.MCP_TRANSPORT || 'stdio';
    
    if (transport === 'http') {
      const httpServer = createHttpServer();
      const port = parseInt(process.env.PORT || '3000');
      
      httpServer.listen(port, () => {
        logger.info(`HTTP server listening on port ${port}`);
      });
    } else {
      await mcpServer.start();
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default UnimogWISMCPServer;