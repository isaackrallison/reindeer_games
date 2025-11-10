# Troubleshooting Environment Variables

## Issue: Environment variables not loading in dev server

If you're seeing errors about missing `NEXT_PUBLIC_*` environment variables:

### Step 1: Verify .env.local exists and is formatted correctly

```bash
# Check if file exists
ls -la .env.local

# View contents (should show your variables)
cat .env.local
```

The file should look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:**
- No quotes around values
- No spaces around the `=` sign
- Each variable on its own line
- No trailing spaces

### Step 2: Clear Next.js cache

```bash
rm -rf .next
```

### Step 3: Fully restart the dev server

1. **Stop the server completely** (Ctrl+C)
2. **Wait a few seconds**
3. **Start it again:**
   ```bash
   npm run dev
   ```

### Step 4: Verify variables are loaded

After restarting, check the terminal output. You should see:
```
▲ Next.js 15.5.6
- Environments: .env.local
```

If you see this, Next.js has loaded your .env.local file.

### Step 5: Hard refresh the browser

1. Clear browser cache
2. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Or open in incognito/private mode

## Common Issues

### Issue: Variables exist but still getting errors

**Solution:** Next.js embeds `NEXT_PUBLIC_*` variables at compile time. You MUST:
1. Stop the dev server
2. Clear `.next` folder
3. Restart the dev server

### Issue: Build works but dev server doesn't

This usually means the dev server cache is stale. Clear `.next` and restart.

### Issue: Variables work in one file but not another

Make sure you're accessing them directly:
```typescript
// ✅ Good - direct access
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ❌ Bad - through a function that might not work in client
const url = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
```

## Still Not Working?

1. Check that `.env.local` is in the project root (same level as `package.json`)
2. Verify there are no syntax errors in `.env.local`
3. Try creating a new `.env.local` file from scratch
4. Check that you're using `NEXT_PUBLIC_` prefix (required for client-side access)
5. Make sure the dev server output shows "- Environments: .env.local"

