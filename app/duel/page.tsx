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

// First 2 weeks of FIFA World Cup 2026
const MATCHES = [
  // Week 1 - June 11-17
  "Mexico vs South Africa — Jun 11",
  "South Korea vs Czechia — Jun 12",
  "Canada vs Bosnia & Herzegovina — Jun 13",
  "USA vs Paraguay — Jun 13",
  "Qatar vs Switzerland — Jun 14",
  "Brazil vs Morocco — Jun 14",
  "Haiti vs Scotland — Jun 14",
  "Australia vs Turkey — Jun 14",
  "Germany vs Curaçao — Jun 14",
  "Netherlands vs Japan — Jun 15",
  "Ivory Coast vs Ecuador — Jun 15",
  "Spain vs Cape Verde — Jun 15",
  "Belgium vs Egypt — Jun 16",
  "Saudi Arabia vs Uruguay — Jun 16",
  "France vs Senegal — Jun 17",
  "Argentina vs Algeria — Jun 17",
  "Portugal vs DR Congo — Jun 17",
  // Week 2 - June 18-24
  "England vs Croatia — Jun 18",
  "Canada vs Qatar — Jun 19",
  "Mexico vs South Korea — Jun 19",
  "USA vs Australia — Jun 20",
  "Brazil vs Haiti — Jun 20",
  "Germany vs Ivory Coast — Jun 21",
  "Spain vs Saudi Arabia — Jun 21",
  "Argentina vs Austria — Jun 22",
  "France vs Iraq — Jun 23",
  "Portugal vs Uzbekistan — Jun 23",
  "England vs Ghana — Jun 24",
]

function Logo({ size = 22 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif' }}>
      Ego <span style={{ color: '#3b82f6' }}>Machine</span>
    </span>
  )
}

export default function DuelPage() {
  const [userId, setUserId] = useState('')
  const [step, setStep] = useState<'intro' | 'predicting' | 'result'>('intro')
  const [aiPrediction, setAiPrediction] = useState<any>(null)
  const [userTake, setUserTake] = useState('')
  const [selectedMatch, setSelectedMatch] = useState(MATCHES[0])
  const [loading, setLoading] = useState(false)
  const [matched, setMatched] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ego-machine-userId')
    if (saved) setUserId(saved)
    else window.location.href = '/'
  }, [])

  async function startDuel() {
    setLoading(true)
    try {
      const res = await fetch(`/api/get-response?userId=${userId}&match=${encodeURIComponent(selectedMatch)}`)
      const data = await res.json()
      setAiPrediction(data)
      setStep('predicting')
    } catch (e) {
      alert('Error starting duel. Make sure you have enough takes first.')
    }
    setLoading(false)
  }

  function revealResult() {
    if (!userTake.trim()) return
    const isMatch = userTake.toLowerCase().split(' ').some((word: string) =>
      aiPrediction?.prediction?.toLowerCase().includes(word) && word.length > 4
    )
    setMatched(isMatch)
    setStep('result')
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
            <a key={nav.href} href={nav.href} className={`nav-tab ${nav.href === '/duel' ? 'active' : ''}`}>
              {nav.label}
            </a>
          ))}
        </div>

        <h1 className="page-title">Prediction Duel</h1>
        <p className="page-subtitle">The Ego Machine will predict your take before you make it.</p>

        {step === 'intro' && (
          <div className="glass-card">
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: 48, marginBottom: '0.75rem' }}>🔮</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Can it predict you?</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                The Ego Machine has studied your takes. Pick a match and find out if it knows you.
              </p>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="field-label">Pick a Match</label>
              <select value={selectedMatch} onChange={e => setSelectedMatch(e.target.value)} style={{ width: '100%', borderRadius: 10, padding: '12px 14px', background: 'rgba(10,15,30,0.9)', border: '0.5px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, outline: 'none' }}>
                {MATCHES.map(m => <option key={m} value={m} style={{ background: '#0a0f1e', color: '#fff' }}>{m}</option>)}
              </select>
            </div>
            <button onClick={startDuel} disabled={loading} className="btn-primary">
              {loading ? 'Reading your mind...' : 'Start the Duel →'}
            </button>
          </div>
        )}

        {step === 'predicting' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: '0.5rem' }}>🔒</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6', marginBottom: 4 }}>Prediction locked and sealed</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Now it's your turn.</p>
            </div>
            <div className="glass-card">
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
                Match: <strong style={{ color: '#fff' }}>{selectedMatch}</strong>
              </p>
              <label className="field-label">Your Take</label>
              <textarea rows={3} placeholder="What's your take on this match?" value={userTake} onChange={e => setUserTake(e.target.value)} style={{ width: '100%', borderRadius: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', resize: 'none' as const, fontFamily: 'inherit', lineHeight: 1.6 }} />
              <button onClick={revealResult} disabled={!userTake.trim()} className="btn-primary" style={{ marginTop: '0.75rem' }}>
                Reveal the Prediction →
              </button>
            </div>
          </div>
        )}

        {step === 'result' && aiPrediction && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ textAlign: 'center', border: matched ? '0.5px solid rgba(59,130,246,0.4)' : undefined }}>
              <div style={{ fontSize: 40, marginBottom: '0.5rem' }}>{matched ? '😱' : '😤'}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: matched ? '#3b82f6' : '#fff', marginBottom: 4 }}>
                {matched ? 'It knew you.' : 'You surprised it.'}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                {matched ? 'The Ego Machine read you like a book.' : 'For once, you were unpredictable.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', border: '0.5px solid rgba(59,130,246,0.3)' }}>
                <div style={{ fontSize: 11, color: '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem', fontWeight: 600 }}>AI Predicted</div>
                <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.6, fontWeight: 500 }}>"{aiPrediction.prediction}"</p>
                <div style={{ marginTop: '0.75rem', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Confidence: {aiPrediction.confidence}%</div>
              </div>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem', fontWeight: 600 }}>You Said</div>
                <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.6, fontWeight: 500 }}>"{userTake}"</p>
              </div>
            </div>

            {aiPrediction.reasoning && (
              <div className="glass-card">
                <div style={{ fontSize: 11, color: '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.5rem', fontWeight: 600 }}>Why it predicted this</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{aiPrediction.reasoning}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
              <button onClick={() => { setStep('intro'); setUserTake(''); setAiPrediction(null) }} className="btn-primary" style={{ flex: 1, minWidth: 140 }}>
                Duel Again →
              </button>
              <a href="/roast" className="btn-outline" style={{ flex: 1, minWidth: 140, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Get Roasted 🔥
              </a>
            </div>
          </div>
        )}

        <div className="page-footer">Ego Machine · Walrus Memory Mainnet · FIFA World Cup 2026</div>
      </div>
    </main>
  )
}