'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { createSolanaDevnet, createSolanaLocalnet, createWalletUiConfig, WalletUi } from '@wallet-ui/react'
import { WalletUiGillProvider } from '@wallet-ui/react-gill'
import { solanaMobileWalletAdapter } from './solana-mobile-wallet-adapter'

export function SolanaProvider({ children }: { children: ReactNode }) {
  // Create config inside component to avoid SSR issues
  const config = useMemo(() => createWalletUiConfig({
    clusters: [createSolanaDevnet(), createSolanaLocalnet()],
  }), [])

  useEffect(() => {
    // Initialize mobile wallet adapter only on the client side
    solanaMobileWalletAdapter({ clusters: config.clusters })
  }, [config])

  return (
    <WalletUi config={config}>
      <WalletUiGillProvider>{children}</WalletUiGillProvider>
    </WalletUi>
  )
}
