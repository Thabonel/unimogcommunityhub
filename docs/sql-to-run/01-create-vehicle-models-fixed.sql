-- WIS Import Step 1: Create Missing Vehicle Models (FIXED UUID VERSION)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

-- First, check existing models
SELECT * FROM wis_models ORDER BY model_code;

-- Insert missing vehicle models with proper UUID casting
INSERT INTO wis_models (id, model_name, model_code, year_from, year_to, engine_code, description) VALUES
-- U20 Series (1950s-1960s)
(uuid('66666666-6666-6666-6666-666666666666'), 'U20', 'U20', 1950, 1965, 'OM636', 'U20 Series - Early agricultural Unimog'),

-- U300/U400 Series (Modern)
(uuid('77777777-7777-7777-7777-777777777777'), 'U300', 'U300', 2000, 2013, 'OM906LA', 'U300 Series - Compact implement carrier, 177 hp'),
(uuid('88888888-8888-8888-8888-888888888888'), 'U400', 'U400', 2000, 2013, 'OM906LA', 'U400 Series - Professional implement carrier, 231 hp'),

-- U216/U218/U219/U318/U418 Series (Modern compact)
(uuid('aaaa0001-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'U216', 'U216', 2013, NULL, 'OM934', 'U216 - Modern compact Unimog, 156 hp'),
(uuid('aaaa0002-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'U218', 'U218', 2013, NULL, 'OM934', 'U218 - Modern compact Unimog, 177 hp'),
(uuid('aaaa0003-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'U219', 'U219', 2013, NULL, 'OM934', 'U219 - Modern compact Unimog, 177 hp'),
(uuid('aaaa0004-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'U318', 'U318', 2013, NULL, 'OM934', 'U318 - Modern professional Unimog, 177 hp'),
(uuid('aaaa0005-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'U418', 'U418', 2013, NULL, 'OM934', 'U418 - Modern professional Unimog, 177 hp'),

-- U404/U406/U411/U413/U416/U421/U424/U425/U427/U430/U437 Series (Classic military/utility)
(uuid('bbbb0001-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U404', 'U404', 1955, 1980, 'M180', 'U404 - Classic military Unimog with petrol engine'),
(uuid('bbbb0002-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U406', 'U406', 1963, 1989, 'OM352', 'U406 - Heavy-duty utility Unimog'),
(uuid('bbbb0003-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U411', 'U411', 1956, 1974, 'OM636', 'U411 - Classic utility Unimog'),
(uuid('bbbb0004-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U413', 'U413', 1976, 1989, 'OM352', 'U413 - Military/utility Unimog'),
(uuid('bbbb0005-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U416', 'U416', 1976, 1989, 'OM352', 'U416 - Heavy-duty utility Unimog'),
(uuid('bbbb0006-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U421', 'U421', 1966, 1989, 'OM352', 'U421 - Classic long wheelbase Unimog'),
(uuid('bbbb0007-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U424', 'U424', 1976, 1991, 'OM352', 'U424 - Agricultural/forestry Unimog'),
(uuid('bbbb0008-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U425', 'U425', 1976, 1993, 'OM366', 'U425 - Heavy-duty agricultural Unimog'),
(uuid('bbbb0009-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U427', 'U427', 1976, 1993, 'OM366', 'U427 - Professional implement carrier'),
(uuid('bbbb0010-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U430', 'U430', 2013, NULL, 'OM936', 'U430 - Modern heavy-duty Unimog, 299 hp'),
(uuid('bbbb0011-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U437', 'U437', 1976, 1993, 'OM366', 'U437 - Heavy-duty long wheelbase'),
(uuid('bbbb0012-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 'U423', 'U423', 1976, 1991, 'OM352', 'U423 - Agricultural Unimog'),

-- U1000/U1100/U1200/U1400/U1450/U1500/U1550/U1600/U1650 Series (Medium duty)
(uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'), 'U1000', 'U1000', 1975, 1989, 'OM352', 'U1000 - Medium-duty truck'),
(uuid('cccc0002-cccc-cccc-cccc-cccccccccccc'), 'U1100', 'U1100', 1975, 1989, 'OM352', 'U1100 - Medium-duty truck'),
(uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'), 'U1200', 'U1200', 1984, 1994, 'OM366', 'U1200 - Medium-duty truck'),
(uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'), 'U1400', 'U1400', 1989, 2000, 'OM366LA', 'U1400 - Medium-duty truck'),
(uuid('cccc0005-cccc-cccc-cccc-cccccccccccc'), 'U1450', 'U1450', 1989, 2000, 'OM366LA', 'U1450 - Medium-duty long wheelbase'),
(uuid('cccc0006-cccc-cccc-cccc-cccccccccccc'), 'U1500', 'U1500', 1975, 1989, 'OM352', 'U1500 - Heavy-duty truck'),
(uuid('cccc0007-cccc-cccc-cccc-cccccccccccc'), 'U1550', 'U1550', 1989, 2000, 'OM366LA', 'U1550 - Heavy-duty long wheelbase'),
(uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'), 'U1600', 'U1600', 1989, 2000, 'OM366LA', 'U1600 - Heavy-duty truck'),
(uuid('cccc0009-cccc-cccc-cccc-cccccccccccc'), 'U1650', 'U1650', 1989, 2000, 'OM366LA', 'U1650 - Heavy-duty long wheelbase'),

-- U2100/U2450 Series (Heavy duty)  
(uuid('dddd0001-dddd-dddd-dddd-dddddddddddd'), 'U2100', 'U2100', 1976, 1989, 'OM352', 'U2100 - Heavy-duty truck'),
(uuid('dddd0002-dddd-dddd-dddd-dddddddddddd'), 'U2450', 'U2450', 1989, 1996, 'OM366LA', 'U2450 - Heavy-duty long wheelbase'),

-- U3000/U4000/U5000 Series (Modern heavy duty)
(uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'), 'U3000', 'U3000', 2002, 2013, 'OM904LA', 'U3000 - Modern medium-duty truck, 177 hp'),
(uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'), 'U4000', 'U4000', 2000, 2013, 'OM906LA', 'U4000 - Modern heavy-duty truck, 218 hp'),
(uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'), 'U5000', 'U5000', 2002, 2013, 'OM906LA', 'U5000 - Modern extreme-duty truck, 272 hp'),
(uuid('eeee0004-eeee-eeee-eeee-eeeeeeeeeeee'), 'U4023', 'U4023', 2013, NULL, 'OM936', 'U4023 - Modern professional truck, 231 hp'),
(uuid('eeee0005-eeee-eeee-eeee-eeeeeeeeeeee'), 'U5023', 'U5023', 2013, NULL, 'OM936', 'U5023 - Modern extreme-duty truck, 231 hp')

ON CONFLICT (model_code) DO NOTHING;

-- Verify all models are created
SELECT COUNT(*) as total_models FROM wis_models;

-- Show all models for verification
SELECT id, model_name, model_code, year_from FROM wis_models ORDER BY model_code;