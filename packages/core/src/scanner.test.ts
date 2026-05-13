import { describe, expect, it } from 'vitest'
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { scanSource } from './scanner.js'

describe('scanSource', () => {
  it('scans text files and reports findings', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'demo-safe-scan-'))
    await mkdir(path.join(dir, 'src'))
    await writeFile(path.join(dir, 'src', 'App.jsx'), 'const email = "jane@client.com"')

    const result = await scanSource({ source: dir })

    expect(result.scannedFiles).toBe(1)
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ detectorId: 'email', filePath: 'src/App.jsx' }),
    ]))
  })

  it('does not read env files but reports them as critical blocked files', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'demo-safe-scan-'))
    await writeFile(path.join(dir, '.env'), 'API_KEY="sk_live_should_not_be_read"')

    const result = await scanSource({ source: dir })

    expect(result.scannedFiles).toBe(0)
    expect(result.skippedFiles).toContain('.env')
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ detectorId: 'blocked-secret-file', severity: 'critical' }),
    ]))
  })

  it('skips node_modules directories', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'demo-safe-scan-'))
    await mkdir(path.join(dir, 'node_modules'), { recursive: true })
    await writeFile(path.join(dir, 'node_modules', 'leak.js'), 'jane@client.com')

    const result = await scanSource({ source: dir })

    expect(result.scannedFiles).toBe(0)
    expect(result.findings).toHaveLength(0)
  })
})
