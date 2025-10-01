# 🧠 Claude Code Memory System

## Overview

The UnimogCommunityHub project uses a hierarchical memory system that automatically loads context when you start a Claude Code session. This ensures Claude has instant access to project-specific knowledge without needing to re-explain everything.

## How It Works

### 1. Main Memory File: `CLAUDE.md`
This is the primary project memory file that Claude Code automatically reads. It contains:
- High-level project overview
- Architecture diagrams
- Critical configurations
- Git workflow
- Development guidelines

### 2. Topic-Specific Memory Files: `/docs/memory/`
These focused files are automatically imported by `CLAUDE.md`:

- **`user-types.md`**: Subscription types, user management, admin operations
- **common-commands.md`**: Frequently used commands, SQL queries, troubleshooting
- **`database-schema.md`**: Table structures, RLS policies, common queries

Claude Code automatically loads all these files at the start of each session thanks to the `@` import syntax in `CLAUDE.md`:

```markdown
- **User Types & Subscriptions**: @docs/memory/user-types.md
- **Common Commands & Operations**: @docs/memory/common-commands.md
- **Database Schema & Queries**: @docs/memory/database-schema.md
```

### 3. Personal Notes: `CLAUDE.local.md`
This file is for **your personal shortcuts and notes only**:
- Gitignored (never committed to repository)
- Contains your frequently used queries, URLs, shortcuts
- Session-specific temporary notes
- Private reminders and quick fixes

## Usage Examples

### Example 1: Claude Knows User Types Automatically
**You ask**: "Can you show me which users have free premium access?"

**Claude responds**: Already knowing the 3 user types (from `user-types.md`), Claude immediately queries the database with the correct fields:
```sql
SELECT u.email, us.subscription_type, us.is_free_access, us.current_period_end
FROM auth.users u
JOIN user_subscriptions us ON u.id = us.user_id
WHERE us.is_free_access = true;
```

### Example 2: Common Commands Are Instantly Available
**You ask**: "How do I check for hardcoded secrets?"

**Claude responds**: Already knows from `common-commands.md`:
```bash
node scripts/check-secrets.js
grep -r "ydevatqwkoccxhtejdor.supabase.co" src/ scripts/
```

### Example 3: Database Schema Reference
**You ask**: "What columns are in user_subscriptions?"

**Claude responds**: Instantly references `database-schema.md` without needing to query the database.

## Adding New Memory Topics

### Step 1: Create a New Topic File
```bash
# Create file in docs/memory/
touch docs/memory/new-topic.md
```

### Step 2: Add Content
```markdown
# New Topic Name

## Section 1
Content here...

## Section 2
More content...
```

### Step 3: Import in CLAUDE.md
Edit `CLAUDE.md` and add to the Quick Reference section:
```markdown
## 📚 Quick Reference Topics
**Claude Code will automatically load these detailed references when starting a session:**

- **User Types & Subscriptions**: @docs/memory/user-types.md
- **Common Commands & Operations**: @docs/memory/common-commands.md
- **Database Schema & Queries**: @docs/memory/database-schema.md
- **New Topic**: @docs/memory/new-topic.md  ← Add this line
```

### Step 4: Commit and Push
```bash
git add docs/memory/new-topic.md CLAUDE.md
git commit -m "docs: Add new-topic memory reference"
git push staging main:main
```

## Maintaining Memory Files

### When to Update

**Update immediately when:**
- Adding new database tables or columns
- Changing user type logic or subscription handling
- Adding new admin features or operations
- Discovering common troubleshooting patterns
- Finding frequently used queries

**Examples:**
- New table added → Update `database-schema.md`
- New subscription tier → Update `user-types.md`
- New deployment command → Update `common-commands.md`

### Best Practices

1. **Keep it Concise**: Memory files should be quick reference, not full documentation
2. **Use Examples**: Show actual SQL queries, bash commands, code snippets
3. **Update Often**: Keep information current as project evolves
4. **Remove Outdated Info**: Delete obsolete information to avoid confusion
5. **Use Clear Headers**: Make information easy to scan and find

## File Organization

```
unimogcommunityhub/
├── CLAUDE.md                    # Main memory file (committed)
├── CLAUDE.local.md              # Personal notes (gitignored)
└── docs/
    ├── memory/
    │   ├── user-types.md        # User subscription reference
    │   ├── common-commands.md   # Frequently used commands
    │   └── database-schema.md   # Database structure
    └── MEMORY_SYSTEM.md         # This file
```

## Advanced Features

### Multi-Level Imports
Memory files can import other files (max 5 hops deep):

```markdown
# In common-commands.md
See @docs/scripts/deployment-guide.md for detailed deployment steps
```

### Conditional Loading
You can create branch-specific or environment-specific memory:

```markdown
# In CLAUDE.md
- **Development Setup**: @docs/memory/dev-setup.md
- **Production Notes**: @docs/memory/prod-notes.md
```

### MCP Memory Integration
The Memory Keeper MCP server provides additional session-based memory:
- Context checkpoints before major changes
- Search across past sessions
- Session-specific context tracking

Access via MCP tools:
- `mcp__memory-keeper__context_session_start`
- `mcp__memory-keeper__context_checkpoint`
- `mcp__memory-keeper__context_search`

## Benefits of This System

1. **Instant Context**: Claude knows project specifics immediately
2. **No Repetition**: Never re-explain subscription types, database schema, etc.
3. **Easy Maintenance**: Update topic files independently
4. **Version Controlled**: Memory evolves with codebase
5. **Personal Customization**: CLAUDE.local.md for your specific needs
6. **Scalable**: Add new topics as project grows

## Tips for Effective Use

### For You (The Developer)
- Update CLAUDE.local.md with frequently used personal shortcuts
- Add session notes while working, clean up when done
- Keep common SQL queries in local file for quick copy-paste

### For Claude Code Sessions
- Reference memory files when answering: "As noted in common-commands.md..."
- Suggest updates when discovering new patterns: "Should we add this to user-types.md?"
- Use memory to avoid re-explaining: "Based on the subscription logic in memory..."

## Troubleshooting

### Memory File Not Loading
1. Check file path in CLAUDE.md import is correct
2. Ensure file exists in docs/memory/
3. Verify @ syntax: `@docs/memory/filename.md`
4. Check for typos in filename

### Outdated Information
1. Edit the specific topic file directly
2. Commit and push changes
3. Restart Claude Code session to reload

### Too Much Information
1. Split large topics into multiple files
2. Create sub-topics with focused content
3. Use clear section headers for scanning

## Next Steps

1. **Review Existing Files**: Read through current memory files to understand content
2. **Customize CLAUDE.local.md**: Add your personal shortcuts and notes
3. **Update as Needed**: Keep memory current as you make changes
4. **Expand**: Add new topic files when patterns emerge

---

**Remember**: The memory system is here to make your development faster and Claude's assistance more accurate. Update it frequently and keep it current!
