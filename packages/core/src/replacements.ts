import type { Finding, ReplacementMap } from './types.js'
import { getFindingMatch } from './detectors.js'

const DEFAULT_VALUES = [
  'Example Company',
  'Example Services',
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
    const rawMatch = getFindingMatch(finding)
    if (map[rawMatch]) continue

    if (finding.detectorId === 'email') map[rawMatch] = 'hello@example.com'
    else if (finding.detectorId === 'phone') map[rawMatch] = '(555) 010-1234'
    else if (finding.detectorId === 'url') map[rawMatch] = 'https://example.com'
    else if (finding.detectorId.includes('secret')) map[rawMatch] = 'demo-safe-redacted'
    else if (finding.detectorId === 'env-reference') map[rawMatch] = 'DEMO_SAFE_PLACEHOLDER'
    else map[rawMatch] = DEFAULT_VALUES[genericIndex++ % DEFAULT_VALUES.length]
  }

  return map
}
