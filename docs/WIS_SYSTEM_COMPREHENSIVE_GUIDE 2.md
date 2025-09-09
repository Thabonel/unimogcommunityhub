# WIS (Workshop Information System) - Comprehensive Guide

## 📋 Overview

The Workshop Information System (WIS) is a comprehensive technical documentation system that provides Unimog owners and mechanics with access to official Mercedes workshop information, parts catalogs, and technical service bulletins. Our implementation extracts data from 54GB VDI (VirtualBox Disk Image) files and makes it accessible through a modern web interface.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    WIS System Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Components                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ WISSystemPage   │ │ WISEPCPage      │ │ WISContentViewer │   │
│  │ (Public)        │ │ (Premium)       │ │ (File Display)  │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  Admin Interface                                                 │
│  ┌─────────────────┐ ┌─────────────────┐                       │
│  │ WISUploadMgr    │ │ Admin Dashboard │                       │
│  │ (File Upload)   │ │ (/admin)        │                       │
│  └─────────────────┘ └─────────────────┘                       │
├─────────────────────────────────────────────────────────────────┤
│  Data Extraction Scripts (Node.js)                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ VDI Converter   │ │ Content Extrac. │ │ Uploader        │   │
│  │ (QEMU/VBoxMang) │ │ (HTML/JSON)     │ │ (Supabase)      │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  Storage Layer                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │             Supabase Storage Buckets                        │ │
│  │  wis-manuals/    │  manuals/        │  bulletins/        │ │
│  │  ├── manuals/    │  ├── HTML Files  │  ├── TSBs         │ │
│  │  ├── bulletins/  │  ├── Images      │  ├── Updates      │ │
│  │  └── parts/      │  └── Resources   │  └── Procedures   │ │
│  └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Database Tables                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ wis_servers     │ │ wis_sessions    │ │ wis_content     │   │
│  │ (Config)        │ │ (User Access)   │ │ (Metadata)      │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Data Extraction System

### 1. VDI Processing Pipeline

Our extraction system processes Mercedes WIS data through a multi-stage pipeline:

#### Stage 1: VDI Conversion
```bash
# Convert VDI to RAW format for mounting
scripts/wis-vdi-converter.js
```

**Process:**
- Input: 54GB Mercedes WIS VDI files
- Convert VDI → RAW format using QEMU tools
- Create mountable disk images
- Extract file system contents

#### Stage 2: Content Extraction
```bash
# Extract HTML, CSS, JS, and JSON files
scripts/extract-wis-data.js
```

**Process:**
- Mount disk images as read-only
- Scan for HTML workshop manuals
- Extract technical service bulletins (TSBs)
- Parse parts catalog JSON data
- Preserve file structure and metadata

#### Stage 3: Upload & Organization
```bash
# Upload to Supabase storage
scripts/wis-uploader.js
```

**Process:**
- Organize files by type (manuals/bulletins/parts)
- Generate unique timestamps for file naming
- Upload to appropriate storage buckets
- Create database records for indexing

### 2. Extraction Scripts

#### Core Scripts Location: `/scripts/`

| Script | Purpose | Status |
|--------|---------|---------|
| `wis-vdi-converter.js` | VDI to RAW conversion | ✅ Complete |
| `extract-wis-data.js` | Content extraction | ✅ Complete |
| `wis-uploader.js` | File upload system | ✅ Complete |
| `wis-extractor.js` | Master orchestrator | ✅ Complete |
| `wis-safe-extractor.js` | Safe extraction mode | ✅ Complete |
| `monitor-wis-extraction.sh` | Progress monitoring | ✅ Complete |
| `verify-wis-setup.js` | System verification | ✅ Complete |

#### NPM Scripts Available:

```bash
# Check system status
npm run wis:status

# Upload new files
npm run wis:upload

# Monitor extraction progress
npm run wis:watch

# Verify system health
npm run wis:verify
```

## 📊 Database Schema

### WIS Tables

#### `wis_servers`
```sql
CREATE TABLE wis_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    guacamole_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `wis_sessions`
```sql
CREATE TABLE wis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    server_id UUID REFERENCES wis_servers(id),
    session_token VARCHAR(255),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `wis_content`
