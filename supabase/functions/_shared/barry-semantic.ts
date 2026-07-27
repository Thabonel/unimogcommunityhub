export const BARRY_SEMANTIC_VERSION = '1.0.0-phase1';

export type SemanticConceptType =
  | 'vehicle_model'
  | 'vehicle_variant'
  | 'vehicle_system'
  | 'component'
  | 'symptom'
  | 'operation'
  | 'claim_class'
  | 'property'
  | 'fluid'
  | 'unit'
  | 'part'
  | 'tool'
  | 'document_role'
  | 'page_type'
  | 'hazard';

export type SemanticAliasType =
  | 'workshop_term'
  | 'owner_term'
  | 'abbreviation'
  | 'translation'
  | 'spelling_variant'
  | 'common_misspelling';

export type SemanticRelationshipType =
  | 'part_of'
  | 'connected_to'
  | 'has_property'
  | 'uses_fluid'
  | 'has_part'
  | 'has_symptom'
  | 'checked_by'
  | 'serviced_by'
  | 'specified_by'
  | 'illustrated_by'
  | 'applies_to'
  | 'supersedes'
  | 'alias_of'
  | 'broader_than'
  | 'requires'
  | 'creates_hazard';

export type BarryClaimClass =
  | 'procedure_step'
  | 'diagnostic_cause'
  | 'diagnostic_test'
  | 'specification'
  | 'fluid'
  | 'capacity'
  | 'torque'
  | 'part_number'
  | 'compatibility'
  | 'component_identity'
  | 'safety_warning'
  | 'general_description';

export type SemanticVersionStatus = 'draft' | 'active' | 'retired';

export interface SemanticVersionDefinition {
  version: string;
  status: SemanticVersionStatus;
  changeSummary: string;
}

export interface SemanticConceptDefinition {
  conceptKey: string;
  conceptType: SemanticConceptType;
  canonicalName: string;
  description: string;
  systemConceptKey?: string;
  modelScope?: string[];
  configurationScope?: string[];
}

export interface SemanticAliasDefinition {
  aliasText: string;
  conceptKey: string;
  aliasType: SemanticAliasType;
  language?: string;
  modelScope?: string[];
  contextConceptKeys?: string[];
  confidence: number;
}

export interface SemanticRelationshipDefinition {
  sourceConceptKey: string;
  relationshipType: SemanticRelationshipType;
  targetConceptKey: string;
  confidence: number;
}

export interface SemanticRegistry {
  version: string;
  concepts: SemanticConceptDefinition[];
  aliases: SemanticAliasDefinition[];
  relationships: SemanticRelationshipDefinition[];
}

export interface SemanticAmbiguity {
  term: string;
  candidateConceptKeys: string[];
}

export interface SemanticQueryConstraint {
  propertyConceptKey: string;
  operator: 'equals' | 'contains' | 'unknown';
  value: string;
}

export interface SemanticQueryFrame {
  queryId: string;
  semanticVersion: string;
  normalizedQuery: string;
  vehicleModelConceptKey?: string;
  vehicleVariantConceptKeys: string[];
  systemConceptKeys: string[];
  componentConceptKeys: string[];
  symptomConceptKeys: string[];
  operationConceptKeys: string[];
  propertyConceptKeys: string[];
  fluidConceptKeys: string[];
  partConceptKeys: string[];
  toolConceptKeys: string[];
  hazardConceptKeys: string[];
  requestedClaimClasses: BarryClaimClass[];
  constraints: SemanticQueryConstraint[];
  unresolvedTerms: string[];
  ambiguities: SemanticAmbiguity[];
  confidence: number;
}

export interface SemanticFrameOptions {
  queryId?: string;
  vehicleModelConceptKey?: string;
}

export interface SemanticGroundingTelemetry {
  request_id: string;
  semantic_version: string;
  resolved_concept_count: number;
  unresolved_term_count: number;
  ambiguous_concept_count: number;
  requested_claim_classes: BarryClaimClass[];
}

