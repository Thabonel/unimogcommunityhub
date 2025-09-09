
# Unimog Community Hub - Code Style Guide

This document outlines the coding standards and style guidelines for the Unimog Community Hub project.

## General Principles

- **Readability First**: Code should be written for humans to read and understand.
- **Simplicity Over Complexity**: Prefer simple, straightforward solutions over clever, complex ones.
- **Consistency**: Follow established patterns throughout the codebase.

## File Structure

- One component per file
- Use descriptive filenames that match the component name
- Group related components in feature-specific directories
- Keep files small and focused (aim for under 200 lines)

## TypeScript Guidelines

### Naming Conventions

- **Files**: Use kebab-case for file names (`user-profile.tsx`, not `userProfile.tsx`)
- **Components**: Use PascalCase for component names (`UserProfile`, not `userProfile`)
- **Interfaces/Types**: Use PascalCase with a descriptive name (`UserProfileProps`, not `Props`)
- **Variables/Functions**: Use camelCase (`getUserData`, not `GetUserData`)
- **Constants**: Use UPPER_SNAKE_CASE for true constants (`MAX_RETRY_COUNT`)

### Type Definitions

- Prefer interfaces over types for object definitions
- Use explicit return types for functions
- Avoid `any` type; use `unknown` if the type is truly uncertain
- Use union types for variables that can be multiple types

```typescript
// Good
interface UserData {
  id: string;
  name: string;
  age?: number;
}

function fetchUser(id: string): Promise<UserData> {
  // ...
}

// Avoid
function processData(data: any): any {
  // ...
}
```

## React Guidelines

### Component Structure

- Use functional components with hooks
- Place hooks at the top of the component
- Destructure props for better readability
- Export components as named exports (except for default exports for pages)

```typescript
// Good example
import { useState, useEffect } from 'react';

interface ProfileCardProps {
  userId: string;
  showDetails: boolean;
}

export function ProfileCard({ userId, showDetails }: ProfileCardProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    // Effect logic
  }, [userId]);
  
  return (
    // JSX
  );
}
```

### State Management

- Use local state for component-specific state
- Use context for state that needs to be shared between components
- Keep state as close to where it's used as possible
- Avoid prop drilling by using context or composition

### Props

- Use explicit prop types
- Provide default props where appropriate
- Use destructuring for props
- Keep required props to a minimum

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}: ButtonProps) {
  // Component implementation
}
```

## CSS/Tailwind Guidelines

### Tailwind Usage

- Use Tailwind classes directly in components
- Group related Tailwind classes together (layout, typography, colors, etc.)
- Extract common patterns into component classes in `components.css`
- Use `@apply` sparingly, prefer composition with Tailwind classes

```tsx
// Good
<div className="flex flex-col p-4 gap-2 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-military-green">Title</h2>
  <p className="text-mud-black">Content</p>
</div>

// For repeated patterns, create a component class
// In components.css:
// .card { @apply flex flex-col p-4 gap-2 bg-white rounded-lg shadow-md; }
```

### Custom Styling

- Keep custom CSS to a minimum
- Use CSS variables for theme values
- Follow the project color system in `base.css`

## Code Quality

### Error Handling

- Use try/catch blocks for error-prone operations
- Provide meaningful error messages
- Use error boundaries for React component errors

### Performance

- Memoize expensive calculations with `useMemo`
- Optimize re-renders with `useCallback` for event handlers passed to child components
- Use virtualization for long lists

### Testing

- Write unit tests for utility functions
- Write component tests for critical UI components
- Test edge cases and error states

## Git Workflow

- Use descriptive commit messages
- Keep commits focused on a single task
- Create feature branches for new features
- Use pull requests for code review

## Documentation

- Document complex functions with JSDoc comments
- Include a README.md in each major directory explaining its purpose
- Document important architectural decisions
- Keep documentation up-to-date with code changes

## Accessibility

- Use semantic HTML elements
- Include alt text for images
- Ensure proper keyboard navigation
- Maintain appropriate color contrast
