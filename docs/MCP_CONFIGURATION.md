# MCP (Model Context Protocol) Configuration Guide

## Overview
This document describes the MCP server setup for the UnimogCommunityHub project. MCP provides Claude Desktop with direct access to external systems including databases, APIs, and file systems.

## Current MCP Configuration

### Configuration File Location
```
/Users/thabonel/Library/Application Support/Claude/claude_desktop_config.json
```

## Installed MCP Servers

### 🗄️ **Supabase MCP Server**
Direct integration with Supabase backend services.

```json
"supabase": {
  "command": "node",
  "args": [
    "/Users/thabonel/.nvm/versions/node/v20.19.3/lib/node_modules/@supabase/mcp-server-supabase/dist/index.js"
  ],
  "env": {
    "SUPABASE_URL": "https://ydevatqwkoccxhtejdor.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "[SERVICE_ROLE_KEY]"
  }
}
```

**Capabilities:**
- ✅ Direct database table access
- ✅ Function execution (RPC calls)
- ✅ Storage bucket operations
- ✅ Bypasses Row Level Security (RLS) with service role key

**Usage for WIS System:**
- Query WIS tables directly
- Execute search functions
- Manage WIS data without frontend limitations

### 🐘 **PostgreSQL Direct Connections**
Multiple direct database connections for different use cases.

#### Primary Unimog Database
```json
"postgres-unimog": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": {
    "DATABASE_URL": "postgresql://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres"
  }
}
```

#### Pooler Connection (Production)
```json
"postgres-newwheelsandwins": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": {
    "DATABASE_URL": "postgresql://postgres.ydevatqwkoccxhtejdor:Thabomeanshappiness@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true"
  }
}
```

#### Alternative Database Connection
```json
"postgres-other": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": {
    "DATABASE_URL": "postgresql://postgres:Thabomeanshappiness@kycoklimpzkyrecbjecn.supabase.co:5432/postgres"
  }
}
```

### 📁 **Filesystem Access**
Local file system access for documentation and project files.

```json
"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/Users/thabonel/Documents",
    "/Users/thabonel/Downloads"
  ]
}
```

**Accessible Paths:**
- `/Users/thabonel/Documents` - Project backups and documentation
- `/Users/thabonel/Downloads` - Downloaded resources

### 🌐 **Web Automation Tools**

#### Puppeteer Server
```json
"puppeteer": {
  "command": "node",
  "args": [
    "/Users/thabonel/.nvm/versions/node/v20.19.3/lib/node_modules/puppeteer-mcp-server/dist/index.js"
  ],
  "env": {}
}
```

#### Playwright Server
```json
"playwright": {
  "command": "npx",
  "args": ["-y", "mcp-server-playwright"]
}
```

### 🔗 **Additional MCP Services**

#### HTTP Fetch
```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

#### Memory Management
```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```

#### Sequential Thinking
```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

#### GitHub Integration
```json
"github": {
  "command": "npx",
  "args": ["-y", "mcp-remote", "github"],
  "env": {
    "npm_config_yes": "true"
  }
}
```

## MCP Usage for WIS System

### Database Operations
The MCP servers provide direct access to your WIS database, allowing:

1. **Direct Table Queries**
   ```sql
   SELECT * FROM wis_models WHERE model_code = 'U435';
   ```

2. **Function Execution**
   ```sql
   SELECT * FROM unified_wis_search('oil change', NULL, 10);
   ```

3. **Data Manipulation**
   ```sql
   INSERT INTO wis_procedures (...) VALUES (...);
   ```

### Troubleshooting Database Issues
When frontend search fails, MCP allows direct verification:
- Check if tables exist and contain data
- Test search functions directly
- Deploy missing functions
- Verify data integrity

### Security Considerations

#### ⚠️ Service Role Key
The Supabase MCP server uses the service role key which:
- **Bypasses all Row Level Security (RLS) policies**
- **Has full admin privileges**
- **Should never be exposed in client-side code**
- **Is safe to use in Claude Desktop's local environment**

#### Connection Security
- All connections use SSL/TLS encryption
- Database credentials are stored in local configuration only
- MCP servers run locally and don't expose credentials externally

## Installation History

### Package Installation Commands
```bash
# Supabase MCP Server
npm install -g @supabase/mcp-server-supabase

# PostgreSQL MCP Server  
npm install -g @modelcontextprotocol/server-postgres

# Other MCP servers are installed via npx (no global installation needed)
```

### Node.js Version
- **Current**: Node.js v20.19.3 (via NVM)
- **Path**: `/Users/thabonel/.nvm/versions/node/v20.19.3/`

## Verification Commands

### Test MCP Connection
```bash
# Check if Claude can access Supabase
# (This is done through Claude Desktop interface)
```

### Verify Database Tables
Through MCP, Claude can verify:
- `wis_models` - Unimog model definitions
- `wis_procedures` - Workshop procedures
- `wis_parts` - Parts catalog
- `wis_bulletins` - Technical bulletins

### Test Search Functions
- `unified_wis_search(search_query, model_id, search_limit)`
- `wis_suggest_titles(search_query, model_filter, limit_rows)`

## Benefits of MCP Setup

### For Development
1. **Direct Database Access**: Query and modify data without frontend limitations
2. **Function Testing**: Test database functions directly
3. **Migration Deployment**: Deploy SQL changes immediately
4. **Debugging**: Investigate issues at the database level

### For WIS System
1. **Search Function Verification**: Test search capabilities directly
2. **Data Validation**: Verify WIS data integrity
3. **Performance Testing**: Measure query performance
4. **Schema Management**: Deploy database schema changes

### For Project Management
1. **File Access**: Read project documentation and configs
2. **Backup Management**: Access project backups in Documents folder
3. **Code Analysis**: Analyze code across different project versions

## Maintenance

### Regular Tasks
- Monitor MCP server logs in Claude Desktop
- Update MCP packages when new versions are available
- Verify database connections remain active
- Review and rotate credentials periodically

### Configuration Backup
The MCP configuration is backed up in:
- `/Users/thabonel/Library/Application Support/Claude/claude_desktop_config.json.backup`
- Additional backups in project documentation

### Troubleshooting
If MCP servers fail to start:
1. Check Node.js version compatibility
2. Verify database credentials
3. Check network connectivity to Supabase
4. Review Claude Desktop logs
5. Restart Claude Desktop application

## Related Documentation
- [SUPABASE_DIRECT_ACCESS.md](./SUPABASE_DIRECT_ACCESS.md) - Database access guide
- [WIS-EPC-SUPABASE-ARCHITECTURE.md](./WIS-EPC-SUPABASE-ARCHITECTURE.md) - WIS system architecture

---
*Last Updated: September 11, 2025*
*Configuration Status: Active and Verified*