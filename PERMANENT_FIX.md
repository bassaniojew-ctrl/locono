# Permanent Fix for npm on Windows

## What Happened

Your PowerShell execution policy was set to "Restricted", which blocks npm from running. I've temporarily fixed it for this session.

## Make It Permanent

Run PowerShell as **Administrator** and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

This will allow npm to run permanently for your user account.

## Alternative: Use Command Prompt

If you prefer not to change PowerShell settings, you can use **Command Prompt (cmd)** instead:
- Press `Win + R`
- Type `cmd` and press Enter
- Navigate to your project: `cd C:\Users\tella\sp`
- Run `npm install`

Command Prompt doesn't have execution policy restrictions.

## Verify It Works

After the permanent fix:
```powershell
npm --version
```

Should work without errors.

## Note About Auth Helpers

I've updated `package.json` to use `@supabase/ssr` instead of the deprecated `@supabase/auth-helpers-nextjs`. 

Run this to update:
```powershell
npm install
```

