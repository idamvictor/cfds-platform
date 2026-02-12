# Admin Chat Implementation (Vite) — Porting Guide for Next.js AI

Use this as a blueprint for rebuilding the admin-to-customer chat inside the Next.js AI experience. It lists the moving pieces, how they talk to each other, and which components are safe to copy.

## Authentication / Auto-Login & Admin Access
- **Auto-login flow** (`src/pages/auth/auto-login.tsx` via route `/auto-login`):
  - Query params: `token` (required) and optional `path` (default `/dashboard`).
  - If no token: toast error + redirect to `/`.
  - With token: sets a **dummy placeholder user** plus the token into `useUserStore` (so axios/auth headers work immediately). It then calls `getCurrentUser()` to fetch the real user from the API—no user fields are trusted from the URL. After hydration, it navigates to `path`.
  - Purpose: SSO/deep links where backend hands off a token and the frontend finishes by fetching the user.
- **Admin access check**: The `/admin/chat` route is only wrapped in `ProtectedRoute`, which checks for logged in + token but does **not** enforce admin roles. Any authenticated user can reach `/admin/chat` right now. In Next.js, add an explicit admin/role gate (redirect or 403 if `!user?.is_admin`).

## High-Level Flow
- Admin lands on `src/pages/admin/AdminChat.tsx`, which renders a two-pane layout: user list sidebar + conversation area.
- Selected customer ID is passed into `useChat(customerId)` to stream/poll messages. The hook wraps Pusher realtime plus HTTP fallbacks.
- Messages render via `src/components/chat/ChatMessageList.tsx`; input + attachments handled by `src/components/chat/chat-input.tsx`.
- Online presence: `useOnlineStatusStore.startHeartbeat()` pings `/user/heartbeat` every minute to keep `is_online` fresh for the list.

## Copyable Pieces
1) **Admin page shell** — `src/pages/admin/AdminChat.tsx`
- Controls state for users, selected tab, search query, mobile menu, selected user, message text.
- Fetches users from `GET /admin/users` every 30s; preserves current selection if still present.
- Starts heartbeat on mount via `useOnlineStatusStore`.
- Builds `selectedUserId` (empty string when none) and feeds it into `useChat`.
- Renders status chip based on `connectionStatus`/`isPolling`.
- Uses `ChatMessageList` for history, `ChatInput` for sending text/files.

2) **User sidebar** — `src/pages/admin/UserList.tsx`
- Filters by search (first/last/email) and tabs: `all`, `online` (is_online true), `unread` (unread_count > 0).
- Displays avatar, badge for unread_count, account_id/email line, green dot for online.
- Emits `setSelectedUser(user)` on click; highlights the active user.

3) **Chat hook** — `src/hooks/useChat.ts`
- API:
  - `useChat(customerId?)` → `{ messages, sendMessage, loadMoreMessages, hasMoreMessages, isLoading, error, connectionStatus, selectedFiles, addFile, removeFile, isPolling, lastMessageTimestamp }`.
- Transport:
  - Pusher channel `chat.customer.{targetUserId}` (targetUserId = passed customerId; falls back to current user from `useUserStore` if omitted).
  - Listens for `.message.sent` → append message; `.message.read` → mark read_at.
  - If Pusher disconnected, starts 5s polling (`after=lastMessageTimestamp`) to fetch only newer messages; stops polling when reconnected.
- HTTP endpoints:
  - `GET /chat/messages?customer_id={id}&page=N` (admin view) or `GET /chat/messages?page=N` (self view).
  - `POST /chat/messages` with `{ message, attachments[], customer_id? }`.
  - `POST /chat/upload` multipart for files; tracks upload progress per file.
- Attachments: collects `selectedFiles`, uploads all before send, then clears. Generates preview URLs for images.
- Pagination: `loadMoreMessages` prepends older pages; `hasMoreMessages` from `next_page_url`.

4) **Message list** — `src/components/chat/ChatMessageList.tsx`
- Props: `{ messages, currentUserId, isLoading, onLoadMore, hasMoreMessages }`.
- Groups messages by date; auto-scrolls to bottom unless user scrolled up. Shows “jump to bottom” button + new-message dot.
- Renders bubbles aligned by sender; admin messages tinted blue, current user uses primary color, others muted.
- Attachments: inline image preview (or file row with icon + size + download).
- Shows read indicator (“• Read”) on current user messages when `read_at` present.
- Triggers `onLoadMore()` when scrolled near top and `hasMoreMessages`.

5) **Chat input** — `src/components/chat/chat-input.tsx`
- Props: `{ value, onChange, onSend, onFileSelect?, disabled?, selectedFiles?, onFileRemove? }`.
- Handles Enter-to-send, file picker (images/PDF/Office), and shows selected file chips with progress/error state.
- Calls `onSend()` on submit; button shows spinner while sending.

6) **Online heartbeat store** — `src/store/OnlineStatusState.ts`
- `startHeartbeat` posts to `/user/heartbeat` immediately and every 60s (paused when tab hidden, resumes on visibility change).
- `stopHeartbeat` clears interval and listeners. Used by AdminChat to keep `is_online` accurate.

## Data Contracts / Expectations
- `/admin/users` returns array with `{ id, first_name, last_name, email, avatar?, account_id, last_activity?, is_online, unread_count? }`.
- Chat messages (`ChatMessage`) include `sender_id`, `receiver_id|null`, `is_admin`, `read_at`, `created_at`, `attachments[]`, and optional `sender{ id, first_name, last_name, name, avatar }`.
- Attachment shape: `{ id, file_name, file_path, file_size, file_type, is_image?, download_url, ... }`.

## Porting Notes for Next.js AI
- Keep `useChat` as the transport layer; swap `import.meta.env` usage inside `usePusher`/axios config to `process.env.NEXT_PUBLIC_…` if needed.
- Reuse `ChatMessageList`, `chat-input`, and `UserList` with minimal changes (update import aliases and UI primitives to your design system if different).
- In your Next.js route (e.g., `/admin/chat` page), recreate the layout from `AdminChat.tsx` and wire `useChat(selectedUser?.id || "")`.
- Ensure global state equivalents exist: `useUserStore` (for current admin), `useOnlineStatusStore` (or inline heartbeat), and `usePusher` for realtime.
- Preserve endpoints and payloads (`/admin/users`, `/chat/messages`, `/chat/upload`, `/user/heartbeat`, Pusher channel `chat.customer.{id}` events `.message.sent` + `.message.read`).
- Attachment downloads rely on `attachment.download_url`; keep API parity or map the field accordingly.

## Quick Copy Map
- Page shell: `src/pages/admin/AdminChat.tsx`
- Sidebar list: `src/pages/admin/UserList.tsx`
- Transport: `src/hooks/useChat.ts`
- UI building blocks: `src/components/chat/ChatMessageList.tsx`, `src/components/chat/chat-input.tsx`
- Presence heartbeat: `src/store/OnlineStatusState.ts`
