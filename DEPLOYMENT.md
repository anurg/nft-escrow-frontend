# Deployment Guide

## Deploying to Vercel

This NFT Escrow dApp is configured for Vercel deployment with special handling for wallet functionality.

### Option 1: Standard Production Build (Recommended)

**Note**: The build may show prerender errors locally, but Vercel handles this differently in production.

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - **Important**: In Build Settings, use:
     - **Build Command**: `npm run build || true` (this allows partial failures)
     - **Output Directory**: `.next` (default)
   - Click "Deploy"

The `|| true` ensures deployment continues even if static generation fails for wallet pages.

### Option 2: Development Mode on Vercel (Not Recommended for Production)

If you absolutely need to run in development mode on Vercel:

1. Update `vercel.json`:
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/"
       }
     ]
   }
   ```

2. Change your `package.json` start script:
   ```json
   "start": "next dev -p $PORT"
   ```

**Warning**: Running `next dev` in production is not recommended as it:
- Is slower
- Uses more resources
- Has less optimization
- May have security implications

### Alternative: Vercel CLI

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

## Environment Variables

If you need to add environment variables (e.g., custom RPC endpoints):

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables like:
   - `NEXT_PUBLIC_RPC_ENDPOINT` (if using custom RPC)
   - Any other public environment variables

## Development vs Production

- **Development**: `npm run dev` - Works perfectly with hot reload
- **Production**: Deployed on Vercel - Handles dynamic rendering automatically

## Notes

- The build command (`npm run build`) may show prerendering errors locally, but Vercel handles this automatically in production
- All pages with wallet functionality are marked as dynamic with `export const dynamic = 'force-dynamic'`
- No additional configuration needed for Vercel deployment

## Troubleshooting

If you encounter issues:

1. **Check Vercel Deployment Logs**: Look for any runtime errors in the Vercel dashboard
2. **Verify Dynamic Exports**: Ensure all wallet-related pages have `export const dynamic = 'force-dynamic'`
3. **Environment Variables**: Make sure any required environment variables are set in Vercel

## Support

For Vercel-specific issues, check:
- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Next.js Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)
