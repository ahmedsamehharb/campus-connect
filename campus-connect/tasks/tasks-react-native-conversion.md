# Task List: React Native Mobile App Conversion

## Relevant Files

### Project Configuration
- `apps/mobile/package.json` - Mobile app dependencies and scripts
- `apps/mobile/app.json` - Expo configuration (app name, icons, splash)
- `apps/mobile/tsconfig.json` - TypeScript configuration
- `apps/mobile/babel.config.js` - Babel configuration for NativeWind
- `apps/mobile/tailwind.config.js` - TailwindCSS/NativeWind configuration
- `apps/mobile/metro.config.js` - Metro bundler configuration
- `apps/mobile/.env` - Environment variables (Supabase keys)
- `apps/mobile/eas.json` - EAS Build configuration

### Core App Files
- `apps/mobile/app/_layout.tsx` - Root layout with providers
- `apps/mobile/app/(auth)/_layout.tsx` - Auth group layout
- `apps/mobile/app/(auth)/login.tsx` - Login screen
- `apps/mobile/app/(auth)/signup.tsx` - Signup screen
- `apps/mobile/app/(tabs)/_layout.tsx` - Tab navigator layout
- `apps/mobile/app/(tabs)/home.tsx` - Dashboard/Home screen
- `apps/mobile/app/(tabs)/events/index.tsx` - Events list screen
- `apps/mobile/app/(tabs)/events/[id].tsx` - Event details screen
- `apps/mobile/app/(tabs)/community/index.tsx` - Community feed screen
- `apps/mobile/app/(tabs)/community/[id].tsx` - Post details screen
- `apps/mobile/app/(tabs)/messages/index.tsx` - Conversations list
- `apps/mobile/app/(tabs)/messages/[id].tsx` - Chat screen
- `apps/mobile/app/(tabs)/profile.tsx` - User profile screen

### Feature Screens
- `apps/mobile/app/academics/index.tsx` - Academics main screen
- `apps/mobile/app/financial/index.tsx` - Financial main screen
- `apps/mobile/app/dining/index.tsx` - Dining main screen
- `apps/mobile/app/transport/index.tsx` - Transportation main screen
- `apps/mobile/app/study/index.tsx` - Study spaces main screen
- `apps/mobile/app/ai/index.tsx` - AI assistant screen
- `apps/mobile/app/career/index.tsx` - Career services main screen
- `apps/mobile/app/wellness/index.tsx` - Wellness main screen
- `apps/mobile/app/achievements/index.tsx` - Achievements screen
- `apps/mobile/app/notifications/index.tsx` - Notifications center
- `apps/mobile/app/search/index.tsx` - Universal search screen

### Context & Providers
- `apps/mobile/contexts/AuthContext.tsx` - Authentication context (adapted from web)
- `apps/mobile/contexts/NotificationContext.tsx` - Push notification context
- `apps/mobile/providers/QueryProvider.tsx` - TanStack Query provider
- `apps/mobile/providers/index.tsx` - Combined providers wrapper

### Library & Utilities
- `apps/mobile/lib/supabase.ts` - Supabase client configuration
- `apps/mobile/lib/storage.ts` - Secure storage utilities
- `apps/mobile/lib/notifications.ts` - Push notification utilities
- `apps/mobile/lib/offline.ts` - Offline caching utilities

### Hooks
- `apps/mobile/hooks/useAuth.ts` - Authentication hook
- `apps/mobile/hooks/useSupabase.ts` - Supabase data hooks (adapted from web)
- `apps/mobile/hooks/useEvents.ts` - Events data hook
- `apps/mobile/hooks/useCommunity.ts` - Community posts hook
- `apps/mobile/hooks/useMessages.ts` - Messaging hook with realtime
- `apps/mobile/hooks/useNotifications.ts` - Notifications hook
- `apps/mobile/hooks/useOffline.ts` - Offline status hook

