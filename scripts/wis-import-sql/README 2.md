# WIS Data Import Options

## 🎯 Quick Decision Guide

### Option 1: Manual Import (Current - Works Now)
- **When to use**: IPv6 only, no command-line tools
- **Time**: ~15-20 minutes
- **Files**: 33 SQL chunks + 3 additional files
- **Guide**: See `IMPORT_GUIDE.md`

### Option 2: Direct Database Connection (IPv4 Required)
- **When to use**: Have IPv4 connection to Supabase
- **Time**: ~2-3 minutes
- **Command**: `node import-with-connection.js`
- **Requirement**: DATABASE_URL in .env file

### Option 3: REST API Import (IPv4 Required)
- **When to use**: IPv4 available but can't connect directly to DB
- **Time**: ~5-10 minutes  
- **Command**: `node import-with-rest-api.js`
- **Requirement**: Service role key in .env

### Option 4: psql Command Line (IPv4 Required)
- **When to use**: Have psql installed and IPv4
- **Time**: ~2-3 minutes
- **Command**: `node import-with-connection.js --psql`
- **Requirement**: psql command-line tool

## 📡 Connection Details

### IPv4 Endpoints (From User's Research)
```
Transaction Pooler (Port 6543):
- Host: aws-0-us-west-1.pooler.supabase.com
- IPv4: 13.52.243.179

Session Pooler (Port 5432):  
- Host: aws-0-us-west-1.pooler.supabase.com
- IPv4: 13.52.243.179

Direct Connection (Port 5432):
- Host: db.ydevatqwkoccxhtejdor.supabase.co
- IPv4: 52.53.195.53
```

### Connection Strings
```bash
# Transaction Pooler (recommended for imports)
postgresql://postgres.ydevatqwkoccxhtejdor:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Session Pooler
postgresql://postgres.ydevatqwkoccxhtejdor:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# Direct Connection
postgresql://postgres:[password]@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres
```

## 🚀 Setup Instructions

### For Direct Database Connection

1. **Install PostgreSQL client**:
```bash
npm install pg
```

2. **Add to .env file**:
```env
DATABASE_URL=postgresql://postgres.ydevatqwkoccxhtejdor:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

3. **Run import**:
```bash
node import-with-connection.js
```

### For REST API Import

1. **Ensure .env has**:
```env
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Run import**:
```bash
node import-with-rest-api.js
```

### For psql Command Line

1. **Install psql** (if not installed):
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client
```

2. **Add to .env**:
```env
DATABASE_URL=postgresql://postgres.ydevatqwkoccxhtejdor:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

3. **Run import**:
```bash
node import-with-connection.js --psql
```

## 📊 Data Being Imported

- **42 Vehicle Models**: All Unimog models from U20 to U5023
- **6,468 Procedures**: Technical procedures with full content
- **197+ Parts**: Mercedes parts with specifications
- **Technical Bulletins**: Service updates and advisories

## 🔍 Verification

After import, verify success:

```sql
SELECT 
  (SELECT COUNT(*) FROM wis_models) as models,
  (SELECT COUNT(*) FROM wis_procedures) as procedures,
  (SELECT COUNT(*) FROM wis_parts) as parts,
  (SELECT COUNT(*) FROM wis_bulletins) as bulletins;
```

Expected:
- models: 42
- procedures: 6,468
- parts: 197+
- bulletins: varies

## ⚠️ Troubleshooting

### IPv6 Connection Issues
- Error: `connect ENETUNREACH 2406:da18:...`
- Solution: Use IPv4 connection or manual import

### Large File Issues
- Error: `Query is too large to be run via the SQL Editor`
- Solution: Files already split into 33 chunks

### UUID Casting Issues
- Error: `duplicate key value violates unique constraint`
- Solution: All files now use proper `uuid()` function

### Timeout Issues
- Try Transaction Pooler (port 6543) instead of direct connection
- Reduce batch size in REST API import
- Run during off-peak hours

## 📝 Notes

- All SQL files have been fixed with proper UUID casting
- Procedures are split into 33 chunks (~230KB each)
- Each import method creates a full transaction (all or nothing)
- REST API method includes automatic retry logic
- Direct connection is fastest but requires IPv4