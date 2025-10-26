#!/bin/bash
# RPS Storage and Database Reconciliation Verification
# This script checks if all database page numbers have corresponding local PNG files

set -e

echo "🔍 RPS Reconciliation Verification"
echo ""

# Database page numbers (from query result)
DATABASE_PAGES=(1 50 60 70 74 75 80 90 100 105 107 109 110 111 112 119 120 122 124 126 128 130 132 135 140 141 150 151 158 165 171 176 183 190 201 214 225 237 252 254 256 258 260 262 264 266 268 270 280 290 300 310 320 330 340 350 360 370 380 390 400 402 404 406 410 412 420 422 430 432 440 442 450 452 460 462 470 472 480 482 490 492 500 502 510 512 520 522 530 552 554 556 558 560 562 564 566 568 570 572 574 576 580 590 600 610 620 630 640 650 660 670 680 690 700 702 704 706 707 709 712 714 716 718 720 722 724 726 728 730 732 734 736 738 740 742 744 746 748 750 752 754 756 758 760 762 764 766 768 770 772 774 776 778 780 800 802 804 806 808 810 812 814 816 818 819 820 822 824 826 828 830 832 834 836 838 840 842 844 846 848 850 852 854 856 858 860 862 864 866 868 870 872 874 876 878 880 882 884 886 888 890 892 894 896 898 900 902 904 906 908 910 912 914 916 918 920 922 924 926 928)

LOCAL_DIR="scripts/rps/output/ai_illustrations"

echo "📊 Statistics:"
echo "   Database records: ${#DATABASE_PAGES[@]} unique pages"
echo "   Local PNG files: $(ls "$LOCAL_DIR"/*.png | wc -l | tr -d ' ')"
echo ""

echo "🔎 Checking for mismatches..."
echo ""

MISSING_COUNT=0
MISSING_PAGES=()

for PAGE in "${DATABASE_PAGES[@]}"; do
  # Format page number with leading zeros (4 digits)
  PADDED_PAGE=$(printf "%04d" $PAGE)
  FILE_PATH="$LOCAL_DIR/rps_page_$PADDED_PAGE.png"

  if [ ! -f "$FILE_PATH" ]; then
    echo "   ❌ MISSING: Page $PAGE (expected file: rps_page_$PADDED_PAGE.png)"
    MISSING_COUNT=$((MISSING_COUNT + 1))
    MISSING_PAGES+=($PAGE)
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $MISSING_COUNT -eq 0 ]; then
  echo "✅ SUCCESS: All database records have corresponding local files!"
  echo ""
  echo "📋 Reconciliation Status:"
  echo "   ✓ All ${#DATABASE_PAGES[@]} database pages exist in local files"
  echo "   ✓ No broken links will occur after re-upload"
  echo "   ✓ Safe to proceed with storage cleanup"
  echo ""
  echo "🎯 Next Steps:"
  echo "   1. Set SUPABASE_SERVICE_ROLE_KEY environment variable"
  echo "   2. Run: bash scripts/rps/clean-and-reupload-storage.sh"
  echo "   3. Verify images load in admin interface"
  echo "   4. Test Barry with RPS queries"
  echo ""
else
  echo "⚠️  WARNING: Found $MISSING_COUNT missing files!"
  echo ""
  echo "📋 Missing Pages:"
  for PAGE in "${MISSING_PAGES[@]}"; do
    echo "   - Page $PAGE"
  done
  echo ""
  echo "🔧 Resolution Options:"
  echo "   Option A: Find and add missing PNG files to local directory"
  echo "   Option B: Delete database records for missing pages"
  echo ""
  echo "   To delete missing records (SQL):"
  echo "   DELETE FROM rps_illustrations WHERE page_number IN (${MISSING_PAGES[*]});"
  echo ""
  echo "❌ DO NOT proceed with storage cleanup until resolved!"
  echo ""
fi
