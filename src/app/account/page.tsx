'use client'

// Prevent static generation since this page uses wallet functionality
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import AccountFeatureIndex from '@/features/account/account-feature-index'

export default function Page() {
  return <AccountFeatureIndex redirect={redirect} />
}
