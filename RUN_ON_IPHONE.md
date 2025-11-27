# 📱 Running Campus Connect on iPhone

## Prerequisites

1. **Install Expo Go on your iPhone**
   - Download from the [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - This app lets you run your development app on your phone

2. **Make sure your iPhone and computer are on the same WiFi network**

## Steps to Run

### Step 1: Navigate to the mobile app directory
```bash
cd campus-connect/apps/mobile
```

### Step 2: Start the Expo development server
```bash
npx expo start
```

### Step 3: Connect your iPhone

**Option A: Scan QR Code (Recommended)**
1. When Expo starts, you'll see a QR code in the terminal
2. Open the **Camera app** on your iPhone (iOS 11+)
3. Point it at the QR code
4. Tap the notification that appears
5. The app will open in Expo Go

**Option B: Use Expo Go directly**
1. Open the **Expo Go** app on your iPhone
2. Tap "Scan QR Code"
3. Scan the QR code from the terminal

**Option C: Use the iOS Simulator (if you have Xcode)**
- Press `i` in the terminal to open in iOS Simulator
- Requires Xcode installed on your Mac

### Step 4: Development Tips

- **Shake your phone** or press `Cmd+D` (in simulator) to open the developer menu
- **Reload the app**: Press `r` in the terminal or shake device → "Reload"
- **Open developer tools**: Press `j` in the terminal
- **Stop the server**: Press `Ctrl+C` in the terminal

## Troubleshooting

### "Unable to connect to Expo"
- Make sure your iPhone and computer are on the same WiFi network
- Try restarting the Expo server
- Check your firewall settings

### "Network request failed"
- Verify your `.env.local` file has correct Supabase credentials
- Check that your Supabase project is active

### QR Code not scanning
- Make sure your terminal window is large enough to show the full QR code
- Try typing `i` in the terminal to open iOS Simulator instead
- Or manually enter the connection URL shown in Expo Go

### App crashes on startup
- Check the terminal for error messages
- Verify environment variables are set correctly
- Make sure all dependencies are installed: `npm install`

## Environment Variables

Your app reads from `campus-connect/.env.local`. Make sure it contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The mobile app will automatically use these values.