const concepts: SemanticConceptDefinition[] = [
  {
    conceptKey: 'vehicle_model.u435',
    conceptType: 'vehicle_model',
    canonicalName: 'U435',
    description: 'Mercedes-Benz Unimog 435 series',
  },
  {
    conceptKey: 'vehicle_model.u1700l',
    conceptType: 'vehicle_model',
    canonicalName: 'U1700L',
    description: 'Mercedes-Benz Unimog U1700L',
  },
  {
    conceptKey: 'vehicle_variant.u1700l_38',
    conceptType: 'vehicle_variant',
    canonicalName: 'U1700L/38',
    description: 'U1700L long-wheelbase 3.85 metre variant',
    modelScope: ['vehicle_model.u1700l'],
  },
  {
    conceptKey: 'vehicle_system.steering',
    conceptType: 'vehicle_system',
    canonicalName: 'steering',
    description: 'Mechanical and hydraulic steering system',
  },
  {
    conceptKey: 'vehicle_system.hydraulics',
    conceptType: 'vehicle_system',
    canonicalName: 'hydraulics',
    description: 'Vehicle hydraulic systems',
  },
  {
    conceptKey: 'vehicle_system.brakes',
    conceptType: 'vehicle_system',
    canonicalName: 'brakes',
    description: 'Service and parking brake systems',
  },
  {
    conceptKey: 'vehicle_system.compressed_air',
    conceptType: 'vehicle_system',
    canonicalName: 'compressed air',
    description: 'Compressed-air generation and control',
  },
  {
    conceptKey: 'vehicle_system.axles',
    conceptType: 'vehicle_system',
    canonicalName: 'axles',
    description: 'Axles, differentials, wheel ends, and portal drives',
  },
  {
    conceptKey: 'vehicle_system.engine',
    conceptType: 'vehicle_system',
    canonicalName: 'engine',
    description: 'Engine and fuel system',
  },
  {
    conceptKey: 'vehicle_system.cooling',
    conceptType: 'vehicle_system',
    canonicalName: 'cooling',
    description: 'Engine cooling system',
  },
  {
    conceptKey: 'vehicle_system.transmission',
    conceptType: 'vehicle_system',
    canonicalName: 'transmission',
    description: 'Clutch, gearbox, transfer case, and driveline',
  },
  {
    conceptKey: 'vehicle_system.electrical',
    conceptType: 'vehicle_system',
    canonicalName: 'electrical',
    description: 'Electrical generation, storage, wiring, and starting',
  },
  {
    conceptKey: 'vehicle_system.suspension',
    conceptType: 'vehicle_system',
    canonicalName: 'suspension',
    description: 'Springs, dampers, and suspension links',
  },
  {
    conceptKey: 'component.steering_gear',
    conceptType: 'component',
    canonicalName: 'steering gear',
    description: 'Steering gear assembly, commonly called the steering box',
    systemConceptKey: 'vehicle_system.steering',
  },
  {
    conceptKey: 'component.sector_shaft',
    conceptType: 'component',
    canonicalName: 'sector shaft',
    description: 'Steering gear output shaft',
    systemConceptKey: 'vehicle_system.steering',
  },
  {
    conceptKey: 'component.steering_column_coupling',
    conceptType: 'component',
    canonicalName: 'steering column coupling',
    description: 'Coupling or universal joint between steering column and steering gear',
    systemConceptKey: 'vehicle_system.steering',
  },
  {
    conceptKey: 'component.pitman_arm',
    conceptType: 'component',
    canonicalName: 'pitman arm',
    description: 'Steering arm fitted to the steering gear output',
    systemConceptKey: 'vehicle_system.steering',
  },
  {
    conceptKey: 'component.power_steering_pump',
    conceptType: 'component',
    canonicalName: 'power steering pump',
    description: 'Hydraulic pump supplying steering assistance',
    systemConceptKey: 'vehicle_system.steering',
  },
  {
    conceptKey: 'component.steering_reservoir',
    conceptType: 'component',
    canonicalName: 'steering reservoir',
    description: 'Power-steering fluid reservoir',
    systemConceptKey: 'vehicle_system.steering',
  },
  {
    conceptKey: 'component.portal_hub',
    conceptType: 'component',
    canonicalName: 'portal hub',
    description: 'Portal wheel hub and reduction drive assembly',
    systemConceptKey: 'vehicle_system.axles',
  },
  {
    conceptKey: 'component.differential',
    conceptType: 'component',
    canonicalName: 'differential',
    description: 'Axle differential assembly',
    systemConceptKey: 'vehicle_system.axles',
  },
  {
    conceptKey: 'component.brake_caliper',
    conceptType: 'component',
    canonicalName: 'brake caliper',
    description: 'Service brake caliper',
    systemConceptKey: 'vehicle_system.brakes',
  },
  {
    conceptKey: 'component.air_compressor',
    conceptType: 'component',
    canonicalName: 'air compressor',
    description: 'Engine-driven compressed-air supply compressor',
    systemConceptKey: 'vehicle_system.compressed_air',
  },
  {
    conceptKey: 'component.water_pump',
    conceptType: 'component',
    canonicalName: 'water pump',
    description: 'Engine coolant circulation pump',
    systemConceptKey: 'vehicle_system.cooling',
  },
  {
    conceptKey: 'component.radiator',
    conceptType: 'component',
    canonicalName: 'radiator',
    description: 'Engine coolant radiator',
    systemConceptKey: 'vehicle_system.cooling',
  },
  {
    conceptKey: 'component.fuel_injection_pump',
    conceptType: 'component',
    canonicalName: 'fuel injection pump',
    description: 'Diesel fuel injection pump',
    systemConceptKey: 'vehicle_system.engine',
  },
  {
    conceptKey: 'component.transfer_case',
    conceptType: 'component',
    canonicalName: 'transfer case',
    description: 'Transfer gearbox assembly',
    systemConceptKey: 'vehicle_system.transmission',
  },
  {
    conceptKey: 'component.clutch',
    conceptType: 'component',
    canonicalName: 'clutch',
    description: 'Main drivetrain clutch',
    systemConceptKey: 'vehicle_system.transmission',
  },
  {
    conceptKey: 'component.alternator',
    conceptType: 'component',
    canonicalName: 'alternator',
    description: 'Electrical charging generator',
    systemConceptKey: 'vehicle_system.electrical',
  },
  {
    conceptKey: 'symptom.external_fluid_leak',
    conceptType: 'symptom',
    canonicalName: 'external fluid leak',
    description: 'Visible escape of oil or fluid',
  },
  {
    conceptKey: 'symptom.overheating',
    conceptType: 'symptom',
    canonicalName: 'overheating',
    description: 'Temperature exceeding normal operating range',
  },
  {
    conceptKey: 'symptom.no_start',
    conceptType: 'symptom',
    canonicalName: 'no start',
    description: 'Engine does not start',
  },
  {
    conceptKey: 'symptom.low_pressure',
    conceptType: 'symptom',
    canonicalName: 'low pressure',
    description: 'System pressure below specification',
  },
  {
    conceptKey: 'symptom.noise',
    conceptType: 'symptom',
    canonicalName: 'noise',
    description: 'Unexpected mechanical or pneumatic noise',
  },
  {
    conceptKey: 'symptom.vibration',
    conceptType: 'symptom',
    canonicalName: 'vibration',
    description: 'Unexpected or excessive vibration',
  },
  {
    conceptKey: 'operation.inspect',
    conceptType: 'operation',
    canonicalName: 'inspect',
    description: 'Observe or examine without dismantling',
  },
  {
    conceptKey: 'operation.diagnose',
    conceptType: 'operation',
    canonicalName: 'diagnose',
    description: 'Identify a fault using documented evidence',
  },
  {
    conceptKey: 'operation.remove',
    conceptType: 'operation',
    canonicalName: 'remove',
    description: 'Remove a component using a documented procedure',
  },
  {
    conceptKey: 'operation.install',
    conceptType: 'operation',
    canonicalName: 'install',
    description: 'Install a component using a documented procedure',
  },
  {
    conceptKey: 'operation.adjust',
    conceptType: 'operation',
    canonicalName: 'adjust',
    description: 'Change a controlled setting',
  },
  {
    conceptKey: 'operation.refill',
    conceptType: 'operation',
    canonicalName: 'refill',
    description: 'Add an approved fluid to a specified level or capacity',
  },
  {
    conceptKey: 'operation.replace',
    conceptType: 'operation',
    canonicalName: 'replace',
    description: 'Remove and install a service part',
  },
  {
    conceptKey: 'operation.check_fluid_level',
    conceptType: 'operation',
    canonicalName: 'check fluid level',
    description: 'Verify fluid level by the documented method',
  },
  {
    conceptKey: 'operation.bleed',
    conceptType: 'operation',
    canonicalName: 'bleed',
    description: 'Remove air from a fluid or brake circuit',
  },
  {
    conceptKey: 'claim_class.procedure_step',
    conceptType: 'claim_class',
    canonicalName: 'procedure step',
    description: 'An ordered maintenance or repair action',
  },
  {
    conceptKey: 'claim_class.diagnostic_cause',
    conceptType: 'claim_class',
    canonicalName: 'diagnostic cause',
    description: 'A proposed cause of a symptom',
  },
  {
    conceptKey: 'claim_class.diagnostic_test',
    conceptType: 'claim_class',
    canonicalName: 'diagnostic test',
    description: 'A check used to distinguish possible causes',
  },
  {
    conceptKey: 'claim_class.specification',
    conceptType: 'claim_class',
    canonicalName: 'specification claim',
    description: 'A stated technical property or limit',
  },
  {
    conceptKey: 'claim_class.fluid',
    conceptType: 'claim_class',
    canonicalName: 'fluid claim',
    description: 'A statement identifying an approved fluid',
  },
  {
    conceptKey: 'claim_class.capacity',
    conceptType: 'claim_class',
    canonicalName: 'capacity claim',
    description: 'A stated fluid or system quantity',
  },
  {
    conceptKey: 'claim_class.torque',
    conceptType: 'claim_class',
    canonicalName: 'torque claim',
    description: 'A stated tightening torque',
  },
  {
    conceptKey: 'claim_class.part_number',
    conceptType: 'claim_class',
    canonicalName: 'part number claim',
    description: 'A stated manufacturer or catalogue identifier',
  },
  {
    conceptKey: 'claim_class.compatibility',
    conceptType: 'claim_class',
    canonicalName: 'compatibility claim',
    description: 'A statement of model, variant, or component applicability',
  },
  {
    conceptKey: 'claim_class.component_identity',
    conceptType: 'claim_class',
    canonicalName: 'component identity',
    description: 'A statement identifying a component or diagram item',
  },
  {
    conceptKey: 'claim_class.safety_warning',
    conceptType: 'claim_class',
    canonicalName: 'safety warning',
    description: 'A warning about a documented hazard or precaution',
  },
  {
    conceptKey: 'claim_class.general_description',
    conceptType: 'claim_class',
    canonicalName: 'general description',
    description: 'A non-procedural technical explanation',
  },
  {
    conceptKey: 'property.fluid_capacity',
    conceptType: 'property',
    canonicalName: 'fluid capacity',
    description: 'Specified fluid quantity',
  },
  {
    conceptKey: 'property.torque',
    conceptType: 'property',
    canonicalName: 'torque',
    description: 'Specified tightening torque',
  },
  {
    conceptKey: 'property.operating_pressure',
    conceptType: 'property',
    canonicalName: 'operating pressure',
    description: 'Specified operating or test pressure',
  },
  {
    conceptKey: 'property.clearance',
    conceptType: 'property',
    canonicalName: 'clearance',
    description: 'Specified gap, play, or clearance',
  },
  {
    conceptKey: 'property.fluid_specification',
    conceptType: 'property',
    canonicalName: 'fluid specification',
    description: 'Approved fluid type or standard',
  },
  {
    conceptKey: 'property.part_number',
    conceptType: 'property',
    canonicalName: 'part number',
    description: 'Catalogue or manufacturer part identifier',
  },
  {
    conceptKey: 'fluid.atf',
    conceptType: 'fluid',
    canonicalName: 'automatic transmission fluid',
    description: 'ATF fluid class',
  },
  {
    conceptKey: 'fluid.hydraulic_oil',
    conceptType: 'fluid',
    canonicalName: 'hydraulic oil',
    description: 'Hydraulic oil fluid class',
  },
  {
    conceptKey: 'fluid.engine_oil',
    conceptType: 'fluid',
    canonicalName: 'engine oil',
    description: 'Engine lubricating oil fluid class',
  },
  {
    conceptKey: 'unit.litre',
    conceptType: 'unit',
    canonicalName: 'litre',
    description: 'Metric volume unit',
  },
  {
    conceptKey: 'unit.newton_metre',
    conceptType: 'unit',
    canonicalName: 'newton metre',
    description: 'Metric torque unit',
  },
  {
    conceptKey: 'unit.bar',
    conceptType: 'unit',
    canonicalName: 'bar',
    description: 'Pressure unit',
  },
  {
    conceptKey: 'part.sealing_ring',
    conceptType: 'part',
    canonicalName: 'sealing ring',
    description: 'Generic sealing ring pending exact catalogue identification',
  },
  {
    conceptKey: 'part.repair_kit',
    conceptType: 'part',
    canonicalName: 'repair kit',
    description: 'Generic repair kit pending exact catalogue identification',
  },
  {
    conceptKey: 'tool.puller',
    conceptType: 'tool',
    canonicalName: 'puller',
    description: 'General or special-purpose component puller',
  },
  {
    conceptKey: 'tool.pressure_gauge',
    conceptType: 'tool',
    canonicalName: 'pressure gauge',
    description: 'Gauge used for a documented pressure test',
  },
  {
    conceptKey: 'document_role.workshop_manual',
    conceptType: 'document_role',
    canonicalName: 'workshop manual',
    description: 'Procedure and specification authority',
  },
  {
    conceptKey: 'document_role.maintenance_manual',
    conceptType: 'document_role',
    canonicalName: 'maintenance manual',
    description: 'Routine maintenance authority',
  },
  {
    conceptKey: 'document_role.owners_manual',
    conceptType: 'document_role',
    canonicalName: 'owners manual',
    description: 'Operation and owner-maintenance authority',
  },
  {
    conceptKey: 'document_role.parts_catalog',
    conceptType: 'document_role',
    canonicalName: 'parts catalogue',
    description: 'Component and part identification authority',
  },
  {
    conceptKey: 'document_role.validated_knowledge',
    conceptType: 'document_role',
    canonicalName: 'validated knowledge',
    description: 'Reviewed technical knowledge',
  },
  {
    conceptKey: 'page_type.procedure',
    conceptType: 'page_type',
    canonicalName: 'procedure',
    description: 'Step-by-step technical procedure',
  },
  {
    conceptKey: 'page_type.diagnostic',
    conceptType: 'page_type',
    canonicalName: 'diagnostic',
    description: 'Fault diagnosis or test content',
  },
  {
    conceptKey: 'page_type.specification',
    conceptType: 'page_type',
    canonicalName: 'specification',
    description: 'Technical values and conditions',
  },
  {
    conceptKey: 'page_type.warning',
    conceptType: 'page_type',
    canonicalName: 'warning',
    description: 'Hazard and precaution content',
  },
  {
    conceptKey: 'page_type.diagram',
    conceptType: 'page_type',
    canonicalName: 'diagram',
    description: 'Technical illustration or exploded view',
  },
  {
    conceptKey: 'page_type.parts_list',
    conceptType: 'page_type',
    canonicalName: 'parts list',
    description: 'Catalogue part list',
  },
  {
    conceptKey: 'page_type.explanation',
    conceptType: 'page_type',
    canonicalName: 'explanation',
    description: 'Descriptive technical content',
  },
  {
    conceptKey: 'page_type.index',
    conceptType: 'page_type',
    canonicalName: 'index',
    description: 'Document navigation content',
  },
  {
    conceptKey: 'hazard.loss_of_steering_assist',
    conceptType: 'hazard',
    canonicalName: 'loss of steering assist',
    description: 'Reduced or absent hydraulic steering assistance',
  },
];

