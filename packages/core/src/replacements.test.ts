import { describe, expect, it } from 'vitest'
import { createReplacementMap } from './replacements.js'
import type { Finding } from './types.js'

const baseFinding = {
  severity: 'high' as const,
  filePath: 'src/App.jsx',
  line: 1,
  column: 1,
  preview: 'preview',
  replacement: 'replacement',
}

describe('createReplacementMap', () => {
  it('creates deterministic replacements by detector type', () => {
    const findings: Finding[] = [
      { ...baseFinding, detectorId: 'email', match: 'jane@client.com' },
      { ...baseFinding, detectorId: 'phone', match: '(404) 555-0199' },
      { ...baseFinding, detectorId: 'url', match: 'https://client.example' },
    ]

    expect(createReplacementMap(findings)).toEqual({
      'jane@client.com': 'hello@example.com',
      '(404) 555-0199': '(555) 010-1234',
      'https://client.example': 'https://example.com',
    })
  })
})
