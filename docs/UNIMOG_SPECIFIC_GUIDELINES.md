
# Unimog Community Hub - Project-Specific Guidelines

This document outlines guidelines and standards specific to the Unimog Community Hub project, complementing the general style guide.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/            # Basic UI elements (from shadcn/ui)
│   ├── shared/        # Shared components used across features
│   ├── [feature]/     # Feature-specific components
├── hooks/             # Custom React hooks
├── contexts/          # React context providers
├── lib/               # Core libraries and utilities
│   ├── types/         # TypeScript type definitions
│   └── supabase.ts    # Supabase client configuration
├── pages/             # Page components that correspond to routes
├── routes/            # Route definitions
├── services/          # Service layer for API interactions
├── styles/            # CSS and Tailwind configuration
├── utils/             # Utility functions
└── main.tsx           # Application entry point
```

## Domain-Specific Terminology

- **Unimog**: Always capitalize when referring to the vehicle
- **Community Hub**: Use title case when referring to our platform

## Component Guidelines

### Naming Conventions

- **Page Components**: Use the pattern `[Name]Page.tsx` (e.g., `DashboardPage.tsx`)
- **Layout Components**: Use the pattern `[Name]Layout.tsx` (e.g., `AdminLayout.tsx`)
- **Feature Components**: Name should clearly indicate feature area (e.g., `VehicleCard.tsx`)

### Component Organization

1. **Import statements**
2. **Type definitions and interfaces**
3. **Component declaration**
4. **Hook declarations** (useState, useEffect, etc.)
5. **Helper functions**
6. **Return statement** (JSX)

Example:
```typescript
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    // Effect code
  }, []);
  
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  
  return (
    <div className="card">
      <h3>{title}</h3>
      {isExpanded ? (
        <p>{description}</p>
      ) : (
        <p>{description.substring(0, 100)}...</p>
      )}
      <Button onClick={toggleExpanded}>
        {isExpanded ? 'Show less' : 'Show more'}
      </Button>
    </div>
  );
}
```

## Styling Guidelines

### Color System

Always use the color variables defined in `tailwind.config.ts`:

- For military/utility theme:
  - `military-green`: Primary color for main actions and headers
  - `camo-brown`: Secondary color for borders and accents
  - `mud-black`: Default text color
  - `khaki-tan`: Accent color for highlights
  - `sand-beige`: Background color
  - `olive-drab`: Secondary button color

Example:
```tsx
<button className="bg-military-green text-white hover:bg-olive-drab">
  Submit
</button>
```

### Responsive Design

- Mobile-first approach for all components
- Use responsive utility classes:
  - `sm:` (640px and up)
  - `md:` (768px and up)
  - `lg:` (1024px and up)
  - `xl:` (1280px and up)

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

## Storage Guidelines

### Supabase Storage Buckets

We use the following storage buckets:
- `avatars`: For user profile avatars (public)
- `profile_photos`: For larger profile images (public)
- `vehicle_photos`: For vehicle images (public)
- `manuals`: For PDF manuals and documentation (private)

Always use the constants defined in `src/lib/supabase.js`:
```typescript
import { STORAGE_BUCKETS } from '@/lib/supabase';

// Later in code
const bucketId = STORAGE_BUCKETS.VEHICLE_PHOTOS;
```

## Error Handling

### UI Error States

- Always provide fallback UI for error states
- Use consistent error messaging across the application
- For form validation errors, display them inline near the relevant field

### Console Logging

- Use descriptive prefixes for console logs to make them easily searchable
- Remove console logs before merging to production
- Use structured console logging for complex objects:
  ```typescript
  console.log('User data:', { id, name, preferences });
  ```

## Performance Guidelines

- Lazy load components that aren't needed on initial render
- Use virtualization for long lists
- Optimize and compress images before upload
- Memoize expensive calculations with useMemo
