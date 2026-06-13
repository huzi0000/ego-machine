'use client'

import WalletConnectButton from '../components/ConnectButton'
import { useState, useEffect } from 'react'

const NAV = [
  { label: 'Arena', href: '/' },
  { label: 'Profile', href: '/profile' },
  { label: 'Duel', href: '/duel' },
  { label: 'Vault', href: '/vault' },
  { label: 'Roast', href: '/roast' },
]

function Logo({ size = 22 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif' }}>
      Ego <span style={{ color: '#3b82f6' }}>Machine</span>
    </span>
  )
}

export default function RoastPage() {
  const [userId, setUserId] = useState('')
  const [roast, setRoast] = useState('')
  const [loading, setLoading] = useState(false)
  const [roasted, setRoasted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [btnHover, setBtnHover] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ego-machine-userId')
    if (saved) setUserId(saved)
    else window.location.href = '/'
  }, [])

  async function generateRoast() {
    setLoading(true)
    setRoast('')
    try {
      const memoriesRes = await fetch('/api/get-memories?userId=' + userId)
      const memoriesData = await memoriesRes.json()
      const memories = (memoriesData.memories || []).map((m: any) => m.text).filter(Boolean)
      if (memories.length < 2) {
        setRoast("You haven't embarrassed yourself enough yet. Go drop some takes first. Come back when you've actually said something worth destroying.")
        setRoasted(true)
        setLoading(false)
        return
      }
      const response = await fetch('/api/generate-roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, memories }),
      })
      const data = await response.json()
      setRoast(data.roast)
      setRoasted(true)
    } catch (e) {
      setRoast('Something went wrong. Even the roast machine is embarrassed for you.')
      setRoasted(true)
    }
    setLoading(false)
  }

  function shareOnX() {
    const text = 'The Ego Machine just roasted my entire football fan history 💀\n\n"' + roast.slice(0, 220) + '..."\n\nBuilt on @walrusprotocol Memory\n\n#Walrus #WorldCup2026 #EgoMachine'
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank')
  }

  function copyRoast() {
    navigator.clipboard.writeText(roast)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.65)' }} />

      <div className="page-wrapper" style={{ position: 'relative', zIndex: 10 }}>

        <nav className="navbar">
          <a href="/" style={{ textDecoration: 'none' }}><Logo /></a>
          <div className="navbar-right">
  <div className="nav-pill">{userId}</div>
  <WalletConnectButton />
  <a href="https://docs.wal.app" target="_blank" className="nav-docs">Docs ↗</a>
</div>
        </nav>

        <div className="nav-tabs">
          {NAV.map(nav => (
            <a key={nav.href} href={nav.href} className={`nav-tab ${nav.href === '/roast' ? 'active' : ''}`}>
              {nav.label}
            </a>
          ))}
        </div>

        <h1 className="page-title">Roast Mode 🔥</h1>
        <p className="page-subtitle">The AI reads every take you've ever made. Then destroys you with them.</p>

        {!roasted && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ fontSize: 64, marginBottom: '1rem' }}>💀</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Are you sure about this?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 360, margin: '0 auto 2rem' }}>
              The Ego Machine has read every take you've ever dropped on Walrus Memory. It remembers everything. It will use all of it against you.
            </p>
            <button
              onClick={generateRoast}
              disabled={loading}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{ borderRadius: 100, padding: '16px 48px', background: loading ? 'rgba(59,130,246,0.3)' : btnHover ? '#1d4ed8' : '#3b82f6', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 8px 30px rgba(59,130,246,0.35)' }}
            >
              {loading ? '🔥 Reading your sins...' : 'Roast Me 💀'}
            </button>
          </div>
        )}

        {roasted && roast && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.15)', border: '0.5px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#3b82f6' }}>E</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>The Ego Machine</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Based on your Walrus Memory history</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 28 }}>🔥</div>
              </div>
              <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.85, fontWeight: 500 }}>{roast}</p>
            </div>

            <button onClick={shareOnX} className="btn-primary">Share the Roast on X →</button>
            <button onClick={copyRoast} className="btn-outline" style={{ color: copied ? '#3b82f6' : '#fff' }}>
              {copied ? 'Copied!' : 'Copy Roast Text'}
            </button>
            <button onClick={() => { setRoasted(false); setRoast('') }} style={{ width: '100%', borderRadius: 100, padding: '14px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
              Roast Me Again 🔄
            </button>
          </div>
        )}

        <div className="page-footer">Ego Machine · Walrus Memory Mainnet · FIFA World Cup 2026</div>
      </div>
    </main>
  )
}