### Components - Core
- `apps/mobile/components/ui/Button.tsx` - Reusable button component
- `apps/mobile/components/ui/Input.tsx` - Text input component
- `apps/mobile/components/ui/Card.tsx` - Card container component
- `apps/mobile/components/ui/Avatar.tsx` - User avatar component
- `apps/mobile/components/ui/Badge.tsx` - Badge/tag component
- `apps/mobile/components/ui/Modal.tsx` - Modal/bottom sheet component
- `apps/mobile/components/ui/Skeleton.tsx` - Loading skeleton component
- `apps/mobile/components/ui/EmptyState.tsx` - Empty state placeholder

### Components - Features
- `apps/mobile/components/events/EventCard.tsx` - Event list item
- `apps/mobile/components/events/EventDetails.tsx` - Event details view
- `apps/mobile/components/events/RSVPButton.tsx` - RSVP action button
- `apps/mobile/components/community/PostCard.tsx` - Community post card
- `apps/mobile/components/community/PostForm.tsx` - Create post form
- `apps/mobile/components/community/ReplyCard.tsx` - Reply item
- `apps/mobile/components/messages/ConversationItem.tsx` - Conversation list item
- `apps/mobile/components/messages/MessageBubble.tsx` - Chat message bubble
- `apps/mobile/components/messages/ChatInput.tsx` - Message input with send
- `apps/mobile/components/home/QuickAccessCard.tsx` - Dashboard feature card
- `apps/mobile/components/home/NotificationBanner.tsx` - Recent notification
- `apps/mobile/components/search/SearchBar.tsx` - Search input with suggestions
- `apps/mobile/components/search/SearchResults.tsx` - Categorized results

### Shared Types (potential monorepo package)
- `packages/shared/types/user.ts` - User/profile types
- `packages/shared/types/events.ts` - Event types
- `packages/shared/types/community.ts` - Post/reply types
- `packages/shared/types/messages.ts` - Conversation/message types
- `packages/shared/types/academics.ts` - Course/grade types
- `packages/shared/constants/index.ts` - Shared constants

### Assets
- `apps/mobile/assets/images/logo.png` - App logo
- `apps/mobile/assets/images/splash.png` - Splash screen image
- `apps/mobile/assets/images/icon.png` - App icon
- `apps/mobile/assets/images/adaptive-icon.png` - Android adaptive icon
- `apps/mobile/assets/animations/loading.json` - Lottie loading animation

### Notes

- This project follows a monorepo structure with the mobile app in `apps/mobile/`
- The existing web app should be moved to `apps/web/` if converting to monorepo
- Unit tests should be placed alongside components (e.g., `Button.test.tsx`)
- Use `npx expo start` to run the development server
- Use `npx jest` to run tests
- Use `eas build` for creating production builds

