-- Create WIS (Workshop Information System) tables
-- Migration: 20250821120900_create_wis_tables.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wis_models table (parent table for all WIS data)
CREATE TABLE wis_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_code TEXT NOT NULL UNIQUE,
    model_name TEXT NOT NULL,
    year_from INTEGER,
    year_to INTEGER,
    engine_code TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wis_procedures table
CREATE TABLE wis_procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES wis_models(id) ON DELETE CASCADE,
    procedure_code TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    subcategory TEXT,
    description TEXT,
    content TEXT,
    difficulty_level INTEGER DEFAULT 1,
    estimated_time_minutes INTEGER,
    tools_required TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(vehicle_id, procedure_code)
);

-- Create wis_parts table
CREATE TABLE wis_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES wis_models(id) ON DELETE CASCADE,
    part_number TEXT NOT NULL,
    part_name TEXT NOT NULL,
    category TEXT,
    subcategory TEXT,
    description TEXT,
    price_estimate DECIMAL(10,2),
    availability_status TEXT DEFAULT 'unknown',
    superseded_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(vehicle_id, part_number)
);

-- Create wis_bulletins table
CREATE TABLE wis_bulletins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES wis_models(id) ON DELETE CASCADE,
    bulletin_number TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    severity TEXT DEFAULT 'info',
    description TEXT,
    content TEXT,
    date_issued DATE,
    date_updated DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(vehicle_id, bulletin_number)
);

-- Create performance indexes
CREATE INDEX idx_wis_procedures_vehicle_id ON wis_procedures(vehicle_id);
CREATE INDEX idx_wis_procedures_category ON wis_procedures(category);
CREATE INDEX idx_wis_procedures_title_search ON wis_procedures USING gin(to_tsvector('english', title));
CREATE INDEX idx_wis_procedures_content_search ON wis_procedures USING gin(to_tsvector('english', coalesce(content, '')));

CREATE INDEX idx_wis_parts_vehicle_id ON wis_parts(vehicle_id);
CREATE INDEX idx_wis_parts_part_number ON wis_parts(part_number);
CREATE INDEX idx_wis_parts_category ON wis_parts(category);
CREATE INDEX idx_wis_parts_name_search ON wis_parts USING gin(to_tsvector('english', part_name));

CREATE INDEX idx_wis_bulletins_vehicle_id ON wis_bulletins(vehicle_id);
CREATE INDEX idx_wis_bulletins_bulletin_number ON wis_bulletins(bulletin_number);
CREATE INDEX idx_wis_bulletins_title_search ON wis_bulletins USING gin(to_tsvector('english', title));

CREATE INDEX idx_wis_models_model_code ON wis_models(model_code);
CREATE INDEX idx_wis_models_name_search ON wis_models USING gin(to_tsvector('english', model_name));

-- Enable Row Level Security
ALTER TABLE wis_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_bulletins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow read access to authenticated users)
CREATE POLICY "wis_models_read_policy" ON wis_models
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "wis_procedures_read_policy" ON wis_procedures
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "wis_parts_read_policy" ON wis_parts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "wis_bulletins_read_policy" ON wis_bulletins
    FOR SELECT TO authenticated USING (true);

-- Insert initial sample Unimog models
INSERT INTO wis_models (id, model_code, model_name, year_from, year_to, engine_code, description) VALUES
('11111111-1111-1111-1111-111111111111', 'U1300L', 'Unimog U1300L', 1975, 1991, 'OM366', 'Medium-duty Unimog with OM366 engine'),
('22222222-2222-2222-2222-222222222222', 'U1700L', 'Unimog U1700L', 1975, 1991, 'OM366A', 'Heavy-duty Unimog with OM366A engine'),
('33333333-3333-3333-3333-333333333333', 'U2150L', 'Unimog U2150L', 1975, 1991, 'OM366LA', 'Extra heavy-duty Unimog with OM366LA engine'),
('44444444-4444-4444-4444-444444444444', 'U435', 'Unimog U435', 1996, 2000, 'OM904LA', 'Modern medium-duty Unimog with OM904LA engine'),
('55555555-5555-5555-5555-555555555555', 'U500', 'Unimog U500', 2000, 2013, 'OM904LA', 'Current generation medium-duty Unimog');