```sql
CREATE TABLE wis_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(100), -- 'manual', 'bulletin', 'parts'
    file_path TEXT NOT NULL,
    file_size BIGINT,
    tier VARCHAR(50) DEFAULT 'free',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Buckets

#### `wis-manuals` (Public Bucket)
```
wis-manuals/
├── manuals/           # Workshop manuals (HTML)
├── bulletins/         # Technical service bulletins
└── parts/             # Parts catalog data (JSON)
```

**Security Policy:**
- Public read access
- Admin-only write access
- RLS policies for content filtering

## 🔧 System Components

### Frontend Components

#### 1. WISSystemPage (`/knowledge/wis`)
- **Location**: `src/pages/knowledge/WISSystemPage.tsx`
- **Purpose**: Main WIS interface for public access
- **Features**:
  - Browse available manuals
  - Search content
  - View HTML documents
  - Download functionality

#### 2. WISEPCPage (`/knowledge/wis-epc`)
- **Location**: `src/pages/knowledge/WISEPCPage.tsx`
- **Purpose**: Premium Electronic Parts Catalog
- **Features**:
  - Subscription-gated access
  - Advanced part lookups
  - Interactive diagrams
  - Remote desktop integration

#### 3. WISContentViewer
- **Location**: `src/components/wis/WISContentViewer.tsx`
- **Purpose**: Display WIS content files
- **Features**:
  - HTML rendering
  - JSON data display
  - Image support
  - Print functionality

#### 4. WISEPCViewer
- **Location**: `src/components/wis/WISEPCViewer.tsx`
- **Purpose**: Premium content viewer
- **Features**:
  - Apache Guacamole integration
  - Remote desktop sessions
  - Session management
  - Time-based access control

### Admin Interface

#### WISUploadManager
- **Location**: `src/components/admin/WISUploadManager.tsx`
- **Purpose**: Admin file management
- **Features**:
  - Bulk file uploads
  - Content organization
  - Metadata editing
  - Storage monitoring

## 📚 File Organization

### Extracted Content Structure

```
Extracted WIS Files:
├── Workshop_Manuals/
│   ├── Engine/
│   │   ├── OM936_Service_Manual.html
│   │   ├── OM924_Troubleshooting.html
│   │   └── images/
│   ├── Transmission/
│   │   ├── G330_Manual.html
│   │   └── diagnostics/
│   ├── Axles/
│   │   ├── Portal_Axle_Service.html
│   │   ├── Differential_Rebuild.html
│   │   └── torque_specs.json
│   └── Electrical/
│       ├── Wiring_Diagrams.html
│       └── CAN_Bus_Diagnostics.html
├── Technical_Bulletins/
│   ├── TSB_2020_001_Portal_Axle.html
│   ├── TSB_2020_002_Engine_Update.html
│   └── Safety_Notices/
└── Parts_Catalogs/
    ├── U1700L_Parts.json
    ├── U2150L_Parts.json
    └── Common_Parts.json
```

### Uploaded File Naming Convention

```
Format: {timestamp}_{original_name}
Examples:
- 1755674108611_tsb_2020_001_portal_axle.html
- 1755674109200_unimog_400_oil_change.html
- 1755674109342_unimog_portal_axle_parts.json
```

## 🌐 Access URLs

### Direct File Access (Public)

**Technical Service Bulletins:**
```
https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/wis-manuals/bulletins/{filename}
```

**Workshop Manuals:**
```
https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/wis-manuals/manuals/{filename}
```

**Parts Data:**
```
https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/wis-manuals/parts/{filename}
```

### Application Access

**Public WIS Interface:**
- Local: `http://localhost:5173/knowledge/wis`
- Staging: `https://unimogcommunity-staging.netlify.app/knowledge/wis`
- Production: `https://unimogcommunityhub.com/knowledge/wis`

**Premium WIS-EPC Interface:**
- Local: `http://localhost:5173/knowledge/wis-epc`
- Staging: `https://unimogcommunity-staging.netlify.app/knowledge/wis-epc`
- Production: `https://unimogcommunityhub.com/knowledge/wis-epc`

**Admin Interface:**
- Local: `http://localhost:5173/admin`
- Staging: `https://unimogcommunity-staging.netlify.app/admin`

## 🧪 Testing Guide

### 1. Quick File Access Test

Test uploaded files directly in browser:

```bash
# Test Technical Service Bulletin
open "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/wis-manuals/bulletins/1755674108611_tsb_2020_001_portal_axle.html"

# Test Workshop Manual
open "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/wis-manuals/manuals/1755674109200_unimog_400_oil_change.html"

# Test Parts Data
open "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/wis-manuals/parts/1755674109342_unimog_portal_axle_parts.json"
```

### 2. System Health Check

```bash
# Verify extraction system
npm run wis:status

# Check database connectivity
node scripts/verify-wis-setup.js

# Test upload system
npm run wis:verify
```

### 3. Frontend Testing

