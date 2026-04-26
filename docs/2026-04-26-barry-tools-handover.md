# Barry Tools — Session Handover

**Date:** 2026-04-26
**Branch:** main
**Last commit on local + staging:** `051e376ab`
**Production Netlify deployed:** `acccb5346`
**Production GitHub (origin/main):** `acc0f2058` ← stale, not synced

---

## TL;DR

- Phase 3 of Barry Tools migration is complete and deployed.
- The `barry-tools` edge function is now the default path for all Barry chat (kill-switch via `VITE_BARRY_TOOLS_DISABLED=true` if rollback needed).
- Legacy functions `chat-with-barry-agentic` and `barry-openclaw` are deprecated but kept for emergency rollback.
- A late-session bug was found: the manual citation URLs were pointing at fabricated filenames (`U435_01_Introduction.pdf` etc.) that don't exist in storage. Fixed by deriving filenames from `manual_title` in `manual_chunks`.
- The `barry-tools` edge function was redeployed to Supabase after the URL fix.
- One unrelated commit was added: invoice OCR Claude model bumped to Haiku 4.5.

---

## Architecture: barry-tools

**File:** `supabase/functions/barry-tools/index.ts` (single-file bundle — Supabase cloud bundler only copies `index.ts`)

**Pipeline:** Native Anthropic tool-use loop (max 5 iterations). Claude picks tools per question. No upfront context stuffing.

**Twelve tools:**
| # | Tool | Phase | Purpose |
|---|------|-------|---------|
| 1 | `lookup_knowledge_base` | 1 | Validated KB cache check |
| 2 | `search_manual` | 1 | U435 workshop manual full-text search |
| 3 | `lookup_user_vehicle` | 1 | User's registered vehicles |
| 4 | `get_weather` | 1 | Open-Meteo current + 7-day forecast |
| 5 | `web_search` | 1 | Brave web search |
| 6 | `search_marketplace` | 1 | Community marketplace listings |
| 7 | `get_events` | 1 | Upcoming community events |
| 8 | `convert_units` | 1 | Local unit conversions |
| 9 | `translate_text` | 1 | Calls translate-text edge function |
| 10 | `search_rps` | 2 | RPS illustrated parts catalog (NIIN lookup) |
| 11 | `find_nearby_services` | 2 | Community vendor directory |
| 12 | `search_community_content` | 2 | Member-uploaded documents |

**Per-tool observability:**
Every tool execution logs to `barry_tool_executions` (latency, success, error code, claude iteration, conversation_id). Aggregated view `barry_tool_stats` is queried by the admin monitor at `/admin → AI Engine`.

**Storage URL builder:**
```ts
function manualStorageUrl(manualTitle: string, pageNumber: number): string {
  if (!manualTitle) return '';
  const filename = manualTitle.replace(/\s+/g, '-') + '.pdf';
  return `${SUPA_STORAGE}/manuals/${filename}#page=${pageNumber}`;
}
```
This matches the convention used elsewhere in the system (manual_title → spaces-to-dashes + .pdf).

---

## Frontend Wiring

### Default path (current state)
`src/hooks/use-barry-openclaw.ts`:
```ts
const BARRY_TOOLS_DISABLED = import.meta.env.VITE_BARRY_TOOLS_DISABLED === 'true';

const response = !BARRY_TOOLS_DISABLED
  ? { ...await callBarryTools({ messages, location, conversationId }), usedOpenClaw: true, fallbackUsed: false }
  : await barryHybridService.chat(messages, location, user?.id);
