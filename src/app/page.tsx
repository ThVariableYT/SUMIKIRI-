'use client'

import { useEffect, useRef, useState } from 'react'

type Phase = 'loading' | 'fading' | 'done'

export default function Home() {
  const [phase, setPhase] = useState<Phase>('loading')
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // the frame is a local static file: it can finish loading before this
    // component hydrates and the load handler gets attached. poll for it,
    // with a hard ceiling so the splash can never wedge.
    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      setPhase((p) => (p === 'loading' ? 'fading' : p))
    }
    const t0 = performance.now()
    const iv = setInterval(() => {
      const f = frameRef.current
      if (f?.contentDocument?.readyState === 'complete' || performance.now() - t0 > 2400) {
        clearInterval(iv)
        settle()
      }
    }, 120)
    const hard = setTimeout(settle, 2600)
    return () => {
      clearInterval(iv)
      clearTimeout(hard)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'fading') return
    const t = setTimeout(() => setPhase('done'), 550)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <iframe
        ref={frameRef}
        src="/game/index.html"
        title="SUMIKIRI"
        allow="fullscreen"
        onLoad={() => setPhase((p) => (p === 'loading' ? 'fading' : p))}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          border: 'none',
          display: 'block',
          background: '#e9e1cd',
        }}
      />

      {phase !== 'done' && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
            background: '#e9e1cd',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            opacity: phase === 'fading' ? 0 : 1,
            pointerEvents: 'none',
            transition: 'opacity 500ms ease',
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                fontFamily: 'serif',
                fontWeight: 600,
                fontSize: 'clamp(72px, 18vw, 160px)',
                lineHeight: 1,
                letterSpacing: '0.06em',
                color: '#1d1a16',
              }}
            >
              墨斬
            </div>
            <div
              style={{
                position: 'absolute',
                right: -30,
                bottom: 8,
                width: 18,
                height: 18,
                background: '#b3372a',
                transform: 'rotate(6deg)',
              }}
            />
          </div>

          <div
            style={{
              fontFamily: 'serif',
              fontSize: 13,
              letterSpacing: '0.35em',
              color: '#5c5344',
            }}
          >
            sumikiri — ink &amp; steel
          </div>
        </div>
      )}
    </div>
  )
}
