#!/bin/bash

# Prepare U435 Maintenance Manual for Supabase upload
# Copies and renames files to remove spaces and special characters

SOURCE_DIR="/Users/thabonel/Documents/Unimog Manuals/Unimog 435 Maintenance Manual - English"
OUTPUT_DIR="./output/u435-maintenance"

echo "🔧 Preparing U435 Maintenance Manual for upload..."

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Copy and rename each file
echo "📋 Copying and renaming 26 maintenance manual sections..."

cp "$SOURCE_DIR/0 - Foreward.pdf" "$OUTPUT_DIR/0_Foreward.pdf"
cp "$SOURCE_DIR/00 - General.pdf" "$OUTPUT_DIR/00_General.pdf"
cp "$SOURCE_DIR/01 - Engine Housing.pdf" "$OUTPUT_DIR/01_Engine_Housing.pdf"
cp "$SOURCE_DIR/05 - Engine Timing.pdf" "$OUTPUT_DIR/05_Engine_Timing.pdf"
cp "$SOURCE_DIR/07 - Fuel Injectors.pdf" "$OUTPUT_DIR/07_Fuel_Injectors.pdf"
cp "$SOURCE_DIR/09 - Air Filter.pdf" "$OUTPUT_DIR/09_Air_Filter.pdf"
cp "$SOURCE_DIR/13 - Air Compressor + Belts.pdf" "$OUTPUT_DIR/13_Air_Compressor_Belts.pdf"
cp "$SOURCE_DIR/18 - Engine Lubrication.pdf" "$OUTPUT_DIR/18_Engine_Lubrication.pdf"
cp "$SOURCE_DIR/24 - Engine Mounts.pdf" "$OUTPUT_DIR/24_Engine_Mounts.pdf"
cp "$SOURCE_DIR/25 - Clutch.pdf" "$OUTPUT_DIR/25_Clutch.pdf"
cp "$SOURCE_DIR/26 - Transmission.pdf" "$OUTPUT_DIR/26_Transmission.pdf"
cp "$SOURCE_DIR/29 - Pedal Linkage.pdf" "$OUTPUT_DIR/29_Pedal_Linkage.pdf"
cp "$SOURCE_DIR/31 - Frame.pdf" "$OUTPUT_DIR/31_Frame.pdf"
cp "$SOURCE_DIR/32 - Suspension.pdf" "$OUTPUT_DIR/32_Suspension.pdf"
cp "$SOURCE_DIR/33 - Front Axle.pdf" "$OUTPUT_DIR/33_Front_Axle.pdf"
cp "$SOURCE_DIR/35 - Rear Axle.pdf" "$OUTPUT_DIR/35_Rear_Axle.pdf"
cp "$SOURCE_DIR/40 - Wheels + Prop Shafts.pdf" "$OUTPUT_DIR/40_Wheels_Prop_Shafts.pdf"
cp "$SOURCE_DIR/42 - Brakes - Hydraulic + Mechanical.pdf" "$OUTPUT_DIR/42_Brakes_Hydraulic_Mechanical.pdf"
cp "$SOURCE_DIR/43 - Brakes - Pneumatic.pdf" "$OUTPUT_DIR/43_Brakes_Pneumatic.pdf"
cp "$SOURCE_DIR/46 - Steering.pdf" "$OUTPUT_DIR/46_Steering.pdf"
cp "$SOURCE_DIR/49 - Exhaust.pdf" "$OUTPUT_DIR/49_Exhaust.pdf"
cp "$SOURCE_DIR/50 - Cooling System.pdf" "$OUTPUT_DIR/50_Cooling_System.pdf"
cp "$SOURCE_DIR/54 - Batteries.pdf" "$OUTPUT_DIR/54_Batteries.pdf"
cp "$SOURCE_DIR/55 - Special Equipment.pdf" "$OUTPUT_DIR/55_Special_Equipment.pdf"
cp "$SOURCE_DIR/60 - Body.pdf" "$OUTPUT_DIR/60_Body.pdf"
cp "$SOURCE_DIR/82 - Headlights.pdf" "$OUTPUT_DIR/82_Headlights.pdf"

echo "✅ Files copied and renamed successfully!"

# List the output files
echo ""
echo "📁 Files ready for upload in $OUTPUT_DIR:"
ls -lh "$OUTPUT_DIR" | tail -n +2 | awk '{print "  " $5 " " $9}'

# Calculate total size
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
FILE_COUNT=$(ls "$OUTPUT_DIR" | wc -l | tr -d ' ')

echo ""
echo "📊 Summary:"
echo "  Total files: $FILE_COUNT"
echo "  Total size: $TOTAL_SIZE"
echo ""
echo "🚀 Ready to upload with:"
echo "  supabase storage cp $OUTPUT_DIR/ u435-maintenance/ --recursive"