# demo-safe

Create safe, animated public demos from private client work.

`demo-safe` is an agent-first, CLI-backed toolkit for turning real apps, landing pages, and digital assets into sanitized showcase demos, embeddable previews, and social-ready videos without exposing client data, secrets, private copy, live API calls, or proprietary assets.

## Why this exists

Developers and agencies often build strong client work they cannot show publicly because the page contains client names, private copy, real customer data, screenshots, forms, emails, phone numbers, proprietary images, API calls, or credentials.

`demo-safe` gives agents and developers a safer flow:

1. Inspect the private project locally.
2. Detect risky content.
3. Replace private details with realistic demo data.
4. Generate a standalone public-safe demo.
5. Wrap it in a polished animated showcase frame.
6. Export an embed, preview, or social video.

## Agent-first workflow

```bash
pnpm install
pnpm demo-safe agent run ../client-project --route /landing-page --out ./demo-safe-output
```

The agent flow runs scan + generate with safe defaults and produces:

```text
demo-safe-output/
  demo/
  report/
    privacy-report.md
    privacy-report.json
    replacements.json
    blocked-network-calls.json
  embed/
    DemoSafeFrame.tsx
    iframe.html
  exports/
    preview.png
```

## CLI workflow

```bash
demo-safe scan ./client-project --out ./demo-safe-output/report
demo-safe generate ./client-project --route /landing-page --out ./demo-safe-output
demo-safe preview ./demo-safe-output
demo-safe export ./demo-safe-output --format mp4
```

## Current alpha scope

Supported best today:

- React/Vite projects
- static HTML landing pages
- single-page demos
- local privacy scanning
- deterministic replacement maps
- standalone generated Vite demo shell
- browser-frame showcase component
- network-call stubbing

Not yet supported:

- perfect extraction from all frameworks
- Design-tool import/export
- AI image generation
- automatic deployment
- guaranteed PII detection across every file type
- production video rendering on every system

## Safety model

The generated demo should not include:

- `.env` files or env values
- API keys, tokens, service role keys, or credentials
- client names, client domains, emails, phones, addresses, personal names
- real testimonials or customer quotes
- private images, logos, screenshots, or asset filenames unless explicitly allowlisted
- live API endpoints or tracking pixels
- code that sends data externally

Generated demos inject network stubs for `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, and `navigator.sendBeacon`.

## Development

```bash
pnpm install
pnpm test
pnpm build
pnpm typecheck
```

## License

MIT
