# Barry's U435 Manual System Documentation

This folder contains all documentation for Barry's three-component manual system.

## Core Components

### 1. U435 PDF Chapters (Source of Truth)
- **Location**: Supabase Storage bucket `u435-chapters` (Public)
- **Documentation**: `u435-chapters-storage.md`

### 2. U435 Manual Index (Navigation System)
- **Documentation**: `u435-index-system.md` (moved from parent docs folder)
- **Database**: `u435_manual_index` table

### 3. Page-to-PDF Mapping System
- **Documentation**: `page-to-pdf-mapping.md`
- **Integration**: Built into chapter system

## Files in this Folder

- `README.md` - This overview
- `barry-u435-system-overview.md` - Complete system explanation
- `u435-index-system.md` - The comprehensive manual index (moved from parent)
- `u435-complete-manual-system.md` - Complete manual system docs (moved from parent)
- `u435-chapters-storage.md` - PDF chapter storage details
- `page-to-pdf-mapping.md` - Page mapping system
- `implementation-checklist.md` - What needs to be done to make Barry work

## Quick Reference

**Portal Hub Procedures**:
- Front: Page 555, Section 6.1/1 → `U435_19_Wheel_Hub_Front.pdf`
- Rear: Page 651, Section 6.1/1 → `U435_22_Wheel_Hub_Rear.pdf`

**Current Status**: System documented but Barry not properly connected to it.