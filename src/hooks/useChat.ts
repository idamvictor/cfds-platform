import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "@/lib/axios";
import LaravelEcho from "laravel-echo";
import Pusher from "pusher-js";
import useUserStore from "@/store/userStore";
import type { AxiosError } from "axios";

// Define proper types for Pusher and Echo
interface PusherConnection {
  state: string;
  bind: (event: string, callback: (data?: unknown) => void) => void;
  unbind: (event: string, callback?: (data?: unknown) => void) => void;
}

interface PusherInstance {
  connection: PusherConnection;
  disconnect: () => void;
}

interface EchoChannel {
  listen: <T>(event: string, callback: (data: T) => void) => EchoChannel;
  stopListening: (event: string) => EchoChannel;
  unsubscribe: () => void;
  name?: string;
}

interface EchoConnector {
  pusher: PusherInstance;
}

interface EchoInstance {
  connector: EchoConnector;
  private: (channel: string) => EchoChannel;
  disconnect: () => void;
}

// Message and attachment types
export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
  updated_at: string;
  download_url: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string | null;
  is_admin: boolean;
  read_at: string | null;
  created_at: string;
  attachments: MessageAttachment[];
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
}

interface MessageSentEvent {
  message: ChatMessage;
}

interface MessageReadEvent {
  message_id: string;
}

