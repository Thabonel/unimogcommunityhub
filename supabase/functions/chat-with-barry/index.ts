import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client with service role key for full access
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Comprehensive U435/U1700L Manual Index - All 63 Sections
const manualIndex = {
  // Volume 1 - General and Powertrain (Pages 1-467)
  'general information': { page: 5, partId: 1, section: 'General Information', keywords: ['general', 'specifications', 'overview', 'data'] },
  'engine overview': { page: 17, partId: 2, section: 'Engine System Overview', keywords: ['engine', 'om366', 'overview', 'specifications'] },
  'cylinder head': { page: 51, partId: 3, section: 'Cylinder Head System', keywords: ['cylinder', 'head', 'valve', 'timing', 'repair'] },
  'engine block': { page: 89, partId: 4, section: 'Engine Block System', keywords: ['engine', 'block', 'pistons', 'crankshaft'] },
  'engine lubrication': { page: 127, partId: 5, section: 'Engine Lubrication System', keywords: ['oil', 'lubrication', 'pump', 'filter', 'maintenance'] },
  'cooling system': { page: 145, partId: 6, section: 'Cooling System', keywords: ['cooling', 'radiator', 'thermostat', 'coolant'] },
  'fuel system': { page: 163, partId: 7, section: 'Fuel System', keywords: ['fuel', 'injection', 'pump', 'diesel'] },
  'exhaust system': { page: 201, partId: 8, section: 'Exhaust System', keywords: ['exhaust', 'manifold', 'emissions'] },
  'manual transmission': { page: 215, partId: 9, section: 'Manual Transmission System', keywords: ['transmission', 'gearbox', 'clutch', 'manual'] },
  'transfer case': { page: 259, partId: 10, section: 'Transfer Case System', keywords: ['transfer', 'case', 'differential', '4wd'] },
  'pto systems': { page: 293, partId: 11, section: 'PTO Systems', keywords: ['pto', 'power', 'takeoff', 'hydraulic'] },
  'front axle': { page: 327, partId: 12, section: 'Front Axle Drive', keywords: ['front', 'axle', 'differential', 'portal'] },
  'rear axle': { page: 365, partId: 13, section: 'Rear Axle Drive', keywords: ['rear', 'axle', 'differential', 'portal'] },
  'wiring system': { page: 403, partId: 14, section: 'Wiring System', keywords: ['electrical', 'wiring', 'harness', 'connectors'] },
  'instruments': { page: 441, partId: 15, section: 'Instruments System', keywords: ['instruments', 'gauges', 'dashboard', 'display'] },

  // Volume 2 - Chassis and Body (Pages 468-1185)
  'chassis frame': { page: 468, partId: 16, section: 'Chassis Frame System', keywords: ['chassis', 'frame', 'structure', 'mounting'] },
  'suspension': { page: 485, partId: 17, section: 'Suspension System', keywords: ['suspension', 'springs', 'shock', 'absorbers'] },
  'steering system': { page: 519, partId: 18, section: 'Steering System', keywords: ['steering', 'wheel', 'column', 'power', 'assist'] },

  // Critical Portal Hub Procedures (Page 555 & 651 - Actual Manual Procedures)
  'portal hub front': { page: 555, partId: 19, section: 'Front Wheel Hub Drive (Section 6.1/1)', keywords: ['wheel', 'hub', 'drive', 'front', 'portal', 'bearing', 'seal', 'disassembly', 'assembly'] },
  'front portal hub': { page: 555, partId: 19, section: 'Front Portal Hub Drive (Section 6.1/1)', keywords: ['front', 'portal', 'hub', 'wheel', 'drive', 'seal', 'bearing'] },
  'wheel hub front': { page: 555, partId: 19, section: 'Front Wheel Hub System (Section 6.1/1)', keywords: ['wheel', 'hub', 'front', 'drive', 'portal', 'seal'] },
  'front hub seals': { page: 555, partId: 19, section: 'Front Hub Seal Replacement (Section 6.1/1)', keywords: ['front', 'hub', 'seal', 'seals', 'replacement', 'portal', 'wheel'] },
  'portal hub seals': { page: 555, partId: 19, section: 'Portal Hub Seal Procedures (Section 6.1/1)', keywords: ['portal', 'hub', 'seal', 'seals', 'front', 'rear', 'replacement'] },
  'hub seal replacement': { page: 555, partId: 19, section: 'Hub Seal Replacement Procedure (Section 6.1/1)', keywords: ['hub', 'seal', 'replacement', 'procedure', 'portal', 'wheel'] },
  'change portal hub seals': { page: 555, partId: 19, section: 'Change Portal Hub Seals (Section 6.1/1)', keywords: ['change', 'portal', 'hub', 'seals', 'replacement', 'procedure'] },
  'hub components': { page: 587, partId: 20, section: 'Hub Components System', keywords: ['hub', 'components', 'bearing', 'seal', 'assembly'] },
  'hub maintenance': { page: 615, partId: 21, section: 'Hub Maintenance System', keywords: ['maintenance', 'service', 'lubrication', 'inspection'] },
  'portal hub rear': { page: 651, partId: 22, section: 'Rear Wheel Hub Drive (Section 6.1/1)', keywords: ['wheel', 'hub', 'drive', 'rear', 'portal', 'disassembly', 'seal', 'bearing'] },
  'rear portal hub': { page: 651, partId: 22, section: 'Rear Portal Hub Drive (Section 6.1/1)', keywords: ['rear', 'portal', 'hub', 'wheel', 'drive', 'seal'] },
  'wheel hub rear': { page: 651, partId: 22, section: 'Rear Wheel Hub System (Section 6.1/1)', keywords: ['wheel', 'hub', 'rear', 'drive', 'portal', 'seal'] },
  'rear hub seals': { page: 651, partId: 22, section: 'Rear Hub Seal Replacement (Section 6.1/1)', keywords: ['rear', 'hub', 'seal', 'seals', 'replacement', 'portal', 'wheel'] },

  // Brake Systems
  'service brakes': { page: 687, partId: 23, section: 'Service Brake System', keywords: ['brakes', 'service', 'hydraulic', 'disc', 'drum'] },
  'wheels tires': { page: 705, partId: 23, section: 'Wheels and Tires System', keywords: ['wheels', 'tires', 'tire', 'pressure', 'fitting', 'track'] },
  'hydraulic brakes 42.11': { page: 710, partId: 23, section: 'Hydraulic Brake System 42.11', keywords: ['brakes', 'hydraulic', 'brake', 'pads', 'caliper', 'fixed', 'alb', 'modulator'] },
  'parking brake': { page: 723, partId: 24, section: 'Parking Brake System', keywords: ['parking', 'brake', 'handbrake', 'mechanical'] },
  'hydraulic brakes 42.14': { page: 755, partId: 24, section: 'Hydraulic Brake System 42.14', keywords: ['brakes', 'hydraulic', 'brake', 'pads', 'caliper', 'fixed', 'alb', 'modulator', 'circuit'] },

  // Hydraulics and Pneumatics
  'main hydraulics': { page: 759, partId: 25, section: 'Main Hydraulic System', keywords: ['hydraulic', 'pump', 'cylinder', 'valve'] },
  'pneumatic brakes': { page: 793, partId: 25, section: 'Pneumatic Brake System', keywords: ['brakes', 'pneumatic', 'air', 'compressed', 'spring', 'brake', 'gaiter', 'venting'] },
  'auxiliary hydraulics': { page: 795, partId: 26, section: 'Auxiliary Hydraulic System', keywords: ['auxiliary', 'hydraulic', 'implements', 'attachments'] },

  // Body and Cab Systems
  'cab structure': { page: 831, partId: 27, section: 'Cab Structure System', keywords: ['cab', 'body', 'structure', 'mounting'] },
  'doors windows': { page: 867, partId: 28, section: 'Doors and Windows System', keywords: ['doors', 'windows', 'seals', 'mechanisms'] },
  'heating system': { page: 903, partId: 29, section: 'Heating System', keywords: ['heating', 'hvac', 'climate', 'air', 'conditioning'] },

  // Steering Systems
  'steering overview': { page: 925, partId: 29, section: 'Steering Overview', keywords: ['steering', 'overview', 'power', 'pump', 'zf', 'vane'] },
  'steering 46.11': { page: 926, partId: 29, section: 'Worm and Nut Power Steering LS 3 B', keywords: ['steering', 'worm', 'nut', 'power', 'steering', 'box', 'wheel', 'alignment', 'lock'] },
  'lighting': { page: 939, partId: 30, section: 'Lighting System', keywords: ['lighting', 'headlights', 'taillights', 'work', 'lights'] },
  'steering 46.12': { page: 948, partId: 30, section: 'Worm and Nut Power Steering LS 7 F', keywords: ['steering', 'worm', 'nut', 'power', 'steering', 'box', 'wheel', 'alignment', 'linkage'] },
  'power steering pump 46.23': { page: 967, partId: 30, section: 'ZF Vane Pump 7673', keywords: ['power', 'steering', 'pump', 'zf', 'vane', '7673', 'flow', 'limiting', 'valve'] },
  'special equipment': { page: 975, partId: 31, section: 'Special Equipment System', keywords: ['implements', 'attachments', 'special', 'equipment'] },
  'power steering pump 46.24': { page: 982, partId: 31, section: 'ZF Vane Pump 7672', keywords: ['power', 'steering', 'pump', 'zf', 'vane', '7672', 'functional', 'diagram'] },

  // Electrical Systems
  'electrical system 54.7': { page: 990, partId: 31, section: 'General Electrical System', keywords: ['electrical', 'system', 'circuit', 'diagrams', 'fuses', 'bulbs', 'windscreen', 'hydrostat', 'beacon'] },
  'electrical system 54.12': { page: 1017, partId: 32, section: 'Advanced Electrical System SA35', keywords: ['electrical', 'system', 'circuit', 'diagrams', 'automatic', 'cutouts', 'sa35'] },
  'electrical system 54.13': { page: 1031, partId: 33, section: 'Box-Type Body Electrical System', keywords: ['electrical', 'system', 'circuit', 'diagrams', 'chassis', 'box', 'type', 'body', 'auxiliary', 'heater'] },

  // Final Specialty Systems
  'pto shafts': { page: 1037, partId: 34, section: 'PTO Shafts Assembly', keywords: ['pto', 'shafts', 'power', 'takeoff', 'assembly', 'sa35', '738', '739'] },
  'advanced hydraulics': { page: 1042, partId: 35, section: 'Advanced Hydraulic System', keywords: ['hydraulic', 'system', 'pump', 'tilt', 'cylinder', 'diagram', 'troubleshooting', 'sa35', '754'] },
  'hydrostat transmission': { page: 1052, partId: 36, section: 'Hydrostat Transmission System', keywords: ['hydrostat', 'transmission', 'hydromotor', 'hydropump', 'oil', 'cooler', 'bleeding', 'circuit'] },
  'driver cab tilting': { page: 1075, partId: 37, section: 'Driver Cab Tilting System', keywords: ['driver', 'cab', 'tilting', 'raising', 'lowering', 'device', 'workshop', 'sa35', '990'] },
  'box type body': { page: 1095, partId: 38, section: 'Box-Type Body System', keywords: ['box', 'type', 'body', '435.500', 'roof', 'hatch', 'entrance', 'step', 'stretcher', 'frame'] },
  'headlight system': { page: 1124, partId: 39, section: 'Headlight System', keywords: ['electrical', 'headlights', 'checking', 'adjusting', 'lights'] },
  'box body electrical': { page: 1125, partId: 39, section: 'Box-Type Body Electrical', keywords: ['electrical', 'box', 'body', 'auxiliary', 'batteries', 'protective', 'diode', 'switchover', 'relay', 'roof', 'ventilator', 'induction', 'sensor', 'alarm'] },

  // Final Heating Systems
  'basic heating': { page: 1140, partId: 40, section: 'Basic Heating System', keywords: ['heating', 'system', 'installation', 'survey', 'general', 'view', 'heating', 'unit', 'heat', 'exchanger', 'leaks', 'blower', 'motor'] },
  'auxiliary heater': { page: 1152, partId: 41, section: 'Auxiliary Heater (Eberspächer V 7 S)', keywords: ['auxiliary', 'heater', 'eberspacher', 'heating', 'system', 'switch', 'panel', 'control', 'unit', 'relay', 'float', 'switch', 'glow', 'plug', 'spark', 'generator', 'thermal', 'switch', 'suppressor', 'overheating', 'temperature', 'sensor', 'fuel', 'pump', 'solenoid', 'valve', 'combustion', 'air', 'heater', 'unit', 'exhaust', 'pipe', 'impeller', 'electric', 'motor', 'heat', 'exchanger', 'burner', 'cable', 'harness', 'box', 'type', 'body'] },
  'heat exchanger burner': { page: 1181, partId: 41, section: 'Heat Exchanger and Burner Components', keywords: ['heat', 'exchanger', 'burner', 'components', 'cover', 'glow', 'plug', 'thermal', 'switch', 'overheating', 'electrical', 'connection', 'temperature', 'sensor', 'wire', 'harness', 'ignition', 'spark', 'generator', 'suppressor', 'fuel', 'feed', 'pump', 'solenoid', 'valve', 'sealing', 'ring', 'type', 'plate', 'outer', 'jacket', 'inflow', 'outflow', 'scoop'] },

  // Common Search Terms with Aliases
  'engine': { page: 17, partId: 2, section: 'Engine Systems', keywords: ['engine', 'om366', 'motor', 'power'] },
  'transmission': { page: 215, partId: 9, section: 'Transmission Systems', keywords: ['transmission', 'gearbox', 'clutch', 'shifting'] },
  'gearbox': { page: 215, partId: 9, section: 'Gearbox Systems', keywords: ['gearbox', 'transmission', 'gears', 'shifting'] },
  'clutch': { page: 215, partId: 9, section: 'Clutch Systems', keywords: ['clutch', 'pressure', 'plate', 'disc'] },
  'brake': { page: 687, partId: 23, section: 'Brake Systems', keywords: ['brake', 'brakes', 'hydraulic', 'pneumatic'] },
  'hydraulic': { page: 710, partId: 23, section: 'Hydraulic Systems', keywords: ['hydraulic', 'pressure', 'fluid', 'pump'] },
  'steering': { page: 925, partId: 29, section: 'Steering Systems', keywords: ['steering', 'power', 'pump', 'wheel'] },
  'electrical': { page: 990, partId: 31, section: 'Electrical Systems', keywords: ['electrical', 'wiring', 'circuit', 'fuses'] },
  'axle': { page: 327, partId: 12, section: 'Axle Systems', keywords: ['axle', 'differential', 'drive', 'portal'] },
  'differential': { page: 555, partId: 19, section: 'Differential Systems', keywords: ['differential', 'lock', 'gears', 'axle'] },
  'bearing': { page: 555, partId: 19, section: 'Bearing Systems', keywords: ['bearing', 'replacement', 'wheel', 'hub'] },
  'seal': { page: 555, partId: 19, section: 'Seal Systems', keywords: ['seal', 'replacement', 'oil', 'gasket'] },
  'gasket': { page: 555, partId: 19, section: 'Gasket Systems', keywords: ['gasket', 'seal', 'replacement'] },
  'oil': { page: 127, partId: 5, section: 'Oil Systems', keywords: ['oil', 'lubrication', 'change', 'filter'] },
  'filter': { page: 86, partId: 3, section: 'Filter Systems', keywords: ['filter', 'air', 'oil', 'fuel'] },
  'pump': { page: 127, partId: 5, section: 'Pump Systems', keywords: ['pump', 'oil', 'hydraulic', 'pressure'] },
  'valve': { page: 51, partId: 3, section: 'Valve Systems', keywords: ['valve', 'timing', 'hydraulic', 'control'] },
  'torque': { page: 188, partId: 7, section: 'Torque Systems', keywords: ['torque', 'converter', 'specifications'] },
  'pressure': { page: 710, partId: 23, section: 'Pressure Systems', keywords: ['pressure', 'hydraulic', 'brake', 'system'] },
  'pto': { page: 293, partId: 11, section: 'PTO Systems', keywords: ['pto', 'power', 'takeoff', 'hydraulic'] },
  'power take off': { page: 293, partId: 11, section: 'Power Take-Off Systems', keywords: ['power', 'take', 'off', 'pto', 'hydraulic'] },
  'maintenance': { page: 615, partId: 21, section: 'Maintenance Procedures', keywords: ['maintenance', 'service', 'inspection', 'lubrication'] },
  'service': { page: 615, partId: 21, section: 'Service Procedures', keywords: ['service', 'maintenance', 'repair', 'inspection'] },
  'repair': { page: 51, partId: 3, section: 'Repair Procedures', keywords: ['repair', 'maintenance', 'service', 'replacement'] },
  'installation': { page: 17, partId: 2, section: 'Installation Procedures', keywords: ['installation', 'mounting', 'assembly', 'setup'] },
  'removal': { page: 17, partId: 2, section: 'Removal Procedures', keywords: ['removal', 'disassembly', 'dismounting'] },
  'assembly': { page: 555, partId: 19, section: 'Assembly Procedures', keywords: ['assembly', 'installation', 'mounting'] },
  'disassembly': { page: 555, partId: 19, section: 'Disassembly Procedures', keywords: ['disassembly', 'removal', 'dismounting'] }
};

