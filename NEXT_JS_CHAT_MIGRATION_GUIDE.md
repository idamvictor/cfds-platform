# Chat System Migration Guide for Next.js

## Overview
This guide explains how to migrate the real-time chat functionality from this React/Vite application to a Next.js application. The chat system supports both admin and user interfaces with real-time messaging, file uploads, and WebSocket connections.

## Core Components to Copy

### 1. Main Hook
- **File**: `src/hooks/useChat.ts`
- **Purpose**: Main chat functionality including messaging, file upload, pagination, and real-time updates

### 2. UI Components
- **Files to copy**:
  - `src/components/chat/ChatMessageList.tsx` - Message display with infinite scroll
  - `src/components/chat/chat-input.tsx` - Input field with file attachment support
  - `src/components/chat/chat-message.tsx` - Individual message component (optional, simpler alternative)

### 3. Real-time Connection
- **Files to copy**:
  - `src/hooks/usePusher.ts` - Pusher WebSocket hook
  - `src/services/PusherService.ts` - Pusher service singleton

### 4. Page Components
- **Admin Chat**: `src/pages/admin/AdminChat.tsx` - Full admin interface
- **User Chat**: `src/pages/Preferences/live-chat.tsx` - User chat interface

## Dependencies Required

```bash
npm install pusher-js laravel-echo axios date-fns
```

## Environment Variables

Add to your `.env.local`:
```
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_APP_CLUSTER=your_cluster
```

## Backend API Endpoints Required

Your Laravel backend needs these endpoints:

```php
// Chat messages
GET /chat/messages?page=1&customer_id=123 // Admin view
GET /chat/messages?page=1 // User view
POST /chat/messages // Send message

// File uploads
POST /chat/upload

// Authentication for Pusher
POST /broadcasting/auth

// Unread count
GET /chat/unread-count
```

## Migration Steps

### 1. Copy Core Files
Copy these files to your Next.js project:
- `hooks/useChat.ts`
- `hooks/usePusher.ts` 
- `services/PusherService.ts`
- `components/chat/` folder

### 2. Update Import Paths
Replace relative imports with your Next.js structure:
```typescript
// From: @/components/ui/avatar
// To: @/components/ui/avatar (if using shadcn/ui)
// Or: ../ui/avatar (relative paths)
```

### 3. Update Environment Variables
Change `import.meta.env` to `process.env`:
```typescript
// From: import.meta.env.VITE_PUSHER_APP_KEY
// To: process.env.NEXT_PUBLIC_PUSHER_APP_KEY
```

### 4. Create Axios Instance
Create `lib/axios.ts`:
```typescript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
```

### 5. User Store Integration
Create or adapt your user store:
```typescript
// If using Zustand
import { create } from 'zustand';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## Usage Examples

### User Chat Page
```tsx
'use client';
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessageList from '@/components/chat/ChatMessageList';
import { ChatInput } from '@/components/chat/chat-input';

export default function ChatPage() {
  const [messageText, setMessageText] = useState('');
  const {
    messages,
    sendMessage,
    isLoading,
    selectedFiles,
    addFile,
    removeFile
  } = useChat(); // No parameter for user chat

  const handleSendMessage = async () => {
    if (!messageText.trim() && selectedFiles.length === 0) return;
    await sendMessage(messageText);
    setMessageText('');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessageList
          messages={messages}
          currentUserId="user_id"
          isLoading={isLoading}
          onLoadMore={() => {}}
          hasMoreMessages={false}
        />
      </div>
      <div className="p-4">
        <ChatInput
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onSend={handleSendMessage}
          onFileSelect={addFile}
          selectedFiles={selectedFiles}
          onFileRemove={removeFile}
          disabled={false}
        />
      </div>
    </div>
  );
}
```

### Admin Chat Page
```tsx
'use client';
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessageList from '@/components/chat/ChatMessageList';

export default function AdminChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const {
    messages,
    sendMessage,
    isLoading
  } = useChat(selectedUserId); // Pass customer ID for admin

  // Rest of admin chat implementation...
  return (
    <div>
      {/* User selection UI */}
      {/* Chat interface */}
    </div>
  );
}
```

## Key Differences from Vite

1. **Environment Variables**: Use `NEXT_PUBLIC_` prefix
2. **Import Resolution**: Update `@/` paths to match your tsconfig
3. **Client Components**: Add `'use client'` directive for components using hooks
4. **Build Process**: No changes needed for the chat logic itself

## WebSocket Channel Structure

The chat uses these Pusher channels:
- **User chat**: `private-chat.customer.{user_id}`
- **Admin chat**: `private-chat.customer.{customer_id}`

Events:
- `message.sent` - New message received
- `message.read` - Message read receipt

## File Upload Support

The system supports:
- Images (PNG, JPG, etc.)
- PDFs
- Office documents (Word, Excel)
- File size display and download links
- Progress indicators during upload

## Backup Polling

When WebSocket disconnects, the system automatically falls back to HTTP polling every 5 seconds until reconnection.