-- Insert sample procedures
INSERT INTO wis_procedures (vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required) VALUES
('11111111-1111-1111-1111-111111111111', 'ENG001', 'Engine Oil Change - OM366', 'Engine', 'Maintenance', 'Regular engine oil and filter replacement for OM366 engine', 
'PROCEDURE: Engine Oil Change - OM366 Engine

TOOLS REQUIRED:
- Oil drain pan (12L capacity)
- Socket wrench set (19mm, 24mm)
- Oil filter wrench
- Funnel
- Clean rags
- Safety glasses

MATERIALS REQUIRED:
- Engine oil: 10W-40 mineral (11 liters)
- Oil filter: Part #366-180-00-09
- Drain plug gasket: Part #000-989-25-03

SAFETY PRECAUTIONS:
- Engine should be warm but not hot
- Ensure vehicle is on level ground
- Use appropriate lifting equipment
- Wear safety glasses and gloves

PROCEDURE:
1. Position vehicle on level surface and engage parking brake
2. Allow engine to cool to safe working temperature
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
14. Stop engine and wait 5 minutes for oil to settle
15. Check oil level with dipstick and add oil to bring to maximum mark
16. Record service in maintenance log

DISPOSAL:
Used oil and filter must be disposed of at authorized recycling facility.

SERVICE INTERVAL: Every 10,000 km or 500 operating hours', 
2, 45, ARRAY['Oil drain pan', 'Socket wrench set', 'Oil filter wrench', 'Funnel']),

('11111111-1111-1111-1111-111111111111', 'TRN001', 'Transmission Service - UG8', 'Transmission', 'Maintenance', 'Complete transmission fluid and filter service for UG8 transmission', 
'PROCEDURE: Transmission Service - UG8

This procedure covers the complete service of the UG8 8-speed manual transmission including fluid change and filter replacement.

TOOLS REQUIRED:
- Transmission jack or suitable support
- Socket wrench set (17mm, 19mm, 24mm)
- Torque wrench (10-100 Nm range)
- Oil drain pan (10L capacity)
- Oil suction pump
- Funnel with long spout

MATERIALS REQUIRED:
- Transmission fluid: SAE 85W-90 (8 liters)
- Transmission filter: Part #352-270-00-95
- Gasket set: Part #352-270-01-80
- Thread locker: Loctite 243

PROCEDURE:
1. Warm transmission by driving vehicle for 5-10 minutes
2. Position vehicle on lift and secure
3. Clean area around transmission drain plug and filler plug
4. Remove drain plug and allow fluid to drain completely
5. Remove transmission oil pan bolts in sequence
6. Remove old filter and clean filter housing
7. Install new filter with new gaskets
8. Install oil pan with new gasket, torque bolts to specification
9. Install drain plug with new washer, torque to 35 Nm
10. Fill transmission with new fluid through filler opening
11. Check fluid level and top off as required

SERVICE INTERVAL: Every 80,000 km or 2000 operating hours', 
3, 120, ARRAY['Transmission jack', 'Socket wrench set', 'Torque wrench', 'Oil drain pan']),

('22222222-2222-2222-2222-222222222222', 'BRK001', 'Air Brake System Service', 'Brakes', 'Service', 'Complete air brake system inspection and service procedure', 
'PROCEDURE: Air Brake System Service

SAFETY WARNING: Air brake systems operate under high pressure. Follow all safety procedures.

TOOLS REQUIRED:
- Air pressure gauge (0-12 bar range)
- Basic hand tools
- Brake adjustment tool
- Safety glasses

PROCEDURE:
1. Check system air pressure (should be 8-10 bar)
2. Inspect air lines for damage or leaks
3. Check brake chamber diaphragms
4. Test service brake operation
5. Test parking brake operation
6. Adjust brake shoes if necessary
7. Check brake pad thickness
8. Test emergency brake system

CRITICAL CHECKS:
- Minimum system pressure: 6.5 bar
- Maximum pressure buildup time: 2 minutes from 0-8 bar
- Pressure loss test: Maximum 1 bar drop in 15 minutes

SERVICE INTERVAL: Every 20,000 km or annual inspection', 
3, 90, ARRAY['Air pressure gauge', 'Brake tools', 'Safety glasses']),

