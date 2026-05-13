# demo-safe Design Spec

## Summary

`demo-safe` is an agent-first, CLI-backed toolkit for creating safe public demos from private client work. A developer or agent points it at a repo, route, page, or component, and it produces a sanitized, animated, embeddable demo artifact without exposing real client names, copy, images, emails, phones, URLs, secrets, live API calls, or private operational data.

The public positioning is: **Create safe, animated public demos from private client work.**

The primary user is an AI coding agent operating on behalf of a developer. The CLI exists to make the agent workflow deterministic, testable, and repeatable.

## Goals

1. Let agents inspect a private project and produce a public-safe demo artifact.
2. Preserve layout, styling, interactions, and animation behavior where possible.
3. Replace sensitive or client-specific content with realistic demo data.
4. Block or mock live network calls, env usage, and private assets.
5. Produce outputs that are easy to embed on a website or export as video.
6. Ship as an open-source public repo with no client secrets or private data.

## Non-goals for MVP

1. Perfect extraction from every frontend framework.
2. AI image generation.
3. Figma import/export.
4. Production-grade PII detection across all languages.
5. Automatic deployment.
6. Multi-page journeys beyond a small manifest-driven sequence.
7. Sending data to external services.

## Product Shape

`demo-safe` is hybrid, but agent-first.

### Agent-first interface

Agents should be able to follow a repo-local `AGENTS.md` and run:

```bash
pnpm demo-safe agent run ../client-project --route /landing-page --out ./demo-safe-output
```

The command should perform a safe default flow:

1. Detect project/framework.
2. Scan files and selected route/page for sensitive content.
3. Generate replacement map.
4. Create a sanitized demo app.
5. Stub browser network calls.
6. Wrap demo in a showcase frame.
7. Produce a privacy report.
8. Optionally export video if dependencies are available.

### CLI interface

The CLI provides the underlying deterministic steps:

```bash
demo-safe init
demo-safe scan <source>
demo-safe generate <source>
demo-safe preview <output>
demo-safe export <output> --format mp4
demo-safe agent run <source>
```

## MVP Inputs

Supported initial sources:

1. React/Vite apps.
2. Next.js app/page directories, best-effort static route extraction.
3. Plain HTML files.
4. Single React component files.

The MVP can fall back to a static shell when full framework extraction is not possible.

## MVP Outputs

A run should create:

```text
demo-safe-output/
  demo/
    index.html
    src/
      App.tsx
      main.tsx
      demo-data.ts
      network-stubs.ts
    package.json
    vite.config.ts
  report/
    privacy-report.md
    privacy-report.json
    replacements.json
    blocked-network-calls.json
  exports/
    preview.png
    demo.webm or demo.mp4 when export succeeds
  embed/
    DemoSafeFrame.tsx
    iframe.html
```

## Safety Model

The tool assumes source projects may contain private content. The generated public demo must not include:

- `.env` files or env values.
- API keys, tokens, service role keys, or credentials.
- Client names, client domains, emails, phones, addresses, personal names.
- Real testimonials or customer quotes.
- Private images, logos, screenshots, or asset filenames unless explicitly allowlisted.
- Live API endpoints or tracking pixels.
- Code that sends data externally.