const aliases: SemanticAliasDefinition[] = [
  { aliasText: '435', conceptKey: 'vehicle_model.u435', aliasType: 'abbreviation', confidence: 0.9 },
  { aliasText: 'u 435', conceptKey: 'vehicle_model.u435', aliasType: 'spelling_variant', confidence: 0.95 },
  { aliasText: '1700l', conceptKey: 'vehicle_model.u1700l', aliasType: 'abbreviation', confidence: 0.95 },
  { aliasText: 'u 1700 l', conceptKey: 'vehicle_model.u1700l', aliasType: 'spelling_variant', confidence: 0.95 },
  { aliasText: 'steering box', conceptKey: 'component.steering_gear', aliasType: 'owner_term', confidence: 0.95 },
  { aliasText: 'steeringbox', conceptKey: 'component.steering_gear', aliasType: 'spelling_variant', confidence: 0.95 },
  { aliasText: 'steering gearbox', conceptKey: 'component.steering_gear', aliasType: 'workshop_term', confidence: 0.95 },
  { aliasText: 'output shaft', conceptKey: 'component.sector_shaft', aliasType: 'owner_term', contextConceptKeys: ['vehicle_system.steering'], confidence: 0.75 },
  { aliasText: 'column joint', conceptKey: 'component.steering_column_coupling', aliasType: 'owner_term', confidence: 0.8 },
  { aliasText: 'steering universal joint', conceptKey: 'component.steering_column_coupling', aliasType: 'workshop_term', confidence: 0.9 },
  { aliasText: 'drop arm', conceptKey: 'component.pitman_arm', aliasType: 'workshop_term', confidence: 0.8 },
  { aliasText: 'steering pump', conceptKey: 'component.power_steering_pump', aliasType: 'owner_term', confidence: 0.9 },
  { aliasText: 'pump', conceptKey: 'component.power_steering_pump', aliasType: 'owner_term', contextConceptKeys: ['vehicle_system.steering'], confidence: 0.65 },
  { aliasText: 'fluid reservoir', conceptKey: 'component.steering_reservoir', aliasType: 'owner_term', contextConceptKeys: ['vehicle_system.steering'], confidence: 0.7 },
  { aliasText: 'wheel hub', conceptKey: 'component.portal_hub', aliasType: 'owner_term', confidence: 0.85 },
  { aliasText: 'hub', conceptKey: 'component.portal_hub', aliasType: 'owner_term', contextConceptKeys: ['vehicle_system.axles'], confidence: 0.7 },
  { aliasText: 'diff', conceptKey: 'component.differential', aliasType: 'abbreviation', confidence: 0.95 },
  { aliasText: 'caliper', conceptKey: 'component.brake_caliper', aliasType: 'owner_term', contextConceptKeys: ['vehicle_system.brakes'], confidence: 0.85 },
  { aliasText: 'compressor', conceptKey: 'component.air_compressor', aliasType: 'owner_term', contextConceptKeys: ['vehicle_system.compressed_air'], confidence: 0.75 },
  { aliasText: 'coolant pump', conceptKey: 'component.water_pump', aliasType: 'workshop_term', confidence: 0.95 },
  { aliasText: 'pump', conceptKey: 'component.water_pump', aliasType: 'owner_term', contextConceptKeys: ['vehicle_system.cooling'], confidence: 0.65 },
  { aliasText: 'injection pump', conceptKey: 'component.fuel_injection_pump', aliasType: 'owner_term', confidence: 0.95 },
  { aliasText: 'gearbox', conceptKey: 'vehicle_system.transmission', aliasType: 'owner_term', confidence: 0.8 },
  { aliasText: 'transfer box', conceptKey: 'component.transfer_case', aliasType: 'owner_term', confidence: 0.9 },
  { aliasText: 'generator', conceptKey: 'component.alternator', aliasType: 'workshop_term', confidence: 0.8 },
  { aliasText: 'leak', conceptKey: 'symptom.external_fluid_leak', aliasType: 'owner_term', confidence: 0.9 },
  { aliasText: 'leaking', conceptKey: 'symptom.external_fluid_leak', aliasType: 'owner_term', confidence: 0.95 },
  { aliasText: 'oil leak', conceptKey: 'symptom.external_fluid_leak', aliasType: 'owner_term', confidence: 0.95 },
  { aliasText: 'running hot', conceptKey: 'symptom.overheating', aliasType: 'owner_term', confidence: 0.9 },
  { aliasText: "won't start", conceptKey: 'symptom.no_start', aliasType: 'owner_term', confidence: 0.95 },
  { aliasText: 'wont start', conceptKey: 'symptom.no_start', aliasType: 'spelling_variant', confidence: 0.95 },
  { aliasText: 'low pressure', conceptKey: 'symptom.low_pressure', aliasType: 'owner_term', confidence: 0.95 },
  { aliasText: 'rattle', conceptKey: 'symptom.noise', aliasType: 'owner_term', confidence: 0.8 },
  { aliasText: 'shaking', conceptKey: 'symptom.vibration', aliasType: 'owner_term', confidence: 0.85 },
  { aliasText: 'check', conceptKey: 'operation.inspect', aliasType: 'owner_term', confidence: 0.75 },
  { aliasText: 'look at', conceptKey: 'operation.inspect', aliasType: 'owner_term', confidence: 0.7 },
  { aliasText: 'troubleshoot', conceptKey: 'operation.diagnose', aliasType: 'owner_term', confidence: 0.9 },
  { aliasText: 'take out', conceptKey: 'operation.remove', aliasType: 'owner_term', confidence: 0.85 },
  { aliasText: 'fit', conceptKey: 'operation.install', aliasType: 'owner_term', confidence: 0.8 },
  { aliasText: 'top up', conceptKey: 'operation.refill', aliasType: 'owner_term', confidence: 0.85 },
  { aliasText: 'change', conceptKey: 'operation.replace', aliasType: 'owner_term', confidence: 0.7 },
  { aliasText: 'fill quantity', conceptKey: 'property.fluid_capacity', aliasType: 'workshop_term', confidence: 0.9 },
  { aliasText: 'how much oil', conceptKey: 'property.fluid_capacity', aliasType: 'owner_term', confidence: 0.9 },
  { aliasText: 'how much fluid', conceptKey: 'property.fluid_capacity', aliasType: 'owner_term', confidence: 0.9 },
  { aliasText: 'oil capacity', conceptKey: 'property.fluid_capacity', aliasType: 'owner_term', confidence: 0.95 },
  { aliasText: 'tightening torque', conceptKey: 'property.torque', aliasType: 'workshop_term', confidence: 0.95 },
  { aliasText: 'pressure', conceptKey: 'property.operating_pressure', aliasType: 'owner_term', confidence: 0.75 },
  { aliasText: 'gap', conceptKey: 'property.clearance', aliasType: 'owner_term', confidence: 0.8 },
  { aliasText: 'fluid type', conceptKey: 'property.fluid_specification', aliasType: 'owner_term', confidence: 0.9 },
  { aliasText: 'part no', conceptKey: 'property.part_number', aliasType: 'abbreviation', confidence: 0.9 },
  { aliasText: 'atf', conceptKey: 'fluid.atf', aliasType: 'abbreviation', confidence: 1 },
];

