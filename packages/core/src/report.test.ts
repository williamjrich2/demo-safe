import { describe, expect, it } from 'vitest'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { writeJsonReport, writeMarkdownReport } from './report.js'
import type { ScanResult } from './types.js'

describe('report writers', () => {
  const result: ScanResult = {
    source: '/tmp/source',
    scannedFiles: 1,
    skippedFiles: ['.env'],
    findings: [
      {
        detectorId: 'email',
        severity: 'high',
        filePath: 'src/App.jsx',
        line: 1,
        column: 10,
        match: 'jane@client.com',
        preview: 'jan***com',
        replacement: 'hello@example.com',
      },
    ],
  }

  it('writes JSON reports', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'demo-safe-report-'))
    const file = path.join(dir, 'privacy-report.json')
    await writeJsonReport(result, file)
    const parsed = JSON.parse(await readFile(file, 'utf8'))
    expect(parsed.findings[0].detectorId).toBe('email')
  })

  it('writes Markdown reports', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'demo-safe-report-'))
    const file = path.join(dir, 'privacy-report.md')
    await writeMarkdownReport(result, file)
    const markdown = await readFile(file, 'utf8')
    expect(markdown).toContain('# demo-safe Privacy Report')
    expect(markdown).toContain('src/App.jsx:1:10')
  })
})
