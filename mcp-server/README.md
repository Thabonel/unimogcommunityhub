# Unimog WIS MCP Server

A secure, read-only Model Context Protocol (MCP) server that exposes Unimog Workshop Information System (WIS) data from Supabase. Designed for integration with Barry AI assistant and ChatGPT's Deep Research feature.

## Features

- **🔒 Read-Only Access**: Enforced via Supabase RLS and anonymous key permissions
- **🚀 MCP Protocol**: Compatible with ChatGPT, Claude, and other MCP clients
- **📊 WIS Data**: Access to procedures, parts, diagrams, and technical documentation
- **⚡ Rate Limited**: Token bucket rate limiting to prevent abuse
- **🛡️ Secure**: No secrets in logs, optional Bearer token authentication
- **📈 Monitoring**: Health checks and logging via Pino

## MCP Tools Available

### 1. `search_procedures`
Search WIS procedures with full-text search and filtering.

**Parameters:**
- `term` (required): Search term for title/keywords/content
- `model_code` (optional): Unimog model code filter (e.g., "U1300")
- `series` (optional): Model series filter
- `since_year` (optional): Filter procedures from year
- `until_year` (optional): Filter procedures until year
- `limit` (optional): Results limit (1-500, default: 50)
- `offset` (optional): Results offset (default: 0)

**Returns:** Array of procedures with ID, title, model code, and relevance ranking.

### 2. `get_procedure`
Get detailed procedure information including steps, cautions, and tools.

**Parameters:**
- `id_or_code` (required): Procedure ID or procedure code

**Returns:** Complete procedure details with metadata, steps, cautions, tools, assets, and related parts.

### 3. `get_assets`
Retrieve assets (diagrams, photos, schematics) for a procedure.

**Parameters:**
- `procedure_id` (required): Procedure ID
- `types` (optional): Asset types array (default: all types)
- `limit` (optional): Results limit (1-500, default: 50)
- `offset` (optional): Results offset (default: 0)

**Returns:** Array of assets with URLs, captions, and dimensions.

### 4. `get_parts`
Get parts information by procedure, group, or model.

**Parameters:**
- `procedure_id` (optional): Procedure ID
- `group_code` (optional): Parts group code
- `model_code` (optional): Model code filter
- `limit` (optional): Results limit (1-500, default: 50)
- `offset` (optional): Results offset (default: 0)

*Note: At least one of procedure_id, group_code, or model_code must be provided.*

**Returns:** Array of parts with part numbers, names, quantities, and notes.

### 5. `run_named_query`
Execute pre-defined SELECT-only SQL queries.

**Parameters:**
- `name` (required): Query name (alphanumeric with hyphens/underscores)
- `params_json` (optional): Query parameters as JSON object

**Available Queries:**
- `torque_specs_by_model`: Torque specifications by model
- `procedure_tool_list`: Required tools for procedures
- `wiring_diagram_lookup`: Wiring diagrams and electrical procedures

**Returns:** Query results with row data and metadata.

## Quick Start

### Prerequisites
- Node.js 20+
- Access to Supabase instance with WIS data
- Environment variables configured

### Local Development

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd mcp-server
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Test the server:**
   ```bash
   npm run smoke
   ```

### Production Deployment

#### Using Docker
```bash
docker build -t unimog-wis-mcp .
docker run -p 3000:3000 --env-file .env unimog-wis-mcp
```

#### Using Render.com
1. Connect your repository to Render
2. Use the provided `render.yaml` blueprint
3. Set environment variables in Render dashboard
4. Deploy

## Environment Variables

### Required
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Read-only anonymous key

### Optional
- `OPTIONAL_SERVICE_ROLE`: Service role key for signing private storage URLs
- `OPTIONAL_BEARER_TOKEN`: Bearer token for MCP endpoint authentication
- `STORAGE_SIGN_TTL_SEC`: Signed URL TTL in seconds (default: 300)
- `QUERY_TIMEOUT_MS`: Query timeout in milliseconds (default: 15000)
- `LOG_LEVEL`: Logging level (default: info)
- `PORT`: HTTP server port (default: 3000)
- `MCP_TRANSPORT`: Transport mode - 'stdio' or 'http' (default: stdio)

## Security Features

### Read-Only Enforcement
- Uses Supabase anonymous key with SELECT-only permissions
- All database operations go through Supabase RLS policies
- Named queries validated to ensure SELECT-only execution

