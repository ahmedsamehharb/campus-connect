# 🚀 Quick Start Guide - Campus Connect

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- Supabase account (free) - [Get one here](https://supabase.com)

---

## Option 1: Run the Web App (Next.js)

### Step 1: Navigate to the web app directory
```bash
cd campus-connect
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up Supabase (if not done already)
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your API keys from Settings → API
3. Create `.env.local` file in `campus-connect/` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
4. Run the SQL schema:
   - Go to Supabase SQL Editor
   - Copy contents from `supabase-schema.sql`
   - Run the SQL

### Step 4: Start the development server
```bash
npm run dev
```

### Step 5: Open your browser
Visit [http://localhost:3000](http://localhost:3000)

---

## Option 2: Run the Mobile App (React Native/Expo)

### Step 1: Navigate to the mobile app directory
```bash
cd campus-connect/apps/mobile
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up environment variables
Create a `.env` file in `campus-connect/apps/mobile/`:
```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_APP_NAME=Campus Connect
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Step 4: Start Expo development server
```bash
npx expo start
```

### Step 5: Run on your device/emulator
- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

**Note**: You'll need Expo Go app installed on your phone for development.

---

## Troubleshooting

### "Module not found" errors
- Make sure you've run `npm install` in the correct directory
- Try deleting `node_modules` and `package-lock.json`, then reinstall

### Supabase connection errors
- Verify your `.env.local` (web) or `.env` (mobile) file exists
- Check that your Supabase URL and keys are correct
- Make sure you've run the SQL schema in Supabase

### Port already in use
- Web app: Change port with `npm run dev -- -p 3001`
- Mobile app: Expo will automatically find an available port

---

## Need Help?

- **Web App Setup**: See `campus-connect/SETUP.md` for detailed instructions
- **Mobile App Setup**: See `campus-connect/apps/mobile/README.md` for details
- **Database Setup**: See `campus-connect/SETUP.md` for Supabase configuration

