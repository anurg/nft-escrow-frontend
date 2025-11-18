import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */

  // Vercel automatically handles dynamic rendering for pages with 'export const dynamic = force-dynamic'
  // No special config needed - the dynamic exports in each page handle this

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.irys.xyz',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
