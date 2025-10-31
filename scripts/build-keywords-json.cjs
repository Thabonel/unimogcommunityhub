const fs = require('fs');
const path = require('path');

const u435Keywords = ["4wd engagement","adjustment","air brake","air brake compressor","air brake service","air brake valves","air cleaner","air cleaner service","air compressor","air compressor maintenance","air filter","air filter maintenance","air filter replacement","air filter service","air intake system","air lines","air pressure regulator","air pump","air tanks","alignment procedure","alternator 90a","auxiliary heater","auxiliary load brake","axle loads","axle maintenance","battery","battery 12v","battery cables","battery maintenance","battery service","belt","belt system","belt tension","blower motor","body","body components","body maintenance","body panel","body panel maintenance","bolt specifications","boost pressure","bore measurement","brake adjustment","brake air tanks","brake backplate front","brake bleeding","brake booster","brake calipers","brake chambers","brake compressor","brake control","brake control cable","brake diagrams","brake discs","brake equipment adjustment","brake fluid","brake fluid bleeding","brake hoses","brake inspection","brake lines","brake maintenance","brake master cylinder","brake pads","brake pedal","brake pedal linkage","brake pressure test","brake proportioning valve","brake service","brake system","brake system diagram","cab","cab maintenance","cab mounting","camshaft","center bearing","check","climbing ability","clutch","clutch adjustment","clutch bleeding","clutch disc","clutch hydraulics","clutch maintenance","clutch master cylinder","clutch pedal","clutch plate","clutch release bearing","clutch service","clutch slave cylinder","clutch system","cold start system","combustion air fan","compressed air","compressed air system","compression ratio","compressor","compressor service","connecting rods","connector terminals","control linkage","control systems","coolant","coolant check","coolant level","coolant level check","coolant pump","coolant replacement","coolant service","cooling","cooling maintenance","cooling system","cooling system maintenance","crankcase assembly","crankshaft","cylinder bores diagnosis","cylinder head","cylinder head cover","defroster","differential","differential lock","diff lock front","diff lock rear","door","door locks","door maintenance","door mechanisms","drag link","drive belt","drive belts","driveline angles","driveshaft","drive shaft maintenance","eberspacher v7s","electrical equipment","electrical harness","electrical maintenance","electrical system","electrical system 54.7","emergency brake","engine components","engine dimensions","engine housing","engine installation","engine lubrication","engine maintenance","engine mount","engine mounting","engine oil","engine om366","engine overview","engine removal installation","engine service","engine specifications","engine timing","engine tools list","equipment venting pressure","exhaust","exhaust brake","exhaust manifold","exhaust pipe","exhaust pipe gasket heater","exhaust system","exploded view engine","filling capacities","filter","fixed brake caliper front","flow limiting valve","fluid specifications","flywheel","foot brakes","front axle","front axle differential","front axle housing","front axle maintenance","front axle shafts","front brake disc","front CV joints","front diff","front differential","front diff lock","front diff oil","front hub assembly","front hub bearing","front hub bearings","front hub disassembly","front hub oil level","front hub reduction","front hub seal replacement","front hub torque specs","front portal gears","front portal hub seals","front ring and pinion","front shock absorbers","front shocks","front springs","front stabilizer bar","front suspension","front wheel bearings","front wheel drive","front wheel hub drive","front wheel hub oil","fuel feed pump heater","fuel filter","fuel injection","fuel injection pump","fuel injector","fuel injector maintenance","fuel injectors","fuel lines","fuel pump","fuel system","fuel system filter","fuel system maintenance","fuel tank","functional diagrams","fuses","gauges","gear box","gearbox","gearbox maintenance","gear ratios","gear shift mechanism","general information","general maintenance","general specifications","governor","hand brake","handbrake adjustment","harness protection","harness routing","head gasket","headlight maintenance","heater controls","heater control unit","heater core","heater flame sensor","heater glow plug","heater maintenance","heater solenoid valve","heater timer","heat exchanger burner","heating system","high low range","honing procedure","hood","hydraulic brake","hydraulic brake maintenance","hydraulic brakes","hydraulic brake system","hydraulic cylinders","hydraulic equipment","hydraulic equipment maintenance","hydraulic oil","hydraulic pump","hydraulic service","hydraulic steering","hydraulic system","hydraulic system maintenance","hydraulic valves","injection timing","injector","injectors","injector service","injector testing","input shaft","inspection","installation procedure","installation survey","instruments","intake filter","intake manifold","interior maintenance","layshaft","linkage adjustment","lubrication check","lubrication filter","lubrication maintenance","lubrication system","main bearings","main brakes","maintenance","manual transmission","maximum speeds","mechanical brake","mechanical brake maintenance","mirrors","mount maintenance","muffler","oil capacity","oil change","oil check","oil circulation","oil cooler","oil filter","oil level","oil level check","oil maintenance","oil pan","oil pressure","oil pump","oil service","oil specifications","oil system","overhaul procedures","overheat switch","park brake","parking brake","parking brake cable","parking brake drum","pedal","pedal linkage","performance diagram","piston rings","pistons","pneumatic brake","pneumatic brake maintenance","pneumatic brake system","pneumatic brake troubleshooting","pneumatic compressor","pneumatic symbols","pneumatic system","portal axle front","portal axle rear","portal hub front","portal hub rear","power output","power steering","power steering preparation","power steering pump 7672","power steering pump 7673","power take off","pressure plate","preventive maintenance","procedure","prop shaft maintenance","pto engagement","pto shaft","pto speeds","pump overhaul","pump pressure test","pump specifications","radiator","radiator check","radiator maintenance","rear axle","rear axle differential","rear axle housing","rear axle maintenance","rear axle shafts","rear diff","rear differential","rear diff lock","rear diff oil","rear hub assembly","rear hub disassembly","rear hub oil level","rear hub reduction","rear hub seal replacement","rear hub torque specs","rear portal gears","rear portal hub seals","rear ring and pinion","rear shock absorbers","rear shocks","rear springs","rear stabilizer bar","rear suspension","rear wheel bearings","rear wheel hub drive","rear wheel hub oil","rebuild specifications","reconditioning engine","relays","removal procedure","routine maintenance","safety","scheduled maintenance","seat","seat maintenance","seats","service","service brakes","service products capacities","shock absorber","slack adjusters","solenoid","special tools engine","spring","spring brake gaiter","spring brake renewal","starter motor","steering","steering 765.305","steering adjustment","steering box","steering column preparation","steering components","steering damper","steering inspection","steering linkage","steering ls7f","steering maintenance","steering oil","steering preparation","steering pump","steering pump preparation","steering service","steering wheel","suspension","suspension front","suspension inspection","suspension maintenance","suspension rear","suspension service","switches","synchromesh","technical data engine","temperature sensor heater","thermostat","throttle linkage","tie rod ends","tightening torques","timing adjustment","timing maintenance","tire pressure","torque curve","torque sequence","torque tube","trans","transfer case","transfer case oil","transmission","transmission installation","transmission maintenance","transmission oil","transmission overhaul","transmission removal","transmission service","turbocharger","turning radius","universal joints","valve adjustment","valve train","vehicle dimensions","vehicle identification","ventilation","voltage regulator","warning lights","water pump","wear limits","weights trailer loads","wheel alignment","wheel hub drive front","wheel hub drive rear","wheel maintenance","wheel nuts torque","wheels","wheels and tires","wheel specifications","window","window maintenance","windows","windshield","wire colors","wiring diagram","wiring harness","worm and nut preparation","zf 7672","zf 7673","zf pump preparation"];