// Complete manual parts data for page mapping - All 41 PDF Files
const manualParts = {
  1: { filename: 'U435_01_General.pdf', startPage: 5, endPage: 16 },
  2: { filename: 'U435_02_Engine_Overview.pdf', startPage: 17, endPage: 50 },
  3: { filename: 'U435_03_Cylinder_Head.pdf', startPage: 51, endPage: 88 },
  4: { filename: 'U435_04_Engine_Block.pdf', startPage: 89, endPage: 126 },
  5: { filename: 'U435_05_Lubrication.pdf', startPage: 127, endPage: 144 },
  6: { filename: 'U435_06_Cooling_System.pdf', startPage: 145, endPage: 162 },
  7: { filename: 'U435_07_Fuel_System.pdf', startPage: 163, endPage: 200 },
  8: { filename: 'U435_08_Exhaust_System.pdf', startPage: 201, endPage: 214 },
  9: { filename: 'U435_09_Manual_Trans.pdf', startPage: 215, endPage: 258 },
  10: { filename: 'U435_10_Transfer_Case.pdf', startPage: 259, endPage: 292 },
  11: { filename: 'U435_11_PTO_Systems.pdf', startPage: 293, endPage: 326 },
  12: { filename: 'U435_12_Front_Axle_Drive.pdf', startPage: 327, endPage: 364 },
  13: { filename: 'U435_13_Rear_Axle_Drive.pdf', startPage: 365, endPage: 402 },
  14: { filename: 'U435_14_Wiring.pdf', startPage: 403, endPage: 440 },
  15: { filename: 'U435_15_Instruments.pdf', startPage: 441, endPage: 467 },
  16: { filename: 'U435_16_Frame.pdf', startPage: 468, endPage: 484 },
  17: { filename: 'U435_17_Suspension.pdf', startPage: 485, endPage: 518 },
  18: { filename: 'U435_18_Steering.pdf', startPage: 519, endPage: 554 },
  19: { filename: 'U435_19_Wheel_Hub_Front.pdf', startPage: 555, endPage: 586 },
  20: { filename: 'U435_20_Hub_Components.pdf', startPage: 587, endPage: 614 },
  21: { filename: 'U435_21_Hub_Maintenance.pdf', startPage: 615, endPage: 650 },
  22: { filename: 'U435_22_Wheel_Hub_Rear.pdf', startPage: 651, endPage: 686 },
  23: { filename: 'U435_23_Service_Brakes.pdf', startPage: 687, endPage: 722 },
  24: { filename: 'U435_24_Parking_Brake.pdf', startPage: 723, endPage: 758 },
  25: { filename: 'U435_25_Main_Hydraulics.pdf', startPage: 759, endPage: 794 },
  26: { filename: 'U435_26_Aux_Hydraulics.pdf', startPage: 795, endPage: 830 },
  27: { filename: 'U435_27_Cab_Structure.pdf', startPage: 831, endPage: 866 },
  28: { filename: 'U435_28_Doors_Windows.pdf', startPage: 867, endPage: 902 },
  29: { filename: 'U435_29_HVAC_Heating.pdf', startPage: 903, endPage: 938 },
  30: { filename: 'U435_30_Lighting.pdf', startPage: 939, endPage: 974 },
  31: { filename: 'U435_31_Special_Equipment.pdf', startPage: 975, endPage: 1016 },
  32: { filename: 'U435_32_Advanced_Electrical.pdf', startPage: 1017, endPage: 1030 },
  33: { filename: 'U435_33_Box_Electrical.pdf', startPage: 1031, endPage: 1036 },
  34: { filename: 'U435_34_PTO_Shafts.pdf', startPage: 1037, endPage: 1041 },
  35: { filename: 'U435_35_Hydraulic_Advanced.pdf', startPage: 1042, endPage: 1051 },
  36: { filename: 'U435_36_Hydrostat_Trans.pdf', startPage: 1052, endPage: 1074 },
  37: { filename: 'U435_37_Driver_Cab_Tilt.pdf', startPage: 1075, endPage: 1094 },
  38: { filename: 'U435_38_Box_Body_System.pdf', startPage: 1095, endPage: 1123 },
  39: { filename: 'U435_39_Headlight_System.pdf', startPage: 1124, endPage: 1139 },
  40: { filename: 'U435_40_Heating_Basic.pdf', startPage: 1140, endPage: 1151 },
  41: { filename: 'U435_41_Heater_Eberspacher.pdf', startPage: 1152, endPage: 1185 }
};