```

`src/hooks/use-simple-barry.ts` was migrated to `callBarryTools` (was previously calling `chat-with-barry-agentic` directly).

### Response adapter
`src/services/openclaw/barryToolsService.ts` exports:
- `callBarryTools(request)` — invokes the edge function
- `normaliseBarryToolsResponse(data)` — pure function mapping `BarryToolsResponse` → `BarryOpenClawResponse`, with manual-reference dedup (`page_number|storage_url`) and safe defaults for all optional fields.

Tests: `src/__tests__/unit/services/barryToolsService.test.ts` (contract mapping + dedup/defaults).

### Admin monitoring
`src/components/admin/settings/BarryToolsMonitorSection.tsx` queries `barry_tool_stats` view. Mounted in `SiteConfiguration.tsx` under the AI Engine tab below the OpenClaw settings.

---

## Commits Made This Session

```
051e376ab chore: upgrade invoice OCR to Claude Haiku 4.5
acccb5346 fix: replace fabricated CHAPTER_RANGES with real storage URL builder
efa45ead5 refactor: extract normaliseBarryToolsResponse, add dedup and unit tests
a5af00118 Merge pull request #18 from Thabonel/codex/review-code-against-prd
e3222f4e2 Improve Barry tools response normalization and add unit tests   (codex)
b4c99a1b1 fix: Phase 3 review — PostgREST injection, stale closure, auth header
b2df98135 feat(barry): Phase 3 — full migration, monitoring, legacy deprecation
b5b526318 fix(barry-tools): multi-pass review — 8 issues resolved
e61404262 fix(barry-tools): clarify weather system prompt — current vs daily forecast
3dde16157 feat(barry-tools): Phase 2 — add search_rps, find_nearby_services, search_community_content tools
```

---

## Multi-Pass Review Findings (already fixed)

### Phase 1+2 review (commit `b5b526318`)
Eight issues resolved in `barry-tools/index.ts`:
1. Env-var startup validation — fail fast if `ANTHROPIC_API_KEY` / `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` missing.
2. `SUPA_STORAGE` derived from `SUPABASE_URL` env (was hardcoded `ydevatqwkoccxhtejdor`).
3. `WeatherData` interface added — typed cache, removes spread-on-unknown errors.
4. `sanitiseFilterValue()` for PostgREST `or()` filter values (commas in user input would split filter strings at wrong boundary — injection risk).
5. Empty-string guard on `finalText` — fallback message if Claude returns no text.
6. Simplified `stop_reason !== 'tool_use'` check.
7. Dispatch returns `unknown` instead of double JSON serialisation.
8. Removed deliberately-wrong `tokens_used: 0` from `chat_logs` insert.

### Phase 3 review (commit `b4c99a1b1`)
Three issues:
1. **Security:** `toolSearchCommunity` injected raw user input into PostgREST `.or()` filter. Same vector as `find_nearby_services` was. Now sanitised.
2. **Bug:** `sendMessage` in `use-barry-openclaw.ts` had stale closure over `vehicleContext`, `pageContext`, `conversationId` (missing from `useCallback` deps). Fixed.
3. **Robustness:** Auth header parsed with `.replace('Bearer ', '')` — fragile for case/whitespace variations. Switched to `.split(' ')[1] ?? ''`.

### Late-session PDF URL fix (commit `acccb5346`)
**Root cause:** `barry-tools/index.ts` had a hardcoded `CHAPTER_RANGES` map mapping page numbers to invented filenames like `U435_01_Introduction.pdf` ... `U435_20_Wheel_Hub_Rear.pdf`. None of those files exist in the manuals storage bucket, so every citation returned 400 and displayed "PDF Not Available" in the UI.

**Fix:** Removed `CHAPTER_RANGES` and `chapterUrl()`. Added `manualStorageUrl(manual_title, page_number)` which derives the real filename from the `manual_title` field already returned by the `manual_chunks` query (same convention used by the legacy `barry-openclaw` function).

**Edge function redeployed** to Supabase project `ydevatqwkoccxhtejdor` after this commit.

---

## Deployment State

| Surface | State | Commit |
|---------|-------|--------|
| Local `main` | Latest | `051e376ab` |
| `staging/main` (GitHub) | In sync | `051e376ab` |
| Staging Netlify | Auto-deploys from staging push | latest |
| Production Netlify | Deployed | `acccb5346` (one commit behind — OCR bump not yet deployed) |
| `origin/main` (production GitHub) | **STALE** | `acc0f2058` (~10 commits behind) |
| Supabase `barry-tools` function | Deployed | latest including `manualStorageUrl` fix |

---

## Outstanding Items

### 1. Sync `origin/main` with production deploy
`origin/main` is at `acc0f2058`. The production Netlify deploy somehow pulled `acccb5346` (likely from staging repo or a Netlify-side config). The production GitHub repo is now ~10 commits behind what's actually serving users.

**To fix:**
```bash
git push origin main
```
Hook will prompt `🎯 Confirm production deployment? (yes/no):` — must be answered in a real terminal (Claude Code's `!` and `Bash` tool don't allocate a TTY for this hook). After confirmation, this also triggers a fresh production Netlify deploy that includes commit `051e376ab` (the OCR Haiku 4.5 bump).

### 2. Verify the PDF URL fix end-to-end
Ask Barry "how do I change my indicator stalk" (or any technical question that hits `search_manual`) and confirm:
- Citations show real filenames (e.g. `U1700L-Workshop-Manual-Volume-1.pdf`, `G603-Unimog-all-types-Light-Repair.pdf`)
- PDFs actually load instead of showing "PDF Not Available"

If they still 400, the next step is to query `storage.objects` (bucket `manuals`) and compare against distinct `manual_title` values from `manual_chunks`. There may be edge cases (apostrophes, special chars) where `replace(/\s+/g, '-')` doesn't produce the exact filename in storage.

### 3. Voice interface integration
`VoiceInterface.tsx` exists but isn't wired to `barry-tools`. Connecting it would let voice queries flow through the same tool pipeline.

### 4. `runComparison` is now misleading
`use-barry-openclaw.ts` exposes `runComparison`, `getConfig`, `setConfig` from the legacy `barryHybridService`. These compare OpenClaw vs legacy, not barry-tools vs legacy. Either remove them or repurpose for barry-tools vs legacy comparison. Not urgent — they're unused in the UI.

---

## Rollback Procedure

If barry-tools needs to be disabled:

1. **Frontend kill-switch (instant):** Set `VITE_BARRY_TOOLS_DISABLED=true` in Netlify env vars and redeploy. All Barry chat reverts to the legacy `barryHybridService` (which still routes to `chat-with-barry-agentic`).

2. **Revert edge function:** Both legacy edge functions (`chat-with-barry-agentic`, `barry-openclaw`) are still deployed and have a deprecation header but are functional. No action needed beyond the kill-switch.

3. **Remove the kill-switch:** Set `VITE_BARRY_TOOLS_DISABLED=false` (or unset entirely) and redeploy.

---

## Key Files

| File | Purpose |
|------|---------|
| `supabase/functions/barry-tools/index.ts` | Edge function — all 12 tools, native Anthropic tool-use loop |
| `src/services/openclaw/barryToolsService.ts` | Frontend invoker + `normaliseBarryToolsResponse` adapter |
| `src/hooks/use-barry-openclaw.ts` | Main Barry hook — routing logic with kill-switch |
| `src/hooks/use-simple-barry.ts` | Lighter Barry hook (also migrated to barry-tools) |
| `src/components/admin/settings/BarryToolsMonitorSection.tsx` | Admin per-tool execution monitor |
| `src/components/admin/SiteConfiguration.tsx` | Mounts the monitor in the AI Engine tab |
| `src/__tests__/unit/services/barryToolsService.test.ts` | Adapter unit tests (contract + dedup) |

---

## Known Working

- Barry answers technical questions with cited page numbers from `manual_chunks`.
- All 12 tools execute and log to `barry_tool_executions`.
- A/B metrics aggregate in `barry_tool_stats` view.
- Admin can view per-tool stats at `/admin → AI Engine → Barry Tools — Execution Monitor`.
- Conversation context (vehicle + page) is now correctly passed in `sendMessage` (was stale before Phase 3 review).
- PostgREST filter values are sanitised — no injection risk.
- Manual citation URLs now point at real storage files (post commit `acccb5346`).

---

## Database Tables Referenced

- `manual_chunks` (content + manual_title + page_number)
- `barry_knowledge_base` (validated Q&A cache)
- `vehicles` (user vehicle lookup)
- `marketplace_listings`
- `events`
- `rps_parts`, `rps_groups`
- `vendors`
- `community_documents`
- `barry_tool_executions` (per-tool execution log)
- `barry_tool_stats` (aggregated view, admin monitor source)
- `chat_logs` (overall conversation log)

---

## Environment Variables (Supabase Edge)

Required:
- `ANTHROPIC_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:
- `ANTHROPIC_MODEL_TOOLS` (defaults to `claude-haiku-4-5`)
- `BRAVE_API_KEY` (web_search returns "not configured" if absent)

---

## Frontend Environment Variable

- `VITE_BARRY_TOOLS_DISABLED` — set to `'true'` to revert to legacy. Currently unset → barry-tools active.
