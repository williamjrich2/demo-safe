import { describe, expect, it } from 'vitest'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { runAgent } from './commands/agent-run.js'

describe('runAgent', () => {
  it('creates report, demo, embed, and preview output', async () => {
    const source = await mkdtemp(path.join(tmpdir(), 'demo-safe-source-'))
    const out = await mkdtemp(path.join(tmpdir(), 'demo-safe-output-'))
    await writeFile(path.join(source, 'index.html'), '<h1>Private Company</h1><p>Email jane@client.com or call (404) 555-0199</p>')

    await runAgent(source, out, '/landing-page')

    const report = await readFile(path.join(out, 'report', 'privacy-report.json'), 'utf8')
    const demo = await readFile(path.join(out, 'demo', 'src', 'main.jsx'), 'utf8')
    const network = await readFile(path.join(out, 'demo', 'src', 'network-stubs.js'), 'utf8')
    const iframe = await readFile(path.join(out, 'embed', 'iframe.html'), 'utf8')
    const preview = await readFile(path.join(out, 'exports', 'preview.svg'), 'utf8')

    expect(JSON.parse(report).findings.length).toBeGreaterThan(0)
    expect(demo).toContain('Safe public demo artifact')
    expect(demo).toContain('safe public demo for Example Company')
    expect(demo).not.toContain('jane@client.com')
    expect(network).toContain('window.fetch')
    expect(iframe).toContain('<iframe')
    expect(preview).toContain('<svg')
    expect(preview).toContain('safe public demo for Example Company')
  })
})