const relationships: SemanticRelationshipDefinition[] = [
  {
    sourceConceptKey: 'component.sector_shaft',
    relationshipType: 'part_of',
    targetConceptKey: 'component.steering_gear',
    confidence: 1,
  },
  {
    sourceConceptKey: 'component.steering_column_coupling',
    relationshipType: 'connected_to',
    targetConceptKey: 'component.steering_gear',
    confidence: 1,
  },
  {
    sourceConceptKey: 'component.pitman_arm',
    relationshipType: 'connected_to',
    targetConceptKey: 'component.steering_gear',
    confidence: 1,
  },
  {
    sourceConceptKey: 'component.steering_gear',
    relationshipType: 'has_part',
    targetConceptKey: 'component.sector_shaft',
    confidence: 1,
  },
  {
    sourceConceptKey: 'component.steering_gear',
    relationshipType: 'has_part',
    targetConceptKey: 'part.sealing_ring',
    confidence: 1,
  },
  {
    sourceConceptKey: 'vehicle_system.steering',
    relationshipType: 'has_property',
    targetConceptKey: 'property.fluid_capacity',
    confidence: 1,
  },
  {
    sourceConceptKey: 'vehicle_system.steering',
    relationshipType: 'has_property',
    targetConceptKey: 'property.fluid_specification',
    confidence: 1,
  },
  {
    sourceConceptKey: 'component.portal_hub',
    relationshipType: 'has_property',
    targetConceptKey: 'property.torque',
    confidence: 1,
  },
  {
    sourceConceptKey: 'component.differential',
    relationshipType: 'has_property',
    targetConceptKey: 'property.fluid_capacity',
    confidence: 1,
  },
  {
    sourceConceptKey: 'component.air_compressor',
    relationshipType: 'has_property',
    targetConceptKey: 'property.operating_pressure',
    confidence: 1,
  },
];

