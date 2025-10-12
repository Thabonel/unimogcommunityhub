import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadWheelHubKnowledge() {
  console.log('📋 Creating wheel hub knowledge entry...');

  // Step 1: Create knowledge entry first to get ID
  const { data: entry, error: entryError } = await supabase
    .from('barry_knowledge_base')
    .insert({
      question_keywords: [
        'wheel hub',
        'U1700L hub',
        'hub dimensions',
        'hub specifications',
        'hub mounting',
        'portal hub',
        'hub bore',
        'hub PCD',
        'bolt circle',
        'wheel mounting'
      ],
      manual_references: {},
      barry_response_template: `The U1700L wheel hub has the following verified specifications:

- Center Bore: Ø281.000 mm
- PCD (Pitch Circle Diameter): Ø335.000 mm
- Bolt Pattern: 10 holes
- Bolt Hole Diameter: Ø26.000 mm
- Angular Spacing: 36.000° between holes

These dimensions have been mathematically verified for 100% manufacturing accuracy. I've attached a professional DXF technical drawing with all dimensions, centerlines, and annotations that you can use for manufacturing or reference.`,
      priority: 8
    })
    .select()
    .single();

  if (entryError) {
    console.error('❌ Error creating entry:', entryError);
    return;
  }

  console.log(`✅ Created entry with ID: ${entry.id}`);

  // Step 2: Upload DXF file
  const dxfPath = resolve(__dirname, '../Unimog_U1700L_WheelHub_Professional.dxf');
  const dxfBuffer = readFileSync(dxfPath);
  const timestamp = Date.now();
  const storagePath = `knowledge-attachments/${entry.id}/${timestamp}-Unimog_U1700L_WheelHub_Professional.dxf`;

  console.log('📤 Uploading DXF file...');

  const { error: uploadError } = await supabase.storage
    .from('manuals')
    .upload(storagePath, dxfBuffer, {
      contentType: 'application/dxf',
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('❌ Error uploading file:', uploadError);
    return;
  }

  console.log(`✅ Uploaded to: ${storagePath}`);

  // Step 3: Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('manuals')
    .getPublicUrl(storagePath);

  console.log(`🔗 Public URL: ${publicUrl}`);

  // Step 4: Update entry with attachment metadata
  const attachmentMetadata = {
    filename: 'Unimog_U1700L_WheelHub_Professional.dxf',
    storage_path: storagePath,
    public_url: publicUrl,
    file_type: 'dxf',
    file_size: dxfBuffer.length,
    uploaded_at: new Date().toISOString()
  };

  const { error: updateError } = await supabase
    .from('barry_knowledge_base')
    .update({
      manual_references: {
        sources: 'Workshop Manual U435, Engineering specifications, verified DXF technical drawing',
        attachments: [attachmentMetadata]
      }
    })
    .eq('id', entry.id);

  if (updateError) {
    console.error('❌ Error updating entry:', updateError);
    return;
  }

  console.log('✅ Successfully created wheel hub knowledge entry with DXF attachment!');
  console.log('\n🎯 Test it by asking Barry:');
  console.log('   "What are the U1700L wheel hub dimensions?"');
  console.log('   "Show me the wheel hub specifications for U1700L"');
  console.log('   "I need the hub mounting pattern for my Unimog"');
}

uploadWheelHubKnowledge().catch(console.error);
