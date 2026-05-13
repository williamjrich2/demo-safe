import { promises as fs } from 'node:fs'
import path from 'node:path'
import { detectSensitiveContent } from './detectors.js'
import type { Finding, ScanOptions, ScanResult } from './types.js'

const DEFAULT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.md', '.json', '.txt', '.env'])
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.next', '.vite', 'coverage'])
const NEVER_READ_PATTERNS = [/\.env(?:\..*)?$/, /\.pem$/, /\.key$/, /\.p12$/, /\.pfx$/, /credentials.*\.json$/i, /service.*account.*\.json$/i]

export async function scanSource(options: ScanOptions): Promise<ScanResult> {
  const source = path.resolve(options.source)
  const includeExtensions = new Set(options.includeExtensions ?? [...DEFAULT_EXTENSIONS])
  const files = await collectFiles(source, includeExtensions)
  const findings: Finding[] = []
  const skippedFiles: string[] = []
  let scannedFiles = 0

  for (const file of files) {
    const relative = path.relative(source, file) || path.basename(file)
    if (shouldNeverRead(file)) {
      skippedFiles.push(relative)
      findings.push({
        detectorId: 'blocked-secret-file',
        severity: 'critical',
        filePath: relative,
        line: 1,
        column: 1,
        match: path.basename(file),
        preview: path.basename(file),
        replacement: 'Do not copy this file into a public demo.',
      })
      continue
    }

    const buffer = await fs.readFile(file)
    if (isProbablyBinary(buffer)) {
      skippedFiles.push(relative)
      continue
    }

    scannedFiles++
    const content = buffer.toString('utf8')
    findings.push(...detectSensitiveContent(content, relative))
  }

  return { source, scannedFiles, skippedFiles, findings }
}

async function collectFiles(source: string, includeExtensions: Set<string>): Promise<string[]> {
  const stat = await fs.stat(source)
  if (stat.isFile()) return [source]

  const files: string[] = []
  async function walk(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) await walk(fullPath)
        continue
      }
      if (!entry.isFile()) continue
      if (shouldNeverRead(fullPath) || includeExtensions.has(path.extname(entry.name)) || entry.name.startsWith('.env')) {
        files.push(fullPath)
      }
    }
  }
  await walk(source)
  return files.sort()
}

function shouldNeverRead(filePath: string): boolean {
  return NEVER_READ_PATTERNS.some((pattern) => pattern.test(path.basename(filePath)))
}

function isProbablyBinary(buffer: Buffer): boolean {
  const sample = buffer.subarray(0, 512)
  return sample.includes(0)
}
