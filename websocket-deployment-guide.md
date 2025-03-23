# WebSocket Deployment Guide

Based on your multi-environment WebSocket setup, here's how to ensure real-time score updates work across all environments:

## Local Development
- WebSocket URL: `ws://localhost:3007/api/scores/ws`
- Uses custom WebSocket server in `server.js`
- Connects to development database

## Preview/Production Deployments
- WebSocket URL: Auto-detected based on host
- Uses Vercel's serverless functions
- Connects to respective environment databases

## Vercel Configuration
Ensure your `vercel.json` file has the correct configuration for WebSockets:

```json
{
  "version": 2,
  "functions": {
    "api/scores/ws/route.ts": {
      "maxDuration": 60
    }
  }
}
```

## Testing WebSockets in Different Environments

1. **Local**: 
   - Run `npm run dev` and verify WebSocket connections in browser console

2. **Preview/Development**:
   - After deploying to a preview URL, open browser console and verify WebSocket connections
   - Check for messages like "WebSocket connected" or "Using WebSocket URL: wss://..."

3. **Production**:
   - Same verification process as preview, but on production URL

## Troubleshooting WebSockets

If WebSockets aren't working in a deployed environment:

1. Check browser console for connection errors
2. Verify the WebSocket URL is correctly determined based on the environment
3. Ensure Supabase real-time subscriptions are properly initialized
4. Confirm the fallback polling mechanism works if WebSockets fail

## Code Verification

The key files to verify:
- `app/components/HoleByHoleScorecard.tsx`: Client-side WebSocket handling
- `app/api/scores/ws/route.ts`: WebSocket server implementation
- `server.js`: Custom development server
- `vercel.json`: Production WebSocket configuration
