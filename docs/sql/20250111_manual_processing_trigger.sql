-- Create table for processing errors
CREATE TABLE IF NOT EXISTS processing_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  error TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for error lookups
CREATE INDEX idx_processing_errors_filename ON processing_errors(filename);
CREATE INDEX idx_processing_errors_resolved ON processing_errors(resolved);

-- RLS policies for processing_errors
ALTER TABLE processing_errors ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage processing errors
CREATE POLICY "Admins can manage processing errors"
  ON processing_errors FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create a function to automatically trigger processing when a PDF is uploaded
CREATE OR REPLACE FUNCTION trigger_manual_processing()
RETURNS TRIGGER AS $$
DECLARE
  processing_url TEXT;
  auth_token TEXT;
BEGIN
  -- Only process PDF files
  IF NEW.metadata->>'mimeType' = 'application/pdf' THEN
    -- Get the Supabase URL and service role key (these should be set as database parameters)
    processing_url := current_setting('app.supabase_url', true) || '/functions/v1/manual-upload-trigger';
    auth_token := current_setting('app.service_role_key', true);
    
    -- Log the trigger event
    RAISE NOTICE 'Manual upload detected: %', NEW.name;
    
    -- We can't directly call the edge function from within a trigger
    -- Instead, we'll insert a record into a processing queue
    INSERT INTO manual_processing_queue (
      filename,
      bucket_id,
      status,
      created_at
    ) VALUES (
      NEW.name,
      NEW.bucket_id,
      'pending',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a processing queue table
CREATE TABLE IF NOT EXISTS manual_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  bucket_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for the queue
CREATE INDEX idx_processing_queue_status ON manual_processing_queue(status);
CREATE INDEX idx_processing_queue_created ON manual_processing_queue(created_at);

-- RLS for processing queue
ALTER TABLE manual_processing_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage processing queue"
  ON manual_processing_queue FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create a function to process the queue (can be called by a cron job)
CREATE OR REPLACE FUNCTION process_manual_queue()
RETURNS INTEGER AS $$
DECLARE
  queue_record RECORD;
  processed_count INTEGER := 0;
BEGIN
  -- Process up to 10 pending items
  FOR queue_record IN 
    SELECT * FROM manual_processing_queue
    WHERE status = 'pending'
    AND attempts < 3
    ORDER BY created_at ASC
    LIMIT 10
  LOOP
    -- Update status to processing
    UPDATE manual_processing_queue
    SET status = 'processing',
        attempts = attempts + 1,
        updated_at = NOW()
    WHERE id = queue_record.id;
    
    -- Here we would trigger the edge function
    -- In practice, this would be done by a scheduled job or external service
    
    processed_count := processed_count + 1;
  END LOOP;
  
  RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger for updated_at
CREATE OR REPLACE FUNCTION update_processing_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_processing_queue_updated_at
  BEFORE UPDATE ON manual_processing_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_processing_queue_updated_at();

-- Note: Storage triggers need to be configured in Supabase Dashboard
-- Go to Storage > Policies > manuals bucket > Database Webhooks
-- Add a webhook that calls the manual-upload-trigger edge function