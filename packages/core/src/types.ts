export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface Finding {
  detectorId: string
  severity: Severity
  filePath: string
  line: number
  column: number
  match: string
  preview: string
  replacement: string
}

export interface Detector {
  id: string
  severity: Severity
  replacement: string
  pattern: RegExp
}

export interface ScanOptions {
  source: string
  includeExtensions?: string[]
}

export interface ScanResult {
  source: string
  scannedFiles: number
  skippedFiles: string[]
  findings: Finding[]
}

export interface ReplacementMap {
  [original: string]: string
}
