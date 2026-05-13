# demo-safe Agent Runbook

`demo-safe` is agent-first. Your job is to turn private client work into safe public demo artifacts without leaking private data.

## Prime Directive

Never publish, copy, or commit private client source, secrets, credentials, real customer data, or proprietary assets into generated public demos.

## Standard Workflow

1. Inspect the source project enough to identify framework, entry point, page, and risky files.
2. Run `demo-safe scan <source> --out <output>/report` before generation.
3. Review critical findings. If findings include secrets or credentials, do not copy those files.
4. Run `demo-safe agent run <source> --route <route> --out <output>`.
5. Verify generated output:
   - privacy report exists
   - replacements map exists
   - network stubs are present
   - no `.env`, private keys, or credential files are copied
   - generated demo contains fake/demo data only
6. Export preview or video only after the sanitized demo is generated.
7. Final response must say what was sanitized, what was blocked, what was generated, and any unresolved risk.

## Safety Rules

- Do not send source code to external APIs.
- Do not use live API keys.
- Do not run the source app against production services.
- Do not copy `.env*`, `*.pem`, `*.key`, credential JSON, or private assets.
- Do not preserve client names, domains, emails, phone numbers, addresses, or testimonials unless explicitly allowlisted.
- Default to fake data.
- Default to blocking network calls.
- If unsure whether content is public, treat it as private.

## Commands

```bash
pnpm install
pnpm demo-safe scan ./client-project --out ./demo-safe-output/report
pnpm demo-safe agent run ./client-project --route /landing-page --out ./demo-safe-output
pnpm demo-safe preview ./demo-safe-output
pnpm demo-safe export ./demo-safe-output --format mp4
```

## Final Report Template

```md
## demo-safe Run Report

- Source inspected: <path>
- Route/page: <route>
- Output: <path>
- Sanitized: <summary>
- Blocked: <network/secrets/assets>
- Generated: <demo/report/embed/export>
- Verification: <commands and results>
- Unresolved risk: <none or list>
```