export const PHASE1_SEMANTIC_VERSION: SemanticVersionDefinition = {
  version: BARRY_SEMANTIC_VERSION,
  status: 'active',
  changeSummary: 'Initial U435 and U1700L semantic foundation',
};

export const PHASE1_SEMANTIC_REGISTRY: SemanticRegistry = {
  version: BARRY_SEMANTIC_VERSION,
  concepts,
  aliases,
  relationships,
};

const CLAIM_PATTERNS: Array<{ claimClass: BarryClaimClass; patterns: RegExp[] }> = [
  { claimClass: 'torque', patterns: [/\btorque\b/, /\btighten(?:ing)?\b/, /\bnm\b/] },
  { claimClass: 'capacity', patterns: [/\bcapacity\b/, /\bhow much (?:oil|fluid)\b/, /\blitres?\b/, /\bliters?\b/] },
  { claimClass: 'fluid', patterns: [/\bfluid\b/, /\boil\b/, /\batf\b/, /\blubricant\b/] },
  { claimClass: 'part_number', patterns: [/\bpart (?:number|no)\b/, /\bniin\b/, /\bnsn\b/, /\brepair kit\b/] },
  { claimClass: 'compatibility', patterns: [/\bfit\b/, /\bcompatible\b/, /\bapply\b/, /\bapplicable\b/] },
  { claimClass: 'component_identity', patterns: [/\bdiagram\b/, /\bexploded view\b/, /\bshow me\b/, /\bwhat is\b/] },
  { claimClass: 'specification', patterns: [/\bspec(?:ification)?s?\b/, /\bpressure\b/, /\bclearance\b/, /\bgap\b/] },
  { claimClass: 'procedure_step', patterns: [/\bhow (?:do|to)\b/, /\breplace\b/, /\bremove\b/, /\binstall\b/, /\badjust\b/, /\bfix\b/, /\bwhat do i do\b/] },
  { claimClass: 'diagnostic_cause', patterns: [/\bleak(?:ing)?\b/, /\boverheat(?:ing)?\b/, /\bnoise\b/, /\bvibration\b/, /\bno start\b/, /\bwont start\b/, /\bproblem\b/, /\bfault\b/] },
  { claimClass: 'diagnostic_test', patterns: [/\bdiagnos/, /\btroubleshoot\b/, /\bcheck\b/, /\binspect\b/, /\bwhat do i do\b/] },
];