const rpsGroupNames = ["CRANKCASE AND COVER TIMING CASE","CRANKSHAFT AND BEARINGS","PISTONS, CONRODS AND BEARINGS","EXHAUST MANIFOLD, GASKETS AND FITTINGS","ENGINE EXHAUST BRAKE, CONTROLS AND FITTINGS","ENGINE OIL FILTER ASSEMBLY","ACCESSORY DRIVES, TACHOMETER PULSE GENERATOR AND FLEX DRIVE SHAFT","ENGINE COVERS, SUMP PAN, OIL SEPARATOR, GASKETS AND FITTINGS","ENGINE SUPPORT BRACKETS AND MOUNTS","HEADER TANK, BRACKET, LINES AND FITTINGS","ENGINE COOLING FAN, SUPPORT BRACKET AND PULLEY","THERMOSTAT HOUSING AND WATER MANIFOLD","WATER PUMP, PULLEY AND BELT","ENGINE OIL COOLER, FILTER AND COVER","MUFFLER, PIPES AND MOUNTINGS","FUEL TANK, SENDER UNIT AND MOUNTINGS","FUEL LINES, HOSES AND FITTINGS","FUEL FILTER","FUEL SUPPLY PUMP AND HAND PRIMER","FUEL PUMP","GOVERNOR AND SMOKE LIMITER","FUEL PUMP, LINES AND CONNECTIONS","FUEL INJECTORS AND LINES","FUEL INJECTOR PUMP CONTROLS, CABIN","TURBOCHARGER, AIRESEARCH","TURBOCHARGER, KKK","AIR CLEANER ASSEMBLY, INTAKE AND CONNECTIONS","CLUTCH MASTER CYLINDER, PEDAL AND BRACKET","CLUTCH SLAVE CYLINDER AND PIPES","CLUTCH AND HOUSING","HOUSING MOUNTINGS AND SPEEDO DRIVE","INPUT GEARTRAIN AND COUNTERSHAFT","MAIN SHAFT GEARTRAIN","PLANETARY GEARTRAIN","TRANSFER GEARTRAIN","GEAR SHIFT LEVER AND LINKAGE","8 Speed Shift, Forks and Valve","FORWARD-REVERSE SHIFT, LEVER AND LINKAGE","PLANETARY SHIFTING CYLINDER AND FORK","Propeller Shafts and Universal Joints","TORQUE TUBE HOUSINGS","Rear Axle Assembly","Housing, Rear Axle","DIFFERENTIAL AND AXLE SHAFTING","HOUSING, FRONT AXLE","DIFFERENTIAL, FRONT AXLE","FRONT AXLE, DRIVE SHAFT AND C.V. JOINT, RIGHT HAND","FRONT AXLE DRIVE SHAFT, LEFT HAND","WHEEL HUB DRIVES, FRONT AXLE","WHEEL RIM","FOOT BRAKE VALVE, PEDAL AND PUSH ROD","BRAKE TREADLE VALVE, DUAL CIRCUIT (WABCO)","DUAL CIRCUIT MASTER CYLINDER","AIR COMPRESSOR, DRIVE BELT, PIPING AND MOUNTS","COMPRESSOR AIR LINES, PRESSURE REGULATOR AND FITTINGS","AIR TANKS, LINES AND AUXILIARY VALVES","HAND VALVE AND THIRD TANK","TRAILER BRAKES, CONTROL AND CONNECTION","PRESSURISATION CONTROL VALVES","HYDRAULIC BRAKE LINES AND FITTINGS","AIRLINE BRAKE PRESSURE REGULATOR VALVE","BRAKE DISCS, CALIPERS AND PADS, REAR AXLE","PARKING BRAKE CYLINDER AND FITTINGS","CHASSIS BRACKETS AND CLAMPS","PRESSURISATION AND VENTING LINES","DIFFERENTIAL LOCK VALVE, LINES AND FITTINGS","QUICK DISCONNECT COUPLING, INTER VEHICLE BRAKE SYSTEM","FRONT SPRINGS/STABILISER RODS","REAR SPRINGS/STABILISER RODS","STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","STEERING BOX ASSEMBLY","POWER STEERING PUMP AND DRIVE","POWER STEERING RESERVOIR AND PIPING","BATTERY BOX","STARTER MOTOR AND SOLENOID ASSEMBLY (EARLY MODEL)","STARTER MOTOR AND SOLENOID ASSEMBLY (LATE MODEL)","GENERATOR, ENGINE ACC. 100A, 28V D.C.","GENERATOR MOUNTS","MAIN WIRING HARNESS AND FITTINGS CAB","STOP/TAIL/REVERSING LIGHTS, CLEARANCE LIGHTS, NATO SOCKET, MOUNTS AND FITTINGS","HORN, FRONT INDICATORS AND HARNESS","INTERIOR LIGHTS AND HARNESSES","BLACKOUT LIGHTS, FRONT AND REAR","WINDSCREEN WIPER, MOTOR AND LINKAGES","WINDSCREEN WASHER","MAIN CHASSIS WIRING HARNESS, SWITCHES AND FITTINGS","INSTRUMENT GAUGES AND SWITCHES","CHASSIS FRAME ASSEMBLY","BRUSHGUARD, FRONT BUMPERS, CAB STEPS AND FITTINGS","SPARE WHEEL CARRIER","PINTLE TOW HOOK ASSEMBLY","LIFTING/TOWING AND TIE DOWN ATTACHMENTS","TOOL BOXES, JERRICAN, DEDITCHING TOOL, HOLDERS AND FITTINGS","INSTRUMENT PANEL SUBSTRUCTURE","DOOR, HINGES AND LOCKING MECHANISM","WINDOWS, SEALS AND WINDING MECHANISM","CAB ROOF, WINDSCREEN AND REAR WINDOW","CUPOLA COVER, SEAL AND FITTINGS","CAB INTERIOR FITTINGS","DRIVER'S SEAT","CO-DRIVER'S SEAT","CAB EXTERIOR FITTINGS AND REAR VISION MIRRORS","HOOD AND FENDERS","CARGO BODY","TRAY SIDES AND GUARD RAILS","BLOWER ASSEMBLY","HEATER HOSES AND FITTINGS","HEATER AND VENT CONTROLS AND SHIFT POSITION INDICATOR"];

