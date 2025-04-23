import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { usePusher } from '@/hooks/usePusher';
import useUserStore from '@/store/userStore';
import type { ChatMessage } from '@/hooks/useChat';

// Interface for admin chat hook
interface AdminChatHook {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    connectionStatus: string;
    sendMessage: (message: string, customerId: string, file?: File) => Promise<void>;
    loadMoreMessages: (customerId: string) => Promise<void>;
    hasMoreMessages: boolean;
    uploadFile: (file: File) => Promise<string>;
    selectedFiles: SelectedFile[];
    addFile: (file: File) => void;
    removeFile: (index: number) => void;
    setActiveCustomer: (customerId: string) => void;
    activeCustomerId: string | null;
}

// File upload tracking
interface SelectedFile {
    file: File;
    preview?: string;
    uploading: boolean;
    progress: number;
    error?: string;
}

/**
 * Custom hook for admin chat functionality
 */
export function useAdminChat(): AdminChatHook {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);

    // Get admin user from store
    const user = useUserStore(state => state.user);

    // Use our Pusher hook that manages the connection
    const {
        connectionStatus,
        error: connectionError,
        subscribeToPrivateChannel
    } = usePusher();

    // Function to set active customer and load their messages
    const setActiveCustomer = useCallback(async (customerId: string) => {
        setActiveCustomerId(customerId);
        setMessages([]);
        setPage(1);
        setHasMoreMessages(true);

        try {
            setIsLoading(true);
            await fetchMessages(customerId, 1);
        } catch (error) {
            console.error("Error setting active customer:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Function to fetch chat messages for a specific customer
    const fetchMessages = useCallback(async (customerId: string, pageToFetch = 1, showLoading = true) => {
        if (!customerId) return;

        try {
            if (showLoading) setIsLoading(true);
            setError(null);

            const response = await axiosInstance.get(
                `/admin/chat/messages/${customerId}?page=${pageToFetch}`
            );

            if (response.data && Array.isArray(response.data.data)) {
                const incoming = response.data.data;

                if (pageToFetch === 1) {
                    setMessages(incoming);
                } else {
                    // Add new messages without duplicates
                    setMessages(prev => {
                        const existingIds = new Set(prev.map(msg => msg.id));
                        const newMessages = incoming.filter((msg: { id: string; }) => !existingIds.has(msg.id));
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
            const msg = 'Failed to load messages.';
            console.error('Error fetching messages:', err);
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

    // Setup channel subscription for admin chat messages
    useEffect(() => {
        if (connectionStatus === 'connected' && user && activeCustomerId) {
            // TypeScript interface for the message sent event
            interface MessageSentEvent {
                message: ChatMessage;
            }

            // TypeScript interface for the message read event
            interface MessageReadEvent {
                message_id: string;
            }

            // Subscribe to the admin's channel for the specific customer
            subscribeToPrivateChannel<MessageSentEvent>(
                `chat.admin.${user.id}.customer.${activeCustomerId}`,
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
                `chat.admin.${user.id}.customer.${activeCustomerId}`,
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

            // Fetch initial messages when connected and customer is selected
            fetchMessages(activeCustomerId).catch(err => {
                console.error('Error fetching initial messages:', err);
            });
        }
    }, [connectionStatus, user, activeCustomerId, subscribeToPrivateChannel, fetchMessages]);

    // Function to load more messages
    const loadMoreMessages = useCallback(async (customerId: string) => {
        if (!hasMoreMessages || isLoading || !customerId) return;

        // Make sure we're loading messages for the correct customer
        if (customerId !== activeCustomerId) {
            return;
        }

        await fetchMessages(customerId, page + 1, false);
    }, [hasMoreMessages, isLoading, page, fetchMessages, activeCustomerId]);

    // Function to upload a file
    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        if (!activeCustomerId) {
            throw new Error('No customer selected for file upload');
        }

        formData.append('customer_id', activeCustomerId);

        const idx = selectedFiles.findIndex(f => f.file === file);

        try {
            const response = await axiosInstance.post<{ url: string }>('/admin/chat/upload', formData, {
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
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to upload file.';
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
    const sendMessage = async (message: string, customerId: string, file?: File) => {
        if (!user) {
            setError('You must be logged in to send messages.');
            return;
        }

        // Ensure we have a customer ID
        if (!customerId) {
            setError('No customer selected to send message to.');
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
            const response = await axiosInstance.post('/admin/chat/messages', {
                message,
                attachments,
                customer_id: customerId
            });

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
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to send message.';
            console.error('Error sending message:', err);
            setError(msg);
            throw err;
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
        setActiveCustomer,
        activeCustomerId
    };
}
