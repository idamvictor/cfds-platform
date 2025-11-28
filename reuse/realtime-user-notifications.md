# Realtime User + Notification System Notes

This document maps out how the current Vite app keeps the user object, notifications, and chat alerts in sync over WebSockets (Pusher/Laravel Echo) plus fallbacks. Use it as a reference when replicating the same behaviour inside the Next.js AI experience.

## Core Building Blocks

- `src/store/userStore.ts`: Zustand store that persists `user`, `token`, and exposes `getCurrentUser()` which hits `GET /user`.
- `src/services/PusherService.ts`: Singleton wrapper around Laravel Echo + `pusher-js`. Handles auth via `POST /broadcasting/auth`, tracks connection status, and exposes `subscribeToPrivateChannel`, `unsubscribeFromChannel`, and `onConnectionChange`.
- `src/hooks/usePusher.ts`: React hook that surfaces the singleton, keeps connection status/error in component state, and memoises subscribe/unsubscribe helpers.
- `src/components/WebSocketInitializer.tsx`: Mounted high in `App.tsx`. Once a user token exists it connects Pusher, shows toast feedback for reconnecting, then renders `<NotificationListener />`.

## User Realtime Updates (`NotificationListener.tsx`)

- Located at `src/components/NotificationListener.tsx` and rendered from `WebSocketInitializer`.
- Subscribes to **three** private channels once `usePusher` reports `connected` and a `userId` is present:
  - `notification.{userId}` listening for `.notification.message` → calls `handleNotification`.
  - `user.{userId}` listening for `.user.updated` → calls `handleUserUpdate`.
- `handleNotification`:
  - Plays the shared audio (`/sounds/notification.mp3`).
  - Triggers `getCurrentUser()` so the Zustand user store picks up new notification objects.
- `handleUserUpdate`:
  - Calls `getCurrentUser()` and retries after `FAST_POLLING_INTERVAL` (5 s) on failure so user balances/flags update almost instantly after any backend mutation.
  - Watches `user.notifications` to find the first unread entry and renders a floating `<AlertWithIcon>` with color mapping.
  - Clicking the close icon posts `POST /notifications/{id}/read`, then re-fetches the user on success (or even on failure for consistency).

### Polling Fallback

- If the Pusher connection is not `connected`, the component starts a `setInterval` every 30 s calling `pollForUpdates()` as a safety net.
- `pollForUpdates` currently refreshes open + closed trades (user polling was disabled to avoid duplicate load but can be re-enabled). The `isPolling` guard avoids overlap.
- When the WebSocket reconnects, polling intervals are cleared.

### Lifecycle Safeguards

- Uses `channelsSubscribed` refs to avoid duplicate subscriptions per channel and to make sure `unsubscribeFromChannel` is called on unmount/user change.
- Uses `isMounted` to prevent state updates if the component unmounts mid-request.

## Notification Sound

- Both `NotificationListener` and `ChatNotificationListener` create an `HTMLAudioElement` via `new Audio("/sounds/notification.mp3")`.
- The audio instance is stored in a ref, rewound (`currentTime = 0`) before each `play()`, and cleaned up on unmount (`pause()` + nullify).
- Errors thrown by `audio.play()` are caught and logged—important for browsers that block autoplay without interaction.
- Sound asset lives at `public/sounds/notification.mp3`.

## Chat-Specific Realtime Alerts (`ChatNotificationListener.tsx`)

- Mounted in `App.tsx` alongside `NotificationListener`.
- Responsibilities:
  - Keeps an `unreadCount` fetched from `GET /chat/unread-count`.
  - Displays a toast-like `AlertWithIcon` when `unreadCount > 0` and the user is not inside `/main/chat`.
  - Navigates to `/main/chat` when clicked and hides the alert once the chat view is active.
- Realtime flow:
  - Subscribes to `chat.customer.{userId}` when connected to Pusher.
  - Handles `.message.sent` events by:
    - Ignoring messages from the current user or while already on the chat page.
    - Playing the shared notification sound.
    - Refreshing the unread count (which also toggles the alert).
- Polling/initial load:
  - Calls `fetchUnreadCount()` on mount (and whenever the user changes) to seed the unread number even before WebSocket events arrive.

## Supporting HTTP Endpoints

These endpoints are exercised by the realtime listeners and should exist in the backend:

| Purpose | Endpoint |
| --- | --- |
| Refresh user profile/notifications | `GET /user` |
| Mark notification as read | `POST /notifications/{id}/read` |
| Fetch chat unread count | `GET /chat/unread-count` |
| Authenticate Pusher channels | `POST /broadcasting/auth` |

## Reusing in Next.js

1. **Port the infrastructure**: copy `services/PusherService.ts` and `hooks/usePusher.ts` (update `import.meta.env` → `process.env.NEXT_PUBLIC_…`).
2. **Replicate the stores**: your Next.js AI app needs equivalents of `useUserStore` or adapt the listener to whichever state management the AI experience uses.
3. **Root layout hook-up**: mount a component equivalent to `WebSocketInitializer` inside a client wrapper that only renders once an auth token exists.
4. **Notification listener**: reuse the logic from `NotificationListener.tsx`, especially the channel names/events, polling fallback, and read-marking workflow.
5. **Chat alerts**: reuse `ChatNotificationListener.tsx` if you need unread banners outside the chat page. Inside the chat UI, `hooks/useChat.ts` already subscribes to the same channel for live message streaming.
6. **Sound asset**: keep `/sounds/notification.mp3` (or another MP3) under `public/` so both listeners can instantiate `new Audio("/sounds/notification.mp3")`.
7. **Error handling/parity**: make sure that `audio.play()` is wrapped in a `.catch`, and that connection loss triggers polling so the UI never stalls even if WebSockets drop.

With the above pieces ported, the Next.js AI front end will retain the same behaviour: user balances/permissions refresh immediately, notifications appear with sound, and chat unread alerts pop up in real time.
