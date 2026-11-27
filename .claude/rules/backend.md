# Backend Development Rules

## Architecture
- Keep business logic separate from route handlers.
- Follow existing service and repository patterns.
- Avoid duplicating business logic.

## Validation
- Validate request bodies, query parameters and route parameters.
- Never trust client-side validation.
- Reject unexpected or malformed input.

## Error Handling
- Use centralized error handling where appropriate.
- Return consistent API responses.
- Never expose sensitive internal errors.

## Authorization
- Verify permissions for every protected operation.
- Never assume authentication implies authorization.
- Enforce resource ownership on the server.

## Reliability
- Handle external API failures.
- Use transactions for critical database operations.
- Avoid unnecessary network requests.
