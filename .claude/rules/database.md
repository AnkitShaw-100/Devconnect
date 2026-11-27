# Database Engineering Rules

- Follow the existing database architecture.
- Never modify schemas without understanding dependencies.
- Use migrations for schema changes.
- Never execute destructive migrations without approval.
- Add indexes where query patterns justify them.
- Use transactions for operations requiring atomicity.
- Avoid N+1 queries.
- Validate data before database operations.
- Enforce important constraints at database level.
- Never expose database credentials.
