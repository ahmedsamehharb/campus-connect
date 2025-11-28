# Tasks: Implement Forget Password Functionality

## Relevant Files

- `apps/mobile/lib/supabase.ts` - Contains Supabase auth helper functions, needs `resetPassword` and `updatePassword` functions added.
- `apps/mobile/app/(auth)/login.tsx` - Login screen, needs "Forgot Password?" link to navigate to forgot password screen.
- `apps/mobile/app/(auth)/forgot-password.tsx` - New screen for requesting password reset (to be created).
- `apps/mobile/app/(auth)/reset-password.tsx` - New screen for setting new password (to be created).
- `apps/mobile/app/auth/callback.tsx` - Auth callback handler, needs to handle `type=recovery` and navigate to reset password screen.

### Notes

- All new screens should follow the existing design patterns from `login.tsx` and `signup.tsx`.
- Use in-page messages (not Alert.alert()) for errors and success messages, matching the signup screen pattern.
- Password validation should match signup requirements (minimum 6 characters).

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/forget-password`)
  - [x] 0.2 Verify you're on the new branch with `git branch`

- [x] 1.0 Add password reset API functions to Supabase helper
  - [x] 1.1 Open `apps/mobile/lib/supabase.ts` and locate the `auth` object (around line 26)
  - [x] 1.2 Add `resetPassword` function that:
    - Takes `email: string` as parameter
    - Calls `supabase.auth.resetPasswordForEmail()` with the email
    - Configures `redirectTo` URL to point to the app's callback route: `exp://localhost:8081/auth/callback?type=recovery` (for development) or use environment variable for production
    - Handles errors and returns `{ error }` or `{ data, error }` format matching existing functions
    - Always returns success (never reveals if email exists) for security
  - [x] 1.3 Add `updatePassword` function that:
    - Takes `newPassword: string` as parameter
    - Calls `supabase.auth.updateUser({ password: newPassword })`
    - Handles errors and returns `{ error }` or `{ data, error }` format
    - Signs out the user after successful password update using `supabase.auth.signOut()`
  - [x] 1.4 Export both functions from the `auth` object
  - [x] 1.5 Test that the functions compile without TypeScript errors

- [x] 2.0 Create forgot password request screen
  - [ ] 2.1 Create new file `apps/mobile/app/(auth)/forgot-password.tsx`
  - [ ] 2.2 Import necessary React Native components (View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator)
  - [ ] 2.3 Import navigation utilities (router from expo-router)
  - [ ] 2.4 Import icons (Mail, ArrowLeft from lucide-react-native)
  - [ ] 2.5 Import animation components (Animated, FadeInDown, FadeInUp from react-native-reanimated)
  - [ ] 2.6 Import StatusBar from expo-status-bar
  - [ ] 2.7 Import the `auth` helper from `@/lib/supabase`
  - [ ] 2.8 Create component with state for:
    - `email` (string)
    - `isLoading` (boolean)
    - `message` (object with `type: 'error' | 'success'` and `text: string` or null)
  - [ ] 2.9 Implement email input field with:
    - Mail icon on the left
    - Placeholder: "your.email@university.edu"
    - Keyboard type: email-address
    - Auto-capitalize: none
    - Styling matching login screen (white background, rounded corners, shadow)
  - [ ] 2.10 Implement "Send Reset Link" button with:
    - Primary blue background matching login screen
    - Loading state (ActivityIndicator when isLoading is true)
    - Disabled state when loading
    - Shadow styling matching login screen
  - [ ] 2.11 Implement "Back to Login" link/button at the bottom
  - [ ] 2.12 Implement validation function that:
    - Checks email is not empty
    - Validates email format using regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
    - Returns boolean and sets error message if validation fails
  - [ ] 2.13 Implement `handleResetPassword` function that:
    - Clears previous messages
    - Trims and lowercases email input
    - Validates email format
    - Sets loading state to true
    - Calls `auth.resetPassword(email)` from supabase helper
    - Always shows success message (for security, never reveal if email exists)
    - Success message: "If an account exists, a password reset link has been sent to your email. Please check your inbox and spam folder."
    - Handles errors gracefully with try-catch
    - Sets loading state to false in finally block
  - [ ] 2.14 Implement message display:
    - Show error messages in red text (matching signup screen pattern)
    - Show success messages in green text
    - Display below the form or above the button
    - Use in-page messages (not Alert.alert())
  - [ ] 2.15 Add KeyboardAvoidingView wrapper for iOS keyboard handling
  - [ ] 2.16 Add ScrollView for content scrolling
  - [ ] 2.17 Style the screen to match login/signup screens (centered form, consistent spacing, animations)
  - [ ] 2.18 Add header with back button (ArrowLeft icon) that navigates back to login

