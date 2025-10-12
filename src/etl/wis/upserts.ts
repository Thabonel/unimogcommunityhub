import { SupabaseClient } from '@supabase/supabase-js';
import * as path from 'path';
import { sha256File } from './utils';

export async function upsertProcedureMinimal(
  supabase: SupabaseClient,
  filePath: string,
  sourceUrl: string,
  parsed: { title: string; steps: { step_number: number; instruction: string }[] }
): Promise<string> {
  const procedure_code = path.basename(filePath, path.extname(filePath)).slice(0, 40);
  const source_fingerprint = await sha256File(filePath);
  const { data: proc, error: pErr } = await supabase
    .from('wis_procedures')
    .upsert(
      [
        {
          procedure_code,
          title: parsed.title,
          description: null,
          overview: null,
          estimated_time_hours: null,
          difficulty_level: 2,
          labor_category: 'maintenance',
          safety_warnings: [],
          special_notes: null,
          status: 'active',
          source_path: filePath,
          source_url: sourceUrl,
          source_fingerprint,
        },
      ],
      { onConflict: 'source_fingerprint' }
    )
    .select()
    .single();
  if (pErr) throw pErr;

  if (parsed.steps?.length) {
    const payload = parsed.steps.map(s => ({ procedure_id: proc.id, step_number: s.step_number, instruction: s.instruction }));
    const { error: sErr } = await supabase.from('wis_procedure_steps').upsert(payload, { onConflict: 'procedure_id,step_number' });
    if (sErr) throw sErr;
  }
  return proc.id as string;
}

