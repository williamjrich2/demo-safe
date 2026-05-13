import { describe, expect, it } from 'vitest'
import { createReplacementMap } from './replacements.js'
import { detectSensitiveContent } from './detectors.js'

describe('createReplacementMap', () => {
  it('creates deterministic replacements by detector type', () => {
    const findings = detectSensitiveContent('Email jane@client.com, call (404) 555-0199, visit https://client.example', 'src/App.jsx')

    expect(createReplacementMap(findings)).toEqual({
      'jane@client.com': 'hello@example.com',
      '(404) 555-0199': '(555) 010-1234',
      'https://client.example': 'https://example.com',
    })
  })
})
