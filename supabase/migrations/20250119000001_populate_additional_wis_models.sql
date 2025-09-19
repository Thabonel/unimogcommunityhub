INSERT INTO wis_models (model_code, model_name, description, year_range, active, sort_order) VALUES
('U1700L', 'Unimog U1700L', 'Mercedes-Benz Unimog U1700L - Agricultural and municipal applications with OM366LA engine', '1989-2013', true, 2),
('U2150L', 'Unimog U2150L', 'Mercedes-Benz Unimog U2150L - Heavy-duty applications with OM366LA engine', '1989-2000', true, 3),
('U4000', 'Unimog U4000', 'Mercedes-Benz Unimog U4000 - Implement carrier with OM906LA engine', '2000-2013', true, 4),
('U5000', 'Unimog U5000', 'Mercedes-Benz Unimog U5000 - Heavy implement carrier with OM926LA engine', '2000-2013', true, 5),
('U400', 'Unimog U400', 'Mercedes-Benz Unimog U400 - Municipal and forestry with OM924LA engine', '2000-2017', true, 6),
('U300', 'Unimog U300', 'Mercedes-Benz Unimog U300 - Light municipal applications with OM904LA engine', '1995-2013', true, 7),
('U500', 'Unimog U500', 'Mercedes-Benz Unimog U500 - Municipal and agricultural with OM924LA engine', '2000-2017', true, 8)
ON CONFLICT (model_code) DO NOTHING;