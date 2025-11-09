# Quick Fix: Create .env.local

## The Problem
Next.js can't find your Supabase credentials because the `.env.local` file doesn't exist.

## The Solution

### Option 1: Use PowerShell to create it

Run this command in PowerShell (in your project folder):

```powershell
@"
NEXT_PUBLIC_SUPABASE_URL=https://qiygpsaptyfdiqsckjjm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWdwc2FwdHlmZGlxc2NramptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjcxMDcsImV4cCI6MjA3NzI0MzEwN30.ryOm4TVfp2wcBVPX88Lt81QPBm1i1MxYLzkZK3Qga0E
"@ | Out-File -FilePath .env.local -Encoding utf8
```

### Option 2: Create manually

1. In your project folder, create a new file named `.env.local` (note the dot at the start)
2. Paste these lines:

```
NEXT_PUBLIC_SUPABASE_URL=https://qiygpsaptyfdiqsckjjm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeWdwc2FwdHlmZGlxc2NramptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjcxMDcsImV4cCI6MjA3NzI0MzEwN30.ryOm4TVfp2wcBVPX88Lt81QPBm1i1MxYLzkZK3Qga0E
```

### After creating the file:

1. **Stop your dev server** (if running) - Press `Ctrl+C`
2. **Restart it**:
   ```powershell
   npm run dev
   ```

The error should be gone!

## Important Notes

- Use your **actual** Supabase credentials if different from above
- The file must be named **exactly** `.env.local` (not `.env` or `.env.local.txt`)
- File must be in the **project root** (same folder as `package.json`)
- **Restart the server** after creating/updating the file

