-- Barry Knowledge Base Sample Data
-- Run this AFTER creating the table to add initial entries

INSERT INTO barry_knowledge_base (question_keywords, manual_references, barry_response_template, priority) VALUES
(ARRAY['portal', 'hub', 'front', 'wheel', 'seal'],
 '{"manual": "U435", "pages": [555], "section": "19. Front Portal Hub", "pdf": "U435_19_Wheel_Hub_Front.pdf"}',
 'For front portal hub seal replacement on your U435, refer to Manual Section 19 (page 555).',
 10);

INSERT INTO barry_knowledge_base (question_keywords, manual_references, barry_response_template, priority) VALUES
(ARRAY['portal', 'hub', 'rear', 'wheel', 'seal'],
 '{"manual": "U435", "pages": [651], "section": "22. Rear Portal Hub", "pdf": "U435_22_Wheel_Hub_Rear.pdf"}',
 'Rear portal hub seal procedures are detailed in Manual Section 22 (page 651).',
 10);

INSERT INTO barry_knowledge_base (question_keywords, manual_references, barry_response_template, priority) VALUES
(ARRAY['brake', 'hydraulic', 'system', 'bleeding'],
 '{"manual": "U435", "pages": [710, 755], "section": "Brake Systems", "pdf": "U435_23_Service_Brakes.pdf"}',
 'Hydraulic brake system bleeding procedures are covered in Manual pages 710-755.',
 8);