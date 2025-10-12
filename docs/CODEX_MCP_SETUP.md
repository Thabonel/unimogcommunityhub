# Supabase MCP Server Setup for Codex

**Purpose**: Enable Codex to have direct database access via Supabase MCP server (same capabilities Claude Code has)

---

## 🎉 Auto-Configuration Detected!

**Good News**: Codex auto-generated `.codex/config.toml` with Supabase MCP connection!

**Current Config**:
```toml
experimental_use_rmcp_client = true

[mcp_servers.supabase]
url = "https://mcp.supabase.com/mcp?project_ref=ydevatqwkoccxhtejdor&read_only=true"
```

**Issue**: Current config is **read-only** - won't work for WIS ETL (needs write access).

**Solution**: See "Enabling Write Access" section below.

---

## 🔧 Enabling Write Access (Required for WIS ETL)

### Option 1: Modify .codex/config.toml (Recommended)

Edit `.codex/config.toml` to remove `read_only=true`:

```toml
experimental_use_rmcp_client = true

[mcp_servers.supabase]
url = "https://mcp.supabase.com/mcp?project_ref=ydevatqwkoccxhtejdor"
# Removed: &read_only=true
```

**OR** add service role key for full access:

```toml
experimental_use_rmcp_client = true

[mcp_servers.supabase]
url = "https://mcp.supabase.com/mcp?project_ref=ydevatqwkoccxhtejdor&service_role_key=YOUR_SERVICE_ROLE_KEY"
```

After editing:
1. Save the file
2. Restart Codex
3. Test write access: Try creating a test row

### Option 2: Claude Desktop Config (Alternative)

If `.codex/config.toml` doesn't work, use traditional Claude Desktop config (see below).

---

## 🔑 What You'll Need

### 1. Supabase Project Details
- **Project URL**: `https://ydevatqwkoccxhtejdor.supabase.co`
- **Project ID**: `ydevatqwkoccxhtejdor`
- **Service Role Key**: ⚠️ **NOT IN CODEBASE** (ask Thabo for this)

### 2. MCP Server Package
The Supabase MCP server is typically installed via:
```bash
npm install @modelcontextprotocol/server-supabase
```

Or it may be pre-configured in Claude Desktop/Codex.

---

## 📝 Configuration File

### Location
**macOS**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux**:
```
~/.config/Claude/claude_desktop_config.json
```

### Configuration Format

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "https://ydevatqwkoccxhtejdor.supabase.co",
        "SERVICE_ROLE_KEY_HERE"
      ]
    }
  }
}
```

**Replace `SERVICE_ROLE_KEY_HERE`** with actual service role key from Thabo.

---

## 🔐 Getting the Service Role Key

The service role key is **NOT stored in the codebase** for security reasons.

### Option 1: Ask Thabo
Thabo has the service role key. Ask him to share it securely (not via git/slack).

### Option 2: Retrieve from Supabase Dashboard
If you have access to the Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
2. Navigate to: **Settings** → **API**
3. Find section: **Project API keys**
4. Copy: **service_role** key (NOT the anon key)
5. ⚠️ **Warning**: This key bypasses Row Level Security (RLS) - never commit it!

---

## ✅ Verification Steps

After configuring the MCP server:

### 1. Restart Codex
Close and reopen Codex/Claude Desktop to load the new configuration.

### 2. Test MCP Connection
Ask Codex to run a simple query:

```sql
SELECT count(*) FROM auth.users;
```

If MCP is configured correctly, Codex should be able to execute this query directly.

### 3. Test MCP Tools
Try listing tables:
```
List all tables in the public schema
```

Codex should use the `mcp__supabase__list_tables` tool.

---

## 🎯 What MCP Enables

With Supabase MCP configured, Codex can:

1. **Read any table** (bypasses RLS with service role)
2. **Execute SQL directly** via `mcp__supabase__execute_sql`
3. **Apply migrations** via `mcp__supabase__apply_migration`
4. **List tables/extensions** via `mcp__supabase__list_tables`
5. **Manage storage** (though direct Storage API is preferred)
6. **Debug database issues** without manual SQL queries

### Example Use Cases
- Check WIS ETL job status: `SELECT * FROM wis_ingest_jobs ORDER BY created_at DESC LIMIT 5;`
- Verify migration applied: `SELECT * FROM wis_procedures LIMIT 1;`
- Count users by type: See `docs/memory/common-commands.md`
- Debug RLS issues: Service role bypasses RLS for testing

---

## 🚨 Security Warnings

### NEVER commit the service role key
- ❌ Don't put it in `.env` files
- ❌ Don't put it in code
- ❌ Don't commit config file to git
- ✅ Keep it in local `claude_desktop_config.json` only

### Service Role Key Capabilities
The service role key:
- ✅ Bypasses all Row Level Security (RLS) policies
- ✅ Can read/write any table
- ✅ Can create/drop tables
- ✅ Can delete data
- ✅ Can access all storage buckets
- ⚠️ Essentially has superuser access

**Use responsibly**: Only for development/debugging, not for production app code.

---

## 🔧 Troubleshooting

### MCP Server Not Loading
**Symptoms**: Codex can't access database, no `mcp__supabase__*` tools available

**Solutions**:
1. Check config file syntax (valid JSON)
2. Verify file path: `~/Library/Application Support/Claude/claude_desktop_config.json`
3. Restart Codex completely
4. Check logs: `~/Library/Logs/Claude/mcp.log` (macOS)

### "Invalid API Key" Errors
**Symptoms**: MCP tools return authentication errors

**Solutions**:
1. Verify you're using **service_role** key (not anon key)
2. Check key hasn't been rotated in Supabase dashboard
3. Ensure no extra whitespace in key string
4. Try regenerating service role key in dashboard

### "Permission Denied" Errors
**Symptoms**: Can read but not write to certain tables

**Solutions**:
1. Service role should bypass RLS - check you're using correct key
2. Some operations may require specific database permissions
3. Check if table/schema exists: `SELECT * FROM information_schema.tables WHERE table_name = 'your_table';`

---

## 📋 Quick Reference

### Common MCP Tools Available

```typescript
// List tables
mcp__supabase__list_tables({ schemas: ["public"] })