```bash
# Start development server
npm run dev

# Navigate to WIS system
open http://localhost:5173/knowledge/wis

# Test admin interface (requires admin login)
open http://localhost:5173/admin
```

### 4. Expected Test Results

**✅ Files should:**
- Display as formatted HTML pages
- Load images and stylesheets correctly
- Show structured JSON data for parts
- Be accessible without authentication
- Download properly from any browser

**🚨 Alert if:**
- Files return 404 errors
- HTML content appears broken
- Images fail to load
- JSON data is malformed
- Access is denied

## 🔐 Security & Access Control

### Public Access
- **WIS Manuals**: Free tier access to basic workshop information
- **Technical Bulletins**: Open access for safety and maintenance information
- **File Downloads**: No authentication required for public content

### Premium Access (WIS-EPC)
- **Subscription Required**: Monthly or lifetime subscription
- **Remote Desktop**: Apache Guacamole integration for full WIS access
- **Session Management**: Time-limited access sessions
- **Advanced Features**: Full parts catalog, diagnostic procedures

### Admin Access
- **File Management**: Upload, organize, and manage WIS content
- **User Management**: Control access to premium features
- **System Monitoring**: Track usage and performance metrics

### Row Level Security (RLS)

```sql
-- WIS Content Access Policy
CREATE POLICY "wis_content_access" ON wis_content
FOR SELECT TO authenticated, anon
USING (
  CASE 
    WHEN tier = 'free' THEN true
    WHEN tier = 'premium' THEN (
      SELECT has_premium_access(auth.uid())
    )
    ELSE false
  END
);

-- Admin Only Modifications
CREATE POLICY "wis_admin_only" ON wis_content
FOR ALL TO authenticated
USING (
  SELECT has_role(auth.uid(), 'admin')
)
WITH CHECK (
  SELECT has_role(auth.uid(), 'admin')
);
```

## 🚀 Deployment & Production

### Current Status
- **Extraction System**: ✅ Complete and operational
- **File Upload**: ✅ 3 test files successfully uploaded
- **Storage Access**: ✅ Public URLs working
- **Frontend Integration**: ✅ Components built and deployed
- **Admin Interface**: ✅ Management tools available

### Production Configuration

#### Environment Variables
```bash
# Required for WIS system
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=ydevatqwkoccxhtejdor

# Optional for premium features
VITE_GUACAMOLE_BASE_URL=your_guacamole_server
VITE_WIS_PREMIUM_TIER=enabled
```