The MVP must default to blocking network access in generated demos by injecting `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, and `navigator.sendBeacon` stubs.

## Privacy Detection

The initial scanner should detect high-confidence patterns:

- Emails.
- Phone numbers.
- URLs and domains.
- IPv4 addresses.
- Likely secret assignments.
- Env references.
- Common token prefixes.
- Names configured in `demo-safe.config.ts`.
- Source files that should never be copied, such as `.env`, private keys, credential files, and lockbox paths.

Every detection should include:

- file path
- line number when available
- detector id
- severity: `low`, `medium`, `high`, `critical`
- redacted preview
- recommended replacement

## Replacement System

The replacement system should generate deterministic demo values:

- Company: `Acme Studio`, `Northstar Services`, `Atlas Works`.
- Person: `Jordan Lee`, `Taylor Morgan`, `Casey Rivera`.
- Email: `hello@example.com`, `jordan@example.com`.
- Phone: `(555) 010-1234`.
- Domain: `example.com`.
- Metrics: plausible but generic numbers.
- Images: gradient placeholders or simple SVG cards.

The replacement map should be saved so the agent can review what changed.

## Demo Generation Strategy

MVP generation should be conservative and safe:

1. Create a new standalone Vite React app in the output folder.
2. Copy no source file blindly.
3. If a plain HTML input is provided, sanitize and embed it in a frame.
4. If a React app/page is provided, create a safe shell that approximates structure using extracted text, class names, and layout hints.
5. Preserve design intent via captured CSS where safe, but never copy env files or private assets.
6. Use generated placeholder imagery instead of source image assets unless allowlisted.

This is intentionally not a perfect clone in MVP. It is a safe public showcase approximation that keeps the interaction and animation feel.

## Showcase Layer

The generated demo should include a polished wrapper:

- Browser chrome frame.
- Optional device frame.
- Animated cursor.
- Scroll animation.
- Click pulse markers.
- Captions.
- Reduced motion support.

The default animation should be a 10 to 14 second sequence suitable for portfolio embeds and social export.

## Export System

The MVP export command should:

1. Start the generated Vite demo.
2. Use Playwright to open the page.
3. Capture a preview PNG.
4. If ffmpeg is installed, record frames or webm/mp4 best-effort.
5. If ffmpeg is missing, report exact install guidance and still succeed for preview output.

## Config

`demo-safe.config.ts` should support:

```ts
export default {
  source: {
    framework: 'auto',
    entry: './src/App.tsx',
    route: '/landing-page'
  },
  privacy: {
    blockNetwork: true,
    replaceNames: true,
    replaceEmails: true,
    replacePhones: true,
    replaceUrls: true,
    replaceImages: true,
    allowlist: []
  },
  demoData: {
    company: 'Acme Studio',
    industry: 'Professional Services',
    tone: 'modern-saas'
  },
  animation: {
    mode: 'scroll-and-click',
    duration: 12,
    viewport: { width: 1440, height: 900 }
  },
  export: {
    formats: ['react', 'iframe', 'preview']
  }
}
```

## Repository Structure

```text
demo-safe/
  AGENTS.md
  README.md
  LICENSE
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  packages/
    cli/
    core/
    react/
    recorder/
  examples/
    vite-landing-page/
  docs/
    superpowers/
      specs/
      plans/
```

## Testing Requirements

MVP must include tests for:

1. PII detectors.
2. Secret detectors.
3. Replacement map generation.
4. Network stub generation.
5. HTML sanitization.
6. CLI scan command output.
7. Agent run command creates expected report/output folders.

Use TDD for production code. No scanner or generator behavior should be implemented without a failing test first.

## Security Requirements

- Never read ignored secret files into generated output.
- Never copy `.env*`, `*.pem`, credential JSON files, or private key material.
- Never print full secret values in reports.
- Never call external APIs from generated demo code.
- Keep all generated examples fake and generic.
- Include a public safety disclaimer in README.

## Agent Runbook Requirements

`AGENTS.md` should tell agents:

1. Do not publish or commit source client files.
2. Run `demo-safe scan` before generation.
3. Review critical findings before export.
4. Use allowlists for intentional public names only.
5. Verify generated output with tests and a secret scan.
6. Final response must include what was sanitized and any unresolved risk.

## Acceptance Criteria

MVP alpha is acceptable when:

1. Public GitHub repo exists.
2. `pnpm install`, `pnpm test`, and `pnpm build` pass.
3. `demo-safe scan examples/vite-landing-page` produces JSON and Markdown reports.
4. `demo-safe agent run examples/vite-landing-page --out tmp/demo-output` creates demo, report, and embed folders.
5. Generated output contains no obvious real secrets or private data.
6. README explains agent-first workflow, CLI commands, limitations, and safety model.
7. The repo has MIT license and no private Mohawk/AnovaGrowth client assets.
