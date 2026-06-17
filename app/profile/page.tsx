'use client'

import { useState, useEffect } from 'react'
import WalletConnectButton from '../components/ConnectButton'

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

export default function ProfilePage() {
  const [userId, setUserId] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  

  useEffect(() => {
    const saved = localStorage.getItem('ego-machine-userId')
    if (saved) { setUserId(saved); fetchProfile(saved) }
    else window.location.href = '/'
  }, [])


  async function fetchProfile(uid: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/get-profile?userId=${uid}`)
      const data = await res.json()
      setProfile(data)
    } catch (e) {
      setError('Failed to load profile')
    }
    setLoading(false)
  }

  function shareOnX() {
    if (!profile) return
    const archetype = profile.archetype ? profile.archetype.toUpperCase() : ''
    const text = 'The Ego Machine just diagnosed me as THE ' + archetype + ' ' + (profile.archetypeEmoji || '') + '\n\n"' + profile.roastLine + '"\n\n' + profile.contradictionCount + ' contradictions. ' + profile.takesCount + ' takes.\n\nBuilt on @walrusprotocol Memory\n\n#Walrus #WorldCup2026'
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank')
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'top center', backgroundColor: '#080808', backgroundAttachment: 'fixed' }} />
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
            <a key={nav.href} href={nav.href} className={`nav-tab ${nav.href === '/profile' ? 'active' : ''}`}>
              {nav.label}
            </a>
          ))}
        </div>

        <h1 className="page-title">Your Ego Profile</h1>
        <p className="page-subtitle">Built from your Walrus Memory. Gets more accurate every day.</p>

        {loading && <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Analysing your psychology...</div>}

        {!loading && profile?.insufficientData && (
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>🧠</div>
            <h3 style={{ fontSize: 18, color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Not enough data yet</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', lineHeight: 1.6 }}>Submit at least 2 takes in the Arena and come back.</p>
            <a href="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '12px 28px', borderRadius: 100, textDecoration: 'none' }}>Go Drop Takes →</a>
          </div>
        )}

        {!loading && profile && !profile.insufficientData && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div className="glass-card">
              <div style={{ fontSize: 11, color: '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '1rem', fontWeight: 600 }}>Your Archetype</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1rem', flexWrap: 'wrap' as const }}>
                <div style={{ fontSize: 48 }}>{profile.archetypeEmoji}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>THE {profile.archetype?.toUpperCase()}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Fan Psychology Type</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1rem' }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' as const, lineHeight: 1.6 }}>"{profile.roastLine}"</p>
              </div>
            </div>

            <div className="stats-grid">
              {[
                { label: 'Takes Stored', value: profile.takesCount ?? 0 },
                { label: 'Contradictions', value: profile.contradictionCount ?? 0 },
                { label: 'Confidence Score', value: profile.confidenceScore ?? 0 },
              ].map(stat => (
                <div key={stat.label} className="glass-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {profile.biases && (
              <div className="glass-card">
                <div style={{ fontSize: 11, color: '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '1.25rem', fontWeight: 600 }}>Your Biases</div>
                {profile.biases.map((bias: any) => (
                  <div key={bias.name} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{bias.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>{bias.percentage}%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${bias.percentage}%`, background: '#3b82f6', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

      
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
              <button onClick={shareOnX} className="btn-primary" style={{ flex: 1, minWidth: 140 }}>Share on X →</button>
              <a href="/roast" className="btn-outline" style={{ flex: 1, minWidth: 140, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Get Roasted 🔥</a>
            </div>

          </div>
        )}

        {error && <div style={{ color: '#f87171', fontSize: 13, padding: '1rem' }}>{error}</div>}

        <div className="page-footer">Ego Machine · Walrus Memory Mainnet · FIFA World Cup 2026</div>
      </div>
    </main>
  )
}