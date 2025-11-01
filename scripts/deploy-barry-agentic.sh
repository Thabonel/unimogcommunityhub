#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Deploying chat-with-barry-agentic edge function..."

if ! command -v supabase >/dev/null 2>&1; then
  echo "❌ Supabase CLI not found. Install from https://supabase.com/docs/reference/cli/installing" >&2
  exit 1
fi

echo "📦 Ensuring config.toml with feature flags is present..."
test -f supabase/functions/chat-with-barry-agentic/config.toml || {
  echo "❌ Missing config file: supabase/functions/chat-with-barry-agentic/config.toml" >&2
  exit 1
}

echo "🔑 Checking Anthropic API key (env var ANTHROPIC_API_KEY)"
if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  echo "⚠️  ANTHROPIC_API_KEY is not set in your shell. Ensure it’s configured in Supabase Function secrets or your environment." >&2
fi

echo "📤 Deploying..."
supabase functions deploy chat-with-barry-agentic

echo "✅ Deployed chat-with-barry-agentic"
if [[ -n "${SUPABASE_URL:-}" ]]; then
  echo "   Test endpoint: $SUPABASE_URL/functions/v1/chat-with-barry-agentic"
fi
