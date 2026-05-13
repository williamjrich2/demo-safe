import React, { type ReactNode } from 'react'
import { DemoStage } from './DemoStage.js'

export interface DemoSafeFrameProps {
  children: ReactNode
  title?: string
  width?: number | string
  height?: number | string
  caption?: string
}

export function DemoSafeFrame({ children, title = 'demo-safe preview', width = '100%', height = 540, caption }: DemoSafeFrameProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(15,23,42,0.10)',
        background: '#fff',
        boxShadow: '0 24px 80px rgba(15,23,42,0.16)',
      }}
    >
      <div style={{ height: 42, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: '#f8fafc', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
        <span style={{ width: 11, height: 11, borderRadius: 999, background: '#ef4444' }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: '#f59e0b' }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: '#22c55e' }} />
        <span style={{ marginLeft: 10, fontSize: 13, color: '#64748b' }}>{title}</span>
      </div>
      <DemoStage caption={caption}>{children}</DemoStage>
    </div>
  )
}