interface MessagesPaginatedResponse {
  data: ChatMessage[];
  next_page_url: string | null;
  prev_page_url: string | null;
  first_page_url: string;
  last_page_url: string;
  from: number;
  to: number;
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

interface MessageCreatedResponse {
  success: boolean;
  data: ChatMessage;
}

type ConnectionStatus =
  | "connected"
  | "connecting"
  | "disconnected"
  | "reconnecting";

interface SelectedFile {
  file: File;
  preview?: string;
  uploading: boolean;
  progress: number;
  error?: string;
}

interface ChatHook {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
  sendMessage: (message: string, file?: File) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;
  uploadFile: (file: File) => Promise<string>;
  selectedFiles: SelectedFile[];
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  reconnect: () => void;
}

// Declare global variables for TypeScript
declare global {
  interface Window {
    Echo: EchoInstance | undefined;
    Pusher: typeof Pusher;
  }
}

export function useChat(): ChatHook {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  // Get user from store
  const user = useUserStore((state) => state.user);

  // Use refs to store connection objects
  const echoRef = useRef<EchoInstance | null>(null);
  const channelRef = useRef<EchoChannel | null>(null);
  const connectedRef = useRef<boolean>(false);
  const attemptingConnectionRef = useRef<boolean>(false);
  const autoReconnectTimeoutRef = useRef<number | null>(null);

  // Clear any auto-reconnect timeouts
  const clearAutoReconnectTimeout = useCallback(() => {
    if (autoReconnectTimeoutRef.current !== null) {
      window.clearTimeout(autoReconnectTimeoutRef.current);
      autoReconnectTimeoutRef.current = null;
    }
  }, []);

  // Function to fetch chat messages
  const fetchMessages = useCallback(
    async (pageToFetch = 1, showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get<MessagesPaginatedResponse>(
          `/chat/messages?page=${pageToFetch}`
        );

        if (response.data && Array.isArray(response.data.data)) {
          const incoming = response.data.data;

          if (pageToFetch === 1) {
            setMessages(incoming);
          } else {
            // Add new messages without duplicates
            setMessages((prev) => {
              const existingIds = new Set(prev.map((msg) => msg.id));
              const newMessages = incoming.filter(
                (msg) => !existingIds.has(msg.id)
              );
              return [...newMessages, ...prev]; // Prepend new messages
            });
          }

          setHasMoreMessages(!!response.data.next_page_url);
          setPage(pageToFetch);
        } else {
          console.error("Invalid message response format:", response.data);
          setError("Invalid response from server");
        }
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const msg =
          axiosErr.response?.data?.message || "Failed to load messages.";
        console.error("Error fetching messages:", msg);
        setError(msg);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    []
  );

  // Function to clean up connection
  const cleanupConnection = useCallback(() => {
    clearAutoReconnectTimeout();

    // Clean up channel first
    if (channelRef.current) {
      try {
        channelRef.current.stopListening(".message.sent");
        channelRef.current.stopListening(".message.read");
        channelRef.current.unsubscribe();
      } catch (e) {
        console.error("Error cleaning up channel:", e);
      }
      channelRef.current = null;
    }

    // Then clean up Echo
    if (echoRef.current) {
      try {
        echoRef.current.disconnect();
      } catch (e) {
        console.error("Error disconnecting Echo:", e);
      }
      echoRef.current = null;
    }

    // Reset connection flags
    connectedRef.current = false;
    attemptingConnectionRef.current = false;
  }, [clearAutoReconnectTimeout]);

  // Connect to Echo with a simplified, robust approach
  const connect = useCallback(() => {
    // If already attempting a connection, don't try again
    if (attemptingConnectionRef.current) {
      console.log("Already attempting connection, skipping");
      return;
    }

    // If already connected, don't reconnect
    if (connectedRef.current && echoRef.current && channelRef.current) {
      console.log("Already connected, skipping connection attempt");
      return;
    }

    // Clean up any existing connection first
    cleanupConnection();

    // Get the auth token
    const token = useUserStore.getState().token;
    if (!token || !user) {
      setConnectionStatus("disconnected");
      setError("Authentication required.");
      setIsLoading(false);
      return;
    }

    // Set the connecting state
    attemptingConnectionRef.current = true;
    setConnectionStatus("connecting");

    try {
      // Set up Pusher globally
      window.Pusher = Pusher;

      // Create Echo instance with minimal configuration
      echoRef.current = new LaravelEcho({
        broadcaster: "pusher",
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true,
        authEndpoint:
          import.meta.env.VITE_API_URL + "/api/v1/broadcasting/auth",
        auth: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });

      // Wait for connection to establish
      if (echoRef.current.connector.pusher) {
        const connection = echoRef.current.connector.pusher.connection;

        const onConnected = () => {
          console.log("Connected to Pusher");
          setConnectionStatus("connected");
          connectedRef.current = true;
          attemptingConnectionRef.current = false;

          // Subscribe to channel only after connected
          subscribeToChannel();
        };

        const onDisconnected = () => {
          console.log("Disconnected from Pusher");
          setConnectionStatus("disconnected");
          connectedRef.current = false;
          attemptingConnectionRef.current = false;

          // Auto reconnect after a short delay
          clearAutoReconnectTimeout();
          autoReconnectTimeoutRef.current = window.setTimeout(() => {
            if (!connectedRef.current) {
              console.log("Attempting auto-reconnect...");
              connect();
            }
          }, 5000);
        };

        const onError = (err: unknown) => {
          console.error("Pusher connection error:", err);
          setConnectionStatus("disconnected");
          setError(`Connection error: ${String(err)}`);
          connectedRef.current = false;
          attemptingConnectionRef.current = false;
        };

        // Bind connection events
        connection.bind("connected", onConnected);
        connection.bind("disconnected", onDisconnected);
        connection.bind("error", onError);

        // If already connected, manually trigger the connected handler
        if (connection.state === "connected") {
          onConnected();
        }
      } else {
        throw new Error("Failed to initialize Pusher connection");
      }
    } catch (err) {
      console.error("Error setting up Echo:", err);
      setConnectionStatus("disconnected");
      setError(`Connection failed: ${String(err)}`);
      attemptingConnectionRef.current = false;

      // Try to reconnect after a delay
      clearAutoReconnectTimeout();
      autoReconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, 5000);
    }
  }, [user, cleanupConnection, clearAutoReconnectTimeout]);

  // Function to subscribe to the channel
  const subscribeToChannel = useCallback(() => {
    if (!echoRef.current || !user || !connectedRef.current) {
      console.error("Cannot subscribe to channel - not connected or no user");
      return;
    }

    try {
      // Subscribe to the private chat channel
      const channelName = `chat.customer.${user.id}`;
      channelRef.current = echoRef.current.private(channelName);

      // Listen for new messages
      channelRef.current.listen<MessageSentEvent>(".message.sent", (e) => {
        if (e && e.message) {
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            if (!prev.some((msg) => msg.id === e.message.id)) {
              return [...prev, e.message];
            }
            return prev;
          });
        }
      });

      // Listen for read receipts
      channelRef.current.listen<MessageReadEvent>(".message.read", (e) => {
        if (e && e.message_id) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === e.message_id
                ? { ...msg, read_at: new Date().toISOString() }
                : msg
            )
          );
        }
      });

      console.log(`Subscribed to channel: ${channelName}`);
    } catch (err) {
      console.error("Error subscribing to channel:", err);
      // Don't set connection to disconnected, just log the error
    }
  }, [user]);

  // Initial setup
  useEffect(() => {
    // Initialize connection
    connect();

    // Fetch initial messages
    fetchMessages().catch((err) => {
      console.error("Error fetching initial messages:", err);
    });

    // Cleanup on unmount
    return () => {
      cleanupConnection();
    };
  }, [connect, fetchMessages, cleanupConnection]);

  // Reconnect if user changes
  useEffect(() => {
    if (user) {
      // Only reconnect if we need to (if disconnected or wrong channel)
      const needsReconnect =
        !connectedRef.current ||
        !channelRef.current ||
        (channelRef.current.name &&
          !channelRef.current.name.includes(`chat.customer.${user.id}`));

      if (needsReconnect) {
        cleanupConnection();
        connect();
      }
    }
  }, [user, connect, cleanupConnection]);

  // Function to load more messages
  const loadMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoading) return;
    await fetchMessages(page + 1);
  }, [hasMoreMessages, isLoading, page, fetchMessages]);

  // Public reconnect function
  const reconnect = useCallback(() => {
    if (attemptingConnectionRef.current) {
      console.log("Already attempting to connect, skipping reconnect");
      return;
    }

    console.log("Manually reconnecting...");
    cleanupConnection();
    connect();
  }, [cleanupConnection, connect]);

  // Function to upload a file
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const idx = selectedFiles.findIndex((f) => f.file === file);

    try {
      const response = await axiosInstance.post<{ url: string }>(
        "/chat/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (ev) => {
            if (ev.total && idx !== -1) {
              const pct = Math.round((ev.loaded * 100) / ev.total);
              setSelectedFiles((prev) => {
                const up = [...prev];
                if (idx >= 0 && idx < up.length) {
                  up[idx].progress = pct;
                }
                return up;
              });
            }
          },
        }
      );
      return response.data.url;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const msg = axiosErr.response?.data?.message || "Failed to upload file.";
      if (idx !== -1) {
        setSelectedFiles((prev) => {
          const up = [...prev];
          if (idx >= 0 && idx < up.length) {
            up[idx].error = msg;
            up[idx].uploading = false;
          }
          return up;
        });
      }
      throw new Error(msg);
    }
  };

  // Function to add a file
  const addFile = useCallback((file: File) => {
    let preview: string | undefined;
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);
    }
    setSelectedFiles((prev) => [
      ...prev,
      { file, preview, uploading: false, progress: 0 },
    ]);
  }, []);

  // Function to remove a file
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const up = [...prev];
      if (index >= 0 && index < up.length) {
        if (up[index].preview) {
          URL.revokeObjectURL(up[index].preview!);
        }
        up.splice(index, 1);
      }
      return up;
    });
  }, []);

  // Function to send a message
  const sendMessage = async (message: string, file?: File) => {
    if (!user) {
      setError("You must be logged in to send messages.");
      return;
    }

    if (!message.trim() && !file && selectedFiles.length === 0) {
      return;
    }

    // Check connection status
    if (connectionStatus !== "connected") {
      console.log("Not connected. Attempting reconnect...");
      reconnect();
      setError("Connection lost. Attempting to reconnect...");
      return;
    }

    try {
      let attachments: string[] = [];

      // Upload the file if provided
      if (file) {
        attachments.push(await uploadFile(file));
      } else if (selectedFiles.length) {
        setSelectedFiles((prev) =>
          prev.map((f) => ({ ...f, uploading: true, progress: 0 }))
        );

        try {
          const uploadPromises = selectedFiles.map((f) => uploadFile(f.file));
          attachments = await Promise.all(uploadPromises);
        } finally {
          setSelectedFiles([]);
        }
      }

      // Send the message to the server
      const response = await axiosInstance.post<MessageCreatedResponse>(
        "/chat/messages",
        { message, attachments }
      );

      // Add the message to the UI
      if (response.data && response.data.data) {
        setMessages((prev) => {
          if (!prev.some((msg) => msg.id === response.data.data.id)) {
            return [...prev, response.data.data];
          }
          return prev;
        });
      }

      setError(null);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const msg = axiosErr.response?.data?.message || "Failed to send message.";
      console.error("Error sending message:", err);
      setError(msg);

      // If network error, try to reconnect
      if (axiosErr.message === "Network Error") {
        reconnect();
      }
    }
  };

  return {
    messages,
    isLoading,
    error,
    connectionStatus,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    uploadFile,
    selectedFiles,
    addFile,
    removeFile,
    reconnect,
  };
}
