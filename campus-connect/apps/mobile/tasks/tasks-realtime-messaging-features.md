# Tasks: Real-Time Messaging Features Implementation

## Status: ✅ COMPLETE - Ready for Testing

## Relevant Files

- `apps/mobile/lib/supabase.ts` - Supabase API functions, needs presence, typing, and message status functions added.
- `apps/mobile/app/(tabs)/messages/index.tsx` - Messages list screen, needs real-time subscriptions for automatic updates.
- `apps/mobile/app/(tabs)/messages/[id].tsx` - Individual chat screen, needs online status, typing indicators, and message status display.
- `apps/mobile/hooks/useOnlineStatus.ts` - New custom hook for online status tracking (to be created).
- `apps/mobile/hooks/useTypingIndicator.ts` - New custom hook for typing indicators (to be created).
- `apps/mobile/hooks/useMessageStatus.ts` - New custom hook for message status tracking (to be created).
- Database migration files - SQL files for adding `status` and `read_at` columns to messages table.

### Notes

- All real-time features should use Supabase real-time subscriptions.
- Presence channels should be used for online status tracking.
- Message status should be stored in the database for persistence.
- App state management (foreground/background) is needed for presence tracking.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/realtime-messaging-features`)
  - [ ] 0.2 Verify you're on the new branch with `git branch`

- [ ] 1.0 Update database schema for message status tracking
  - [ ] 1.1 Create a new SQL migration file (e.g., `supabase-migrations/add-message-status.sql`)
  - [ ] 1.2 Add `status` column to `messages` table:
    - Type: `TEXT` or `ENUM` with values: 'sent', 'delivered', 'read'
    - Default value: 'sent'
    - Allow NULL initially for backward compatibility
  - [ ] 1.3 Add `read_at` column to `messages` table:
    - Type: `TIMESTAMP WITH TIME ZONE`
    - Allow NULL (only set when message is read)
  - [ ] 1.4 Update existing messages to have default status 'sent' (if status is NULL)
  - [ ] 1.5 Run the migration in Supabase SQL Editor or via migration tool
  - [ ] 1.6 Verify the schema changes in Supabase dashboard (Database → Tables → messages)

- [ ] 2.0 Add real-time API functions to Supabase helper
  - [ ] 2.1 Open `apps/mobile/lib/supabase.ts` and locate the `api` object
  - [ ] 2.2 Add `trackPresence` function that:
    - Takes `conversationId: string` and `userId: string` as parameters
    - Creates/joins a Supabase presence channel for the conversation
    - Tracks user presence with metadata (user_id, timestamp)
    - Returns the channel for cleanup purposes
  - [ ] 2.3 Add `getOnlineStatus` function that:
    - Takes `userId: string` as parameter
    - Subscribes to presence channel to get user's online status
    - Returns current online status (boolean or status object)
  - [ ] 2.4 Add `sendTypingIndicator` function that:
    - Takes `conversationId: string`, `userId: string`, and `isTyping: boolean` as parameters
    - Broadcasts typing status via Supabase channel or database
    - Uses debouncing internally (1-2 second delay)
  - [ ] 2.5 Add `subscribeToTyping` function that:
    - Takes `conversationId: string` and `callback: (userId: string, isTyping: boolean) => void`
    - Subscribes to typing indicator events for the conversation
    - Returns subscription for cleanup
  - [ ] 2.6 Add `updateMessageStatus` function that:
    - Takes `messageId: string` and `status: 'sent' | 'delivered' | 'read'` as parameters
    - Updates the message status in the database
    - Also updates `read_at` timestamp when status is 'read'
    - Returns `{ data, error }` format
  - [ ] 2.7 Add `subscribeToMessageStatus` function that:
    - Takes `conversationId: string` and `callback: (messageId: string, status: string) => void`
    - Subscribes to message status updates via database changes
    - Returns subscription for cleanup
  - [ ] 2.8 Add `subscribeToConversations` function that:
    - Takes `userId: string` and `callback: (conversation: Conversation) => void`
    - Subscribes to conversation table changes (INSERT, UPDATE)
    - Filters to only conversations where user is a participant
    - Returns subscription for cleanup
  - [ ] 2.9 Update `sendMessage` function (if exists) to set initial status as 'sent'
  - [ ] 2.10 Update `markMessagesAsRead` function to also update message status to 'read' and set `read_at` timestamp

- [ ] 3.0 Implement online status indicators in chat screen
  - [ ] 3.1 Open `apps/mobile/app/(tabs)/messages/[id].tsx`
  - [ ] 3.2 Import `AppState` from 'react-native' for tracking app foreground/background state
  - [ ] 3.3 Add state for online status: `const [isOnline, setIsOnline] = useState<boolean>(false)`
  - [ ] 3.4 Identify the other participant's user ID (for direct conversations)
  - [ ] 3.5 Add `useEffect` to track presence when component mounts:
    - Call `api.trackPresence(conversationId, currentUserId)` to join presence channel
    - Subscribe to other participant's presence status
    - Update `isOnline` state based on presence
  - [ ] 3.6 Add `useEffect` to handle app state changes:
    - Listen to `AppState` changes ('active', 'background', 'inactive')
    - Update presence when app goes to background (leave channel)
    - Rejoin presence when app becomes active
  - [ ] 3.7 Add cleanup in `useEffect` return function to leave presence channel on unmount
  - [ ] 3.8 Locate the chat header where recipient name is displayed
  - [ ] 3.9 Add online status indicator UI:
    - Small green circle (8-10px) when online
    - Small gray circle when offline
    - Optional "Online" or "Offline" text next to the circle
    - Position next to or below recipient name
  - [ ] 3.10 Add smooth fade animation when status changes (using Animated or Reanimated)
  - [ ] 3.11 Test online status updates when other user comes online/goes offline

- [ ] 4.0 Implement message status indicators (sent/delivered/read)
  - [ ] 4.1 Open `apps/mobile/app/(tabs)/messages/[id].tsx`
  - [ ] 4.2 Update the `Message` interface to include `status?: 'sent' | 'delivered' | 'read'` field
  - [ ] 4.3 Update `fetchData` function to include `status` field when fetching messages
  - [ ] 4.4 Locate where outgoing messages are rendered in the UI
  - [ ] 4.5 Add message status display below outgoing message bubbles:
    - Show "Sent" if status is 'sent' or undefined
    - Show "Delivered" if status is 'delivered' (only if not 'read')
    - Show "Read" if status is 'read' (hide "Sent" and "Delivered" when read)
    - Use small, muted gray text (10-12px font size)
    - Right-align the status text for outgoing messages
  - [ ] 4.6 Add `useEffect` to subscribe to message status updates:
    - Call `api.subscribeToMessageStatus(conversationId, callback)`
    - Update message status in local state when status changes
    - Clean up subscription on unmount
  - [ ] 4.7 Update message sending logic to:
    - Set initial status as 'sent' when message is created
    - Automatically update to 'delivered' when recipient receives message (via real-time subscription)
  - [ ] 4.8 Update `markMessagesAsRead` call to also update message status to 'read'
  - [ ] 4.9 Test status updates: send message, verify "Sent" appears, verify "Delivered" when received, verify "Read" when opened

- [ ] 5.0 Implement real-time messages list updates
  - [ ] 5.1 Open `apps/mobile/app/(tabs)/messages/index.tsx`
  - [ ] 5.2 Add `useEffect` to subscribe to conversation updates when component mounts:
    - Call `api.subscribeToConversations(userId, callback)`
    - Handle INSERT events (new conversations)
    - Handle UPDATE events (updated last message, unread counts)
  - [ ] 5.3 In the subscription callback, update the conversations state:
    - For new conversations: add to the list
    - For updated conversations: update the existing conversation in the list
    - Reorder conversations by most recent activity
  - [ ] 5.4 Add subscription to messages table changes to update last message preview:
    - Subscribe to messages table INSERT events
    - Filter by conversations the user is part of
    - Update the `lastMessage` field in the conversations list
  - [ ] 5.5 Update unread count calculation to be reactive:
    - Recalculate unread counts when messages are received
    - Update conversation unread count in real-time
  - [ ] 5.6 Add cleanup in `useEffect` return to unsubscribe from all subscriptions
  - [ ] 5.7 Test: have another user send a message, verify the conversation list updates automatically without refresh
  - [ ] 5.8 Test: verify conversation reordering when new messages arrive

- [ ] 6.0 Implement typing indicators
  - [ ] 6.1 Open `apps/mobile/app/(tabs)/messages/[id].tsx`
  - [ ] 6.2 Add state for typing indicator: `const [typingUsers, setTypingUsers] = useState<string[]>([])`
  - [ ] 6.3 Add debounced typing detection:
    - Create a `useRef` to store typing timeout
    - When user types in message input, call `api.sendTypingIndicator(conversationId, userId, true)`
    - Debounce the typing indicator (1-2 seconds of inactivity before sending `false`)
  - [ ] 6.4 Add `useEffect` to subscribe to typing indicators:
    - Call `api.subscribeToTyping(conversationId, callback)`
    - Update `typingUsers` state when typing status changes
    - Filter out current user from typing users
  - [ ] 6.5 Add typing indicator UI in the message area:
    - Display below the last message
    - Show "typing..." text in italic, muted gray color
    - Or show animated dots ("...") with subtle animation
    - Only show when `typingUsers.length > 0`
  - [ ] 6.6 Add cleanup to stop typing indicator when:
    - User sends a message (set typing to false)
    - User navigates away from conversation
    - Component unmounts
  - [ ] 6.7 Add auto-hide typing indicator after 3 seconds of no activity
  - [ ] 6.8 Test: type a message, verify typing indicator appears for other user, verify it disappears after sending

- [ ] 7.0 Implement real-time notification badges
  - [ ] 7.1 Open `apps/mobile/app/(tabs)/messages/index.tsx`
  - [ ] 7.2 Locate where the notification badge is displayed (likely in the tab bar or header)
  - [ ] 7.3 Create a function to calculate total unread conversations:
    - Count conversations where `unreadCount > 0`
    - Return the count
  - [ ] 7.4 Add state for badge count: `const [badgeCount, setBadgeCount] = useState<number>(0)`
  - [ ] 7.5 Update badge count when conversations list updates:
    - Recalculate unread count whenever conversations state changes
    - Update `badgeCount` state
  - [ ] 7.6 Connect badge count to the UI badge component
  - [ ] 7.7 Ensure badge updates in real-time when:
    - New messages arrive (via subscription from task 5.0)
    - Messages are marked as read (badge count decreases)
  - [ ] 7.8 Test: receive a new message, verify badge count increases automatically
  - [ ] 7.9 Test: open a conversation, verify badge count decreases automatically

- [ ] 8.0 Add app state management for presence tracking
  - [ ] 8.1 Create a custom hook `apps/mobile/hooks/useAppState.ts`:
    - Import `AppState` from 'react-native'
    - Track current app state ('active', 'background', 'inactive')
    - Return current state and provide callback for state changes
  - [ ] 8.2 Update chat screen to use app state hook:
    - Import and use the `useAppState` hook
    - When app goes to background: leave presence channel
    - When app becomes active: rejoin presence channel
  - [ ] 8.3 Add network connectivity handling:
    - Detect when network connection is lost
    - Pause real-time subscriptions when offline
    - Resume subscriptions when connection is restored
  - [ ] 8.4 Update presence tracking to handle reconnection:
    - Automatically rejoin presence channels after reconnection
    - Update online status when connection is restored
  - [ ] 8.5 Test: background the app, verify presence is updated (user shows as offline)
  - [ ] 8.6 Test: foreground the app, verify presence is updated (user shows as online)

- [ ] 9.0 Test and verify all real-time features
  - [ ] 9.1 Test online status indicators:
    - Open a conversation, verify online status appears
    - Have other user open/close app, verify status updates in real-time
    - Background your app, verify status updates correctly
  - [ ] 9.2 Test message status indicators:
    - Send a message, verify "Sent" appears immediately
    - Have recipient receive message, verify "Delivered" appears
    - Have recipient open conversation, verify "Read" appears (and "Sent"/"Delivered" are hidden)
  - [ ] 9.3 Test real-time messages list updates:
    - Have another user send a message, verify conversation list updates without refresh
    - Verify last message preview updates
    - Verify unread count updates
    - Verify conversation reordering
  - [ ] 9.4 Test typing indicators:
    - Type a message, verify typing indicator appears for other user
    - Stop typing, verify indicator disappears after debounce time
    - Send message, verify indicator disappears immediately
  - [ ] 9.5 Test notification badges:
    - Receive new message, verify badge count increases
    - Open conversation, verify badge count decreases
    - Verify badge updates in real-time
  - [ ] 9.6 Test app state management:
    - Background app, verify presence updates
    - Foreground app, verify presence reconnects
    - Test network disconnection/reconnection
  - [ ] 9.7 Test edge cases:
    - Multiple rapid messages (verify no performance issues)
    - Multiple conversations updating simultaneously
    - User switching between conversations quickly
    - App backgrounded while receiving messages
  - [ ] 9.8 Performance testing:
    - Verify battery usage is acceptable
    - Verify network usage is optimized
    - Verify no memory leaks (check subscriptions are cleaned up)
  - [ ] 9.9 User acceptance testing:
    - Verify all features work as expected from user perspective
    - Verify UI is smooth and non-jarring
    - Verify real-time updates feel instant (< 2 seconds)

