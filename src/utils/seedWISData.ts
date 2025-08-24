import { supabase } from '@/lib/supabase-client';

// This function seeds the WIS tables with sample data if they're empty
export async function seedWISData() {
  try {
    // Check if data already exists
    const { data: existingModels } = await supabase
      .from('wis_models')
      .select('id')
      .limit(1);

    if (existingModels && existingModels.length > 0) {
      console.log('WIS data already exists, skipping seed');
      return;
    }

    console.log('Seeding WIS data...');

    // Insert vehicle models
    const { error: modelsError } = await supabase
      .from('wis_models')
      .insert([
        {
          id: '11111111-1111-1111-1111-111111111111',
          model_code: 'U1300L',
          model_name: 'Unimog U1300L',
          year_from: 1975,
          year_to: 1991,
          engine_code: 'OM366',
          description: 'Medium-duty Unimog with OM366 engine'
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          model_code: 'U1700L',
          model_name: 'Unimog U1700L (435 Series)',
          year_from: 1975,
          year_to: 1991,
          engine_code: 'OM366A',
          description: 'Heavy-duty Unimog with OM366A engine - Most common in Australia'
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          model_code: 'U2150L',
          model_name: 'Unimog U2150L',
          year_from: 1975,
          year_to: 1991,
          engine_code: 'OM366LA',
          description: 'Extra heavy-duty Unimog with OM366LA engine'
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          model_code: 'U435',
          model_name: 'Unimog U435',
          year_from: 1996,
          year_to: 2000,
          engine_code: 'OM904LA',
          description: 'Modern medium-duty Unimog with OM904LA engine'
        },
        {
          id: '55555555-5555-5555-5555-555555555555',
          model_code: 'U500',
          model_name: 'Unimog U500',
          year_from: 2000,
          year_to: 2013,
          engine_code: 'OM904LA',
          description: 'Current generation medium-duty Unimog'
        }
      ]);

    if (modelsError) {
      console.error('Error inserting models:', modelsError);
      return;
    }

    // Insert procedures
    const { error: proceduresError } = await supabase
      .from('wis_procedures')
      .insert([
        {
          vehicle_id: '22222222-2222-2222-2222-222222222222', // U1700L
          procedure_code: 'ENG001',
          title: 'Engine Oil Change - OM366A',
          category: 'Engine',
          subcategory: 'Maintenance',
          description: 'Regular engine oil and filter replacement for OM366A engine',
          content: `PROCEDURE: Engine Oil Change - OM366A Engine (U1700L / 435 Series)

TOOLS REQUIRED:
- Oil drain pan (12L capacity)
- Socket wrench set (19mm, 24mm)
- Oil filter wrench
- Funnel
- Clean rags
- Safety glasses

MATERIALS REQUIRED:
- Engine oil: 15W-40 mineral (11 liters)
- Oil filter: Part #366-180-00-09
- Drain plug gasket: Part #000-989-25-03

PROCEDURE:
1. Position vehicle on level surface and engage parking brake
2. Allow engine to cool to safe working temperature (60-70°C)
3. Position oil drain pan under engine oil drain plug
4. Remove drain plug with 19mm socket and allow oil to drain completely (15-20 minutes)
5. While oil drains, locate oil filter (mounted on left side of engine)
6. Remove old oil filter using oil filter wrench (turn counterclockwise)
7. Clean filter mounting surface and apply thin layer of new oil to new filter gasket
8. Install new filter - hand tighten until gasket contacts mounting surface, then turn additional 3/4 turn
9. Clean and inspect drain plug and gasket - replace gasket if damaged
10. Reinstall drain plug with new gasket and tighten to 45 Nm
11. Add 10 liters of new oil through oil filler cap using funnel
12. Replace oil filler cap and start engine
13. Run engine for 2-3 minutes and check for leaks
14. Stop engine and wait 5 minutes
15. Check oil level and add remaining oil as needed (total capacity 11 liters)
16. Record service in vehicle logbook`,
          difficulty_level: 2,
          estimated_time_minutes: 45,
          tools_required: ['Oil drain pan', 'Socket wrench set', 'Oil filter wrench', 'Funnel']
        },
        {
          vehicle_id: '22222222-2222-2222-2222-222222222222', // U1700L
          procedure_code: 'TRANS001',
          title: 'Transmission Fluid Change - UG3/40',
          category: 'Transmission',
          subcategory: 'Maintenance',
          description: 'Transmission fluid replacement for UG3/40 gearbox',
          content: `PROCEDURE: Transmission Fluid Change - UG3/40 Gearbox

SPECIFICATIONS:
- Gearbox Type: UG3/40-8/7.5 (8 forward, 4 reverse gears)
- Fluid Capacity: 8.5 liters
- Fluid Type: ATF Dexron II or MB 236.6

TOOLS REQUIRED:
- 14mm Allen key
- Oil drain pan (10L capacity)
- Fluid pump or funnel with flexible hose
- Clean rags

PROCEDURE:
1. Drive vehicle for 10-15 minutes to warm transmission fluid
2. Position vehicle on level surface, engage parking brake
3. Place drain pan under transmission drain plug (bottom of gearbox)
4. Remove filler plug first (side of gearbox) to ensure it can be removed
5. Remove drain plug with 14mm Allen key
6. Allow fluid to drain completely (20-30 minutes)
7. Clean drain plug and check seal
8. Reinstall drain plug and tighten to 40 Nm
9. Fill transmission with new ATF through filler hole using pump
10. Fill until fluid begins to overflow from filler hole
11. Start engine and engage each gear for 5 seconds
12. Return to neutral and check fluid level
13. Top up if necessary until fluid runs from filler hole
14. Replace filler plug and tighten to 40 Nm
15. Test drive and check for leaks`,
          difficulty_level: 3,
          estimated_time_minutes: 60,
          tools_required: ['14mm Allen key', 'Oil drain pan', 'Fluid pump']
        },
        {
          vehicle_id: '22222222-2222-2222-2222-222222222222', // U1700L
          procedure_code: 'AXLE001',
          title: 'Portal Axle Oil Change',
          category: 'Axles',
          subcategory: 'Maintenance',
          description: 'Portal hub reduction gear oil change procedure',
          content: `PROCEDURE: Portal Axle Hub Oil Change

IMPORTANT: Each wheel hub contains separate oil that must be changed

SPECIFICATIONS:
- Oil Type: SAE 90 Hypoid gear oil
- Capacity per hub: 0.75 liters
- Total for all 4 hubs: 3 liters

TOOLS REQUIRED:
- 14mm Allen key
- Small oil drain pan
- Oil pump or syringe
- Jack and jack stands

PROCEDURE FOR EACH HUB:
1. Position wheel so that drain plug is at lowest point
2. Place drain pan under portal hub
3. Remove filler plug (upper plug) first
4. Remove drain plug (lower plug) and drain oil
5. Inspect drained oil for metal particles (indicates wear)
6. Clean and reinstall drain plug with new copper washer
7. Tighten drain plug to 35 Nm
8. Fill hub with 0.75L of SAE 90 gear oil through filler hole
9. Oil should reach bottom of filler hole
10. Reinstall filler plug with new washer, tighten to 35 Nm
11. Rotate wheel several times to distribute oil
12. Repeat for all four hubs

INSPECTION POINTS:
- Check for oil leaks around hub seals
- Inspect CV boot condition
- Check wheel bearing play`,
          difficulty_level: 2,
          estimated_time_minutes: 90,
          tools_required: ['14mm Allen key', 'Oil drain pan', 'Oil pump', 'Jack and stands']
        }
      ]);

    if (proceduresError) {
      console.error('Error inserting procedures:', proceduresError);
    }

    // Insert parts
    const { error: partsError } = await supabase
      .from('wis_parts')
      .insert([
        {
          vehicle_id: '22222222-2222-2222-2222-222222222222', // U1700L
          part_number: '366-180-00-09',
          part_name: 'Oil Filter - OM366A',
          category: 'Engine',
          subcategory: 'Filters',
          description: 'Engine oil filter for OM366A engine',
          price_estimate: 45,
          availability_status: 'In Stock'
        },
        {
          vehicle_id: '22222222-2222-2222-2222-222222222222',
          part_number: '000-989-25-03',
          part_name: 'Drain Plug Gasket',
          category: 'Engine',
          subcategory: 'Gaskets',
          description: 'Copper sealing washer for oil drain plug',
          price_estimate: 3,
          availability_status: 'In Stock'
        },
        {
          vehicle_id: '22222222-2222-2222-2222-222222222222',
          part_number: '403-350-01-35',
          part_name: 'Portal Hub Seal',
          category: 'Axles',
          subcategory: 'Seals',
          description: 'Portal axle hub oil seal',
          price_estimate: 85,
          availability_status: 'Special Order'
        },
        {
          vehicle_id: '22222222-2222-2222-2222-222222222222',
          part_number: 'A000-989-98-25',
          part_name: 'ATF Dexron II',
          category: 'Transmission',
          subcategory: 'Fluids',
          description: 'Automatic transmission fluid for UG3/40 gearbox',
          price_estimate: 25,
          availability_status: 'In Stock'
        }
      ]);

    if (partsError) {
      console.error('Error inserting parts:', partsError);
    }

    // Insert bulletins
    const { error: bulletinsError } = await supabase
      .from('wis_bulletins')
      .insert([
        {
          vehicle_id: '22222222-2222-2222-2222-222222222222', // U1700L
          bulletin_number: 'TSB-2023-001',
          title: 'Portal Axle Seal Replacement Update',
          category: 'Axles',
          severity: 'Medium',
          description: 'Updated procedure for portal axle seal replacement to prevent premature wear',
          content: `SERVICE BULLETIN: Portal Axle Seal Replacement

MODELS AFFECTED: All U1700L (435 Series) vehicles

ISSUE:
Premature wear of portal axle seals has been reported, leading to oil leaks.

CAUSE:
Improper installation technique causing seal damage during fitting.

SOLUTION:
1. Use only genuine Mercedes-Benz seals (Part #403-350-01-35)
2. Apply thin layer of assembly paste to seal outer diameter
3. Use proper seal installation tool (W124 589 00 61 00)
4. Ensure hub surface is clean and free of burrs
5. Install seal squarely using gentle tapping - do not force

PARTS REQUIRED:
- Portal hub seal: 403-350-01-35 (4 required)
- Assembly paste: A001-989-25-51

WARRANTY:
This repair is covered under warranty for vehicles within warranty period.`,
          date_issued: new Date('2023-06-15'),
          status: 'Active'
        }
      ]);

    if (bulletinsError) {
      console.error('Error inserting bulletins:', bulletinsError);
    }

    console.log('WIS data seeded successfully');
  } catch (error) {
    console.error('Error seeding WIS data:', error);
  }
}