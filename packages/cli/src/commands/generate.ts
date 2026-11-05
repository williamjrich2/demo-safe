import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createNetworkStub, createReplacementMap, sanitizeText, scanSource, writeJsonReport, writeMarkdownReport } from '@demo-safe/core'

export interface GenerateOptions {
  route?: string
  scanFirst?: boolean
}

export async function runGenerate(source: string, out = 'demo-safe-output', options: GenerateOptions = {}) {
  const absoluteSource = path.resolve(process.env.INIT_CWD ?? process.cwd(), source)
  const absoluteOut = path.resolve(process.env.INIT_CWD ?? process.cwd(), out)
  const reportDir = path.join(absoluteOut, 'report')
  const demoDir = path.join(absoluteOut, 'demo')
  const embedDir = path.join(absoluteOut, 'embed')
  const exportsDir = path.join(absoluteOut, 'exports')

  await fs.mkdir(path.join(demoDir, 'src'), { recursive: true })
  await fs.mkdir(embedDir, { recursive: true })
  await fs.mkdir(exportsDir, { recursive: true })

  const scan = await scanSource({ source: absoluteSource })
  const replacements = createReplacementMap(scan.findings)
  await writeJsonReport(scan, path.join(reportDir, 'privacy-report.json'))
  await writeMarkdownReport(scan, path.join(reportDir, 'privacy-report.md'))
  await fs.writeFile(path.join(reportDir, 'replacements.json'), `${JSON.stringify(redactReplacementKeys(replacements), null, 2)}\n`, 'utf8')
  await fs.writeFile(path.join(reportDir, 'blocked-network-calls.json'), `${JSON.stringify({ blocked: ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'sendBeacon'] }, null, 2)}\n`, 'utf8')

  const showcaseText = sanitizeText('Private client work transformed into a safe public demo for Example Company. Contact jane@client.com.', replacements)
  await fs.writeFile(path.join(demoDir, 'package.json'), JSON.stringify({ type: 'module', scripts: { dev: 'vite --host 127.0.0.1' }, dependencies: { '@vitejs/plugin-react': 'latest', vite: 'latest', typescript: 'latest', react: 'latest', 'react-dom': 'latest' }, devDependencies: {} }, null, 2), 'utf8')
  await fs.writeFile(path.join(demoDir, 'index.html'), '<div id="root"></div><script type="module" src="/src/main.jsx"></script>\n', 'utf8')
  await fs.writeFile(path.join(demoDir, 'src/network-stubs.js'), createNetworkStub(), 'utf8')
  await fs.writeFile(path.join(demoDir, 'src/main.jsx'), demoMain(showcaseText, options.route), 'utf8')
  await fs.writeFile(path.join(embedDir, 'iframe.html'), `<iframe src="../demo/index.html" title="demo-safe preview" style="width:100%;height:540px;border:0;border-radius:24px"></iframe>\n`, 'utf8')
  await fs.writeFile(path.join(embedDir, 'DemoSafeFrame.tsx'), demoFrameComponent(), 'utf8')
  await fs.writeFile(path.join(exportsDir, 'preview.svg'), previewSvg(showcaseText), 'utf8')

  return { out: absoluteOut, findings: scan.findings.length }
}

function redactReplacementKeys(replacements: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(replacements).map(([key, value]) => [key.length <= 8 ? '***' : `${key.slice(0, 3)}***${key.slice(-3)}`, value]))
}

function demoMain(text: string, route?: string): string {
  return `import './network-stubs.js';\nimport React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport './styles.css';\n\nfunction App() {\n  return <main className="stage"><section className="card"><p className="eyebrow">demo-safe preview${route ? ` · ${route}` : ''}</p><h1>Safe public demo artifact</h1><p>${escapeForJsx(text)}</p><button>View sanitized flow</button></section></main>;\n}\n\ncreateRoot(document.getElementById('root')).render(<App />);\n`
}

function escapeForJsx(value: string): string {
  return value.replace(/[{}<>]/g, '')
}

function demoFrameComponent(): string {
  return `export function DemoSafeFrame() {\n  return <iframe src="./demo/index.html" title="demo-safe preview" style={{ width: '100%', height: 540, border: 0, borderRadius: 24 }} />\n}\n`
}

function previewSvg(text: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><rect width="1200" height="675" fill="#f8fafc"/><rect x="120" y="110" width="960" height="455" rx="32" fill="white" stroke="#dbeafe"/><text x="170" y="230" font-family="Arial" font-size="54" font-weight="700" fill="#0f172a">Safe public demo</text><text x="170" y="305" font-family="Arial" font-size="26" fill="#475569">${escapeXml(text)}</text></svg>`
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
