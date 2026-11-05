import { describe, expect, it } from 'vitest'
import { detectSensitiveContent, redactPreview } from './detectors.js'

describe('detectSensitiveContent', () => {
  it('detects emails with line numbers', () => {
    const findings = detectSensitiveContent('Contact Jane at jane@client.com\nThanks', 'demo.txt')
    expect(findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ detectorId: 'email', line: 1, replacement: 'hello@example.com' }),
    ]))
  })

  it('detects phone numbers', () => {
    const findings = detectSensitiveContent('Call (404) 555-0199 today', 'demo.txt')
    expect(findings.some((finding) => finding.detectorId === 'phone')).toBe(true)
  })

  it('detects urls', () => {
    const findings = detectSensitiveContent('Visit https://client.example/private', 'demo.txt')
    expect(findings.some((finding) => finding.detectorId === 'url')).toBe(true)
  })

  it('detects environment variable references', () => {
    const findings = detectSensitiveContent('const key = process.env.APP_SERVICE_ROLE_KEY', 'demo.ts')
    expect(findings.some((finding) => finding.detectorId === 'env-reference')).toBe(true)
  })

  it('detects likely secret assignments as critical', () => {
    const findings = detectSensitiveContent('API_KEY="sk_live_123456789"', '.env')
    expect(findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ detectorId: 'secret-assignment', severity: 'critical' }),
    ]))
  })
})

describe('redactPreview', () => {
  it('keeps short previews fully redacted', () => {
    expect(redactPreview('secret')).toBe('***')
  })

  it('redacts middle content for longer values', () => {
    expect(redactPreview('jane@client.com')).toBe('jan***com')
  })
})
