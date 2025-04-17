import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '@/lib/axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import useUserStore from '@/store/userStore';
import { AxiosError } from 'axios';
import { FileUpload } from '@/components/chat/chat-input';

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

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface ChatHook {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    connectionStatus: ConnectionStatus;
    sendMessage: (message: string, file?: File) => Promise<void>;
    loadMoreMessages: () => Promise<void>;
    hasMoreMessages: boolean;
    uploadFile: (file: File) => Promise<string>;
    selectedFiles: FileUpload[];
    addFile: (file: File) => void;
    removeFile: (index: number) => void;
}

export function useChat(): ChatHook {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const [page, setPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<FileUpload[]>([]);
    const user = useUserStore((state) => state.user);
    const echoInstance = useRef<Echo | null>(null);

    // Initialize Echo
    useEffect(() => {
        const token = useUserStore.getState().token;

        if (!token) {
            setConnectionStatus('disconnected');
            setError('Authentication required.');
            setIsLoading(false);
            return;
        }

        // Initialize Laravel Echo with Pusher
        if (!window.Echo) {
            window.Pusher = Pusher;
            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: import.meta.env.VITE_PUSHER_APP_KEY as string,
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER as string,
                forceTLS: true,
                authEndpoint: '/broadcasting/auth',
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
        }

        echoInstance.current = window.Echo;

        // Set up private channel for the user
        if (user) {
            const channel = window.Echo.private(`chat.user.${user.id}`);

            channel
                .listen<MessageSentEvent>('.message.sent', (e: MessageSentEvent) => {
                    setMessages(prev => [e.message, ...prev]);
                })
                .listen<MessageReadEvent>('.message.read', (e: MessageReadEvent) => {
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === e.message_id
                                ? { ...msg, read_at: new Date().toISOString() }
                                : msg
                        )
                    );
                });

            setConnectionStatus('connected');
        }

        // Fetch initial messages
        fetchMessages();

        // Cleanup
        return () => {
            if (window.Echo) {
                window.Echo.disconnect();
            }
        };
    }, [user?.id]);

    // Function to fetch messages
    const fetchMessages = async (pageToFetch = 1): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axiosInstance.get<MessagesPaginatedResponse>(
                `/chat/messages?page=${pageToFetch}`
            );

            if (response.data && response.data.data) {
                if (pageToFetch === 1) {
                    setMessages(response.data.data);
                } else {
                    setMessages(prev => [...prev, ...response.data.data]);
                }

                // Check if there are more pages
                setHasMoreMessages(!!response.data.next_page_url);
                setPage(pageToFetch);
            }
        } catch (err) {
            const error = err as Error | AxiosError;
            const errorMessage = 'response' in error
                ? (error as AxiosError<{message: string}>).response?.data?.message || 'Failed to load messages.'
                : 'Failed to load messages.';

            setError(errorMessage);
            setConnectionStatus('disconnected');
        } finally {
            setIsLoading(false);
        }
    };

    // Load more messages
    const loadMoreMessages = useCallback(async (): Promise<void> => {
        if (!hasMoreMessages || isLoading) return;

        const nextPage = page + 1;
        await fetchMessages(nextPage);
    }, [hasMoreMessages, isLoading, page]);

    // Upload a file
    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post<{ url: string }>('/chat/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const fileIndex = selectedFiles.findIndex(f => f.file === file);
                    if (fileIndex !== -1 && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setSelectedFiles(prev => {
                            const updated = [...prev];
                            updated[fileIndex] = { ...updated[fileIndex], progress };
                            return updated;
                        });
                    }
                },
            });

            return response.data.url;
        } catch (err) {
            const error = err as Error | AxiosError;
            const errorMessage = 'response' in error
                ? (error as AxiosError<{message: string}>).response?.data?.message || 'Failed to upload file.'
                : 'Failed to upload file.';

            const fileIndex = selectedFiles.findIndex(f => f.file === file);
            if (fileIndex !== -1) {
                setSelectedFiles(prev => {
                    const updated = [...prev];
                    updated[fileIndex] = { ...updated[fileIndex], error: errorMessage, uploading: false };
                    return updated;
                });
            }

            throw new Error(errorMessage);
        }
    };

    // Add a file to the selected files
    const addFile = (file: File): void => {
        // Create preview URL for images
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
            preview = URL.createObjectURL(file);
        }

        setSelectedFiles(prev => [
            ...prev,
            { file, preview, uploading: false, progress: 0 }
        ]);
    };

    // Remove a file from the selected files
    const removeFile = (index: number): void => {
        setSelectedFiles(prev => {
            const updated = [...prev];
            // Revoke object URL if it exists to prevent memory leaks
            if (updated[index].preview) {
                URL.revokeObjectURL(updated[index].preview);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    // Send a message with optional file
    const sendMessage = async (message: string, file?: File): Promise<void> => {
        if (!user) {
            setError('You must be logged in to send messages.');
            return;
        }

        if (!message.trim() && !file && selectedFiles.length === 0) {
            return;
        }

        try {
            // If there's a file or selectedFiles, process them first
            let attachments: string[] = [];

            if (file) {
                // If a file is directly passed, upload it
                const fileUrl = await uploadFile(file);
                attachments.push(fileUrl);
            } else if (selectedFiles.length > 0) {
                // Mark all files as uploading
                setSelectedFiles(prev =>
                    prev.map(f => ({ ...f, uploading: true, progress: 0 }))
                );

                // Upload all selected files
                const uploadPromises = selectedFiles.map(fileUpload => uploadFile(fileUpload.file));
                const fileUrls = await Promise.all(uploadPromises);
                attachments = fileUrls;

                // Clear selected files after successful upload
                setSelectedFiles([]);
            }

            // Send the message with attachments
            await axiosInstance.post<MessageCreatedResponse>('/chat/messages', {
                message,
                attachments
            });

            // Message will come through the WebSocket
        } catch (err) {
            const error = err as Error | AxiosError;
            const errorMessage = 'response' in error
                ? (error as AxiosError<{message: string}>).response?.data?.message || 'Failed to send message.'
                : 'Failed to send message.';

            setError(errorMessage);
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
        removeFile
    };
}

// Add TypeScript declaration for Echo
declare global {
    interface Window {
        Echo: Echo;
        Pusher: typeof Pusher;
    }
}

// Add type to Pusher's private channel listen method
declare module 'laravel-echo' {
    interface PrivateChannel {
        listen<T>(event: string, callback: (data: T) => void): this;
    }
}
