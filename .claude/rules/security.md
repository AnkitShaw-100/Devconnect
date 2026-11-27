# Security Engineering Rules

## General
- Follow the principle of least privilege.
- Never expose secrets or credentials.
- Never hardcode API keys or passwords.
- Treat external data as untrusted.
- Never disable security checks to make tests pass.

## Authentication
- Verify authentication on protected server routes.
- Never rely on frontend authentication checks alone.
- Secure session and cookie configuration.
- Validate user permissions on every sensitive operation.

## API Security
- Validate all incoming data on the server.
- Use parameterized database queries.
- Implement rate limiting for sensitive endpoints.
- Avoid exposing internal errors or stack traces.
- Prevent IDOR/BOLA vulnerabilities.

## Next.js Security
- Never expose server-only environment variables to client components.
- Use server-side authorization checks.
- Validate Server Actions independently.
- Avoid unsafe HTML rendering.
- Apply appropriate security headers.

## Secrets
- Never commit .env files.
- Never print credentials in terminal output.
- Never send secrets to external services.
- Ask before modifying security configurations.
