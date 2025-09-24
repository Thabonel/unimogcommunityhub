CREATE TABLE IF NOT EXISTS manual_index_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manual_id UUID,
    volume INTEGER,
    group_code TEXT,
    group_title TEXT,
    page_range TEXT,
    topics JSONB,
    is_available BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO manual_index_metadata (manual_id, volume, group_code, group_title, page_range, topics, is_available)
VALUES
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 1, '00', 'General', '1-43', '["Installation survey", "Vehicle dimensions", "Speeds and ratios", "Weights and loads", "Service products and capacities"]', true),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 1, '01', 'Engine', '44-85', '["Engine removal/installation", "Cylinder head", "Pistons and connecting rods", "Crankshaft", "Engine housing"]', true),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 1, '09', 'Air Systems', '86-112', '["Air filter (09.8)", "Turbocharger 3LKs (09.13)", "Turbocharger To 4 B 27 (09.14)"]', true),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 1, '13', 'Air Compressor', '113+', '["General installation", "Technical data", "Sectional views"]', true),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '26', 'Clutch', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '27', 'Transmission', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '30', 'Transfer case', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '35', 'Front axle and portal hubs', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '40', 'Rear axle and differential', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '42', 'Brakes', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '46', 'Steering', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '50', 'Frame and suspension', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '54', 'Wheels and tires', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false),
('406397b8-3fe4-4e9a-8dd5-f9677c61a3ae', 2, '60', 'Electrical system', 'Not Available', '["Content in Volume 2 - Not Currently Available"]', false);