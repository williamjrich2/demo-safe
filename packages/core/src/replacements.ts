import type { Finding, ReplacementMap } from './types.js'

const DEFAULT_VALUES = [
  'Acme Studio',
  'Northstar Services',
  'Jordan Lee',
  'Taylor Morgan',
  'hello@example.com',
  '(555) 010-1234',
  'https://example.com',
]

export function createReplacementMap(findings: Finding[]): ReplacementMap {
  const map: ReplacementMap = {}
  let genericIndex = 0

  for (const finding of findings) {
    if (finding.detectorId === 'blocked-secret-file') continue
    if (map[finding.match]) continue

    if (finding.detectorId === 'email') map[finding.match] = 'hello@example.com'
    else if (finding.detectorId === 'phone') map[finding.match] = '(555) 010-1234'
    else if (finding.detectorId === 'url') map[finding.match] = 'https://example.com'
    else if (finding.detectorId.includes('secret')) map[finding.match] = 'demo-safe-redacted'
    else if (finding.detectorId === 'env-reference') map[finding.match] = 'DEMO_SAFE_PLACEHOLDER'
    else map[finding.match] = DEFAULT_VALUES[genericIndex++ % DEFAULT_VALUES.length]
  }

  return map
}
