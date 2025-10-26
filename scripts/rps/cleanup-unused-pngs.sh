#!/bin/bash
# Cleanup unused RPS illustration PNGs
# Keeps only the 221 pages that have actual diagrams in the database
# Moves unused files to backup folder instead of deleting

set -e

ILLUSTRATIONS_DIR="$(dirname "$0")/output/ai_illustrations"
BACKUP_DIR="$(dirname "$0")/output/unused_pngs_backup"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Pages to KEEP (from rps_illustrations table)
KEEP_PAGES=(1 50 60 70 74 75 80 90 100 105 107 109 110 111 112 119 120 122 124 126 128 130 132 135 140 141 150 151 158 165 171 176 183 190 201 214 225 237 252 254 256 258 260 262 264 266 268 270 280 290 300 310 320 330 340 350 360 370 380 390 400 402 404 406 410 412 420 422 430 432 440 442 450 452 460 462 470 472 480 482 490 492 500 502 510 512 520 522 530 552 554 556 558 560 562 564 566 568 570 572 574 576 580 590 600 610 620 630 640 650 660 670 680 690 700 702 704 706 707 709 712 714 716 718 720 722 724 726 728 730 732 734 736 738 740 742 744 746 748 750 752 754 756 758 760 762 764 766 768 770 772 774 776 778 780 800 802 804 806 808 810 812 814 816 818 819 820 822 824 826 828 830 832 834 836 838 840 842 844 846 848 850 852 854 856 858 860 862 864 866 868 870 872 874 876 878 880 882 884 886 888 890 892 894 896 898 900 902 904 906 908 910 912 914 916 918 920 922 924 926 928)

echo "Starting PNG cleanup..."
echo "Directory: $ILLUSTRATIONS_DIR"
echo "Backup to: $BACKUP_DIR"
echo ""

# Count files
TOTAL_FILES=$(ls -1 "$ILLUSTRATIONS_DIR"/rps_page_*.png 2>/dev/null | wc -l)
echo "Total PNG files: $TOTAL_FILES"
echo "Pages to keep: ${#KEEP_PAGES[@]}"
echo ""

# Convert array to lookup string for faster checking
KEEP_LOOKUP="|$(IFS='|'; echo "${KEEP_PAGES[*]}")|"

MOVED=0
KEPT=0

# Process all PNG files
for FILE in "$ILLUSTRATIONS_DIR"/rps_page_*.png; do
    if [ -f "$FILE" ]; then
        FILENAME=$(basename "$FILE")
        # Extract page number (e.g., rps_page_0766.png -> 766)
        PAGE_NUM=$(echo "$FILENAME" | sed 's/rps_page_0*//' | sed 's/.png//')
        PAGE_NUM=$((10#$PAGE_NUM))  # Convert to decimal (remove leading zeros)

        # Check if this page should be kept
        if [[ "$KEEP_LOOKUP" == *"|$PAGE_NUM|"* ]]; then
            KEPT=$((KEPT + 1))
        else
            # Move to backup
            mv "$FILE" "$BACKUP_DIR/"
            MOVED=$((MOVED + 1))
            if [ $((MOVED % 100)) -eq 0 ]; then
                echo "Moved $MOVED files..."
            fi
        fi
    fi
done

echo ""
echo "Cleanup complete!"
echo "Files kept: $KEPT"
echo "Files moved to backup: $MOVED"
echo "Space saved: $(du -sh "$BACKUP_DIR" | cut -f1)"
echo ""
echo "To restore all files: mv $BACKUP_DIR/* $ILLUSTRATIONS_DIR/"
echo "To permanently delete backup: rm -rf $BACKUP_DIR"
