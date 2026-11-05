import { describe, expect, it } from 'vitest'
import { createReplacementMap } from './replacements.js'
import { detectSensitiveContent } from './detectors.js'

describe('createReplacementMap', () => {
  it('uses generic company labels for custom name detectors', () => {
    const findings = detectSensitiveContent('Private Company One and Private Company Two', 'demo.txt', [{
      id: 'company-name',
      severity: 'high',
      replacement: 'Example Company',
      pattern: /Private Company (?:One|Two)/g,
    }])

    expect(createReplacementMap(findings)).toEqual({
      'Private Company One': 'Example Company',
      'Private Company Two': 'Example Services',
    })
  })

  it('creates deterministic replacements by detector type', () => {
    const findings = detectSensitiveContent('Email jane@client.com, call (404) 555-0199, visit https://client.example', 'src/App.jsx')

    expect(createReplacementMap(findings)).toEqual({
      'jane@client.com': 'hello@example.com',
      '(404) 555-0199': '(555) 010-1234',
      'https://client.example': 'https://example.com',
    })
  })
})
