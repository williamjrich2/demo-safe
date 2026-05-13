import React, { type ReactNode } from 'react'
import { CursorPath } from './CursorPath.js'

export interface DemoStageProps {
  children: ReactNode
  caption?: string
  showCursor?: boolean
}

export function DemoStage({ children, caption = 'Sanitized public demo', showCursor = true }: DemoStageProps) {
  return (
    <div style={{ position: 'relative', minHeight: 420, overflow: 'hidden', background: 'linear-gradient(135deg, #f8fafc, #eef2ff)', padding: 24 }}>
      <div style={{ transform: 'translateY(-3%) scale(0.96)', transformOrigin: 'top center' }}>{children}</div>
      {showCursor ? <CursorPath /> : null}
      <div
        style={{
          position: 'absolute',
          left: 24,
          bottom: 20,
          borderRadius: 999,
          background: 'rgba(15,23,42,0.82)',
          color: 'white',
          fontSize: 13,
          padding: '8px 12px',
          backdropFilter: 'blur(12px)',
        }}
      >
        {caption}
      </div>
    </div>
  )
}
