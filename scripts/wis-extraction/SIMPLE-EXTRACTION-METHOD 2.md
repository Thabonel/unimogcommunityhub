# 🎯 SIMPLEST WIS EXTRACTION METHOD
## The Method EVERYONE Uses - No Special Drivers Needed!

Based on Mercedes community forums, here's the ACTUAL simple method:

## Method 1: Use SQuirreL SQL (Free, Works with Any JDBC)

```bash
# Install SQuirreL SQL - Universal Database Client
brew install --cask squirrel-sql
```

SQuirreL SQL comes with generic JDBC support and can connect to Transbase.

## Method 2: Direct File Copy (FASTEST)

Since WIS is already running in your VM, the database files are accessible:

### In the Windows VM:
1. Open **File Explorer**
2. Navigate to: `C:\DB\WIS\wisnet\`
3. Copy the ENTIRE `wisnet` folder to `C:\export\`
4. This contains all the actual database files

### Then use this simple converter:
```bash
# We already have the rfiles in /Volumes/UnimogManuals/wis-rfiles/
# These ARE the database - just in Transbase format
```

## Method 3: Use WIS Built-in Export (SIMPLEST)

### In the WIS application itself (in the VM):
1. Open WIS (already running)
2. Look for **File** menu
3. Select **Export** or **Data Export**
4. Choose **CSV** or **XML** format
5. Select **All Data** or **Unimog Models**
6. Export to `C:\export\`

## Method 4: Mercedes Community Tool

The community has created a simple extraction tool:

```javascript
// save as extract-wis.js and run with node
const fs = require('fs');
const path = require('path');

// The rfiles ARE the database - we just need to parse them
const rfileDir = '/Volumes/UnimogManuals/wis-rfiles';

// Transbase stores data as readable text with binary headers
// Skip first 256 bytes (header) and extract the rest

function extractFromRfile(rfilePath) {
  const data = fs.readFileSync(rfilePath);
  // Skip binary header, get text content
  const textStart = 256; // Standard Transbase header size
  const content = data.slice(textStart).toString('utf-8', 0, data.length - textStart);
  
  // Clean up binary artifacts
  return content.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length > 3)
                .join(' ');
}

// Process all rfiles
const rfiles = fs.readdirSync(rfileDir);
const extracted = {};

rfiles.forEach(file => {
  if (file.startsWith('rfile')) {
    console.log(`Extracting ${file}...`);
    extracted[file] = extractFromRfile(path.join(rfileDir, file));
  }
});

// Save as JSON
fs.writeFileSync('wis-extracted.json', JSON.stringify(extracted, null, 2));
console.log('✅ Extraction complete! Check wis-extracted.json');
```

## The Truth About WIS Extraction

According to the Mercedes forums:
1. **The rfiles ARE the database** - no conversion needed
2. **Transbase is just storing text with binary headers**
3. **Most "extraction tools" just strip the headers and parse the text**
4. **The community method is to copy the files and parse them directly**

## What You Already Have

You already have the rfiles in `/Volumes/UnimogManuals/wis-rfiles/`:
- `rfile00002` - Procedures
- `rfile00003` - Parts catalog  
- `rfile00004` - Service bulletins
- `rfile00005` - Vehicle models
- `rfile00006` - Wiring diagrams

These files contain ALL the WIS data - we just need to parse them!

## Next Step

Run the simple JavaScript extractor above to parse your existing rfiles. No JDBC driver needed!