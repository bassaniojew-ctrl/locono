# How to Create .env.local File

## The Error
You're getting "Supabase credentials are missing" because Next.js can't find your environment variables.

## Solution: Create `.env.local` file

### Step 1: Create the file
In your project root (`C:\Users\tella\sp`), create a file named `.env.local`

### Step 2: Add your Supabase credentials

Open `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Get your Supabase credentials

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Restart the dev server

After creating/updating `.env.local`:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Example .env.local file

```env
NEXT_PUBLIC_SUPABASE_URL=https://qiygpsaptyfdiqsckjjm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWdwc2FwdHlmZGlxc2NramptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjcxMDcsImV4cCI6MjA3NzI0MzEwN30.ryOm4TVfp2wcBVPX88Lt81QPBm1i1MxYLzkZK3Qga0E
```

**Note**: The example values above are from your README.md - use your own actual credentials!

## Why .env.local?

- Next.js automatically loads `.env.local` files
- `.env.local` is ignored by git (safe for secrets)
- `NEXT_PUBLIC_` prefix makes variables available in browser code

## Troubleshooting

### Still getting error?
1. ✅ Make sure file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
2. ✅ Make sure file is in project root (same folder as `package.json`)
3. ✅ Restart the dev server after creating/updating the file
4. ✅ Check for typos in variable names (must be exact)
5. ✅ No quotes needed around values in .env files

### Check if variables are loaded
Add this temporarily to see if they're loading:
```typescript
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20));
```