- [ ] 3.0 Create reset password screen
  - [ ] 3.1 Create new file `apps/mobile/app/(auth)/reset-password.tsx`
  - [ ] 3.2 Import necessary React Native components (same as forgot-password screen)
  - [ ] 3.3 Import icons (Lock from lucide-react-native)
  - [ ] 3.4 Import navigation utilities and auth helper
  - [ ] 3.5 Create component with state for:
    - `newPassword` (string)
    - `confirmPassword` (string)
    - `isLoading` (boolean)
    - `message` (object with `type: 'error' | 'success'` and `text: string` or null)
  - [ ] 3.6 Implement "New Password" input field with:
    - Lock icon on the left
    - Secure text entry enabled
    - Placeholder: "Enter new password"
    - Styling matching signup screen password fields
  - [ ] 3.7 Implement "Confirm Password" input field with:
    - Lock icon on the left
    - Secure text entry enabled
    - Placeholder: "Confirm new password"
    - Styling matching signup screen password fields
  - [ ] 3.8 Implement "Reset Password" button with:
    - Primary blue background
    - Loading state (ActivityIndicator)
    - Disabled state when loading
  - [ ] 3.9 Implement validation function that:
    - Checks both password fields are not empty
    - Validates password length (minimum 6 characters, matching signup)
    - Checks passwords match
    - Returns boolean and sets appropriate error message
  - [ ] 3.10 Implement `handleResetPassword` function that:
    - Clears previous messages
    - Validates passwords
    - Sets loading state to true
    - Calls `auth.updatePassword(newPassword)` from supabase helper
    - On success: shows success message, signs out user, redirects to login after 2-3 seconds
    - Success message: "Password reset successfully! Redirecting to login..."
    - Handles errors (expired link, invalid token, network errors) with clear messages
    - Sets loading state to false in finally block
  - [ ] 3.11 Implement message display (same pattern as forgot-password screen)
  - [ ] 3.12 Add KeyboardAvoidingView and ScrollView wrappers
  - [ ] 3.13 Style the screen to match signup screen (centered form, consistent spacing, animations)
  - [ ] 3.14 Add header/title: "Reset Your Password"

- [ ] 4.0 Update navigation and callback handling
  - [ ] 4.1 Open `apps/mobile/app/(auth)/login.tsx`
  - [ ] 4.2 Locate the "Forgot Password?" TouchableOpacity (around line 172-174)
  - [ ] 4.3 Add `onPress` handler that navigates to `/(auth)/forgot-password` using `router.push()`
  - [ ] 4.4 Verify the link is visible and clickable
  - [ ] 4.5 Open `apps/mobile/app/auth/callback.tsx`
  - [ ] 4.6 Locate the `handleCallback` function and the check for `type === 'recovery'` (line 20)
  - [ ] 4.7 After successfully setting the session with `supabase.auth.setSession()` (around line 23-30), add logic to:
    - Check if `type === 'recovery'`
    - If recovery type, navigate to `/(auth)/reset-password` instead of login
    - Keep existing redirect logic for other types (signup, email_change)
  - [ ] 4.8 Update the success message for recovery type: "Password reset link verified! Redirecting..."
  - [ ] 4.9 Test that the callback correctly routes to reset password screen when type=recovery

- [ ] 5.0 Test and verify the complete password reset flow
  - [ ] 5.1 Test forgot password screen:
    - Verify email input accepts valid email addresses
    - Verify validation shows error for empty email
    - Verify validation shows error for invalid email format
    - Verify "Send Reset Link" button shows loading state
    - Verify success message appears after submission (regardless of email existence)
    - Verify "Back to Login" button navigates correctly
  - [ ] 5.2 Test password reset email:
    - Request password reset for a valid account email
    - Check email inbox for reset link
    - Verify link contains correct callback URL with type=recovery
    - Verify link expiration is set to 1 hour (check Supabase settings if needed)
  - [ ] 5.3 Test reset password screen:
    - Open reset link from email (should deep link to app)
    - Verify callback screen handles recovery type correctly
    - Verify navigation to reset password screen
    - Test password validation (empty, too short, mismatch)
    - Test successful password reset
    - Verify user is signed out after reset
    - Verify redirect to login screen after success
  - [ ] 5.4 Test error scenarios:
    - Test with expired reset link (wait 1+ hour or manually expire)
    - Test with invalid/used reset token
    - Test network error handling
    - Verify appropriate error messages are shown
  - [ ] 5.5 Test rate limiting (if implemented):
    - Request password reset 4+ times within 1 hour for same email
    - Verify rate limit message appears (if client-side tracking implemented)
    - Note: Supabase may handle this server-side
  - [ ] 5.6 Test security requirements:
    - Verify success message is shown even for non-existent emails (security)
    - Verify previous reset links are invalidated when new request is made
    - Verify reset link expires after 1 hour
  - [ ] 5.7 Test complete end-to-end flow:
    - Start from login screen
    - Click "Forgot Password?"
    - Enter email and submit
    - Receive email and click link
    - Set new password
    - Sign in with new password
    - Verify login works with new password

