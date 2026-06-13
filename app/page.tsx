'use client'

import { useState, useEffect } from 'react'
import WalletConnectButton from './components/ConnectButton'

// First 2 weeks of FIFA World Cup 2026 with country codes
const MATCH_DATA = [
  // Week 1 - June 11-17
  { home: "Mexico", away: "South Africa", date: "Jun 11", homeCode: "MX", awayCode: "ZA" },
  { home: "South Korea", away: "Czechia", date: "Jun 12", homeCode: "KR", awayCode: "CZ" },
  { home: "Canada", away: "Bosnia & Herzegovina", date: "Jun 13", homeCode: "CA", awayCode: "BA" },
  { home: "USA", away: "Paraguay", date: "Jun 13", homeCode: "US", awayCode: "PY" },
  { home: "Qatar", away: "Switzerland", date: "Jun 14", homeCode: "QA", awayCode: "CH" },
  { home: "Brazil", away: "Morocco", date: "Jun 14", homeCode: "BR", awayCode: "MA" },
  { home: "Haiti", away: "Scotland", date: "Jun 14", homeCode: "HT", awayCode: "GB-SCT" },
  { home: "Australia", away: "Turkey", date: "Jun 14", homeCode: "AU", awayCode: "TR" },
  { home: "Germany", away: "Curaçao", date: "Jun 14", homeCode: "DE", awayCode: "CW" },
  { home: "Netherlands", away: "Japan", date: "Jun 15", homeCode: "NL", awayCode: "JP" },
  { home: "Ivory Coast", away: "Ecuador", date: "Jun 15", homeCode: "CI", awayCode: "EC" },
  { home: "Spain", away: "Cape Verde", date: "Jun 15", homeCode: "ES", awayCode: "CV" },
  { home: "Belgium", away: "Egypt", date: "Jun 16", homeCode: "BE", awayCode: "EG" },
  { home: "Saudi Arabia", away: "Uruguay", date: "Jun 16", homeCode: "SA", awayCode: "UY" },
  { home: "France", away: "Senegal", date: "Jun 17", homeCode: "FR", awayCode: "SN" },
  { home: "Argentina", away: "Algeria", date: "Jun 17", homeCode: "AR", awayCode: "DZ" },
  { home: "Portugal", away: "DR Congo", date: "Jun 17", homeCode: "PT", awayCode: "CD" },
  
  // Week 2 - June 18-24
  { home: "England", away: "Croatia", date: "Jun 18", homeCode: "GB-ENG", awayCode: "HR" },
  { home: "Canada", away: "Qatar", date: "Jun 19", homeCode: "CA", awayCode: "QA" },
  { home: "Mexico", away: "South Korea", date: "Jun 19", homeCode: "MX", awayCode: "KR" },
  { home: "USA", away: "Australia", date: "Jun 20", homeCode: "US", awayCode: "AU" },
  { home: "Brazil", away: "Haiti", date: "Jun 20", homeCode: "BR", awayCode: "HT" },
  { home: "Germany", away: "Ivory Coast", date: "Jun 21", homeCode: "DE", awayCode: "CI" },
  { home: "Spain", away: "Saudi Arabia", date: "Jun 21", homeCode: "ES", awayCode: "SA" },
  { home: "Argentina", away: "Austria", date: "Jun 22", homeCode: "AR", awayCode: "AT" },
  { home: "France", away: "Iraq", date: "Jun 23", homeCode: "FR", awayCode: "IQ" },
  { home: "Portugal", away: "Uzbekistan", date: "Jun 23", homeCode: "PT", awayCode: "UZ" },
  { home: "England", away: "Ghana", date: "Jun 24", homeCode: "GB-ENG", awayCode: "GH" },
]

// Generate display strings for dropdown
const MATCHES = MATCH_DATA.map(m => `${m.home} vs ${m.away} — ${m.date}`)

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

