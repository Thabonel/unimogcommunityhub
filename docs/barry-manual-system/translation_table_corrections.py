#!/usr/bin/env python3
"""
Compare actual manual boundaries with translation table and identify corrections needed.
This script generates the corrected translation table.
"""

# ACTUAL BOUNDARIES from manual_chunks query (Contents Chapter pages mark section starts)
actual_boundaries = [
    # (section_num, start_page, end_page, total_pages)
    (1, 86, 88, 3),      # Air Filter System
    (2, 89, 100, 12),    # Turbocharger 3 LKs
    (3, 101, 120, 20),   # Turbocharger To 4 B 27
    (4, 121, 128, 8),    # Belt drive
    (5, 129, 136, 8),    # Electrical system
    (6, 137, 158, 22),   # Oil system
    (7, 159, 173, 15),   # Cooling System ← **WRONG IN TABLE: claims 159-162, actually 159-173**
    (8, 174, 346, 173),  # Engine + Clutch + Transmission ← HUGE: combines multiple sections
    (9, 347, 380, 34),   # PTO transmission
    (10, 381, 410, 30),  # Front Axle
    (11, 411, 423, 13),  # Fast PTO
    (12, 424, 435, 12),  # Power take-off
    (13, 436, 449, 14),  # Clutch pedal
    (14, 450, 461, 12),  # Brake pedal
    (15, 462, 482, 21),  # Control linkage
    (16, 483, 486, 4),   # Frame alignment
    (17, 487, 507, 21),  # Trailer coupling
    (18, 508, 511, 4),   # Shock absorber
    (19, 512, 519, 8),   # Torsion bar stabilizer
    (20, 520, 568, 49),  # Front Axle detailed
    (21, 569, 616, 48),  # Front Suspension
    (22, 617, 660, 44),  # Rear Axle detailed
    (23, 661, 704, 44),  # Rear Axle/Wheels
    (24, 705, 709, 5),   # Tires and wheels
    (25, 710, 876, 167), # Service Brakes + Parking Brake ← COMBINES TWO
    (26, 877, 925, 49),  # Pneumatic Brakes
    (27, 926, 947, 22),  # Steering System
    (28, 948, 966, 19),  # Steering LS7F
    (29, 967, 981, 15),  # Power steering pump
    (30, 982, 1016, 35), # Advanced Electrical
    (31, 1017, 1030, 14), # Electrical Wiring
    (32, 1031, 1036, 6),  # Advanced Electrical system
    (33, 1037, 1041, 5),  # PTO shafts
    (34, 1042, 1051, 10), # Hydraulic system
    (35, 1052, 1074, 23), # Intermediate transmission
    (36, 1075, 1094, 20), # Raising/lowering cab
    (37, 1095, 1124, 30), # Body structure
    (38, 1125, 1185, 61), # Auxiliary batteries/heater
]

# TRANSLATION TABLE entries (as stated in CSV)
translation_table = [
    # (section_code, section_title, start_page, end_page, chapter_pdf)
    ("01", "General Information", 5, 16),
    ("02", "Engine Overview", 17, 82),
    ("07", "Fuel System", 85, 118),
    ("09", "Air Filter System", 121, 133),
    ("08", "Exhaust System", 136, 144),
    ("05", "Lubrication System", 146, 156),
    ("06", "Cooling System", 159, 162),  # ← **WRONG! Should be 159-173**
    ("25", "Clutch System", 163, 182),    # ← **WRONG! Should be 179-185+ (but split across sections)**
    ("09", "Manual Transmission", 183, 270),
    ("10", "Transfer Case", 281, 330),
    ("11", "PTO Systems", 341, 355),
    ("40", "Wheels Prop Shafts", 361, 375),
    ("33", "Front Axle", 381, 410),
    ("35", "Rear Axle", 421, 450),
    ("29", "Pedal Linkage", 450, 464),
    ("12", "Front Axle Drive", 468, 515),
    ("13", "Rear Axle Drive", 521, 550),
    ("19", "Front Wheel Hubs", 555, 568),
    ("32", "Front Suspension", 569, 595),
    ("17", "Rear Suspension", 601, 640),
    ("22", "Rear Wheel Hubs", 651, 660),
    ("23", "Service Brakes", 681, 770),
    ("24", "Parking Brake", 781, 795),
    ("25", "Main Hydraulics", 801, 840),
    ("43", "Pneumatic Brakes", 851, 890),
    ("18", "Steering System", 911, 930),
    ("46", "Steering LS7F", 948, 965),
    ("14", "Electrical Wiring", 990, 1022),
    ("32", "Advanced Electrical", 1026, 1039),
    ("29", "HVAC Heating", 1041, 1065),
    ("27", "Cab Structure", 1071, 1098),
    ("42", "Hydraulic Mechanical Brakes", 1101, 1127),
    ("41", "Eberspacher Heater", 1152, 1183),
]

print("=" * 120)
print("TRANSLATION TABLE AUDIT REPORT")
print("=" * 120)
print()

# Find discrepancies
print("SECTIONS WITH INCORRECT PAGE RANGES:")
print("-" * 120)

corrections_needed = []

for section in translation_table:
    code, title, start, end = section
    actual_range = f"{start}-{end} ({end - start + 1} pages)"

    # Check if this range matches any actual section
    matches = [ab for ab in actual_boundaries if ab[1] == start or ab[2] == end]

    if not matches:
        status = "🔴 NO MATCH"
        correction = f"NEEDS INVESTIGATION"
        corrections_needed.append((code, title, start, end, "NO MATCH"))
    else:
        # Check if end pages match
        match_end_pages = [ab for ab in matches if ab[2] == end]
        if match_end_pages:
            status = "✅ OK"
        else:
            # Find closest match
            match = matches[0]
            actual_end = match[2]
            status = f"🔴 WRONG END PAGE"
            correction = f"Should be {start}-{actual_end} ({actual_end - start + 1} pages)"
            corrections_needed.append((code, title, start, end, f"{start}-{actual_end}"))

            print(f"{code:5s} | {title:30s} | Claims: {start:4d}-{end:4d} | {correction}")

print()
print("=" * 120)
print(f"FOUND {len(corrections_needed)} CORRECTIONS NEEDED")
print("=" * 120)
print()

# Critical corrections
print("CRITICAL CORRECTIONS (Affecting Barry PDF links):")
print("-" * 120)

critical_items = [
    ("06", "Cooling System", 159, 162, 173),  # Radiator removal is in pages 170-171!
    ("25", "Clutch System", 163, 182, "CHECK"),  # Claims pages that belong to other sections
]

for code, title, claimed_start, claimed_end, actual_end in critical_items:
    if claimed_end != actual_end:
        print(f"⚠️  {code}: {title}")
        print(f"    Claimed: pages {claimed_start}-{claimed_end}")
        if actual_end != "CHECK":
            print(f"    Correct: pages {claimed_start}-{actual_end}")
        print()

print()
print("=" * 120)