// Critical page mapping function
function calculatePdfPage(originalPage: number, pdfStartPage: number): number {
  if (!pdfStartPage || originalPage < pdfStartPage) return 1;
  return originalPage - pdfStartPage + 1;
}

// Enhanced intelligent search function with comprehensive matching
function findRelevantProcedures(question: string): Array<{term: string, data: any, relevance: number}> {
  const searchTerms = question.toLowerCase().split(/\s+/).filter(term => term.length > 1);
  const results: Array<{term: string, data: any, relevance: number}> = [];

  // Synonym mapping for better search results
  const synonyms = {
    'gearbox': ['transmission', 'gears'],
    'transmission': ['gearbox', 'gears'],
    'motor': ['engine'],
    'engine': ['motor', 'om366'],
    'brakes': ['brake', 'braking'],
    'brake': ['brakes', 'braking'],
    'wheels': ['wheel', 'tire', 'tires'],
    'wheel': ['wheels', 'tire', 'tires'],
    'tires': ['tire', 'wheel', 'wheels'],
    'tire': ['tires', 'wheel', 'wheels'],
    'axles': ['axle', 'differential'],
    'axle': ['axles', 'differential'],
    'power': ['pto', 'takeoff'],
    'pto': ['power', 'takeoff'],
    'hydraulics': ['hydraulic', 'pump', 'pressure'],
    'hydraulic': ['hydraulics', 'pump', 'pressure'],
    'electrical': ['electric', 'wiring', 'wires'],
    'electric': ['electrical', 'wiring', 'wires'],
    'wiring': ['electrical', 'electric', 'wires'],
    'maintenance': ['service', 'repair', 'inspection'],
    'service': ['maintenance', 'repair', 'inspection'],
    'repair': ['maintenance', 'service', 'fix'],
    'front': ['forward', 'fore'],
    'rear': ['back', 'aft'],
    'hub': ['bearing', 'portal'],
    'portal': ['hub', 'axle'],
    'lubrication': ['oil', 'grease', 'lubricant'],
    'oil': ['lubrication', 'grease', 'lubricant']
  };

  // Expand search terms with synonyms
  const expandedTerms = new Set(searchTerms);
  for (const term of searchTerms) {
    if (synonyms[term]) {
      synonyms[term].forEach(synonym => expandedTerms.add(synonym));
    }
  }
  const allSearchTerms = Array.from(expandedTerms);

  for (const [term, data] of Object.entries(manualIndex)) {
    let relevance = 0;
    const lowerTerm = term.toLowerCase();
    const lowerQuestion = question.toLowerCase();

    // 1. Exact phrase match (highest priority - 100 points)
    if (lowerQuestion.includes(lowerTerm)) {
      relevance += 100;
    }

    // 2. Exact word sequence match (95 points)
    const termWords = lowerTerm.split(/\s+/);
    if (termWords.length > 1) {
      let sequenceMatch = true;
      for (let i = 0; i < termWords.length - 1; i++) {
        if (!allSearchTerms.includes(termWords[i]) || !allSearchTerms.includes(termWords[i + 1])) {
          sequenceMatch = false;
          break;
        }
      }
      if (sequenceMatch) {
        relevance += 95;
      }
    }

    // 3. All term words present (80 points)
    const termWordsPresent = termWords.filter(word => allSearchTerms.includes(word));
    if (termWordsPresent.length === termWords.length) {
      relevance += 80;
    }

    // 4. Section name matches (70 points)
    if (data.section && allSearchTerms.some(searchTerm =>
      data.section.toLowerCase().includes(searchTerm))) {
      relevance += 70;
    }

    // 5. Multiple keyword matches (60 points base + 10 per match)
    let keywordMatches = 0;
    for (const keyword of data.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      for (const searchTerm of allSearchTerms) {
        if (lowerKeyword === searchTerm ||
            lowerKeyword.includes(searchTerm) ||
            searchTerm.includes(lowerKeyword)) {
          keywordMatches++;
          relevance += 10;
        }
      }
    }
    if (keywordMatches >= 3) {
      relevance += 60;
    }

    // 6. Partial word matches in term (50 points)
    for (const searchTerm of allSearchTerms) {
      if (lowerTerm.includes(searchTerm)) {
        relevance += 50;
      }
    }

    // 7. Single keyword exact match (40 points)
    for (const keyword of data.keywords) {
      if (allSearchTerms.includes(keyword.toLowerCase())) {
        relevance += 40;
      }
    }

    // 8. Word boundary matches (30 points)
    const wordBoundaryRegex = new RegExp(`\\b(${allSearchTerms.join('|')})\\b`, 'gi');
    const matches = (lowerTerm + ' ' + data.section.toLowerCase()).match(wordBoundaryRegex);
    if (matches) {
      relevance += matches.length * 30;
    }

    // 9. Partial keyword matches (20 points)
    for (const keyword of data.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      for (const searchTerm of allSearchTerms) {
        if (lowerKeyword.includes(searchTerm) && lowerKeyword !== searchTerm) {
          relevance += 20;
        }
      }
    }

    // 10. Critical portal hub bonus (extra 50 points for portal hub procedures)
    if ((lowerQuestion.includes('portal') || lowerQuestion.includes('hub')) &&
        (lowerTerm.includes('portal') || lowerTerm.includes('hub'))) {
      relevance += 50;
    }

    // 11. Common procedure bonus (extra 30 points for maintenance, repair, service)
    if ((lowerQuestion.includes('maintenance') || lowerQuestion.includes('repair') || lowerQuestion.includes('service')) &&
        (lowerTerm.includes('maintenance') || lowerTerm.includes('repair') || lowerTerm.includes('service'))) {
      relevance += 30;
    }

    if (relevance > 0) {
      results.push({ term, data, relevance });
    }
  }

  // Sort by relevance (highest first), then by page number (lowest first) as tie-breaker
  return results
    .sort((a, b) => {
      if (b.relevance !== a.relevance) {
        return b.relevance - a.relevance;
      }
      return a.data.page - b.data.page;
    })
    .slice(0, 8); // Return top 8 results instead of 5
}

