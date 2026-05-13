#!/usr/bin/env node
import { parseArgs } from './cli.js'
import { runAgent } from './commands/agent-run.js'
import { runGenerate } from './commands/generate.js'
import { runScan } from './commands/scan.js'

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv)
  if (args.command === 'help' || !args.source) {
    console.log('Usage: demo-safe <scan|generate|preview|export> <source> [--out dir] [--route route]')
    console.log('       demo-safe agent run <source> [--out dir] [--route route]')
    return
  }
  if (args.command === 'scan') {
    const result = await runScan(args.source, args.out)
    console.log(`demo-safe scan: ${result.findings.length} findings across ${result.scannedFiles} files`)
    return
  }
  if (args.command === 'generate') {
    const result = await runGenerate(args.source, args.out, { route: args.route })
    console.log(`demo-safe generate: ${result.out}`)
    return
  }
  if (args.command === 'agent-run') {
    const result = await runAgent(args.source, args.out, args.route)
    console.log(`demo-safe agent run: ${result.out}`)
    return
  }
  if (args.command === 'preview' || args.command === 'export') {
    console.log('Preview/export artifacts are generated during agent run in this alpha. See exports/preview.svg.')
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
