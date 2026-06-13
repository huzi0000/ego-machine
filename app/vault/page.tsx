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

export default function VaultPage() {
  const [userId, setUserId] = useState('')
  const [memories, setMemories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('ego-machine-userId')
    if (saved) { setUserId(saved); fetchMemories(saved) }
    else window.location.href = '/'
  }, [])

  async function fetchMemories(uid: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/get-memories?userId=${uid}`)
      const data = await res.json()
      setMemories(data.memories || [])
    } catch (e) {
      setMemories([])
    }
    setLoading(false)
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
            <a key={nav.href} href={nav.href} className={`nav-tab ${nav.href === '/vault' ? 'active' : ''}`}>
              {nav.label}
            </a>
          ))}
        </div>

        <h1 className="page-title">Memory Vault</h1>
        <p className="page-subtitle">Every memory stored on Walrus Protocol. On-chain. Permanent. Verifiable.</p>

        <div style={{ background: 'rgba(59,130,246,0.06)', border: '0.5px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>🔐</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>No wallet needed</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Your memories are stored permanently on Walrus Protocol Mainnet. We handle all storage on your behalf — every take you drop is verifiable on-chain by anyone, forever.</div>
          </div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '7px 14px', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>Live on Walrus Mainnet</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', wordBreak: 'break-all' as const }}>relayer.memory.walrus.xyz</span>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading vault...</div>}

        {!loading && memories.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>🔮</div>
            <h3 style={{ fontSize: 18, color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Vault is empty</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>No memories stored yet.</p>
            <a href="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '12px 28px', borderRadius: 100, textDecoration: 'none' }}>Go Drop Takes →</a>
          </div>
        )}

        {!loading && memories.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            <div className="stats-grid" style={{ marginBottom: '0.5rem' }}>
              {[
                { label: 'Memories', value: memories.length },
                { label: 'Storage', value: 'Walrus' },
                { label: 'Network', value: 'Mainnet' },
              ].map(stat => (
                <div key={stat.label} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {memories.map((memory: any, i: number) => {
              const text = memory.text || memory.content || JSON.stringify(memory)
              const cleanText = text.replace(/\[Match:[^\]]+\]/g, '').replace(/\[Date:[^\]]+\]/g, '').replace(/\[Confidence:[^\]]+\]/g, '').trim()
              const matchTag = text.match(/\[Match: ([^\]]+)\]/)?.[1]
              const date = text.match(/\[Date: ([^\]]+)\]/)?.[1]
              const memoryId = memory.blob_id || memory.displayId || memory.id || `mem_${i}`
              const shortId = typeof memoryId === 'string' ? memoryId.slice(0, 16) : `mem_${String(i).padStart(3, '0')}`
              const explorerUrl = memory.blob_id ? `https://walruscan.com/mainnet/blob/${memory.blob_id}` : null

              return (
                <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap' as const, gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{shortId}...</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>#{i + 1}</span>
                      {explorerUrl && (
                        <a href={explorerUrl} target="_blank" style={{ fontSize: 11, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '2px 8px', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' as const }}>
                          Explorer ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.6, marginBottom: '0.75rem' }}>"{cleanText}"</p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                    {matchTag && <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '2px 10px', color: '#3b82f6' }}>{matchTag}</span>}
                    {date && <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '2px 10px', color: 'rgba(255,255,255,0.4)' }}>{date}</span>}
                    <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '2px 10px', color: '#3b82f6' }}>On-chain ✓</span>
                  </div>
                </div>
              )
            })}

            <div className="glass-card" style={{ textAlign: 'center', padding: '1rem' }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                All memories stored permanently on <span style={{ color: '#3b82f6', fontWeight: 600 }}>Walrus Protocol Mainnet</span><br />
                Decentralized · Verifiable · Persistent across sessions
              </p>
            </div>

          </div>
        )}

        <div className="page-footer">Ego Machine · Walrus Memory Mainnet · FIFA World Cup 2026</div>
      </div>
    </main>
  )
}