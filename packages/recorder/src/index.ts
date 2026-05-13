import { promises as fs } from 'node:fs'
import path from 'node:path'

export async function writePreviewPlaceholder(outputDir: string): Promise<string> {
  const file = path.join(outputDir, 'exports', 'preview.svg')
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><rect width="1200" height="675" fill="#f8fafc"/><text x="80" y="140" font-family="Arial" font-size="56">demo-safe preview</text></svg>\n', 'utf8')
  return file
}

export function recorderAvailability() {
  return {
    playwright: 'optional',
    ffmpeg: 'optional',
    fallback: 'preview.svg',
  }
}
