import { runGenerate } from './generate.js'

export async function runAgent(source: string, out = 'demo-safe-output', route?: string) {
  return runGenerate(source, out, { route, scanFirst: true })
}
