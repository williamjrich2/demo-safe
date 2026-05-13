# demo-safe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first public alpha of `demo-safe`, an agent-first toolkit for generating sanitized, animated public demos from private frontend projects.

**Architecture:** TypeScript pnpm monorepo with four packages: `core` for scanning/sanitization/reporting, `cli` for commands and agent workflow, `react` for embeddable showcase components, and `recorder` for preview/video export. The MVP is conservative: it scans source projects, creates a standalone sanitized Vite demo shell, blocks network calls, emits reports, and captures preview/export artifacts.

**Tech Stack:** TypeScript, Node.js ESM, pnpm workspaces, Vitest, React, Vite, Playwright optional for recorder.

---

## File Structure

- `package.json`: root scripts and workspace config.
- `pnpm-workspace.yaml`: workspace package list.
- `tsconfig.base.json`: shared TypeScript config.
- `AGENTS.md`: agent-first runbook and safety rules.
- `README.md`: public docs and positioning.
- `LICENSE`: MIT.
- `packages/core/src/`: scanner, detectors, replacement map, sanitizer, report writers.
- `packages/cli/src/`: command parser and commands.
- `packages/react/src/`: showcase frame components.
- `packages/recorder/src/`: preview/export helpers.
- `examples/vite-landing-page/`: fake client-like demo source with intentionally fake PII for tests.

## Task 1: Scaffold monorepo

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `LICENSE`
- Create: `.gitignore`

- [ ] Create root workspace files.
- [ ] Add root scripts: `build`, `test`, `typecheck`, `lint`.
- [ ] Commit scaffold.

## Task 2: Write agent-first docs

**Files:**
- Create: `AGENTS.md`
- Create: `README.md`

- [ ] Write agent operating rules.
- [ ] Write README with problem, install, agent workflow, CLI workflow, safety model, limitations.
- [ ] Commit docs.

## Task 3: Core detector tests first

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/detectors.test.ts`
- Create: `packages/core/src/detectors.ts`
- Create: `packages/core/src/types.ts`

- [ ] Write failing tests for email, phone, URL, env reference, and secret detectors.
- [ ] Run tests and verify they fail because detectors are missing.
- [ ] Implement minimal detector code.
- [ ] Run tests and verify they pass.
- [ ] Commit detector implementation.

## Task 4: Core scanner and report tests first

**Files:**
- Create: `packages/core/src/scanner.test.ts`
- Create: `packages/core/src/scanner.ts`
- Create: `packages/core/src/report.test.ts`
- Create: `packages/core/src/report.ts`
- Create: `packages/core/src/index.ts`

- [ ] Write failing tests for recursive file scanning that skips `.env`, `node_modules`, `.git`, private keys, and binary files.
- [ ] Write failing tests for JSON and Markdown privacy reports.
- [ ] Run tests and verify expected failures.
- [ ] Implement scanner and report writers.
- [ ] Run tests and verify pass.
- [ ] Commit scanner/report implementation.

## Task 5: Replacement and sanitizer tests first

**Files:**
- Create: `packages/core/src/replacements.test.ts`
- Create: `packages/core/src/replacements.ts`
- Create: `packages/core/src/sanitize.test.ts`
- Create: `packages/core/src/sanitize.ts`

- [ ] Write failing tests for deterministic replacement map generation.
- [ ] Write failing tests for HTML/text sanitization.
- [ ] Run tests and verify expected failures.
- [ ] Implement replacements and sanitizer.
- [ ] Run tests and verify pass.
- [ ] Commit replacement/sanitizer implementation.

## Task 6: React showcase package

**Files:**
- Create: `packages/react/package.json`
- Create: `packages/react/tsconfig.json`
- Create: `packages/react/src/DemoSafeFrame.tsx`
- Create: `packages/react/src/DemoStage.tsx`
- Create: `packages/react/src/CursorPath.tsx`
- Create: `packages/react/src/index.ts`

- [ ] Write simple component package with browser frame, cursor path, and stage layout.
- [ ] Keep it dependency-light and CSS-in-component for MVP.
- [ ] Typecheck package.
- [ ] Commit React package.

## Task 7: CLI package tests first

**Files:**
- Create: `packages/cli/package.json`
- Create: `packages/cli/tsconfig.json`
- Create: `packages/cli/src/cli.test.ts`
- Create: `packages/cli/src/cli.ts`
- Create: `packages/cli/src/index.ts`
- Create: `packages/cli/src/commands/scan.ts`
- Create: `packages/cli/src/commands/generate.ts`
- Create: `packages/cli/src/commands/agent-run.ts`

- [ ] Write failing tests for `scan`, `generate`, and `agent run` command routing.
- [ ] Run tests and verify expected failures.
- [ ] Implement minimal command parser without external CLI dependency.
- [ ] Implement `scan` command to write reports.
- [ ] Implement `generate` command to create demo shell.
- [ ] Implement `agent run` command to scan then generate.
- [ ] Run tests and verify pass.
- [ ] Commit CLI package.

## Task 8: Recorder package

**Files:**
- Create: `packages/recorder/package.json`
- Create: `packages/recorder/tsconfig.json`
- Create: `packages/recorder/src/index.ts`
- Create: `packages/recorder/src/preview.ts`

- [ ] Implement best-effort preview/export helper with graceful missing Playwright/ffmpeg messages.
- [ ] Do not make Playwright required for basic tests/build.
- [ ] Commit recorder package.

## Task 9: Example project and integration test

**Files:**
- Create: `examples/vite-landing-page/index.html`
- Create: `examples/vite-landing-page/src/App.jsx`
- Create: `examples/vite-landing-page/package.json`
- Create: `packages/cli/src/integration.test.ts`

- [ ] Create fake client-like landing page with fake emails, phones, names, URLs, and animations.
- [ ] Write integration test for `agent run examples/vite-landing-page --out tmp/demo-output`.
- [ ] Verify output folders and privacy report exist.
- [ ] Commit example and integration test.

## Task 10: Verification and public repo push

**Files:**
- Modify as needed based on verification.

- [ ] Run `pnpm install`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Run CLI manually on example.
- [ ] Inspect generated output for obvious private references.
- [ ] Create public GitHub repo `demo-safe`.
- [ ] Push `main`.
- [ ] Report repo URL, commands run, and limitations.