('33333333-3333-3333-3333-333333333333', 'HYD001', 'Hydraulic System Diagnostics', 'Hydraulics', 'Diagnostic', 'Complete hydraulic system pressure testing and diagnostics', 
'PROCEDURE: Hydraulic System Diagnostics

This procedure covers comprehensive testing of the hydraulic system including pressure tests, flow rate verification, and component diagnostics.

EQUIPMENT REQUIRED:
- Hydraulic pressure gauge (0-250 bar)
- Flow meter
- Temperature gauge
- System analyzer
- Safety equipment

TEST PROCEDURES:
1. System pressure test at rated RPM
2. Relief valve setting verification  
3. Flow rate measurement at various loads
4. Temperature monitoring during operation
5. Component-specific pressure tests
6. Contamination analysis of hydraulic fluid

SPECIFICATIONS:
- Maximum system pressure: 200 bar
- Relief valve setting: 205 ± 5 bar
- Operating temperature range: 40-80°C
- Filtration level: ISO 18/16/13

COMMON FAULTS:
- Low system pressure: Check pump, relief valve
- High operating temperature: Check cooler, filtration
- Slow operation: Check flow restrictions, fluid level
- Erratic operation: Check contamination, air in system

SERVICE INTERVAL: Every 1000 operating hours or annual', 
4, 150, ARRAY['Hydraulic pressure gauge', 'Flow meter', 'System analyzer']),

('44444444-4444-4444-4444-444444444444', 'ELE001', 'Electronic System Diagnostics', 'Electronics', 'Diagnostic', 'CAN bus and electronic control unit diagnostics for modern Unimogs', 
'PROCEDURE: Electronic System Diagnostics

This procedure covers diagnosis of electronic control systems using diagnostic equipment.

EQUIPMENT REQUIRED:
- Mercedes STAR diagnostic system
- CAN bus analyzer
- Digital multimeter
- Oscilloscope (for advanced diagnostics)

DIAGNOSTIC SEQUENCE:
1. Connect STAR diagnostic system
2. Read fault codes from all control units
3. Perform guided fault finding procedures
4. Check CAN bus communication integrity
5. Verify sensor operations and calibrations
6. Test actuator functions
7. Perform component adaptations if required

COMMON ELECTRONIC ISSUES:
- CAN bus communication errors
- Sensor drift or failure
- Control unit software corruption
- Wiring harness damage
- Ground connection problems

FAULT CODE INTERPRETATION:
- P0xxx: Powertrain codes (engine, transmission)
- B0xxx: Body system codes
- C0xxx: Chassis codes (brakes, steering)
- U0xxx: Network communication codes

Always clear fault codes after repairs and perform test drive to verify repair.', 
4, 60, ARRAY['STAR diagnostic system', 'Multimeter', 'CAN analyzer']);

-- Insert sample parts
INSERT INTO wis_parts (vehicle_id, part_number, part_name, category, subcategory, description, price_estimate, availability_status) VALUES
('11111111-1111-1111-1111-111111111111', '366-180-00-09', 'Engine Oil Filter OM366', 'Engine', 'Filters', 'Spin-on oil filter for OM366 engine', 25.50, 'available'),
('11111111-1111-1111-1111-111111111111', '000-989-25-03', 'Drain Plug Gasket', 'Engine', 'Gaskets', 'Copper washer for oil drain plug', 2.25, 'available'),
('11111111-1111-1111-1111-111111111111', '352-270-00-95', 'Transmission Filter UG8', 'Transmission', 'Filters', 'Internal filter for UG8 transmission', 45.75, 'available'),
('11111111-1111-1111-1111-111111111111', '352-270-01-80', 'Transmission Gasket Set', 'Transmission', 'Gaskets', 'Complete gasket set for transmission service', 32.50, 'available'),
('22222222-2222-2222-2222-222222222222', '366-180-01-09', 'Engine Oil Filter OM366A', 'Engine', 'Filters', 'Spin-on oil filter for OM366A engine', 28.75, 'available'),
('22222222-2222-2222-2222-222222222222', '000-430-00-18', 'Brake Shoe Set', 'Brakes', 'Friction', 'Front brake shoe set for air brakes', 125.00, 'limited'),
('33333333-3333-3333-3333-333333333333', '366-180-02-09', 'Engine Oil Filter OM366LA', 'Engine', 'Filters', 'Heavy-duty oil filter for OM366LA engine', 32.25, 'limited'),
('33333333-3333-3333-3333-333333333333', '001-446-00-17', 'Hydraulic Filter', 'Hydraulics', 'Filters', 'Return line filter for hydraulic system', 65.50, 'available'),
('44444444-4444-4444-4444-444444444444', '904-180-00-09', 'Engine Oil Filter OM904LA', 'Engine', 'Filters', 'Modern spin-on filter for OM904LA engine', 42.50, 'available'),
('44444444-4444-4444-4444-444444444444', 'A000-446-32-15', 'ECU Engine Control Unit', 'Electronics', 'Control Units', 'Engine management ECU for OM904LA', 1850.00, 'special-order'),
('55555555-5555-5555-5555-555555555555', '904-180-00-09', 'Engine Oil Filter OM904LA', 'Engine', 'Filters', 'Modern spin-on filter for OM904LA engine', 42.50, 'available'),
('55555555-5555-5555-5555-555555555555', 'A000-270-33-47', 'CAN Gateway Module', 'Electronics', 'Communication', 'Central gateway for CAN bus communication', 425.75, 'available');

