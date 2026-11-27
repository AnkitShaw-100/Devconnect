# Frontend Development Rules

## Architecture
- Follow the existing project structure.
- Prefer reusable components.
- Keep components focused and maintainable.
- Avoid unnecessary abstraction.

## Next.js
- Follow the existing App Router architecture.
- Use Server Components by default.
- Use Client Components only when interactivity requires them.
- Keep server-only logic out of client components.
- Avoid unnecessary use of useEffect.

## UI
- Follow the existing design system.
- Maintain responsive layouts.
- Support loading, error and empty states.
- Ensure accessibility.
- Avoid duplicating existing components.

## Performance
- Optimize images using Next.js Image where appropriate.
- Avoid unnecessary client-side JavaScript.
- Minimize unnecessary re-renders.
- Use dynamic imports when beneficial.
