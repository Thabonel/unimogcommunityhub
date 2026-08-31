# OpenClaw Architecture Historical Reference

**Status:** Superseded

The seven-skill OpenClaw runtime described in older project documents is not the canonical Barry request path. It remains in repository history for migration and incident analysis only.

The frontend normally calls the `barry-tools` Supabase edge function. Its current grounding, retrieval, context, safety, citation, diagnostics, and test contracts are documented in `docs/reference/barry-system.md`.

Do not use historical accuracy, model, traffic-routing, fallback, or deployment claims as evidence of current production behavior.