// Detect if question is about U435/U1700L technical procedures
function isTechnicalQuestion(question: string): boolean {
  const technicalKeywords = [
    'u435', 'u1700l', 'unimog', 'portal', 'hub', 'axle', 'differential',
    'transmission', 'engine', 'brake', 'hydraulic', 'pto', 'steering',
    'wheel', 'bearing', 'seal', 'oil', 'maintenance', 'repair', 'procedure',
    'torque', 'pressure', 'assembly', 'disassembly', 'installation',
    'removal', 'filter', 'clutch', 'cooling', 'electrical', 'wiring'
  ];

  const lowerQuestion = question.toLowerCase();
  return technicalKeywords.some(keyword => lowerQuestion.includes(keyword));
}

Deno.serve(async (req: Request) => {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Determine response mode based on question type
    const isU435Technical = isTechnicalQuestion(question);

    if (isU435Technical) {
      // Database-only mode for technical questions
      console.log('🔧 Technical question detected - using hybrid search mode');

      // Step 1: Check curated knowledge base first
      console.log('📚 Checking curated knowledge base...');
      const { data: knowledgeEntries, error: knowledgeError } = await supabaseAdmin
        .from('barry_knowledge_base')
        .select('*')
        .order('priority', { ascending: false });

      if (knowledgeError) {
        console.error('❌ Knowledge base query error:', knowledgeError);
      }

      // Check for keyword matches in curated knowledge
      let curatedMatch = null;
      if (knowledgeEntries && knowledgeEntries.length > 0) {
        const questionLower = question.toLowerCase();
        curatedMatch = knowledgeEntries.find(entry =>
          entry.question_keywords.some(keyword =>
            questionLower.includes(keyword.toLowerCase())
          )
        );
      }

      if (curatedMatch) {
        console.log('✅ Found curated knowledge match:', curatedMatch.question_keywords);
        return new Response(
          JSON.stringify({
            response: curatedMatch.barry_response_template,
            source: 'curated_knowledge',
            confidence: 0.95,
            manual_references: curatedMatch.manual_references,
            procedures: [{
              section: curatedMatch.manual_references.section || 'Manual Reference',
              page: curatedMatch.manual_references.pages?.[0] || null,
              relevance: 100
            }]
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Step 2: Fall back to existing manual index search
      console.log('📖 No curated match found, using manual index search...');
      const relevantProcedures = findRelevantProcedures(question);

      if (relevantProcedures.length === 0) {
        return new Response(
          JSON.stringify({
            response: "I don't have specific information about that procedure in the U435/U1700L manuals. Could you rephrase your question or be more specific about the component or system you're asking about?",
            source: 'database',
            procedures: []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Build response with manual references and actual procedure info
      let response = "Based on the U435/U1700L Workshop Manual, here's the exact procedure:\n\n";

      for (const procedure of relevantProcedures.slice(0, 3)) {
        const manualPart = manualParts[procedure.data.partId];
        if (manualPart) {
          const pdfPage = calculatePdfPage(procedure.data.page, manualPart.startPage);
          response += `**${procedure.data.section}** (Original Manual Page ${procedure.data.page})\n`;
          response += `📄 **PDF Reference**: ${manualPart.filename}, Page ${pdfPage}\n\n`;

          // Add specific procedure details for portal hub seals
          if (procedure.data.page === 555 && question.toLowerCase().includes('seal')) {
            response += `**Disassembly Procedure (Front Portal Hub Seals)**:\n`;
            response += `1. Remove front axle (refer to Section 2.1/1)\n`;
            response += `2. Detach wheels\n`;
            response += `3. Drain oil off wheel hub drive\n`;
            response += `4. Remove brake backplate\n`;
            response += `5. Unscrew fixed brake caliper line and bleeder line, sealing all ends\n`;
            response += `6. Follow detailed steps in manual for seal replacement\n\n`;
            response += `⚠️ **Important**: This procedure requires specific torque specifications and special tools shown in Section 6.1/1.\n\n`;
          }

          if (procedure.data.page === 651 && question.toLowerCase().includes('seal')) {
            response += `**Disassembly Procedure (Rear Portal Hub Seals)**:\n`;
            response += `1. Remove rear axle\n`;
            response += `2. Detach wheels\n`;
            response += `3. Drain oil off wheel hub drive\n`;
            response += `4. Remove brake backplate\n`;
            response += `5. Unscrew brake line at fixed caliper and seal end\n`;
            response += `6. Follow detailed steps in manual for seal replacement\n\n`;
            response += `⚠️ **Note**: Operations at left and right-hand wheel hub drives are executed in same order.\n\n`;
          }
        }
      }

      response += "**📖 Complete procedures with diagrams, torque specifications, and special tools are shown in the referenced manual sections above.**";

      return new Response(
        JSON.stringify({
          response,
          source: 'database',
          procedures: relevantProcedures.slice(0, 3).map(p => ({
            section: p.data.section,
            originalPage: p.data.page,
            pdfPage: manualParts[p.data.partId] ?
              calculatePdfPage(p.data.page, manualParts[p.data.partId].startPage) : 1,
            filename: manualParts[p.data.partId]?.filename || 'Unknown',
            relevance: p.relevance
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      // Full ChatGPT mode for general questions
      console.log('💬 General question detected - using full ChatGPT mode');

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are Barry, a friendly and knowledgeable AI mechanic assistant for the Unimog Community Hub.

For general questions (non-technical), provide helpful, conversational responses about:
- General vehicle maintenance advice
- Community discussions
- Off-road driving tips
- General automotive knowledge
- Unimog history and variants

Keep responses concise but informative. If asked about specific U435/U1700L technical procedures, direct users to ask more specific technical questions for manual references.`
            },
            {
              role: 'user',
              content: question
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      const response = openaiData.choices[0]?.message?.content || 'Sorry, I had trouble processing that question.';

      return new Response(
        JSON.stringify({
          response,
          source: 'chatgpt',
          procedures: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in chat-with-barry function:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});