### Asset Signing
If `OPTIONAL_SERVICE_ROLE` is configured:
- Private storage assets are signed with short TTL (≤300s)
- Service role key never exposed in client logs
- Endpoint: `POST /sign?bucket=<bucket>&path=<path>`

### Rate Limiting
- Token bucket implementation (100 tokens, 10/sec refill rate)
- Per-client rate limiting based on IP/session
- 429 responses with retry-after headers

### Authentication
- Optional Bearer token for MCP endpoint access
- Health check endpoint always accessible
- No authentication required for stdio transport

## ChatGPT Integration

### Setup Instructions

1. **Access ChatGPT Deep Research**
   - Requires ChatGPT Enterprise, Education, or Team subscription
   - Navigate to Deep Research feature

2. **Add Custom Connector**
   - Choose "Add custom connector"
   - Type: "Remote MCP"
   - URL: `https://your-deployed-server.com/mcp`
   - Auth: "Bearer" (if `OPTIONAL_BEARER_TOKEN` is set), otherwise "None"

3. **Test Connection**
   ```
   search_procedures term="clutch adjustment" model_code="U1300" limit=5
   ```

4. **Example Usage**
   ```
   # Search for engine procedures
   search_procedures term="engine maintenance" model_code="U1700" limit=10
   
   # Get specific procedure details
   get_procedure id_or_code="ENG-001-U1700"
   
   # Find torque specifications
   run_named_query name="torque_specs_by_model" params_json={"model_code":"U1300"}
   ```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and rate limiter statistics.

### MCP Endpoint  
```
POST /mcp
```
Main MCP protocol endpoint for tool calls.

### Asset Signer (if enabled)
```
POST /sign?bucket=<bucket>&path=<path>
```
Generates signed URLs for private storage assets.

## Development

### Project Structure
```
mcp-server/
├── src/
│   ├── server.ts           # Main MCP server
│   ├── types.ts            # TypeScript interfaces
│   ├── validation.ts       # Input validation schemas
│   ├── rate-limiter.ts     # Rate limiting implementation
│   └── supabase.ts         # Supabase client setup
├── queries/                # Pre-defined SQL queries
├── scripts/
│   └── smoke.js           # Smoke testing script
├── Dockerfile             # Container configuration
├── render.yaml            # Render.com deployment
└── README.md              # This file
```

### Testing
```bash
# Run smoke tests
npm run smoke

# Build and test
npm run build
npm start
```

### Adding New Queries
1. Create SQL file in `queries/` directory
2. Ensure query starts with `SELECT`
3. Use `:parameter_name` for parameter substitution
4. Test with `run_named_query` tool

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check environment variables
   - Verify Supabase URL and keys
   - Check network connectivity

2. **Rate Limited**
   - Wait for rate limit reset
   - Reduce request frequency
   - Contact administrator for limit adjustments

3. **Query Timeout**
   - Increase `QUERY_TIMEOUT_MS`
   - Optimize query parameters
   - Check Supabase performance

4. **Asset Not Found**
   - Verify storage bucket exists
   - Check asset paths in database
   - Ensure service role permissions if using signer

### Logging
Server uses structured logging via Pino:
```bash
# Set log level
export LOG_LEVEL=debug

# View logs in production
docker logs <container-id>
```

## Security Considerations

- **Never expose service role key**: Keep `OPTIONAL_SERVICE_ROLE` secure
- **Use HTTPS**: Always deploy with TLS in production
- **Monitor usage**: Check health endpoint and logs regularly
- **Rotate tokens**: Regularly rotate bearer tokens and API keys
- **Network security**: Use firewall rules to restrict access
- **Backup**: Ensure Supabase data is properly backed up

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check this README and troubleshooting section
2. Review server logs for error details
3. Test with smoke test script
4. Contact system administrator

---

**MCP Server Connection Details:**

```json
{
  "mcp_server_url": "https://your-deployed-server.com/mcp",
  "auth": "none-or-bearer",
  "resources": [
    "unimog:tables/wis_procedures",
    "unimog:tables/wis_parts", 
    "unimog:tables/wis_models",
    "unimog:assets/wis-diagrams",
    "unimog:assets/wis-photos",
    "unimog:assets/wis-schematics",
    "unimog:assets/wis-tables",
    "unimog:assets/wis-charts"
  ],
  "tools": [
    "search_procedures",
    "get_procedure", 
    "get_assets",
    "get_parts",
    "run_named_query"
  ]
}
```