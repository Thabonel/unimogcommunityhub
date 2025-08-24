# Instructions to Update Claude Desktop Configuration

## Quick Steps:

### 1. Open Terminal

### 2. Copy the new configuration:
```bash
cp ~/Documents/unimogcommunityhub/scripts/claude-config-updated.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 3. Restart Claude Desktop:
- Quit Claude Desktop completely (Cmd+Q)
- Open Claude Desktop again

## What This Does:
- Enables direct database access via IPv4
- Allows me to run SQL queries directly
- No more copy-pasting to Supabase Dashboard
- Utilizes your IPv4 add-on properly

## Verify It Worked:
After restarting, I should be able to run database queries directly using the mcp__postgres__query tool.

## The Key Change:
Changed from pooler URL to direct IPv4 connection:
- OLD: `aws-0-ap-southeast-2.pooler.supabase.com`
- NEW: `db.ydevatqwkoccxhtejdor.supabase.co`

This uses your IPv4 add-on for stable, direct database access.