'use client'

import { useMemo } from 'react'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { RPC_ENDPOINT } from '@/lib/constants'

export function useMetaplex() {
  const umi = useMemo(() => {
    return createUmi(RPC_ENDPOINT).use(mplTokenMetadata())
  }, [])

  return umi
}