-- Insert sample service bulletins
INSERT INTO wis_bulletins (vehicle_id, bulletin_number, title, category, severity, description, content, date_issued, status) VALUES
('11111111-1111-1111-1111-111111111111', 'SB-U1300-001', 'OM366 Oil Pressure Relief Valve Update', 'Engine', 'important', 'Updated relief valve specification for OM366 engines to prevent oil pressure issues', 
'SERVICE BULLETIN: OM366 Oil Pressure Relief Valve Update

AFFECTED MODELS: U1300L with OM366 engine, chassis numbers 001-999999

ISSUE:
Some vehicles may experience low oil pressure warnings due to premature wear of the oil pressure relief valve spring.

SYMPTOMS:
- Oil pressure warning light activation
- Low oil pressure readings on gauge
- Engine noise under load

SOLUTION:
Replace oil pressure relief valve assembly with updated part number.

PARTS REQUIRED:
- Oil pressure relief valve: Part #366-180-10-57 (supersedes #366-180-10-33)

LABOR TIME: 2.0 hours

WARRANTY: This repair is covered under extended warranty for affected chassis numbers.

EFFECTIVE DATE: 2020-03-15', '2020-03-15', 'active'),

('22222222-2222-2222-2222-222222222222', 'SB-U1700-002', 'Transmission Mount Reinforcement Kit', 'Transmission', 'critical', 'Mandatory installation of transmission mount reinforcement for U1700L models', 
'SERVICE BULLETIN: Transmission Mount Reinforcement Kit

AFFECTED MODELS: All U1700L models, production years 1975-1991

CRITICALITY: MANDATORY - Safety related modification

ISSUE:
Field reports indicate potential transmission mount failure under heavy load conditions, which could result in drivetrain damage or loss of vehicle control.

SOLUTION:
Install transmission mount reinforcement kit on all affected vehicles.

PARTS REQUIRED:
- Transmission mount reinforcement kit: Part #352-240-06-75
- Additional hardware included in kit

LABOR TIME: 4.5 hours

SPECIAL TOOLS: Transmission support fixture

This modification must be performed regardless of current mount condition.

EFFECTIVE DATE: 2021-06-20', '2021-06-20', 'active'),

('44444444-4444-4444-4444-444444444444', 'SB-U435-003', 'CAN Bus Wiring Harness Update', 'Electronics', 'info', 'Information about CAN bus wiring improvements for U435 models', 
'SERVICE BULLETIN: CAN Bus Wiring Harness Update

AFFECTED MODELS: U435 with electronic engine management, chassis 435001-435999

ISSUE:
Improved CAN bus wiring harness design provides better electromagnetic interference (EMI) shielding and connection reliability.

BENEFITS:
- Reduced EMI susceptibility
- Improved connector reliability
- Enhanced diagnostic communication

INSTALLATION:
This update is recommended during scheduled maintenance or when experiencing CAN bus communication faults.

PARTS REQUIRED:
- CAN bus harness assembly: Part #A000-540-33-05

LABOR TIME: 3.5 hours

NOTE: Update requires STAR diagnostic system for control unit programming.

EFFECTIVE DATE: 2022-01-10', '2022-01-10', 'active');

COMMENT ON TABLE wis_models IS 'Unimog vehicle models with specifications';
COMMENT ON TABLE wis_procedures IS 'Workshop procedures and maintenance instructions';
COMMENT ON TABLE wis_parts IS 'Parts catalog with pricing and availability';
COMMENT ON TABLE wis_bulletins IS 'Technical service bulletins and updates';