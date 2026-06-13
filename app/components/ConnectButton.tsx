'use client'

import { useCurrentAccount, useConnectWallet, useDisconnectWallet, useWallets } from '@mysten/dapp-kit'
import { useState } from 'react'

export default function WalletConnectButton() {
  const account = useCurrentAccount()
  const wallets = useWallets()
  const { mutate: connect } = useConnectWallet()
  const { mutate: disconnect } = useDisconnectWallet()
  const [hover, setHover] = useState(false)

  const shortAddress = account?.address
    ? account.address.slice(0, 6) + '...' + account.address.slice(-4)
    : null

  if (account) {
    return (
      <button
        onClick={() => disconnect()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="nav-pill"
        style={{
          cursor: 'pointer',
          background: hover ? 'rgba(59,130,246,0.15)' : 'transparent',
          border: '0.5px solid #3b82f6',
          color: '#fff',
          transition: 'all 0.2s',
        }}
      >
        {shortAddress}
      </button>
    )
  }

  return (
    <button
      onClick={() => {
        if (wallets.length > 0) {
          connect({ wallet: wallets[0] })
        } else {
          window.open('https://suiwallet.com', '_blank')
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="nav-pill"
      style={{
        cursor: 'pointer',
        background: hover ? 'rgba(59,130,246,0.15)' : 'transparent',
        border: '0.5px solid #3b82f6',
        color: '#fff',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      Connect Wallet
    </button>
  )
}