const TECHNICAL_UNRESOLVED_TERMS = [
  'axle',
  'bearing',
  'brake',
  'capacity',
  'clearance',
  'clutch',
  'compressor',
  'coolant',
  'differential',
  'fluid',
  'gearbox',
  'hub',
  'hydraulic',
  'injector',
  'oil',
  'pressure',
  'pump',
  'seal',
  'steering',
  'suspension',
  'torque',
  'transmission',
  'wiring',
];

export function normalizeSemanticText(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsPhrase(normalizedQuery: string, phrase: string): boolean {
  return ` ${normalizedQuery} `.includes(` ${normalizeSemanticText(phrase)} `);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function conceptByKey(registry: SemanticRegistry): Map<string, SemanticConceptDefinition> {
  return new Map(registry.concepts.map((concept) => [concept.conceptKey, concept]));
}

function aliasIsApplicable(
  alias: SemanticAliasDefinition,
  resolvedConceptKeys: Set<string>,
  vehicleModelConceptKey?: string,
): boolean {
  if (alias.modelScope?.length && (!vehicleModelConceptKey || !alias.modelScope.includes(vehicleModelConceptKey))) {
    return false;
  }
  if (alias.contextConceptKeys?.length && !alias.contextConceptKeys.some((key) => resolvedConceptKeys.has(key))) {
    return false;
  }
  return true;
}

function inferRequestedClaimClasses(normalizedQuery: string, hasSymptom: boolean): BarryClaimClass[] {
  const classes = CLAIM_PATTERNS
    .filter((entry) => entry.patterns.some((pattern) => pattern.test(normalizedQuery)))
    .map((entry) => entry.claimClass);

  if (hasSymptom) {
    classes.push('diagnostic_cause');
  }
  if (hasSymptom || classes.includes('procedure_step')) {
    classes.push('safety_warning');
  }
  if (!classes.length) {
    classes.push('general_description');
  }
  return unique(classes) as BarryClaimClass[];
}

export function buildSemanticQueryFrame(
  query: string,
  options: SemanticFrameOptions = {},
  registry: SemanticRegistry = PHASE1_SEMANTIC_REGISTRY,
): SemanticQueryFrame {
  const normalizedQuery = normalizeSemanticText(query);
  const byKey = conceptByKey(registry);
  const resolved = new Set<string>();
  const matchedTerms = new Set<string>();
  const ambiguities: SemanticAmbiguity[] = [];

  for (const concept of registry.concepts) {
    if (containsPhrase(normalizedQuery, concept.canonicalName)) {
      resolved.add(concept.conceptKey);
      matchedTerms.add(normalizeSemanticText(concept.canonicalName));
    }
  }

  if (options.vehicleModelConceptKey) {
    resolved.add(options.vehicleModelConceptKey);
  }

  const directComponents = [...resolved]
    .map((key) => byKey.get(key))
    .filter((concept): concept is SemanticConceptDefinition => concept?.conceptType === 'component');
  for (const component of directComponents) {
    if (component.systemConceptKey) resolved.add(component.systemConceptKey);
  }

  const aliasesByPhrase = new Map<string, SemanticAliasDefinition[]>();
  for (const alias of registry.aliases) {
    const normalizedAlias = normalizeSemanticText(alias.aliasText);
    if (!containsPhrase(normalizedQuery, normalizedAlias)) continue;
    const current = aliasesByPhrase.get(normalizedAlias) ?? [];
    current.push(alias);
    aliasesByPhrase.set(normalizedAlias, current);
  }

  for (const [term, candidates] of [...aliasesByPhrase.entries()].sort((a, b) => b[0].length - a[0].length)) {
    const applicable = candidates.filter((alias) =>
      aliasIsApplicable(alias, resolved, options.vehicleModelConceptKey)
    );
    const candidateKeys = unique(applicable.map((alias) => alias.conceptKey));
    if (candidateKeys.length === 1) {
      resolved.add(candidateKeys[0]);
      matchedTerms.add(term);
      const concept = byKey.get(candidateKeys[0]);
      if (concept?.systemConceptKey) resolved.add(concept.systemConceptKey);
    } else if (candidateKeys.length > 1) {
      ambiguities.push({ term, candidateConceptKeys: candidateKeys });
      matchedTerms.add(term);
    } else {
      const unscopedCandidateKeys = unique(candidates.map((alias) => alias.conceptKey));
      if (unscopedCandidateKeys.length > 1) {
        ambiguities.push({ term, candidateConceptKeys: unscopedCandidateKeys });
        matchedTerms.add(term);
      }
    }
  }

  const hasResolvedSymptom = [...resolved].some((key) => byKey.get(key)?.conceptType === 'symptom');
  if (hasResolvedSymptom && containsPhrase(normalizedQuery, 'what do i do')) {
    resolved.add('operation.inspect');
    resolved.add('operation.diagnose');
  }

  const resolvedConcepts = [...resolved]
    .map((key) => byKey.get(key))
    .filter((concept): concept is SemanticConceptDefinition => Boolean(concept));

  const vehicleModels = resolvedConcepts.filter((concept) => concept.conceptType === 'vehicle_model');
  const symptoms = resolvedConcepts.filter((concept) => concept.conceptType === 'symptom');
  const unresolvedTerms = TECHNICAL_UNRESOLVED_TERMS.filter((term) =>
    containsPhrase(normalizedQuery, term)
    && ![...matchedTerms].some((matched) => matched.includes(term) || term.includes(matched))
    && !resolvedConcepts.some((concept) => normalizeSemanticText(concept.canonicalName).includes(term))
  );

  const requestedClaimClasses = inferRequestedClaimClasses(normalizedQuery, symptoms.length > 0);
  const propertyConceptKeys = unique(resolvedConcepts
    .filter((concept) => concept.conceptType === 'property')
    .map((concept) => concept.conceptKey));
  const confidence = Math.max(
    0.2,
    Math.min(0.99, 0.5 + resolvedConcepts.length * 0.06 - ambiguities.length * 0.2 - unresolvedTerms.length * 0.05),
  );

  return {
    queryId: options.queryId ?? '',
    semanticVersion: registry.version,
    normalizedQuery,
    vehicleModelConceptKey: options.vehicleModelConceptKey ?? vehicleModels[0]?.conceptKey,
    vehicleVariantConceptKeys: resolvedConcepts
      .filter((concept) => concept.conceptType === 'vehicle_variant')
      .map((concept) => concept.conceptKey),
    systemConceptKeys: unique(resolvedConcepts
      .filter((concept) => concept.conceptType === 'vehicle_system')
      .map((concept) => concept.conceptKey)),
    componentConceptKeys: unique(resolvedConcepts
      .filter((concept) => concept.conceptType === 'component')
      .map((concept) => concept.conceptKey)),
    symptomConceptKeys: unique(symptoms.map((concept) => concept.conceptKey)),
    operationConceptKeys: unique(resolvedConcepts
      .filter((concept) => concept.conceptType === 'operation')
      .map((concept) => concept.conceptKey)),
    propertyConceptKeys,
    fluidConceptKeys: unique(resolvedConcepts
      .filter((concept) => concept.conceptType === 'fluid')
      .map((concept) => concept.conceptKey)),
    partConceptKeys: unique(resolvedConcepts
      .filter((concept) => concept.conceptType === 'part')
      .map((concept) => concept.conceptKey)),
    toolConceptKeys: unique(resolvedConcepts
      .filter((concept) => concept.conceptType === 'tool')
      .map((concept) => concept.conceptKey)),
    hazardConceptKeys: unique(resolvedConcepts
      .filter((concept) => concept.conceptType === 'hazard')
      .map((concept) => concept.conceptKey)),
    requestedClaimClasses,
    constraints: propertyConceptKeys.map((propertyConceptKey) => ({
      propertyConceptKey,
      operator: 'unknown',
      value: '',
    })),
    unresolvedTerms,
    ambiguities,
    confidence,
  };
}

export function createSemanticGroundingTelemetry(
  frame: SemanticQueryFrame,
): SemanticGroundingTelemetry {
  const resolvedConceptCount =
    frame.vehicleVariantConceptKeys.length
    + frame.systemConceptKeys.length
    + frame.componentConceptKeys.length
    + frame.symptomConceptKeys.length
    + frame.operationConceptKeys.length
    + frame.propertyConceptKeys.length
    + frame.fluidConceptKeys.length
    + frame.partConceptKeys.length
    + frame.toolConceptKeys.length
    + frame.hazardConceptKeys.length
    + (frame.vehicleModelConceptKey ? 1 : 0);

  return {
    request_id: frame.queryId,
    semantic_version: frame.semanticVersion,
    resolved_concept_count: resolvedConceptCount,
    unresolved_term_count: frame.unresolvedTerms.length,
    ambiguous_concept_count: frame.ambiguities.length,
    requested_claim_classes: frame.requestedClaimClasses,
  };
}
