import type { BarryClaimClass } from '../../supabase/functions/_shared/barry-semantic';

export interface BarrySemanticBenchmarkCase {
  id: string;
  query: string;
  vehicleModelConceptKey?: string;
  expectedConceptKeys: string[];
  expectedClaimClasses: BarryClaimClass[];
  expectedAmbiguityTerms?: string[];
  forbiddenConceptKeys?: string[];
}

export const BARRY_SEMANTIC_PHASE1_CASES: BarrySemanticBenchmarkCase[] = [
  {
    id: 'steering-box-leak-unspaced',
    query: 'my steeringbox is leaking, what do I do',
    vehicleModelConceptKey: 'vehicle_model.u1700l',
    expectedConceptKeys: [
      'vehicle_model.u1700l',
      'vehicle_system.steering',
      'component.steering_gear',
      'symptom.external_fluid_leak',
      'operation.inspect',
      'operation.diagnose',
    ],
    expectedClaimClasses: ['diagnostic_cause', 'diagnostic_test', 'procedure_step', 'safety_warning'],
  },
  {
    id: 'steering-box-leak-owner-term',
    query: 'The steering box has an oil leak',
    expectedConceptKeys: [
      'vehicle_system.steering',
      'component.steering_gear',
      'symptom.external_fluid_leak',
    ],
    expectedClaimClasses: ['diagnostic_cause', 'fluid', 'safety_warning'],
  },
  {
    id: 'steering-column-coupling-check',
    query: 'How do I check the steering universal joint on a U435?',
    expectedConceptKeys: [
      'vehicle_model.u435',
      'vehicle_system.steering',
      'component.steering_column_coupling',
      'operation.inspect',
    ],
    expectedClaimClasses: ['procedure_step', 'diagnostic_test', 'safety_warning'],
  },
  {
    id: 'steering-capacity',
    query: 'How much oil is in the U1700L steering system?',
    expectedConceptKeys: [
      'vehicle_model.u1700l',
      'vehicle_system.steering',
      'property.fluid_capacity',
    ],
    expectedClaimClasses: ['capacity', 'fluid'],
  },
  {
    id: 'steering-fluid-type',
    query: 'What fluid type does the U435 steering use?',
    expectedConceptKeys: [
      'vehicle_model.u435',
      'vehicle_system.steering',
      'property.fluid_specification',
    ],
    expectedClaimClasses: ['fluid'],
  },
  {
    id: 'portal-hub-leak',
    query: 'My portal hub is leaking oil',
    expectedConceptKeys: [
      'vehicle_system.axles',
      'component.portal_hub',
      'symptom.external_fluid_leak',
    ],
    expectedClaimClasses: ['diagnostic_cause', 'fluid', 'safety_warning'],
  },
  {
    id: 'wheel-hub-torque',
    query: 'What is the wheel hub tightening torque?',
    expectedConceptKeys: [
      'vehicle_system.axles',
      'component.portal_hub',
      'property.torque',
    ],
    expectedClaimClasses: ['torque'],
  },
  {
    id: 'differential-capacity',
    query: 'Differential oil capacity for a U1700L',
    expectedConceptKeys: [
      'vehicle_model.u1700l',
      'vehicle_system.axles',
      'component.differential',
      'property.fluid_capacity',
    ],
    expectedClaimClasses: ['capacity', 'fluid'],
  },
  {
    id: 'brake-caliper-bleed',
    query: 'How do I bleed the brake caliper?',
    expectedConceptKeys: [
      'vehicle_system.brakes',
      'component.brake_caliper',
      'operation.bleed',
    ],
    expectedClaimClasses: ['procedure_step', 'safety_warning'],
  },
  {
    id: 'air-compressor-pressure',
    query: 'The air compressor has low pressure',
    expectedConceptKeys: [
      'vehicle_system.compressed_air',
      'component.air_compressor',
      'symptom.low_pressure',
      'property.operating_pressure',
    ],
    expectedClaimClasses: ['diagnostic_cause', 'specification', 'safety_warning'],
  },
  {
    id: 'coolant-pump-overheating',
    query: 'Could the coolant pump cause overheating?',
    expectedConceptKeys: [
      'vehicle_system.cooling',
      'component.water_pump',
      'symptom.overheating',
    ],
    expectedClaimClasses: ['diagnostic_cause', 'safety_warning'],
  },
  {
    id: 'injection-pump-no-start',
    query: "The injection pump is fitted but the engine won't start",
    expectedConceptKeys: [
      'vehicle_system.engine',
      'component.fuel_injection_pump',
      'symptom.no_start',
    ],
    expectedClaimClasses: ['diagnostic_cause', 'safety_warning'],
  },
  {
    id: 'transfer-case-fluid',
    query: 'How much fluid does the transfer box take?',
    expectedConceptKeys: [
      'vehicle_system.transmission',
      'component.transfer_case',
      'property.fluid_capacity',
    ],
    expectedClaimClasses: ['capacity', 'fluid'],
  },
  {
    id: 'clutch-replacement',
    query: 'How do I replace the clutch?',
    expectedConceptKeys: [
      'vehicle_system.transmission',
      'component.clutch',
      'operation.replace',
    ],
    expectedClaimClasses: ['procedure_step', 'safety_warning'],
  },
  {
    id: 'alternator-part-number',
    query: 'What is the generator part number?',
    expectedConceptKeys: [
      'vehicle_system.electrical',
      'component.alternator',
      'property.part_number',
    ],
    expectedClaimClasses: ['part_number'],
  },
  {
    id: 'steering-pump-context',
    query: 'The steering pump is leaking',
    expectedConceptKeys: [
      'vehicle_system.steering',
      'component.power_steering_pump',
      'symptom.external_fluid_leak',
    ],
    expectedClaimClasses: ['diagnostic_cause', 'safety_warning'],
    forbiddenConceptKeys: ['component.water_pump'],
  },
  {
    id: 'cooling-pump-context',
    query: 'The cooling pump is leaking',
    expectedConceptKeys: [
      'vehicle_system.cooling',
      'component.water_pump',
      'symptom.external_fluid_leak',
    ],
    expectedClaimClasses: ['diagnostic_cause', 'safety_warning'],
    forbiddenConceptKeys: ['component.power_steering_pump'],
  },
  {
    id: 'ambiguous-pump',
    query: 'The pump is leaking',
    expectedConceptKeys: ['symptom.external_fluid_leak'],
    expectedClaimClasses: ['diagnostic_cause', 'safety_warning'],
    expectedAmbiguityTerms: ['pump'],
    forbiddenConceptKeys: ['component.water_pump', 'component.power_steering_pump'],
  },
  {
    id: 'steering-exploded-view',
    query: 'Show me the steering gearbox exploded view',
    expectedConceptKeys: [
      'vehicle_system.steering',
      'component.steering_gear',
    ],
    expectedClaimClasses: ['component_identity'],
  },
  {
    id: 'portal-hub-part-number',
    query: 'I need the part no for the portal hub',
    expectedConceptKeys: [
      'vehicle_system.axles',
      'component.portal_hub',
      'property.part_number',
    ],
    expectedClaimClasses: ['part_number'],
  },
];
