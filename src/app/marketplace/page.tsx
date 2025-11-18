'use client'

import { useState } from 'react'
import { useEscrows } from '@/hooks/useEscrows'
import { useWallet } from '@/hooks/useWallet'
import { useEscrowTransactions } from '@/hooks/useEscrowTransactions'
import { EscrowCard } from '@/components/EscrowCard'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PublicKey } from '@solana/web3.js'
import { DebugEscrows } from '@/components/DebugEscrows'
import { formatSol } from '@/lib/utils'
import { EscrowWithMetadata } from '@/types/escrow'

export default function MarketplacePage() {
  const { escrows, loading, error, refetch } = useEscrows()
  const wallet = useWallet()
  const { takeEscrow, refundEscrow, loading: txLoading } = useEscrowTransactions()

  const [buyConfirm, setBuyConfirm] = useState<{ open: boolean; escrow: EscrowWithMetadata | null }>({
    open: false,
    escrow: null,
  })
  const [cancelConfirm, setCancelConfirm] = useState<{ open: boolean; escrow: EscrowWithMetadata | null }>({
    open: false,
    escrow: null,
  })

  const handleBuyClick = (escrowPublicKey: PublicKey) => {
    const escrow = escrows.find(e => e.publicKey.toBase58() === escrowPublicKey.toBase58())
    if (!escrow) return
    setBuyConfirm({ open: true, escrow })
  }

  const handleCancelClick = (escrowPublicKey: PublicKey) => {
    const escrow = escrows.find(e => e.publicKey.toBase58() === escrowPublicKey.toBase58())
    if (!escrow) return
    setCancelConfirm({ open: true, escrow })
  }

  const confirmBuy = async () => {
    if (!buyConfirm.escrow) return

    try {
      await takeEscrow(
        buyConfirm.escrow.maker,
        buyConfirm.escrow.nftMint,
        buyConfirm.escrow.received
      )
      await refetch()
    } catch (err) {
      console.error('Failed to buy NFT:', err)
    }
  }

  const confirmCancel = async () => {
    if (!cancelConfirm.escrow) return

    try {
      await refundEscrow(cancelConfirm.escrow.nftMint)
      await refetch()
    } catch (err) {
      console.error('Failed to cancel listing:', err)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">NFT Marketplace</h1>
            <p className="text-gray-500">Browse and purchase NFTs listed for sale</p>
          </div>
          <DebugEscrows />
          <Button onClick={refetch} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading marketplace...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && escrows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No NFTs listed for sale yet</p>
          <p className="text-sm text-gray-400 mt-2">Be the first to list your NFT!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {escrows.map((escrow) => {
          const isOwner = !!wallet.publicKey && escrow.maker.toBase58() === wallet.publicKey

          return (
            <EscrowCard
              key={escrow.publicKey.toBase58()}
              escrow={escrow}
              isOwner={isOwner}
              onBuy={() => handleBuyClick(escrow.publicKey)}
              onCancel={() => handleCancelClick(escrow.publicKey)}
            />
          )
        })}
      </div>

      {/* Buy Confirmation Dialog */}
      <ConfirmDialog
        open={buyConfirm.open}
        onOpenChange={(open) => setBuyConfirm({ open, escrow: null })}
        onConfirm={confirmBuy}
        title="Confirm Purchase"
        description={
          buyConfirm.escrow
            ? `Are you sure you want to buy ${buyConfirm.escrow.metadata?.name || 'this NFT'} for ${formatSol(buyConfirm.escrow.received)}?`
            : ''
        }
        confirmText="Buy Now"
        loading={txLoading}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelConfirm.open}
        onOpenChange={(open) => setCancelConfirm({ open, escrow: null })}
        onConfirm={confirmCancel}
        title="Cancel Listing"
        description={
          cancelConfirm.escrow
            ? `Are you sure you want to cancel the listing for ${cancelConfirm.escrow.metadata?.name || 'this NFT'}? The NFT will be returned to your wallet.`
            : ''
        }
        confirmText="Cancel Listing"
        variant="destructive"
        loading={txLoading}
      />
    </div>
  )
}
