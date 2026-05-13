export interface CommandArgs {
  command: 'scan' | 'generate' | 'agent-run' | 'preview' | 'export' | 'help'
  source?: string
  out?: string
  route?: string
  format?: string
}

export function parseArgs(args: string[]): CommandArgs {
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') return { command: 'help' }

  if (args[0] === 'agent' && args[1] === 'run') {
    return { command: 'agent-run', source: args[2], ...parseFlags(args.slice(3)) }
  }

  const command = args[0]
  if (command === 'scan' || command === 'generate' || command === 'preview' || command === 'export') {
    return { command, source: args[1], ...parseFlags(args.slice(2)) }
  }

  return { command: 'help' }
}

function parseFlags(args: string[]): Omit<CommandArgs, 'command' | 'source'> {
  const flags: Omit<CommandArgs, 'command' | 'source'> = {}
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === '--out') flags.out = args[++index]
    else if (arg === '--route') flags.route = args[++index]
    else if (arg === '--format') flags.format = args[++index]
  }
  return flags
}
