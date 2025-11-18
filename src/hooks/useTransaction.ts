'use client'

import { useState, useCallback } from 'react'
import { TransactionInstruction, Keypair } from '@solana/web3.js'
import { useWallet } from './useWallet'

/**
 * Legacy transaction hook - not currently used in the application.
 * The app uses Gill and wallet-ui for transaction handling instead.
 */
export function useTransaction() {
  const wallet = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendTransaction = useCallback(
    async (_instructions: TransactionInstruction[], _signers?: Keypair[]): Promise<string> => {
      if (!wallet.publicKey) {
        throw new Error('Wallet not connected')
      }

      setLoading(true)
      setError(null)

      try {
        // Note: This is legacy code that requires wallet adapter's signTransaction
        // In production, use the Gill-based transaction methods in useEscrowTransactions
        throw new Error('This hook is deprecated. Use useEscrowTransactions instead.')
      } catch (err) {
        const error = err as Error;
        const errorMessage = error?.message || 'Transaction failed'
        setError(errorMessage)
        setLoading(false)
        throw new Error(errorMessage)
      }
    },
    [wallet],
  )

  return {
    sendTransaction,
    loading,
    error,
  }
}
