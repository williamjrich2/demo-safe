import React from 'react'

export interface CursorPathProps {
  progress?: number
}

export function CursorPath({ progress = 0.62 }: CursorPathProps) {
  const left = `${12 + progress * 68}%`
  const top = `${24 + Math.sin(progress * Math.PI) * 42}%`
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left,
        top,
        width: 22,
        height: 22,
        transform: 'translate(-4px, -4px) rotate(-12deg)',
        filter: 'drop-shadow(0 10px 18px rgba(15, 23, 42, 0.22))',
        transition: 'left 600ms ease, top 600ms ease',
        pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M4 3l14 9-6 1.5L9 20 4 3z" fill="#111827" stroke="white" strokeWidth="1.4" />
      </svg>
    </div>
  )
}
