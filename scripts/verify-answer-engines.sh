#!/usr/bin/env bash

# Verify AI Router, Streaming, and Canonical APIs
# Usage:
#   SUPABASE_URL=... \
#   SUPABASE_ANON_KEY=... \
#   ADMIN_JWT=... \
#   ./scripts/verify-answer-engines.sh
#
# Notes:
# - ADMIN_JWT is required for ai-router tests (Authorization protected).
# - Canonical endpoints can be tested without ADMIN_JWT; logs query requires ADMIN_JWT.

set -u

SUPABASE_URL=${SUPABASE_URL:-}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-}
ADMIN_JWT=${ADMIN_JWT:-}

PASS=0
FAIL=0

cyan()  { printf "\033[36m%s\033[0m\n" "$1"; }
green() { printf "\033[32m%s\033[0m\n" "$1"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$1"; }
red()   { printf "\033[31m%s\033[0m\n" "$1"; }

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    red "Missing dependency: $1"
    exit 1
  fi
}

need curl

test_ok() {
  local name=$1; shift
  if "$@"; then
    green "✔ $name"
    PASS=$((PASS+1))
  else
    red "✖ $name"
    FAIL=$((FAIL+1))
  fi
}

assert_http_code() {
  local expected=$1; shift
  local code=$1; shift
  [[ "$code" == "$expected" ]]
}

header() { cyan "\n== $1 =="; }

if [[ -z "$SUPABASE_URL" ]]; then
  red "SUPABASE_URL is required"
  exit 1
fi

header "AI Router: Decision (prefer speed)"
if [[ -z "${ADMIN_JWT}" ]]; then
  yellow "Skipping (ADMIN_JWT not set)"
else
  code=$(curl -s -o /tmp/ai_decision.json -w "%{http_code}" \
    -X POST "$SUPABASE_URL/functions/v1/ai-router" \
    -H "Authorization: Bearer $ADMIN_JWT" \
    -H "Content-Type: application/json" \
    -d '{"mode":"decision","input":"Quick summary about Unimogs","constraints":{"preferSpeed":true}}')
  test_ok "ai-router decision HTTP 200" assert_http_code 200 "$code"
  if command -v jq >/dev/null 2>&1; then
    jq '.decision' /tmp/ai_decision.json || true
  else
    cat /tmp/ai_decision.json || true
  fi
fi

header "AI Router: Streaming Generate (OpenAI)"
if [[ -z "${ADMIN_JWT}" ]]; then
  yellow "Skipping (ADMIN_JWT not set)"
else
  # Read a few SSE lines and ensure we see at least one 'data: '
  if curl -N -s \
    -X POST "$SUPABASE_URL/functions/v1/ai-router" \
    -H "Authorization: Bearer $ADMIN_JWT" \
    -H "Content-Type: application/json" \
    -d '{"mode":"generate","input":"Write one sentence about Unimogs","constraints":{"preferSpeed":true},"stream":true}' \
    | (grep -m1 '^data: ' >/dev/null); then
    green "✔ ai-router streaming produced data lines"
    PASS=$((PASS+1))
  else
    red "✖ ai-router streaming did not produce data lines"
    FAIL=$((FAIL+1))
  fi
fi

header "Canonical: Model JSON-LD + ETag 304"
etag=$(curl -sD - \
  -H "Accept: application/ld+json" \
  "$SUPABASE_URL/functions/v1/canonical?type=model&slug=U1700L" \
  -o /tmp/canon_model.json | awk '/^ETag:/{print $2}' | tr -d '\r')
if [[ -n "$etag" ]]; then
  green "✔ Received ETag: $etag"; PASS=$((PASS+1))
  code=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "If-None-Match: $etag" \
    "$SUPABASE_URL/functions/v1/canonical?type=model&slug=U1700L")
  test_ok "canonical model If-None-Match -> 304" assert_http_code 304 "$code"
else
  red "✖ No ETag returned by canonical model"; FAIL=$((FAIL+1))
fi

header "Canonical: Procedure JSON"
code=$(curl -s -o /tmp/canon_proc.json -w "%{http_code}" \
  "$SUPABASE_URL/functions/v1/canonical?type=procedure&code=25.20.02")
test_ok "canonical procedure HTTP 200" assert_http_code 200 "$code"

header "Canonical: Part JSON"
code=$(curl -s -o /tmp/canon_part.json -w "%{http_code}" \
  "$SUPABASE_URL/functions/v1/canonical?type=part&slug=A1234567890")
test_ok "canonical part HTTP 200" assert_http_code 200 "$code"

header "Canonical-Search: procedure with model filter"
code=$(curl -s -o /tmp/canon_search.json -w "%{http_code}" \
  "$SUPABASE_URL/functions/v1/canonical-search?q=portal&type=procedure&model_code=U435")
test_ok "canonical-search HTTP 200" assert_http_code 200 "$code"

header "Canonical Logs (admin only)"
if [[ -z "$SUPABASE_ANON_KEY" || -z "$ADMIN_JWT" ]]; then
  yellow "Skipping (SUPABASE_ANON_KEY or ADMIN_JWT not set)"
else
  # Query last 3 log rows via PostgREST
  code=$(curl -s -o /tmp/canon_logs.json -w "%{http_code}" \
    "$SUPABASE_URL/rest/v1/canonical_access_logs?select=created_at,endpoint,entity_type,identifier,status_code,success&order=created_at.desc&limit=3" \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $ADMIN_JWT")
  test_ok "canonical_access_logs HTTP 200" assert_http_code 200 "$code"
  if command -v jq >/dev/null 2>&1; then
    jq . /tmp/canon_logs.json || true
  else
    cat /tmp/canon_logs.json || true
  fi
fi

echo
if [[ $FAIL -eq 0 ]]; then
  green "ALL CHECKS PASSED ($PASS)"
  exit 0
else
  red "SOME CHECKS FAILED ($FAIL failures, $PASS passed)"
  exit 1
fi

