import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { usePusher } from '@/hooks/usePusher';
import useUserStore from '@/store/userStore';
import type { AxiosError } from 'axios';

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

// Event types
interface MessageSentEvent {
    message: ChatMessage;
}

interface MessageReadEvent {
    message_id: string;
}

// API response types
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

// File upload tracking
interface SelectedFile {
    file: File;
    preview?: string;
    uploading: boolean;
    progress: number;
    error?: string;
}

// Hook return type
interface ChatHook {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    connectionStatus: string;
    sendMessage: (message: string, file?: File) => Promise<void>;
    loadMoreMessages: () => Promise<void>;
    hasMoreMessages: boolean;
    uploadFile: (file: File) => Promise<string>;
    selectedFiles: SelectedFile[];
    addFile: (file: File) => void;
    removeFile: (index: number) => void;
}

/**
 * Hook for chat functionality using PusherService
 */
export function useChat(): ChatHook {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

    // Get user from store
    const user = useUserStore(state => state.user);

    // Use our Pusher hook that manages the connection
    const {
        connectionStatus,
        error: connectionError,
        subscribeToPrivateChannel
    } = usePusher();

    // Function to fetch chat messages
    const fetchMessages = useCallback(async (pageToFetch = 1, showLoading = true) => {
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
                    setMessages(prev => {
                        const existingIds = new Set(prev.map(msg => msg.id));
                        const newMessages = incoming.filter(msg => !existingIds.has(msg.id));
                        return [...newMessages, ...prev]; // Prepend new messages
                    });
                }

                setHasMoreMessages(!!response.data.next_page_url);
                setPage(pageToFetch);
            } else {
                console.error('Invalid message response format:', response.data);
                setError('Invalid response from server');
            }
        } catch (err) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const msg = axiosErr.response?.data?.message || 'Failed to load messages.';
            console.error('Error fetching messages:', msg);
            setError(msg);
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    // Effect to set connection error if present
    useEffect(() => {
        if (connectionError) {
            setError(connectionError);
        }
    }, [connectionError]);

    // Setup channel subscription for chat messages
    useEffect(() => {
        if (connectionStatus === 'connected' && user) {
            // Subscribe to the user's chat channel
            subscribeToPrivateChannel<MessageSentEvent>(
                `chat.customer.${user.id}`,
                {
                    '.message.sent': (event) => {
                        if (event && event.message) {
                            setMessages(prev => {
                                // Check if message already exists to prevent duplicates
                                if (!prev.some(msg => msg.id === event.message.id)) {
                                    return [...prev, event.message];
                                }
                                return prev;
                            });
                        }
                    }
                }
            );

            // Subscribe to read receipts
            subscribeToPrivateChannel<MessageReadEvent>(
                `chat.customer.${user.id}`,
                {
                    '.message.read': (event) => {
                        if (event && event.message_id) {
                            setMessages(prev =>
                                prev.map(msg =>
                                    msg.id === event.message_id
                                        ? { ...msg, read_at: new Date().toISOString() }
                                        : msg
                                )
                            );
                        }
                    }
                }
            );

            // Fetch initial messages when connected
            fetchMessages().catch(err => {
                console.error('Error fetching initial messages:', err);
            });
        }
    }, [connectionStatus, user, subscribeToPrivateChannel, fetchMessages]);

    // Function to load more messages
    const loadMoreMessages = useCallback(async () => {
        if (!hasMoreMessages || isLoading) return;
        await fetchMessages(page + 1, false);
    }, [hasMoreMessages, isLoading, page, fetchMessages]);

    // Function to upload a file
    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const idx = selectedFiles.findIndex(f => f.file === file);

        try {
            const response = await axiosInstance.post<{ url: string }>('/chat/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: ev => {
                    if (ev.total && idx !== -1) {
                        const pct = Math.round((ev.loaded * 100) / ev.total);
                        setSelectedFiles(prev => {
                            const updatedFiles = [...prev];
                            if (idx >= 0 && idx < updatedFiles.length) {
                                updatedFiles[idx] = {
                                    ...updatedFiles[idx],
                                    progress: pct
                                };
                            }
                            return updatedFiles;
                        });
                    }
                },
            });
            return response.data.url;
        } catch (err) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const msg = axiosErr.response?.data?.message || 'Failed to upload file.';
            if (idx !== -1) {
                setSelectedFiles(prev => {
                    const updatedFiles = [...prev];
                    if (idx >= 0 && idx < updatedFiles.length) {
                        updatedFiles[idx] = {
                            ...updatedFiles[idx],
                            error: msg,
                            uploading: false
                        };
                    }
                    return updatedFiles;
                });
            }
            throw new Error(msg);
        }
    };

    // Function to add a file to the selected files
    const addFile = useCallback((file: File) => {
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
            preview = URL.createObjectURL(file);
        }
        setSelectedFiles(prev => [
            ...prev,
            { file, preview, uploading: false, progress: 0 },
        ]);
    }, []);

    // Function to remove a file from the selected files
    const removeFile = useCallback((index: number) => {
        setSelectedFiles(prev => {
            const updatedFiles = [...prev];
            if (index >= 0 && index < updatedFiles.length) {
                // Release object URL if it exists to prevent memory leaks
                if (updatedFiles[index].preview) {
                    URL.revokeObjectURL(updatedFiles[index].preview!);
                }
                updatedFiles.splice(index, 1);
            }
            return updatedFiles;
        });
    }, []);

    // Function to send a message
    const sendMessage = async (message: string, file?: File) => {
        if (!user) {
            setError('You must be logged in to send messages.');
            return;
        }

        if (!message.trim() && !file && selectedFiles.length === 0) {
            return;
        }

        // Check connection status
        if (connectionStatus !== 'connected') {
            setError('Connection lost. Messages cannot be sent at this time.');
            return;
        }

        try {
            let attachments: string[] = [];

            // Upload the file if provided
            if (file) {
                attachments.push(await uploadFile(file));
            } else if (selectedFiles.length) {
                setSelectedFiles(prev => prev.map(f => ({ ...f, uploading: true, progress: 0 })));

                try {
                    const uploadPromises = selectedFiles.map(f => uploadFile(f.file));
                    attachments = await Promise.all(uploadPromises);
                } finally {
                    setSelectedFiles([]);
                }
            }

            // Send the message to the server
            const response = await axiosInstance.post<MessageCreatedResponse>(
                '/chat/messages',
                { message, attachments }
            );

            // Add the message to the UI
            if (response.data && response.data.data) {
                setMessages(prev => {
                    if (!prev.some(msg => msg.id === response.data.data.id)) {
                        return [...prev, response.data.data];
                    }
                    return prev;
                });
            }

            setError(null);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const msg = axiosErr.response?.data?.message || 'Failed to send message.';
            console.error('Error sending message:', err);
            setError(msg);
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
