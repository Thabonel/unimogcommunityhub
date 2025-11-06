BEGIN;

ALTER TABLE public.chat_logs
  ADD COLUMN IF NOT EXISTS intent text,
  ADD COLUMN IF NOT EXISTS entities jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS capability text,
  ADD COLUMN IF NOT EXISTS provider_hits jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS zero_result boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS clarification_asked boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_chat_logs_capability ON public.chat_logs (capability);
CREATE INDEX IF NOT EXISTS idx_chat_logs_zero_result ON public.chat_logs (zero_result) WHERE zero_result = true;
CREATE INDEX IF NOT EXISTS idx_chat_logs_intent ON public.chat_logs (intent);

COMMIT;
