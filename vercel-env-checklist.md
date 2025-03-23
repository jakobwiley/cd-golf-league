# Vercel Environment Variables Checklist

## Required for All Environments
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)

## Environment-Specific Configuration
| Environment | NEXT_PUBLIC_SUPABASE_URL | Database |
|-------------|--------------------------|----------|
| Development | https://gyvaalhcjrwozinpilsw.supabase.co | Development DB |
| Preview     | https://gyvaalhcjrwozinpilsw.supabase.co | Development DB |
| Production  | https://ylhwysupdkmbunaascky.supabase.co | Production DB |

## How to Configure in Vercel
1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add each variable with the appropriate scope (Development, Preview, Production)
4. For variables that should be different per environment, add them separately with the appropriate scope selected

## Verifying Environment Variables
You can verify that environment variables are correctly set by adding a simple debug endpoint:

```typescript
// app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    environment: process.env.VERCEL_ENV || 'local'
  });
}
```

> **Note**: This endpoint should be removed or protected before final production deployment.
