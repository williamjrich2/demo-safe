import path from 'node:path'
import { scanSource, writeJsonReport, writeMarkdownReport } from '@demo-safe/core'

export async function runScan(source: string, out = path.join('demo-safe-output', 'report')) {
  const root = process.env.INIT_CWD ?? process.cwd()
  const result = await scanSource({ source: path.resolve(root, source) })
  const outputDir = path.resolve(root, out)
  await writeJsonReport(result, path.join(outputDir, 'privacy-report.json'))
  await writeMarkdownReport(result, path.join(outputDir, 'privacy-report.md'))
  return result
}
