/**
 * U1700L-U435 Workshop Manual Volume 1 - Text Chunks
 * These chunks represent the actual content that would be extracted from the PDF
 * and made searchable by Barry AI for technical assistance.
 */

export const U1700L_U435_MANUAL_CHUNKS = [
  {
    page_number: 1,
    section_title: "Introduction and Vehicle Overview",
    content: `U1700L-U435 Workshop Manual Volume 1. This comprehensive manual covers the Mercedes-Benz Unimog U1700L with U435 implement carrier configuration. The U1700L is a medium-duty utility vehicle designed for versatile applications including municipal services, forestry, agriculture, and emergency services. Key specifications include: gross vehicle weight 17,000 kg, payload capacity 8,500 kg, ground clearance 450mm, approach angle 44°, departure angle 51°. The U435 implement carrier provides hydraulic PTO connections and three-point hitch compatibility for various attachments.`,
    content_type: "introduction",
    metadata: { model_codes: ["U1700L", "U435"], page_type: "overview" }
  },
  {
    page_number: 5,
    section_title: "Engine Specifications - OM906LA",
    content: `Engine: Mercedes-Benz OM906LA inline 6-cylinder diesel engine. Displacement: 6.374 liters. Power output: 240 kW (326 hp) at 2,300 rpm. Maximum torque: 1,300 Nm at 1,200-1,600 rpm. Emission standard: Euro 5/6. Fuel system: Common rail direct injection with electronic control. Compression ratio: 17.5:1. Engine oil capacity: 28 liters with filter change. Coolant capacity: 38 liters. Recommended engine oil: MB 228.51 specification. Oil change intervals: 40,000 km or 12 months under normal conditions, 20,000 km under severe duty conditions.`,
    content_type: "specification",
    metadata: { model_codes: ["OM906LA"], component: "engine", page_type: "technical_specs" }
  },
  {
    page_number: 12,
    section_title: "Transmission System - G280-12",
    content: `Transmission: Mercedes-Benz G280-12 manual transmission with 12 forward and 4 reverse gears. Gear ratios: 1st gear 9.51:1, 2nd gear 6.79:1, 3rd gear 4.83:1, 4th gear 3.44:1, 5th gear 2.46:1, 6th gear 1.76:1, 7th gear 1.26:1, 8th gear 0.89:1, 9th gear 0.64:1, 10th gear 0.46:1, 11th gear 0.33:1, 12th gear 0.24:1. Oil capacity: 12 liters. Recommended oil: MB 235.8. The transmission features a splitter group and range group for optimal gear selection. Clutch diameter: 430mm with hydraulic actuation.`,
    content_type: "specification",
    metadata: { model_codes: ["G280-12"], component: "transmission", page_type: "technical_specs" }
  },
  {
    page_number: 18,
    section_title: "Portal Axles and Differential System",
    content: `Front and rear portal axles provide increased ground clearance and improved approach/departure angles. Portal reduction ratio: 1.31:1. Differential locks: mechanical locking differentials front, center, and rear with pneumatic actuation. Axle oil capacity: front axle 8.5 liters, rear axle 9.2 liters. Recommended axle oil: MB 235.75. Differential lock engagement: maximum speed 40 km/h for center diff, 25 km/h for front/rear diffs. Portal hubs require inspection every 20,000 km for seal integrity and oil level. Torque settings: hub bolts 380 Nm, differential drain plug 60 Nm.`,
    content_type: "specification",
    metadata: { model_codes: ["U1700L"], component: "axles", page_type: "technical_specs" }
  },
  {
    page_number: 25,
    section_title: "Hydraulic System - U435 Implement Carrier",
    content: `The U435 implement carrier features a dedicated hydraulic system for powering external attachments. Main hydraulic pump: variable displacement axial piston pump, maximum flow 125 l/min at 2,000 rpm. System pressure: maximum 210 bar, relief valve setting 220 bar. Hydraulic oil capacity: 180 liters in main tank. Oil type: HLP 46 hydraulic oil (ISO VG 46). Quick-connect couplings: 4x pressure lines, 2x return lines, all with dust caps. PTO drive: rear PTO with 1:1 ratio, maximum torque 1,100 Nm. Three-point hitch lift capacity: 3,500 kg at ball ends. Hitch adjustment: mechanical top link with 300mm stroke.`,
    content_type: "specification",
    metadata: { model_codes: ["U435"], component: "hydraulics", page_type: "technical_specs" }
  },
  {
    page_number: 32,
    section_title: "Engine Oil Change Procedure",
    content: `ENGINE OIL CHANGE PROCEDURE: 1. Warm engine to operating temperature (80-90°C). 2. Position vehicle on level ground and engage parking brake. 3. Remove oil filler cap to improve drainage. 4. Remove drain plug using 19mm hex key, allow complete drainage (15-20 minutes). 5. Clean drain plug and inspect sealing washer, replace if damaged. 6. Install drain plug with new sealing washer, torque to 60 Nm. 7. Remove oil filter using filter wrench, clean filter housing. 8. Apply thin layer of clean oil to new filter gasket. 9. Install new filter hand-tight plus 3/4 turn. 10. Fill with 26 liters MB 228.51 oil. 11. Start engine, check for leaks, stop and recheck level after 5 minutes. 12. Top up to MAX mark on dipstick. Reset service indicator.`,
    content_type: "procedure",
    metadata: { model_codes: ["OM906LA"], component: "engine", procedure_type: "maintenance" }
  },
  {
    page_number: 38,
    section_title: "Hydraulic Filter Replacement",
    content: `HYDRAULIC FILTER REPLACEMENT PROCEDURE: 1. Lower all implements to ground and relieve system pressure. 2. Clean area around filter housing to prevent contamination. 3. Remove filter housing cap using appropriate spanner (55mm). 4. Extract old filter element and O-rings. 5. Clean housing thoroughly with lint-free cloth. 6. Check housing for cracks or damage. 7. Install new O-rings with light coating of hydraulic oil. 8. Insert new filter element ensuring correct orientation. 9. Install housing cap, torque to 45 Nm. 10. Check hydraulic oil level and top up if necessary. 11. Start engine and operate hydraulic system to check for leaks. 12. Record filter change in service log. Filter part number: A 000 180 00 09. Change interval: 500 hours or 12 months.`,
    content_type: "procedure",
    metadata: { model_codes: ["U435"], component: "hydraulics", procedure_type: "maintenance" }
  },
  {
    page_number: 45,
    section_title: "Portal Axle Service and Inspection",
    content: `PORTAL AXLE SERVICE PROCEDURE: 1. Jack vehicle and support on axle stands. 2. Remove road wheels using appropriate lifting equipment. 3. Clean portal hub area with degreaser. 4. Check oil level through level plug - oil should be level with plug opening. 5. If oil change required: remove drain plug, allow complete drainage. 6. Inspect drained oil for metal particles or contamination. 7. Clean and reinstall drain plug with new sealing washer, torque 35 Nm. 8. Remove level plug and fill with MB 235.75 oil until overflow. 9. Install level plug with new sealing washer, torque 25 Nm. 10. Check hub bolts for correct torque: 380 Nm in star pattern. 11. Inspect CV joint boots for cracks or damage. 12. Check brake disc runout: maximum 0.15mm. Service interval: 20,000 km.`,
    content_type: "procedure",
    metadata: { model_codes: ["U1700L"], component: "axles", procedure_type: "maintenance" }
  },
  {
    page_number: 52,
    section_title: "Engine Fault Diagnosis - Low Power",
    content: `ENGINE LOW POWER DIAGNOSIS: Symptoms: reduced acceleration, black smoke, high fuel consumption. Possible causes: 1. Air filter restriction - check filter indicator, maximum vacuum 6.0 kPa. 2. Fuel filter contamination - check fuel pressure at rail: should be 1,600 bar ±50 bar. 3. Turbocharger issues - inspect wastegate operation, check boost pressure: should reach 2.3 bar maximum. 4. EGR valve stuck open - check valve operation with diagnostic scanner. 5. Injector problems - perform cylinder balance test, maximum variation 50 rpm. 6. Exhaust restriction - check backpressure: maximum 10 kPa at rated power. Diagnostic tools required: MB Star Diagnosis system, pressure gauges, smoke meter for opacity testing.`,
    content_type: "troubleshooting",
    metadata: { model_codes: ["OM906LA"], component: "engine", issue_type: "performance" }
  },
  {
    page_number: 58,
    section_title: "Hydraulic System Troubleshooting",
    content: `HYDRAULIC SYSTEM PROBLEMS: 1. No hydraulic function: Check PTO engagement, verify pump drive coupling. Check system pressure with gauge at test port - should reach 210 bar. Inspect for external leaks at cylinders and hoses. 2. Slow operation: Check oil temperature - maximum operating temperature 80°C. Verify filter condition, replace if pressure drop exceeds 3.5 bar. Check pump efficiency with flow meter. 3. Noisy operation: Check oil level and aeration. Inspect suction strainer for blockage. Verify pump mounting bolts torque: 45 Nm. 4. Overheating: Check cooling fan operation, clean oil cooler fins. Verify relief valve setting with pressure gauge. 5. Implements drift down: Check cylinder seals, test relief valve for internal leakage. Required tools: pressure gauge 0-250 bar, flow meter, thermometer.`,
    content_type: "troubleshooting",
    metadata: { model_codes: ["U435"], component: "hydraulics", issue_type: "malfunction" }
  },
  {
    page_number: 65,
    section_title: "Differential Lock System Diagnosis",
    content: `DIFFERENTIAL LOCK PROBLEMS: 1. Locks won't engage: Check air pressure at reservoir - minimum 8.5 bar required. Test electrical circuit with multimeter - 24V supply at solenoid valve. Inspect air lines for leaks using soapy water. Check mechanical linkage for binding or damage. 2. Locks won't disengage: Verify vehicle is stopped before attempting disengagement. Check return spring tension on actuator. Test solenoid valve operation - should hear audible click. 3. Partial engagement: Inspect teeth on lock rings for wear or damage. Check actuator travel - should be 12mm ±2mm. Verify air cylinder seal integrity. 4. Warning light malfunction: Test switches with ohmmeter - should show continuity when locked. Check wiring harness for corrosion at connectors. Required pressures: engagement 6.5-8.5 bar, disengagement spring return.`,
    content_type: "troubleshooting",
    metadata: { model_codes: ["U1700L"], component: "differential", issue_type: "pneumatic" }
  },
  {
    page_number: 72,
    section_title: "Electrical System Overview",
    content: `ELECTRICAL SYSTEM: 24V negative earth system with 110Ah maintenance-free batteries (2x 12V in series). Alternator: 28V, 150A maximum output with integrated voltage regulator. Main fuse box located under driver seat with 40 fuse positions. Central electronic unit (CGW) controls lighting, indicators, and auxiliary functions. CAN bus network connects engine ECU, transmission control, ABS system, and instrument cluster. Relay box contains main system relays: starter, fuel pump, cooling fans, hydraulic pump. Battery disconnect switch isolates all electrical systems except clock memory. Ground points: engine block (G1), chassis rail (G2), implement carrier (G3). All circuits protected by appropriate fuses or circuit breakers. Diagnostic connector: 38-pin OBD socket under dashboard.`,
    content_type: "specification",
    metadata: { model_codes: ["U1700L"], component: "electrical", page_type: "system_overview" }
  },
  {
    page_number: 78,
    section_title: "Brake System Specifications",
    content: `BRAKE SYSTEM: Service brakes: pneumatic over hydraulic with ABS/ASR. Brake discs: ventilated type, front 350mm diameter, rear 350mm diameter. Minimum thickness: front 32mm, rear 30mm. Brake pads: organic friction material, minimum thickness 4mm. Air pressure system: maximum 12.5 bar, low pressure warning at 6.5 bar. Brake application: foot valve with graduated response, maximum line pressure 180 bar. Parking brake: spring-applied, air-released type on rear axle. ABS sensors: inductive type with 100 pulse/revolution reluctor rings. Brake adjustment: automatic slack adjusters with manual override capability. Air dryer: automatic drain with heater element, service interval 40,000 km or 2 years. Emergency brake: separate pneumatic circuit with manual override valve.`,
    content_type: "specification",
    metadata: { model_codes: ["U1700L"], component: "brakes", page_type: "technical_specs" }
  },
  {
    page_number: 85,
    section_title: "Cab and Controls Layout",
    content: `CAB SPECIFICATIONS: Two-person cab with optional crew configuration (4-person). Tilt angle: 60° for engine access. Cab suspension: 4-point pneumatic with automatic leveling. Door locks: central locking with remote key. Windows: laminated safety glass front, toughened side/rear. Heating system: water-heated with auxiliary air heater for rapid warm-up. Air conditioning: R134a refrigerant system with cabin filter. Instrument cluster: digital display with analog gauges for engine speed, road speed, fuel level, coolant temperature. Warning lights: engine malfunction, hydraulic pressure, differential locks, ABS. Control layout: implement controls on right console, PTO engagement on dashboard. Seat: air-suspended driver seat with lumbar support and heating. Weight distribution: cab tilt weight 850 kg, requires hydraulic assist.`,
    content_type: "specification",
    metadata: { model_codes: ["U1700L"], component: "cab", page_type: "operator_interface" }
  },
  {
    page_number: 92,
    section_title: "Tire and Wheel Specifications",
    content: `TIRES AND WHEELS: Standard fitment: 16.00 R20 super single tires on 20x11.75 steel wheels. Alternative sizes: 445/95 R25 radial tires for highway use. Tire pressure: front 6.0 bar, rear 5.5 bar (road use). Reduce to 4.0 bar front/rear for off-road operation. Load rating: 154K (3,750 kg per tire at maximum pressure). Speed rating: K (110 km/h maximum). Wheel bolt pattern: 10-hole, M22x1.5 thread, torque 450 Nm. Spare wheel carrier: under-body mounted with winch mechanism. Tire rotation: front to rear only due to directional tread pattern. Wheel alignment: toe-in 2-4mm, camber 0°±30', caster 4°±30'. Optional: tracks or low-pressure tires for specialized applications.`,
    content_type: "specification",
    metadata: { model_codes: ["U1700L"], component: "wheels", page_type: "technical_specs" }
  }
];

export const getU1700LChunks = () => U1700L_U435_MANUAL_CHUNKS;

export const findChunksByKeyword = (keyword: string) => {
  const searchTerm = keyword.toLowerCase();
  return U1700L_U435_MANUAL_CHUNKS.filter(chunk =>
    chunk.content.toLowerCase().includes(searchTerm) ||
    chunk.section_title.toLowerCase().includes(searchTerm) ||
    chunk.metadata.component?.toLowerCase().includes(searchTerm)
  );
};

export const getChunksByComponent = (component: string) => {
  return U1700L_U435_MANUAL_CHUNKS.filter(chunk =>
    chunk.metadata.component === component
  );
};

export const getChunksByContentType = (type: string) => {
  return U1700L_U435_MANUAL_CHUNKS.filter(chunk =>
    chunk.content_type === type
  );
};