#### Netlify Build Settings
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/knowledge/wis/*"
  to = "/knowledge/wis/index.html"
  status = 200
```

### Scaling Considerations

#### Storage Optimization
- **CDN Integration**: Use Netlify CDN for static WIS files
- **Image Optimization**: Compress images and diagrams
- **Lazy Loading**: Load content on demand

#### Performance Monitoring
- **File Access Metrics**: Track most accessed manuals
- **User Session Analytics**: Monitor premium feature usage
- **Error Tracking**: Alert on broken file links

#### Content Updates
- **Automated Extraction**: Schedule regular VDI processing
- **Version Control**: Track manual and bulletin updates
- **Delta Updates**: Only upload changed files

## 🔧 Maintenance & Operations

### Regular Tasks

#### Weekly
- [ ] Verify all uploaded files are accessible
- [ ] Check storage bucket usage and cleanup
- [ ] Review error logs for broken links

#### Monthly  
- [ ] Process new VDI updates from Mercedes
- [ ] Update technical service bulletins
- [ ] Review premium subscription usage

#### Quarterly
- [ ] Audit file organization and cleanup duplicates
- [ ] Update extraction scripts for new VDI formats
- [ ] Review and optimize storage costs

### Troubleshooting Common Issues

#### File Access Problems
```bash
# Check file exists in storage
node scripts/check-wis-files.js

# Verify RLS policies
node scripts/test-storage-access.js

# Re-upload missing files
npm run wis:upload --specific-file="filename"
```

#### Extraction Issues
```bash
# Check VDI file integrity
file path/to/mercedes.vdi

# Test mounting process
sudo mount -o loop,ro converted.raw /mnt/wis

# Debug extraction script
node scripts/extract-wis-data.js --debug
```

#### Frontend Issues
```bash
# Test component loading
npm run dev
open http://localhost:5173/knowledge/wis

# Check network requests
# Open browser dev tools → Network tab

# Verify API endpoints
curl https://ydevatqwkoccxhtejdor.supabase.co/rest/v1/wis_content
```

## 📈 Future Enhancements

### Planned Features

#### Phase 1 (Next 3 months)
- [ ] **Search Integration**: Full-text search across all WIS documents
- [ ] **Bookmarking System**: Save frequently accessed procedures
- [ ] **Mobile Optimization**: Responsive design for mobile mechanics
- [ ] **Offline Access**: PWA with cached manual downloads

#### Phase 2 (Next 6 months)
- [ ] **AI Integration**: Barry AI assistant trained on WIS content
- [ ] **Interactive Diagrams**: Clickable parts diagrams with procedures
- [ ] **Video Integration**: Embed workshop procedure videos
- [ ] **Multi-language Support**: German and English WIS content

#### Phase 3 (Next year)
- [ ] **Augmented Reality**: AR-guided repair procedures
- [ ] **3D Parts Viewer**: Interactive 3D parts catalogs  
- [ ] **Collaborative Notes**: Community-driven annotations
- [ ] **Integration APIs**: Third-party tool integration

### Technical Roadmap

#### Infrastructure
- **Docker Containers**: Containerize extraction system
- **Kubernetes**: Scale processing for multiple VDI files
- **S3 Migration**: Move from Supabase to AWS S3 for cost optimization

#### Data Processing
- **Machine Learning**: Auto-categorize and tag content
- **OCR Integration**: Extract text from scanned diagrams
- **Content Validation**: Automated quality checking

## 💰 Cost Analysis

### Current Costs (Monthly)

#### Supabase Storage
- **Free Tier**: 1GB storage included
- **Paid Tier**: $0.021/GB after free tier
- **Current Usage**: ~500MB WIS files
- **Estimated Cost**: $0 (within free tier)

#### Bandwidth
- **Free Tier**: 10GB egress included  
- **Paid Tier**: $0.09/GB after free tier
- **Estimated Usage**: 2GB/month
- **Estimated Cost**: $0 (within free tier)

#### Database Operations
- **Free Tier**: 500,000 requests/month
- **WIS Usage**: ~10,000 requests/month
- **Estimated Cost**: $0 (within free tier)

**Total Monthly Cost**: $0 (Currently within free tiers)

### Scaling Cost Projections

| Users | Storage | Bandwidth | Monthly Cost |
|-------|---------|-----------|--------------|
| 100   | 2GB     | 20GB      | $1.50        |
| 500   | 5GB     | 100GB     | $10.00       |
| 1000  | 10GB    | 200GB     | $25.00       |
| 5000  | 25GB    | 500GB     | $70.00       |

## 📞 Support & Troubleshooting

### Getting Help

#### Documentation
- **This Guide**: Complete system overview
- **API Documentation**: `/docs/WIS_API.md`
- **Deployment Guide**: `/docs/WIS_DEPLOYMENT.md`

#### Support Channels
- **GitHub Issues**: Report bugs and feature requests
- **Community Discord**: Real-time help from community
- **Email Support**: technical@unimogcommunityhub.com

### Common Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `WIS001` | File not found | Check file path and bucket permissions |
| `WIS002` | Access denied | Verify user subscription status |
| `WIS003` | Upload failed | Check file size and format requirements |
| `WIS004` | Extraction error | Verify VDI file integrity |
| `WIS005` | Mount failed | Check disk space and permissions |

### Emergency Procedures

#### System Outage
1. Check Supabase dashboard status
2. Verify Netlify deployment status  
3. Test direct file access URLs
4. Contact support with error details

#### Data Recovery
1. Check backup files in `/wis-extraction/backups/`
2. Re-run extraction from original VDI files
3. Restore from Supabase point-in-time recovery
4. Notify users of service restoration

---

## 📋 Quick Reference

### Key URLs
- **WIS System**: `/knowledge/wis`
- **Premium WIS-EPC**: `/knowledge/wis-epc`  
- **Admin Interface**: `/admin`
- **Storage Bucket**: `wis-manuals` (Supabase)

### Key Scripts
- **Extract**: `scripts/extract-wis-data.js`
- **Upload**: `scripts/wis-uploader.js`
- **Monitor**: `scripts/monitor-wis-extraction.sh`
- **Verify**: `scripts/verify-wis-setup.js`

### Key Components
- **Frontend**: `WISSystemPage.tsx`, `WISEPCPage.tsx`
- **Viewers**: `WISContentViewer.tsx`, `WISEPCViewer.tsx`
- **Admin**: `WISUploadManager.tsx`

### Key Tables
- **wis_servers**: Server configurations
- **wis_sessions**: User access sessions
- **wis_content**: Content metadata and indexing

---

**Last Updated**: August 20, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
**Maintainer**: Unimog Community Hub Development Team