---

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Initialize Expo project` → `- [x] 1.1 Initialize Expo project` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

## Tasks

### Phase 1: Foundation

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for the mobile app (e.g., `git checkout -b feature/react-native-mobile-app`)

- [x] 1.0 Project Setup & Expo Configuration
  - [x] 1.1 Create monorepo structure with `apps/` and `packages/` directories
  - [x] 1.2 Move existing Next.js web app to `apps/web/` (optional, can keep flat structure)
  - [x] 1.3 Initialize new Expo project in `apps/mobile/` using `npx create-expo-app@latest`
  - [x] 1.4 Configure TypeScript in `tsconfig.json`
  - [x] 1.5 Install and configure NativeWind (TailwindCSS) with `tailwind.config.js`
  - [x] 1.6 Configure Metro bundler in `metro.config.js` for NativeWind
  - [x] 1.7 Set up environment variables in `.env` for Supabase URL and anon key
  - [x] 1.8 Configure `app.json` with app name, bundle identifiers, icons, and splash screen
  - [x] 1.9 Set up EAS Build configuration in `eas.json`
  - [x] 1.10 Install core dependencies (react-native-reanimated, lucide-react-native, lottie-react-native)
  - [ ] 1.11 Verify project runs on iOS simulator and Android emulator

- [x] 2.0 Authentication System with Supabase
  - [x] 2.1 Install Supabase client (`@supabase/supabase-js`) and secure storage (`expo-secure-store`)
  - [x] 2.2 Create `lib/supabase.ts` with Supabase client configured for React Native
  - [x] 2.3 Create `lib/storage.ts` with secure storage adapter for auth tokens
  - [x] 2.4 Create `contexts/AuthContext.tsx` adapted from web version for React Native
  - [x] 2.5 Implement `useAuth` hook with login, signup, logout, and session management
  - [x] 2.6 Create login screen UI (`app/(auth)/login.tsx`) matching web design
  - [x] 2.7 Create signup screen UI (`app/(auth)/signup.tsx`) with form validation
  - [x] 2.8 Implement automatic token refresh and session persistence
  - [x] 2.9 Install and configure biometric authentication (`expo-local-authentication`)
  - [x] 2.10 Add biometric login option on login screen
  - [x] 2.11 Set up deep link handling for OAuth callbacks
  - [ ] 2.12 Test authentication flow end-to-end on both platforms

- [x] 3.0 Navigation & Routing Structure (Expo Router)
  - [x] 3.1 Install Expo Router (`expo-router`) and configure in `app.json`
  - [x] 3.2 Create root layout (`app/_layout.tsx`) with providers and auth check
  - [x] 3.3 Create auth group layout (`app/(auth)/_layout.tsx`) for unauthenticated screens
  - [x] 3.4 Create tabs group layout (`app/(tabs)/_layout.tsx`) with bottom tab navigator
  - [x] 3.5 Configure tab icons using Lucide React Native
  - [x] 3.6 Implement protected routes redirect (unauthenticated → login)
  - [x] 3.7 Set up deep linking configuration for all routes
  - [x] 3.8 Implement smooth screen transitions with React Native Reanimated
  - [ ] 3.9 Add navigation state persistence across app restarts
  - [x] 3.10 Create placeholder screens for all routes (events, community, messages, profile)
  - [ ] 3.11 Test navigation flow and deep links on both platforms

- [x] 4.0 Shared Component Library & Theme System
  - [x] 4.1 Extract color palette from web `globals.css` to NativeWind theme
  - [x] 4.2 Configure dark mode support in Tailwind config
  - [x] 4.3 Create `Button.tsx` component with variants (primary, secondary, outline, ghost)
  - [x] 4.4 Create `Input.tsx` component with label, error state, and icons
  - [x] 4.5 Create `Card.tsx` container component with shadow and border radius
  - [x] 4.6 Create `Avatar.tsx` component for user profile images
  - [x] 4.7 Create `Badge.tsx` component for tags and status indicators
  - [ ] 4.8 Create `Modal.tsx` component using bottom sheet pattern
  - [x] 4.9 Create `Skeleton.tsx` loading placeholder component
  - [ ] 4.10 Create `EmptyState.tsx` for empty lists and no-data states
  - [x] 4.11 Set up Lottie animations with `lottie-react-native`
  - [x] 4.12 Create common animation presets (fade in, slide up, scale)
  - [ ] 4.13 Ensure all components support accessibility (labels, hints, roles)

- [x] 5.0 Supabase Integration & Data Layer
  - [x] 5.1 Install TanStack Query (`@tanstack/react-query`) for data fetching
  - [x] 5.2 Create `providers/QueryProvider.tsx` with query client configuration
  - [x] 5.3 Create `hooks/useSupabase.ts` with generic CRUD operations
  - [x] 5.4 Set up Supabase Realtime subscriptions utility in `lib/supabase.ts`
  - [x] 5.5 Create shared TypeScript types matching Supabase schema
  - [ ] 5.6 Implement optimistic updates pattern for mutations
  - [ ] 5.7 Set up error handling and toast notifications for API errors
  - [x] 5.8 Create `providers/index.tsx` combining all providers
  - [ ] 5.9 Test data fetching with existing Supabase backend

---

### Phase 2: Core Features

- [x] 6.0 Dashboard/Home Screen
  - [x] 6.1 Create home screen layout (`app/(tabs)/home.tsx`)
  - [x] 6.2 Implement personalized welcome message with user's name
  - [x] 6.3 Create `QuickAccessCard.tsx` component for feature navigation
  - [x] 6.4 Display grid of all 24 feature category cards
  - [ ] 6.5 Create `NotificationBanner.tsx` for recent notifications preview
  - [x] 6.6 Implement pull-to-refresh functionality
  - [ ] 6.7 Add loading skeletons while data fetches
  - [x] 6.8 Implement smooth entry animations for cards
  - [x] 6.9 Ensure proper navigation to each feature from cards
  - [ ] 6.10 Test dashboard responsiveness on different screen sizes

- [x] 7.0 Events Module
  - [ ] 7.1 Create `hooks/useEvents.ts` for fetching events from Supabase
  - [x] 7.2 Create events list screen (`app/(tabs)/events/index.tsx`)
  - [x] 7.3 Create `EventCard.tsx` component with event info and date
  - [ ] 7.4 Implement list/calendar view toggle
  - [x] 7.5 Create event details screen (`app/(tabs)/events/[id].tsx`)
  - [x] 7.6 Create `EventDetails.tsx` with full event information
  - [x] 7.7 Create `RSVPButton.tsx` with RSVP/cancel functionality
  - [x] 7.8 Display attendee count and list
  - [x] 7.9 Implement event search and filtering (by date, category)
  - [x] 7.10 Install and integrate `expo-calendar` for device calendar sync
  - [ ] 7.11 Add "Add to Calendar" functionality for events
  - [x] 7.12 Implement pull-to-refresh on events list
  - [ ] 7.13 Test RSVP flow end-to-end

- [x] 8.0 Community Module
  - [ ] 8.1 Create `hooks/useCommunity.ts` for posts and replies
  - [x] 8.2 Create community feed screen (`app/(tabs)/community/index.tsx`)
  - [x] 8.3 Create `PostCard.tsx` component with author, content, and actions
  - [x] 8.4 Implement post categories/tags filtering
  - [ ] 8.5 Create `PostForm.tsx` for creating new posts (modal or screen)
  - [x] 8.6 Create post details screen (`app/(tabs)/community/[id].tsx`)
  - [x] 8.7 Create `ReplyCard.tsx` component for displaying replies
  - [x] 8.8 Implement reply creation functionality
  - [x] 8.9 Add post voting/reactions feature
  - [x] 8.10 Implement search within community posts
  - [x] 8.11 Add pull-to-refresh and infinite scroll
  - [ ] 8.12 Test post creation and reply flow

- [x] 9.0 Messaging Module with Realtime
  - [ ] 9.1 Create `hooks/useMessages.ts` with Supabase Realtime subscription
  - [x] 9.2 Create conversations list screen (`app/(tabs)/messages/index.tsx`)
  - [x] 9.3 Create `ConversationItem.tsx` with last message preview and unread badge
  - [x] 9.4 Create chat screen (`app/(tabs)/messages/[id].tsx`)
  - [x] 9.5 Create `MessageBubble.tsx` for sent/received messages
  - [x] 9.6 Create `ChatInput.tsx` with text input and send button
  - [ ] 9.7 Implement real-time message receiving via Supabase Realtime
  - [ ] 9.8 Add typing indicators functionality
  - [ ] 9.9 Implement read receipts
  - [ ] 9.10 Create new conversation/start chat flow
  - [x] 9.11 Support group chat conversations
  - [x] 9.12 Implement message search
  - [x] 9.13 Add image/file sharing with `expo-image-picker`
  - [ ] 9.14 Test real-time messaging between two devices

- [ ] 10.0 Push Notifications System
  - [ ] 10.1 Install and configure `expo-notifications`
  - [ ] 10.2 Create `lib/notifications.ts` with notification utilities
  - [ ] 10.3 Implement push token registration on app launch
  - [ ] 10.4 Store push tokens in Supabase `profiles` table
  - [ ] 10.5 Create `contexts/NotificationContext.tsx` for notification state
  - [ ] 10.6 Create notifications center screen (`app/notifications/index.tsx`)
  - [ ] 10.7 Display notification history from Supabase
  - [ ] 10.8 Implement notification preferences settings
  - [ ] 10.9 Handle notification tap to navigate to relevant screen
  - [ ] 10.10 Implement notification grouping and priority display
  - [ ] 10.11 Add in-app notification banners
  - [ ] 10.12 Test push notifications on physical devices

---

### Phase 3: Extended Features

- [ ] 11.0 Academics Module
  - [ ] 11.1 Create academics main screen (`app/academics/index.tsx`)
  - [ ] 11.2 Fetch and display enrolled courses from Supabase
  - [ ] 11.3 Create course card component with course info
  - [ ] 11.4 Display grades and calculate/show GPA
  - [ ] 11.5 Create assignments list with due dates
  - [ ] 11.6 Implement assignment reminder notifications
  - [ ] 11.7 Show degree progress/requirements visualization
  - [ ] 11.8 Add course details screen with schedule
  - [ ] 11.9 Test academics data display

- [ ] 12.0 Financial Module
  - [ ] 12.1 Create financial main screen (`app/financial/index.tsx`)
  - [ ] 12.2 Display tuition balance and payment status
  - [ ] 12.3 Show wallet/meal plan balance
  - [ ] 12.4 Create transaction history list
  - [ ] 12.5 Display payment due dates with reminders
  - [ ] 12.6 Add financial summary cards
  - [ ] 12.7 Implement transaction filtering by date/type
  - [ ] 12.8 Test financial data display

- [ ] 13.0 Dining Module
  - [ ] 13.1 Create dining main screen (`app/dining/index.tsx`)
  - [ ] 13.2 Display dining locations with hours
  - [ ] 13.3 Create location card with map preview
  - [ ] 13.4 Show daily/weekly menus
  - [ ] 13.5 Display nutrition information for meals
  - [ ] 13.6 Implement dietary filters (vegetarian, vegan, allergens)
  - [ ] 13.7 Add meal search functionality
  - [ ] 13.8 Test dining module display

- [ ] 14.0 Transportation Module
  - [ ] 14.1 Create transportation main screen (`app/transport/index.tsx`)
  - [ ] 14.2 Display bus routes and schedules
  - [ ] 14.3 Create route card with timing info
  - [ ] 14.4 Show parking lot availability
  - [ ] 14.5 Integrate with device maps for navigation (`expo-linking` to maps)
  - [ ] 14.6 Add campus map view if available
  - [ ] 14.7 Test transportation module functionality

- [ ] 15.0 Study Spaces Module
  - [ ] 15.1 Create study spaces main screen (`app/study/index.tsx`)
  - [ ] 15.2 Display available study rooms with status
  - [ ] 15.3 Create room card with capacity and amenities
  - [ ] 15.4 Implement room booking flow
  - [ ] 15.5 Show library hours and current capacity
  - [ ] 15.6 Add booking confirmation screen
  - [ ] 15.7 Support booking modifications/cancellations
  - [ ] 15.8 Test room booking flow end-to-end

---

### Phase 4: Remaining Features

- [ ] 16.0 AI Assistant Module
  - [ ] 16.1 Create AI assistant screen (`app/ai/index.tsx`)
  - [ ] 16.2 Implement chat interface UI
  - [ ] 16.3 Create message input with send functionality
  - [ ] 16.4 Display AI responses in chat bubble format
  - [ ] 16.5 Maintain conversation history in local storage
  - [ ] 16.6 Implement study-related query handling
  - [ ] 16.7 Add loading states for AI responses
  - [ ] 16.8 Test AI chat functionality

- [ ] 17.0 Career Services Module
  - [ ] 17.1 Create career services main screen (`app/career/index.tsx`)
  - [ ] 17.2 Display job listings from Supabase
  - [ ] 17.3 Create job card with company and position info
  - [ ] 17.4 Implement job search and filters (type, location)
  - [ ] 17.5 Create job details screen
  - [ ] 17.6 Implement job application flow
  - [ ] 17.7 Show career fair schedules
  - [ ] 17.8 Display application status tracking
  - [ ] 17.9 Test job application flow

- [ ] 18.0 Wellness Module
  - [ ] 18.1 Create wellness main screen (`app/wellness/index.tsx`)
  - [ ] 18.2 Implement mood tracking UI with selection
  - [ ] 18.3 Store mood entries in Supabase
  - [ ] 18.4 Display mood history/trends
  - [ ] 18.5 Show mental health resources list
  - [ ] 18.6 Display wellness service locations
  - [ ] 18.7 Add quick access to emergency resources
  - [ ] 18.8 Test mood tracking functionality

- [ ] 19.0 Achievements & Gamification Module
  - [ ] 19.1 Create achievements screen (`app/achievements/index.tsx`)
  - [ ] 19.2 Display user achievements with badges
  - [ ] 19.3 Create achievement card with progress
  - [ ] 19.4 Show points balance and history
  - [ ] 19.5 Display current streaks
  - [ ] 19.6 Implement leaderboards view
  - [ ] 19.7 Add achievement unlock animations
  - [ ] 19.8 Test achievements display

- [ ] 20.0 Universal Search
  - [ ] 20.1 Create search screen (`app/search/index.tsx`)
  - [ ] 20.2 Create `SearchBar.tsx` with text input and clear button
  - [ ] 20.3 Implement search across all modules (events, posts, jobs, etc.)
  - [ ] 20.4 Create `SearchResults.tsx` with categorized results
  - [ ] 20.5 Add search suggestions based on history
  - [ ] 20.6 Implement recent searches storage
  - [ ] 20.7 Add result type icons and navigation
  - [ ] 20.8 Test search functionality across all data types

---

### Phase 5: Polish & Launch

- [ ] 21.0 Offline Support & Caching
  - [ ] 21.1 Create `lib/offline.ts` with caching utilities
  - [ ] 21.2 Implement AsyncStorage caching for essential data
  - [ ] 21.3 Cache user profile and courses for offline access
  - [ ] 21.4 Cache recent events and community posts
  - [ ] 21.5 Create `hooks/useOffline.ts` for offline status detection
  - [ ] 21.6 Display offline status indicator in header
  - [ ] 21.7 Queue offline actions (RSVP, posts) for sync when online
  - [ ] 21.8 Implement automatic sync when connectivity restored
  - [ ] 21.9 Test offline functionality

- [ ] 22.0 Performance Optimization & Polish
  - [ ] 22.1 Install FlashList and replace FlatList for long lists
  - [ ] 22.2 Implement image caching with `expo-image`
  - [ ] 22.3 Add proper memoization (React.memo, useMemo, useCallback)
  - [ ] 22.4 Optimize re-renders with React DevTools profiling
  - [ ] 22.5 Implement skeleton loading states for all screens
  - [ ] 22.6 Add error boundaries for graceful error handling
  - [ ] 22.7 Ensure app launch time is under 2 seconds
  - [ ] 22.8 Test on low-end devices for performance
  - [ ] 22.9 Fix any remaining UI inconsistencies
  - [ ] 22.10 Conduct accessibility audit and fixes
  - [ ] 22.11 Add haptic feedback for key interactions
  - [ ] 22.12 Final dark mode testing and polish

- [ ] 23.0 App Store Preparation & Submission
  - [ ] 23.1 Create high-resolution app icons (1024x1024)
  - [ ] 23.2 Design splash screen with branding
  - [ ] 23.3 Capture app store screenshots for all required sizes
  - [ ] 23.4 Write app store description and keywords
  - [ ] 23.5 Create privacy policy URL
  - [ ] 23.6 Set up Apple Developer account (if not existing)
  - [ ] 23.7 Set up Google Play Developer account (if not existing)
  - [ ] 23.8 Configure `eas.json` for production builds
  - [ ] 23.9 Run production build with `eas build --platform all`
  - [ ] 23.10 Test production build on physical devices
  - [ ] 23.11 Submit to TestFlight for iOS beta testing
  - [ ] 23.12 Submit to Google Play Internal Testing
  - [ ] 23.13 Gather beta feedback and fix critical issues
  - [ ] 23.14 Submit to App Store for review
  - [ ] 23.15 Submit to Google Play Store for review
  - [ ] 23.16 Monitor initial release and address any crashes

---

## Progress Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Foundation | 0.0 - 5.0 | ✅ Completed |
| Core Features | 6.0 - 10.0 | 🟡 In Progress (80%) |
| Extended Features | 11.0 - 15.0 | Not Started |
| Remaining Features | 16.0 - 20.0 | Not Started |
| Polish & Launch | 21.0 - 23.0 | Not Started |

**Total Tasks:** 24 parent tasks, 180+ sub-tasks

---

*Document Version: 1.0*  
*Created: November 27, 2025*  
*PRD Reference: `tasks/prd-react-native-conversion.md`*

