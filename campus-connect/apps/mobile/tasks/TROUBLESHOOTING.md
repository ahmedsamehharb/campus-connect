# Troubleshooting: Cannot Run the App

## Common Issues and Solutions

### Issue 1: "Command not found" or "npm not recognized"

**Solution:**
1. Make sure Node.js is installed
2. Check: `node --version` (should show v18 or higher)
3. Check: `npm --version` (should show v9 or higher)
4. If not installed, download from: https://nodejs.org/

---

### Issue 2: "Cannot find module" errors

**Solution:**
1. Navigate to the mobile app directory:
   ```bash
   cd "C:\Users\Ahmed Sameh\H project\campus-connect\apps\mobile"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Wait for installation to complete (may take 2-5 minutes)

---

### Issue 3: Port 8081 already in use

**Solution:**
1. Find what's using port 8081:
   ```bash
   netstat -ano | findstr :8081
   ```

2. Kill the process (replace PID with the number from above):
   ```bash
   taskkill /PID <PID> /F
   ```

3. Or use a different port:
   ```bash
   npx expo start --port 8082
   ```

---

### Issue 4: Expo CLI not found

**Solution:**
1. Install Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```

2. Or use npx (no installation needed):
   ```bash
   npx expo start
   ```

---

### Issue 5: Missing .env file

**Solution:**
1. Check if `.env` file exists in `apps/mobile/` directory
2. If missing, create it with:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

---

### Issue 6: TypeScript errors

**Solution:**
1. Clear cache and restart:
   ```bash
   npx expo start --clear
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

### Issue 7: "Metro bundler" errors

**Solution:**
1. Clear Metro cache:
   ```bash
   npx expo start --clear
   ```

2. Reset Metro bundler:
   ```bash
   npx react-native start --reset-cache
   ```

---

## Step-by-Step: Fresh Start

If nothing works, try this complete reset:

1. **Navigate to app directory:**
   ```bash
   cd "C:\Users\Ahmed Sameh\H project\campus-connect\apps\mobile"
   ```

2. **Clean everything:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Recurse -Force .expo
   ```

3. **Reinstall:**
   ```bash
   npm install
   ```

4. **Start fresh:**
   ```bash
   npx expo start --clear
   ```

---

## What Error Are You Seeing?

Please tell me:
1. **Exact error message** (copy/paste it)
2. **When it happens** (during npm start? when opening app?)
3. **What you tried** (any solutions you attempted)

---

## Quick Diagnostic Commands

Run these to check your setup:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check if in correct directory
cd "C:\Users\Ahmed Sameh\H project\campus-connect\apps\mobile"
Get-Location

# Check if package.json exists
Test-Path package.json

# Check if node_modules exists
Test-Path node_modules

# Check if .env exists
Test-Path .env
```

---

## Still Stuck?

Tell me:
1. The exact error message you see
2. What command you ran
3. What happened (or didn't happen)

I'll help you fix it! 🚀

