-- Populate Barry Knowledge Base with Sample Data
-- The table already exists, this just adds sample entries
-- Run this in Supabase SQL Editor

-- Insert sample knowledge entries
INSERT INTO public.barry_knowledge_base
(question_keywords, manual_references, barry_response_template, priority)
VALUES
-- Portal Hub Seals (Front)
(
  ARRAY['portal hub seals', 'hub seal', 'portal seal', 'wheel hub oil seal', 'wheel hub seals', 'portal hub seal replacement', 'front portal hub'],
  '{"manual": "U435", "pages": [555, 560], "section": "Section 19 - Portal Hub Front", "pdf": "U435_19_Wheel_Hub_Front.pdf", "storage_path": "U435_19_Wheel_Hub_Front.pdf"}',
  'Portal hub seal replacement is covered in U435 Manual Section 19 (Portal Hub Front), page 555. The procedure includes hub disassembly, seal extraction, and reassembly with proper torque specifications. Review the exploded diagram before starting.',
  100
),

-- Portal Hub Seals (Rear)
(
  ARRAY['rear portal hub seals', 'rear hub seal', 'rear portal seal', 'rear wheel hub seal', 'portal hub rear'],
  '{"manual": "U435", "pages": [651, 655], "section": "Section 22 - Portal Hub Rear", "pdf": "U435_22_Wheel_Hub_Rear.pdf", "storage_path": "U435_22_Wheel_Hub_Rear.pdf"}',
  'Rear portal hub seal procedures are detailed in U435 Manual Section 22 (Portal Hub Rear), page 651. Follow the step-by-step disassembly and reassembly sequence with specified torque values.',
  100
),

-- Hydraulic Brake Bleeding
(
  ARRAY['hydraulic brake bleeding', 'brake bleeding', 'hydraulic brakes', 'brake system bleeding', 'bleed brakes'],
  '{"manual": "U435", "pages": [710, 755], "section": "Brake Systems", "pdf": "U435_23_Service_Brakes.pdf", "storage_path": "U435_23_Service_Brakes.pdf"}',
  'Hydraulic brake system bleeding procedures are covered in U435 Manual pages 710-755. This includes proper bleeding sequence, fluid specifications, and system testing procedures.',
  80
),

-- Engine Oil Change
(
  ARRAY['engine oil change', 'oil change', 'engine oil', 'om366 oil change', 'oil service'],
  '{"manual": "U435", "pages": [120, 135], "section": "Engine Service", "pdf": "U435_05_Engine_OM366.pdf", "storage_path": "U435_05_Engine_OM366.pdf"}',
  'Engine oil change procedures for the OM366 engine are detailed in U435 Manual pages 120-135. Includes oil capacity, filter replacement, and service intervals.',
  70
),

-- Transmission Service
(
  ARRAY['transmission service', 'gearbox oil', 'transmission oil change', 'manual transmission service'],
  '{"manual": "U435", "pages": [200, 220], "section": "Transmission Service", "pdf": "U435_08_Manual_Transmission.pdf", "storage_path": "U435_08_Manual_Transmission.pdf"}',
  'Manual transmission service procedures are covered in U435 Manual pages 200-220. Includes oil specifications, drain and fill procedures, and adjustment checks.',
  70
)

ON CONFLICT DO NOTHING;

-- Verify the entries were added
SELECT
  'Sample data added successfully' as status,
  COUNT(*) as total_entries,
  MAX(priority) as highest_priority
FROM public.barry_knowledge_base;

-- Show the entries
SELECT
  question_keywords[1] as main_keyword,
  (manual_references->>'section') as manual_section,
  (manual_references->>'pages') as pages,
  priority
FROM public.barry_knowledge_base
ORDER BY priority DESC;