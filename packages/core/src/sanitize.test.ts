import { describe, expect, it } from 'vitest'
import { createNetworkStub, sanitizeText } from './sanitize.js'

describe('sanitizeText', () => {
  it('replaces all configured originals', () => {
    const result = sanitizeText('Jane works at Private Company. Email Jane at jane@client.com.', {
      Jane: 'Jordan',
      'Private Company': 'Example Company',
      'jane@client.com': 'hello@example.com',
    })

    expect(result).toBe('Jordan works at Example Company. Email Jordan at hello@example.com.')
  })
})

describe('createNetworkStub', () => {
  it('blocks common browser network primitives', () => {
    const stub = createNetworkStub()
    expect(stub).toContain('window.fetch')
    expect(stub).toContain('window.XMLHttpRequest')
    expect(stub).toContain('window.WebSocket')
    expect(stub).toContain('navigator.sendBeacon')
  })
})
