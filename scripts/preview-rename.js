#!/usr/bin/env node

// Preview what the renamed files will look like
const pendingFiles = [
  "pending_1755567653262_rcevxzudivc_UHB-Unimog-Cargo Manual.pdf",
  "pending_1758512873087_zqwm4uvsri_00 - General.pdf",
  "pending_1758512886616_fc3da13fud_0 - Foreward.pdf",
  "pending_1758512887823_28er8jxil9h_01 - Engine Housing.pdf",
  "pending_1758512891665_i21gq9mvquf_05 - Engine Timing.pdf",
  "pending_1758512895090_gk2gp5omnhl_07 - Fuel Injectors.pdf",
  "pending_1758512898538_5dc7m86ogor_09 - Air Filter.pdf",
  "pending_1758512902271_3p6zaz9wxac_13 - Air Compressor + Belts.pdf",
  "pending_1758512908059_2r1t0s73575_18 - Engine Lubrication.pdf",
  "pending_1758512910882_4mq6j4licc6_24 - Engine Mounts.pdf",
  "pending_1758512913741_vq2iv94t2nq_25 - Clutch.pdf",
  "pending_1758512916666_qzwpjsds6xp_26 - Transmission.pdf",
  "pending_1758512920518_kztwbczw2q_29 - Pedal Linkage.pdf",
  "pending_1758512923425_a191n3f3z4j_31 - Frame.pdf",
  "pending_1758512926227_0zt5owmtde_32 - Suspension.pdf",
  "pending_1758512929514_at0v3yj3gzk_33 - Front Axle.pdf",
  "pending_1758512933466_ny3i10ap94f_35 - Rear Axle.pdf",
  "pending_1758512936154_uc2z981u54c_40 - Wheels + Prop Shafts.pdf",
  "pending_1758512939097_ygc5hn395_42 - Brakes - Hydraulic + Mechanical.pdf",
  "pending_1758512944815_7xf41ccsep5_43 - Brakes - Pneumatic.pdf",
  "pending_1758512947543_ozh6rmsp0w8_46 - Steering.pdf",
  "pending_1758512951113_9azu9wgiwn_49 - Exhaust.pdf",
  "pending_1758512954455_fnsgg27e1h4_50 - Cooling System.pdf",
  "pending_1758512957890_7ru1xlqzo99_54 - Batteries.pdf",
  "pending_1758512961227_loue51m4nb9_55 - Special Equipment.pdf",
  "pending_1758512965163_o19skf18au_60 - Body.pdf",
  "pending_1758512967750_gua9nlxq1m7_82 - Headlights.pdf",
  "pending_1758522195620_ga1kxd8trta_Unimog435sm.pdf",
  "pending_1758524857620_kutm58jzorb_Unimog435sm.pdf",
  "pending_1758576548880_ulvltbjzqp9_Unimog435sm.pdf"
];

function cleanFileName(originalName) {
  if (!originalName.startsWith('pending_')) {
    return originalName;
  }

  // Split by underscores and take everything after the third underscore
  const parts = originalName.split('_');
  if (parts.length >= 4) {
    return parts.slice(3).join('_');
  }

  return originalName.replace('pending_', '');
}

console.log('📋 PREVIEW: How files will be renamed:\n');
console.log('OLD NAME → NEW NAME\n');
console.log('=' * 80 + '\n');

pendingFiles.forEach(oldName => {
  const newName = cleanFileName(oldName);
  console.log(`${oldName}`);
  console.log(`  → ${newName}\n`);
});

console.log(`\n📊 Summary: ${pendingFiles.length} files will be renamed`);
console.log(`\n🎯 Result: Clean, readable filenames without "pending_" prefix`);