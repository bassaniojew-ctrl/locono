# Fixing npm install Issue on Windows

## Problem
Windows PowerShell execution policy is blocking npm scripts from running.

## Solution Options

### Option 1: Change Execution Policy (Recommended)

Run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then verify:
```powershell
Get-ExecutionPolicy
```

Should return: `RemoteSigned`

### Option 2: Use Command Prompt Instead

Instead of PowerShell, use Command Prompt (cmd):
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project: `cd C:\Users\tella\sp`
4. Run: `npm install`

### Option 3: Bypass for Current Session Only

In PowerShell (without admin):
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm install
```

### Option 4: Use yarn or pnpm

If npm still doesn't work:

```powershell
# Install yarn globally first (one time)
npm install -g yarn

# Then use yarn instead
yarn install

# Or use pnpm
npm install -g pnpm
pnpm install
```

### Option 5: Use npx directly

```powershell
npx npm install
```

## Quick Fix Command (Run this in PowerShell)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try:
```powershell
npm install
```

## Verification

After fixing, verify npm works:
```powershell
npm --version
npm install --version
```