// Execute SQL
mcp__supabase__execute_sql({ query: "SELECT * FROM users LIMIT 5;" })

// Apply migration
mcp__supabase__apply_migration({
  name: "add_new_column",
  query: "ALTER TABLE..."
})

// Get logs
mcp__supabase__get_logs({ service: "postgres" })

// Get advisors (security/performance)
mcp__supabase__get_advisors({ type: "security" })

// Generate TypeScript types
mcp__supabase__generate_typescript_types({})
```

### Useful Queries for WIS ETL

```sql
-- Check ETL job status
SELECT * FROM wis_ingest_jobs
ORDER BY created_at DESC
LIMIT 10;

-- Check for errors
SELECT * FROM wis_ingest_errors
ORDER BY created_at DESC
LIMIT 20;

-- Verify procedures uploaded
SELECT count(*), model_code
FROM wis_procedures
GROUP BY model_code;

-- Check storage bucket contents
SELECT name, metadata
FROM storage.objects
WHERE bucket_id = 'wis-docs'
LIMIT 10;
```

---

## 🎓 Learning Resources

### Official Documentation
- **Supabase MCP**: https://github.com/modelcontextprotocol/servers/tree/main/src/supabase
- **MCP Specification**: https://modelcontextprotocol.io/
- **Claude Desktop Config**: https://docs.anthropic.com/claude/docs/desktop-mcp

### Project-Specific Docs
- **Database Schema**: `/docs/memory/database-schema.md`
- **Common Commands**: `/docs/memory/common-commands.md`
- **WIS ETL Status**: `/docs/wis-project/WIS_ETL_IMPLEMENTATION_STATUS.md`

---

## ✅ Setup Checklist

Before continuing with WIS ETL work:

- [ ] Get service role key from Thabo
- [ ] Add MCP configuration to `claude_desktop_config.json`
- [ ] Restart Codex/Claude Desktop
- [ ] Test MCP connection with simple query
- [ ] Verify can list tables in public schema
- [ ] Verify can execute SELECT queries
- [ ] Test migration capability (optional, be careful!)

Once complete, Codex will have same database access as Claude Code had.

---

## 📞 Questions?

If you encounter issues:
1. Check this document's troubleshooting section
2. Verify service role key is correct
3. Check Codex/Claude Desktop logs
4. Ask Thabo for help (he configured this for Claude Code)

---

**Document Version**: 1.0
**Created**: October 12, 2025
**Purpose**: Enable Codex to continue WIS ETL work with database access
