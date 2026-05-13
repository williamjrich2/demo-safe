import type { Detector, Finding } from './types.js'

const INTERNAL_MATCHES = new WeakMap<Finding, string>

export function getFindingMatch(finding: Finding): string {
  return INTERNAL_MATCHES.get(finding) ?? finding.preview
}

function createFinding(finding: Finding, rawMatch: string): Finding {
  INTERNAL_MATCHES.set(finding, rawMatch)
  return finding
}

export const DEFAULT_DETECTORS: Detector[] = [
  {
    id: 'email',
    severity: 'high',
    replacement: 'hello@example.com',
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    id: 'phone',
    severity: 'medium',
    replacement: '(555) 010-1234',
    pattern: /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,
  },
  {
    id: 'url',
    severity: 'medium',
    replacement: 'https://example.com',
    pattern: /https?:\/\/[^\s"'<>]+/gi,
  },
  {
    id: 'env-reference',
    severity: 'high',
    replacement: 'process.env.DEMO_SAFE_PLACEHOLDER',
    pattern: /(?:process\.env\.|import\.meta\.env\.)[A-Z0-9_]+/g,
  },
  {
    id: 'secret-assignment',
    severity: 'critical',
    replacement: '$1="demo-safe-redacted"',
    pattern: /\b([A-Z0-9_]*(?:API_KEY|TOKEN|SECRET|PASSWORD|SERVICE_ROLE|PRIVATE_KEY)[A-Z0-9_]*)\s*=\s*["'][^"']{8,}["']/gi,
  },
]

export function detectSensitiveContent(content: string, filePath = '<memory>', detectors = DEFAULT_DETECTORS): Finding[] {
  const findings: Finding[] = []
  const lineStarts = getLineStarts(content)

  for (const detector of detectors) {
    const pattern = new RegExp(detector.pattern.source, detector.pattern.flags.includes('g') ? detector.pattern.flags : `${detector.pattern.flags}g`)
    for (const match of content.matchAll(pattern)) {
      if (match.index === undefined) continue
      const location = offsetToLocation(lineStarts, match.index)
      const matched = match[0]
      findings.push(createFinding({
        detectorId: detector.id,
        severity: detector.severity,
        filePath,
        line: location.line,
        column: location.column,
        match: redactPreview(matched),
        preview: redactPreview(matched),
        replacement: detector.replacement,
      }, matched))
    }
  }

  return findings.sort((a, b) => a.line - b.line || a.column - b.column)
}

function getLineStarts(content: string): number[] {
  const starts = [0]
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') starts.push(i + 1)
  }
  return starts
}

function offsetToLocation(starts: number[], offset: number): { line: number; column: number } {
  let low = 0
  let high = starts.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (starts[mid] <= offset) low = mid + 1
    else high = mid - 1
  }
  const lineIndex = Math.max(0, high)
  return { line: lineIndex + 1, column: offset - starts[lineIndex] + 1 }
}

export function redactPreview(value: string): string {
  if (value.length <= 8) return '***'
  return `${value.slice(0, 3)}***${value.slice(-3)}`
}
