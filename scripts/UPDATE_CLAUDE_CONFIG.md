# How to Update Claude Desktop Configuration for IPv4 Database Access

## Steps to Update:

### 1. Get Your Database Password
First, get your Supabase database password from:
- Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/database
- Find "Database Password" section
- Copy your password

### 2. Update the Configuration File
The configuration file is located at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### 3. Replace the postgres Section
In the configuration file, replace the `postgres` section with:

```json
"postgres": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-postgres",
    "postgresql://postgres:YOUR_DATABASE_PASSWORD@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres"
  ]
}
```

**Important changes:**
- Use `db.ydevatqwkoccxhtejdor.supabase.co` (not the pooler URL)
- This uses IPv4 direct connection
- Replace `YOUR_DATABASE_PASSWORD` with your actual password

### 4. Full Configuration Example
A complete working configuration is saved in:
```
/Users/thabonel/Documents/unimogcommunityhub/scripts/claude-desktop-config.json
```

### 5. Restart Claude Desktop
After updating the configuration:
1. Quit Claude Desktop completely (Cmd+Q)
2. Restart Claude Desktop
3. The MCP servers will reconnect with the new configuration

## Testing the Connection

Once updated, I should be able to run direct database queries like:
```sql
SELECT COUNT(*) FROM wis_procedures WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';
```

## Benefits of IPv4 Connection:
- ✅ Direct database queries from Claude
- ✅ No need to copy/paste SQL to Supabase Dashboard
- ✅ Faster database operations
- ✅ Can perform admin operations directly
- ✅ Bypasses RLS restrictions when needed

## Security Note:
- Keep your database password secure
- Never commit the config file to Git
- The password in the config gives full database access

## Alternative Connection Strings:
If the direct connection doesn't work, try:
```
# Option 1: Direct connection (IPv4)
postgresql://postgres:PASSWORD@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres

# Option 2: Pooler connection (might work)
postgresql://postgres.ydevatqwkoccxhtejdor:PASSWORD@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# Option 3: With SSL
postgresql://postgres:PASSWORD@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres?sslmode=require
```