// Flag component using emoji flags
function Flag({ countryCode }: { countryCode: string }) {
  // Special handling for subdivisions
  const flagMap: { [key: string]: string } = {
    'GB-ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'GB-SCT': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  }
  
  if (flagMap[countryCode]) {
    return <span style={{ fontSize: 20 }}>{flagMap[countryCode]}</span>
  }
  
  // Convert country code to flag emoji
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  
  return <span style={{ fontSize: 20 }}>{String.fromCodePoint(...codePoints)}</span>
}

// Match option component with flags
function MatchOption({ match }: { match: typeof MATCH_DATA[0] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
      <Flag countryCode={match.homeCode} />
      <span style={{ fontWeight: 600 }}>{match.home}</span>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>vs</span>
      <Flag countryCode={match.awayCode} />
      <span style={{ fontWeight: 600 }}>{match.away}</span>
      <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
        {match.date}
      </span>
    </div>
  )
}

export default function Home() {
  const [userId, setUserId] = useState('')
  const [inputName, setInputName] = useState('')
  const [takeText, setTakeText] = useState('')
  const [matchContext, setMatchContext] = useState(MATCHES[0])
  const [confidence, setConfidence] = useState(5)
  const [loading, setLoading] = useState(false)
  const [egoResponse, setEgoResponse] = useState('')
  const [memoriesCount, setMemoriesCount] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [enterHover, setEnterHover] = useState(false)
  const [submitHover, setSubmitHover] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ego-machine-userId')
    if (saved) {
      setUserId(saved)
      setHasEntered(true)
      // Load memories count on startup
      fetch('/api/get-memories?userId=' + saved)
        .then(r => r.json())
        .then(data => {
          if (data.memories) setMemoriesCount(data.memories.length)
        })
        .catch(() => {})
    }
  }, [])

  function enterArena() {
    if (!inputName.trim()) return
    const id = inputName.trim().toLowerCase().replace(/\s+/g, '-')
    localStorage.setItem('ego-machine-userId', id)
    setUserId(id)
    setHasEntered(true)
  }

  async function submitTake() {
    if (!takeText.trim()) return
    setLoading(true)
    setEgoResponse('')
    try {
      const res = await fetch('/api/submit-take', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, takeText: `[Confidence: ${confidence}/10] ${takeText}`, matchContext }),
      })
      const data = await res.json()
      if (data.success) {
        setEgoResponse(data.egoResponse)
        setMemoriesCount(data.memoriesCount)
        setTakeText('')
      } else {
        setEgoResponse('Error: ' + data.error)
      }
    } catch {
      setEgoResponse('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  // Get current match data for display
  const currentMatchIndex = MATCHES.indexOf(matchContext)
  const currentMatch = MATCH_DATA[currentMatchIndex] || MATCH_DATA[0]

  if (!hasEntered) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
  <source src="/hero-video.mp4" type="video/mp4" />
</video>
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.7) 70%, rgba(8,8,8,0.97) 100%)' }} />

        <nav style={{ position: 'relative', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 2rem', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <Logo size={20} />
          <a href="https://docs.wal.app" target="_blank" className="nav-docs">Read the docs ↗</a>
        </nav>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: '4rem 1.5rem 3rem' }}>
          <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 11, color: '#e2e8f0', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: '1.75rem', backdropFilter: 'blur(8px)' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6' }} />
              FIFA World Cup 2026 · Live
            </div>

            <div style={{ marginBottom: '1rem' }}><Logo size={48} /></div>

            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              The AI that stores every football take.<br />
              Builds your psychology. Then exposes you.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '1.25rem', marginBottom: '1rem' }}>
              <div className="enter-row" style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && enterArena()}
                  style={{ flex: 1, borderRadius: 100, padding: '13px 20px', background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 14, outline: 'none', minWidth: 0 }}
                />
                <button
                  onClick={enterArena}
                  onMouseEnter={() => setEnterHover(true)}
                  onMouseLeave={() => setEnterHover(false)}
                  style={{ borderRadius: 100, padding: '13px 24px', background: enterHover ? '#60a5fa' : '#3b82f6', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const, transition: 'all 0.2s', flexShrink: 0 }}
                >
                  Enter →
                </button>
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Powered by Walrus Memory · Mainnet</p>
          </div>
        </div>

        <div style={{ overflow: 'hidden', borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '10px 0', position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', animation: 'marquee 25s linear infinite', width: 'max-content' }}>
            {[...Array(8)].map((_, i) => (
              <span key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, paddingRight: '3rem', whiteSpace: 'nowrap' as const }}>
                Trust the Tusk · Walrus Memory · World Cup 2026 · Drop Your Take ·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingBottom: '6rem' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#080808' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.65)' }} />

      <div className="page-wrapper" style={{ position: 'relative', zIndex: 10 }}>

        <nav className="navbar">
          <a href="/" style={{ textDecoration: 'none' }}><Logo /></a>
          <div className="navbar-right">
  <div className="nav-pill">{memoriesCount} memories</div>
  <div className="nav-pill">{userId}</div>
  <WalletConnectButton />
  <a href="https://docs.wal.app" target="_blank" className="nav-docs">Docs ↗</a>
</div>
        </nav>

        <div className="nav-tabs">
          {NAV.map(nav => (
            <a key={nav.href} href={nav.href} className={`nav-tab ${nav.href === '/' ? 'active' : ''}`}>
              {nav.label}
            </a>
          ))}
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <h1 className="page-title">Drop Your Take</h1>
          <p className="page-subtitle">The Ego Machine is watching. And remembering everything.</p>
        </div>

        <div className="glass-card" style={{ marginBottom: '1rem' }}>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="field-label">Match</label>
            
            {/* Selected Match Display with Flags */}
            <div style={{ 
              background: 'rgba(255,255,255,0.06)', 
              border: '0.5px solid rgba(255,255,255,0.1)', 
              borderRadius: 10, 
              padding: '14px 16px',
              marginBottom: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Flag countryCode={currentMatch.homeCode} />
                <span style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{currentMatch.home}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600 }}>VS</span>
                <Flag countryCode={currentMatch.awayCode} />
                <span style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{currentMatch.away}</span>
                <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>
                  {currentMatch.date}
                </span>
              </div>
            </div>
            
            {/* Dropdown */}
            <select 
              value={matchContext} 
              onChange={e => setMatchContext(e.target.value)} 
              style={{ 
                width: '100%', 
                borderRadius: 10, 
                padding: '12px 14px', 
                background: 'rgba(255,255,255,0.06)', 
                border: '0.5px solid rgba(255,255,255,0.1)', 
                color: '#fff', 
                fontSize: 14, 
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {MATCHES.map((m, idx) => (
                <option key={m} value={m} style={{ background: '#0a0f1e', color: '#fff' }}>
                  {MATCH_DATA[idx].home} vs {MATCH_DATA[idx].away} — {MATCH_DATA[idx].date}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="field-label">Your Hot Take</label>
            <textarea rows={4} placeholder="Brazil are overrated. England will bottle it. Mbappe is finished. Say it." value={takeText} onChange={e => setTakeText(e.target.value)} style={{ width: '100%', borderRadius: 10, padding: '13px 14px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', resize: 'none' as const, lineHeight: 1.6, fontFamily: 'inherit' }} />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <label className="field-label" style={{ marginBottom: 0 }}>Confidence</label>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>{confidence}/10</span>
            </div>
            <input type="range" min={1} max={10} value={confidence} onChange={e => setConfidence(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#3b82f6' }}>Unsure</span>
              <span style={{ fontSize: 11, color: '#3b82f6' }}>Absolutely certain</span>
            </div>
          </div>

          <button
            onClick={submitTake}
            disabled={loading || !takeText.trim()}
            onMouseEnter={() => setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
            className="btn-primary"
            style={{ background: loading || !takeText.trim() ? undefined : submitHover ? '#60a5fa' : '#3b82f6' }}
          >
            {loading ? 'Analysing...' : 'Submit Take →'}
          </button>
        </div>

        {egoResponse && (
          <div className="glass-card" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '0.5px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>E</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>The Ego Machine</div>
                <div style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>Powered by Walrus Memory</div>
              </div>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#ffffff', lineHeight: 1.8, marginBottom: '1rem' }}>{egoResponse}</p>
            <div style={{ display: 'flex', gap: 8, paddingTop: '1rem', borderTop: '0.5px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' as const }}>
              <a href="/profile" className="nav-docs" style={{ padding: '6px 16px', fontSize: 12 }}>View Profile →</a>
              <a href="/roast" className="nav-docs" style={{ padding: '6px 16px', fontSize: 12 }}>Get Roasted →</a>
            </div>
          </div>
        )}

        <div className="page-footer">Ego Machine · Walrus Memory Mainnet · FIFA World Cup 2026</div>
      </div>
    </main>
  )
}