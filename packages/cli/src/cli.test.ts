import { describe, expect, it } from 'vitest'
import { parseArgs } from './cli.js'

describe('parseArgs', () => {
  it('routes scan commands', () => {
    expect(parseArgs(['scan', 'example', '--out', 'tmp/report'])).toEqual({ command: 'scan', source: 'example', out: 'tmp/report' })
  })

  it('routes generate commands with route', () => {
    expect(parseArgs(['generate', 'example', '--route', '/home', '--out', 'tmp/out'])).toEqual({ command: 'generate', source: 'example', out: 'tmp/out', route: '/home' })
  })

  it('routes agent run commands', () => {
    expect(parseArgs(['agent', 'run', 'example', '--out', 'tmp/out'])).toEqual({ command: 'agent-run', source: 'example', out: 'tmp/out' })
  })
})