const stopwords = new Set(['a','an','and','the','or','of','to','in','for','with','on','at','by','from','as','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','should','can','could','may','might','must','shall','it','its','this','that','these','those','some','any','all','each','every','no','not','also','use','assy','c/w','rh','lh','includes','part','early','late','model']);

const MIN_LENGTH = 3;

function parseText(text) {
  return text
    .toLowerCase()
    .replace(/[,()\/]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= MIN_LENGTH && !stopwords.has(word) && !/^\d+$/.test(word));
}

function extractPhrases(text) {
  const phrases = [];
  const normalized = text.toLowerCase().trim();

  const twoWords = normalized.match(/\b(\w+\s+\w+)\b/g);
  if (twoWords) {
    phrases.push(...twoWords.filter(p => {
      const words = p.split(' ');
      return words.every(w => w.length >= MIN_LENGTH && !stopwords.has(w));
    }));
  }

  const threeWords = normalized.match(/\b(\w+\s+\w+\s+\w+)\b/g);
  if (threeWords) {
    phrases.push(...threeWords.filter(p => {
      const words = p.split(' ');
      return words.every(w => w.length >= MIN_LENGTH && !stopwords.has(w));
    }));
  }

  return phrases;
}

const allKeywords = new Set();

console.log('Processing u435_manual_index keywords...');
u435Keywords.forEach(kw => allKeywords.add(kw.toLowerCase()));
console.log(`  Added ${u435Keywords.length} keywords`);

