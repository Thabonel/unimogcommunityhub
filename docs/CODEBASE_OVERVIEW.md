# Codebase Overview

This document describes the structure and core concepts of the Unimog Community Hub codebase so language models and developers can quickly orient themselves.

## Application Summary
- **Framework**: React 18 with TypeScript, built using Vite.
- **Styling & UI**: Tailwind CSS with shadcn/ui and Radix primitives.
- **Backend**: Supabase for authentication, database, storage, and Edge Functions.
- **Integrations**: Mapbox for mapping, OpenAI for chat features, Stripe for payments.
- **Offline support**: Service worker with an offline sync queue.

## Entry Points
- `src/main.tsx` mounts the React application and imports global styles.
- `src/App.tsx` initializes i18n, registers the service worker, handles offline state, and wraps the router in providers such as `AuthProvider`, `LocalizationProvider`, and `MapTokenProvider`.
- `src/routes/index.tsx` composes route groups (admin, knowledge, marketplace, protected, and public) using `createBrowserRouter`.

## Directory Structure
```
/docs        – Documentation and project guides
/public      – Static assets
/scripts     – Automation and maintenance scripts
/src         – Front‑end source code
/supabase    – Edge Functions, migrations, and configuration
```

### `/src` Highlights
- **components/** – Reusable UI and domain components (auth, knowledge, marketplace, messages, profile, trips, vehicle, etc.) with `components/ui` containing shadcn primitives.
- **contexts/** – React context providers like `AuthContext`, `LocalizationContext`, and `MapTokenContext`.
- **hooks/** – Custom hooks such as `use-service-worker` and `use-offline` for PWA features.
- **pages/** – Route components including Dashboard, Marketplace, Knowledge Base, Profile, and authentication pages.
- **routes/** – Route configuration split across domain-specific modules and aggregated in `index.tsx`.
- **services/** – Data access and integration logic (Supabase CRUD, ChatGPT, analytics, offline queue).
- **lib/** – Shared libraries including `supabase-client`, `i18n`, and `react-query` setup.
- **config/** – Centralized environment variable mapping in `env.ts`.
- **utils/, data/, types/** – Helper functions, static data, and TypeScript definitions.

### Supabase Backend (`/supabase`)
Contains the Supabase project configuration, SQL migrations, and Edge Functions. Functions include authentication utilities, Stripe checkout and webhooks, translation, trip webhooks, and email helpers.

## Key Features
- **Authentication** via Supabase with session persistence (`src/contexts/AuthContext.tsx`).
- **Internationalization** powered by i18next with country and language preferences (`src/lib/i18n.ts`).
- **Map integration** using Mapbox and a Map Token context for secure token handling.
- **Offline capabilities** through a service worker and an offline sync queue (`src/services/offline/offlineSync.ts`).
- **ChatGPT integration** for conversational features and content generation.

## Development
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Lint the project: `npm run lint`
4. Build for production: `npm run build`

---
This overview should provide enough context for an LLM to navigate and reason about the application's structure and behavior.
