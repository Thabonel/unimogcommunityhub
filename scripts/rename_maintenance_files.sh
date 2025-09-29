#!/bin/bash

# Script to rename U435 Maintenance Manual files for Supabase upload
# This adds U435_Maint_ prefix to avoid conflicts with repair manual

SOURCE_DIR="/Users/thabonel/Documents/Unimog Manuals/Unimog 435 Maintenance Manual - English"
DEST_DIR="/Users/thabonel/Documents/Unimog Manuals/u435_maintenance_ready"

# Create destination directory
mkdir -p "$DEST_DIR"

echo "Renaming U435 Maintenance Manual files..."
echo "Source: $SOURCE_DIR"
echo "Destination: $DEST_DIR"
echo ""

# Copy and rename each file
cp "$SOURCE_DIR/0 - Foreward.pdf" "$DEST_DIR/U435_Maint_00_Foreward.pdf"
cp "$SOURCE_DIR/00 - General.pdf" "$DEST_DIR/U435_Maint_00_General.pdf"
cp "$SOURCE_DIR/01 - Engine Housing.pdf" "$DEST_DIR/U435_Maint_01_Engine_Housing.pdf"
cp "$SOURCE_DIR/05 - Engine Timing.pdf" "$DEST_DIR/U435_Maint_05_Engine_Timing.pdf"
cp "$SOURCE_DIR/07 - Fuel Injectors.pdf" "$DEST_DIR/U435_Maint_07_Fuel_Injectors.pdf"
cp "$SOURCE_DIR/09 - Air Filter.pdf" "$DEST_DIR/U435_Maint_09_Air_Filter.pdf"
cp "$SOURCE_DIR/13 - Air Compressor + Belts.pdf" "$DEST_DIR/U435_Maint_13_Air_Compressor_Belts.pdf"
cp "$SOURCE_DIR/18 - Engine Lubrication.pdf" "$DEST_DIR/U435_Maint_18_Engine_Lubrication.pdf"
cp "$SOURCE_DIR/24 - Engine Mounts.pdf" "$DEST_DIR/U435_Maint_24_Engine_Mounts.pdf"
cp "$SOURCE_DIR/25 - Clutch.pdf" "$DEST_DIR/U435_Maint_25_Clutch.pdf"
cp "$SOURCE_DIR/26 - Transmission.pdf" "$DEST_DIR/U435_Maint_26_Transmission.pdf"
cp "$SOURCE_DIR/29 - Pedal Linkage.pdf" "$DEST_DIR/U435_Maint_29_Pedal_Linkage.pdf"
cp "$SOURCE_DIR/31 - Frame.pdf" "$DEST_DIR/U435_Maint_31_Frame.pdf"
cp "$SOURCE_DIR/32 - Suspension.pdf" "$DEST_DIR/U435_Maint_32_Suspension.pdf"
cp "$SOURCE_DIR/33 - Front Axle.pdf" "$DEST_DIR/U435_Maint_33_Front_Axle.pdf"
cp "$SOURCE_DIR/35 - Rear Axle.pdf" "$DEST_DIR/U435_Maint_35_Rear_Axle.pdf"
cp "$SOURCE_DIR/40 - Wheels + Prop Shafts.pdf" "$DEST_DIR/U435_Maint_40_Wheels_Prop_Shafts.pdf"
cp "$SOURCE_DIR/42 - Brakes - Hydraulic + Mechanical.pdf" "$DEST_DIR/U435_Maint_42_Brakes_Hydraulic_Mechanical.pdf"
cp "$SOURCE_DIR/43 - Brakes - Pneumatic.pdf" "$DEST_DIR/U435_Maint_43_Brakes_Pneumatic.pdf"
cp "$SOURCE_DIR/46 - Steering.pdf" "$DEST_DIR/U435_Maint_46_Steering.pdf"
cp "$SOURCE_DIR/49 - Exhaust.pdf" "$DEST_DIR/U435_Maint_49_Exhaust.pdf"
cp "$SOURCE_DIR/50 - Cooling System.pdf" "$DEST_DIR/U435_Maint_50_Cooling_System.pdf"
cp "$SOURCE_DIR/54 - Batteries.pdf" "$DEST_DIR/U435_Maint_54_Batteries.pdf"
cp "$SOURCE_DIR/55 - Special Equipment.pdf" "$DEST_DIR/U435_Maint_55_Special_Equipment.pdf"
cp "$SOURCE_DIR/60 - Body.pdf" "$DEST_DIR/U435_Maint_60_Body.pdf"
cp "$SOURCE_DIR/82 - Headlights.pdf" "$DEST_DIR/U435_Maint_82_Headlights.pdf"

echo ""
echo "Files renamed and copied to: $DEST_DIR"
echo ""
echo "File count check:"
ls -1 "$DEST_DIR" | wc -l
echo ""
echo "Total size:"
du -sh "$DEST_DIR"

echo ""
echo "✅ Files ready for upload to Supabase u435-chapters bucket!"
echo ""
echo "Next steps:"
echo "1. Upload all files from $DEST_DIR to u435-chapters bucket"
echo "2. Run the SQL script to add maintenance entries to database"