console.log('Parsing RPS group names...');
let groupWordsAdded = 0;
rpsGroupNames.forEach(name => {
  parseText(name).forEach(word => {
    allKeywords.add(word);
    groupWordsAdded++;
  });
  extractPhrases(name).forEach(phrase => {
    allKeywords.add(phrase);
    groupWordsAdded++;
  });
});
console.log(`  Parsed ${rpsGroupNames.length} group names, extracted ${groupWordsAdded} keywords`);

const criticalPartKeywords = [
  'accelerator', 'axle housing', 'bearing', 'bracket', 'bushing', 'cable', 'caliper',
  'cap', 'carrier', 'clamp', 'collar', 'conrod', 'coupling', 'cylinder', 'disc',
  'elbow', 'fitting', 'flange', 'floor', 'floor pan', 'floorpan', 'fork', 'gasket',
  'gear', 'hose', 'hub', 'kingpin', 'lever', 'linkage', 'manifold', 'mount',
  'nut', 'o-ring', 'pedal', 'peddle', 'pin', 'pinion', 'piston', 'pitman arm',
  'pivot', 'plate', 'propshaft', 'pulley', 'ring', 'rod', 'seal', 'shaft',
  'shim', 'spacer', 'spring', 'stud', 'sump', 'swivel', 'tappet', 'tie rod',
  'tube', 'union', 'valve', 'washer', 'yoke'
];

console.log('Adding critical part keywords...');
criticalPartKeywords.forEach(kw => allKeywords.add(kw));
console.log(`  Added ${criticalPartKeywords.length} critical part keywords`);

const sortedKeywords = Array.from(allKeywords).sort();

const result = {
  keywords: sortedKeywords,
  metadata: {
    extracted_at: new Date().toISOString(),
    total_count: sortedKeywords.length,
    sources: {
      u435_terms: u435Keywords.length,
      rps_groups_parsed: groupWordsAdded,
      critical_parts_manual: criticalPartKeywords.length
    },
    version: '1.0.0'
  }
};

const outputPath = path.join(__dirname, '..', 'supabase', 'functions', 'chat-with-barry-agentic', 'routing-keywords.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`\nTotal unique keywords: ${sortedKeywords.length}`);
console.log(`Keywords saved to: ${outputPath}`);
console.log('\nSample keywords:');
sortedKeywords.slice(0, 30).forEach(k => console.log(`  - ${k}`));
console.log('  ...');
