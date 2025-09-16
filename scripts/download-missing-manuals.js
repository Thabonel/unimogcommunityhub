#!/usr/bin/env node

/**
 * Download Missing Unimog Manuals from AFS Database
 *
 * This script helps download the missing manuals from afmsafety.com.au
 * to complete our knowledge base coverage.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Missing manuals we need to download
const MISSING_MANUALS = {
  "UNI4X4_ALL_TYPES": [
    { id: "G617-2", name: "Coolant Header Tank Modification.PDF" },
    { id: "G617-13", name: "Tray Seat Legs Modification.PDF" }
  ],

  "UNI4X4_CARGO": [
    { id: "G602", name: "Technical Description.PDF" },
    { id: "G607-6", name: "Centre Seating.PDF" },
    { id: "RPS-02155", name: "Repair Parts Scale.PDF" }
  ],

  "UNI4X4_CARGO_CRANE": [
    { id: "G620", name: "Data Summary.PDF" },
    { id: "G622", name: "Technical Description.PDF" },
    { id: "G623", name: "Light Grade Repair.PDF" },
    { id: "G624", name: "Medium Grade Repair.PDF" },
    { id: "G624-1", name: "Heavy Grade Repair.PDF" },
    { id: "G627-2", name: "Hydraulic Control Valves.PDF" },
    { id: "G627-3", name: "Inner Boom Rust.PDF" },
    { id: "G627-4", name: "Crane Pressure Gauge and Lockout Circuit Modification.PDF" },
    { id: "RPS-02157", name: "Repair Parts Scale.PDF" },
    { id: "UHB-CRANE", name: "User Handbook.PDF" }
  ],

  "UNI4X4_VARIANTS": [
    { id: "RPS-02205", name: "Repair Parts Scale - Cargo W/ Crane W/ Twist Locks.PDF" },
    { id: "RPS-02202", name: "Repair Parts Scale - Cargo W/ Twist Locks.PDF" },
    { id: "RPS-02156", name: "Repair Parts Scale - Cargo W/ Winch.PDF" },
    { id: "RPS-02204", name: "Repair Parts Scale - Cargo W/ Winch W/ Twist Locks.PDF" },
    { id: "G637-1", name: "Tailgate Top Hinge.PDF" },
    { id: "G630", name: "Data Summary - Dump W/Winch.PDF" },
    { id: "G632", name: "Technical Description - Dump W/Winch.PDF" },
    { id: "G633", name: "Light Repair Supplement - Dump W/Winch.PDF" },
    { id: "G634", name: "Medium Repair Supplement - Dump W/Winch.PDF" },
    { id: "G637-3", name: "Engineers Tool Cage.PDF" },
    { id: "G639-1", name: "Fitment of A Replacement Hyva Hoist Control Valve.PDF" },
    { id: "RPS-02158", name: "Repair Parts Scale - Dump W/Winch.PDF" },
    { id: "G652", name: "Technical Description - UL1750 RAAF.PDF" }
  ],

  "UNI6X6_RECOVERY": [
    { id: "UNI6X6-LIGHT", name: "Light Repair#2.PDF" },
    { id: "UNI6X6-MED-VOL1", name: "Medium Repair Vol 1#2.PDF" },
    { id: "UNI6X6-MED-VOL2", name: "Medium Repair Vol 2#2.PDF" },
    { id: "UNI6X6-MED-VOL3", name: "Medium Repair Vol 3#2.PDF" },
    { id: "UNI6X6-MED-VOL4", name: "Medium Repair Vol 4#2.PDF" },
    { id: "UNI6X6-MED-VOL5", name: "Medium Repair Vol 5#2.PDF" },
    { id: "UNI6X6-MED-VOL6", name: "Medium Repair Vol 6#2.PDF" },
    { id: "UNI6X6-MED-VOL7", name: "Medium Repair Vol 7#2.PDF" },
    { id: "UNI6X6-MED-VOL8", name: "Medium Repair Vol 8#2.PDF" },
    { id: "UNI6X6-MED-VOL9", name: "Medium Repair Vol 9#2.PDF" },
    { id: "UNI6X6-MED-VOL10", name: "Medium Repair Vol 10#2.PDF" },
    { id: "UNI6X6-MED-VOL11", name: "Medium Repair Vol 11#2.PDF" },
    { id: "UNI6X6-SERVICE", name: "Service Instruction#2.PDF" },
    { id: "RPS-02229-1", name: "Repair Parts Scale Part1.PDF" },
    { id: "RPS-02229-2", name: "Repair Parts Scale Part2.PDF" },
    { id: "UHB-6X6", name: "User Handbook#2.PDF" }
  ]
};

// Create downloads directory
const DOWNLOAD_DIR = path.join(__dirname, '..', 'downloads', 'manuals');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

console.log('🎯 Unimog Manual Download Helper');
console.log('==================================');
console.log('');
console.log('📍 AFS Database URL: https://afmsafety.com.au/safety/termsandconditions/database/#UNI4X4CARGOWC');
console.log('📁 Download Directory:', DOWNLOAD_DIR);
console.log('');

// Count totals
let totalMissing = 0;
Object.values(MISSING_MANUALS).forEach(category => {
  totalMissing += category.length;
});

console.log(`📊 Missing Manuals Summary:`);
console.log(`   • All Types: ${MISSING_MANUALS.UNI4X4_ALL_TYPES.length} documents`);
console.log(`   • Cargo: ${MISSING_MANUALS.UNI4X4_CARGO.length} documents`);
console.log(`   • Cargo w/ Crane: ${MISSING_MANUALS.UNI4X4_CARGO_CRANE.length} documents`);
console.log(`   • Variants: ${MISSING_MANUALS.UNI4X4_VARIANTS.length} documents`);
console.log(`   • 6×6 Recovery: ${MISSING_MANUALS.UNI6X6_RECOVERY.length} documents`);
console.log(`   📈 Total Missing: ${totalMissing} documents`);
console.log('');

console.log('🔧 Next Steps:');
console.log('1. Visit the AFS database URL above');
console.log('2. Navigate to each Unimog section');
console.log('3. Download the missing PDFs listed below');
console.log('4. Save them to the downloads directory');
console.log('5. Upload through the admin interface at /admin → Manuals tab');
console.log('');

console.log('📋 Priority Download Order:');
console.log('');

// Print priority download list
console.log('🚨 HIGH PRIORITY (Core Technical References):');
Object.entries(MISSING_MANUALS).forEach(([category, manuals]) => {
  if (category === 'UNI4X4_CARGO' || category === 'UNI4X4_CARGO_CRANE') {
    console.log(`\n${category.replace(/_/g, ' ')}:`);
    manuals.forEach(manual => {
      console.log(`   • ${manual.id}: ${manual.name}`);
    });
  }
});

console.log('\n📖 MEDIUM PRIORITY (Complete Missing Category):');
console.log(`\nUNI6X6 RECOVERY (Complete 16-document series):`);
MISSING_MANUALS.UNI6X6_RECOVERY.forEach(manual => {
  console.log(`   • ${manual.id}: ${manual.name}`);
});

console.log('\n📑 LOWER PRIORITY (Specialized Documents):');
Object.entries(MISSING_MANUALS).forEach(([category, manuals]) => {
  if (category === 'UNI4X4_ALL_TYPES' || category === 'UNI4X4_VARIANTS') {
    console.log(`\n${category.replace(/_/g, ' ')}:`);
    manuals.forEach(manual => {
      console.log(`   • ${manual.id}: ${manual.name}`);
    });
  }
});

console.log('\n✅ After downloading, upload via: http://localhost:3000/admin → Manuals tab');
console.log('🤖 The system will automatically process and add to Barry AI\'s knowledge base');