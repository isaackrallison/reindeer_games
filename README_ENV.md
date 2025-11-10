# Environment Variables Setup

## Issue: Environment Variables Not Loading

If you're seeing errors about missing environment variables even though they're in `.env.local`, this is likely because:

1. **The dev server needs to be restarted** - Next.js reads environment variables at startup
2. **`NEXT_PUBLIC_` variables are embedded at build/start time** - They're included in the client bundle

## Solution

1. Stop your dev server (press `Ctrl+C` in the terminal)
2. Restart it with `npm run dev`
3. The environment variables should now be available

## Your Current Setup

Your `.env.local` file should contain:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Important Notes

- **Never commit `.env.local` to git** - It's already in `.gitignore`
- **Restart required** - Any changes to `.env.local` require a dev server restart
- **No quotes needed** - Don't wrap values in quotes (e.g., use `value` not `"value"`)
- **No spaces** - Don't put spaces around the `=` sign

## Verification

After restarting, you can verify the variables are loaded by checking the browser console. You should NOT see any errors about missing environment variables.

