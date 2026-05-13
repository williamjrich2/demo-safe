import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { ScanResult } from './types.js'

export async function writeJsonReport(result: ScanResult, outputFile: string): Promise<void> {
  await fs.mkdir(path.dirname(outputFile), { recursive: true })
  await fs.writeFile(outputFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
}

export async function writeMarkdownReport(result: ScanResult, outputFile: string): Promise<void> {
  await fs.mkdir(path.dirname(outputFile), { recursive: true })
  const critical = result.findings.filter((finding) => finding.severity === 'critical').length
  const high = result.findings.filter((finding) => finding.severity === 'high').length
  const medium = result.findings.filter((finding) => finding.severity === 'medium').length
  const low = result.findings.filter((finding) => finding.severity === 'low').length
  const lines = [
    '# demo-safe Privacy Report',
    '',
    `- Source: ${result.source}`,
    `- Scanned files: ${result.scannedFiles}`,
    `- Skipped files: ${result.skippedFiles.length}`,
    `- Findings: ${result.findings.length}`,
    `- Severity: ${critical} critical, ${high} high, ${medium} medium, ${low} low`,
    '',
    '## Findings',
    '',
  ]

  if (result.findings.length === 0) {
    lines.push('No findings detected by the current scanner.')
  } else {
    for (const finding of result.findings) {
      lines.push(`- **${finding.severity.toUpperCase()}** ${finding.detectorId} in \`${finding.filePath}:${finding.line}:${finding.column}\``)
      lines.push(`  - Preview: \`${finding.preview}\``)
      lines.push(`  - Replacement: \`${finding.replacement}\``)
    }
  }

  lines.push('', '## Skipped Files', '')
  if (result.skippedFiles.length === 0) lines.push('No files skipped.')
  else for (const file of result.skippedFiles) lines.push(`- \`${file}\``)

  await fs.writeFile(outputFile, `${lines.join('\n')}\n`, 'utf8')
}
